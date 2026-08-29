import { Head, Link, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  FileSpreadsheet,
  Search,
  Plus,
  FileDown,
  ExternalLink,
  RotateCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Palette,
  Coins,
  Zap,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

interface SchoolClass {
  id: number
  name: string
}

interface LkpdItem {
  id: number
  title: string
  theme: string
  subtheme?: string
  status: 'draft' | 'published'
  createdAt: string
  schoolClass?: SchoolClass
}

interface LkpdProps {
  classes: SchoolClass[]
  recentLkpds: LkpdItem[]
  institutionType?: string
}

export default function LkpdExpress({
  classes = [],
  recentLkpds = [],
  institutionType = 'tk',
}: Readonly<LkpdProps>) {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')
  const [classId, setClassId] = useState<string>(classes[0] ? String(classes[0].id) : '')
  const [theme, setTheme] = useState<string>('')
  const [subtheme, setSubtheme] = useState<string>('')
  const [ageGroup, setAgeGroup] = useState<string>('Kelompok B (5-6 Tahun)')
  const [isGenerating, setIsGenerating] = useState(false)

  // Table search & sort state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'title' | 'theme' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!theme.trim()) {
      toast.error('Tema LKPD wajib diisi')
      return
    }

    setIsGenerating(true)
    router.post(
      '/lkpd/generate',
      {
        classId: classId ? Number(classId) : undefined,
        theme,
        subtheme,
        ageGroup,
        institutionType,
      },
      {
        onFinish: () => setIsGenerating(false),
      }
    )
  }

  // Filter & sort list
  const filteredList = useMemo(() => {
    return recentLkpds
      .filter((l) => {
        const query = searchQuery.toLowerCase()
        return (
          l.title.toLowerCase().includes(query) ||
          l.theme.toLowerCase().includes(query) ||
          (l.subtheme?.toLowerCase().includes(query) ?? false)
        )
      })
      .sort((a, b) => {
        let fieldA = String(a[sortField] || '')
        let fieldB = String(b[sortField] || '')
        if (sortOrder === 'asc') return fieldA.localeCompare(fieldB)
        return fieldB.localeCompare(fieldA)
      })
  }, [recentLkpds, searchQuery, sortField, sortOrder])

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredList.slice(start, start + pageSize)
  }, [filteredList, currentPage, pageSize])

  const toggleSort = (field: 'title' | 'theme' | 'createdAt') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <DashboardWrapper
      title="Generator LKPD & Lembar Aktivitas"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'LKPD Siswa' }]}
    >
      <Head title="Generator LKPD Siswa - SiapAjar" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-white">
                Generator Lembar Kerja Siswa (LKPD)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Lembar aktivitas siap cetak bergambar kontekstual untuk PAUD & Fase Fondasi
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
                  ? 'bg-purple-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              )}
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              Buat LKPD (1 Kredit)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-black transition-all',
                activeTab === 'list'
                  ? 'bg-purple-300 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              )}
            >
              Daftar LKPD ({recentLkpds.length})
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <h3 className="font-black text-neutral-900 dark:text-white text-lg">
                    Form Generator LKPD
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    AI akan menyusun tujuan, stimulus cerita, dan butir aktivitas siap print
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
                      Pilih Kelas / Kelompok
                    </label>
                    <select
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">(Umum / Seluruh Kelas)</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Kelompok Usia / Jenjang *
                    </label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</option>
                      <option value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</option>
                      <option value="Fase A (Kelas 1-2 SD)">Fase A (Kelas 1-2 SD)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Tema Utama LKPD *
                  </label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Contoh: Binatang Ciptaan Allah / Tanaman Sayur / Aku dan Sekolahku"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Sub-Tema (Opsional)
                  </label>
                  <input
                    type="text"
                    value={subtheme}
                    onChange={(e) => setSubtheme(e.target.value)}
                    placeholder="Contoh: Kucing yang Lucu / Wortel yang Menyehatkan"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
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
                        Menyusun Lembar Aktivitas...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Generate LKPD Siap Pakai (1 Kredit)
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Side Info */}
            <div className="bg-purple-50 dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-4 text-xs text-neutral-800 dark:text-neutral-200 font-medium">
              <h4 className="font-black text-sm text-neutral-950 dark:text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-600" />
                Fitur Unggulan LKPD SiapAjar:
              </h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>Petunjuk belajar ramah anak & instruksi guru</li>
                <li>Stimulus cerita bergambar yang kontekstual</li>
                <li>Aktivitas motorik halus (Gunting-tempel, menebalkan)</li>
                <li>Aktivitas kognitif & bahasa (Mencocokkan, berhitung)</li>
                <li>Refleksi emosi anak (Emoji senyum/puas)</li>
              </ul>
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] text-xs">
                <FileSpreadsheet className="w-4 h-4 text-purple-600 inline mr-1" />{' '}
                <strong>Langsung Cetak:</strong> Lembar aktivitas otomatis diformat ke ukuran A4
                siap diprint langsung untuk seluruh siswa di kelas.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_#000000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tema LKPD..."
                  className="w-full rounded-2xl border-2 border-black bg-neutral-50 dark:bg-neutral-950 pl-10 pr-8 py-2 text-xs font-bold shadow-[2px_2px_0px_#000000]"
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
                <Plus className="w-4 h-4" /> Buat LKPD Baru
              </button>
            </div>

            {filteredList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <FileSpreadsheet className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                  Belum ada LKPD tersimpan
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Mulai buat lembar kerja siswa pertama Anda sekarang.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold">
                      <th className="pb-3 cursor-pointer" onClick={() => toggleSort('title')}>
                        <div className="flex items-center gap-1">
                          Judul & Tema
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
                      <th className="pb-3 cursor-pointer" onClick={() => toggleSort('theme')}>
                        <div className="flex items-center gap-1">
                          Sub-Tema
                          {sortField === 'theme' ? (
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
                    {paginatedList.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                      >
                        <td className="py-3 font-semibold text-neutral-900 dark:text-white">
                          <Link href={`/lkpd/${item.id}`} className="hover:text-purple-600">
                            {item.title}
                          </Link>
                        </td>
                        <td className="py-3 text-neutral-700 dark:text-neutral-300">
                          {item.subtheme || item.theme}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300">
                            {item.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                          <Link
                            href={`/lkpd/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-semibold"
                          >
                            Buka <ExternalLink className="w-3 h-3" />
                          </Link>
                          <a
                            href={`/lkpd/${item.id}/export`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200"
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
