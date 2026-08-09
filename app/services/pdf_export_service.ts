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
import { chromium } from 'playwright'
import { renderExamWorksheetHtml } from '#services/exam_worksheet_service'

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
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({
      viewport: { width: 820, height: 1380 },
      deviceScaleFactor: 1,
    })
    await page.setContent(renderExamWorksheetHtml(exam, user), { waitUntil: 'networkidle' })
    await page.waitForFunction("document.documentElement.dataset.worksheetReady === 'true'")
    await page.waitForFunction('Array.from(document.images).every((image) => image.complete)')
    return await page.pdf({
      width: '8.51in',
      height: '14.34in',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
  } finally {
    await browser.close()
  }
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
    const formatted = Array.isArray(value) ? value.map(formatSingleValue) : formatSingleValue(value)
    writeSection(doc, key, formatted)
  }
}

function formatLabel(str: string | null | undefined): string {
  if (!str) return ''
  return str.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function stripHtmlTags(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .split('<')
    .map((part) => part.substring(part.indexOf('>') + 1))
    .join('')
}

function renderPdfObjectivesTable(
  doc: typeof PDFDocument.prototype,
  objectives: Array<Record<string, any>>,
  leftX: number,
  width: number
) {
  if (objectives.length === 0) return

  // Landscape width = 761.89pt -> Kode TP (90pt) | TP (360pt) | IKTP (311.89pt)
  const colW = [90, 360, 311.89]
  let tableY = doc.y

  if (tableY > 480) {
    doc.addPage()
    tableY = doc.y
  }

  doc.fillColor('#047857').rect(leftX, tableY, width, 18).fill()
  doc.strokeColor('#FFFFFF').lineWidth(0.8)
  doc
    .moveTo(leftX + colW[0], tableY)
    .lineTo(leftX + colW[0], tableY + 18)
    .stroke()
  doc
    .moveTo(leftX + colW[0] + colW[1], tableY)
    .lineTo(leftX + colW[0] + colW[1], tableY + 18)
    .stroke()

  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8)
  doc.text('Kode TP', leftX + 5, tableY + 5, { width: colW[0] - 10, align: 'left' })
  doc.text('Tujuan Pembelajaran (TP)', leftX + colW[0] + 5, tableY + 5, {
    width: colW[1] - 10,
    align: 'left',
  })
  doc.text('Indikator Ketercapaian (IKTP)', leftX + colW[0] + colW[1] + 5, tableY + 5, {
    width: colW[2] - 10,
    align: 'left',
  })

  tableY += 18

  for (const obj of objectives) {
    const cleanTitle = stripHtmlTags(obj.title || '')
    const indicators = Array.isArray(obj.indicators) ? obj.indicators : []

    const iktpLines =
      indicators.length > 0
        ? indicators
            .map((ind: any) => `• ${ind.description} [${formatLabel(ind.evidenceType)}]`)
            .join('\n')
        : '-'

    doc.font('Helvetica').fontSize(8)
    const titleHeight = doc.heightOfString(cleanTitle, { width: colW[1] - 10 })
    doc.font('Helvetica').fontSize(7.5)
    const iktpHeight = doc.heightOfString(iktpLines, { width: colW[2] - 10 })
    const rowHeight = Math.max(20, titleHeight + 8, iktpHeight + 8)

    if (tableY + rowHeight > 510) {
      doc.addPage()
      tableY = doc.y
    }

    doc.rect(leftX, tableY, width, rowHeight).lineWidth(0.5).strokeColor('#D1D5DB').stroke()
    doc
      .moveTo(leftX + colW[0], tableY)
      .lineTo(leftX + colW[0], tableY + rowHeight)
      .stroke()
    doc
      .moveTo(leftX + colW[0] + colW[1], tableY)
      .lineTo(leftX + colW[0] + colW[1], tableY + rowHeight)
      .stroke()

    doc
      .fillColor('#065F46')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(obj.code || '-', leftX + 5, tableY + 5, { width: colW[0] - 10, align: 'left' })

    doc
      .fillColor('#111827')
      .font('Helvetica')
      .fontSize(8)
      .text(cleanTitle, leftX + colW[0] + 5, tableY + 5, { width: colW[1] - 10, align: 'left' })

    doc
      .fillColor('#374151')
      .font('Helvetica')
      .fontSize(7.5)
      .text(iktpLines, leftX + colW[0] + colW[1] + 5, tableY + 5, {
        width: colW[2] - 10,
        align: 'left',
      })

    tableY += rowHeight
  }

  doc.y = tableY + 12
}

