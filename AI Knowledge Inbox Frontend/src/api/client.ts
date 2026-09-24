import type { GetItemsResponse, IngestPayload, IngestResponse, QueryResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message = body?.error?.message ?? `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return body as T
}

export const api = {
  getItems: () => request<GetItemsResponse>('/items'),

  ingestItem: (payload: IngestPayload) =>
    request<IngestResponse>('/ingest', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  askQuestion: (question: string) =>
    request<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),

  deleteItem: (id: string) =>
    request<void>(`/items/${id}`, {
      method: 'DELETE',
    }),
}
