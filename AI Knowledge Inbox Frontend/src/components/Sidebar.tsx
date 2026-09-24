export type View = 'home' | 'items' | 'ask'

interface Props {
  view: View
  onNavigate: (view: View) => void
  itemCount: number
  open: boolean
  onClose: () => void
}

const NAV_ITEMS: { key: View; label: string; icon: (props: { className?: string }) => JSX.Element }[] = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'items', label: 'All Items', icon: ListIcon },
  { key: 'ask', label: 'Ask AI', icon: ChatIcon },
]

export function Sidebar({ view, onNavigate, itemCount, open, onClose }: Props) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-slate-200/70 bg-white/90 pt-4 backdrop-blur-md transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900/90 md:static md:z-auto md:h-auto md:translate-x-0 md:bg-white/70 md:backdrop-blur-none md:transition-none dark:md:bg-slate-900/50 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = view === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onNavigate(key)
                  onClose()
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-200/70 p-4 dark:border-slate-800">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-3.5 dark:from-indigo-500/10 dark:to-violet-500/10">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{itemCount}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {itemCount === 1 ? 'item saved' : 'items saved'}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 9.5 10 4l6.5 5.5M5 8.5V16h10V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 5.5h12M4 10h12M4 14.5h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 10c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6-2.9 6-6.5 6c-.8 0-1.6-.1-2.3-.4L4 16.5l1-3.1C4 12.4 3.5 11.2 3.5 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
