import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx'
import type TeachingModule from '#models/teaching_module'
import type Exam from '#models/exam'
import type AnnualPlan from '#models/annual_plan'
import type SemesterPlan from '#models/semester_plan'
import type User from '#models/user'
import { assertEntitled, recordUsage } from '#services/entitlement_service'

async function consumeExport(user: User) {
  await assertEntitled(user, 'export_docx')
  await recordUsage(user.id, 'export_docx', 1)
}

const EXAM_TYPE_LABELS: Record<string, string> = {
  midterm: 'PTS (Penilaian Tengah Semester)',
  final: 'PAS (Penilaian Akhir Semester)',
  daily: 'Ulangan Harian',
  summative: 'Sumatif',
}

function kopParagraphs(user: User, subtitle: string) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: user.schoolName || 'Sekolah', bold: true, size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: subtitle, size: 22 })],
    }),
    new Paragraph({ text: '' }),
  ]
}

function richTextItems(value: string | string[] | undefined): string[] {
  const items = Array.isArray(value) ? value : value ? [value] : []
  return items
    .map((item) => item.replace(/<br\s*\/?>(\s*)/gi, '\n').replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)
}

function sectionParagraphs(title: string, value: string | string[] | undefined) {
  const items = richTextItems(value)
  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: title, bold: true })],
    }),
  ]

  if (items.length === 0) {
    paragraphs.push(new Paragraph({ text: '-' }))
  } else {
    for (const item of items) {
      paragraphs.push(new Paragraph({ text: item, bullet: { level: 0 } }))
    }
  }

  paragraphs.push(new Paragraph({ text: '' }))
  return paragraphs
}

async function toBuffer(doc: Document) {
  return Packer.toBuffer(doc)
}

export async function exportTeachingModule(teachingModule: TeachingModule, user: User) {
  await consumeExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'kompetensiDasar', title: 'Kompetensi Dasar' },
    { key: 'tujuanPembelajaran', title: 'Tujuan Pembelajaran' },
    { key: 'kegiatan', title: 'Kegiatan Pembelajaran' },
    { key: 'penilaian', title: 'Penilaian' },
    { key: 'sumberBelajar', title: 'Sumber Belajar' },
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          ...kopParagraphs(user, 'Modul Ajar'),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: teachingModule.title, bold: true })],
          }),
          new Paragraph({ text: `Mata Pelajaran: ${teachingModule.subject}` }),
          new Paragraph({ text: `Fase: ${teachingModule.phase}` }),
          new Paragraph({ text: '' }),
          ...sections.flatMap((s) =>
            sectionParagraphs(s.title, teachingModule.content[s.key])
          ),
        ],
      },
    ],
  })

  return toBuffer(doc)
}

export async function exportExam(exam: Exam, user: User) {
  await consumeExport(user)
  const questionParagraphs = exam.questions.flatMap((q, i) => {
    const paragraphs = [
      new Paragraph({
        children: [new TextRun({ text: `${i + 1}. ${q.question}`, bold: true })],
      }),
    ]
    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        paragraphs.push(new Paragraph({ text: opt }))
      }
    }
    paragraphs.push(new Paragraph({ text: '' }))
    return paragraphs
  })

  const answerKeyParagraphs = exam.questions.map(
    (q, i) =>
      new Paragraph({ text: `${i + 1}. ${q.answer}${q.explanation ? ` — ${q.explanation}` : ''}` })
  )

  const doc = new Document({
    sections: [
      {
        children: [
          ...kopParagraphs(user, EXAM_TYPE_LABELS[exam.type] ?? exam.type),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: exam.title, bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...questionParagraphs,
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: 'Kunci Jawaban', bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...answerKeyParagraphs,
        ],
      },
    ],
  })

  return toBuffer(doc)
}

export async function exportAnnualPlan(annualPlan: AnnualPlan, user: User) {
  await consumeExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'kompetensi', title: 'Kompetensi' },
    { key: 'alokasiWaktu', title: 'Alokasi Waktu' },
    { key: 'kegiatan', title: 'Kegiatan' },
    { key: 'minggu', title: 'Pembagian Minggu' },
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          ...kopParagraphs(user, 'Program Tahunan'),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: annualPlan.subject, bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...sections.flatMap((s) => sectionParagraphs(s.title, annualPlan.content[s.key] ?? [])),
        ],
      },
    ],
  })

  return toBuffer(doc)
}

export async function exportSemesterPlan(semesterPlan: SemesterPlan, user: User) {
  await consumeExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'minggu', title: 'Pembagian Minggu' },
    { key: 'kegiatan', title: 'Kegiatan' },
    { key: 'target', title: 'Target Pembelajaran' },
    { key: 'materi', title: 'Materi Pembelajaran' },
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          ...kopParagraphs(user, 'Program Semester'),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: semesterPlan.subject, bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...sections.flatMap((s) => sectionParagraphs(s.title, semesterPlan.content[s.key] ?? [])),
        ],
      },
    ],
  })

  return toBuffer(doc)
}
