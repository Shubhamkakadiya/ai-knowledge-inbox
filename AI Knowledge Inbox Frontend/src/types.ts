export type ItemType = 'note' | 'url'
export type ItemStatus = 'processing' | 'ready' | 'failed'

export interface Item {
  id: string
  type: ItemType
  title: string
  sourceUrl: string | null
  status: ItemStatus
  errorMessage: string | null
  createdAt: string
  chunkCount: number
}

export interface GetItemsResponse {
  items: Item[]
  count: number
}

export interface IngestNotePayload {
  type: 'note'
  content: string
  title?: string
}

export interface IngestUrlPayload {
  type: 'url'
  url: string
  title?: string
}

export type IngestPayload = IngestNotePayload | IngestUrlPayload

export interface IngestResponse {
  item: Item
}

export interface Source {
  itemId: string
  title: string
  sourceUrl: string | null
  snippet: string
  score: number
}

export interface QueryResponse {
  answer: string
  sources: Source[]
}
