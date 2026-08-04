import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'

interface Indicator { id: number; description: string; evidenceType: string; achievementCriteria: string }
interface Objective { id: number; cpId: number; code: string; title: string; groupContext: 'a' | 'b' | null; indicators: Indicator[] }
interface Cp { id: number; code: string; element: string; title: string; description: string; learningObjectives: Objective[] }
interface Sequence { id: number; title: string; educationLevel: 'tk' | 'sd'; groupContext: 'a' | 'b' | null; status: string; items: Array<{ learningObjectiveId: number; order: number; period?: string }> }

interface Props { readonly cps: Cp[]; readonly sequences: Sequence[]; readonly profile: { educationLevel: string | null; institutionType: string | null; curriculumVersion: string | null; defaultGroupContext: string | null } }

export default function CurriculumIndex({ cps, sequences, profile }: Props) {
  const [selectedCp, setSelectedCp] = useState(cps[0]?.id ?? 0)
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([])
  const objectiveForm = useForm({ cpId: selectedCp, code: '', title: '', groupContext: (profile.defaultGroupContext ?? '') as 'a' | 'b' | '' })
  const sequenceForm = useForm({ title: '', educationLevel: (profile.educationLevel === 'sd' ? 'sd' : 'tk') as 'tk' | 'sd', groupContext: (profile.defaultGroupContext ?? '') as 'a' | 'b' | '', items: [] as Array<{ learningObjectiveId: number; order: number }> })
  const indicatorForm = useForm({ learningObjectiveId: 0, description: '', evidenceType: 'observasi', achievementCriteria: '' })
  const cp = cps.find((item) => item.id === selectedCp)

  const addToAtp = (id: number) => setSelectedObjectives((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return <DashboardWrapper title="CP, TP & ATP" breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'CP, TP & ATP' }]}>
    <Head title="CP, TP & ATP" />
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Kurikulum PAUD/SD</h2><p className="text-neutral-600 dark:text-neutral-400">Struktur terkontrol: CP → TP → ATP → IKTP/evidence. CP Fase Fondasi tetap sama untuk Kelompok A dan B.</p></div>
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-3 font-semibold text-neutral-900 dark:text-white">Elemen CP</h3>
          {cps.map((item) => <button key={item.id} onClick={() => { setSelectedCp(item.id); objectiveForm.setData('cpId', item.id) }} className={`w-full rounded-lg p-3 text-left text-sm ${item.id === selectedCp ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><span className="font-medium">{item.element}</span><span className="mt-1 block text-xs opacity-70">{item.title}</span></button>)}
        </div>
        <div className="space-y-6">
          {cp && <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{cp.code} · Fase Fondasi</p><h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">{cp.title}</h3><p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{cp.description}</p><div className="mt-5 space-y-3"><h4 className="font-semibold text-neutral-900 dark:text-white">Tujuan Pembelajaran</h4>{cp.learningObjectives.map((objective) => <div key={objective.id} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"><div className="flex items-start justify-between gap-3"><div><span className="text-xs font-semibold text-emerald-600">{objective.code}</span><p className="text-sm text-neutral-800 dark:text-neutral-200">{objective.title}</p>{objective.indicators?.length > 0 && <p className="mt-1 text-xs text-neutral-500">{objective.indicators.length} IKTP tersimpan</p>}</div><button onClick={() => addToAtp(objective.id)} className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white">{selectedObjectives.includes(objective.id) ? 'Hapus dari ATP' : 'Masukkan ATP'}</button></div></div>)}</div></div>}
          <div className="grid gap-6 md:grid-cols-2">
            <form onSubmit={(event) => { event.preventDefault(); objectiveForm.post('/curriculum/objectives') }} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold text-neutral-900 dark:text-white">Tambah TP custom</h3><input className="mt-4" placeholder="Kode TP" value={objectiveForm.data.code} onChange={(e) => objectiveForm.setData('code', e.target.value)} /><textarea className="mt-3 min-h-24" placeholder="Rumusan tujuan pembelajaran" value={objectiveForm.data.title} onChange={(e) => objectiveForm.setData('title', e.target.value)} /><button className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Simpan TP</button></form>
            <form onSubmit={(event) => { event.preventDefault(); sequenceForm.setData('items', selectedObjectives.map((learningObjectiveId, index) => ({ learningObjectiveId, order: index + 1 }))); sequenceForm.post('/curriculum/sequences') }} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold text-neutral-900 dark:text-white">Buat ATP</h3><input className="mt-4" placeholder="Nama ATP" value={sequenceForm.data.title} onChange={(e) => sequenceForm.setData('title', e.target.value)} /><p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{selectedObjectives.length} TP dipilih. Urutan mengikuti pilihan Anda.</p><button disabled={!sequenceForm.data.title || selectedObjectives.length === 0} className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Simpan ATP</button></form>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold text-neutral-900 dark:text-white">ATP saya</h3>{sequences.length === 0 ? <p className="mt-3 text-sm text-neutral-500">Belum ada ATP custom.</p> : <div className="mt-3 space-y-2">{sequences.map((sequence) => <div key={sequence.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-700"><span>{sequence.title} · {sequence.items?.length ?? 0} TP</span><span className="text-xs text-neutral-500">{sequence.status}</span></div>)}</div>}</div>
          <form onSubmit={(event) => { event.preventDefault(); indicatorForm.post('/curriculum/indicators', { onSuccess: () => indicatorForm.reset() }) }} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="font-semibold text-neutral-900 dark:text-white">Tambah IKTP/evidence</h3><select className="mt-4" value={indicatorForm.data.learningObjectiveId} onChange={(e) => indicatorForm.setData('learningObjectiveId', Number(e.target.value))}><option value={0}>Pilih TP</option>{cps.flatMap((item) => item.learningObjectives).map((item) => <option key={item.id} value={item.id}>{item.code} — {item.title}</option>)}</select><input className="mt-3" placeholder="Perilaku yang dapat diamati" value={indicatorForm.data.description} onChange={(e) => indicatorForm.setData('description', e.target.value)} /><textarea className="mt-3 min-h-20" placeholder="Kriteria ketercapaian" value={indicatorForm.data.achievementCriteria} onChange={(e) => indicatorForm.setData('achievementCriteria', e.target.value)} /><button disabled={!indicatorForm.data.learningObjectiveId} className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Simpan IKTP</button></form>
        </div>
      </div>
    </div>
  </DashboardWrapper>
}
