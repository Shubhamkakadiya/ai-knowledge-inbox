import { config } from '../config.js'
import { AppError } from '../middleware/errorHandler.js'

interface ContextChunk {
  index: number
  itemTitle: string
  text: string
}

interface OllamaChatResponse {
  message: { content: string }
}

const SYSTEM_PROMPT = [
  'You answer questions using only the context passed to you below.',
  'Cite the sources you used inline with their bracket number, e.g. [1].',
  "If the context doesn't contain the answer, say you don't have enough information — don't make one up.",
].join(' ')

export async function answerQuestion(question: string, chunks: ContextChunk[]): Promise<string> {
  const context = chunks.map(c => `[${c.index}] Source: ${c.itemTitle}\n${c.text}`).join('\n\n')

  let response: Response
  try {
    response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.chatModel,
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` },
        ],
      }),
    })
  } catch {
    throw new AppError(502, `Could not reach Ollama at ${config.ollamaBaseUrl}. Is it running?`)
  }

  if (!response.ok) {
    const detail = await response.text()
    throw new AppError(502, `Ollama chat request failed: ${detail}`)
  }

  const data = (await response.json()) as OllamaChatResponse
  return data.message.content
}
