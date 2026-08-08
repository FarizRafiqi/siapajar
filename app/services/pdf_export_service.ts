import PDFDocument from 'pdfkit'
import type TeachingModule from '#models/teaching_module'
import type Exam from '#models/exam'
import type AnnualPlan from '#models/annual_plan'
import type SemesterPlan from '#models/semester_plan'
import type WeeklyLessonPlan from '#models/weekly_lesson_plan'
import type DailyLessonPlan from '#models/daily_lesson_plan'
import type Lkpd from '#models/lkpd'
import type Assessment from '#models/assessment'
import type PaudAssessment from '#models/paud_assessment'
import type { StudentReport, PaudStudentNarrative } from '#services/report_card_service'
import type User from '#models/user'
import { commitUsageReservation, reserveUsage } from '#services/entitlement_service'
import { auditService } from '#services/audit_service'
import { randomUUID } from 'node:crypto'

async function consumePdfExport(user: User) {
  const reservationKey = `export:pdf:${user.id}:${randomUUID()}`
  const reserved = await reserveUsage(user, 'export_pdf', reservationKey, 1, { format: 'pdf' })
  if (reserved) await commitUsageReservation(reservationKey)
  await auditService.record({
    actorId: user.id,
    action: 'export.pdf',
    entityType: 'document',
    metadata: { format: 'pdf' },
  })
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

function stripTags(html: string): string {
  let result = ''
  let inTag = false
  for (const char of html) {
    if (char === '<') {
      inTag = true
    } else if (char === '>') {
      inTag = false
    } else if (!inTag) {
      result += char
    }
  }
  return result.trim()
}

function cleanHtmlText(text: string): string {
  const withNewlines = text
    .replaceAll('<br>', '\n')
    .replaceAll('<br/>', '\n')
    .replaceAll('<br />', '\n')
    .replaceAll('<BR>', '\n')
    .replaceAll('<BR/>', '\n')
    .replaceAll('<BR />', '\n')
  return stripTags(withNewlines)
}

function writeSection(
  doc: PDFKit.PDFDocument,
  title: string,
  value: string | string[] | undefined
) {
  let rawList: string[] = []
  if (Array.isArray(value)) {
    rawList = value
  } else if (value) {
    rawList = [value]
  }

  const items = rawList.map(cleanHtmlText).filter(Boolean)
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

function writeExamHeader(doc: PDFKit.PDFDocument, exam: Exam, user: User) {
  const header = exam.header ?? {}
  const kop = user.kopSurat ?? {}

  const logoUrl = header.logoUrl || kop.logoUrl
  const institutionName = (
    header.institutionName ||
    kop.institutionName ||
    user.schoolName ||
    'SEKOLAH / TK'
  ).toUpperCase()
  const institutionSubName = (header.institutionSubName || kop.institutionSubName || '').toUpperCase()
  const addressLine1 = header.addressLine1 || header.institutionAddress || kop.addressLine1 || ''
  const addressLine2 = header.addressLine2 || kop.addressLine2 || ''
  const phone = header.phone || kop.phone || ''

  const startY = doc.y

  // Render Logo if available
  if (typeof logoUrl === 'string' && logoUrl.startsWith('data:image/')) {
    try {
      doc.image(Buffer.from(logoUrl.split(',')[1], 'base64'), 50, startY, { fit: [55, 55] })
    } catch {}
  }

  // Header Title
  doc.font('Helvetica-Bold').fontSize(14).text(institutionName, { align: 'center' })
  if (institutionSubName) {
    doc.font('Helvetica-Bold').fontSize(13).text(`“${institutionSubName}”`, { align: 'center' })
  }
  doc.font('Helvetica').fontSize(9)
  if (addressLine1) doc.text(addressLine1, { align: 'center' })
  if (addressLine2) doc.text(addressLine2, { align: 'center' })
  if (phone) doc.text(phone, { align: 'center' })

  doc.moveDown(0.5)

  // Double Line Separator
  const lineY = doc.y
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  doc
    .moveTo(doc.page.margins.left, lineY)
    .lineTo(doc.page.margins.left + pageWidth, lineY)
    .lineWidth(2)
    .strokeColor('#000000')
    .stroke()

  doc
    .moveTo(doc.page.margins.left, lineY + 3)
    .lineTo(doc.page.margins.left + pageWidth, lineY + 3)
    .lineWidth(0.8)
    .strokeColor('#000000')
    .stroke()

  doc.y = lineY + 12

  // Metadata Kiri & Tabel Nilai/Paraf Kanan
  const metaY = doc.y
  const leftX = doc.page.margins.left
  const rightX = doc.page.width - doc.page.margins.right - 180

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#000000')
  doc.text(`Nama         : ............................................`, leftX, metaY)
  doc.text(`Kelas          : ${header.groupName || 'B2'}`, leftX, metaY + 14)
  doc.text(`Hari/Tanggal : ............................................`, leftX, metaY + 28)
  doc.text(`Bidang Studi : ${header.subject || 'Bahasa'}`, leftX, metaY + 42)

  // Render Table Nilai & Paraf (Right Side)
  const tableY = metaY
  const tableW = 180
  const tableH = 50

  doc.rect(rightX, tableY, tableW, tableH).lineWidth(1).strokeColor('#000000').stroke()
  // Vertical dividers: Nilai | Paraf (Guru | Orang Tua)
  doc.moveTo(rightX + 60, tableY).lineTo(rightX + 60, tableY + tableH).lineWidth(1).stroke()
  doc.moveTo(rightX + 120, tableY + 16).lineTo(rightX + 120, tableY + tableH).lineWidth(1).stroke()
  // Horizontal divider 1: Paraf sub-header divider (ONLY under Paraf header, not across Nilai)
  doc.moveTo(rightX + 60, tableY + 16).lineTo(rightX + tableW, tableY + 16).lineWidth(1).stroke()
  // Horizontal divider 2: Bottom header divider
  doc.moveTo(rightX, tableY + 30).lineTo(rightX + tableW, tableY + 30).lineWidth(1).stroke()

  doc.font('Helvetica-Bold').fontSize(9)
  doc.text('Nilai', rightX, tableY + 10, { width: 60, align: 'center' })
  doc.text('Paraf', rightX + 60, tableY + 3, { width: 120, align: 'center' })
  doc.font('Helvetica').fontSize(7.5)
  doc.text('Guru', rightX + 60, tableY + 18, { width: 60, align: 'center' })
  doc.text('Orang Tua', rightX + 120, tableY + 18, { width: 60, align: 'center' })

  doc.y = metaY + 62
}

function matchingItems(value: unknown) {
  return Array.isArray(value)
    ? value.map((item: any) => ({
        label: typeof item === 'string' ? item : item?.label || item?.text || '',
        imageUrl: typeof item === 'object' ? item?.imageUrl || item?.image : undefined,
      }))
    : []
}

function writeMatchingGrid(doc: PDFKit.PDFDocument, q: Record<string, any>) {
  const leftItems = matchingItems(q.leftItems)
  const rightItems = matchingItems(q.rightItems)
  const rows = Math.max(leftItems.length, rightItems.length, 3)
  const startX = doc.page.margins.left
  const rowHeight = 32

  for (let index = 0; index < rows; index++) {
    if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) doc.addPage()
    const y = doc.y
    const left = leftItems[index]
    const right = rightItems[index]

    // 5 Column Matching Row Layout: [Item Kiri: 130pt] [Bullet Kiri: 20pt] [Spacer: 150pt] [Bullet Kanan: 20pt] [Item Kanan: 140pt]
    const col1X = startX
    const col2X = startX + 130
    const col4X = startX + 300
    const col5X = startX + 325

    // Item Kiri Text / Image
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#000000')
    if (left?.imageUrl?.startsWith('data:image/')) {
      try {
        doc.image(Buffer.from(left.imageUrl.split(',')[1], 'base64'), col1X, y, { fit: [28, 28] })
      } catch {}
    } else {
      doc.text(left?.label || '', col1X, y + 8, { width: 125 })
    }

    // Bullet Kiri
    doc.circle(col2X + 10, y + 12, 3.5).fillColor('#000000').fill()

    // Bullet Kanan
    doc.circle(col4X + 10, y + 12, 3.5).fillColor('#000000').fill()

    // Item Kanan Text
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#000000')
    doc.text(right?.label || '', col5X, y + 8, { width: 135 })

    doc.y = y + rowHeight
  }
  doc.moveDown(0.4)
}

function writeExamQuestion(doc: PDFKit.PDFDocument, q: Record<string, any>, number: number) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - 70) {
    doc.addPage()
  }

  const isMatching =
    q.type === 'matching' ||
    String(q.visualType || '')
      .toLowerCase()
      .includes('hubung')

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(`${number}. ${q.question || 'Pertanyaan belum diisi.'}`)
  if (q.instruction) doc.font('Helvetica-Oblique').fontSize(9).text(`Petunjuk: ${q.instruction}`)

  if (!isMatching && Array.isArray(q.options) && q.options.length > 0) {
    doc.font('Helvetica').fontSize(9)
    let optionsLine = ''
    q.options.forEach((option: unknown, index: number) => {
      const label =
        typeof option === 'string'
          ? String.fromCodePoint(97 + index)
          : (option as any)?.label?.toLowerCase() || String.fromCodePoint(97 + index)
      const text = typeof option === 'string' ? option : (option as any)?.text || ''
      optionsLine += `${label}. ${text}            `
    })
    doc.text(optionsLine)
    doc.moveDown(0.4)
  } else if (isMatching) {
    writeMatchingGrid(doc, q)
  } else if (['essay', 'visual', 'practical', 'oral', 'fill_blank_image'].includes(q.type)) {
    doc.font('Helvetica').text('........................................................................................................................')
  }
  if (q.imageUrl?.startsWith('data:image/')) {
    try {
      doc.image(Buffer.from(q.imageUrl.split(',')[1], 'base64'), {
        fit: [360, 220],
        align: 'center',
      })
    } catch {}
  }
  doc.moveDown(0.5)
}

