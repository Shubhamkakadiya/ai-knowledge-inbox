import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db.js'
import { logger } from '../logger.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { AppError } from '../middleware/errorHandler.js'
import { chunkText } from '../services/chunker.js'
import { embedTexts } from '../services/embeddings.js'
import { fetchUrlContent } from '../services/scraper.js'

const ingestSchema = z
  .object({
    type: z.enum(['note', 'url']),
    content: z.string().trim().min(1).optional(),
    url: z.string().trim().url().optional(),
    title: z.string().trim().min(1).max(200).optional(),
  })
  .refine(data => data.type !== 'note' || !!data.content, {
    message: 'content is required for note items',
    path: ['content'],
  })
  .refine(data => data.type !== 'url' || !!data.url, {
    message: 'url is required for url items',
    path: ['url'],
  })

export const ingestRouter = Router()

ingestRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = ingestSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.issues[0].message)
    }

    const { type, content, url, title } = parsed.data

    let rawContent: string
    let resolvedTitle: string
    let sourceUrl: string | null = null

    if (type === 'url') {
      const page = await fetchUrlContent(url!)
      rawContent = page.text
      resolvedTitle = title ?? page.title
      sourceUrl = url!
    } else {
      rawContent = content!
      resolvedTitle = title ?? content!.slice(0, 60)
    }

    const itemId = randomUUID()
    const createdAt = new Date().toISOString()

    db.prepare(
      `INSERT INTO items (id, type, title, source_url, raw_content, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'processing', ?)`
    ).run(itemId, type, resolvedTitle, sourceUrl, rawContent, createdAt)

    // respond right away — chunking + embedding happens after the response
    // so the client isn't stuck waiting on the model for a slow page
    res.status(202).json({
      item: {
        id: itemId,
        type,
        title: resolvedTitle,
        sourceUrl,
        status: 'processing',
        createdAt,
      },
    })

    void indexItem(itemId, rawContent)
  })
)

async function indexItem(itemId: string, rawContent: string) {
  try {
    const chunks = chunkText(rawContent)

    if (chunks.length === 0) {
      db.prepare("UPDATE items SET status = 'failed', error_message = ? WHERE id = ?").run(
        'No content to index',
        itemId
      )
      return
    }

    const embeddings = await embedTexts(chunks)
    const createdAt = new Date().toISOString()

    const insertChunk = db.prepare(
      `INSERT INTO chunks (id, item_id, chunk_index, text, embedding, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )

    const insertAll = db.transaction((rows: string[]) => {
      rows.forEach((chunk, index) => {
        insertChunk.run(randomUUID(), itemId, index, chunk, JSON.stringify(embeddings[index]), createdAt)
      })
    })
    insertAll(chunks)

    db.prepare("UPDATE items SET status = 'ready' WHERE id = ?").run(itemId)
    logger.info('item indexed', { itemId, chunkCount: chunks.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown indexing error'
    db.prepare("UPDATE items SET status = 'failed', error_message = ? WHERE id = ?").run(message, itemId)
    logger.error('item indexing failed', { itemId, message })
  }
}
