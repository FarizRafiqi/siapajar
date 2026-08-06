import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Box, ShieldAlert } from 'lucide-react'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface Slide {
  slideNumber: number
  title: string
  visualDescription: string
  teacherNotes: string
  keyQuestion: string
}

interface LoosePartsGuide {
  materials?: string[]
  activities?: string[]
  safetyNotes?: string
}

interface MediaModule {
  id: number
  title: string
  theme: string
  subtheme: string | null
  slides: Slide[]
  loosePartsGuide: LoosePartsGuide | null
  status: 'draft' | 'published'
  createdAt: string
  schoolClass: SchoolClass
}

interface MediaModuleShowProps {
  readonly mediaModule: MediaModule
}

export default function MediaModuleShow({ mediaModule }: MediaModuleShowProps) {
  const slides = mediaModule.slides || []
  const guide = mediaModule.loosePartsGuide || {}

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = slides[currentSlideIndex]

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  return (
    <DashboardWrapper
      title={mediaModule.title}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Media Ajar', href: '/media-modules' },
        { label: mediaModule.title },
      ]}
    >
      <Head title={mediaModule.title} />

      <div className="space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/media-modules"
              className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {mediaModule.title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Kelompok {mediaModule.schoolClass.name} • {slides.length} Slide Presentasi Visual
              </p>
            </div>
          </div>
        </div>

        {/* Presentasi Visual Interactive Viewer */}
        {slides.length > 0 && currentSlide && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-900 p-8 text-white shadow-xl dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> SLIDE PRESENTASI VISUAL ANAK (SLIDE{' '}
                {currentSlide.slideNumber} OF {slides.length})
              </span>
              <span>Tema: {mediaModule.theme}</span>
            </div>

            {/* Slide Body Container */}
            <div className="my-8 flex min-h-[300px] flex-col justify-center rounded-xl bg-neutral-850 p-8 text-center border border-neutral-800">
              <h1 className="text-3xl font-extrabold text-white tracking-wide">
                {currentSlide.title}
              </h1>

              <div className="mt-6 rounded-lg bg-neutral-800/80 p-6 text-emerald-200 border border-emerald-900/40">
                <p className="text-sm font-semibold uppercase text-emerald-400">
                  Visual / Ilustrasi Pembuka:
                </p>
                <p className="mt-2 text-lg italic">{currentSlide.visualDescription}</p>
              </div>

              {currentSlide.keyQuestion && (
                <div className="mt-6 rounded-lg bg-amber-950/40 p-4 text-amber-200 border border-amber-900/40">
                  <p className="text-xs font-bold uppercase text-amber-400">
                    Pertanyaan Pemantik Anak:
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    &quot;{currentSlide.keyQuestion}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Catatan Panduan Guru saat Menampilkan Slide Ini */}
            <div className="rounded-xl bg-neutral-800/50 p-4 text-xs text-neutral-300 border border-neutral-700">
              <span className="font-bold text-neutral-100">💡 Panduan Peragaan Guru: </span>
              {currentSlide.teacherNotes}
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Slide Sebelumnya
              </button>
              <span className="text-xs font-medium text-neutral-400">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                Slide Berikutnya <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Loose Parts Materials Guide */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
            <Box className="h-5 w-5 text-emerald-600" /> Panduan Media Loose Parts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">
                Bahan-bahan Loose Parts Disarankan:
              </h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {(guide.materials ?? []).map((item, idx) => (
                  <li key={`mat-${idx}-${item.slice(0, 10)}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">
                Ragam Kegiatan Loose Parts:
              </h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {(guide.activities ?? []).map((act, idx) => (
                  <li key={`act-${idx}-${act.slice(0, 10)}`}>{act}</li>
                ))}
              </ul>
            </div>
          </div>

          {guide.safetyNotes && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-300">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <span className="font-bold">Catatan Keselamatan: </span>
                {guide.safetyNotes}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}
