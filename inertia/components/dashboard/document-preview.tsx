import { useEffect, useState } from 'react'
import { AlertTriangle, LoaderCircle } from 'lucide-react'

interface DocumentPreviewProps {
  readonly pdfUrl: string
  readonly onPreviewStatus?: (status: 'loading' | 'ready' | 'error') => void
}

export default function DocumentPreview({ pdfUrl, onPreviewStatus }: DocumentPreviewProps) {
  const [pdfSource, setPdfSource] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let objectUrl: string | null = null
    setPdfSource(null)
    setError(null)
    onPreviewStatus?.('loading')

    const loadPdf = async () => {
      try {
        const response = await fetch(pdfUrl)
        if (!response.ok) throw new Error('PDF tidak dapat dimuat')

        const blob = await response.blob()
        const header = new TextDecoder().decode(await blob.slice(0, 5).arrayBuffer())
        if (!blob.type.includes('pdf') || header !== '%PDF-') {
          throw new Error('Respons bukan file PDF')
        }

        objectUrl = URL.createObjectURL(blob)
        if (active) {
          setPdfSource(objectUrl)
          onPreviewStatus?.('ready')
        }
      } catch {
        if (active) {
          setError('Preview PDF gagal dimuat. Gunakan tombol buka tab baru.')
          onPreviewStatus?.('error')
        }
      }
    }

    void loadPdf()
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [pdfUrl, onPreviewStatus])

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <h4 className="font-semibold text-neutral-900 dark:text-white">Preview PDF</h4>
        <p className="text-xs text-neutral-500">Render langsung di halaman</p>
      </div>
      {!pdfSource && !error && (
        <div className="flex min-h-[520px] items-center justify-center gap-3 text-sm text-neutral-500">
          <LoaderCircle className="h-5 w-5 animate-spin" /> Menyiapkan preview dokumen…
        </div>
      )}
      {error && <ErrorPreview message={error} />}
      {pdfSource && (
        <iframe
          title="Preview PDF media ajar"
          src={pdfSource}
          className="h-[720px] w-full border-0 bg-neutral-950"
        />
      )}
    </section>
  )
}

function ErrorPreview({ message }: { message: string }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center gap-3 p-8 text-center text-sm text-neutral-500">
      <AlertTriangle className="h-8 w-8 text-amber-500" />
      <p>{message}</p>
    </div>
  )
}
