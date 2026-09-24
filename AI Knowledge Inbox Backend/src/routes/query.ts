import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { AppError } from '../middleware/errorHandler.js'
import { embedText } from '../services/embeddings.js'
import { answerQuestion } from '../services/llm.js'
import { searchSimilarChunks } from '../services/vectorStore.js'

const querySchema = z.object({
  question: z.string().trim().min(1, 'question cannot be empty').max(1000),
  topK: z.number().int().min(1).max(20).optional(),
})

interface ItemLookupRow {
  id: string
  title: string
  source_url: string | null
}

export const queryRouter = Router()

queryRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = querySchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, parsed.error.issues[0].message)
    }

    const { question, topK = 5 } = parsed.data

    const readyCount = db.prepare("SELECT COUNT(*) AS count FROM items WHERE status = 'ready'").get() as {
      count: number
    }
    if (readyCount.count === 0) {
      throw new AppError(422, 'No indexed content yet — add a note or URL first')
    }

    const questionEmbedding = await embedText(question)
    const matches = searchSimilarChunks(questionEmbedding, topK)

    if (matches.length === 0) {
      res.json({ answer: "I don't have any indexed content to answer that yet.", sources: [] })
      return
    }

    const getItem = db.prepare('SELECT id, title, source_url FROM items WHERE id = ?')
    const enriched = matches.map((match, i) => {
      const item = getItem.get(match.itemId) as ItemLookupRow
      return { ...match, index: i + 1, itemTitle: item.title, sourceUrl: item.source_url }
    })

    const answer = await answerQuestion(
      question,
      enriched.map(e => ({ index: e.index, itemTitle: e.itemTitle, text: e.text }))
    )

    res.json({
      answer,
      sources: enriched.map(e => ({
        itemId: e.itemId,
        title: e.itemTitle,
        sourceUrl: e.sourceUrl,
        snippet: e.text.slice(0, 240),
        score: Number(e.score.toFixed(3)),
      })),
    })
  })
)
