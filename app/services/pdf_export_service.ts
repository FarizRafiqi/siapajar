import PDFDocument from 'pdfkit'
import type TeachingModule from '#models/teaching_module'
import type Exam from '#models/exam'
import type AnnualPlan from '#models/annual_plan'
import type SemesterPlan from '#models/semester_plan'
import type User from '#models/user'
import type { StudentReport, PaudStudentNarrative } from '#services/report_card_service'
import { assertEntitled, recordUsage } from '#services/entitlement_service'

async function consumePdfExport(user: User) {
  await assertEntitled(user, 'export_pdf')
  await recordUsage(user.id, 'export_pdf', 1)
}

const EXAM_TYPE_LABELS: Record<string, string> = {
  midterm: 'PTS (Penilaian Tengah Semester)',
  final: 'PAS (Penilaian Akhir Semester)',
  daily: 'Ulangan Harian',
  summative: 'Sumatif',
}

function toBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    doc.end()
  })
}

function writeKop(doc: PDFKit.PDFDocument, user: User, subtitle: string) {
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text(user.schoolName || 'Sekolah', { align: 'center' })
  doc.font('Helvetica').fontSize(11).text(subtitle, { align: 'center' })
  doc.moveDown(1)
}

function writeSection(
  doc: PDFKit.PDFDocument,
  title: string,
  value: string | string[] | undefined
) {
  const items = (Array.isArray(value) ? value : value ? [value] : [])
    .map((item) =>
      item
        .replace(/<br\s*\/?>(\s*)/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim()
    )
    .filter(Boolean)
  doc.font('Helvetica-Bold').fontSize(12).text(title)
  doc.font('Helvetica').fontSize(10)
  if (items.length === 0) {
    doc.text('-')
  } else {
    for (const item of items) {
      doc.text(`• ${item}`)
    }
  }
  doc.moveDown(0.5)
}

export async function exportTeachingModulePdf(teachingModule: TeachingModule, user: User) {
  await consumePdfExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'kompetensiDasar', title: 'Kompetensi Dasar' },
    { key: 'tujuanPembelajaran', title: 'Tujuan Pembelajaran' },
    { key: 'kegiatan', title: 'Kegiatan Pembelajaran' },
    { key: 'penilaian', title: 'Penilaian' },
    { key: 'sumberBelajar', title: 'Sumber Belajar' },
  ]

  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Modul Ajar')
  doc.font('Helvetica-Bold').fontSize(16).text(teachingModule.title)
  doc.font('Helvetica').fontSize(10).text(`Mata Pelajaran: ${teachingModule.subject}`)
  doc.text(`Fase: ${teachingModule.phase}`)
  doc.moveDown(1)
  for (const s of sections) {
    writeSection(doc, s.title, teachingModule.content[s.key])
  }

  return toBuffer(doc)
}

export async function exportExamPdf(exam: Exam, user: User) {
  await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, EXAM_TYPE_LABELS[exam.type] ?? exam.type)
  doc.font('Helvetica-Bold').fontSize(16).text(exam.title)
  doc.moveDown(1)

  doc.font('Helvetica').fontSize(10)
  exam.questions.forEach((q, i) => {
    doc.font('Helvetica-Bold').text(`${i + 1}. ${q.question}`)
    doc.font('Helvetica')
    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        doc.text(opt)
      }
    }
    doc.moveDown(0.5)
  })

  doc.addPage()
  doc.font('Helvetica-Bold').fontSize(14).text('Kunci Jawaban')
  doc.moveDown(0.5)
  doc.font('Helvetica').fontSize(10)
  exam.questions.forEach((q, i) => {
    doc.text(`${i + 1}. ${q.answer}${q.explanation ? ` — ${q.explanation}` : ''}`)
  })

  return toBuffer(doc)
}

export async function exportAnnualPlanPdf(annualPlan: AnnualPlan, user: User) {
  await consumePdfExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'kompetensi', title: 'Kompetensi' },
    { key: 'alokasiWaktu', title: 'Alokasi Waktu' },
    { key: 'kegiatan', title: 'Kegiatan' },
    { key: 'minggu', title: 'Pembagian Minggu' },
  ]

  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Program Tahunan')
  doc.font('Helvetica-Bold').fontSize(16).text(annualPlan.subject)
  doc.moveDown(1)
  for (const s of sections) {
    writeSection(doc, s.title, annualPlan.content[s.key] ?? [])
  }

  return toBuffer(doc)
}

