const MAX_CHUNK_CHARS = 800
const OVERLAP_CHARS = 120


export function chunkText(rawText: string): string[] {
  const text = rawText.trim()
  if (!text) return []

  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const chunks: string[] = []
  let buffer = ''

  const flush = () => {
    if (buffer.trim()) chunks.push(buffer.trim())
    buffer = ''
  }

  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph

    if (candidate.length <= MAX_CHUNK_CHARS) {
      buffer = candidate
      continue
    }

    flush()

    if (paragraph.length <= MAX_CHUNK_CHARS) {
      buffer = paragraph
    } else {
      chunks.push(...splitBySentence(paragraph))
    }
  }

  flush()

  return addOverlap(chunks)
}

function splitBySentence(paragraph: string): string[] {
  const sentences = paragraph.match(/[^.!?]+[.!?]*\s*/g) ?? [paragraph]
  const pieces: string[] = []
  let buffer = ''

  for (const sentence of sentences) {
    const candidate = buffer + sentence

    if (candidate.length <= MAX_CHUNK_CHARS) {
      buffer = candidate
      continue
    }

    if (buffer.trim()) pieces.push(buffer.trim())
    buffer = sentence.length > MAX_CHUNK_CHARS ? sentence.slice(0, MAX_CHUNK_CHARS) : sentence
  }

  if (buffer.trim()) pieces.push(buffer.trim())
  return pieces
}

function addOverlap(chunks: string[]): string[] {
  if (chunks.length <= 1) return chunks

  return chunks.map((chunk, i) => {
    if (i === 0) return chunk
    const tail = chunks[i - 1].slice(-OVERLAP_CHARS)
    return `${tail}\n\n${chunk}`
  })
}
