import { Archive, CheckCircle2, Clock3 } from 'lucide-react'
import { cn } from '~/lib/utils'

interface DocumentWorkflowMetaProps {
  status: 'draft' | 'published' | 'archived'
  lastSavedAt?: string | null
  version?: number
  templateKey?: string | null
  variant?: 'default' | 'kawaii'
}

export default function DocumentWorkflowMeta({
  status,
  lastSavedAt,
  version,
  templateKey,
  variant = 'default',
}: DocumentWorkflowMetaProps) {
  const label = status === 'published' ? 'Published' : status === 'archived' ? 'Archived' : 'Draft'
  const Icon = status === 'published' ? CheckCircle2 : status === 'archived' ? Archive : Clock3
  const isKawaii = variant === 'kawaii'

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        isKawaii
          ? 'card-kawaii p-3 text-sm font-medium text-neutral-700 dark:text-neutral-200'
          : 'text-xs text-neutral-500 dark:text-neutral-400'
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-1',
          isKawaii
            ? 'border-2 border-black bg-emerald-100 font-bold text-emerald-950 dark:border-white dark:bg-emerald-900/60 dark:text-emerald-100'
            : 'bg-neutral-100 dark:bg-neutral-800'
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {templateKey && (
        <span
          className={cn(
            'rounded-full px-2 py-1',
            isKawaii
              ? 'border-2 border-black bg-amber-200 font-bold text-amber-950 dark:border-white dark:bg-amber-300 dark:text-neutral-950'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
          )}
        >
          Template
        </span>
      )}
      {lastSavedAt && (
        <span className={isKawaii ? 'text-neutral-700 dark:text-neutral-200' : undefined}>
          Last saved {new Date(lastSavedAt).toLocaleString('id-ID')}
        </span>
      )}
      {version ? (
        <span className={isKawaii ? 'font-bold text-neutral-900 dark:text-white' : undefined}>
          v{version}
        </span>
      ) : null}
    </div>
  )
}
