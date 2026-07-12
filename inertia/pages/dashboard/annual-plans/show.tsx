import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download } from 'lucide-react'

interface TahunAjaran {
  id: number
  name: string
}

interface Prota {
  id: number
  subject: string
  content: {
    kompetensi?: string[]
    alokasiWaktu?: string[]
    kegiatan?: string[]
    minggu?: string[]
    [key: string]: any
  }
  created_at: string
  tahunAjaran: TahunAjaran
}

interface ProtaShowProps {
  readonly prota: Prota
}

export default function ProtaShow({ prota }: ProtaShowProps) {
  const handleExport = () => {
    // Future implementation: Implement DOCX export
    alert('Export DOCX akan segera tersedia')
  }

  const sections = [
    { key: 'kompetensi', title: 'Kompetensi', icon: '📚' },
    { key: 'alokasiWaktu', title: 'Alokasi Waktu', icon: '⏰' },
    { key: 'kegiatan', title: 'Kegiatan Pembelajaran', icon: '📝' },
    { key: 'minggu', title: 'Pembagian Minggu', icon: '📅' },
  ]

  return (
    <DashboardWrapper title="Dashboard">
      <Head title={`Protah - ${prota.subject}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/annual-plans"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Program Tahunan - {prota.subject}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {prota.tahunAjaran.name}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Download className="h-4 w-4" />
            Export DOCX
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                <span>{section.icon}</span>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {(prota.content[section.key] || []).length === 0 ? (
                  <li className="text-neutral-500 dark:text-neutral-400">
                    Belum ada konten
                  </li>
                ) : (
                  (prota.content[section.key] || []).map((item: string) => (
                    <li key={item} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                      <span className="mt-1 text-emerald-500">•</span>
                      {item}
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    
    </DashboardWrapper>
  )
}