export async function exportTeachingModulePdf(
  teachingModule: TeachingModule,
  user: User,
  charge = true
) {
  if (charge) await consumePdfExport(user)
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

export async function exportExamPdf(exam: Exam, user: User, charge = true) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeExamHeader(doc, exam, user)
  doc.font('Helvetica-Bold').fontSize(16).text(exam.title)
  doc.moveDown(1)
  exam.questions.forEach((q, i) => writeExamQuestion(doc, q, i + 1))

  doc.addPage()
  doc.font('Helvetica-Bold').fontSize(14).text('Kunci Jawaban')
  doc.moveDown(0.5)
  doc.font('Helvetica').fontSize(10)
  exam.questions.forEach((q, i) => {
    const ansText = String(q.answer ?? '')
    const expText = q.explanation ? ` — ${q.explanation}` : ''
    doc.text(`${i + 1}. ${ansText}${expText}`)
  })

  return toBuffer(doc)
}

export async function exportAnnualPlanPdf(annualPlan: AnnualPlan, user: User, charge = true) {
  if (charge) await consumePdfExport(user)
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

export async function exportSemesterPlanPdf(semesterPlan: SemesterPlan, user: User, charge = true) {
  if (charge) await consumePdfExport(user)
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
  ctx: ReportCardContext,
  charge = true
) {
  if (charge) await consumePdfExport(user)
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

function formatPaudAnecdotal(c: Record<string, unknown>): string {
  const context = typeof c.context === 'string' ? c.context : '-'
  const behavior = typeof c.behavior === 'string' ? c.behavior : '-'
  const analysis = typeof c.analysis === 'string' ? c.analysis : '-'
  return `Latar: ${context} — Perilaku: ${behavior} — Analisis: ${analysis}`
}

function formatPaudWorkSample(c: Record<string, unknown>): string {
  const photo = typeof c.photoDescription === 'string' ? c.photoDescription : '-'
  const desc = typeof c.description === 'string' ? c.description : ''
  const analysis = typeof c.analysis === 'string' ? ` (${c.analysis})` : ''
  return `${photo} — ${desc}${analysis}`
}

function formatPaudPhotoSeries(c: Record<string, unknown>): string {
  const act = typeof c.activity === 'string' ? c.activity : '-'
  const nar = typeof c.narrative === 'string' ? c.narrative : ''
  return `${act} — ${nar}`
}

function formatPaudContent(entry: PaudStudentNarrative['entries'][number]) {
  const content = entry.content as Record<string, unknown>
  if (entry.type === 'checklist') {
    const indicators = Array.isArray(content.indicators) ? (content.indicators as string[]) : []
    const note = typeof content.note === 'string' ? content.note : ''
    return [indicators.join(', '), note].filter(Boolean).join(' — ')
  }
  if (entry.type === 'anecdotal_note') return formatPaudAnecdotal(content)
  if (entry.type === 'work_sample') return formatPaudWorkSample(content)
  if (entry.type === 'photo_series') return formatPaudPhotoSeries(content)
  return ''
}

export async function exportNarrativeReportPdf(
  narrative: PaudStudentNarrative,
  user: User,
  ctx: ReportCardContext,
  charge = true
) {
  if (charge) await consumePdfExport(user)
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

function writeMetadata(doc: PDFKit.PDFDocument, values: Array<[string, unknown]>) {
  doc.font('Helvetica').fontSize(10)
  for (const [label, rawValue] of values) {
    if (rawValue !== null && rawValue !== undefined) {
      let textVal = ''
      if (typeof rawValue === 'string') {
        textVal = rawValue
      } else if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
        textVal = String(rawValue)
      } else {
        textVal = JSON.stringify(rawValue)
      }
      if (textVal.trim() !== '') {
        doc.text(`${label}: ${textVal}`)
      }
    }
  }
  doc.moveDown(0.75)
}

function formatSingleValue(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return JSON.stringify(v)
}

function writeContentObject(doc: PDFKit.PDFDocument, content: Record<string, unknown>) {
  for (const [key, value] of Object.entries(content)) {
    if (key === 'curriculum' || key === 'tema') continue
    const formatted = Array.isArray(value)
      ? value.map(formatSingleValue)
      : formatSingleValue(value)
    writeSection(doc, key, formatted)
  }
}

export async function exportCurriculumPdf(
  cps: Array<Record<string, any>>,
  sequences: Array<Record<string, any>>,
  user: User,
  charge = true
) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Kurikulum CP, TP, ATP, dan IKTP')
  doc.font('Helvetica-Bold').fontSize(16).text('Capaian Pembelajaran (CP)')
  doc.moveDown(0.5)
  for (const cp of cps) {
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(`${cp.code ?? ''} ${cp.title ?? ''}`.trim())
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`${cp.element ?? ''} • ${cp.phase ?? ''} • ${cp.curriculumVersion ?? ''}`)
    doc.text(cp.description || '-')
    for (const objective of cp.learningObjectives ?? []) {
      doc.text(`• TP ${objective.code ?? ''}: ${objective.title ?? '-'}`)
      for (const indicator of objective.indicators ?? [])
        doc.text(`  • IKTP: ${indicator.description ?? '-'}`)
    }
    doc.moveDown(0.5)
  }
  doc.font('Helvetica-Bold').fontSize(16).text('Alur Tujuan Pembelajaran (ATP)')
  doc.moveDown(0.5)
  for (const sequence of sequences) {
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(sequence.title || 'ATP')
    writeMetadata(doc, [
      ['Profil', sequence.educationLevel],
      ['Kelompok', sequence.groupContext],
      ['Versi kurikulum', sequence.curriculumVersion],
      ['Status', sequence.status],
    ])
    for (const [index, item] of (sequence.items ?? []).entries())
      doc.text(`${index + 1}. ${item.title ?? item.learningObjectiveId ?? '-'}`)
    doc.moveDown(0.5)
  }
  return toBuffer(doc)
}