function renderPdfCpSection(
  doc: typeof PDFDocument.prototype,
  cps: Array<Record<string, any>>,
  leftX: number,
  width: number
) {
  doc
    .fillColor('#047857')
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('I. MATRIKS CAPAIAN PEMBELAJARAN (CP) & TUJUAN PEMBELAJARAN (TP)', leftX, doc.y, {
      width,
      align: 'left',
    })
  doc.moveDown(0.4)

  for (const cp of cps) {
    if (doc.y > 470) doc.addPage()

    const cpBoxY = doc.y
    doc.fillColor('#059669').rect(leftX, cpBoxY, width, 20).fill()
    doc
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(`Elemen: ${cp.element || '-'}  (${cp.code || 'CP'})`, leftX + 10, cpBoxY + 5, {
        width: width - 20,
        align: 'left',
      })

    doc.y = cpBoxY + 25

    doc
      .fillColor('#1F2937')
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text('Capaian Pembelajaran (CP):', leftX, doc.y, { width, align: 'left' })
    doc
      .fillColor('#374151')
      .font('Helvetica')
      .fontSize(8.5)
      .text(stripHtmlTags(cp.description || '-'), leftX, doc.y + 12, { width, align: 'justify' })
    doc.y =
      doc.y + Math.max(16, doc.heightOfString(stripHtmlTags(cp.description || '-'), { width }) + 14)

    const objectives = Array.isArray(cp.learningObjectives) ? cp.learningObjectives : []
    renderPdfObjectivesTable(doc, objectives, leftX, width)
  }
}

function renderPdfSequenceSection(
  doc: typeof PDFDocument.prototype,
  sequences: Array<Record<string, any>>,
  leftX: number,
  width: number
) {
  if (doc.y > 450) doc.addPage()

  doc
    .fillColor('#047857')
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('II. MATRIKS ALUR TUJUAN PEMBELAJARAN (ATP) TERSIMPAN', leftX, doc.y, {
      width,
      align: 'left',
    })
  doc.moveDown(0.4)

  for (const seq of sequences) {
    if (doc.y > 450) doc.addPage()

    const items = Array.isArray(seq.items) ? seq.items : []

    const seqY = doc.y
    doc
      .fillColor('#065F46')
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .text(`${seq.title || 'Alur ATP'} (${items.length} Langkah Pembelajaran)`, leftX, seqY, {
        width,
        align: 'left',
      })
    doc.moveDown(0.3)

    if (items.length > 0) {
      // Landscape width = 761.89pt -> Urutan (50pt) | Kode TP (100pt) | TP Title (611.89pt)
      const colW = [50, 100, 611.89]
      let tableY = doc.y

      doc.fillColor('#047857').rect(leftX, tableY, width, 18).fill()
      doc.strokeColor('#FFFFFF').lineWidth(0.8)
      doc
        .moveTo(leftX + colW[0], tableY)
        .lineTo(leftX + colW[0], tableY + 18)
        .stroke()
      doc
        .moveTo(leftX + colW[0] + colW[1], tableY)
        .lineTo(leftX + colW[0] + colW[1], tableY + 18)
        .stroke()

      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8)
      doc.text('Urutan', leftX + 5, tableY + 5, { width: colW[0] - 10, align: 'center' })
      doc.text('Kode TP', leftX + colW[0] + 5, tableY + 5, { width: colW[1] - 10, align: 'left' })
      doc.text('Tujuan Pembelajaran (TP)', leftX + colW[0] + colW[1] + 5, tableY + 5, {
        width: colW[2] - 10,
        align: 'left',
      })

      tableY += 18

      for (const [idx, item] of items.entries()) {
        const cleanTitle =
          stripHtmlTags(item.title || '') || `Tujuan Pembelajaran #${item.learningObjectiveId}`
        doc.font('Helvetica').fontSize(8)
        const titleHeight = doc.heightOfString(cleanTitle, { width: colW[2] - 10 })
        const rowHeight = Math.max(18, titleHeight + 6)

        if (tableY + rowHeight > 510) {
          doc.addPage()
          tableY = doc.y
        }

        doc.rect(leftX, tableY, width, rowHeight).lineWidth(0.5).strokeColor('#D1D5DB').stroke()
        doc
          .moveTo(leftX + colW[0], tableY)
          .lineTo(leftX + colW[0], tableY + rowHeight)
          .stroke()
        doc
          .moveTo(leftX + colW[0] + colW[1], tableY)
          .lineTo(leftX + colW[0] + colW[1], tableY + rowHeight)
          .stroke()

        doc
          .fillColor('#111827')
          .font('Helvetica-Bold')
          .fontSize(8)
          .text(`${idx + 1}`, leftX + 5, tableY + 4, { width: colW[0] - 10, align: 'center' })

        doc
          .fillColor('#065F46')
          .font('Helvetica-Bold')
          .fontSize(8)
          .text(item.code || `TP-${item.learningObjectiveId}`, leftX + colW[0] + 5, tableY + 4, {
            width: colW[1] - 10,
            align: 'left',
          })

        doc
          .fillColor('#1F2937')
          .font('Helvetica')
          .fontSize(8)
          .text(cleanTitle, leftX + colW[0] + colW[1] + 5, tableY + 4, {
            width: colW[2] - 10,
            align: 'left',
          })

        tableY += rowHeight
      }

      doc.y = tableY + 12
    }
  }
}

