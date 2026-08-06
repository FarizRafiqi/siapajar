import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import CurriculumGlossary from '~/components/dashboard/curriculum-glossary'
import RichTextEditor from '~/components/ui/rich-text-editor'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'

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
  items: Array<{ learningObjectiveId: number; order: number; period?: string }>
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

function Modal({
  title,
  onClose,
  children,
}: Readonly<{ title: string; onClose: () => void; children: React.ReactNode }>) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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

export default function CurriculumIndex({ cps, sequences, profile }: Props) {
  const isPaud = profile.educationLevel === 'tk'
  const institutionLabel = profile.institutionType === 'ra' ? 'RA' : 'TK'
  const [selectedCp, setSelectedCp] = useState(cps[0]?.id ?? 0)
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([])
  const [showObjectiveModal, setShowObjectiveModal] = useState(false)
  const [showSequenceModal, setShowSequenceModal] = useState(false)
  const [showIndicatorModal, setShowIndicatorModal] = useState(false)
  const objectiveForm = useForm({
    cpId: selectedCp,
    code: '',
    title: '',
    groupContext: (profile.defaultGroupContext ?? '') as 'a' | 'b' | '',
  })
  const sequenceForm = useForm({
    title: '',
    educationLevel: (profile.educationLevel === 'sd' ? 'sd' : 'tk') as 'tk' | 'sd',
    groupContext: (profile.defaultGroupContext ?? '') as 'a' | 'b' | '',
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

  return (
    <DashboardWrapper
      title="CP, TP & ATP"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'CP, TP & ATP' }]}
    >
      <Head title="CP, TP & ATP" />
      <div className="space-y-6">
        <div data-tour="curriculum-intro">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isPaud ? `Kurikulum ${institutionLabel} · PAUD Fase Fondasi` : 'Kurikulum SD'}
          </h2>
          <p data-tour="curriculum-flow" className="text-neutral-600 dark:text-neutral-400">
            Struktur terkontrol: CP → TP → ATP → IKTP/evidence.{' '}
            {isPaud
              ? 'CP Fase Fondasi tetap sama untuk Kelompok A dan B.'
              : 'Pilih dan susun tujuan pembelajaran sesuai jenjang sekolah.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/curriculum/export/pdf?disposition=inline"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Export PDF
          </a>
          <a
            href="/curriculum/export"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Export DOCX
          </a>
          <button
            type="button"
            onClick={() => {
              objectiveForm.setData('cpId', selectedCp)
              setShowObjectiveModal(true)
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            Tambah TP Custom
          </button>
          <button
            type="button"
            onClick={() => setShowSequenceModal(true)}
            disabled={selectedObjectives.length === 0}
            className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 disabled:opacity-50 dark:text-emerald-300"
          >
            Buat ATP ({selectedObjectives.length} TP)
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <div
            data-tour="curriculum-cp"
            data-tour-ready={cps.length > 0 ? 'true' : 'false'}
            className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h3 className="mb-3 font-semibold text-neutral-900 dark:text-white">Elemen CP</h3>
            {cps.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedCp(item.id)
                  objectiveForm.setData('cpId', item.id)
                }}
                className={`w-full rounded-lg p-3 text-left text-sm ${item.id === selectedCp ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <span className="font-medium">{item.element}</span>
                <span className="mt-1 block text-xs opacity-70">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {cp && (
              <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  {cp.code} · Fase Fondasi
                </p>
                <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
                  {cp.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {cp.description}
                </p>
                <div
                  data-tour="curriculum-tp"
                  data-tour-ready={cp.learningObjectives.length > 0 ? 'true' : 'false'}
                  className="mt-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      Tujuan Pembelajaran
                    </h4>
                    <span className="text-xs text-neutral-500">
                      Klik Masukkan ATP untuk memilih urutan
                    </span>
                  </div>
                  {cp.learningObjectives.map((objective) => (
                    <div
                      key={objective.id}
                      className={`rounded-lg border p-3 transition-colors ${selectedObjectives.includes(objective.id) ? 'border-emerald-400 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/20' : 'border-neutral-200 dark:border-neutral-700'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-semibold text-emerald-600">
                            {objective.code}
                          </span>
                          <p className="text-sm text-neutral-800 dark:text-neutral-200">
                            {objective.title.replace(/<[^>]+>/g, '')}
                          </p>
                          {objective.indicators?.length > 0 && (
                            <p className="mt-1 text-xs text-neutral-500">
                              {objective.indicators.length} IKTP tersimpan
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => addToAtp(objective.id)}
                          className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white"
                        >
                          {selectedObjectives.includes(objective.id)
                            ? 'Hapus dari ATP'
                            : 'Masukkan ATP'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              data-tour="curriculum-atp"
              data-tour-ready={
                sequences.length > 0 || selectedObjectives.length > 0 ? 'true' : 'false'
              }
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">ATP Saya</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    ATP dibuat dari TP yang Anda pilih.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSequenceModal(true)}
                  disabled={selectedObjectives.length === 0}
                  className="rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 disabled:opacity-50 dark:text-emerald-300"
                >
                  Buat ATP
                </button>
              </div>
              {sequences.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">Belum ada ATP custom.</p>
              ) : (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {sequences.map((sequence) => (
                    <div
                      key={sequence.id}
                      className="cursor-pointer rounded-lg border border-neutral-200 p-3 text-sm transition-colors hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-neutral-700 dark:hover:bg-emerald-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{sequence.title}</span>
                        <span className="text-xs text-neutral-500">{sequence.status}</span>
                      </div>
                      <span className="mt-1 block text-xs text-neutral-500">
                        {sequence.items?.length ?? 0} TP
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              data-tour="curriculum-iktp"
              data-tour-ready={cp ? 'true' : 'false'}
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900 dark:text-white">IKTP / Evidence</h3>
                <button
                  type="button"
                  onClick={() => {
                    indicatorForm.setData('learningObjectiveId', cp?.learningObjectives[0]?.id ?? 0)
                    setShowIndicatorModal(true)
                  }}
                  className="rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300"
                >
                  Tambah IKTP
                </button>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Tambahkan perilaku teramati dan kriteria ketercapaian untuk TP.
              </p>
            </div>
          </div>
        </div>
        <CurriculumGlossary />
      </div>
      {showObjectiveModal && (
        <Modal title="Tambah TP Custom" onClose={closeObjective}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              objectiveForm.post('/curriculum/objectives', { onSuccess: closeObjective })
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">Kode TP</label>
              <input
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
                placeholder="Contoh: TP-JD-01"
                value={objectiveForm.data.code}
                onChange={(e) => objectiveForm.setData('code', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Rumusan Tujuan Pembelajaran</label>
              <RichTextEditor
                value={objectiveForm.data.title}
                onChange={(value) => objectiveForm.setData('title', value)}
                placeholder="Tuliskan tujuan pembelajaran..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeObjective}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button
                disabled={
                  objectiveForm.processing || !objectiveForm.data.code || !objectiveForm.data.title
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Simpan TP
              </button>
            </div>
          </form>
        </Modal>
      )}
      {showSequenceModal && (
        <Modal title="Buat ATP" onClose={closeSequence}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              sequenceForm.setData(
                'items',
                selectedObjectives.map((learningObjectiveId, index) => ({
                  learningObjectiveId,
                  order: index + 1,
                }))
              )
              sequenceForm.post('/curriculum/sequences', { onSuccess: closeSequence })
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">Nama ATP</label>
              <input
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
                placeholder="Contoh: ATP Diriku Semester 1"
                value={sequenceForm.data.title}
                onChange={(e) => sequenceForm.setData('title', e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-800">
              {selectedObjectives.length} TP dipilih. Urutan mengikuti urutan pilihan pada card.
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeSequence}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button
                disabled={
                  sequenceForm.processing ||
                  !sequenceForm.data.title ||
                  selectedObjectives.length === 0
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Simpan ATP
              </button>
            </div>
          </form>
        </Modal>
      )}
      {showIndicatorModal && (
        <Modal title="Tambah IKTP" onClose={closeIndicator}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              indicatorForm.post('/curriculum/indicators', { onSuccess: closeIndicator })
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">TP</label>
              <select
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                value={indicatorForm.data.learningObjectiveId}
                onChange={(e) =>
                  indicatorForm.setData('learningObjectiveId', Number(e.target.value))
                }
              >
                <option value={0}>Pilih TP</option>
                {cps
                  .flatMap((item) => item.learningObjectives)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} — {item.title.replace(/<[^>]+>/g, '')}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Perilaku yang dapat diamati</label>
              <input
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                value={indicatorForm.data.description}
                onChange={(e) => indicatorForm.setData('description', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Kriteria ketercapaian</label>
              <RichTextEditor
                value={indicatorForm.data.achievementCriteria}
                onChange={(value) => indicatorForm.setData('achievementCriteria', value)}
                placeholder="Tuliskan kriteria ketercapaian..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeIndicator}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button
                disabled={
                  !indicatorForm.data.learningObjectiveId ||
                  !indicatorForm.data.description ||
                  indicatorForm.processing
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Simpan IKTP
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardWrapper>
  )
}
