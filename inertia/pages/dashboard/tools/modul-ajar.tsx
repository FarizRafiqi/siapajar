import { Head, Link, router } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  BookOpen,
  Search,
  Plus,
  FileDown,
  ExternalLink,
  RotateCw,
  CalendarRange,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  FileText,
  Coins,
  Zap,
  Lightbulb,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

interface SchoolClass {
  id: number
  name: string
  phase?: string
  level?: string
}

interface Subject {
  id: number
  name: string
}

interface TeachingModuleItem {
  id: number
  title: string
  subject: string
  phase: string
  status: 'draft' | 'published'
  createdAt: string
  schoolClass?: SchoolClass
}

interface ModulAjarProps {
  isTk: boolean
  classes: SchoolClass[]
  subjects: Subject[]
  recentModules: TeachingModuleItem[]
}

const PAUD_LEARNING_MODELS = [
  'Pembelajaran Berbasis Bermain',
  'Eksplorasi dan Discovery',
  'Inkuiri Sederhana',
  'Projek Bermain Kontekstual',
  'Bermain Kolaboratif',
  'STEAM berbasis Loose Parts',
]

const SD_LEARNING_MODELS = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Cooperative Learning',
]

const SD_LEARNING_APPROACHES = [
  'Tidak ada',
  'Teaching at the Right Level (TaRL)',
  'Culturally Responsive Teaching (CRT)',
  'Teaching at the Right Level (TaRL) + Culturally Responsive Teaching (CRT)',
]

type PaginationItem = number | 'ellipsis'

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  const pages = Array.from(
    new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, totalPages - 1, totalPages])
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  return pages.reduce<PaginationItem[]>((items, page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) items.push('ellipsis')
    items.push(page)
    return items
  }, [])
}

function formatCreatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ModulAjarExpress({
  isTk,
  classes = [],
  subjects = [],
  recentModules = [],
}: Readonly<ModulAjarProps>) {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')
  const [classId, setClassId] = useState<string>(classes[0] ? String(classes[0].id) : '')
  const [subject, setSubject] = useState<string>(
    subjects[0] ? subjects[0].name : 'Pendidikan Pancasila'
  )
  const [topic, setTopic] = useState<string>('')
  const [phase, setPhase] = useState<string>(isTk ? 'Fondasi' : 'A')
  const [duration, setDuration] = useState<string>('2 x 35 Menit (1 Pertemuan)')
  const [learningModel, setLearningModel] = useState<string>(
    isTk ? PAUD_LEARNING_MODELS[0] : SD_LEARNING_MODELS[0]
  )
  const [learningApproach, setLearningApproach] = useState<string>('Tidak ada')
  const [specificObjectives, setSpecificObjectives] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Table search & sort state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'title' | 'subject' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      toast.error('Topik pembelajaran wajib diisi')
      return
    }
    if (!classId) {
      toast.error('Pilih kelas terlebih dahulu')
      return
    }

    setIsGenerating(true)
    if (isTk) {
      router.post(
        '/rppm/generate',
        {
          classId: Number(classId),
          theme: topic,
          subtheme: '',
          weekStartDate: new Date().toISOString().slice(0, 10),
          phase,
          learningModel,
        },
        {
          onFinish: () => setIsGenerating(false),
        }
      )
    } else {
      router.post(
        '/teaching-modules/generate',
        {
          classId: Number(classId),
          subject,
          topic,
          phase,
          learningModel,
          learningApproach: learningApproach === 'Tidak ada' ? undefined : learningApproach,
        },
        {
          onFinish: () => setIsGenerating(false),
        }
      )
    }
  }

  // Filter & sort list
  const filteredList = useMemo(() => {
    return recentModules
      .filter((m) => {
        const query = searchQuery.toLowerCase()
        return (
          m.title.toLowerCase().includes(query) ||
          m.subject.toLowerCase().includes(query) ||
          (m.schoolClass?.name.toLowerCase().includes(query) ?? false)
        )
      })
      .sort((a, b) => {
        let fieldA = String(a[sortField] || '')
        let fieldB = String(b[sortField] || '')
        if (sortOrder === 'asc') return fieldA.localeCompare(fieldB)
        return fieldB.localeCompare(fieldA)
      })
  }, [recentModules, searchQuery, sortField, sortOrder])

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredList.slice(start, start + pageSize)
  }, [filteredList, currentPage, pageSize])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, pageSize, sortField, sortOrder])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const toggleSort = (field: 'title' | 'subject' | 'createdAt') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <DashboardWrapper
      title={isTk ? 'Generator Modul Ajar (RPPM)' : 'Generator Modul Ajar'}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: isTk ? 'Modul Ajar RPPM' : 'Modul Ajar' },
      ]}
    >
      <Head
        title={isTk ? 'Generator Modul Ajar RPPM - SiapAjar' : 'Generator Modul Ajar - SiapAjar'}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
              {isTk ? <CalendarRange className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-white">
                {isTk ? 'Generator Modul Ajar RPPM' : 'Generator Modul Ajar AI'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                1-Klik Jadi sesuai standar Kurikulum Merdeka Kemendikbudristek & Kemenag
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-black transition-all',
                activeTab === 'create'
                  ? 'bg-emerald-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              )}
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              Buat Baru (1 Kredit)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-black transition-all',
                activeTab === 'list'
                  ? 'bg-emerald-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              )}
            >
              Daftar Modul ({recentModules.length})
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Box */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <h3 className="font-black text-neutral-900 dark:text-white text-lg">
                    Form Pembuatan Kilat
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Lengkapi info dasar materi, AI akan menyusun seluruh struktur modul
                  </p>
                </div>
                <span className="badge-kawaii-emerald">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" /> Biaya: 1 Kredit
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Pilih Kelas / Rombel *
                    </label>
                    <select
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.phase ? `(${c.phase})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Mata Pelajaran *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Contoh: Matematika / IPAS / PAIBP"
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Topik / Materi Pokok *
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Contoh: Pecahan Senilai"
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Alokasi Waktu (JP)
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Contoh: 2 x 35 Menit (1 Pertemuan)"
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                    {isTk ? 'Model Pembelajaran PAUD' : 'Model Pembelajaran SD'}
                  </label>
                  <select
                    value={learningModel}
                    onChange={(e) => setLearningModel(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {(isTk ? PAUD_LEARNING_MODELS : SD_LEARNING_MODELS).map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                {!isTk && (
                  <div>
                    <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Pendekatan Tambahan (Opsional)
                    </label>
                    <select
                      value={learningApproach}
                      onChange={(e) => setLearningApproach(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {SD_LEARNING_APPROACHES.map((approach) => (
                        <option key={approach} value={approach}>
                          {approach}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Tujuan Pembelajaran Khusus / Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={specificObjectives}
                    onChange={(e) => setSpecificObjectives(e.target.value)}
                    rows={2}
                    placeholder="Tuliskan jika ada instruksi khusus misal: fokus pengenalan benda konkret, integrasi lingkungan sekolah..."
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-medium">
                    Kredit terpotong setelah dokumen sukses dibuat
                  </span>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-kawaii-primary w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        Menyusun Modul Ajar AI...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Generate Modul Ajar (1 Kredit)
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Guide */}
            <div className="bg-emerald-50 dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-4 text-xs text-neutral-800 dark:text-neutral-200 font-medium">
              <h4 className="font-black text-sm text-neutral-950 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Struktur yang Dihasilkan:
              </h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>Identitas & Informasi Umum Modul</li>
                <li>Komponen Inti (Tujuan Pembelajaran & Pemahaman Bermakna)</li>
                <li>Pertanyaan Pemantik & Profil Pelajar Pancasila</li>
                <li>Langkah Kegiatan (Pendahuluan, Inti, Penutup)</li>
                <li>Asesmen Formatif, Sumatif, & Rubrik Penilaian</li>
                <li>Pengayaan & Remedial Siap Cetak</li>
              </ul>
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] text-xs">
                <Lightbulb className="w-4 h-4 text-amber-500 inline mr-1" /> <strong>Tips:</strong>{' '}
                Setelah digenerate, Anda dapat langsung mengedit narasi di web atau download file{' '}
                <strong>Word (.docx)</strong> dan <strong>PDF</strong> resmi.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_#000000]">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul ajar, topik, atau mata pelajaran..."
                  style={{ paddingLeft: '2.6rem' }}
                  className="w-full rounded-2xl border-2 border-black bg-neutral-50 dark:bg-neutral-950 pr-8 py-2 text-xs font-bold shadow-[2px_2px_0px_#000000]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="btn-kawaii-primary text-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Tambah Baru
              </button>
            </div>

            {/* Table */}
            {filteredList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                  Tidak ada modul ajar ditemukan
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {searchQuery
                    ? 'Coba ganti kata kunci pencarian.'
                    : 'Mulai buat modul ajar baru di tab Buat Baru.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold">
                      <th className="w-12 pb-3">No.</th>
                      <th className="pb-3 cursor-pointer" onClick={() => toggleSort('title')}>
                        <div className="flex items-center gap-1">
                          Judul & Topik
                          {sortField === 'title' ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-neutral-300" />
                          )}
                        </div>
                      </th>
                      <th className="pb-3 cursor-pointer" onClick={() => toggleSort('subject')}>
                        <div className="flex items-center gap-1">
                          Mata Pelajaran / Tema
                          {sortField === 'subject' ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-neutral-300" />
                          )}
                        </div>
                      </th>
                      <th className="pb-3">Kelas / Fase</th>
                      <th className="pb-3 cursor-pointer" onClick={() => toggleSort('createdAt')}>
                        <div className="flex items-center gap-1">
                          Dibuat
                          {sortField === 'createdAt' ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-neutral-300" />
                          )}
                        </div>
                      </th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {paginatedList.map((item, index) => {
                      const detailHref = isTk ? `/rppm/${item.id}` : `/teaching-modules/${item.id}`
                      const docxHref = `${detailHref}/export`
                      const pdfHref = `${detailHref}/export/pdf`

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                        >
                          <td className="py-3 font-semibold text-neutral-600 dark:text-neutral-300">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>
                          <td className="py-3 font-semibold text-neutral-900 dark:text-white">
                            <Link
                              href={detailHref}
                              className="hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                              {item.title}
                            </Link>
                          </td>
                          <td className="py-3 text-neutral-700 dark:text-neutral-300">
                            {item.subject || '-'}
                          </td>
                          <td className="py-3 text-neutral-600 dark:text-neutral-400">
                            {item.schoolClass?.name || `Fase ${item.phase}`}
                          </td>
                          <td className="py-3 text-neutral-600 dark:text-neutral-400">
                            {formatCreatedAt(item.createdAt)}
                          </td>
                          <td className="py-3">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full text-[10px] font-bold',
                                item.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                              )}
                            >
                              {item.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                            <Link
                              href={detailHref}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
                            >
                              Buka <ExternalLink className="w-3 h-3" />
                            </Link>
                            <a
                              href={docxHref}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200"
                              title="Download Word (.docx)"
                            >
                              <FileDown className="w-3 h-3" /> DOCX
                            </a>
                            <a
                              href={pdfHref}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800"
                              title="Download PDF (.pdf)"
                            >
                              <FileText className="w-3 h-3" /> PDF
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {filteredList.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 text-sm dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-neutral-700 dark:text-neutral-300">
                  <span>
                    Menampilkan {Math.min((currentPage - 1) * pageSize + 1, filteredList.length)}-
                    {Math.min(currentPage * pageSize, filteredList.length)} dari{' '}
                    {filteredList.length} modul
                  </span>
                  <label className="inline-flex items-center gap-2 font-semibold">
                    Tampilkan
                    <select
                      value={pageSize}
                      onChange={(event) => setPageSize(Number(event.target.value))}
                      className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                      aria-label="Jumlah modul per halaman"
                    >
                      {[5, 8, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    / halaman
                  </label>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-1">
                  <button
                    type="button"
                    aria-label="Halaman sebelumnya"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200 disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>
                  {getPaginationItems(currentPage, totalPages).map((page, index) =>
                    page === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1.5 py-1 text-sm font-semibold text-neutral-500"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Buka halaman ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={cn(
                          'min-w-8 rounded-lg border px-2.5 py-1 text-sm font-bold transition-colors',
                          currentPage === page
                            ? 'border-black bg-emerald-300 text-neutral-950 shadow-[1px_1px_0px_#000000]'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800'
                        )}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    aria-label="Halaman berikutnya"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg border border-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200 disabled:opacity-40"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
