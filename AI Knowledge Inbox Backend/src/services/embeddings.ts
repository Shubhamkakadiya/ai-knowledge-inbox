import { config } from '../config.js'
import { AppError } from '../middleware/errorHandler.js'

interface OllamaEmbedResponse {
  embeddings: number[][]
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []

  let response: Response
  try {
    response = await fetch(`${config.ollamaBaseUrl}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: config.embedModel, input: texts }),
    })
  } catch {
    throw new AppError(502, `Could not reach Ollama at ${config.ollamaBaseUrl}. Is it running?`)
  }

  if (!response.ok) {
    const detail = await response.text()
    throw new AppError(502, `Ollama embedding request failed: ${detail}`)
  }

  const data = (await response.json()) as OllamaEmbedResponse
  return data.embeddings
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text])
  return embedding
}
