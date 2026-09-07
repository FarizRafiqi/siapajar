import { useEffect, useState } from 'react'
import { Check, LoaderCircle, Sparkles } from 'lucide-react'

interface GenerationProgressModalProps {
  isOpen: boolean
  title: string
  description?: string
  steps: readonly string[]
}

export default function GenerationProgressModal({
  isOpen,
  title,
  description = 'Mohon tunggu sebentar. Jangan tutup halaman ini sampai dokumen selesai dibuat.',
  steps,
}: Readonly<GenerationProgressModalProps>) {
  const progressSteps = steps
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0)
      return
    }

    setActiveStep(0)
    const interval = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, progressSteps.length - 1))
    }, 1800)

    return () => window.clearInterval(interval)
  }, [isOpen, progressSteps.length])

  if (!isOpen) return null

  const progressPercentage = Math.round(((activeStep + 1) / progressSteps.length) * 100)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-950/65 backdrop-blur-xs" aria-hidden="true" />

      <section
        className="card-kawaii relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-busy="true"
        aria-labelledby="generation-progress-title"
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-emerald-700 bg-emerald-700 p-5 text-white dark:bg-emerald-800">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-amber-300 text-neutral-950 shadow-[2px_2px_0px_#000000]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 id="generation-progress-title" className="text-base font-bold leading-tight">
              {title}
            </h2>
            <p className="mt-1 text-xs font-medium text-emerald-100">Sedang diproses</p>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p
                className="text-sm font-semibold text-neutral-900 dark:text-white"
                aria-live="polite"
              >
                {progressSteps[activeStep]}
              </p>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{description}</p>
            </div>
            <span className="shrink-0 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {progressPercentage}%
            </span>
          </div>

          <div
            className="mb-5 h-3 overflow-hidden rounded-full border-2 border-black bg-neutral-100 dark:bg-neutral-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
            aria-label="Progres pembuatan dokumen"
          >
            <div
              className="h-full rounded-full bg-amber-300 transition-[width] duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="space-y-2.5" aria-live="polite">
            {progressSteps.map((step, index) => {
              const isComplete = index < activeStep
              const isCurrent = index === activeStep

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-colors ${
                    isCurrent
                      ? 'border-black bg-emerald-50 font-semibold text-neutral-950 dark:bg-emerald-950/40 dark:text-white'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-300'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      isComplete
                        ? 'border-emerald-700 bg-emerald-500 text-white'
                        : isCurrent
                          ? 'border-black bg-amber-300 text-neutral-950'
                          : 'border-neutral-300 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900'
                    }`}
                  >
                    {isComplete ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : isCurrent ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </span>
                  <span>{step}</span>
                </div>
              )
            })}
          </div>
        </div>

        <footer className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-5 py-3 text-center text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          Hasil akan terbuka otomatis setelah proses selesai.
        </footer>
      </section>
    </div>
  )
}
