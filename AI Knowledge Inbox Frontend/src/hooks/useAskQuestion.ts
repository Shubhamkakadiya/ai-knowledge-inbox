import { useState } from 'react'
import { api } from '../api/client'
import type { QueryResponse } from '../types'

export function useAskQuestion() {
  const [result, setResult] = useState<QueryResponse | null>(null)
  const [isAsking, setIsAsking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ask = async (question: string) => {
    setIsAsking(true)
    setError(null)

    try {
      const data = await api.askQuestion(question)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get an answer')
      setResult(null)
    } finally {
      setIsAsking(false)
    }
  }

  return { ask, result, isAsking, error }
}