export async function exportWeeklyLessonPlanPdf(
  weekly: WeeklyLessonPlan,
  user: User,
  charge = true
) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Rencana Pelaksanaan Pembelajaran Mingguan (RPPM)')
  doc.font('Helvetica-Bold').fontSize(16).text(weekly.theme)
  writeMetadata(doc, [
    ['Kelompok', weekly.schoolClass?.name],
    ['Mulai minggu', weekly.weekStartDate?.toFormat('dd/MM/yyyy')],
    ['Status', weekly.status],
  ])
  writeContentObject(doc, weekly.content ?? {})
  return toBuffer(doc)
}

export async function exportDailyLessonPlanPdf(daily: DailyLessonPlan, user: User, charge = true) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Rencana Pelaksanaan Pembelajaran Harian (RPPH)')
  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .text(String(daily.content?.tema || 'RPPH'))
  writeMetadata(doc, [
    ['Kelompok', daily.schoolClass?.name],
    ['Tanggal', daily.date?.toFormat('dd/MM/yyyy')],
    ['Status', daily.status],
  ])
  writeContentObject(doc, daily.content ?? {})
  return toBuffer(doc)
}

export async function exportLkpdPdf(lkpd: Lkpd, user: User, charge = true) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Lembar Kerja Peserta Didik (LKPD)')
  doc.font('Helvetica-Bold').fontSize(16).text(lkpd.title)
  writeMetadata(doc, [
    ['Kelompok', lkpd.schoolClass?.name],
    ['Usia', lkpd.ageGroup],
    ['Institusi', lkpd.institutionType],
    ['Tema', lkpd.theme],
    ['Subtema', lkpd.subtheme],
  ])
  writeContentObject(doc, lkpd.content ?? {})
  return toBuffer(doc)
}

