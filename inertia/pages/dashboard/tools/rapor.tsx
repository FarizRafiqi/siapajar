import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  FileText,
  Sparkles,
  Award,
  Users,
  Layers,
  ArrowRight,
  Printer,
  RotateCw,
} from 'lucide-react'

interface SchoolClass {
  id: number
  name: string
  academicYear?: string
}

interface RaporProps {
  isTk: boolean
  classes: SchoolClass[]
}

export default function RaporExpress({ isTk, classes = [] }: Readonly<RaporProps>) {
  const [classId, setClassId] = useState(classes[0] ? String(classes[0].id) : '')
  const [semester, setSemester] = useState<'1' | '2'>('1')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAll = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classId) return

    setIsGenerating(true)
    if (isTk) {
      router.post(
        `/report-cards/generate-all`,
        { classId: Number(classId), semester: Number(semester) },
        { onFinish: () => setIsGenerating(false) }
      )
    } else {
      router.post(
        `/report-cards/generate-all`,
        { classId: Number(classId), semester: Number(semester) },
        { onFinish: () => setIsGenerating(false) }
      )
    }
  }

  return (
    <DashboardWrapper
      title="Generator Narasi Rapor Kurikulum Merdeka"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Rapor Siswa' }]}
    >
      <Head title="Generator Narasi Rapor - SiapAjar" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="p-3.5 bg-rose-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">
              Generator Narasi Deskripsi Rapor AI
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Otomatis mengubah akumulasi nilai TP dan catatan perkembangan menjadi narasi deskripsi
              rapor resmi
            </p>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="font-black text-neutral-900 dark:text-white text-base">
                Pilih Kelas & Periode Rapor
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Penyusunan narasi dilakukan secara otomatis untuk seluruh siswa di dalam kelas
              </p>
            </div>
            <span className="badge-kawaii-emerald">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Biaya: 1 Kredit / Siswa
            </span>
          </div>

          <form onSubmit={handleGenerateAll} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Pilih Kelas / Rombel *
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Semester Rapor *
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as '1' | '2')}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap / Kenaikan Kelas)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-neutral-800/80 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] text-xs text-neutral-800 dark:text-neutral-200 font-medium space-y-2">
              <p className="font-black text-neutral-950 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" />
                Ketentuan Narasi Kurikulum Merdeka:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Menjelaskan capaian tertinggi dan aspek yang perlu peningkatan</li>
                <li>Menggunakan bahasa positif, apresiatif, dan membangun semangat anak</li>
                <li>Dilengkapi narasi Projek Penguatan Profil Pelajar Pancasila (P5)</li>
                <li>Format layout cetak PDF lengkap dengan tanda tangan Kepsek & Wali Kelas</li>
              </ul>
            </div>

            <div className="pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <Link
                href="/report-cards"
                className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 flex items-center gap-1"
              >
                Buka Buku Rapor Kelas <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="submit"
                disabled={isGenerating || !classId}
                className="btn-kawaii-primary w-full sm:w-auto text-xs sm:text-sm"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    Menyusun Narasi Seluruh Siswa...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Narasi Rapor Kelas
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardWrapper>
  )
}