function renderPdfPaudObjectivesRow(
  doc: typeof PDFDocument.prototype,
  cp: Record<string, any>,
  objectives: Array<Record<string, any>>,
  leftX: number,
  width: number,
  colW: number[],
  startTableY: number
): number {
  const obj4 = objectives.slice(0, 4)
  const tpW = colW[2]
  const tpStartX = leftX + colW[0] + colW[1]

  doc.font('Helvetica-Bold').fontSize(7.5)
  const elemH = doc.heightOfString(cp.element || 'Elemen CP', { width: colW[0] - 10 })
  doc.font('Helvetica').fontSize(7.5)
  const subElemH = doc.heightOfString(cp.title || cp.element || '-', { width: colW[1] - 10 })

  let maxObjH = Math.max(22, elemH + 8, subElemH + 8)

  for (let i = 0; i < 4; i++) {
    const obj = obj4[i]
    if (obj) {
      const t = stripHtmlTags(obj.title || '')
      doc.font('Helvetica').fontSize(7.5)
      const h = doc.heightOfString(t, { width: tpW - 10 })
      if (h + 8 > maxObjH) maxObjH = h + 8
    }
  }

  let tableY = startTableY
  if (tableY + maxObjH > 510) {
    doc.addPage()
    tableY = doc.y
  }

  doc.rect(leftX, tableY, width, maxObjH).lineWidth(0.5).strokeColor('#D1D5DB').stroke()
  doc
    .moveTo(leftX + colW[0], tableY)
    .lineTo(leftX + colW[0], tableY + maxObjH)
    .stroke()
  doc
    .moveTo(leftX + colW[0] + colW[1], tableY)
    .lineTo(leftX + colW[0] + colW[1], tableY + maxObjH)
    .stroke()

  for (let i = 1; i <= 3; i++) {
    const posX = tpStartX + i * tpW
    doc
      .moveTo(posX, tableY)
      .lineTo(posX, tableY + maxObjH)
      .stroke()
  }

  doc
    .fillColor('#065F46')
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .text(cp.element || 'Elemen CP', leftX + 5, tableY + 5, { width: colW[0] - 10, align: 'left' })

  doc
    .fillColor('#111827')
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .text(cp.title || cp.element || '-', leftX + colW[0] + 5, tableY + 5, {
      width: colW[1] - 10,
      align: 'left',
    })

  for (let i = 0; i < 4; i++) {
    const obj = obj4[i]
    if (obj) {
      const posX = tpStartX + i * tpW
      doc
        .fillColor('#1F2937')
        .font('Helvetica')
        .fontSize(7.5)
        .text(stripHtmlTags(obj.title || ''), posX + 5, tableY + 5, {
          width: tpW - 10,
          align: 'left',
        })
    }
  }
  return tableY + maxObjH
}

