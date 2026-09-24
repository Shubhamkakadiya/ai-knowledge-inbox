function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function GreetingBanner() {
  return (
    <div className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-card dark:border-slate-800 dark:from-indigo-500/10 dark:via-slate-900 dark:to-violet-500/10">
      <div className="relative z-10 max-w-md">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {getGreeting()}
          <span className="ml-2 inline-block animate-[fadeIn_0.6s_ease-out]">&#128075;</span>
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Save, organize, and get answers from your knowledge using local AI.
        </p>
      </div>

      <FloatingCards />
    </div>
  )
}

function FloatingCards() {
  return (
    <div className="pointer-events-none absolute -right-6 -top-4 hidden h-full w-56 sm:block" aria-hidden="true">
      <div className="animate-float-slow absolute right-16 top-6 h-16 w-24 rounded-xl border border-white/60 bg-white/80 shadow-card backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
        <div className="m-2.5 h-1.5 w-3/5 rounded-full bg-indigo-200 dark:bg-indigo-500/40" />
        <div className="mx-2.5 mt-2 h-1.5 w-2/5 rounded-full bg-slate-200 dark:bg-slate-600" />
      </div>
      <div
        className="animate-float-slow-reverse absolute right-2 top-20 h-16 w-24 rounded-xl border border-white/60 bg-white/80 shadow-card backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80"
        style={{ animationDelay: '-2s' }}
      >
        <div className="m-2.5 h-1.5 w-2/5 rounded-full bg-violet-200 dark:bg-violet-500/40" />
        <div className="mx-2.5 mt-2 h-1.5 w-3/5 rounded-full bg-slate-200 dark:bg-slate-600" />
      </div>
      <div className="animate-float-slow absolute right-24 top-32 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-glow">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 3.5c.4 2.6 1.1 4.4 2.2 5.5 1.1 1.1 2.9 1.8 5.3 2.2-2.4.4-4.2 1.1-5.3 2.2-1.1 1.1-1.8 2.9-2.2 5.4-.4-2.5-1.1-4.3-2.2-5.4-1.1-1.1-2.9-1.8-5.3-2.2 2.4-.4 4.2-1.1 5.3-2.2 1.1-1.1 1.8-2.9 2.2-5.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
