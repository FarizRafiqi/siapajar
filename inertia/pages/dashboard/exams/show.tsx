import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, useForm, Link } from '@inertiajs/react'
import { useState } from 'react'
import { ArrowLeft, Download, Pencil, Save, X, Trash2, Plus } from 'lucide-react'
import { cn } from '~/lib/utils'
import { type ExamType, examTypeLabel } from './index'

interface SchoolClass {
  id: number
  name: string
  gradeLevel: number
}

interface Question {
  id: number
  type: string
  question: string
  options: string[]
  answer: string
  explanation: string
}

interface Exam {
  id: number
  title: string
  type: ExamType
  status: 'draft' | 'published'
  questions: Question[]
  createdAt: string
  schoolClass: SchoolClass
}

interface ExamShowProps {
  readonly exam: Exam
}

export default function ExamShow({ exam }: ExamShowProps) {
  const [editing, setEditing] = useState(false)

  const { data, setData, put, processing, reset } = useForm({
    title: exam.title,
    type: exam.type,
    status: exam.status,
    questions: exam.questions ?? [],
  })

  const handleSave = () => {
    put(`/exams/${exam.id}`, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleCancelEdit = () => {
    reset()
    setEditing(false)
  }

  const handleTogglePublish = () => {
    const nextStatus = exam.status === 'published' ? 'draft' : 'published'
    setData('status', nextStatus)
    put(`/exams/${exam.id}`, { onSuccess: () => setEditing(false) })
  }

  const handleExport = () => {
    window.location.href = `/exams/${exam.id}/export`
  }

  const updateQuestion = (index: number, patch: Partial<Question>) => {
    setData(
      'questions',
      data.questions.map((q, i) => (i === index ? { ...q, ...patch } : q))
    )
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setData(
      'questions',
      data.questions.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.map((o, oi) => (oi === optionIndex ? value : o)) }
          : q
      )
    )
  }

  const removeQuestion = (index: number) => {
    setData(
      'questions',
      data.questions.filter((_, i) => i !== index)
    )
  }

  const addQuestion = () => {
    const nextId = Math.max(0, ...data.questions.map((q) => q.id)) + 1
    setData('questions', [
      ...data.questions,
      {
        id: nextId,
        type: 'multiple_choice',
        question: '',
        options: ['A. ', 'B. ', 'C. ', 'D. '],
        answer: 'A',
        explanation: '',
      },
    ])
  }

  const questions = editing ? data.questions : (exam.questions ?? [])
  const isMajorExam = exam.type === 'midterm' || exam.type === 'final'
  const isPublished = exam.status === 'published'

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
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/exams"
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{exam.title}</h2>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  isMajorExam
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                )}
              >
                {examTypeLabel(exam.type)}
              </span>
              <button
                onClick={handleTogglePublish}
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
                  isPublished
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                )}
                title={isPublished ? 'Klik untuk jadikan draf' : 'Klik untuk terbitkan'}
              >
                {isPublished ? 'Terbit' : 'Draf'}
              </button>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Kelas {exam.schoolClass.name} • {questions.length} soal
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" />
              Export DOCX
            </button>
            {editing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={processing}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Daftar Soal */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
              <p className="text-neutral-500 dark:text-neutral-400">Belum ada soal</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {index + 1}
                  </span>
                  {editing ? (
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, { question: e.target.value })}
                      rows={2}
                      className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                      placeholder="Tulis pertanyaan"
                    />
                  ) : (
                    <p className="flex-1 text-neutral-900 dark:text-white">{question.question}</p>
                  )}
                  {editing && (
                    <button
                      onClick={() => removeQuestion(index)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Hapus soal ini"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {question.options && question.options.length > 0 && (
                  <div className="ml-10 space-y-2">
                    {question.options.map((option, optionIndex) =>
                      editing ? (
                        <input
                          key={`${question.id}-opt-${optionIndex}`}
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        />
                      ) : (
                        <div
                          key={`${question.id}-opt-${optionIndex}`}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm',
                            option.startsWith(question.answer)
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
                          )}
                        >
                          {option}
                        </div>
                      )
                    )}
                  </div>
                )}

                {editing && (
                  <div className="ml-10 mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`answer-${question.id}`}
                        className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
                      >
                        Kunci Jawaban
                      </label>
                      <input
                        id={`answer-${question.id}`}
                        type="text"
                        value={question.answer}
                        onChange={(e) => updateQuestion(index, { answer: e.target.value })}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        placeholder="contoh: A"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`explanation-${question.id}`}
                        className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
                      >
                        Pembahasan
                      </label>
                      <input
                        id={`explanation-${question.id}`}
                        type="text"
                        value={question.explanation}
                        onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        placeholder="opsional"
                      />
                    </div>
                  </div>
                )}

                {!editing && question.explanation && (
                  <div className="ml-10 mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    <strong>Pembahasan:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))
          )}

          {editing && (
            <button
              onClick={addQuestion}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-4 text-sm font-medium text-neutral-600 hover:border-emerald-400 hover:text-emerald-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
            >
              <Plus className="h-4 w-4" />
              Tambah Soal
            </button>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}