function renderPdfPaudIktpRow(
  doc: typeof PDFDocument.prototype,
  objectives: Array<Record<string, any>>,
  leftX: number,
  width: number,
  colW: number[],
  startTableY: number
): number {
  const obj4 = objectives.slice(0, 4)
  const tpW = colW[2]
  const tpStartX = leftX + colW[0] + colW[1]

  let tableY = startTableY
  if (tableY + 18 > 510) {
    doc.addPage()
    tableY = doc.y
  }

  doc.rect(leftX, tableY, width, 18).lineWidth(0.5).strokeColor('#D1D5DB').stroke()
  doc
    .fillColor('#F3F4F6')
    .rect(leftX + 0.25, tableY + 0.25, width - 0.5, 17.5)
    .fill()

  doc
    .fillColor('#374151')
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .text(
      'INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN (IKTP) & BUKTI ASESMEN',
      leftX + 5,
      tableY + 5.5,
      {
        width: width - 10,
        align: 'center',
        lineBreak: false,
      }
    )
  tableY += 18

  let maxIktpH = 25
  const iktpTextList: string[] = []
  for (let i = 0; i < 4; i++) {
    const obj = obj4[i]
    if (obj && Array.isArray(obj.indicators) && obj.indicators.length > 0) {
      const lines = obj.indicators
        .map(
          (ind: any, idx: number) =>
            `${idx + 1}. ${ind.description} [${formatLabel(ind.evidenceType)}]`
        )
        .join('\n\n')
      iktpTextList.push(lines)
      doc.font('Helvetica').fontSize(7)
      const h = doc.heightOfString(lines, { width: tpW - 10 })
      if (h + 8 > maxIktpH) maxIktpH = h + 8
    } else {
      iktpTextList.push('-')
    }
  }

  if (tableY + maxIktpH > 510) {
    doc.addPage()
    tableY = doc.y
  }

  doc.rect(leftX, tableY, width, maxIktpH).lineWidth(0.5).strokeColor('#D1D5DB').stroke()
  doc
    .moveTo(leftX + colW[0] + colW[1], tableY)
    .lineTo(leftX + colW[0] + colW[1], tableY + maxIktpH)
    .stroke()
  for (let i = 1; i <= 3; i++) {
    const posX = tpStartX + i * tpW
    doc
      .moveTo(posX, tableY)
      .lineTo(posX, tableY + maxIktpH)
      .stroke()
  }

  doc
    .fillColor('#4B5563')
    .font('Helvetica-Bold')
    .fontSize(7)
    .text('Indikator IKTP', leftX + 5, tableY + 5, { width: colW[0] + colW[1] - 10, align: 'left' })

  for (let i = 0; i < 4; i++) {
    const posX = tpStartX + i * tpW
    doc
      .fillColor('#374151')
      .font('Helvetica')
      .fontSize(7)
      .text(iktpTextList[i] || '-', posX + 5, tableY + 5, { width: tpW - 10, align: 'left' })
  }

  return tableY + maxIktpH
}

