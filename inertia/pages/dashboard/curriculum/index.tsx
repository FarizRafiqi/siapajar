import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import CurriculumGlossary from '~/components/dashboard/curriculum-glossary'
import { Head, useForm, router } from '@inertiajs/react'
import { useState, type SyntheticEvent } from 'react'
import {
  Compass,
  Route,
  Sparkles,
  Plus,
  Download,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  RotateCcw,
  Trash2,
  X,
  Layers,
} from 'lucide-react'

type GroupContextType = 'a' | 'b' | ''
type SaveSequenceMode = 'new' | 'existing'
type CurriculumTab = 'explore' | 'atp' | 'help'

interface Indicator {
  id: number
  description: string
  evidenceType: string
  achievementCriteria: string
}
interface Objective {
  id: number
  cpId: number
  code: string
  title: string
  groupContext: 'a' | 'b' | null
  indicators: Indicator[]
}
interface Cp {
  id: number
  code: string
  element: string
  title: string
  description: string
  learningObjectives: Objective[]
}
interface Sequence {
  id: number
  title: string
  educationLevel: 'tk' | 'sd'
  groupContext: 'a' | 'b' | null
  status: string
  items: Array<{
    learningObjectiveId: number
    order: number
    period?: string
    unitTopic?: string
  }>
}
interface Props {
  readonly cps: Cp[]
  readonly sequences: Sequence[]
  readonly profile: {
    educationLevel: string | null
    institutionType: string | null
    curriculumVersion: string | null
    defaultGroupContext: string | null
  }
}

