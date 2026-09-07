import { router } from '@inertiajs/react'
import { Archive, Copy, FileText, RotateCcw } from 'lucide-react'

interface Props {
  type: 'teaching_module' | 'rppm' | 'rpph' | 'lkpd' | 'media_module'
  id: number
  status: 'draft' | 'published' | 'archived'
  templateKey?: string | null
  onSaved?: () => void
  menu?: boolean
}

export default function DocumentWorkflowActions({
  type,
  id,
  status,
  templateKey,
  onSaved,
  menu = false,
}: Props) {
  const updateStatus = (next: 'draft' | 'published' | 'archived') =>
    router.post(
      `/documents/${type}/${id}/status`,
      { status: next },
      { preserveScroll: true, onSuccess: onSaved }
    )
  const updateTemplate = () =>
    router.post(
      `/documents/${type}/${id}/status`,
      { templateKey: templateKey ? null : 'user-template' },
      { preserveScroll: true, onSuccess: onSaved }
    )

  if (menu) {
    const menuItemClass =
      'flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-neutral-800 transition-colors hover:bg-emerald-50 hover:text-emerald-800 dark:text-neutral-100 dark:hover:bg-emerald-950/40'

    return (
      <>
        <button
          type="button"
          role="menuitem"
          onClick={() =>
            router.post(`/documents/${type}/${id}/duplicate`, {}, { onSuccess: onSaved })
          }
          className={menuItemClass}
        >
          <Copy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Duplicate
        </button>
        <button type="button" role="menuitem" onClick={updateTemplate} className={menuItemClass}>
          <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          {templateKey ? 'Remove template' : 'Save as template'}
        </button>
        {status === 'archived' ? (
          <button
            type="button"
            role="menuitem"
            onClick={() => updateStatus('draft')}
            className={menuItemClass}
          >
            <RotateCcw className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            Restore
          </button>
        ) : (
          <button
            type="button"
            role="menuitem"
            onClick={() => updateStatus('archived')}
            className={menuItemClass}
          >
            <Archive className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            Archive
          </button>
        )}
      </>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => router.post(`/documents/${type}/${id}/duplicate`)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </button>
      <button
        type="button"
        onClick={updateTemplate}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
      >
        {templateKey ? 'Remove template' : 'Save as template'}
      </button>
      {status === 'archived' ? (
        <button
          type="button"
          onClick={() => updateStatus('draft')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
        >
          <RotateCcw className="h-4 w-4" />
          Restore
        </button>
      ) : (
        <button
          type="button"
          onClick={() => updateStatus('archived')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
        >
          <Archive className="h-4 w-4" />
          Archive
        </button>
      )}
    </div>
  )
}
