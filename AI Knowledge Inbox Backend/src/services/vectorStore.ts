import { db } from '../db.js'

interface ChunkRow {
  id: string
  item_id: string
  chunk_index: number
  text: string
  embedding: string
}

export interface ScoredChunk {
  itemId: string
  chunkIndex: number
  text: string
  score: number
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Brute-force scan over every chunk. Fine up to a few thousand chunks on a
// single-user app — see README for what changes at real scale.
export function searchSimilarChunks(queryEmbedding: number[], topK: number): ScoredChunk[] {
  const rows = db.prepare('SELECT id, item_id, chunk_index, text, embedding FROM chunks').all() as ChunkRow[]

  const scored = rows.map(row => ({
    itemId: row.item_id,
    chunkIndex: row.chunk_index,
    text: row.text,
    score: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding) as number[]),
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topK)
}
