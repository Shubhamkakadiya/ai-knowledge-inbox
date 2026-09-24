import { useEffect, useRef, useState } from 'react'

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function useCyclingLabel(labels: readonly string[], active: boolean, intervalMs = 850) {
  const [index, setIndex] = useState(0)
  const order = useRef<string[]>(shuffle(labels))

  useEffect(() => {
    if (!active) {
      setIndex(0)
      return
    }

    // fresh, reshuffled order each time it kicks off, so it doesn't feel
    // like the same script playing back on every question
    order.current = shuffle(labels)
    setIndex(0)

    const id = setInterval(() => {
      setIndex(i => (i + 1) % order.current.length)
    }, intervalMs)

    return () => clearInterval(id)
  }, [active, labels, intervalMs])

  return order.current[index] ?? labels[0]
}
