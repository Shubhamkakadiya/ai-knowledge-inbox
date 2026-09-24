import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { IngestPayload, ItemType } from '../types'
import { CheckIcon, LinkIcon, NoteIcon } from './icons'
import { Spotlight } from './Spotlight'

interface Props {
  onSubmit: (payload: IngestPayload) => Promise<void>
}

export function AddItemForm({ onSubmit }: Props) {
  const [type, setType] = useState<ItemType>('note')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState(false)

  const resetFields = () => {
    setTitle('')
    setContent('')
    setUrl('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const payload: IngestPayload =
        type === 'note'
          ? { type: 'note', content, title: title || undefined }
          : { type: 'url', url, title: title || undefined }

      await onSubmit(payload)
      resetFields()
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1600)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Spotlight className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-card backdrop-blur-sm transition hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/80">
      <form onSubmit={handleSubmit} className="space-y-3.5 p-5">
        <div className="relative flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <div
            className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-slate-700"
            style={{ transform: type === 'url' ? 'translateX(calc(100% + 0.5rem))' : 'translateX(0)' }}
          />
          <TabButton active={type === 'note'} onClick={() => setType('note')}>
            <NoteIcon /> Note
          </TabButton>
          <TabButton active={type === 'url'} onClick={() => setType('url')}>
            <LinkIcon /> URL
          </TabButton>
        </div>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
        />

        <div key={type} className="animate-fade-in-up">
          {type === 'note' ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste or write a note..."
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
            />
          ) : (
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
            />
          )}
        </div>

        {error && (
          <p className="animate-fade-in-up rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
            justAdded ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110'
          }`}
        >
          {isSubmitting && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {justAdded ? (
            <span className="flex items-center gap-1.5 animate-fade-in-up">
              <CheckIcon /> Added
            </span>
          ) : isSubmitting ? (
            'Adding...'
          ) : (
            'Add to inbox'
          )}
        </button>
      </form>
    </Spotlight>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-300 ${
        active ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

