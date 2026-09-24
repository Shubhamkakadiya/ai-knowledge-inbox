import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAskQuestion } from '../hooks/useAskQuestion'
import { useCyclingLabel } from '../hooks/useCyclingLabel'
import { AnswerCard } from './AnswerCard'
import { Spotlight } from './Spotlight'

const THINKING_LABELS = [
  'Thinking',
  'Reading your notes',
  'Searching the inbox',
  'Weighing sources',
  'Connecting the dots',
  'Deliberating',
  'Mulling it over',
  'Sussing it out',
  'Incubating an answer',
  'Drafting a reply',
  'Cross-checking chunks',
  'Ranking matches',
  'Piecing it together',
  'Double-checking',
  'Almost there',
] as const

const SUGGESTED_PROMPTS = ['Summarize my notes', 'What are the key points?', 'Find action items'] as const

export function QueryPanel() {
  const [question, setQuestion] = useState('')
  const { ask, result, isAsking, error } = useAskQuestion()
  const thinkingLabel = useCyclingLabel(THINKING_LABELS, isAsking)

  const submit = (q: string) => {
    if (!q.trim() || isAsking) return
    ask(q.trim())
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit(question)
  }

  const handlePrompt = (prompt: string) => {
    setQuestion(prompt)
    submit(prompt)
  }

  return (
    <div className="space-y-4">
      <Spotlight className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-card backdrop-blur-sm transition focus-within:border-indigo-300 focus-within:shadow-card-hover hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/80 dark:focus-within:border-indigo-500/40">
        <form onSubmit={handleSubmit} className="flex gap-2 p-2">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask something about your saved content..."
            disabled={isAsking}
            className="flex-1 rounded-xl bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="flex w-28 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
          >
            {isAsking ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Asking
              </>
            ) : (
              'Ask'
            )}
          </button>
        </form>
      </Spotlight>

      {!result && !isAsking && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map(prompt => (
            <button
              key={prompt}
              type="button"
              onClick={() => handlePrompt(prompt)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {isAsking && (
        <div className="relative flex items-center gap-2.5 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3.5 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-violet-500/10 dark:text-indigo-300">
          <span className="animate-shimmer-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
          </span>
          <span key={thinkingLabel} className="animate-[fadeIn_0.3s_ease-out] font-medium">
            {thinkingLabel}&hellip;
          </span>
        </div>
      )}

      {error && (
        <p className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      {!result && !error && !isAsking && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-400 dark:from-indigo-500/10 dark:to-violet-500/10">
            <SparkleIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ask anything about what you&apos;ve saved</p>
            <p className="mt-0.5 text-xs text-slate-400">Answers cite the source they came from.</p>
          </div>
        </div>
      )}

      {result && !isAsking && <AnswerCard result={result} />}
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 3.5c.4 2.6 1.1 4.4 2.2 5.5 1.1 1.1 2.9 1.8 5.3 2.2-2.4.4-4.2 1.1-5.3 2.2-1.1 1.1-1.8 2.9-2.2 5.4-.4-2.5-1.1-4.3-2.2-5.4-1.1-1.1-2.9-1.8-5.3-2.2 2.4-.4 4.2-1.1 5.3-2.2 1.1-1.1 1.8-2.9 2.2-5.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}