export async function exportAssessmentPdf(assessment: Assessment, user: User, charge = true) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Rekap Penilaian')
  doc.font('Helvetica-Bold').fontSize(16).text(assessment.title)
  writeMetadata(doc, [
    ['Mata pelajaran', assessment.subject],
    ['Kelas', assessment.schoolClass?.name],
    ['Tanggal', assessment.date?.toFormat('dd/MM/yyyy')],
    ['Jenis', assessment.type],
    ['Tujuan pembelajaran', assessment.learningObjective],
  ])
  doc.font('Helvetica-Bold').fontSize(12).text('Daftar Nilai')
  doc.font('Helvetica').fontSize(10)
  for (const [index, score] of (assessment.scores ?? []).entries()) {
    const valText = score.value ?? '-'
    const noteText = score.note ? ` — ${score.note}` : ''
    doc.text(`${index + 1}. ${score.student.fullName} (${score.student.nis}) — Nilai: ${valText}${noteText}`)
  }
  return toBuffer(doc)
}

export async function exportPaudAssessmentPdf(
  assessment: PaudAssessment,
  user: User,
  charge = true
) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, 'Catatan Asesmen PAUD')
  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .text(assessment.student?.fullName || 'Asesmen PAUD')
  writeMetadata(doc, [
    ['Kelompok', assessment.schoolClass?.name],
    ['Tanggal', assessment.date?.toFormat('dd/MM/yyyy')],
    ['Jenis asesmen', assessment.type],
    ['Status ketercapaian', assessment.achievementStatus],
    ['Kegiatan', assessment.activity],
  ])
  writeSection(doc, 'Catatan Guru', assessment.teacherNote || '')
  writeContentObject(doc, assessment.content ?? {})
  if (assessment.attachments?.length)
    writeSection(
      doc,
      'Evidence',
      assessment.attachments.map((file) => file.originalName)
    )
  return toBuffer(doc)
}

