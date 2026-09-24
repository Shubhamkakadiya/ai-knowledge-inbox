import type { Item } from '../types'
import { CheckIcon, LinkIcon, NoteIcon } from './icons'
import { Spotlight } from './Spotlight'

export function StatCards({ items }: { items: Item[] }) {
  const notes = items.filter(i => i.type === 'note').length
  const links = items.filter(i => i.type === 'url').length
  const ready = items.filter(i => i.status === 'ready').length

  const stats = [
    { label: 'All items', value: items.length, icon: <InboxIcon />, tint: 'from-indigo-50 to-indigo-100/60 text-indigo-600 dark:from-indigo-500/10 dark:to-indigo-500/5 dark:text-indigo-400' },
    { label: 'Notes', value: notes, icon: <NoteIcon />, tint: 'from-violet-50 to-violet-100/60 text-violet-600 dark:from-violet-500/10 dark:to-violet-500/5 dark:text-violet-400' },
    { label: 'Links', value: links, icon: <LinkIcon />, tint: 'from-sky-50 to-sky-100/60 text-sky-600 dark:from-sky-500/10 dark:to-sky-500/5 dark:text-sky-400' },
    { label: 'Indexed', value: ready, icon: <CheckIcon />, tint: 'from-emerald-50 to-emerald-100/60 text-emerald-600 dark:from-emerald-500/10 dark:to-emerald-500/5 dark:text-emerald-400' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s, i) => (
        <Spotlight
          key={s.label}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-card backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${s.tint}`}>
            {s.icon}
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{s.value}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
        </Spotlight>
      ))}
    </div>
  )
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M3.5 10.5V5.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v5M3.5 10.5l1.8 4.3a1 1 0 0 0 .93.7h7.5a1 1 0 0 0 .93-.7l1.8-4.3M3.5 10.5h3.7a1 1 0 0 1 .95.68l.2.6a1 1 0 0 0 .95.68h1.4a1 1 0 0 0 .95-.68l.2-.6a1 1 0 0 1 .95-.68h3.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

