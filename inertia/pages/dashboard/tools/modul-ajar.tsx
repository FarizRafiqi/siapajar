import { Head, Link, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  BookOpen,
  Sparkles,
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
  const [isGenerating, setIsGenerating] = useState(false)

  // Table search & sort state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'title' | 'subject' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

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
          phase,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-2xl">
              {isTk ? <CalendarRange className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {isTk ? 'Generator Modul Ajar RPPM' : 'Generator Modul Ajar AI'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                1-Klik Jadi sesuai standar Kurikulum Merdeka Kemendikbudristek & Kemenag
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all',
                activeTab === 'create'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-300 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              )}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Buat Baru (1 Kredit)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all',
                activeTab === 'list'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-300 shadow-sm'
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
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-lg">
                    Form Pembuatan Kilat
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Lengkapi info dasar materi, AI akan menyusun seluruh struktur modul
                  </p>
                </div>
                <span className="badge-kawaii-emerald">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Biaya: 1 Kredit
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Pilih Kelas / Rombel *
                    </label>
                    <select
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                      required
                    >
                      {classes.length === 0 ? (
                        <option value="">(Belum ada kelas - buat di panel kelas)</option>
                      ) : (
                        classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {!isTk && (
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Mata Pelajaran *
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                      >
                        {subjects.map((sub) => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Fase Kurikulum *
                    </label>
                    <select
                      value={phase}
                      onChange={(e) => setPhase(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white"
                    >
                      {isTk ? (
                        <option value="Fondasi">Fase Fondasi (TK / PAUD / RA)</option>
                      ) : (
                        <>
                          <option value="A">Fase A (Kelas 1 - 2 SD)</option>
                          <option value="B">Fase B (Kelas 3 - 4 SD)</option>
                          <option value="C">Fase C (Kelas 5 - 6 SD)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isTk
                      ? 'Tema / Sub-Tema Pembelajaran *'
                      : 'Topik / Materi Utama Pembelajaran *'}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={
                      isTk
                        ? 'Contoh: Aku Sayang Bumi / Tanaman Hias / Diriku dan Keluargaku'
                        : 'Contoh: Mengenal Bilangan Cacah sampai 100 / Hak dan Kewajiban di Rumah'
                    }
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-kawaii-primary w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        Menyusun Modul Ajar AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Modul Ajar (1 Kredit)
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Guide */}
            <div className="bg-emerald-50/60 dark:bg-neutral-900 p-6 rounded-3xl border-2 border-emerald-500/20 dark:border-neutral-800 space-y-4 text-xs text-neutral-700 dark:text-neutral-300">
              <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
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
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-2xl border border-emerald-200 dark:border-neutral-700 text-xs">
                💡 <strong>Tips:</strong> Setelah digenerate, Anda dapat langsung mengedit narasi di
                web atau download file <strong>Word (.docx)</strong> dan <strong>PDF</strong> resmi.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul ajar, topik, atau mata pelajaran..."
                  className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-10 pr-8 py-2 text-xs font-medium"
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
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {paginatedList.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                      >
                        <td className="py-3 font-semibold text-neutral-900 dark:text-white">
                          <Link
                            href={isTk ? `/rppm/${item.id}` : `/teaching-modules/${item.id}`}
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
                            href={isTk ? `/rppm/${item.id}` : `/teaching-modules/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
                          >
                            Buka <ExternalLink className="w-3 h-3" />
                          </Link>
                          <a
                            href={
                              isTk
                                ? `/rppm/${item.id}/export`
                                : `/teaching-modules/${item.id}/export`
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200"
                            title="Download Word (.docx)"
                          >
                            <FileDown className="w-3 h-3" /> DOCX
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="text-neutral-500">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 disabled:opacity-40"
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
