import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT ?? 4000),
  dbPath: process.env.DB_PATH ?? './data/inbox.db',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
  embedModel: process.env.OLLAMA_EMBED_MODEL ?? 'nomic-embed-text',
  chatModel: process.env.OLLAMA_CHAT_MODEL ?? 'llama3.1:8b',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
}
