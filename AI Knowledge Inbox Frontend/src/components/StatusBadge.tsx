import type { ItemStatus } from '../types'

const STYLES: Record<ItemStatus, string> = {
  processing: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  ready: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  failed: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
}

const DOT_STYLES: Record<ItemStatus, string> = {
  processing: 'bg-amber-500',
  ready: 'bg-emerald-500',
  failed: 'bg-red-500',
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      <span className="relative flex h-1.5 w-1.5">
        {status === 'processing' && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${DOT_STYLES[status]}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`} />
      </span>
      {status}
    </span>
  )
}
