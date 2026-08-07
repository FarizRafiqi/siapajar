import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import ExportDownloadButton from '~/components/dashboard/export-download-button'
import { Head, Link, useForm } from '@inertiajs/react'
import { ArrowLeft, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '~/lib/utils'
import { examTypeLabel, type ExamType } from './index'
import { QuestionRenderer } from './question-renderer'
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

const headerFields: { key: keyof ExamHeader; label: string; placeholder: string }[] = [
  { key: 'logoUrl', label: 'URL logo kop (opsional)', placeholder: 'https://.../logo.png' },
  { key: 'institutionName', label: 'Nama lembaga', placeholder: 'RA/TK ...' },
  { key: 'institutionAddress', label: 'Alamat lembaga', placeholder: 'Alamat dan kontak' },
  { key: 'academicYear', label: 'Tahun ajaran', placeholder: '2025/2026' },
  { key: 'semester', label: 'Semester', placeholder: '1 / Ganjil' },
  { key: 'groupName', label: 'Kelompok / kelas', placeholder: 'Kelompok B' },
  { key: 'subject', label: 'Tema / mata pelajaran', placeholder: 'Tema ...' },
  { key: 'examLabel', label: 'Label asesmen', placeholder: 'Ulangan Harian' },
  { key: 'studentName', label: 'Nama anak (opsional)', placeholder: 'Nama lengkap anak' },
  { key: 'date', label: 'Tanggal (opsional)', placeholder: 'Tanggal pelaksanaan' },
]

function inputClass() {
  return 'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('Logo tidak dapat dibaca'))
    reader.readAsDataURL(file)
  })
}

export default function ExamShow({ exam }: ExamShowProps) {
  const [editing, setEditing] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)
  const initialQuestions = useMemo(
    () => (exam.questions || []).map(normalizeQuestion),
    [exam.questions]
  )
  const initialHeader = useMemo(
    () =>
      normalizeHeader(exam.header, {
        groupName: exam.schoolClass.name,
        examLabel: examTypeLabel(exam.type),
      }),
    [exam.header, exam.schoolClass.name, exam.type]
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
  const updateQuestion = (index: number, patch: Partial<ExamQuestion>) =>
    setData(
      'questions',
      data.questions.map((question, i) => (i === index ? { ...question, ...patch } : question))
    )
  const updateOption = (questionIndex: number, optionIndex: number, text: string) =>
    updateQuestion(questionIndex, {
      options: (data.questions[questionIndex].options || []).map((option, index) =>
        index === optionIndex ? { ...option, text } : option
      ),
    })
  const addQuestion = () =>
    setData('questions', [
      ...data.questions,
      {
        id: Math.max(0, ...data.questions.map((question) => question.id)) + 1,
        type: 'essay',
        question: '',
        instruction: '',
        answer: '',
        rubric: '',
      },
    ])

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">Kop soal</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Informasi ini akan dicetak pada lembar PDF dan DOCX.
              </p>
            </div>
            {editing && (
              <span className="text-xs font-medium text-emerald-600">Mode edit aktif</span>
            )}
          </div>
          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {headerFields.map((field) => (
                <label
                  key={field.key}
                  className={
                    field.key === 'institutionAddress' || field.key === 'logoUrl'
                      ? 'sm:col-span-2'
                      : ''
                  }
                >
                  <span className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    {field.label}
                  </span>
                  {field.key === 'logoUrl' ? (
                    <div className="space-y-2">
                      <input
                        className={inputClass()}
                        value={data.header[field.key]}
                        placeholder={field.placeholder}
                        onChange={(event) =>
                          setData('header', { ...data.header, [field.key]: event.target.value })
                        }
                      />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="block w-full cursor-pointer text-xs text-neutral-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-700"
                        onChange={async (event) => {
                          const file = event.target.files?.[0]
                          if (!file || file.size > 2 * 1024 * 1024) return
                          const logoUrl = await readImageAsDataUrl(file)
                          setData('header', { ...data.header, logoUrl })
                        }}
                      />
                      <p className="text-xs text-neutral-500">PNG, JPG, atau WebP maksimal 2 MB.</p>
                    </div>
                  ) : (
                    <input
                      className={inputClass()}
                      value={data.header[field.key]}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setData('header', { ...data.header, [field.key]: event.target.value })
                      }
                    />
                  )}
                  {field.key === 'logoUrl' && data.header.logoUrl && (
                    <img
                      src={data.header.logoUrl}
                      alt="Logo kop soal"
                      className="mt-3 h-14 max-w-48 rounded object-contain"
                    />
                  )}
                </label>
              ))}
            </div>
          ) : (
            <div className="border-b-2 border-neutral-900 pb-4 text-center dark:border-white">
              <div className="flex items-center justify-center gap-4">
                {data.header.logoUrl && (
                  <img
                    src={data.header.logoUrl}
                    alt="Logo lembaga"
                    className="h-16 w-16 object-contain"
                  />
                )}
                <p className="text-lg font-bold uppercase text-neutral-900 dark:text-white">
                  {data.header.institutionName || 'Nama Lembaga'}
                </p>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {data.header.institutionAddress || 'Alamat lembaga'}
              </p>
              <div className="my-3 border-t border-neutral-300 dark:border-neutral-700" />
              <p className="font-bold uppercase text-neutral-900 dark:text-white">
                {data.header.examLabel || examTypeLabel(exam.type)}
              </p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {data.header.subject || 'Tema / mata pelajaran'} ·{' '}
                {data.header.groupName || exam.schoolClass.name}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-left text-xs text-neutral-600 dark:text-neutral-400">
                <span>Tahun ajaran: {data.header.academicYear || '—'}</span>
                <span>Semester: {data.header.semester || '—'}</span>
                <span>Nama anak: {data.header.studentName || '—'}</span>
                <span>Tanggal: {data.header.date || '—'}</span>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Naskah soal</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Tampilan mengikuti bentuk soal sebenarnya, bukan daftar teks mentah.
            </p>
          </div>
          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-700">
              <p className="text-neutral-500 dark:text-neutral-400">Belum ada soal.</p>
            </div>
          ) : (
            questions.map((question, index) =>
              editing ? (
                <EditorCard
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={updateQuestion}
                  onUpdateOption={updateOption}
                  onRemove={() =>
                    setData(
                      'questions',
                      data.questions.filter((_, i) => i !== index)
                    )
                  }
                />
              ) : (
                <QuestionRenderer
                  key={question.id}
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
              onClick={addQuestion}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-4 text-sm font-semibold text-neutral-600 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-neutral-700 dark:text-neutral-400"
            >
              <Plus className="h-4 w-4" /> Tambah soal
            </button>
          )}
        </section>
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
  question: ExamQuestion
  index: number
  onUpdate: (index: number, patch: Partial<ExamQuestion>) => void
  onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void
  onRemove: () => void
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