export async function exportSemesterPlanPdf(semesterPlan: SemesterPlan, user: User) {
  await consumePdfExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'minggu', title: 'Pembagian Minggu' },
    { key: 'kegiatan', title: 'Kegiatan' },
    { key: 'target', title: 'Target Pembelajaran' },
    { key: 'materi', title: 'Materi Pembelajaran' },
  ]

  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Program Semester')
  doc.font('Helvetica-Bold').fontSize(16).text(semesterPlan.subject)
  doc.moveDown(1)
  for (const s of sections) {
    writeSection(doc, s.title, semesterPlan.content[s.key] ?? [])
  }

  return toBuffer(doc)
}

interface ReportCardContext {
  className: string
  semesterLabel: string
  totalStudents: number
}

export async function exportReportCardPdf(
  report: StudentReport,
  user: User,
  ctx: ReportCardContext
) {
  await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, `Rapor — ${ctx.semesterLabel}`)

  doc.font('Helvetica-Bold').fontSize(16).text(report.fullName)
  doc.font('Helvetica').fontSize(10).text(`NIS: ${report.nis} • Kelas: ${ctx.className}`)
  doc.moveDown(1)

  doc.font('Helvetica-Bold').fontSize(12).text('Nilai per Mata Pelajaran')
  doc.font('Helvetica').fontSize(10)
  for (const subject of report.subjects) {
    const value = subject.average === null ? '-' : subject.average.toFixed(1)
    doc.text(`${subject.subject}: ${value}`)
  }
  doc.moveDown(1)

  doc.font('Helvetica-Bold').fontSize(12).text('Ringkasan')
  doc.font('Helvetica').fontSize(10)
  doc.text(
    `Rata-rata keseluruhan: ${report.overallAverage === null ? '-' : report.overallAverage.toFixed(1)}`
  )
  doc.text(
    report.rank === null
      ? 'Peringkat: -'
      : `Peringkat: ${report.rank} dari ${ctx.totalStudents} siswa`
  )

  return toBuffer(doc)
}

function formatPaudContent(entry: PaudStudentNarrative['entries'][number]) {
  const content = entry.content as Record<string, unknown>
  switch (entry.type) {
    case 'checklist': {
      const indicators = Array.isArray(content.indicators) ? (content.indicators as string[]) : []
      const note = typeof content.note === 'string' ? content.note : ''
      return [indicators.join(', '), note].filter(Boolean).join(' — ')
    }
    case 'anecdotal_note':
      return `Latar: ${content.context ?? '-'} — Perilaku: ${content.behavior ?? '-'} — Analisis: ${content.analysis ?? '-'}`
    case 'work_sample':
      return `${content.photoDescription ?? '-'} — ${content.description ?? ''}${content.analysis ? ` (${content.analysis})` : ''}`
    case 'photo_series':
      return `${content.activity ?? '-'} — ${content.narrative ?? ''}`
    default:
      return ''
  }
}

export async function exportNarrativeReportPdf(
  narrative: PaudStudentNarrative,
  user: User,
  ctx: ReportCardContext
) {
  await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, `Rapor Perkembangan — ${ctx.semesterLabel}`)

  doc.font('Helvetica-Bold').fontSize(16).text(narrative.fullName)
  doc.font('Helvetica').fontSize(10).text(`NIS: ${narrative.nis} • Kelompok: ${ctx.className}`)
  doc.moveDown(1)

  if (narrative.entries.length === 0) {
    doc.font('Helvetica').fontSize(10).text('Belum ada asesmen yang tercatat pada semester ini.')
  } else {
    for (const entry of narrative.entries) {
      doc.font('Helvetica-Bold').fontSize(11).text(`${entry.typeLabel} — ${entry.date}`)
      doc.font('Helvetica').fontSize(10).text(formatPaudContent(entry))
      doc.moveDown(0.5)
    }
  }

  doc.moveDown(0.75)
  doc.font('Helvetica-Bold').fontSize(12).text('Narasi Perkembangan')
  doc.font('Helvetica').fontSize(10)
  for (const item of narrative.narratives) {
    doc.font('Helvetica-Bold').text(item.element)
    doc.font('Helvetica').text(item.content.trim() || 'Belum ada narasi yang disetujui.')
    doc.moveDown(0.5)
  }

  return toBuffer(doc)
}