function renderPdfPaudSingleGrid(
  doc: typeof PDFDocument.prototype,
  cp: Record<string, any>,
  leftX: number,
  width: number,
  colW: number[]
) {
  const objectives = Array.isArray(cp.learningObjectives) ? cp.learningObjectives : []
  if (objectives.length === 0) return

  let tableY = doc.y
  if (tableY > 450) {
    doc.addPage()
    tableY = doc.y
  }

  const tpW = colW[2]
  const tpStartX = leftX + colW[0] + colW[1]
  const headerTotalH = 36 // 18pt Row 1 + 18pt Row 2

  doc.fillColor('#047857').rect(leftX, tableY, width, headerTotalH).fill()
  doc.strokeColor('#FFFFFF').lineWidth(0.8)
  doc
    .moveTo(leftX + colW[0], tableY)
    .lineTo(leftX + colW[0], tableY + headerTotalH)
    .stroke()
  doc
    .moveTo(leftX + colW[0] + colW[1], tableY)
    .lineTo(leftX + colW[0] + colW[1], tableY + headerTotalH)
    .stroke()
  for (let i = 1; i <= 3; i++) {
    const posX = tpStartX + i * tpW
    doc
      .moveTo(posX, tableY)
      .lineTo(posX, tableY + 18)
      .stroke()
  }

  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8)
  doc.text('Elemen', leftX + 5, tableY + 13, {
    width: colW[0] - 10,
    align: 'center',
    lineBreak: false,
  })
  doc.text('Sub-Elemen CP', leftX + colW[0] + 5, tableY + 13, {
    width: colW[1] - 10,
    align: 'center',
    lineBreak: false,
  })

  for (let i = 0; i < 4; i++) {
    const posX = tpStartX + i * tpW
    doc.text(`TP ${i + 1}`, posX + 5, tableY + 5, {
      width: tpW - 10,
      align: 'center',
      lineBreak: false,
    })
  }

  const row2Y = tableY + 18
  doc
    .rect(tpStartX, row2Y, width - colW[0] - colW[1], 18)
    .lineWidth(0.5)
    .strokeColor('#D1D5DB')
    .stroke()
  doc
    .fillColor('#F9FAFB')
    .rect(tpStartX + 0.25, row2Y + 0.25, width - colW[0] - colW[1] - 0.5, 17.5)
    .fill()
  doc
    .fillColor('#374151')
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .text('Usia 4 – 6 Tahun (Kelompok A & B)', tpStartX + 5, row2Y + 5.5, {
      width: width - colW[0] - colW[1] - 10,
      align: 'center',
      lineBreak: false,
    })

  tableY += headerTotalH

  tableY = renderPdfPaudObjectivesRow(doc, cp, objectives, leftX, width, colW, tableY)
  tableY = renderPdfPaudIktpRow(doc, objectives, leftX, width, colW, tableY)
  doc.y = tableY + 14
}

function renderPdfPaudHorizontalGrid(
  doc: typeof PDFDocument.prototype,
  cps: Array<Record<string, any>>,
  leftX: number,
  width: number
) {
  doc
    .fillColor('#047857')
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('I. MATRIKS ALUR TUJUAN PEMBELAJARAN (ATP) - RA / TK FASE FONDASI', leftX, doc.y, {
      width,
      align: 'left',
    })
  doc.moveDown(0.4)

  const colW = [100, 151.89, 127.5, 127.5, 127.5, 127.5]

  for (const cp of cps) {
    if (doc.y > 450) doc.addPage()

    const cpBoxY = doc.y
    doc.fillColor('#059669').rect(leftX, cpBoxY, width, 20).fill()
    doc
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(`Elemen: ${cp.element || '-'} (${cp.code || 'CP'})`, leftX + 10, cpBoxY + 5, {
        width: width - 20,
        align: 'left',
      })

    doc.y = cpBoxY + 25

    const cpDesc = stripHtmlTags(cp.description || '-')
    doc
      .fillColor('#1F2937')
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text('Capaian Pembelajaran (CP):', leftX, doc.y, { width, align: 'left' })
    doc
      .fillColor('#374151')
      .font('Helvetica')
      .fontSize(8.5)
      .text(cpDesc, leftX, doc.y + 12, { width, align: 'justify' })
    doc.y = doc.y + Math.max(16, doc.heightOfString(cpDesc, { width }) + 14)

    renderPdfPaudSingleGrid(doc, cp, leftX, width, colW)
  }
}

