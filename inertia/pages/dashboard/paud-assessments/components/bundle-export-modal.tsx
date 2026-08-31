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
          className="w-full max-w-lg rounded-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_#000000] dark:border-white dark:bg-neutral-900 dark:shadow-[8px_8px_0px_#ffffff]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-emerald-200 shadow-[2px_2px_0px_#000000] dark:border-white dark:bg-emerald-900/60">
                <FileText className="h-5 w-5 text-emerald-950 dark:text-emerald-200" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                  Ekspor Dokumen Bundel Asesmen
                </h3>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Satukan Catatan Anekdot, Ceklis IKTP, Hasil Karya, & Foto Berseri
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-kawaii-secondary !p-2 !rounded-xl"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Pilih Kelompok
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(Number(e.target.value))}
                className="w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
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
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Tema / Topik
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Kenalkan, Indonesiaku"
                  className="w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Minggu Ke-
                </label>
                <input
                  type="text"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  placeholder="e.g. 01, 02"
                  className="w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Cakupan Instrumen
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl border-2 border-black bg-white px-3.5 py-2.5 text-sm font-bold text-neutral-900 focus:shadow-[3px_3px_0px_#000000] focus:outline-none dark:border-white dark:bg-neutral-800 dark:text-white"
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
              <button type="button" onClick={onClose} className="btn-kawaii-secondary">
                Batal
              </button>

              <a
                href={getPdfUrl()}
                className="btn-kawaii-secondary !bg-rose-100 hover:!bg-rose-200 !text-rose-950 font-bold"
                target="_blank"
                rel="noreferrer"
              >
                <Download className="h-4 w-4" /> Ekspor PDF
              </a>

              <a href={getDocxUrl()} className="btn-kawaii-primary">
                <Download className="h-4 w-4" /> Ekspor DOCX
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
