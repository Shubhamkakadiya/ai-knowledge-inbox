import type { QueryResponse } from '../types'
import { Spotlight } from './Spotlight'

export function AnswerCard({ result }: { result: QueryResponse }) {
  return (
    <Spotlight className="animate-fade-in-up space-y-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex gap-3">
        <div className="mt-0.5 h-full w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
        <p className="whitespace-pre-wrap text-[0.925rem] leading-relaxed text-slate-800 dark:text-slate-200">{result.answer}</p>
      </div>

      {result.sources.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Sources</p>
          {result.sources.map((source, i) => (
            <div
              key={`${source.itemId}-${i}`}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-fade-in-up rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs transition hover:border-indigo-100 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="truncate">{source.title}</span>
                </span>
                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-medium text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">
                  {Math.round(source.score * 100)}% match
                </span>
              </div>
              <p className="mt-1.5 leading-relaxed text-slate-500 dark:text-slate-400">{source.snippet}&hellip;</p>
            </div>
          ))}
        </div>
      )}
    </Spotlight>
  )
}
