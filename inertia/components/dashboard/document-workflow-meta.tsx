import { Archive, CheckCircle2, Clock3 } from 'lucide-react'

interface DocumentWorkflowMetaProps {
  status: 'draft' | 'published' | 'archived'
  lastSavedAt?: string | null
  version?: number
  templateKey?: string | null
}

export default function DocumentWorkflowMeta({
  status,
  lastSavedAt,
  version,
  templateKey,
}: DocumentWorkflowMetaProps) {
  const label = status === 'published' ? 'Published' : status === 'archived' ? 'Archived' : 'Draft'
  const Icon = status === 'published' ? CheckCircle2 : status === 'archived' ? Archive : Clock3
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {templateKey && (
        <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          Template
        </span>
      )}
      {lastSavedAt && <span>Last saved {new Date(lastSavedAt).toLocaleString('id-ID')}</span>}
      {version ? <span>v{version}</span> : null}
    </div>
  )
}
