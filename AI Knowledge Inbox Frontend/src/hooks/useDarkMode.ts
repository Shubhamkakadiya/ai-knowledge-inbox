import { useEffect, useState } from 'react'

function getInitial(): boolean {
  try {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
  } catch {
    // ignore storage access errors (private mode, etc.)
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch {
      // ignore storage access errors
    }
  }, [isDark])

  return { isDark, toggle: () => setIsDark(d => !d) }
}
