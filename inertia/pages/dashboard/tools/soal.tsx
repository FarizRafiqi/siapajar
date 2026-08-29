import { Head, Link, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  FileQuestion,
  Search,
  Plus,
  FileDown,
  ExternalLink,
  RotateCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  ListChecks,
  Check,
  Coins,
  Zap,
  Lightbulb,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

interface Subject {
  id: number
  name: string
}

interface AssessmentItem {
  id: number
  title: string
  subject: string
  gradeLevel: string
  totalQuestions: number
  createdAt: string
}

interface SoalProps {
  subjects: Subject[]
  recentAssessments: AssessmentItem[]
}

export default function SoalExpress({
  subjects = [],
  recentAssessments = [],
}: Readonly<SoalProps>) {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')
  const [subject, setSubject] = useState<string>(
    subjects[0] ? subjects[0].name : 'Pendidikan Pancasila'
  )
  const [gradeLevel, setGradeLevel] = useState<string>('Kelas 1 SD / MI')
  const [topic, setTopic] = useState<string>('')
  const [assessmentType, setAssessmentType] = useState<string>('Sumatif Lingkup Materi')
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [questionTypes, setQuestionTypes] = useState<{
    pg: boolean
    isian: boolean
    uraian: boolean
  }>({
    pg: true,
    isian: true,
    uraian: true,
  })
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
      toast.error('Topik / Materi evaluasi wajib diisi')
      return
    }

    setIsGenerating(true)
    router.post(
      '/assessments/generate',
      {
        subject,
        gradeLevel,
        topic,
        assessmentType,
        questionCount,
        questionTypes,
      },
      {
        onFinish: () => setIsGenerating(false),
      }
    )
  }

  // Filter & sort list
  const filteredList = useMemo(() => {
    return recentAssessments
      .filter((a) => {
        const query = searchQuery.toLowerCase()
        return (
          a.title.toLowerCase().includes(query) ||
          a.subject.toLowerCase().includes(query) ||
          a.gradeLevel.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        let fieldA = String(a[sortField] || '')
        let fieldB = String(b[sortField] || '')
        if (sortOrder === 'asc') return fieldA.localeCompare(fieldB)
        return fieldB.localeCompare(fieldA)
      })
  }, [recentAssessments, searchQuery, sortField, sortOrder])

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
      title="Generator Bank Soal & Kisi-Kisi"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Bank Soal & Asesmen' }]}
    >
      <Head title="Generator Bank Soal & Kisi-Kisi - SiapAjar" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-white">
                Generator Bank Soal, Kisi-kisi & Kunci Jawaban
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Pilihan ganda HOTS, isian singkat, uraian, rubrik penilaian dan kisi-kisi otomatis
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
                  ? 'bg-amber-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              )}
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              Buat Soal (1 Kredit)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-black transition-all',
                activeTab === 'list'
                  ? 'bg-amber-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              )}
            >
              Daftar Soal ({recentAssessments.length})
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <h3 className="font-black text-neutral-900 dark:text-white text-lg">
                    Form Generator Soal & Asesmen
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Pilih tingkat kelas dan materi pokok untuk membuat paket evaluasi lengkap
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
                      Mata Pelajaran *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Jenjang / Kelas *
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="PAUD / TK B (5-6 Tahun)">PAUD / TK B (5-6 Tahun)</option>
                      <option value="Kelas 1 SD / MI">Kelas 1 SD / MI</option>
                      <option value="Kelas 2 SD / MI">Kelas 2 SD / MI</option>
                      <option value="Kelas 3 SD / MI">Kelas 3 SD / MI</option>
                      <option value="Kelas 4 SD / MI">Kelas 4 SD / MI</option>
                      <option value="Kelas 5 SD / MI">Kelas 5 SD / MI</option>
                      <option value="Kelas 6 SD / MI">Kelas 6 SD / MI</option>
                      <option value="Kelas 7 SMP / MTs">Kelas 7 SMP / MTs</option>
                      <option value="Kelas 8 SMP / MTs">Kelas 8 SMP / MTs</option>
                      <option value="Kelas 9 SMP / MTs">Kelas 9 SMP / MTs</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Jenis Asesmen *
                    </label>
                    <select
                      value={assessmentType}
                      onChange={(e) => setAssessmentType(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Sumatif Lingkup Materi">
                        Sumatif Lingkup Materi (Ulangan Harian)
                      </option>
                      <option value="Sumatif Tengah Semester (STS)">
                        Sumatif Tengah Semester (STS)
                      </option>
                      <option value="Sumatif Akhir Semester (SAS)">
                        Sumatif Akhir Semester (SAS / PAS)
                      </option>
                      <option value="Asesmen Diagnostik Awal">Asesmen Diagnostik Awal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Jumlah Butir Soal *
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value={5}>5 Butir Soal (Latihan Singkat)</option>
                      <option value={10}>10 Butir Soal (Standar Formatif)</option>
                      <option value={15}>15 Butir Soal</option>
                      <option value={20}>20 Butir Soal (Standar Ujian)</option>
                      <option value={25}>25 Butir Soal (Komprehensif)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Topik / Kisi-kisi Materi Ujian *
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Operasi Penjumlahan & Pengurangan, Nilai Tempat, Simbol Pancasila"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-neutral-800 dark:text-neutral-200">
                      Format Soal yang Diinginkan
                    </label>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                      Pilih tipe instrumen penilaian yang akan di-generate AI
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setQuestionTypes((prev) => ({ ...prev, pg: !prev.pg }))}
                      className={cn(
                        'flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all text-left cursor-pointer text-xs select-none',
                        questionTypes.pg
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff] text-neutral-950 dark:text-white font-extrabold -translate-y-0.5'
                          : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                          questionTypes.pg
                            ? 'bg-emerald-500 border-black dark:border-white text-white shadow-[1px_1px_0px_#000000] dark:shadow-[1px_1px_0px_#ffffff]'
                            : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                        )}
                      >
                        {questionTypes.pg && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="leading-snug">Pilihan Ganda (PG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuestionTypes((prev) => ({ ...prev, isian: !prev.isian }))}
                      className={cn(
                        'flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all text-left cursor-pointer text-xs select-none',
                        questionTypes.isian
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff] text-neutral-950 dark:text-white font-extrabold -translate-y-0.5'
                          : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                          questionTypes.isian
                            ? 'bg-emerald-500 border-black dark:border-white text-white shadow-[1px_1px_0px_#000000] dark:shadow-[1px_1px_0px_#ffffff]'
                            : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                        )}
                      >
                        {questionTypes.isian && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="leading-snug">Isian Singkat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setQuestionTypes((prev) => ({ ...prev, uraian: !prev.uraian }))
                      }
                      className={cn(
                        'flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all text-left cursor-pointer text-xs select-none',
                        questionTypes.uraian
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff] text-neutral-950 dark:text-white font-extrabold -translate-y-0.5'
                          : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                          questionTypes.uraian
                            ? 'bg-emerald-500 border-black dark:border-white text-white shadow-[1px_1px_0px_#000000] dark:shadow-[1px_1px_0px_#ffffff]'
                            : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                        )}
                      >
                        {questionTypes.uraian && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="leading-snug">Uraian / HOTS</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-kawaii-primary w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        Menyusun Paket Soal & Kisi-Kisi...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Generate Paket Soal (1 Kredit)
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Guide */}
            <div className="bg-amber-50 dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-4 text-xs text-neutral-800 dark:text-neutral-200 font-medium">
              <h4 className="font-black text-sm text-neutral-950 dark:text-white flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-amber-600" />
                Kelengkapan Paket Evaluasi:
              </h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>Naskah Soal Siap Cetak (dengan Kop Sekolah)</li>
                <li>Tabel Kisi-kisi Soal (Level Kognitif C1-C6)</li>
                <li>Kunci Jawaban Lengkap & Pembahasan</li>
                <li>Pedoman Penskoran & Rubrik Nilai</li>
              </ul>
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] text-xs">
                <Lightbulb className="w-4 h-4 text-amber-500 inline mr-1" />{' '}
                <strong>Standar HOTS:</strong> Soal otomatis dilengkapi stimulus cerita / grafik /
                tabel kontekstual sesuai standar Kurikulum Merdeka.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_#000000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari naskah soal atau mata pelajaran..."
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
                <Plus className="w-4 h-4" /> Buat Paket Soal Baru
              </button>
            </div>

            {filteredList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <FileQuestion className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                  Belum ada paket soal tersimpan
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Mulai buat naskah ulangan dan kisi-kisi pertama Anda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold">
                      <th className="pb-3 cursor-pointer" onClick={() => toggleSort('title')}>
                        <div className="flex items-center gap-1">
                          Judul & Topik Soal
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
                          Mata Pelajaran
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
                      <th className="pb-3">Jenjang</th>
                      <th className="pb-3">Jumlah Butir</th>
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
                          <Link href={`/assessments/${item.id}`} className="hover:text-amber-600">
                            {item.title}
                          </Link>
                        </td>
                        <td className="py-3 text-neutral-700 dark:text-neutral-300">
                          {item.subject}
                        </td>
                        <td className="py-3 text-neutral-600 dark:text-neutral-400">
                          {item.gradeLevel}
                        </td>
                        <td className="py-3 font-bold text-amber-700 dark:text-amber-400">
                          {item.totalQuestions} Soal
                        </td>
                        <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                          <Link
                            href={`/assessments/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
                          >
                            Buka <ExternalLink className="w-3 h-3" />
                          </Link>
                          <a
                            href={`/assessments/${item.id}/export`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200"
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
