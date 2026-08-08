import { useState } from 'react'
import { toast } from 'sonner'
import { Download, LoaderCircle } from 'lucide-react'

interface ExportDownloadButtonProps {
  readonly href: string
  readonly label: string
  readonly filename: string
  readonly variant?: 'primary' | 'secondary'
}

export default function ExportDownloadButton({
  href,
  label,
  filename,
  variant = 'secondary',
}: ExportDownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  const download = async () => {
    if (loading) return
    setLoading(true)
    try {
      const response = await fetch(href, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json, application/octet-stream' },
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message || 'Export gagal. Coba lagi.')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      toast.success(`${label} berhasil disiapkan`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={loading}
      className={
        variant === 'primary'
          ? 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
          : 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800'
      }
    >
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? 'Menyiapkan…' : label}
    </button>
  )
}
