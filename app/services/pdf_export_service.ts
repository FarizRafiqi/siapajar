import PDFDocument from 'pdfkit'
import type TeachingModule from '#models/teaching_module'
import type Exam from '#models/exam'
import type AnnualPlan from '#models/annual_plan'
import type SemesterPlan from '#models/semester_plan'
import type User from '#models/user'

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

function writeSection(doc: PDFKit.PDFDocument, title: string, items: string[]) {
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
    writeSection(doc, s.title, teachingModule.content[s.key] ?? [])
  }

  return toBuffer(doc)
}

export async function exportExamPdf(exam: Exam, user: User) {
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
