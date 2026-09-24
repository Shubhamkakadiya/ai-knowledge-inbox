import { useEffect, useMemo, useRef, useState } from 'react'
import { AddItemForm } from './components/AddItemForm'
import { GreetingBanner } from './components/GreetingBanner'
import { ItemList } from './components/ItemList'
import { QueryPanel } from './components/QueryPanel'
import { Sidebar } from './components/Sidebar'
import type { View } from './components/Sidebar'
import { StatCards } from './components/StatCards'
import { Topbar } from './components/Topbar'
import { useDarkMode } from './hooks/useDarkMode'
import { useItems } from './hooks/useItems'
import { api } from './api/client'
import type { IngestPayload } from './types'

function App() {
  const { items, isLoading, refresh, remove } = useItems()
  const { isDark, toggle: toggleDark } = useDarkMode()
  const [view, setView] = useState<View>('home')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleAddItem = async (payload: IngestPayload) => {
    await api.ingestItem(payload)
    await refresh()
  }

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(item => item.title.toLowerCase().includes(q) || item.sourceUrl?.toLowerCase().includes(q))
  }, [items, search])

  const processingCount = items.filter(item => item.status === 'processing').length

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <BackgroundDecor />

      <Topbar
        ref={searchRef}
        search={search}
        onSearchChange={setSearch}
        isDark={isDark}
        onToggleDark={toggleDark}
        processingCount={processingCount}
        onProcessingClick={() => setView('items')}
        onMenuClick={() => setSidebarOpen(o => !o)}
      />

      <div className="flex">
        <Sidebar
          view={view}
          onNavigate={setView}
          itemCount={items.length}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <main className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {view === 'home' && (
              <div className="space-y-6">
                <GreetingBanner />
                <StatCards items={items} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <section className="animate-fade-in-up space-y-4" style={{ animationDelay: '80ms' }}>
                    <SectionHeading title="Saved items" count={items.length} />
                    <AddItemForm onSubmit={handleAddItem} />
                    <ItemList items={items.slice(0, 5)} isLoading={isLoading} onDelete={remove} />
                    {items.length > 5 && (
                      <button
                        type="button"
                        onClick={() => setView('items')}
                        className="w-full rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
                      >
                        View all {items.length} items &rarr;
                      </button>
                    )}
                  </section>

                  <section className="animate-fade-in-up space-y-4" style={{ animationDelay: '160ms' }}>
                    <SectionHeading title="Ask a question" />
                    <QueryPanel />
                  </section>
                </div>
              </div>
            )}

            {view === 'items' && (
              <div className="animate-fade-in-up space-y-4">
                <SectionHeading title="All items" count={filteredItems.length} />
                <ItemList items={filteredItems} isLoading={isLoading} onDelete={remove} hasSearch={search.trim().length > 0} />
              </div>
            )}

            {view === 'ask' && (
              <div className="animate-fade-in-up mx-auto max-w-2xl space-y-4">
                <SectionHeading title="Ask a question" />
                <QueryPanel />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <h2 className="text-[0.95rem] font-bold tracking-tight text-slate-800 dark:text-slate-200">{title}</h2>
      {typeof count === 'number' && count > 0 && (
        <span
          key={count}
          className="animate-fade-in-up rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400"
        >
          {count}
        </span>
      )}
    </div>
  )
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate bg-[size:36px_36px] opacity-100 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black_35%,transparent_100%)] dark:opacity-30" />
      <div className="animate-float-slow absolute -top-32 -left-24 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-500/10" />
      <div className="animate-float-slow-reverse absolute -top-20 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-500/10" />
      <div
        className="animate-float-slow absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/5"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="animate-float-slow-reverse absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-fuchsia-200/25 blur-3xl dark:bg-fuchsia-500/5"
        style={{ animationDelay: '-3s' }}
      />
      <div className="bg-noise absolute inset-0 opacity-[0.02]" />
    </div>
  )
}

export default App