export async function exportCurriculumPdf(
  cps: Array<Record<string, any>>,
  sequences: Array<Record<string, any>>,
  user: User,
  charge = true
) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' })

  writeKop(doc, user, 'DOKUMEN CAPAIAN, TUJUAN & ALUR PEMBELAJARAN (CP, TP & ATP)')

  const leftX = 40
  const width = doc.page.width - 80

  const startY = doc.y
  const infoHeight = 38
  doc.rect(leftX, startY, width, infoHeight).lineWidth(0.8).strokeColor('#059669').stroke()
  doc.fillColor('#F0FDF4').rect(leftX, startY, width, infoHeight).fill()

  const isPaud =
    user.educationLevel === 'tk' ||
    (user as any).institutionType === 'ra' ||
    (user as any).institutionType === 'paud'

  // 2-Column Metadata Box without "Format Layar"
  doc.fillColor('#065F46').font('Helvetica-Bold').fontSize(8.5)
  doc.text('Satuan Pendidikan', leftX + 12, startY + 8, { width: 110, align: 'left' })
  doc.text(':', leftX + 125, startY + 8, { width: 10, align: 'left' })
  doc
    .font('Helvetica')
    .text(
      (user as any).institutionName || user.schoolName || 'TK / Sekolah',
      leftX + 135,
      startY + 8,
      { width: 300, align: 'left' }
    )

  doc.font('Helvetica-Bold')
  doc.text('Jenjang / Fase', leftX + 12, startY + 22, { width: 110, align: 'left' })
  doc.text(':', leftX + 125, startY + 22, { width: 10, align: 'left' })
  doc
    .font('Helvetica')
    .text(isPaud ? 'PAUD / TK (Fase Fondasi)' : 'Sekolah Dasar (SD)', leftX + 135, startY + 22, {
      width: 300,
      align: 'left',
    })

  doc.font('Helvetica-Bold')
  doc.text('Tanggal Cetak', leftX + 460, startY + 8, { width: 100, align: 'left' })
  doc.text(':', leftX + 560, startY + 8, { width: 10, align: 'left' })
  doc
    .font('Helvetica')
    .text(new Date().toLocaleDateString('id-ID', { dateStyle: 'long' }), leftX + 570, startY + 8, {
      width: 180,
      align: 'left',
    })

  doc.font('Helvetica-Bold')
  doc.text('Versi Kurikulum', leftX + 460, startY + 22, { width: 100, align: 'left' })
  doc.text(':', leftX + 560, startY + 22, { width: 10, align: 'left' })
  doc
    .font('Helvetica')
    .text(user.curriculumVersion || 'Kurikulum Merdeka', leftX + 570, startY + 22, {
      width: 180,
      align: 'left',
    })

  doc.y = startY + infoHeight + 14

  if (isPaud) {
    renderPdfPaudHorizontalGrid(doc, cps, leftX, width)
  } else {
    renderPdfCpSection(doc, cps, leftX, width)
  }

  renderPdfSequenceSection(doc, sequences, leftX, width)

  if (doc.y > 430) doc.addPage()

  const sigY = doc.y + 10
  const sigW = width / 2

  doc.fillColor('#111827').font('Helvetica-Bold').fontSize(8.5)
  doc.text('Mengetahui,', leftX, sigY, { width: sigW, align: 'left' })
  doc.font('Helvetica').text('Kepala Sekolah', leftX, sigY + 12, { width: sigW, align: 'left' })
  doc
    .font('Helvetica-Bold')
    .text('________________________', leftX, sigY + 46, { width: sigW, align: 'left' })
  doc.font('Helvetica').text('NIP. ........................................', leftX, sigY + 58, {
    width: sigW,
    align: 'left',
  })

  doc.font('Helvetica').fontSize(8.5)
  doc.text(
    `.................., ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`,
    leftX + sigW,
    sigY,
    { width: sigW, align: 'left' }
  )
  doc.text('Penyusun / Guru Kelas,', leftX + sigW, sigY + 12, { width: sigW, align: 'left' })
  doc
    .font('Helvetica-Bold')
    .text(`( ${user.fullName || '........................'} )`, leftX + sigW, sigY + 46, {
      width: sigW,
      align: 'left',
    })
  doc
    .font('Helvetica')
    .text('NIP. ........................................', leftX + sigW, sigY + 58, {
      width: sigW,
      align: 'left',
    })

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
    doc.text(
      `${index + 1}. ${score.student.fullName} (${score.student.nis}) — Nilai: ${valText}${noteText}`
    )
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
