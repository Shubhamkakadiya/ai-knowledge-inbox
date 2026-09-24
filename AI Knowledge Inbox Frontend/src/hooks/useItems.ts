import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import type { Item } from '../types'

const POLL_INTERVAL_MS = 2500

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollId = useRef<number | null>(null)

  const refresh = useCallback(async () => {
    try {
      const data = await api.getItems()
      setItems(data.items)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // keep polling while something is still being indexed in the background
  useEffect(() => {
    const stillProcessing = items.some(item => item.status === 'processing')
    if (!stillProcessing) return

    pollId.current = window.setInterval(refresh, POLL_INTERVAL_MS)
    return () => {
      if (pollId.current) window.clearInterval(pollId.current)
    }
  }, [items, refresh])

  const remove = useCallback(
    async (id: string) => {
      await api.deleteItem(id)
      await refresh()
    },
    [refresh]
  )

  return { items, isLoading, error, refresh, remove }
}
