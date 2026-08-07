import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import ExportDownloadButton from '~/components/dashboard/export-download-button'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { ArrowLeft, Building2, Pencil, Plus, Printer, Save, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '~/lib/utils'
import { examTypeLabel, type ExamType } from './index'
import { QuestionRenderer } from './question-renderer'
import { KopHeader } from '~/components/exams/kop-header'
import { KopSettingsModal } from '~/components/exams/kop-settings-modal'
import {
  normalizeHeader,
  normalizeQuestion,
  type ExamHeader,
  type ExamQuestion,
} from './question-types'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface Exam {
  id: number
  title: string
  type: ExamType
  status: 'draft' | 'published'
  questions: Record<string, unknown>[]
  header?: Record<string, string>
  createdAt: string
  schoolClass: SchoolClass
}

interface ExamShowProps {
  readonly exam: Exam
}

function inputClass() {
  return 'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
}

export default function ExamShow({ exam }: ExamShowProps) {
  const page = usePage()
  const authUser = (page.props as any).auth?.user
  const [editing, setEditing] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)
  const [isKopModalOpen, setIsKopModalOpen] = useState(false)

  const initialQuestions = useMemo(
    () => (exam.questions || []).map((q, i) => normalizeQuestion(q as Record<string, unknown>, i)),
    [exam.questions]
  )
  const initialHeader = useMemo(
    () =>
      normalizeHeader(exam.header, {
        groupName: exam.schoolClass.name,
        examLabel: examTypeLabel(exam.type),
        institutionName: authUser?.kopSurat?.institutionName || authUser?.schoolName || '',
        institutionSubName: authUser?.kopSurat?.institutionSubName || '',
        addressLine1: authUser?.kopSurat?.addressLine1 || '',
        addressLine2: authUser?.kopSurat?.addressLine2 || '',
        phone: authUser?.kopSurat?.phone || '',
        logoUrl: authUser?.kopSurat?.logoUrl || '',
      }),
    [exam.header, exam.schoolClass.name, exam.type, authUser]
  )
  const { data, setData, put, processing, reset } = useForm<{
    title: string
    type: ExamType
    status: 'draft' | 'published'
    questions: ExamQuestion[]
    header: ExamHeader
  }>({
    title: exam.title,
    type: exam.type,
    status: exam.status,
    questions: initialQuestions,
    header: initialHeader,
  })

  const questions = editing ? data.questions : initialQuestions
  const isPublished = exam.status === 'published'

  const save = () => put(`/exams/${exam.id}`, { onSuccess: () => setEditing(false) })
  const togglePublish = () => {
    setData('status', isPublished ? 'draft' : 'published')
    put(`/exams/${exam.id}`, { onSuccess: () => setEditing(false) })
  }
  const cancel = () => {
    reset()
    setEditing(false)
  }

  return (
    <DashboardWrapper
      title={exam.title}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Bank Soal', href: '/exams' },
        { label: exam.title },
      ]}
    >
      <Head title={exam.title} />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between print:hidden">
          <div className="flex items-start gap-3">
            <Link
              href="/exams"
              aria-label="Kembali ke bank soal"
              className="mt-1 rounded-xl border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {exam.title}
                </h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {examTypeLabel(exam.type)}
                </span>
                <button
                  type="button"
                  onClick={togglePublish}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-semibold transition',
                    isPublished
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                  )}
                >
                  {isPublished ? 'Terbit' : 'Draf'}
                </button>
              </div>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Kelas {exam.schoolClass.name} · {questions.length} butir soal
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsKopModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Building2 className="h-4 w-4 text-emerald-600" /> Edit Kop Surat
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
            >
              <Printer className="h-4 w-4" /> Cetak (Print)
            </button>
            <button
              type="button"
              onClick={() => setShowAnswers((value) => !value)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {showAnswers ? 'Sembunyikan kunci' : 'Tampilkan kunci'}
            </button>
            <ExportDownloadButton
              href={`/exams/${exam.id}/export`}
              filename={`${exam.title}.docx`}
              label="DOCX"
            />
            <ExportDownloadButton
              href={`/exams/${exam.id}/export/pdf`}
              filename={`${exam.title}.pdf`}
              label="PDF"
            />
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancel}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                >
                  <X className="h-4 w-4" /> Batal
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
              >
                <Pencil className="h-4 w-4" /> Edit naskah
              </button>
            )}
          </div>
        </div>

        {/* Paper Sheet Preview Area */}
        <div className="mx-auto max-w-[800px] rounded-2xl border border-neutral-200 bg-white p-8 shadow-md print:border-none print:shadow-none print:p-0 dark:border-neutral-800 dark:bg-neutral-900">
          <KopHeader header={data.header} user={authUser} />

          <div className="my-6 space-y-6">
            {questions.map((q, idx) => (
              <QuestionRenderer
                key={q.id || idx}
                question={q}
                number={idx + 1}
                showAnswer={showAnswers}
              />
            ))}
          </div>
        </div>

        <KopSettingsModal
          isOpen={isKopModalOpen}
          onClose={() => setIsKopModalOpen(false)}
          header={data.header}
          onSaveHeader={(updatedHeader) => {
            setData('header', updatedHeader)
          }}
        />

        {/* Paper Sheet Preview / Editor Area */}
        <div className="mx-auto max-w-[800px] rounded-2xl border border-neutral-200 bg-white p-8 shadow-md print:border-none print:shadow-none print:p-0 dark:border-neutral-800 dark:bg-neutral-900">
          <KopHeader header={data.header} user={authUser} />

          <div className="my-6 space-y-6">
            {questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center print:hidden dark:border-neutral-700">
                <p className="text-neutral-500 dark:text-neutral-400">Belum ada soal.</p>
              </div>
            ) : (
              questions.map((question, index) =>
                editing ? (
                  <EditorCard
                    key={question.id || index}
                    question={question}
                    index={index}
                    onUpdate={(idx, patch) =>
                      setData(
                        'questions',
                        data.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q))
                      )
                    }
                    onUpdateOption={(qIdx, oIdx, text) =>
                      setData(
                        'questions',
                        data.questions.map((q, i) =>
                          i === qIdx
                            ? {
                                ...q,
                                options: (q.options || []).map((opt, oi) =>
                                  oi === oIdx ? { ...opt, text } : opt
                                ),
                              }
                            : q
                        )
                      )
                    }
                    onRemove={() =>
                      setData(
                        'questions',
                        data.questions.filter((_, i) => i !== index)
                      )
                    }
                  />
                ) : (
                  <QuestionRenderer
                    key={question.id || index}
                    question={question}
                    number={index + 1}
                    showAnswer={showAnswers}
                  />
                )
              )
            )}

            {editing && (
              <button
                type="button"
                onClick={() =>
                  setData('questions', [
                    ...data.questions,
                    {
                      id: Math.max(0, ...data.questions.map((q) => q.id)) + 1,
                      type: 'multiple_choice',
                      question: '',
                      instruction: '',
                      options: [
                        { label: 'a', text: '' },
                        { label: 'b', text: '' },
                        { label: 'c', text: '' },
                      ],
                      answer: 'a',
                    },
                  ])
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-4 text-sm font-semibold text-neutral-600 transition hover:border-emerald-500 hover:text-emerald-600 print:hidden dark:border-neutral-700 dark:text-neutral-400"
              >
                <Plus className="h-4 w-4" /> Tambah soal
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}

function EditorCard({
  question,
  index,
  onUpdate,
  onUpdateOption,
  onRemove,
}: {
  readonly question: ExamQuestion
  readonly index: number
  readonly onUpdate: (index: number, patch: Partial<ExamQuestion>) => void
  readonly onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void
  readonly onRemove: () => void
}) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-neutral-900 dark:text-white">Soal {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Hapus soal"
          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-4">
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Bentuk soal
          </span>
          <select
            className={inputClass()}
            value={question.type}
            onChange={(event) =>
              onUpdate(index, { type: event.target.value as ExamQuestion['type'] })
            }
          >
            <option value="multiple_choice">Pilihan ganda</option>
            <option value="essay">Uraian</option>
            <option value="visual">Aktivitas visual</option>
            <option value="matching">Hubungkan garis</option>
            <option value="practical">Praktik / performa</option>
            <option value="oral">Lisan</option>
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Pertanyaan / tugas
          </span>
          <textarea
            className={inputClass()}
            rows={3}
            value={question.question}
            onChange={(event) => onUpdate(index, { question: event.target.value })}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Petunjuk
          </span>
          <input
            className={inputClass()}
            value={question.instruction || ''}
            onChange={(event) => onUpdate(index, { instruction: event.target.value })}
          />
        </label>
        {question.type === 'multiple_choice' && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(question.options || []).map((option, optionIndex) => (
              <label key={option.label}>
                <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Opsi {option.label}
                </span>
                <input
                  className={inputClass()}
                  value={option.text}
                  onChange={(event) => onUpdateOption(index, optionIndex, event.target.value)}
                />
              </label>
            ))}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Kunci / jawaban ideal
            </span>
            <input
              className={inputClass()}
              value={question.answer || ''}
              onChange={(event) => onUpdate(index, { answer: event.target.value })}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Rubrik / panduan skor
            </span>
            <textarea
              className={inputClass()}
              rows={2}
              value={question.rubric || question.scoringGuide || ''}
              onChange={(event) => onUpdate(index, { rubric: event.target.value })}
            />
          </label>
        </div>
        {question.type === 'visual' && (
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Deskripsi ilustrasi
            </span>
            <input
              className={inputClass()}
              value={question.imagePrompt || ''}
              onChange={(event) => onUpdate(index, { imagePrompt: event.target.value })}
              placeholder="Contoh: tiga apel merah bergaya ilustrasi anak"
            />
          </label>
        )}
        {question.type === 'matching' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Sisi kiri (satu item per baris)
              </span>
              <textarea
                className={inputClass()}
                rows={4}
                value={(question.leftItems || []).map((item) => item.label).join('\n')}
                onChange={(event) =>
                  onUpdate(index, {
                    leftItems: event.target.value
                      .split('\n')
                      .filter(Boolean)
                      .map((label, i) => ({ id: `left-${i + 1}`, label })),
                  })
                }
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Sisi kanan (satu item per baris)
              </span>
              <textarea
                className={inputClass()}
                rows={4}
                value={(question.rightItems || []).map((item) => item.label).join('\n')}
                onChange={(event) =>
                  onUpdate(index, {
                    rightItems: event.target.value
                      .split('\n')
                      .filter(Boolean)
                      .map((label, i) => ({ id: `right-${i + 1}`, label })),
                  })
                }
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
