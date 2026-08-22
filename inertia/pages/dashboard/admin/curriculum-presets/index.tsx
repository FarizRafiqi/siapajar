import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import {
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { cn } from '~/lib/utils'

interface PresetData {
  description?: string
  dpl?: string[]
  kbcValues?: string[]
  loosePartsSuggestions?: string[]
}

interface CurriculumPreset {
  id: number
  educationLevel: 'tk' | 'sd' | 'smp' | 'sma'
  curriculumVersion: string
  semester: number
  weekNumber: number | null
  code: string
  themeTitle: string
  subthemeTitle: string | null
  phase: string
  groupContext: string | null
  data: PresetData | null
  isActive: boolean
  sortOrder: number
}

interface AdminCurriculumPresetsIndexProps {
  readonly presets: CurriculumPreset[]
  readonly activeLevel: string
  readonly activeSemester: number
}

export default function AdminCurriculumPresetsIndex({
  presets,
  activeLevel,
  activeSemester,
}: AdminCurriculumPresetsIndexProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(activeLevel)
  const [selectedSemester, setSelectedSemester] = useState<number>(activeSemester)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPreset, setEditingPreset] = useState<CurriculumPreset | null>(null)
  const [deletingPreset, setDeletingPreset] = useState<CurriculumPreset | null>(null)
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false)

  // Form for create / edit
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    educationLevel: 'tk' as 'tk' | 'sd' | 'smp' | 'sma',
    curriculumVersion: 'kbc_ra_2026',
    semester: 1,
    weekNumber: 1,
    code: '',
    themeTitle: '',
    subthemeTitle: '',
    phase: 'Fondasi',
    groupContext: 'Kelompok B (5-6 Tahun)',
    description: '',
    dpl: [] as string[],
    kbcValues: [] as string[],
    loosePartsSuggestions: [] as string[],
    isActive: true,
    sortOrder: 1,
  })

  const handleFilterChange = (level: string, semester: number) => {
    setSelectedLevel(level)
    setSelectedSemester(semester)
    router.get(
      '/admin/curriculum-presets',
      { level, semester },
      { preserveState: true, preserveScroll: true }
    )
  }

  const openCreateModal = () => {
    clearErrors()
    reset()
    setData({
      educationLevel: (selectedLevel as 'tk' | 'sd') || 'tk',
      curriculumVersion: 'kbc_ra_2026',
      semester: selectedSemester,
      weekNumber: presets.length + 1,
      code: `TK_B_S${selectedSemester}_W${String(presets.length + 1).padStart(2, '0')}`,
      themeTitle: '',
      subthemeTitle: '',
      phase: 'Fondasi',
      groupContext: 'Kelompok B (5-6 Tahun)',
      description: '',
      dpl: [
        'DPL 1: Keimanan & Ketakwaan',
        'DPL 2: Kewargaan & Kebangsaan',
        'DPL 3: Penalaran Kritis',
        'DPL 4: Kreativitas',
      ],
      kbcValues: ['Cinta Alloh & RosulNya', 'Cinta Diri & Sesama'],
      loosePartsSuggestions: ['Batu kerikil', 'Ranting pohon', 'Tutup botol', 'Kardus bekas'],
      isActive: true,
      sortOrder: presets.length + 1,
    })
    setShowCreateModal(true)
  }

  const openEditModal = (preset: CurriculumPreset) => {
    clearErrors()
    setEditingPreset(preset)
    setData({
      educationLevel: preset.educationLevel,
      curriculumVersion: preset.curriculumVersion,
      semester: preset.semester,
      weekNumber: preset.weekNumber ?? 1,
      code: preset.code,
      themeTitle: preset.themeTitle,
      subthemeTitle: preset.subthemeTitle ?? '',
      phase: preset.phase,
      groupContext: preset.groupContext ?? 'Kelompok B (5-6 Tahun)',
      description: preset.data?.description ?? '',
      dpl: preset.data?.dpl ?? [],
      kbcValues: preset.data?.kbcValues ?? [],
      loosePartsSuggestions: preset.data?.loosePartsSuggestions ?? [],
      isActive: preset.isActive,
      sortOrder: preset.sortOrder,
    })
  }

  const handleSave = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (editingPreset) {
      put(`/admin/curriculum-presets/${editingPreset.id}`, {
        onSuccess: () => {
          setEditingPreset(null)
          reset()
        },
      })
    } else {
      post('/admin/curriculum-presets', {
        onSuccess: () => {
          setShowCreateModal(false)
          reset()
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingPreset) return
    router.delete(`/admin/curriculum-presets/${deletingPreset.id}`, {
      onSuccess: () => setDeletingPreset(null),
    })
  }

  const handleResetDefaults = () => {
    router.post(
      '/admin/curriculum-presets/reset-defaults',
      { level: selectedLevel },
      {
        onSuccess: () => setShowResetConfirmModal(false),
      }
    )
  }

  return (
    <DashboardWrapper
      title="Preset Kurikulum"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Preset Kurikulum' }]}
    >
      <Head title="Preset Kurikulum - Admin" />

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Preset Topik & Kurikulum (KBC RA)
            </h2>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              Kelola master 18 pekan tema, subtopik, nilai KBC, dan DPL untuk Modul Ajar (RPM)
              otomatis guru.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <RotateCcw className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              Reset Standar Pemerintah
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Tema Pekan
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Jenjang:
            </span>
            <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              <button
                type="button"
                onClick={() => handleFilterChange('tk', selectedSemester)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  selectedLevel === 'tk'
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-neutral-700 dark:text-emerald-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                TK / RA (PAUD)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('sd', selectedSemester)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  selectedLevel === 'sd'
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-neutral-700 dark:text-emerald-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                SD / MI
              </button>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Semester:
            </span>
            <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              <button
                type="button"
                onClick={() => handleFilterChange(selectedLevel, 1)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  selectedSemester === 1
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-neutral-700 dark:text-emerald-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                Semester 1 (Ganjil)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange(selectedLevel, 2)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  selectedSemester === 2
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-neutral-700 dark:text-emerald-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                Semester 2 (Genap)
              </button>
            </div>
          </div>

          <div className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
            Total:{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">{presets.length}</span>{' '}
            tema terdaftar
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200 w-24">
                    Pekan
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Tema / Topik Utama
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Subtopik
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                    Panca Cinta & DPL
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200 w-28">
                    Status
                  </th>
                  <th className="px-4 py-3.5 font-semibold text-neutral-800 dark:text-neutral-200 text-right w-24">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {presets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <BookOpen className="mx-auto h-10 w-10 text-neutral-400" />
                      <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
                        Belum ada preset tema untuk jenjang & semester ini
                      </p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Klik tombol &quot;Reset Standar Pemerintah&quot; untuk mengisi otomatis 18
                        pekan tema KBC RA.
                      </p>
                    </td>
                  </tr>
                ) : (
                  presets.map((preset) => (
                    <tr
                      key={preset.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition"
                    >
                      <td className="px-4 py-3.5 align-top">
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300">
                          {preset.weekNumber ? `Mg ${preset.weekNumber}` : `#${preset.sortOrder}`}
                        </span>
                        <div className="mt-1 text-[11px] font-mono text-neutral-400">
                          {preset.code}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-top font-medium text-neutral-900 dark:text-white">
                        <div>{preset.themeTitle}</div>
                        {preset.data?.description && (
                          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 max-w-md">
                            {preset.data.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 align-top text-neutral-700 dark:text-neutral-300">
                        {preset.subthemeTitle || (
                          <span className="italic text-neutral-400 text-xs">
                            - Sama dengan topik -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {preset.data?.kbcValues?.slice(0, 2).map((v) => (
                            <span
                              key={v}
                              className="inline-block rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 shrink-0"
                            >
                              {v}
                            </span>
                          ))}
                          {preset.data?.dpl?.slice(0, 2).map((d) => (
                            <span
                              key={d}
                              className="inline-block rounded bg-sky-50 px-1.5 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-950/40 dark:text-sky-300 shrink-0"
                            >
                              {d.split(':')[0]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        {preset.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400">
                            <XCircle className="h-3.5 w-3.5" />
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(preset)}
                            className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                            title="Edit Tema"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingPreset(preset)}
                            className="rounded p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
                            title="Hapus Tema"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      {(showCreateModal || editingPreset) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              {editingPreset ? (
                <Edit className="h-5 w-5 text-emerald-600" />
              ) : (
                <Plus className="h-5 w-5 text-emerald-600" />
              )}
              {editingPreset ? 'Edit Preset Tema Pembelajaran' : 'Tambah Preset Tema Pembelajaran'}
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Preset ini akan menjadi opsi referensi tema yang di-generate oleh AI ke dalam Modul
              Ajar (RPM) guru.
            </p>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="field-educationLevel"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Jenjang
                  </label>
                  <select
                    id="field-educationLevel"
                    value={data.educationLevel}
                    onChange={(e) => setData('educationLevel', e.target.value as 'tk' | 'sd')}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="tk">TK / RA (PAUD)</option>
                    <option value="sd">SD / MI</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="field-semester"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Semester
                  </label>
                  <select
                    id="field-semester"
                    value={data.semester}
                    onChange={(e) => setData('semester', Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="field-weekNumber"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Minggu Ke- (Pekan)
                  </label>
                  <input
                    id="field-weekNumber"
                    type="number"
                    min={1}
                    max={25}
                    value={data.weekNumber}
                    onChange={(e) => setData('weekNumber', Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="field-code"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Kode Unik Preset
                  </label>
                  <input
                    id="field-code"
                    type="text"
                    required
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="Contoh: TK_B_S1_W01"
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-mono text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  {errors.code && <p className="mt-1 text-xs text-rose-600">{errors.code}</p>}
                </div>

                <div>
                  <label
                    htmlFor="field-groupContext"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Target Kelompok / Fase
                  </label>
                  <input
                    id="field-groupContext"
                    type="text"
                    value={data.groupContext}
                    onChange={(e) => setData('groupContext', e.target.value)}
                    placeholder="Kelompok B (5-6 Tahun)"
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="field-themeTitle"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Topik / Tema Utama
                </label>
                <input
                  id="field-themeTitle"
                  type="text"
                  required
                  value={data.themeTitle}
                  onChange={(e) => setData('themeTitle', e.target.value)}
                  placeholder="Contoh: Aku Hamba Allah yang Taat"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                {errors.themeTitle && (
                  <p className="mt-1 text-xs text-rose-600">{errors.themeTitle}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-subthemeTitle"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Subtopik / Subtema (Opsional)
                </label>
                <input
                  id="field-subthemeTitle"
                  type="text"
                  value={data.subthemeTitle}
                  onChange={(e) => setData('subthemeTitle', e.target.value)}
                  placeholder="Contoh: Mengenal Ciptaan Allah & Anggota Tubuh"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="field-description"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Deskripsi & Esensi Pembelajaran
                </label>
                <textarea
                  id="field-description"
                  rows={2}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Penjelasan ringkas fokus pembelajaran pekan ini..."
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="field-kbcValues"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Nilai Panca Cinta KBC (Pisahkan koma)
                  </label>
                  <input
                    id="field-kbcValues"
                    type="text"
                    value={data.kbcValues.join(', ')}
                    onChange={(e) =>
                      setData(
                        'kbcValues',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    placeholder="Cinta Alloh & RosulNya, Cinta Diri & Sesama"
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-dpl"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Dimensi Profil Lulusan / DPL (Pisahkan koma)
                  </label>
                  <input
                    id="field-dpl"
                    type="text"
                    value={data.dpl.join(', ')}
                    onChange={(e) =>
                      setData(
                        'dpl',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    placeholder="DPL 1: Keimanan, DPL 3: Penalaran Kritis"
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="field-loosePartsSuggestions"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Rekomendasi Loose Parts & Bahan Alam (Pisahkan koma)
                </label>
                <input
                  id="field-loosePartsSuggestions"
                  type="text"
                  value={data.loosePartsSuggestions.join(', ')}
                  onChange={(e) =>
                    setData(
                      'loosePartsSuggestions',
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Ranting, Kerang, Kardus bekas, Kancing baju"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={data.isActive}
                  onChange={(e) => setData('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label
                  htmlFor="isActiveToggle"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Preset aktif & dapat dipilih guru saat generate RPM
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPreset(null)
                  }}
                  className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : editingPreset ? 'Simpan Perubahan' : 'Tambah Tema'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Reset Standar */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Reset ke Standar Pemerintah?
              </h3>
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              Tindakan ini akan me-reset dan menyelaraskan seluruh 18 pekan tema pembelajaran KBC RA
              Semester 1 & 2 ke master resmi format Kemenag / Deep Learning.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Hapus Tema Preset?
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Apakah Anda yakin ingin menghapus tema &quot;{deletingPreset.themeTitle}&quot;? Data
              RPM guru yang sudah dibuat tidak akan terhapus.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingPreset(null)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  )
}
