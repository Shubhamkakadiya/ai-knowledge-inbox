import { useEffect, useState } from 'react'
import type { Item } from '../types'
import { LinkIcon, NoteIcon } from './icons'
import { Spotlight } from './Spotlight'
import { StatusBadge } from './StatusBadge'

interface Props {
  items: Item[]
  isLoading: boolean
  onDelete: (id: string) => Promise<void>
  hasSearch?: boolean
}

export function ItemList({ items, isLoading, onDelete, hasSearch = false }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="animate-pulse rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-2.5 w-2/5 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="animate-fade-in-up flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-400 dark:from-indigo-500/10 dark:to-violet-500/10 dark:text-indigo-400">
          <InboxIcon />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {hasSearch ? 'No matching items' : 'Nothing saved yet'}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {hasSearch ? 'Try a different search term.' : 'Add a note or URL above to get started.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <ItemRow key={item.id} item={item} index={i} onDelete={onDelete} />
      ))}
    </ul>
  )
}

function ItemRow({ item, index, onDelete }: { item: Item; index: number; onDelete: (id: string) => Promise<void> }) {
  const [confirming, setConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!confirming) return
    const timer = setTimeout(() => setConfirming(false), 3000)
    return () => clearTimeout(timer)
  }, [confirming])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await onDelete(item.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      setIsDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <Spotlight
      as="li"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-card backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            item.type === 'url'
              ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400'
              : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'
          }`}
        >
          {item.type === 'url' ? <LinkIcon /> : <NoteIcon />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-xs text-indigo-600 hover:underline"
                >
                  {item.sourceUrl}
                </a>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <StatusBadge status={item.status} />

              {confirming ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting && (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {isDeleting ? 'Removing' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={isDeleting}
                    className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  aria-label="Delete item"
                  title="Delete item"
                  className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {item.type}
            </span>
            <span>{item.chunkCount} chunks</span>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
          </div>

          {item.status === 'failed' && item.errorMessage && (
            <p className="mt-2 rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">{item.errorMessage}</p>
          )}

          {error && <p className="mt-2 rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}
        </div>
      </div>
    </Spotlight>
  )
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M4 12.5V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6.5M4 12.5l2.2 5.7a1 1 0 0 0 .93.8h9.74a1 1 0 0 0 .93-.8l2.2-5.7M4 12.5h4.8a1 1 0 0 1 .95.68l.5 1.5a1 1 0 0 0 .95.68h1.6a1 1 0 0 0 .95-.68l.5-1.5a1 1 0 0 1 .95-.68H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4.5 6h11M8.25 6V4.5a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1V6M8 9v5M12 9v5M5.5 6l.6 8.4a1 1 0 0 0 1 .93h5.8a1 1 0 0 0 1-.93l.6-8.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
