import { router } from '@inertiajs/react'
import { useEffect, useRef } from 'react'

export function useDocumentAutosave(type: 'teaching_module' | 'rppm' | 'rpph', id: number, content: Record<string, unknown>, status: 'draft' | 'published', enabled: boolean) {
  const firstRender = useRef(true)
  const serialized = JSON.stringify(content)
  useEffect(() => {
    if (!enabled) return
    if (firstRender.current) { firstRender.current = false; return }
    const timer = window.setTimeout(() => {
      router.post(`/documents/${type}/${id}/autosave`, { content, status }, { preserveState: true, preserveScroll: true })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [type, id, serialized, status, enabled])
}