export async function exportStudentReportDocPdf(
  report: StudentReport,
  user: User,
  ctx: { className: string; semesterLabel: string; totalStudents: number }
) {
  await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, `Rapor — ${ctx.semesterLabel}`)
  doc.font('Helvetica-Bold').fontSize(16).text(report.fullName)
  writeMetadata(doc, [
    ['NIS', report.nis],
    ['Kelas', ctx.className],
  ])
  writeSection(
    doc,
    'Nilai per Mata Pelajaran',
    report.subjects.map((subject) => `${subject.subject}: ${subject.average?.toFixed(1) ?? '-'}`)
  )
  writeSection(doc, 'Ringkasan', [
    `Rata-rata keseluruhan: ${report.overallAverage?.toFixed(1) ?? '-'}`,
    `Peringkat: ${report.rank ?? '-'} dari ${ctx.totalStudents} siswa`,
  ])
  return toBuffer(doc)
}

export async function exportNarrativeReportDocPdf(
  narrative: PaudStudentNarrative,
  user: User,
  ctx: { className: string; semesterLabel: string }
) {
  await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 50 })
  writeKop(doc, user, `Rapor Perkembangan — ${ctx.semesterLabel}`)
  doc.font('Helvetica-Bold').fontSize(16).text(narrative.fullName)
  writeMetadata(doc, [
    ['NIS', narrative.nis],
    ['Kelompok', ctx.className],
  ])
  for (const entry of narrative.entries)
    writeSection(
      doc,
      `${entry.typeLabel} — ${entry.date}`,
      Object.entries(entry.content).map(
        ([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`
      )
    )
  for (const item of narrative.narratives)
    writeSection(doc, item.element, item.content.trim() || 'Belum ada narasi yang disetujui.')
  return toBuffer(doc)
}
