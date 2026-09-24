import { Router } from 'express'
import { db } from '../db.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { AppError } from '../middleware/errorHandler.js'

interface ItemRow {
  id: string
  type: string
  title: string
  source_url: string | null
  status: string
  error_message: string | null
  created_at: string
  chunk_count: number
}

export const itemsRouter = Router()

itemsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = db
      .prepare(
        `SELECT items.id, items.type, items.title, items.source_url, items.status,
                items.error_message, items.created_at, COUNT(chunks.id) AS chunk_count
         FROM items
         LEFT JOIN chunks ON chunks.item_id = items.id
         GROUP BY items.id
         ORDER BY items.created_at DESC`
      )
      .all() as ItemRow[]

    res.json({
      items: rows.map(row => ({
        id: row.id,
        type: row.type,
        title: row.title,
        sourceUrl: row.source_url,
        status: row.status,
        errorMessage: row.error_message,
        createdAt: row.created_at,
        chunkCount: row.chunk_count,
      })),
      count: rows.length,
    })
  })
)

itemsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)

    if (result.changes === 0) {
      throw new AppError(404, 'Item not found')
    }

    res.status(204).send()
  })
)
