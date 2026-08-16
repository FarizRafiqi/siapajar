import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, X } from 'lucide-react'

interface SchoolClass {
  id: number
  name: string
}

interface BundleExportModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly classes: SchoolClass[]
}

export default function BundleExportModal({ isOpen, onClose, classes }: BundleExportModalProps) {
  const [classId, setClassId] = useState<number>(classes[0]?.id || 0)
  const [theme, setTheme] = useState<string>('Kenalkan')
  const [week, setWeek] = useState<string>('01')
  const [type, setType] = useState<string>('all')

  if (!isOpen) return null

  const getDocxUrl = () => {
    const params = new URLSearchParams()
    if (classId) params.append('classId', String(classId))
    if (theme) params.append('theme', theme)
    if (week) params.append('week', week)
    if (type) params.append('type', type)
    return `/paud-assessments/export-bundle?${params.toString()}`
  }

  const getPdfUrl = () => {
    const params = new URLSearchParams()
    if (classId) params.append('classId', String(classId))
    if (theme) params.append('theme', theme)
    if (week) params.append('week', week)
    if (type) params.append('type', type)
    return `/paud-assessments/export-bundle/pdf?${params.toString()}`
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950/40">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Ekspor Dokumen Bundel Asesmen
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Satukan Catatan Anekdot, Ceklis IKTP, Hasil Karya, & Foto Berseri
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Pilih Kelompok
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelompok {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Tema / Topik
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Kenalkan, Indonesiaku"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Minggu Ke-
                </label>
                <input
                  type="text"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  placeholder="e.g. 01, 02"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Cakupan Instrumen
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="all">Semua Instrumen (Bundel Lengkap)</option>
                <option value="anecdotal_note">Hanya Catatan Anekdot</option>
                <option value="checklist">Hanya Ceklis IKTP</option>
                <option value="work_sample">Hanya Dokumentasi Hasil Karya</option>
                <option value="photo_series">Hanya Foto Berseri</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>

              <a
                href={getPdfUrl()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                target="_blank"
                rel="noreferrer"
              >
                <Download className="h-4 w-4" /> Ekspor PDF
              </a>

              <a
                href={getDocxUrl()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" /> Ekspor DOCX
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
