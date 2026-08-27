import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import CurriculumGlossary from '~/components/dashboard/curriculum-glossary'
import { Head, useForm, router } from '@inertiajs/react'
import { useState } from 'react'
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
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] dark:bg-neutral-900 border-2 border-black dark:border-white">
        <div className="mb-4 flex items-center justify-between border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
          <h3 className="text-lg font-black text-neutral-950 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-transparent hover:border-black hover:bg-neutral-100 text-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:bg-neutral-800 font-bold transition-all text-xl leading-none"
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
      className={`rounded-2xl border-2 border-black dark:border-white p-4 transition-all duration-150 ${
        isSelectedInAtp
          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff]'
          : 'bg-white dark:bg-neutral-900 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000000] dark:hover:shadow-[4px_4px_0px_#ffffff]'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="badge-kawaii-amber !py-0.5 !px-2.5 !text-[11px]">
              {objective.code}
            </span>
            {indicators.length > 0 && (
              <button
                type="button"
                onClick={() => onToggleIndicators(objective.id)}
                className="badge-kawaii-sky !py-0.5 !px-2.5 !text-[11px] cursor-pointer hover:opacity-90"
              >
                <span>{indicators.length} IKTP</span>
                {showInd ? (
                  <ChevronUp className="h-3.5 w-3.5 ml-1 inline" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 ml-1 inline" />
                )}
              </button>
            )}
          </div>
          <p className="text-base font-bold text-neutral-950 dark:text-white leading-relaxed">
            {stripHtml(objective.title)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-tour="curriculum-iktp"
            onClick={() => onOpenIndicatorModal(objective.id)}
            className="btn-kawaii-secondary !py-1.5 !px-3 !text-xs !rounded-xl"
          >
            + IKTP
          </button>

          <button
            type="button"
            onClick={() => onAddToAtp(objective.id)}
            className={`btn-kawaii-primary !py-1.5 !px-3.5 !text-xs !rounded-xl ${
              isSelectedInAtp ? '!bg-emerald-300 dark:!bg-emerald-400' : ''
            }`}
          >
            {isSelectedInAtp ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Terpilih</span>
              </>
            ) : (
              <span>+ Pilih ke ATP</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDeleteObjective(objective)}
            className="rounded-xl p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
            title="Hapus Tujuan Pembelajaran (TP)"
            aria-label="Hapus TP"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showInd && indicators.length > 0 && (
        <div className="mt-3 border-t-2 border-dashed border-neutral-300 pt-3 dark:border-neutral-700 space-y-2">
          {indicators.map((ind) => (
            <div
              key={ind.id}
              className="flex items-start justify-between gap-3 rounded-2xl border-2 border-black dark:border-white bg-[#f8be9e]/20 dark:bg-[#f8be9e]/10 p-3 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]"
            >
              <div>
                <p className="text-sm font-bold text-neutral-950 dark:text-neutral-100">
                  • {ind.description}
                </p>
                {ind.achievementCriteria && (
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                    Kriteria: {ind.achievementCriteria}
                  </p>
                )}
              </div>
              <span className="badge-kawaii-emerald !py-0.5 !px-2 !text-[10px]">
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
    <div className="card-kawaii p-5 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
        <div>
          <h4 className="text-base font-black text-neutral-950 dark:text-white">
            {sequence.title}
          </h4>
          <span className="badge-kawaii-emerald !py-0.5 !px-2.5 !text-[11px] mt-1">
            {sequence.items?.length || 0} Langkah TP
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDeleteSequence(sequence)}
          className="btn-kawaii-secondary !py-1.5 !px-3 !text-xs !rounded-xl !text-red-600 !border-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/30"
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
              <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-black dark:border-white bg-emerald-100/90 px-3.5 py-2 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff] dark:bg-emerald-950/60">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="h-4 w-4 text-emerald-800 dark:text-emerald-300 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-100 truncate">
                    {group.unitTopic}
                  </span>
                </div>
                <span className="badge-kawaii-emerald !py-0.5 !px-2 !text-[10px]">
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
                    className="flex items-center justify-between gap-3 rounded-2xl border-2 border-black dark:border-white bg-white p-3.5 text-sm dark:bg-neutral-900 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black dark:border-white bg-emerald-300 text-xs font-black text-neutral-950 shadow-[1px_1px_0px_#000000]">
                        {globalIdx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        {targetObj ? (
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="badge-kawaii-amber !py-0.5 !px-2 !text-[10px]">
                                {targetObj.code}
                              </span>
                              {item.period && (
                                <span className="badge-kawaii-sky !py-0.5 !px-2 !text-[10px]">
                                  {item.period}
                                </span>
                              )}
                            </div>
                            <p className="font-bold text-neutral-950 dark:text-neutral-100 leading-relaxed">
                              {stripHtml(targetObj.title)}
                            </p>
                          </div>
                        ) : (
                          <div>
                            {item.period && (
                              <span className="badge-kawaii-sky !py-0.5 !px-2 !text-[10px] mb-1 inline-block">
                                {item.period}
                              </span>
                            )}
                            <p className="text-neutral-500 font-medium">
                              Tujuan Pembelajaran #{item.learningObjectiveId}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(sequence, item.learningObjectiveId)}
                      className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800 dark:hover:text-red-400 transition-colors shrink-0"
                      title="Keluarkan TP ini dari ATP"
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
  sequenceForm: any
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

  return (
    <Modal title="Simpan / Tambah Alur ATP" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(saveSequenceMode, selectedExistingSequenceId)
        }}
        className="space-y-4 text-sm"
      >
        <div className="flex rounded-2xl border-2 border-black dark:border-white p-1 bg-neutral-100 dark:bg-neutral-800 gap-1">
          <button
            type="button"
            onClick={() => setSaveSequenceMode('new')}
            className={`flex-1 rounded-xl py-2 text-xs font-black transition-all ${
              saveSequenceMode === 'new'
                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
            }`}
          >
            + Buat Dokumen ATP Baru
          </button>
          <button
            type="button"
            disabled={sequences.length === 0}
            onClick={() => setSaveSequenceMode('existing')}
            className={`flex-1 rounded-xl py-2 text-xs font-black transition-all ${
              saveSequenceMode === 'existing'
                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Gabungkan ke ATP Ada ({sequences.length})
          </button>
        </div>

        {saveSequenceMode === 'new' ? (
          <div>
            <label
              htmlFor="sequence-title"
              className="block font-black text-neutral-950 dark:text-neutral-100"
            >
              Judul Alur Tujuan Pembelajaran (ATP)
            </label>
            <input
              id="sequence-title"
              type="text"
              value={sequenceForm.data.title}
              onChange={(e) => sequenceForm.setData('title', e.target.value)}
              placeholder="Contoh: ATP Fase Fondasi Semester 1"
              className="mt-1 w-full rounded-2xl border-2 border-black dark:border-white p-3 text-sm dark:bg-neutral-800 dark:text-white font-bold focus:shadow-[3px_3px_0px_#000000]"
              required
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="existing-sequence-select"
                className="block font-black text-neutral-950 dark:text-neutral-100"
              >
                Pilih Alur ATP Target
              </label>
              <select
                id="existing-sequence-select"
                value={selectedExistingSequenceId}
                onChange={(e) => setSelectedExistingSequenceId(Number(e.target.value))}
                className="mt-1 w-full rounded-2xl border-2 border-black dark:border-white p-3 text-sm dark:bg-neutral-800 dark:text-white font-bold focus:shadow-[3px_3px_0px_#000000]"
              >
                {sequences.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.items?.length || 0} langkah)
                  </option>
                ))}
              </select>
            </div>

            {duplicateSelectedIds.length > 0 && (
              <div className="rounded-2xl border-2 border-black dark:border-white bg-amber-100 dark:bg-amber-950/40 p-3.5 text-xs font-bold text-amber-950 dark:text-amber-200 shadow-[2px_2px_0px_#000000]">
                <p className="font-black">Catatan Duplikasi:</p>
                <p className="mt-1">
                  {duplicateSelectedIds.length} dari {selectedObjectives.length} TP yang dipilih
                  sudah ada dalam alur ini. Hanya {newSelectedIds.length} TP baru yang akan
                  ditambahkan.
                </p>
              </div>
            )}

            {duplicateSelectedIds.length === 0 && newSelectedIds.length > 0 && (
              <div className="rounded-2xl border-2 border-black dark:border-white bg-emerald-100 dark:bg-emerald-950/40 p-3.5 text-xs font-bold text-emerald-950 dark:text-emerald-200 shadow-[2px_2px_0px_#000000]">
                <p className="font-black">Siap Ditambahkan:</p>
                <p className="mt-1">
                  Seluruh {newSelectedIds.length} TP akan ditambahkan ke urutan akhir Alur ATP
                  &quot;{targetSeq?.title}&quot;.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-kawaii-secondary !py-2 !px-4">
            Batal
          </button>
          <button
            type="submit"
            disabled={
              sequenceForm.processing ||
              (saveSequenceMode === 'existing' && newSelectedIds.length === 0)
            }
            className="btn-kawaii-primary !py-2 !px-4 disabled:opacity-50"
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
    <div className="grid gap-5 lg:grid-cols-[19rem_1fr]">
      <div
        data-tour="curriculum-cp"
        data-tour-ready={cps.length > 0 ? 'true' : 'false'}
        className="space-y-2.5"
      >
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
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
              className={`w-full rounded-2xl p-4 text-left transition-all border-2 border-black dark:border-white shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff] hover:-translate-y-0.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-300 dark:bg-emerald-400 text-neutral-950 font-black shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff]'
                  : 'bg-white text-neutral-950 hover:bg-emerald-50/60 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 font-bold'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-black leading-tight">{item.element}</span>
                <span
                  className={
                    isSelected
                      ? 'badge-kawaii-amber !py-0.5 !px-2.5 !text-[11px]'
                      : 'badge-kawaii-coral !py-0.5 !px-2.5 !text-[11px]'
                  }
                >
                  {tpCount} TP
                </span>
              </div>
              <span
                className={`mt-1.5 block text-xs font-medium line-clamp-2 ${
                  isSelected ? 'text-neutral-900' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {item.title}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {cp ? (
          <div className="card-kawaii p-6 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-3 dark:border-neutral-800">
              <div>
                <span className="badge-kawaii-emerald !py-0.5 !px-3 !text-xs">
                  {cp.code} · FASE FONDASI
                </span>
                <h3 className="text-xl font-black text-neutral-950 dark:text-white mt-2">
                  {cp.title}
                </h3>
              </div>
            </div>

            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              <p className={expandedCpDesc ? '' : 'line-clamp-2'}>{cp.description}</p>
              {cp.description.length > 150 && (
                <button
                  type="button"
                  onClick={onToggleCpDesc}
                  className="mt-1.5 text-xs font-black text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  {expandedCpDesc ? 'Sembunyikan deskripsi ▴' : 'Lihat deskripsi lengkap ▾'}
                </button>
              )}
            </div>

            <div
              data-tour="curriculum-tp"
              data-tour-ready={cp.learningObjectives.length > 0 ? 'true' : 'false'}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-2 dark:border-neutral-800">
                <p className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                  TUJUAN PEMBELAJARAN (TP)
                </p>
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
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
          <div className="rounded-3xl border-2 border-dashed border-neutral-400 p-8 text-center text-sm font-bold text-neutral-600 dark:text-neutral-400">
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
        <div
          data-tour="curriculum-intro"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-neutral-200 pb-4 dark:border-neutral-800"
        >
          <div>
            <h2 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              {isPaud ? `Kurikulum ${institutionLabel} · PAUD` : 'Kurikulum Sekolah Dasar'}
            </h2>
            <p
              data-tour="curriculum-flow"
              className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Kelola acuan capaian (CP), tujuan pembelajaran (TP), dan alur pembelajaran (ATP).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSeedPresets}
              disabled={loadingSeed}
              className="btn-kawaii-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loadingSeed ? 'Memuat...' : 'Contoh ATP Siap Pakai'}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowActionDropdown(!showActionDropdown)}
                className="btn-kawaii-secondary"
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
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border-2 border-black dark:border-white bg-white p-2 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] dark:bg-neutral-900">
                    <a
                      href="/curriculum/print"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShowActionDropdown(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-left text-sm font-bold text-neutral-800 hover:bg-emerald-50 hover:text-emerald-700 dark:text-neutral-200 dark:hover:bg-emerald-950/40"
                    >
                      <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Export PDF</span>
                    </a>

                    <a
                      href="/curriculum/export"
                      onClick={() => setShowActionDropdown(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-left text-sm font-bold text-neutral-800 hover:bg-emerald-50 hover:text-emerald-700 dark:text-neutral-200 dark:hover:bg-emerald-950/40"
                    >
                      <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Export DOCX</span>
                    </a>

                    <div className="my-1 border-t-2 border-neutral-100 dark:border-neutral-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowActionDropdown(false)
                        setShowResetConfirmModal(true)
                      }}
                      disabled={loadingReset}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-2 p-1.5 rounded-2xl border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-800/80 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${
                activeTab === 'explore'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Eksplor CP & TP</span>
              <span className="badge-kawaii-amber !py-0.2 !px-2 !text-[10px]">{cps.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('atp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${
                activeTab === 'atp'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Route className="h-4 w-4" />
              <span>Peta Alur ATP Saya ({sequences.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${
                activeTab === 'help'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
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
            className="btn-kawaii-amber"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah TP Custom</span>
          </button>
        </div>

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

        {activeTab === 'atp' && (
          <div className="space-y-4">
            <div className="card-kawaii p-6">
              <h3 className="flex items-center gap-2 text-lg font-black text-neutral-950 dark:text-white">
                <Route className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Alur Tujuan Pembelajaran (ATP) Tersimpan</span>
              </h3>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-1">
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
                <div className="mt-4 rounded-2xl border-2 border-dashed border-neutral-400 p-6 text-center text-sm font-bold text-neutral-600 dark:text-neutral-400">
                  Belum ada Alur ATP tersimpan. Pilih beberapa TP di tab &quot;Eksplor CP &amp;
                  TP&quot;, lalu simpan.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-4">
            <CurriculumGlossary />
          </div>
        )}

        {selectedObjectives.length > 0 && (
          <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-4 rounded-3xl bg-white text-neutral-950 border-2 border-black dark:border-white shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] backdrop-blur-md dark:bg-neutral-900 dark:text-white px-6 py-3.5">
            <span className="text-sm font-bold text-neutral-950 dark:text-white">
              <strong className="text-emerald-700 dark:text-emerald-400 font-black">
                {selectedObjectives.length} TP
              </strong>{' '}
              terpilih untuk Alur ATP
            </span>
            <button
              type="button"
              onClick={() => setShowSequenceModal(true)}
              className="btn-kawaii-primary !py-1.5 !px-4 !text-xs !rounded-xl"
            >
              Simpan ATP Baru ➔
            </button>
            <button
              type="button"
              onClick={() => setSelectedObjectives([])}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              Reset Pilihan
            </button>
          </div>
        )}
      </div>

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
                className="block font-black text-neutral-950 dark:text-neutral-100"
              >
                Kode TP (opsional)
              </label>
              <input
                id="objective-code"
                type="text"
                value={objectiveForm.data.code}
                onChange={(e) => objectiveForm.setData('code', e.target.value)}
                placeholder="Contoh: TP-NABP-04"
                className="mt-1 w-full rounded-2xl border-2 border-black dark:border-white p-3 text-sm dark:bg-neutral-800 dark:text-white font-bold focus:shadow-[3px_3px_0px_#000000]"
              />
            </div>
            <div>
              <label
                htmlFor="objective-title"
                className="block font-black text-neutral-950 dark:text-neutral-100"
              >
                Rumusan Tujuan Pembelajaran (TP)
              </label>
              <textarea
                id="objective-title"
                rows={3}
                value={objectiveForm.data.title}
                onChange={(e) => objectiveForm.setData('title', e.target.value)}
                placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
                className="mt-1 w-full rounded-2xl border-2 border-black dark:border-white p-3 text-sm dark:bg-neutral-800 dark:text-white font-bold focus:shadow-[3px_3px_0px_#000000]"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeObjective}
                className="btn-kawaii-secondary !py-2 !px-4"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={objectiveForm.processing}
                className="btn-kawaii-primary !py-2 !px-4"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showSequenceModal && (
        <SequenceSaveModal
          selectedObjectives={selectedObjectives}
          sequences={sequences}
          sequenceForm={sequenceForm}
          onClose={closeSequence}
          onSave={handleSaveSequence}
        />
      )}

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
                className="block font-black text-neutral-950 dark:text-neutral-100"
              >
                Deskripsi Perilaku / Bukti Diamati
              </label>
              <textarea
                id="indicator-description"
                rows={3}
                value={indicatorForm.data.description}
                onChange={(e) => indicatorForm.setData('description', e.target.value)}
                placeholder="Contoh: Anak dapat menyebutkan 3 ciptaan Allah saat diajak ke taman..."
                className="mt-1 w-full rounded-2xl border-2 border-black dark:border-white p-3 text-sm dark:bg-neutral-800 dark:text-white font-bold focus:shadow-[3px_3px_0px_#000000]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="indicator-evidence-type"
                className="block font-black text-neutral-950 dark:text-neutral-100"
              >
                Jenis Bukti Asesmen
              </label>
              <select
                id="indicator-evidence-type"
                value={indicatorForm.data.evidenceType}
                onChange={(e) => indicatorForm.setData('evidenceType', e.target.value)}
                className="mt-1 w-full rounded-2xl border-2 border-black dark:border-white p-3 text-sm dark:bg-neutral-800 dark:text-white font-bold focus:shadow-[3px_3px_0px_#000000]"
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
                className="block font-black text-neutral-950 dark:text-neutral-100"
              >
                Kriteria Ketuntasan (opsional)
              </label>
              <input
                id="indicator-criteria"
                type="text"
                value={indicatorForm.data.achievementCriteria}
                onChange={(e) => indicatorForm.setData('achievementCriteria', e.target.value)}
                placeholder="Contoh: Menyebutkan ciptaan Allah secara mandiri."
                className="mt-1 w-full rounded-2xl border-2 border-black dark:border-white p-3 text-sm dark:bg-neutral-800 dark:text-white font-bold focus:shadow-[3px_3px_0px_#000000]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeIndicator}
                className="btn-kawaii-secondary !py-2 !px-4"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={indicatorForm.processing}
                className="btn-kawaii-primary !py-2 !px-4"
              >
                Simpan IKTP
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showResetConfirmModal && (
        <Modal title="Konfirmasi Hapus Data Contoh" onClose={() => setShowResetConfirmModal(false)}>
          <div className="space-y-5 text-sm">
            <p className="text-neutral-800 dark:text-neutral-200 font-semibold leading-relaxed">
              Apakah Anda yakin ingin menghapus seluruh data contoh? Seluruh data contoh Alur Tujuan
              Pembelajaran (ATP) dan IKTP yang dimuat akan dihapus dari akun Anda.
            </p>

            <div className="flex justify-end gap-2.5 border-t-2 border-neutral-100 dark:border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="btn-kawaii-secondary !py-2 !px-4"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetPresets}
                disabled={loadingReset}
                className="btn-kawaii-primary !bg-red-500 hover:!bg-red-400 !text-white !py-2 !px-4 disabled:opacity-50"
              >
                {loadingReset ? 'Mereset...' : 'Ya, Hapus Data Contoh'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {sequenceToDelete && (
        <Modal title="Hapus Alur ATP" onClose={() => setSequenceToDelete(null)}>
          <div className="space-y-5 text-sm">
            <p className="text-neutral-800 dark:text-neutral-200 font-semibold leading-relaxed">
              Apakah Anda yakin ingin menghapus Alur ATP{' '}
              <strong className="text-neutral-950 dark:text-white font-black">
                &quot;{sequenceToDelete.title}&quot;
              </strong>
              ? Susunan Alur Tujuan Pembelajaran ini akan dihapus dari daftar. Langkah TP di
              dalamnya tidak akan terhapus dari daftar CP/TP.
            </p>

            <div className="flex justify-end gap-2.5 border-t-2 border-neutral-100 dark:border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setSequenceToDelete(null)}
                className="btn-kawaii-secondary !py-2 !px-4"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSequence}
                className="btn-kawaii-primary !bg-red-500 hover:!bg-red-400 !text-white !py-2 !px-4"
              >
                Ya, Hapus Alur ATP
              </button>
            </div>
          </div>
        </Modal>
      )}

      {objectiveToDelete && (
        <Modal title="Hapus Tujuan Pembelajaran (TP)" onClose={() => setObjectiveToDelete(null)}>
          <div className="space-y-5 text-sm">
            <p className="text-neutral-800 dark:text-neutral-200 font-semibold leading-relaxed">
              Apakah Anda yakin ingin menghapus Tujuan Pembelajaran{' '}
              <strong className="text-neutral-950 dark:text-white font-black">
                &quot;{objectiveToDelete.code} - {stripHtml(objectiveToDelete.title)}&quot;
              </strong>
              ? Seluruh indikator IKTP yang ada di dalamnya juga akan terhapus.
            </p>

            <div className="flex justify-end gap-2.5 border-t-2 border-neutral-100 dark:border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setObjectiveToDelete(null)}
                className="btn-kawaii-secondary !py-2 !px-4"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteObjective}
                className="btn-kawaii-primary !bg-red-500 hover:!bg-red-400 !text-white !py-2 !px-4"
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