function formatLabel(str: string | null | undefined): string {
  if (!str) return ''
  return str.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function stripHtml(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .split('<')
    .map((part) => part.substring(part.indexOf('>') + 1))
    .join('')
}

function Modal({
  title,
  onClose,
  children,
}: Readonly<{ title: string; onClose: () => void; children: React.ReactNode }>) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
        <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white text-xl leading-none"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ObjectiveCard({
  objective,
  isSelectedInAtp,
  showInd,
  onToggleIndicators,
  onOpenIndicatorModal,
  onAddToAtp,
  onDeleteObjective,
}: Readonly<{
  objective: Objective
  isSelectedInAtp: boolean
  showInd: boolean
  onToggleIndicators: (id: number) => void
  onOpenIndicatorModal: (id: number) => void
  onAddToAtp: (id: number) => void
  onDeleteObjective: (objective: Objective) => void
}>) {
  const indicators = objective.indicators || []

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isSelectedInAtp
          ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/30 shadow-sm'
          : 'border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-bold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
              {objective.code}
            </span>
            {indicators.length > 0 && (
              <button
                type="button"
                onClick={() => onToggleIndicators(objective.id)}
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline dark:text-purple-300"
              >
                <span>{indicators.length} IKTP</span>
                {showInd ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
          <p className="text-base font-semibold text-neutral-900 dark:text-white leading-relaxed">
            {stripHtml(objective.title)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-tour="curriculum-iktp"
            onClick={() => onOpenIndicatorModal(objective.id)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            + IKTP
          </button>

          <button
            type="button"
            onClick={() => onAddToAtp(objective.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-bold transition ${
              isSelectedInAtp
                ? 'bg-emerald-600 text-white shadow'
                : 'border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-500'
            }`}
          >
            {isSelectedInAtp ? (
              <>
                <Check className="h-4 w-4" />
                <span>Terpilih</span>
              </>
            ) : (
              <span>+ Pilih ke ATP</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDeleteObjective(objective)}
            className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
            title="Hapus Tujuan Pembelajaran (TP)"
            aria-label="Hapus TP"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Collapsible IKTP Section */}
      {showInd && indicators.length > 0 && (
        <div className="mt-3 border-t border-dashed border-neutral-300 pt-3 dark:border-neutral-700 space-y-2">
          {indicators.map((ind) => (
            <div
              key={ind.id}
              className="flex items-start justify-between gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800/80"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  • {ind.description}
                </p>
                {ind.achievementCriteria && (
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Kriteria: {ind.achievementCriteria}
                  </p>
                )}
              </div>
              <span className="rounded bg-neutral-300 px-2 py-0.5 text-xs font-bold text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100 shrink-0">
                {formatLabel(ind.evidenceType)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SequenceCard({
  sequence,
  allObjectivesMap,
  onRemoveItem,
  onDeleteSequence,
}: Readonly<{
  sequence: Sequence
  allObjectivesMap: Map<number, Objective>
  onRemoveItem: (seq: Sequence, objectiveId: number) => void
  onDeleteSequence: (seq: Sequence) => void
}>) {
  const groupedItems: Array<{
    unitTopic?: string
    items: Array<{ item: Sequence['items'][0]; globalIdx: number }>
  }> = []

  let currentGroup: {
    unitTopic?: string
    items: Array<{ item: Sequence['items'][0]; globalIdx: number }>
  } | null = null

  sequence.items?.forEach((item, idx) => {
    const itemUnit = item.unitTopic || ''
    if (!currentGroup || (currentGroup.unitTopic || '') !== itemUnit) {
      currentGroup = {
        unitTopic: item.unitTopic,
        items: [{ item, globalIdx: idx }],
      }
      groupedItems.push(currentGroup)
    } else {
      currentGroup.items.push({ item, globalIdx: idx })
    }
  })

  return (
    <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-800/40 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-700">
        <div>
          <h4 className="text-base font-bold text-neutral-900 dark:text-white">{sequence.title}</h4>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {sequence.items?.length || 0} Langkah Tujuan Pembelajaran
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDeleteSequence(sequence)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 transition-colors"
          title="Hapus Alur ATP Ini"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Hapus ATP</span>
        </button>
      </div>

      <div className="space-y-4">
        {groupedItems.map((group, gIdx) => (
          <div key={`group-${sequence.id}-${gIdx}`} className="space-y-2">
            {group.unitTopic && (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-emerald-100/70 px-3.5 py-2 border border-emerald-300/80 dark:bg-emerald-950/50 dark:border-emerald-800">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-100 truncate">
                    {group.unitTopic}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-bold text-white dark:bg-emerald-600">
                  {group.items.length} TP
                </span>
              </div>
            )}

            <div className="space-y-2">
              {group.items.map(({ item, globalIdx }) => {
                const targetObj = allObjectivesMap.get(item.learningObjectiveId)
                return (
                  <div
                    key={`${sequence.id}-${item.learningObjectiveId}-${globalIdx}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-neutral-300 bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        {globalIdx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        {targetObj ? (
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                {targetObj.code}
                              </span>
                              {item.period && (
                                <span className="rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-bold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                  {item.period}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                              {stripHtml(targetObj.title)}
                            </p>
                          </div>
                        ) : (
                          <div>
                            {item.period && (
                              <span className="rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-bold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 mb-1 inline-block">
                                {item.period}
                              </span>
                            )}
                            <p className="text-neutral-500">
                              Tujuan Pembelajaran #{item.learningObjectiveId}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(sequence, item.learningObjectiveId)}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800 dark:hover:text-red-400 transition-colors shrink-0"
                      title="Keluarkankan TP ini dari ATP"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SequenceSaveModal({
  selectedObjectives,
  sequences,
  sequenceForm,
  onClose,
  onSave,
}: Readonly<{
  selectedObjectives: number[]
  sequences: Sequence[]
  sequenceForm: ReturnType<
    typeof useForm<{
      title: string
      educationLevel: 'tk' | 'sd'
      groupContext: GroupContextType
      items: Array<{ learningObjectiveId: number; order: number }>
    }>
  >
  onClose: () => void
  onSave: (mode: SaveSequenceMode, targetSequenceId?: number) => void
}>) {
  const [saveSequenceMode, setSaveSequenceMode] = useState<SaveSequenceMode>('new')
  const [selectedExistingSequenceId, setSelectedExistingSequenceId] = useState<number>(
    sequences[0]?.id ?? 0
  )

  const targetSeq = sequences.find((s) => s.id === selectedExistingSequenceId)
  const existingObjIdsInTarget = new Set(targetSeq?.items?.map((i) => i.learningObjectiveId) ?? [])
  const newSelectedIds = selectedObjectives.filter((id) => !existingObjIdsInTarget.has(id))
  const duplicateSelectedIds = selectedObjectives.filter((id) => existingObjIdsInTarget.has(id))

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSave(saveSequenceMode, selectedExistingSequenceId)
  }

  return (
    <Modal title={`Simpan Alur ATP (${selectedObjectives.length} TP Terpilih)`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {sequences.length > 0 && (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-100 p-1.5 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => setSaveSequenceMode('new')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                saveSequenceMode === 'new'
                  ? 'bg-white text-neutral-900 shadow dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Buat ATP Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setSaveSequenceMode('existing')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                saveSequenceMode === 'existing'
                  ? 'bg-white text-neutral-900 shadow dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Tambahkan ke ATP yang Ada</span>
            </button>
          </div>
        )}

        {saveSequenceMode === 'new' ? (
          <div>
            <label
              htmlFor="sequence-title"
              className="block font-bold text-neutral-900 dark:text-neutral-100"
            >
              Judul Alur ATP Baru
            </label>
            <input
              id="sequence-title"
              type="text"
              value={sequenceForm.data.title}
              onChange={(e) => sequenceForm.setData('title', e.target.value)}
              placeholder="Contoh: ATP Semester 1 Kelompok B"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white font-medium"
              required
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="select-existing-sequence"
                className="block font-bold text-neutral-900 dark:text-neutral-100"
              >
                Pilih Alur ATP Tujuan
              </label>
              <select
                id="select-existing-sequence"
                value={selectedExistingSequenceId}
                onChange={(e) => setSelectedExistingSequenceId(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white font-medium"
              >
                {sequences.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.items?.length || 0} TP)
                  </option>
                ))}
              </select>
            </div>

            {duplicateSelectedIds.length > 0 && newSelectedIds.length > 0 && (
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3.5 border border-indigo-200 dark:border-indigo-900/50 text-xs font-medium text-indigo-900 dark:text-indigo-200">
                <p className="font-bold">Informasi Penambahan TP:</p>
                <p className="mt-1">
                  • <strong>{newSelectedIds.length} TP baru</strong> akan ditambahkan ke alur ini.
                  <br />• <strong>{duplicateSelectedIds.length} TP yang sudah ada</strong> di Alur
                  ATP ini akan dilewati secara otomatis untuk mencegah duplikasi.
                </p>
              </div>
            )}

            {newSelectedIds.length === 0 && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3.5 border border-amber-200 dark:border-amber-900/50 text-xs font-medium text-amber-900 dark:text-amber-200">
                <p className="font-bold text-amber-800 dark:text-amber-300">Semua TP Sudah Ada!</p>
                <p className="mt-1">
                  Seluruh {selectedObjectives.length} TP yang Anda pilih sudah terdaftar di Alur ATP
                  &quot;{targetSeq?.title}&quot;. Silakan pilih TP lain atau buat ATP baru.
                </p>
              </div>
            )}

            {duplicateSelectedIds.length === 0 && newSelectedIds.length > 0 && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3.5 border border-emerald-200 dark:border-emerald-900/50 text-xs font-medium text-emerald-900 dark:text-emerald-200">
                <p className="font-bold">Siap Ditambahkan:</p>
                <p className="mt-1">
                  Seluruh {newSelectedIds.length} TP akan ditambahkan ke urutan akhir Alur ATP
                  &quot;
                  {targetSeq?.title}&quot;.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 font-bold text-neutral-800 dark:text-neutral-200"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={
              sequenceForm.processing ||
              (saveSequenceMode === 'existing' && newSelectedIds.length === 0)
            }
            className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white disabled:opacity-50"
          >
            {saveSequenceMode === 'new' ? 'Simpan ATP Baru' : 'Tambahkan ke ATP'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ExploreTab({
  cps,
  cp,
  selectedCp,
  selectedObjectives,
  expandedCpDesc,
  expandedTpIndicators,
  onSelectCp,
  onToggleCpDesc,
  onToggleIndicators,
  onOpenIndicatorModal,
  onAddToAtp,
  onDeleteObjective,
}: Readonly<{
  cps: Cp[]
  cp?: Cp
  selectedCp: number
  selectedObjectives: number[]
  expandedCpDesc: boolean
  expandedTpIndicators: Record<number, boolean>
  onSelectCp: (id: number) => void
  onToggleCpDesc: () => void
  onToggleIndicators: (id: number) => void
  onOpenIndicatorModal: (id: number) => void
  onAddToAtp: (id: number) => void
  onDeleteObjective: (objective: Objective) => void
}>) {
  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      {/* Left Sidebar: Minimalist CP List */}
      <div
        data-tour="curriculum-cp"
        data-tour-ready={cps.length > 0 ? 'true' : 'false'}
        className="space-y-2"
      >
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
          PILIH ELEMEN CP
        </p>
        {cps.map((item) => {
          const isSelected = item.id === selectedCp
          const tpCount = item.learningObjectives?.length || 0
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCp(item.id)}
              className={`w-full rounded-xl p-3.5 text-left transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold leading-tight">{item.element}</span>
                <span
                  className={`shrink-0 whitespace-nowrap text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-emerald-800 text-white'
                      : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {tpCount} TP
                </span>
              </div>
              <span
                className={`mt-1.5 block text-xs font-medium line-clamp-2 ${
                  isSelected ? 'text-emerald-100' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {item.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right Main Content Area */}
      <div className="space-y-4">
        {cp ? (
          <div className="rounded-2xl border border-neutral-300 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  {cp.code} · FASE FONDASI
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{cp.title}</h3>
              </div>
            </div>

            {/* CP Narrative with Length Threshold */}
            <div className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-200">
              <p className={expandedCpDesc ? '' : 'line-clamp-2'}>{cp.description}</p>
              {cp.description.length > 150 && (
                <button
                  type="button"
                  onClick={onToggleCpDesc}
                  className="mt-1.5 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  {expandedCpDesc ? 'Sembunyikan deskripsi ▴' : 'Lihat deskripsi lengkap ▾'}
                </button>
              )}
            </div>

            {/* Objectives Clean List */}
            <div
              data-tour="curriculum-tp"
              data-tour-ready={cp.learningObjectives.length > 0 ? 'true' : 'false'}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2 dark:border-neutral-800">
                <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  TUJUAN PEMBELAJARAN (TP)
                </p>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  Pilih TP yang ingin Anda susun ke ATP
                </span>
              </div>

              {cp.learningObjectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  isSelectedInAtp={selectedObjectives.includes(objective.id)}
                  showInd={expandedTpIndicators[objective.id] || false}
                  onToggleIndicators={onToggleIndicators}
                  onOpenIndicatorModal={onOpenIndicatorModal}
                  onAddToAtp={onAddToAtp}
                  onDeleteObjective={onDeleteObjective}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-400 p-8 text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Pilih salah satu elemen CP di sebelah kiri.
          </div>
        )}
      </div>
    </div>
  )
}

export default function CurriculumIndex({ cps, sequences, profile }: Props) {
  const isPaud = profile.educationLevel === 'tk'
  const institutionLabel = profile.institutionType === 'ra' ? 'RA' : 'TK'

  const [activeTab, setActiveTab] = useState<CurriculumTab>('explore')
  const [selectedCp, setSelectedCp] = useState(cps[0]?.id ?? 0)
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([])
  const [showObjectiveModal, setShowObjectiveModal] = useState(false)
  const [showSequenceModal, setShowSequenceModal] = useState(false)
  const [showIndicatorModal, setShowIndicatorModal] = useState(false)
  const [expandedCpDesc, setExpandedCpDesc] = useState(false)
  const [expandedTpIndicators, setExpandedTpIndicators] = useState<Record<number, boolean>>({})
  const [loadingSeed, setLoadingSeed] = useState(false)
  const [loadingReset, setLoadingReset] = useState(false)
  const [showActionDropdown, setShowActionDropdown] = useState(false)
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false)
  const [sequenceToDelete, setSequenceToDelete] = useState<Sequence | null>(null)
  const [objectiveToDelete, setObjectiveToDelete] = useState<Objective | null>(null)

  const objectiveForm = useForm<{
    cpId: number
    code: string
    title: string
    groupContext: GroupContextType
  }>({
    cpId: selectedCp,
    code: '',
    title: '',
    groupContext: (profile.defaultGroupContext ?? '') as GroupContextType,
  })
  const sequenceForm = useForm({
    title: '',
    educationLevel: (profile.educationLevel === 'sd' ? 'sd' : 'tk') as 'tk' | 'sd',
    groupContext: (profile.defaultGroupContext ?? '') as GroupContextType,
    items: [] as Array<{ learningObjectiveId: number; order: number }>,
  })
  const indicatorForm = useForm({
    learningObjectiveId: 0,
    description: '',
    evidenceType: 'observasi',
    achievementCriteria: '',
  })
  const cp = cps.find((item) => item.id === selectedCp)

  const closeObjective = () => {
    setShowObjectiveModal(false)
    objectiveForm.reset()
  }
  const closeSequence = () => {
    setShowSequenceModal(false)
    sequenceForm.reset()
  }
  const closeIndicator = () => {
    setShowIndicatorModal(false)
    indicatorForm.reset()
  }
  const addToAtp = (id: number) =>
    setSelectedObjectives((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )

  const toggleIndicators = (tpId: number) => {
    setExpandedTpIndicators((prev) => ({
      ...prev,
      [tpId]: !prev[tpId],
    }))
  }

  const handleSeedPresets = () => {
    setLoadingSeed(true)
    router.post(
      '/curriculum/seed-presets',
      {},
      {
        onFinish: () => setLoadingSeed(false),
      }
    )
  }

  const handleResetPresets = () => {
    setLoadingReset(true)
    router.post(
      '/curriculum/reset-presets',
      {},
      {
        onFinish: () => {
          setLoadingReset(false)
          setShowResetConfirmModal(false)
        },
      }
    )
  }

  const handleSaveSequence = (mode: SaveSequenceMode, targetSequenceId?: number) => {
    if (mode === 'new') {
      sequenceForm.setData(
        'items',
        selectedObjectives.map((id, index) => ({ learningObjectiveId: id, order: index + 1 }))
      )
      sequenceForm.post('/curriculum/sequences', {
        onSuccess: () => {
          closeSequence()
          setSelectedObjectives([])
        },
      })
    } else {
      const targetSeq = sequences.find((s) => s.id === targetSequenceId)
      if (!targetSeq) return

      const existingObjIds = new Set(targetSeq.items.map((i) => i.learningObjectiveId))
      const newSelectedIds = selectedObjectives.filter((id) => !existingObjIds.has(id))

      if (newSelectedIds.length === 0) return

      const mergedItems = [
        ...targetSeq.items,
        ...newSelectedIds.map((id, idx) => ({
          learningObjectiveId: id,
          order: targetSeq.items.length + idx + 1,
        })),
      ]

      router.put(
        `/curriculum/sequences/${targetSeq.id}`,
        { items: mergedItems },
        {
          onSuccess: () => {
            closeSequence()
            setSelectedObjectives([])
          },
        }
      )
    }
  }

  const handleRemoveItemFromSequence = (seq: Sequence, objectiveId: number) => {
    const updatedItems = seq.items
      .filter((i) => i.learningObjectiveId !== objectiveId)
      .map((item, idx) => ({ ...item, order: idx + 1 }))

    router.put(`/curriculum/sequences/${seq.id}`, { items: updatedItems })
  }

  const handleDeleteSequence = () => {
    if (!sequenceToDelete) return
    router.delete(`/curriculum/sequences/${sequenceToDelete.id}`, {
      onSuccess: () => setSequenceToDelete(null),
    })
  }

  const handleDeleteObjective = () => {
    if (!objectiveToDelete) return
    router.delete(`/curriculum/objectives/${objectiveToDelete.id}`, {
      onSuccess: () => setObjectiveToDelete(null),
    })
  }

  const allObjectivesMap = new Map<number, Objective>()
  cps.forEach((c) => {
    c.learningObjectives?.forEach((o) => {
      allObjectivesMap.set(o.id, o)
    })
  })

  return (
    <DashboardWrapper
      title="Kurikulum: CP, TP & ATP"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'CP, TP & ATP' }]}
    >
      <Head title="CP, TP & ATP - Kurikulum SiapAjar" />

      <div className="space-y-6">
        {/* Minimalist Top Header Bar */}
        <div
          data-tour="curriculum-intro"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-300 pb-4 dark:border-neutral-700"
        >
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {isPaud ? `Kurikulum ${institutionLabel} · PAUD` : 'Kurikulum Sekolah Dasar'}
            </h2>
            <p
              data-tour="curriculum-flow"
              className="mt-1 text-sm text-neutral-700 dark:text-neutral-200"
            >
              Kelola acuan capaian (CP), tujuan pembelajaran (TP), dan alur pembelajaran (ATP).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSeedPresets}
              disabled={loadingSeed}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{loadingSeed ? 'Memuat...' : 'Contoh ATP Siap Pakai'}</span>
            </button>

            {/* Consolidated Actions & Export Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowActionDropdown(!showActionDropdown)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <span>Aksi & Opsi</span>
                <ChevronDown className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
              </button>

              {showActionDropdown && (
                <>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="fixed inset-0 z-10 cursor-default border-0 bg-transparent p-0"
                    onClick={() => setShowActionDropdown(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-neutral-300 bg-white py-1.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                    <a
                      href="/curriculum/print"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShowActionDropdown(false)}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Download className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      <span>Export PDF</span>
                    </a>

                    <a
                      href="/curriculum/export"
                      onClick={() => setShowActionDropdown(false)}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <FileText className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      <span>Export DOCX</span>
                    </a>

                    <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowActionDropdown(false)
                        setShowResetConfirmModal(true)
                      }}
                      disabled={loadingReset}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <RotateCcw className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span>{loadingReset ? 'Mereset...' : 'Hapus Data Contoh'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* High Contrast 2-Tab Navigation */}
        <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-700">
          <nav className="-mb-px flex space-x-6">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'explore'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300'
                  : 'border-transparent text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Eksplor CP & TP</span>
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                {cps.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('atp')}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'atp'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300'
                  : 'border-transparent text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              }`}
            >
              <Route className="h-4 w-4" />
              <span>Peta Alur ATP Saya ({sequences.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'help'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300'
                  : 'border-transparent text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Glosarium</span>
            </button>
          </nav>

          <button
            type="button"
            onClick={() => {
              objectiveForm.setData('cpId', selectedCp)
              setShowObjectiveModal(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah TP Custom</span>
          </button>
        </div>

        {/* TAB 1: EKSPLOR CP & TP */}
        {activeTab === 'explore' && (
          <ExploreTab
            cps={cps}
            cp={cp}
            selectedCp={selectedCp}
            selectedObjectives={selectedObjectives}
            expandedCpDesc={expandedCpDesc}
            expandedTpIndicators={expandedTpIndicators}
            onSelectCp={(id) => {
              setSelectedCp(id)
              objectiveForm.setData('cpId', id)
            }}
            onToggleCpDesc={() => setExpandedCpDesc(!expandedCpDesc)}
            onToggleIndicators={toggleIndicators}
            onOpenIndicatorModal={(id) => {
              indicatorForm.setData('learningObjectiveId', id)
              setShowIndicatorModal(true)
            }}
            onAddToAtp={addToAtp}
            onDeleteObjective={setObjectiveToDelete}
          />
        )}

        {/* TAB 2: PETA ALUR ATP TERSIMPAN */}
        {activeTab === 'atp' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-300 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                <Route className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Alur Tujuan Pembelajaran (ATP) Tersimpan</span>
              </h3>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                Daftar urutan pembelajaran yang telah Anda susun untuk diajarkan di kelas.
              </p>

              {sequences.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {sequences.map((seq) => (
                    <SequenceCard
                      key={seq.id}
                      sequence={seq}
                      allObjectivesMap={allObjectivesMap}
                      onRemoveItem={handleRemoveItemFromSequence}
                      onDeleteSequence={setSequenceToDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-neutral-400 p-6 text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Belum ada Alur ATP tersimpan. Pilih beberapa TP di tab &quot;Eksplor CP &amp;
                  TP&quot;, lalu simpan.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GLOSARIUM */}
        {activeTab === 'help' && (
          <div className="space-y-4">
            <CurriculumGlossary />
          </div>
        )}

        {/* Sticky Floating Bottom Bar for ATP Creation when items selected */}
        {selectedObjectives.length > 0 && (
          <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-4 rounded-full bg-white text-neutral-900 border border-neutral-300 shadow-2xl backdrop-blur-md dark:bg-neutral-900 dark:text-white dark:border-neutral-700 px-6 py-3.5">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                {selectedObjectives.length} TP
              </strong>{' '}
              terpilih untuk Alur ATP
            </span>
            <button
              type="button"
              onClick={() => setShowSequenceModal(true)}
              className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors"
            >
              Simpan ATP Baru ➔
            </button>
            <button
              type="button"
              onClick={() => setSelectedObjectives([])}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              Reset Pilihan
            </button>
          </div>
        )}
      </div>

      {/* Modal Tambah TP Custom */}
      {showObjectiveModal && (
        <Modal title="Tambah TP Custom" onClose={closeObjective}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              objectiveForm.post('/curriculum/objectives', { onSuccess: closeObjective })
            }}
            className="space-y-4 text-sm"
          >
            <div>
              <label
                htmlFor="objective-code"
                className="block font-bold text-neutral-900 dark:text-neutral-100"
              >
                Kode TP (opsional)
              </label>
              <input
                id="objective-code"
                type="text"
                value={objectiveForm.data.code}
                onChange={(e) => objectiveForm.setData('code', e.target.value)}
                placeholder="Contoh: TP-NABP-04"
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white font-medium"
              />
            </div>
            <div>
              <label
                htmlFor="objective-title"
                className="block font-bold text-neutral-900 dark:text-neutral-100"
              >
                Rumusan Tujuan Pembelajaran (TP)
              </label>
              <textarea
                id="objective-title"
                rows={3}
                value={objectiveForm.data.title}
                onChange={(e) => objectiveForm.setData('title', e.target.value)}
                placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white font-medium"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeObjective}
                className="rounded-lg border px-4 py-2 font-bold text-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={objectiveForm.processing}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Simpan / Tambah Alur ATP (Mendukung ATP Baru & ATP yang Sudah Ada) */}
      {showSequenceModal && (
        <SequenceSaveModal
          selectedObjectives={selectedObjectives}
          sequences={sequences}
          sequenceForm={sequenceForm}
          onClose={closeSequence}
          onSave={handleSaveSequence}
        />
      )}

      {/* Modal Tambah IKTP / Bukti Diamati */}
      {showIndicatorModal && (
        <Modal title="Tambah IKTP / Bukti Diamati" onClose={closeIndicator}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              indicatorForm.post('/curriculum/indicators', { onSuccess: closeIndicator })
            }}
            className="space-y-4 text-sm"
          >
            <div>
              <label
                htmlFor="indicator-description"
                className="block font-bold text-neutral-900 dark:text-neutral-100"
              >
                Deskripsi Perilaku / Bukti Diamati
              </label>
              <textarea
                id="indicator-description"
                rows={3}
                value={indicatorForm.data.description}
                onChange={(e) => indicatorForm.setData('description', e.target.value)}
                placeholder="Contoh: Anak dapat menyebutkan 3 ciptaan Allah saat diajak ke taman..."
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white font-medium"
                required
              />
            </div>
            <div>
              <label
                htmlFor="indicator-evidence-type"
                className="block font-bold text-neutral-900 dark:text-neutral-100"
              >
                Jenis Bukti Asesmen
              </label>
              <select
                id="indicator-evidence-type"
                value={indicatorForm.data.evidenceType}
                onChange={(e) => indicatorForm.setData('evidenceType', e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white font-medium"
              >
                <option value="observasi">Observasi Langsung</option>
                <option value="catatan_anekdot">Catatan Anekdot</option>
                <option value="hasil_karya">Hasil Karya</option>
                <option value="foto_berseri">Foto Berseri</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="indicator-criteria"
                className="block font-bold text-neutral-900 dark:text-neutral-100"
              >
                Kriteria Ketuntasan (opsional)
              </label>
              <input
                id="indicator-criteria"
                type="text"
                value={indicatorForm.data.achievementCriteria}
                onChange={(e) => indicatorForm.setData('achievementCriteria', e.target.value)}
                placeholder="Contoh: Menyebutkan ciptaan Allah secara mandiri."
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white font-medium"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeIndicator}
                className="rounded-lg border px-4 py-2 font-bold text-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={indicatorForm.processing}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white"
              >
                Simpan IKTP
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus Data Contoh (Clean Flat Modal) */}
      {showResetConfirmModal && (
        <Modal title="Konfirmasi Hapus Data Contoh" onClose={() => setShowResetConfirmModal(false)}>
          <div className="space-y-5 text-sm">
            <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
              Apakah Anda yakin ingin menghapus seluruh data contoh? Seluruh data contoh Alur Tujuan
              Pembelajaran (ATP) dan IKTP yang dimuat akan dihapus dari akun Anda.
            </p>

            <div className="flex justify-end gap-2.5 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetPresets}
                disabled={loadingReset}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loadingReset ? 'Mereset...' : 'Ya, Hapus Data Contoh'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus Sequence ATP (Clean Flat Modal) */}
      {sequenceToDelete && (
        <Modal title="Hapus Alur ATP" onClose={() => setSequenceToDelete(null)}>
          <div className="space-y-5 text-sm">
            <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
              Apakah Anda yakin ingin menghapus Alur ATP{' '}
              <strong className="text-neutral-900 dark:text-white">
                &quot;{sequenceToDelete.title}&quot;
              </strong>
              ? Susunan Alur Tujuan Pembelajaran ini akan dihapus dari daftar. Langkah TP di
              dalamnya tidak akan terhapus dari daftar CP/TP.
            </p>

            <div className="flex justify-end gap-2.5 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setSequenceToDelete(null)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSequence}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Ya, Hapus Alur ATP
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus Tujuan Pembelajaran (TP) */}
      {objectiveToDelete && (
        <Modal title="Hapus Tujuan Pembelajaran (TP)" onClose={() => setObjectiveToDelete(null)}>
          <div className="space-y-5 text-sm">
            <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
              Apakah Anda yakin ingin menghapus Tujuan Pembelajaran{' '}
              <strong className="text-neutral-900 dark:text-white">
                &quot;{objectiveToDelete.code} - {stripHtml(objectiveToDelete.title)}&quot;
              </strong>
              ? Seluruh indikator IKTP yang ada di dalamnya juga akan terhapus.
            </p>

            <div className="flex justify-end gap-2.5 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setObjectiveToDelete(null)}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteObjective}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 shadow"
              >
                <Trash2 className="h-4 w-4" />
                <span>Ya, Hapus TP</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardWrapper>
  )
}
