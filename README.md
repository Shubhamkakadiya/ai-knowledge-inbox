# AI Knowledge Inbox

Save notes and URLs, then ask questions over them. Answers come from a small
RAG pipeline running entirely on local models via [Ollama](https://ollama.com) —
no API keys, no cloud calls.

## Stack

- **Backend** — Node, Express, TypeScript, SQLite (`better-sqlite3`)
- **Frontend** — React, TypeScript, Vite, Tailwind
- **AI** — Ollama, `nomic-embed-text` for embeddings, `llama3.1:8b` for answers

## Running it

You need [Ollama](https://ollama.com) installed and running, with both models
pulled:

```
ollama pull nomic-embed-text
ollama pull llama3.1:8b
```

Then, in two terminals:

```
cd "AI Knowledge Inbox Backend"
cp .env.example .env
npm install
npm run dev        # http://localhost:4000
```

```
cd "AI Knowledge Inbox Frontend"
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

## API

| Method | Path      | Purpose                                      |
|--------|-----------|-----------------------------------------------|
| POST   | `/ingest` | Add a note or a URL (fetched server-side)     |
| GET    | `/items`  | List everything saved, with indexing status   |
| POST   | `/query`  | Ask a question, get an answer + cited sources |

`POST /ingest` returns `202 Accepted` immediately with `status: "processing"` —
chunking and embedding happen in the background so a slow page fetch doesn't
block the request. The frontend polls `GET /items` while anything is still
processing. `POST /query` returns `422` if nothing has finished indexing yet,
`502` if Ollama itself is unreachable, and `400` on invalid input (validated
with Zod).

## How the RAG pipeline works

1. **Ingest** — a note is stored as-is; a URL is fetched and stripped down to
   body text with Cheerio (scripts, nav, footer removed).
2. **Chunk** — text is split on paragraph boundaries into ~800 character
   pieces (falling back to sentence splitting for oversized paragraphs), with
   a small overlap carried between adjacent chunks so an idea that spans a
   boundary isn't lost to either side. See `services/chunker.ts`.
3. **Embed** — each chunk is embedded with `nomic-embed-text` and stored in
   SQLite as a JSON array alongside the chunk text.
4. **Query** — the question is embedded the same way, compared against every
   stored chunk with cosine similarity, and the top matches are passed to
   `llama3.1` as context. The model is instructed to cite sources by bracket
   number and to say when it doesn't know.

## Tradeoffs and what I'd change for production

**Chunking.** Paragraph-first, fixed max size, small overlap. It's simple
and works fine for notes and articles. It doesn't understand semantic
structure (headings, tables, code blocks) — a production version would use a
structure-aware splitter (e.g. markdown/HTML-aware chunking) and probably a
larger model-specific token counter instead of raw character count.

**Vector store.** Chunk embeddings live in SQLite as JSON text; search is a
brute-force cosine similarity scan over every chunk in `vectorStore.ts`. This
is intentional for a single-user app with a small number of documents — it's
transparent, needs zero extra infrastructure, and is fast enough up to a few
thousand chunks. It stops being fast well before that: the scan is O(n) per
query and holds the whole embedding table in memory. A production system
would move to a real vector index (pgvector, sqlite-vec, or a managed store
like Pinecone/Qdrant) with an ANN index once the corpus grows past what fits
comfortably in memory.

**Async ingestion.** Indexing runs as a fire-and-forget task after the
response is sent, with status tracked on the item row (`processing` →
`ready`/`failed`). That's enough to demonstrate the async boundary without
pulling in a queue. At real scale this becomes a proper job queue (BullMQ,
SQS, etc.) so ingestion survives a server restart and can be retried,
rate-limited, and scaled independently of the API.

**What else breaks at scale:** single SQLite file means one writer at a time
— fine for one user, not for concurrent multi-user traffic. No auth, since
none was required, but a real product needs per-user data isolation before
any of this becomes multi-tenant. URL fetching has no timeout/size ceiling
beyond a character cap — a production ingester needs a fetch timeout, a
robots.txt check, and protection against fetching internal/private
addresses (SSRF).

## Debuggability

- Every request is logged as one JSON line (`logger.ts`) with method, path,
  and outcome — easy to grep or forward to a log pipeline later.
- Errors carry HTTP-appropriate status codes via a single `AppError` class
  and one `errorHandler` middleware, so every route fails the same way:
  `{ error: { message } }`.
- Ollama being down, a bad URL, or empty input all fail with a specific
  status code and message instead of a generic 500.
