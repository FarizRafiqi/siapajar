import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Save, Download, Eye } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Kelas {
  id: number
  name: string
  gradeLevel: number
}

interface ModulAjar {
  id: number
  title: string
  subject: string
  phase: string
  status: 'draft' | 'published'
  content: {
    kompetensiDasar?: string[]
    tujuanPembelajaran?: string[]
    kegiatan?: string[]
    penilaian?: string[]
    sumberBelajar?: string[]
    [key: string]: any
  }
  created_at: string
  kelas: Kelas
}

interface ModulAjarShowProps {
  readonly modulAjar: ModulAjar
}

export default function ModulAjarShow({ modulAjar }: ModulAjarShowProps) {
  const [editing, setEditing] = useState(false)

  const { data, setData, put, processing } = useForm({
    title: modulAjar.title,
    subject: modulAjar.subject,
    phase: modulAjar.phase,
    status: modulAjar.status,
    content: modulAjar.content,
  })

  const handleSave = () => {
    put(`/teaching-modules/${modulAjar.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleExport = () => {
    // Future implementation: Implement DOCX export
    alert('Export DOCX akan segera tersedia')
  }

  const sections = [
    { key: 'kompetensiDasar', title: 'Kompetensi Dasar', icon: '📚' },
    { key: 'tujuanPembelajaran', title: 'Tujuan Pembelajaran', icon: '🎯' },
    { key: 'kegiatan', title: 'Kegiatan Pembelajaran', icon: '📝' },
    { key: 'penilaian', title: 'Penilaian', icon: '✅' },
    { key: 'sumberBelajar', title: 'Sumber Belajar', icon: '📖' },
  ]

  return (
    <DashboardWrapper title="Dashboard">
      <Head title={modulAjar.title} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/teaching-modules"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {modulAjar.title}
              </h2>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  modulAjar.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                )}
              >
                {modulAjar.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {modulAjar.subject} • Kelas {modulAjar.kelas.name} • Fase {modulAjar.phase}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" />
              Export DOCX
            </button>
            {editing ? (
              <button
                onClick={handleSave}
                disabled={processing}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Eye className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
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
              {editing ? (
                <textarea
                  value={(data.content[section.key] || []).join('\n')}
                  onChange={(e) => {
                    const newContent = { ...data.content }
                    newContent[section.key] = e.target.value.split('\n').filter((line) => line.trim())
                    setData('content', newContent)
                  }}
                  rows={6}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder={`Masukkan ${section.title.toLowerCase()} (satu item per baris)`}
                />
              ) : (
                <ul className="space-y-2">
                  {(modulAjar.content[section.key] || []).length === 0 ? (
                    <li className="text-neutral-500 dark:text-neutral-400">
                      Belum ada konten
                    </li>
                  ) : (
                    (modulAjar.content[section.key] || []).map((item: string) => (
                      <li key={item} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                        <span className="mt-1 text-emerald-500">•</span>
                        {item}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    
    </DashboardWrapper>
  )
}
