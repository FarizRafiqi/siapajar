import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Presentation, Trash2, Eye, Sparkles } from 'lucide-react'
import CurriculumSequenceSelect from '~/components/dashboard/curriculum_sequence_select'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface MediaModuleItem {
  id: number
  title: string
  theme: string
  subtheme: string | null
  status: 'draft' | 'published'
  createdAt: string
  schoolClass: SchoolClass
}

interface MediaModulesIndexProps {
  readonly mediaModules: MediaModuleItem[]
  readonly classes: SchoolClass[]
  readonly sequences: { id: number; title: string; context: string }[]
}

export default function MediaModulesIndex({
  mediaModules,
  classes,
  sequences,
}: MediaModulesIndexProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletingMedia, setDeletingMedia] = useState<MediaModuleItem | null>(null)

  const hasClasses = classes.length > 0

  const { data, setData, post, processing, errors, reset } = useForm({
    classId: classes[0]?.id || 0,
    theme: '',
    subtheme: '',
    learningSequenceId: undefined as number | undefined,
  })

  const handleGenerate = () => {
    post('/media-modules/generate', {
      onSuccess: () => {
        setShowGenerateModal(false)
        reset()
      },
    })
  }

  const handleDelete = () => {
    if (!deletingMedia) return
    router.delete(`/media-modules/${deletingMedia.id}`, {
      onSuccess: () => setDeletingMedia(null),
    })
  }

  return (
    <DashboardWrapper
      title="Media Ajar & Loose Parts"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Media Ajar' }]}
    >
      <Head title="Media Ajar & Loose Parts TK/RA" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Media Ajar & Outline Slide Visual
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Outline slide presentasi visual anak & panduan bahan Loose Parts
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            disabled={!hasClasses}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Generate Media Ajar AI
          </button>
        </div>

        {!hasClasses && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Buat kelas terlebih dahulu sebelum membuat Media Ajar.
            </p>
            <Link
              href="/classes"
              className="mt-2 inline-block rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
            >
              Buat kelas dulu →
            </Link>
          </div>
        )}

        {mediaModules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
            <Presentation className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
              Belum ada Media Ajar
            </h3>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Generate media ajar visual & panduan loose parts pertama Anda
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mediaModules.map((item) => (
              <div
                key={item.id}
                role="link"
                tabIndex={0}
                onClick={() => router.visit(`/media-modules/${item.id}`)}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') router.visit(`/media-modules/${item.id}`) }}
                className="cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span>Kelompok {item.schoolClass.name}</span>
                      <span>•</span>
                      <span>Tema: {item.theme}</span>
                      {item.subtheme && <span>({item.subtheme})</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    <Link
                      href={`/media-modules/${item.id}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingMedia(item)}
                      className="rounded-lg border border-neutral-200 p-2 text-red-600 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Generate Media Ajar AI
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="classId"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Kelompok
                </label>
                <select
                  id="classId"
                  value={data.classId}
                  onChange={(e) => setData('classId', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      Kelompok {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="theme"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Tema Pembelajaran
                </label>
                <input
                  id="theme"
                  type="text"
                  value={data.theme}
                  onChange={(e) => setData('theme', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Tanaman Ciptaan Allah"
                />
                {errors.theme && <p className="mt-1 text-sm text-red-500">{errors.theme}</p>}
              </div>
              <div>
                <label
                  htmlFor="subtheme"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Sub-Tema (opsional)
                </label>
                <input
                  id="subtheme"
                  type="text"
                  value={data.subtheme}
                  onChange={(e) => setData('subtheme', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  placeholder="contoh: Mengenal Buah & Bunga"
                />
              </div>
              <CurriculumSequenceSelect
                sequences={sequences}
                value={data.learningSequenceId}
                onChange={(value) => setData('learningSequenceId', value)}
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowGenerateModal(false)
                  reset()
                }}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleGenerate}
                disabled={processing}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {processing ? 'Sedang membuat...' : 'Generate Media Ajar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {deletingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Hapus Media Ajar?
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Apakah Anda yakin ingin menghapus &quot;{deletingMedia.title}&quot;?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingMedia(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
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
