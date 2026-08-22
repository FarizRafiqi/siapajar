import PDFDocument from 'pdfkit'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
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
import {
  commitUsageReservation,
  releaseUsageReservation,
  reserveUsage,
} from '#services/entitlement_service'
import { auditService } from '#services/audit_service'
import { randomUUID } from 'node:crypto'
import { chromium, type Browser } from 'playwright'
import { renderExamWorksheetHtml } from '#services/exam_worksheet_service'
import {
  formatRpmClassCover,
  formatRpmClassGroupDetail,
  formatRpmClassShortCode,
  detectInstitutionInfo,
} from '#services/class_formatter'
import {
  loadWeeklyPlanAssessments,
  type LoadedWeeklyAssessments,
  type AnecdoteItem,
  type ChecklistItem,
  type StudentChecklistGroup,
  type WorkSampleItem,
  type PhotoSeriesItem,
} from '#services/weekly_assessment_loader'
import env from '#start/env'

async function consumePdfExport(user: User) {
  const reservationKey = await reservePdfExport(user)
  if (reservationKey) await commitPdfExport(user, reservationKey)
}

async function reservePdfExport(user: User) {
  const reservationKey = `export:pdf:${user.id}:${randomUUID()}`
  const reserved = await reserveUsage(user, 'export_pdf', reservationKey, 1, { format: 'pdf' })
  return reserved ? reservationKey : null
}

async function commitPdfExport(user: User, reservationKey: string) {
  await commitUsageReservation(reservationKey)
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

function drawVectorCheckmark(
  doc: PDFKit.PDFDocument,
  centerX: number,
  centerY: number,
  color = '#16A34A'
) {
  doc.save()
  doc.lineWidth(1.8).strokeColor(color).lineCap('round').lineJoin('round')
  doc
    .moveTo(centerX - 4.5, centerY)
    .lineTo(centerX - 1.2, centerY + 3.8)
    .lineTo(centerX + 5.5, centerY - 4.2)
    .stroke()
  doc.restore()
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
  const reservationKey = charge ? await reservePdfExport(user) : null
  let browser: Browser | null = null
  try {
    const browserEnv =
      process.platform === 'linux'
        ? { ...process.env, TMPDIR: '/tmp', TMP: '/tmp', TEMP: '/tmp' }
        : process.env
    browser = await chromium.launch({
      headless: true,
      executablePath: env.get('PDF_BROWSER_EXECUTABLE_PATH') || undefined,
      env: browserEnv,
    })
    const page = await browser.newPage({
      viewport: { width: 820, height: 1380 },
      deviceScaleFactor: 1,
    })
    await page.setContent(renderExamWorksheetHtml(exam, user), { waitUntil: 'networkidle' })
    await page.waitForFunction("document.documentElement.dataset.worksheetReady === 'true'")
    await page.waitForFunction('Array.from(document.images).every((image) => image.complete)')
    const buffer = await page.pdf({
      width: '8.51in',
      height: '14.34in',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    if (reservationKey) await commitPdfExport(user, reservationKey)
    return buffer
  } catch (error) {
    if (reservationKey) await releaseUsageReservation(reservationKey)
    throw error
  } finally {
    await browser?.close()
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

function drawRpmPdfCover(
  doc: typeof PDFDocument,
  leftX: number,
  contentWidth: number,
  user: User,
  meta: {
    themeUpper: string
    subthemeUpper: string
    groupCoverStr: string
    groupDetailStr: string
    shortSemesterWeekStr: string
    allocation: string
  }
) {
  const instInfo = detectInstitutionInfo(user.schoolName, user.educationLevel)

  doc.rect(leftX, 40, contentWidth, 3).fill('#EA580C')
  doc.rect(leftX, 46, contentWidth, 1).fill('#FDBA74')

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#9A3412').text(instInfo.ministry, leftX, 60, {
    align: 'center',
    width: contentWidth,
  })
  doc.font('Helvetica').fontSize(9).fillColor('#64748B').text(instInfo.subtitle, leftX, 75, {
    align: 'center',
    width: contentWidth,
  })

  // Hero Card Title
  const heroY = 110
  const heroH = 145
  doc.roundedRect(leftX, heroY, contentWidth, heroH, 6).fillAndStroke('#FFF7ED', '#F97316')

  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor('#C2410C')
    .text('RENCANA PEMBELAJARAN MENDALAM (RPM)', leftX + 15, heroY + 18, {
      align: 'center',
      width: contentWidth - 30,
    })
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#EA580C')
    .text('RENCANA PELAKSANAAN PEMBELAJARAN MINGGUAN (RPPM)', leftX + 15, heroY + 36, {
      align: 'center',
      width: contentWidth - 30,
    })

  doc.rect(leftX + contentWidth * 0.2, heroY + 54, contentWidth * 0.6, 1).fill('#FED7AA')

  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor('#9A3412')
    .text(meta.themeUpper, leftX + 15, heroY + 68, {
      align: 'center',
      width: contentWidth - 30,
    })
  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor('#C2410C')
    .text(`SUB TOPIK : ${meta.subthemeUpper}`, leftX + 15, heroY + 92, {
      align: 'center',
      width: contentWidth - 30,
    })
  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor('#64748B')
    .text(`JENJANG / KELAS : ${meta.groupCoverStr.toUpperCase()}`, leftX + 15, heroY + 116, {
      align: 'center',
      width: contentWidth - 30,
    })

  // Metadata Card
  const metaCardY = 280
  const metaCardH = 240
  doc
    .roundedRect(leftX + 15, metaCardY, contentWidth - 30, metaCardH, 6)
    .fillAndStroke('#F8FAFC', '#CBD5E1')

  doc.rect(leftX + 15, metaCardY, contentWidth - 30, 26).fillAndStroke('#F1F5F9', '#CBD5E1')
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#334155')
    .text('INFORMASI PERANGKAT PEMBELAJARAN', leftX + 25, metaCardY + 7, {
      align: 'center',
      width: contentWidth - 50,
    })

  const metaRows: [string, string][] = [
    ['PENULIS', user.fullName || 'Guru Kelas'],
    ['SATUAN PENDIDIKAN', user.schoolName || 'RA / TK PAUD'],
    ['KELOMPOK / USIA', meta.groupDetailStr],
    ['TOPIK', meta.themeUpper],
    ['SUB TOPIK', meta.subthemeUpper],
    ['SEMESTER / MINGGU', meta.shortSemesterWeekStr],
    ['ALOKASI WAKTU', meta.allocation],
  ]

  let curMetaY = metaCardY + 38
  const metaLabelW = 140
  const metaColonX = leftX + 35 + metaLabelW
  const metaValX = metaColonX + 15
  const metaValW = contentWidth - 80 - metaLabelW

  for (const [lbl, val] of metaRows) {
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#475569')
      .text(lbl, leftX + 35, curMetaY, { width: metaLabelW })
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#475569').text(':', metaColonX, curMetaY)
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#0F172A')
      .text(val || '-', metaValX, curMetaY, { width: metaValW })
    curMetaY += 26
  }

  // Cover Footer
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#334155')
    .text(
      `TAHUN PELAJARAN ${new Date().getFullYear()} / ${new Date().getFullYear() + 1}`,
      leftX,
      730,
      {
        align: 'center',
        width: contentWidth,
      }
    )
  doc.rect(leftX, 760, contentWidth, 3).fill('#EA580C')
}

function drawRpmPdfIdentification(
  idf: any,
  weeklyTheme: string,
  subtheme: string,
  drawBanner: (title: string, topGap?: number) => void,
  draw2ColRow: (lbl: string, lines: string[]) => void
) {
  drawBanner('A. IDENTIFIKASI PEMBELAJARAN & NILAI KARAKTER')

  draw2ColRow('Karakteristik Murid', [
    idf.studentCharacteristics ||
      'Peserta didik aktif, senang bereksplorasi sensorik-motorik, dan memiliki rasa ingin tahu tinggi.',
  ])
  draw2ColRow('Materi Pembelajaran', [
    `• Esensial: ${idf.essentialMaterials || idf.essentialMaterial || weeklyTheme}`,
    `• Aplikatif: ${idf.practicalMaterials || idf.appliedMaterial || subtheme || weeklyTheme}`,
    `• Nilai & Karakter: ${idf.valueMaterials || idf.valueMaterial || 'Kasih sayang dan rasa syukur kepada Allah SWT'}`,
  ])
  draw2ColRow(
    'Dimensi Profil Lulusan (DPL)',
    (Array.isArray(idf.dpl) && idf.dpl.length > 0
      ? idf.dpl
      : ['DPL 1: Keimanan & Ketakwaan', 'DPL 3: Penalaran Kritis']
    ).map((d: string) => `• ${d}`)
  )
  draw2ColRow(
    'Nilai Panca Cinta KBC',
    (Array.isArray(idf.pancaCintaValues || idf.kbcValues) &&
    (idf.pancaCintaValues || idf.kbcValues).length > 0
      ? idf.pancaCintaValues || idf.kbcValues
      : ['Cinta Alloh & RosulNya', 'Cinta Diri & Sesama', 'Cinta Lingkungan']
    ).map((v: string) => `• ${v}`)
  )
}

function drawRpmPdfLearningDesign(
  ld: any,
  weeklyTheme: string,
  subtheme: string,
  drawBanner: (title: string, topGap?: number) => void,
  draw2ColRow: (lbl: string, lines: string[]) => void
) {
  drawBanner('B. DESAIN PEMBELAJARAN')

  const cpList =
    Array.isArray(ld.cpElements) && ld.cpElements.length > 0
      ? ld.cpElements.map((c: string) => `• ${c}`)
      : [
          '• CP Nilai Agama & Budi Pekerti: Anak mengenal Allah SWT & ciptaan-Nya',
          '• CP Jati Diri: Anak mengenali identitas diri & emosi',
          '• CP Dasar Literasi & STEAM: Anak mengeksplorasi media loose parts',
        ]

  const tpList = (
    Array.isArray(ld.learningObjectives) && ld.learningObjectives.length > 0
      ? ld.learningObjectives
      : [
          {
            code: 'TP 1',
            title: 'Anak mengenal dan memahami identitas dirinya serta ciptaan Allah',
          },
        ]
  ).map((tp: any, idx: number) => {
    const title = typeof tp === 'string' ? tp : tp?.title || tp?.name || ''
    const code = typeof tp === 'object' && tp?.code ? tp.code : `TP ${idx + 1}`
    return `• [${code}] ${title}`
  })

  let pedText =
    'Menggunakan pendekatan bermain sebagai cara alami anak belajar, bercerita untuk membangun pemahaman, bernyanyi untuk menciptakan suasana menyenangkan, dan eksplorasi langsung dengan media loose parts.'
  if (typeof ld.pedagogicalPractices === 'object' && ld.pedagogicalPractices !== null) {
    pedText = `Mindful: ${ld.pedagogicalPractices.mindful || '-'}\nMeaningful: ${ld.pedagogicalPractices.meaningful || '-'}\nJoyful: ${ld.pedagogicalPractices.joyful || '-'}`
  } else if (typeof ld.pedagogicalPractices === 'string' && ld.pedagogicalPractices.trim()) {
    pedText = ld.pedagogicalPractices
  }

  draw2ColRow('Capaian Pembelajaran', cpList)
  draw2ColRow('Lintas Disiplin Ilmu', [
    ld.crossDisciplinaryConcepts ||
      ld.crossDisciplinary ||
      'Nilai agama dan moral, sosial emosional, fisik motorik, kognitif, bahasa, seni',
  ])
  draw2ColRow('Tujuan Pembelajaran', tpList)
  draw2ColRow('Topik Pembelajaran', [`${weeklyTheme} : ${subtheme || 'Ayo Kita Berkenalan'}`])
  draw2ColRow('Praktik Pedagogis (Deep Learning)', pedText.split('\n'))
  draw2ColRow('Kemitraan Pembelajaran', [
    ld.partnerships ||
      'Guru kelas, orang tua/keluarga, teman sebaya dalam kelompok bermain, dan komunitas sekolah.',
  ])
  draw2ColRow('Lingkungan Pembelajaran', [
    ld.learningEnvironment ||
      'Ruang kelas fleksibel dengan area bermain loose parts, lingkungan outdoor untuk eksplorasi fisik.',
  ])
  draw2ColRow('Pemanfaatan Digital', [
    '• Perencanaan: Persiapan media lagu dan audio/video interaktif',
    '• Pelaksanaan: Dokumentasi foto & video proses main anak',
    '• Asesmen: Portofolio digital karya anak',
  ])
}

function drawRpmPdfLearningExperience(
  doc: typeof PDFDocument,
  leftX: number,
  contentWidth: number,
  exp: any,
  drawPageHeader: () => void,
  drawBanner: (title: string, topGap?: number) => void
) {
  drawBanner('C. PENGALAMAN BELAJAR')

  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor('#1E293B')
    .text('RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN', leftX, doc.y)
  doc.moveDown(0.4)

  // C.1 AWAL
  if (doc.y > 670) {
    doc.addPage()
    drawPageHeader()
  }
  const subY = doc.y
  doc.rect(leftX, subY, contentWidth, 20).fillAndStroke('#F5F3FF', '#D8B4FE')
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor('#6B21A8')
    .text('C.1. AWAL (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)', leftX + 8, subY + 5)
  doc.y = subY + 25

  doc
    .font('Helvetica-Oblique')
    .fontSize(8)
    .fillColor('#334155')
    .text(
      'Pembuka dari proses pembelajaran yang bertujuan untuk mempersiapkan peserta didik sebelum memasuki inti pembelajaran. Kegiatan dalam tahap ini meliputi orientasi yang bermakna, apersepsi yang kontekstual, dan motivasi yang menggembirakan:',
      leftX,
      doc.y,
      { width: contentWidth }
    )
  doc.moveDown(0.3)

  const openActs =
    Array.isArray(exp.openingActivities) && exp.openingActivities.length > 0
      ? exp.openingActivities
      : [
          'Salam dan doa pembuka dengan penuh kesadaran',
          'Renungan/nasehat/motivasi pagi yang bermakna',
          'Menyanyikan lagu ceria tentang tema pembelajaran',
          'Asesmen awal melalui diskusi ide kegiatan hari ini',
          'Kegiatan pemantik berupa cerita/video interaktif',
          'Menyiapkan kesepakatan kelas dan aturan bermain',
          'Pertanyaan pemantik untuk mengembangkan dimensi profil lulusan:',
        ]

  openActs.forEach((act: string, idx: number) => {
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#0F172A')
      .text(`${idx + 1}. ${act}`, leftX + 5, doc.y, { width: contentWidth - 10 })
    doc.moveDown(0.15)
  })

  const openQuestions =
    Array.isArray(exp.openingQuestions) && exp.openingQuestions.length > 0
      ? exp.openingQuestions
      : [
          'Siapa yang bisa menceritakan pengalamannya tentang tema ini dengan suara jelas? (Komunikasi)',
          'Apa yang membuat dirimu dan ciptaan Tuhan ini istimewa? (Keimanan & Ketakwaan)',
          'Bagaimana cara kita menghargai dan bekerja sama dengan teman? (Kewargaan & Kolaborasi)',
          'Apa yang bisa kamu lakukan secara mandiri hari ini? (Kemandirian)',
        ]

  openQuestions.forEach((q: string, qIdx: number) => {
    const letter = String.fromCodePoint(97 + qIdx)
    doc
      .font('Helvetica-Oblique')
      .fontSize(7.5)
      .fillColor('#475569')
      .text(`    ${letter}) "${q}"`, leftX + 15, doc.y, { width: contentWidth - 25 })
    doc.moveDown(0.1)
  })

  doc.moveDown(0.4)

  // C.2 INTI
  if (doc.y > 600) {
    doc.addPage()
    drawPageHeader()
  }
  const intiY = doc.y
  doc.rect(leftX, intiY, contentWidth, 20).fillAndStroke('#F5F3FF', '#D8B4FE')
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor('#6B21A8')
    .text('C.2. INTI', leftX + 8, intiY + 5)
  doc.y = intiY + 25

  doc
    .font('Helvetica-Oblique')
    .fontSize(8)
    .fillColor('#334155')
    .text(
      'Pada tahap ini, anak aktif terlibat dalam pengalaman belajar memahami, mengaplikasi, dan merefleksi. Guru menerapkan prinsip pembelajaran berkesadaran, bermakna, menggembirakan untuk mencapai tujuan pembelajaran.',
      leftX,
      doc.y,
      { width: contentWidth }
    )
  doc.moveDown(0.4)

  // Tabel Pengalaman Belajar Inti Harian
  const coreDays = Array.isArray(exp.dailyCoreActivities) ? exp.dailyCoreActivities : []
  const colHariW = 55
  const colUraianW = contentWidth - colHariW
  const colUraianX = leftX + colHariW

  const drawIntiTableHeader = () => {
    const tableHeaderY = doc.y
    doc.rect(leftX, tableHeaderY, colHariW, 20).fillAndStroke('#E9D5FF', '#CBD5E1')
    doc.rect(colUraianX, tableHeaderY, colUraianW, 20).fillAndStroke('#E9D5FF', '#CBD5E1')
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor('#581C87')
      .text('Hari', leftX, tableHeaderY + 5, { width: colHariW, align: 'center' })
    doc.text(
      'Uraian Kegiatan Inti Bermain Bermakna & Loose Parts',
      colUraianX + 10,
      tableHeaderY + 5,
      { width: colUraianW - 20 }
    )
    doc.y = tableHeaderY + 20
  }

  drawIntiTableHeader()

  coreDays.forEach((d: any, dayIdx: number) => {
    let details: any[] = []
    if (Array.isArray(d.activitiesDetail) && d.activitiesDetail.length > 0) {
      details = d.activitiesDetail
    } else {
      const fallbackActs = Array.isArray(d.activities) ? d.activities : []
      details = fallbackActs.map((a: string, aIdx: number) => ({
        name: `Kegiatan ${aIdx + 1} : ${a}`,
        focus: d.steamFocus || d.kbcFocus || 'Eksplorasi Loose Parts',
        materials: d.mediaLooseParts || 'Bahan alam, loose parts',
        instructions: 'Anak bereksplorasi secara aktif dan mandiri bersama kelompok main.',
        benefits: 'Melatih kreativitas, daya pikir kritis, dan kemandirian.',
      }))
    }

    // Measure height accurately
    let estH = 16
    if (d.stage) estH += 22
    for (const item of details) {
      const focusStr = item.focus ? ` (${item.focus})` : ''
      const actTitle = (item.name || 'Kegiatan') + focusStr
      doc.fontSize(8.5)
      estH += doc.heightOfString(actTitle, { width: colUraianW - 16 }) + 3
      doc.fontSize(8)
      if (item.materials) {
        estH +=
          doc.heightOfString(`Alat dan Bahan: ${item.materials}`, { width: colUraianW - 16 }) + 3
      }
      estH +=
        doc.heightOfString(`Cara Bermain / Membuat: ${item.instructions || '-'}`, {
          width: colUraianW - 16,
        }) + 3
      estH +=
        doc.heightOfString(`Manfaat Kegiatan: ${item.benefits || '-'}`, {
          width: colUraianW - 16,
        }) + 8
    }

    if (doc.y + estH > 750) {
      doc.addPage()
      drawPageHeader()
      drawIntiTableHeader()
    }

    const rowStartY = doc.y
    let curY = rowStartY + 8

    if (d.stage) {
      doc.rect(colUraianX + 8, curY, colUraianW - 16, 16).fillAndStroke('#F3E8FF', '#D8B4FE')
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#6B21A8')
        .text(d.stage, colUraianX + 12, curY + 3.5, { width: colUraianW - 24 })
      curY += 20
    }

    details.forEach((item: any, actIdx: number) => {
      const defaultName = `Kegiatan ${actIdx + 1}`
      const baseName = item.name || defaultName
      const focusStr = item.focus ? ` (${item.focus})` : ''
      const actTitle = baseName + focusStr
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0F172A')
      doc.text(actTitle, colUraianX + 8, curY, { width: colUraianW - 16 })
      curY = doc.y + 2

      if (item.materials) {
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#475569')
          .text('Alat dan Bahan: ', colUraianX + 8, curY, {
            continued: true,
            width: colUraianW - 16,
          })
        doc.font('Helvetica').fillColor('#334155').text(item.materials)
        curY = doc.y + 2.5
      }

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#1E293B')
        .text('Cara Bermain / Membuat: ', colUraianX + 8, curY, {
          continued: true,
          width: colUraianW - 16,
        })
      doc
        .font('Helvetica')
        .fillColor('#334155')
        .text(item.instructions || 'Anak bereksplorasi secara aktif dan mandiri.')
      curY = doc.y + 2.5

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#1E293B')
        .text('Manfaat Kegiatan: ', colUraianX + 8, curY, {
          continued: true,
          width: colUraianW - 16,
        })
      doc
        .font('Helvetica-Oblique')
        .fillColor('#475569')
        .text(item.benefits || 'Melatih daya pikir kritis dan kemandirian.')
      curY = doc.y + 6
    })

    const finalRowH = Math.max(curY - rowStartY + 4, 45)
    doc.rect(leftX, rowStartY, colHariW, finalRowH).stroke('#CBD5E1')
    doc.rect(colUraianX, rowStartY, colUraianW, finalRowH).stroke('#CBD5E1')

    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor('#0F172A')
      .text(String(dayIdx + 1), leftX, rowStartY + 14, { width: colHariW, align: 'center' })
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#475569')
      .text(d.day || `Hari ${dayIdx + 1}`, leftX, rowStartY + 30, {
        width: colHariW,
        align: 'center',
      })

    doc.y = rowStartY + finalRowH
  })

  doc.moveDown(0.4)

  // C.3 PENUTUP
  if (doc.y > 670) {
    doc.addPage()
    drawPageHeader()
  }
  const penutupY = doc.y
  doc.rect(leftX, penutupY, contentWidth, 20).fillAndStroke('#F5F3FF', '#D8B4FE')
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor('#6B21A8')
    .text('C.3. PENUTUP (BERKESADARAN, MENGGEMBIRAKAN)', leftX + 8, penutupY + 5)
  doc.y = penutupY + 25

  doc
    .font('Helvetica-Oblique')
    .fontSize(8)
    .fillColor('#334155')
    .text(
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      leftX,
      doc.y,
      { width: contentWidth }
    )
  doc.moveDown(0.3)

  const closeActs =
    Array.isArray(exp.closingActivities) && exp.closingActivities.length > 0
      ? exp.closingActivities
      : [
          'Recalling kegiatan hari ini dengan bertanya "Apa yang paling menyenangkan hari ini?"',
          'Pameran mini hasil karya dimana setiap anak memamerkan karyanya dengan bangga',
          'Tepuk tangan apresiasi bersama untuk semua pencapaian anak hari ini',
          'Bernyanyi lagu penutup yang ceria tentang kebanggaan diri',
          'Yel-yel semangat untuk kegiatan esok hari',
          'Doa penutup dengan penuh syukur dan persiapan pulang yang gembira',
        ]

  closeActs.forEach((act: string, idx: number) => {
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#0F172A')
      .text(`${idx + 1}. ${act}`, leftX + 5, doc.y, { width: contentWidth - 10 })
    doc.moveDown(0.15)
  })

  doc.moveDown(0.4)
}

function drawRpmPdfAssessmentAndSignatures(
  doc: typeof PDFDocument,
  leftX: number,
  contentWidth: number,
  asm: any,
  user: User,
  drawPageHeader: () => void,
  drawBanner: (title: string, topGap?: number) => void
) {
  drawBanner('D. ASESMEN PEMBELAJARAN')

  doc
    .font('Helvetica-Oblique')
    .fontSize(8)
    .fillColor('#334155')
    .text(
      'Asesmen dalam pembelajaran ini dirancang untuk mengamati dan mendokumentasikan perkembangan anak secara alami melalui kegiatan bermain, tanpa membuat anak merasa sedang dievaluasi. Guru menggunakan berbagai teknik observasi yang ramah anak untuk memahami kemajuan setiap individu dalam mengenal identitas diri dan berinteraksi sosial.',
      leftX,
      doc.y,
      { width: contentWidth }
    )
  doc.moveDown(0.3)

  const renderAssessmentCategory = (categoryTitle: string, items: string[]) => {
    if (doc.y > 700) {
      doc.addPage()
      drawPageHeader()
    }
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#581C87').text(categoryTitle, leftX, doc.y)
    doc.moveDown(0.2)
    items.forEach((item) => {
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(`• ${item}`, leftX + 8, doc.y, { width: contentWidth - 16 })
      doc.moveDown(0.1)
    })
    doc.moveDown(0.25)
  }

  const earlyList =
    Array.isArray(asm.earlyAssessment) && asm.earlyAssessment.length > 0
      ? asm.earlyAssessment
      : [
          'Ajak anak bercerita tentang dirinya sambil bermain boneka atau media interaktif',
          'Minta anak mengekspresikan ide awal terkait tema secara bebas tanpa tekanan',
          'Observasi bagaimana anak memperkenalkan diri kepada teman baru di awal kegiatan',
          'Catat kemampuan anak menyebutkan nama, alamat, dan identitas saat ditanya dengan lembut',
          'Amati tingkat kepercayaan diri anak saat berbicara di depan kelompok kecil',
        ]

  const processList =
    Array.isArray(asm.processAssessment) && asm.processAssessment.length > 0
      ? asm.processAssessment
      : [
          'Foto dan video anak saat bermain untuk melihat interaksi sosial dan keterampilan motorik',
          'Buat catatan singkat tentang kata-kata santun yang diucapkan anak secara spontan',
          'Dokumentasikan cara anak menyelesaikan tugas mandiri seperti merapikan mainan',
          'Rekam suara anak saat bercerita atau bernyanyi untuk menilai kemampuan komunikasi',
          'Amati bagaimana anak bekerjasama dalam kegiatan kelompok dan menghargai perbedaan teman',
        ]

  const finalList =
    Array.isArray(asm.finalAssessment) && asm.finalAssessment.length > 0
      ? asm.finalAssessment
      : [
          'Minta anak mempresentasikan hasil karyanya dengan cara yang menyenangkan',
          'Ajak anak merefleksi dengan pertanyaan "Apa yang paling berharga yang kamu pelajari hari ini?"',
          'Observasi perubahan sikap anak dari awal hingga akhir pembelajaran',
          'Dokumentasikan kemampuan anak mengekspresikan perasaan dan pengalaman belajarnya',
          'Catat perkembangan kemandirian dan kepercayaan diri anak melalui aktivitas sehari-hari',
        ]

  renderAssessmentCategory('Asesmen Awal:', earlyList)
  renderAssessmentCategory('Asesmen Proses:', processList)
  renderAssessmentCategory('Asesmen Akhir:', finalList)

  // LEMBAR PENGESAHAN
  if (doc.y > 640) {
    doc.addPage()
    drawPageHeader()
  }
  doc.moveDown(0.8)
  const sigY = doc.y
  const sigLeftX = leftX + 20
  const sigRightX = leftX + contentWidth * 0.55

  doc.font('Helvetica').fontSize(8.5).fillColor('#0F172A').text('Mengetahui,', sigLeftX, sigY)
  doc.font('Helvetica-Bold').text('Kepala RA', sigLeftX, sigY + 12)
  doc.text('......................................................', sigLeftX, sigY + 65)
  doc
    .font('Helvetica')
    .fontSize(8)
    .text('NIP. ........................................', sigLeftX, sigY + 78)

  doc.font('Helvetica').fontSize(8.5).text('Guru Kelas / Penyusun,', sigRightX, sigY)
  doc
    .font('Helvetica-Bold')
    .text(
      `( ${user.fullName || '........................................'} )`,
      sigRightX,
      sigY + 65
    )
  doc
    .font('Helvetica')
    .fontSize(8)
    .text('NIP. ........................................', sigRightX, sigY + 78)
}

function drawAppendixTable(
  doc: typeof PDFDocument,
  leftX: number,
  cols: { title: string; w: number }[],
  rowCount: number,
  rowHeight: number,
  customPlaceholder?: { colIdx: number; text: string }
) {
  let headerH = 26
  for (const c of cols) {
    const textH = doc.heightOfString(c.title, { width: c.w - 8 })
    if (textH + 12 > headerH) headerH = Math.ceil(textH + 12)
  }

  let curTblY = doc.y
  let curTblX = leftX
  for (const c of cols) {
    doc.rect(curTblX, curTblY, c.w, headerH).fillAndStroke('#F3E8FF', '#CBD5E1')
    const textH = doc.heightOfString(c.title, { width: c.w - 8 })
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#581C87')
      .text(c.title, curTblX + 4, curTblY + (headerH - textH) / 2, {
        width: c.w - 8,
        align: 'center',
      })
    curTblX += c.w
  }
  curTblY += headerH

  for (let r = 0; r < rowCount; r++) {
    curTblX = leftX
    for (const [cIdx, c] of cols.entries()) {
      doc.rect(curTblX, curTblY, c.w, rowHeight).stroke('#CBD5E1')
      if (cIdx === customPlaceholder?.colIdx) {
        doc
          .font('Helvetica-Oblique')
          .fontSize(8)
          .fillColor('#94A3B8')
          .text(customPlaceholder.text, curTblX, curTblY + rowHeight / 2 - 4, {
            width: c.w,
            align: 'center',
          })
      }
      curTblX += c.w
    }
    curTblY += rowHeight
  }
  doc.y = curTblY
}

function drawRpmPdfAppendices(
  doc: typeof PDFDocument,
  leftX: number,
  contentWidth: number,
  user: User,
  meta: {
    shortGroupStr: string
    shortSemesterWeekStr: string
    groupStr: string
    semesterStr: string
    weekStr: string
  },
  assessments?: LoadedWeeklyAssessments
) {
  const instInfo = detectInstitutionInfo(user.schoolName, user.educationLevel)

  const renderAppendixHeader = (title: string) => {
    doc.addPage()
    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor('#581C87')
      .text(instInfo.assessmentHeaderTitle, leftX, 40, { align: 'center', width: contentWidth })
    doc.fontSize(10.5).text(title, leftX, 56, { align: 'center', width: contentWidth })
    doc
      .fontSize(9)
      .text(
        `TAHUN AJARAN : ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        leftX,
        70,
        { align: 'center', width: contentWidth }
      )

    doc.rect(leftX, 86, contentWidth, 0.75).fill('#D8B4FE')

    const col1LabelW = 72
    const col1ColonX = leftX + col1LabelW
    const col1ValX = col1ColonX + 8

    const col2X = leftX + contentWidth * 0.55
    const col2LabelW = 88
    const col2ColonX = col2X + col2LabelW
    const col2ValX = col2ColonX + 8

    // Row 1 (y = 94)
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#1E293B')
      .text('Jenjang / Kelas', leftX, 94, { width: col1LabelW })
    doc.font('Helvetica-Bold').text(':', col1ColonX, 94)
    doc.font('Helvetica-Bold').text(meta.shortGroupStr, col1ValX, 94)

    doc.font('Helvetica-Bold').text('Semester / Minggu', col2X, 94, { width: col2LabelW })
    doc.font('Helvetica-Bold').text(':', col2ColonX, 94)
    doc.font('Helvetica-Bold').text(meta.shortSemesterWeekStr, col2ValX, 94)

    // Row 2 (y = 108)
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#1E293B')
      .text('Guru Kelas', leftX, 108, { width: col1LabelW })
    doc.font('Helvetica-Bold').text(':', col1ColonX, 108)
    doc.font('Helvetica').text(user.fullName || 'Guru Pengampu', col1ValX, 108)

    doc.y = 125
  }

  // 1. LAMPIRAN 1: CATATAN ANEKDOT
  renderAppendixHeader('CATATAN ANEKDOT')
  if (assessments && assessments.anecdotes.length > 0) {
    const colAnecdote = [
      { title: 'Tanggal', w: 75 },
      { title: 'Nama Anak', w: 95 },
      { title: 'Kejadian Teramati', w: 180 },
      { title: 'Analisis Capaian', w: contentWidth - 350 },
    ]
    let anecHeaderH = 26
    for (const c of colAnecdote) {
      const h = doc.heightOfString(c.title, { width: c.w - 8 })
      if (h + 12 > anecHeaderH) anecHeaderH = Math.ceil(h + 12)
    }

    let curTblY = doc.y
    let curTblX = leftX
    for (const c of colAnecdote) {
      doc.rect(curTblX, curTblY, c.w, anecHeaderH).fillAndStroke('#F3E8FF', '#CBD5E1')
      const textH = doc.heightOfString(c.title, { width: c.w - 8 })
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#581C87')
        .text(c.title, curTblX + 4, curTblY + (anecHeaderH - textH) / 2, {
          width: c.w - 8,
          align: 'center',
        })
      curTblX += c.w
    }
    curTblY += anecHeaderH

    assessments.anecdotes.forEach((item: AnecdoteItem) => {
      const eventH = doc.heightOfString(item.event, { width: 180 - 10 })
      const analysisH = doc.heightOfString(item.analysis, { width: contentWidth - 350 - 10 })
      const rH = Math.max(eventH + 12, analysisH + 12, 32)

      if (curTblY + rH > 750) {
        renderAppendixHeader('CATATAN ANEKDOT (Lanjutan)')
        curTblY = doc.y
        curTblX = leftX
        for (const c of colAnecdote) {
          doc.rect(curTblX, curTblY, c.w, anecHeaderH).fillAndStroke('#F3E8FF', '#CBD5E1')
          const textH = doc.heightOfString(c.title, { width: c.w - 8 })
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#581C87')
            .text(c.title, curTblX + 4, curTblY + (anecHeaderH - textH) / 2, {
              width: c.w - 8,
              align: 'center',
            })
          curTblX += c.w
        }
        curTblY += anecHeaderH
      }

      curTblX = leftX
      doc.rect(curTblX, curTblY, colAnecdote[0].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(item.date, curTblX + 4, curTblY + 6, { width: colAnecdote[0].w - 8, align: 'center' })
      curTblX += colAnecdote[0].w

      doc.rect(curTblX, curTblY, colAnecdote[1].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(item.studentName, curTblX + 5, curTblY + 6, { width: colAnecdote[1].w - 10 })
      curTblX += colAnecdote[1].w

      doc.rect(curTblX, curTblY, colAnecdote[2].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#334155')
        .text(item.event, curTblX + 5, curTblY + 6, { width: colAnecdote[2].w - 10 })
      curTblX += colAnecdote[2].w

      doc.rect(curTblX, curTblY, colAnecdote[3].w, rH).stroke('#CBD5E1')
      const lines = item.analysis.split('\n')
      let textY = curTblY + 6
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) {
          textY += 3
          continue
        }
        const isHeader =
          trimmed.endsWith(':') || /^Nilai Agama|^Jati Diri|^Dasar Literasi|^STEAM/i.test(trimmed)

        if (isHeader) {
          doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#0F172A')
          doc.text(trimmed, curTblX + 5, textY, { width: colAnecdote[3].w - 10 })
          textY = doc.y + 1
        } else {
          doc.font('Helvetica').fontSize(7.5).fillColor('#334155')
          doc.text(trimmed, curTblX + 5, textY, { width: colAnecdote[3].w - 10 })
          textY = doc.y + 1
        }
      }
      curTblY += rH
    })
    doc.y = curTblY
  } else {
    drawAppendixTable(
      doc,
      leftX,
      [
        { title: 'Tanggal', w: 75 },
        { title: 'Nama Anak', w: 95 },
        { title: 'Kejadian Teramati', w: 180 },
        { title: 'Analisis Capaian', w: contentWidth - 350 },
      ],
      7,
      58
    )
  }

  // 2. LAMPIRAN 2: CEKLIS IKTP (1 Tabel per Siswa)
  renderAppendixHeader('CEKLIS IKTP (INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN)')
  const studentGroups: StudentChecklistGroup[] = assessments?.studentChecklists || []

  const colIktp = [
    { title: 'No', w: 25 },
    { title: 'Indikator', w: 215 },
    { title: 'Sudah Muncul', w: 65 },
    { title: 'Belum Muncul', w: 65 },
    { title: 'Keterangan / Kejadian Teramati', w: contentWidth - 370 },
  ]

  for (const [sIdx, studentGroup] of studentGroups.entries()) {
    if (sIdx > 0) {
      if (doc.y > 520) {
        renderAppendixHeader('CEKLIS IKTP (INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN)')
      } else {
        doc.moveDown(1.5)
      }
    }

    let curTblY = doc.y
    let curTblX = leftX
    const stuHeaderW = colIktp[2].w + colIktp[3].w

    // 2-tier header:
    // Row 1 Column 1 & 2
    doc.rect(curTblX, curTblY, colIktp[0].w, 40).fillAndStroke('#F3E8FF', '#CBD5E1')
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#581C87')
      .text('No', curTblX, curTblY + 15, { width: colIktp[0].w, align: 'center' })
    curTblX += colIktp[0].w

    doc.rect(curTblX, curTblY, colIktp[1].w, 40).fillAndStroke('#F3E8FF', '#CBD5E1')
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#581C87')
      .text('Indikator', curTblX, curTblY + 15, { width: colIktp[1].w, align: 'center' })
    curTblX += colIktp[1].w

    // Row 1 Column 3&4: Student Name Header
    doc.rect(curTblX, curTblY, stuHeaderW, 18).fillAndStroke('#F3E8FF', '#CBD5E1')
    doc
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .fillColor('#581C87')
      .text(studentGroup.studentName, curTblX + 2, curTblY + 5, {
        width: stuHeaderW - 4,
        align: 'center',
      })

    // Sub-columns: Sudah Muncul & Belum Muncul
    doc.rect(curTblX, curTblY + 18, colIktp[2].w, 22).fillAndStroke('#F3E8FF', '#CBD5E1')
    doc
      .font('Helvetica-Bold')
      .fontSize(7)
      .fillColor('#581C87')
      .text('Sudah\nMuncul', curTblX, curTblY + 21, { width: colIktp[2].w, align: 'center' })

    doc
      .rect(curTblX + colIktp[2].w, curTblY + 18, colIktp[3].w, 22)
      .fillAndStroke('#F3E8FF', '#CBD5E1')
    doc
      .font('Helvetica-Bold')
      .fontSize(7)
      .fillColor('#581C87')
      .text('Belum\nMuncul', curTblX + colIktp[2].w, curTblY + 21, {
        width: colIktp[3].w,
        align: 'center',
      })

    curTblX += stuHeaderW

    // Column 5: Keterangan / Kejadian Teramati
    doc.rect(curTblX, curTblY, colIktp[4].w, 40).fillAndStroke('#F3E8FF', '#CBD5E1')
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#581C87')
      .text('Keterangan /\nKejadian Teramati', curTblX, curTblY + 10, {
        width: colIktp[4].w,
        align: 'center',
      })

    curTblY += 40

    studentGroup.items.forEach((item: ChecklistItem, idx: number) => {
      const indH = doc.heightOfString(item.indicator, { width: colIktp[1].w - 10 })
      const noteH = doc.heightOfString(item.note || '-', { width: colIktp[4].w - 10 })
      const rH = Math.max(indH + 8, noteH + 8, 22)

      if (curTblY + rH > 750) {
        renderAppendixHeader('CEKLIS IKTP (Lanjutan)')
        curTblY = doc.y
        curTblX = leftX

        doc.rect(curTblX, curTblY, colIktp[0].w, 40).fillAndStroke('#F3E8FF', '#CBD5E1')
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#581C87')
          .text('No', curTblX, curTblY + 15, { width: colIktp[0].w, align: 'center' })
        curTblX += colIktp[0].w

        doc.rect(curTblX, curTblY, colIktp[1].w, 40).fillAndStroke('#F3E8FF', '#CBD5E1')
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#581C87')
          .text('Indikator', curTblX, curTblY + 15, { width: colIktp[1].w, align: 'center' })
        curTblX += colIktp[1].w

        doc.rect(curTblX, curTblY, stuHeaderW, 18).fillAndStroke('#F3E8FF', '#CBD5E1')
        doc
          .font('Helvetica-Bold')
          .fontSize(7.5)
          .fillColor('#581C87')
          .text(studentGroup.studentName, curTblX + 2, curTblY + 5, {
            width: stuHeaderW - 4,
            align: 'center',
          })

        doc.rect(curTblX, curTblY + 18, colIktp[2].w, 22).fillAndStroke('#F3E8FF', '#CBD5E1')
        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('#581C87')
          .text('Sudah\nMuncul', curTblX, curTblY + 21, { width: colIktp[2].w, align: 'center' })

        doc
          .rect(curTblX + colIktp[2].w, curTblY + 18, colIktp[3].w, 22)
          .fillAndStroke('#F3E8FF', '#CBD5E1')
        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('#581C87')
          .text('Belum\nMuncul', curTblX + colIktp[2].w, curTblY + 21, {
            width: colIktp[3].w,
            align: 'center',
          })

        curTblX += stuHeaderW

        doc.rect(curTblX, curTblY, colIktp[4].w, 40).fillAndStroke('#F3E8FF', '#CBD5E1')
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#581C87')
          .text('Keterangan /\nKejadian Teramati', curTblX, curTblY + 10, {
            width: colIktp[4].w,
            align: 'center',
          })

        curTblY += 40
      }

      curTblX = leftX
      doc.rect(curTblX, curTblY, colIktp[0].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(String(item.no || idx + 1), curTblX, curTblY + 6, {
          width: colIktp[0].w,
          align: 'center',
        })
      curTblX += colIktp[0].w

      doc.rect(curTblX, curTblY, colIktp[1].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#0F172A')
        .text(item.indicator, curTblX + 4, curTblY + 5, { width: colIktp[1].w - 8 })
      curTblX += colIktp[1].w

      doc.rect(curTblX, curTblY, colIktp[2].w, rH).stroke('#CBD5E1')
      if (item.sudahMuncul) {
        drawVectorCheckmark(doc, curTblX + colIktp[2].w / 2, curTblY + rH / 2, '#16A34A')
      }
      curTblX += colIktp[2].w

      doc.rect(curTblX, curTblY, colIktp[3].w, rH).stroke('#CBD5E1')
      if (item.belumMuncul) {
        drawVectorCheckmark(doc, curTblX + colIktp[3].w / 2, curTblY + rH / 2, '#DC2626')
      }
      curTblX += colIktp[3].w

      doc.rect(curTblX, curTblY, colIktp[4].w, rH).stroke('#CBD5E1')
      const noteText = item.note || ''
      if (noteText) {
        doc
          .font('Helvetica')
          .fontSize(7.5)
          .fillColor('#334155')
          .text(noteText, curTblX + 4, curTblY + 5, { width: colIktp[4].w - 8 })
      }
      curTblY += rH
    })
    doc.y = curTblY
  }

  // 3. LAMPIRAN 3: DOKUMENTASI HASIL KARYA
  renderAppendixHeader('DOKUMENTASI HASIL KARYA')
  if (assessments && assessments.workSamples.length > 0) {
    const colWork = [
      { title: 'Tanggal', w: 65 },
      { title: 'Nama Anak', w: 95 },
      { title: 'Foto Karya Anak', w: 160 },
      { title: 'Deskripsi Foto dan Analisis Capaian Perkembangan', w: contentWidth - 320 },
    ]
    let workHeaderH = 28
    for (const c of colWork) {
      const h = doc.heightOfString(c.title, { width: c.w - 8 })
      if (h + 12 > workHeaderH) workHeaderH = Math.ceil(h + 12)
    }

    let curTblY = doc.y
    let curTblX = leftX
    for (const c of colWork) {
      doc.rect(curTblX, curTblY, c.w, workHeaderH).fillAndStroke('#F3E8FF', '#CBD5E1')
      const textH = doc.heightOfString(c.title, { width: c.w - 8 })
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#581C87')
        .text(c.title, curTblX + 4, curTblY + (workHeaderH - textH) / 2, {
          width: c.w - 8,
          align: 'center',
        })
      curTblX += c.w
    }
    curTblY += workHeaderH

    for (const item of assessments.workSamples as WorkSampleItem[]) {
      const descAnalysisStr = `Deskripsi:\n${item.description}\n\nAnalisis Capaian:\n${item.analysis}`
      const descH = doc.heightOfString(descAnalysisStr, { width: contentWidth - 320 - 12 })
      const rH = Math.max(descH + 14, 85)

      if (curTblY + rH > 750) {
        renderAppendixHeader('DOKUMENTASI HASIL KARYA (Lanjutan)')
        curTblY = doc.y
        curTblX = leftX
        for (const c of colWork) {
          doc.rect(curTblX, curTblY, c.w, workHeaderH).fillAndStroke('#F3E8FF', '#CBD5E1')
          const textH = doc.heightOfString(c.title, { width: c.w - 8 })
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#581C87')
            .text(c.title, curTblX + 4, curTblY + (workHeaderH - textH) / 2, {
              width: c.w - 8,
              align: 'center',
            })
          curTblX += c.w
        }
        curTblY += workHeaderH
      }

      curTblX = leftX
      doc.rect(curTblX, curTblY, colWork[0].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(item.date, curTblX + 4, curTblY + 8, { width: colWork[0].w - 8, align: 'center' })
      curTblX += colWork[0].w

      doc.rect(curTblX, curTblY, colWork[1].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(item.studentName, curTblX + 6, curTblY + 8, { width: colWork[1].w - 12 })
      curTblX += colWork[1].w

      doc.rect(curTblX, curTblY, colWork[2].w, rH).stroke('#CBD5E1')
      let imgDrawn = false
      if (item.storedName) {
        const filePath = join(
          process.cwd(),
          'public',
          'uploads',
          'assessments',
          String(user.id),
          String(item.id),
          item.storedName
        )
        if (existsSync(filePath)) {
          try {
            doc.image(filePath, curTblX + 10, curTblY + 6, {
              fit: [colWork[2].w - 20, rH - 12],
              align: 'center',
              valign: 'center',
            })
            imgDrawn = true
          } catch {}
        }
      }
      if (!imgDrawn) {
        doc
          .font('Helvetica-Oblique')
          .fontSize(8)
          .fillColor('#94A3B8')
          .text('[ Foto Hasil Karya ]', curTblX + 4, curTblY + rH / 2 - 4, {
            width: colWork[2].w - 8,
            align: 'center',
          })
      }
      curTblX += colWork[2].w

      doc.rect(curTblX, curTblY, colWork[3].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#1E293B')
        .text(descAnalysisStr, curTblX + 6, curTblY + 6, { width: colWork[3].w - 12 })
      curTblY += rH
    }
    doc.y = curTblY
  } else {
    drawAppendixTable(
      doc,
      leftX,
      [
        { title: 'Tanggal', w: 65 },
        { title: 'Nama Anak', w: 95 },
        { title: 'Foto Karya Anak', w: 160 },
        { title: 'Deskripsi Foto dan Analisis Capaian Perkembangan', w: contentWidth - 320 },
      ],
      5,
      80,
      { colIdx: 2, text: '[ Tempel Foto Karya ]' }
    )
  }

  // 4. LAMPIRAN 4: FOTO BERSERI
  renderAppendixHeader('FOTO BERSERI')
  if (assessments && assessments.photoSeries.length > 0) {
    const colPhoto = [
      { title: 'Tanggal', w: 65 },
      { title: 'Nama Anak & Dokumentasi Foto (Minimal 3)', w: 230 },
      { title: 'Deskripsi Foto dan Analisis CP', w: contentWidth - 295 },
    ]
    let photoHeaderH = 28
    for (const c of colPhoto) {
      const h = doc.heightOfString(c.title, { width: c.w - 8 })
      if (h + 12 > photoHeaderH) photoHeaderH = Math.ceil(h + 12)
    }

    let curTblY = doc.y
    let curTblX = leftX
    for (const c of colPhoto) {
      doc.rect(curTblX, curTblY, c.w, photoHeaderH).fillAndStroke('#F3E8FF', '#CBD5E1')
      const textH = doc.heightOfString(c.title, { width: c.w - 8 })
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#581C87')
        .text(c.title, curTblX + 4, curTblY + (photoHeaderH - textH) / 2, {
          width: c.w - 8,
          align: 'center',
        })
      curTblX += c.w
    }
    curTblY += photoHeaderH

    for (const item of assessments.photoSeries as PhotoSeriesItem[]) {
      const descAnalysisStr = `Judul/Kegiatan:\n${item.description}\n\nAnalisis Perkembangan:\n${item.analysis}`
      const descH = doc.heightOfString(descAnalysisStr, { width: contentWidth - 295 - 12 })
      const rH = Math.max(descH + 14, 85)

      if (curTblY + rH > 750) {
        renderAppendixHeader('FOTO BERSERI (Lanjutan)')
        curTblY = doc.y
        curTblX = leftX
        for (const c of colPhoto) {
          doc.rect(curTblX, curTblY, c.w, photoHeaderH).fillAndStroke('#F3E8FF', '#CBD5E1')
          const textH = doc.heightOfString(c.title, { width: c.w - 8 })
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#581C87')
            .text(c.title, curTblX + 4, curTblY + (photoHeaderH - textH) / 2, {
              width: c.w - 8,
              align: 'center',
            })
          curTblX += c.w
        }
        curTblY += photoHeaderH
      }

      curTblX = leftX
      doc.rect(curTblX, curTblY, colPhoto[0].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(item.date, curTblX + 4, curTblY + 8, { width: colPhoto[0].w - 8, align: 'center' })
      curTblX += colPhoto[0].w

      doc.rect(curTblX, curTblY, colPhoto[1].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#0F172A')
        .text(item.studentName, curTblX + 6, curTblY + 6, { width: colPhoto[1].w - 12 })

      let imgX = curTblX + 6
      const thumbW = 65
      const thumbH = 55
      let anyDrawn = false
      for (const att of item.attachments.slice(0, 3)) {
        if (att.storedName) {
          const filePath = join(
            process.cwd(),
            'public',
            'uploads',
            'assessments',
            String(user.id),
            String(item.id),
            att.storedName
          )
          if (existsSync(filePath)) {
            try {
              doc.image(filePath, imgX, curTblY + 20, { fit: [thumbW, thumbH] })
              imgX += thumbW + 6
              anyDrawn = true
            } catch {}
          }
        }
      }
      if (!anyDrawn) {
        doc
          .font('Helvetica-Oblique')
          .fontSize(8)
          .fillColor('#94A3B8')
          .text('[ Foto 1 ]     [ Foto 2 ]     [ Foto 3 ]', curTblX + 6, curTblY + rH / 2 - 2, {
            width: colPhoto[1].w - 12,
            align: 'center',
          })
      }
      curTblX += colPhoto[1].w

      doc.rect(curTblX, curTblY, colPhoto[2].w, rH).stroke('#CBD5E1')
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#1E293B')
        .text(descAnalysisStr, curTblX + 6, curTblY + 6, { width: colPhoto[2].w - 12 })
      curTblY += rH
    }
    doc.y = curTblY
  } else {
    drawAppendixTable(
      doc,
      leftX,
      [
        { title: 'Tanggal', w: 65 },
        { title: 'Nama Anak, dan Dokumentasi Foto (Minimal 3)', w: 230 },
        { title: 'Deskripsi Foto dan Analisis CP', w: contentWidth - 295 },
      ],
      5,
      80,
      { colIdx: 1, text: '[ Foto 1 ]     [ Foto 2 ]     [ Foto 3 ]' }
    )
  }

  doc
    .font('Helvetica-Oblique')
    .fontSize(7.5)
    .fillColor('#64748B')
    .text(
      'Catatan: Foto berseri fokus pada proses perkembangan pada satu keterampilan/kegiatan yang sama dari waktu ke waktu; Menunjukkan progres bertahap dalam penguasaan suatu keterampilan;',
      leftX,
      doc.y + 10,
      { width: contentWidth }
    )
}

export async function exportWeeklyLessonPlanPdf(
  weekly: WeeklyLessonPlan,
  user: User,
  charge = true,
  loadedAssessments?: LoadedWeeklyAssessments
) {
  if (charge) await consumePdfExport(user)
  const doc = new PDFDocument({ margin: 40, size: 'A4' })
  const content = weekly.content ?? {}
  const isRpm = Boolean(
    content.identification || content.learningExperience || content.learningDesign
  )

  if (!isRpm) {
    writeKop(doc, user, 'Rencana Pelaksanaan Pembelajaran Mingguan (RPPM)')
    doc.font('Helvetica-Bold').fontSize(16).text(weekly.theme)
    writeMetadata(doc, [
      ['Kelompok', weekly.schoolClass?.name],
      ['Mulai minggu', weekly.weekStartDate?.toFormat('dd/MM/yyyy')],
      ['Status', weekly.status],
    ])
    writeContentObject(doc, content)
    return toBuffer(doc)
  }

  const assessments = loadedAssessments || (await loadWeeklyPlanAssessments(weekly))

  const pageWidth = doc.page.width
  const contentWidth = pageWidth - 80 // 40 margin each side
  const leftX = 40

  const instInfo = detectInstitutionInfo(user.schoolName, user.educationLevel)
  const semesterStr = content.semester ? `Semester ${content.semester}` : 'Semester 1'
  const weekStr = content.weekNumber ? `Minggu ke-${content.weekNumber}` : 'Minggu 1'
  const shortGroupStr = formatRpmClassShortCode(weekly.schoolClass, user, content.groupContext)
  const shortSemesterWeekStr = `${content.semester || 1}/${content.weekNumber || 1}`
  const groupCoverStr = formatRpmClassCover(weekly.schoolClass, user, content.groupContext)
  const groupDetailStr = formatRpmClassGroupDetail(weekly.schoolClass, content.groupContext)
  const themeUpper = (weekly.theme || 'AKU HAMBA ALLAH').toUpperCase()
  const subthemeUpper = (content.subtheme || 'AYO KITA BERKENALAN').toUpperCase()

  // 1. Cover
  drawRpmPdfCover(doc, leftX, contentWidth, user, {
    themeUpper,
    subthemeUpper,
    groupCoverStr,
    groupDetailStr,
    shortSemesterWeekStr,
    allocation: String(content.allocation || '5 Hari x 180 Menit (15 JP)'),
  })

  // 2. Konten Isi
  doc.addPage()

  const drawPageHeader = () => {
    doc.rect(leftX, 35, contentWidth, 20).fillAndStroke('#EA580C', '#C2410C')
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#FFFFFF')
      .text(`RENCANA PEMBELAJARAN MENDALAM (RPM) - ${instInfo.level} FASE FONDASI`, leftX, 40, {
        align: 'center',
        width: contentWidth,
      })
    doc.y = 65
  }

  drawPageHeader()

  const drawBanner = (title: string, topGap = 10) => {
    if (doc.y > 690) {
      doc.addPage()
      drawPageHeader()
    }
    doc.moveDown(topGap / 10)
    const y = doc.y
    doc.rect(leftX, y, contentWidth, 24).fillAndStroke('#F3E8FF', '#D8B4FE')
    doc
      .font('Helvetica-Bold')
      .fontSize(10.5)
      .fillColor('#581C87')
      .text(title, leftX + 10, y + 6, {
        width: contentWidth - 20,
      })
    doc.y = y + 30
  }

  const draw2ColRow = (title: string, contentLines: string[], customRowH?: number) => {
    const col1W = 145
    const col2W = contentWidth - col1W
    const col2X = leftX + col1W

    let totalTextH = 0
    doc.fontSize(8.5)
    for (const line of contentLines) {
      totalTextH += doc.heightOfString(line, { width: col2W - 16 }) + 3
    }

    const rowH = customRowH || Math.max(totalTextH + 16, 28)

    if (doc.y + rowH > 750) {
      doc.addPage()
      drawPageHeader()
    }

    const startY = doc.y

    doc.rect(leftX, startY, col1W, rowH).fillAndStroke('#FAF5FF', '#D8B4FE')
    doc.rect(col2X, startY, col2W, rowH).stroke('#D8B4FE')

    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor('#581C87')
      .text(title, leftX + 8, startY + 8, {
        width: col1W - 16,
      })

    let tY = startY + 8
    doc.font('Helvetica').fontSize(8.5)
    for (const line of contentLines) {
      doc.fillColor('#0F172A').text(line, col2X + 8, tY, { width: col2W - 16 })
      tY = doc.y + 3
    }

    doc.y = startY + rowH
  }

  drawRpmPdfIdentification(
    content.identification || {},
    weekly.theme,
    content.subtheme,
    drawBanner,
    draw2ColRow
  )
  drawRpmPdfLearningDesign(
    content.learningDesign || {},
    weekly.theme,
    content.subtheme,
    drawBanner,
    draw2ColRow
  )
  drawRpmPdfLearningExperience(
    doc,
    leftX,
    contentWidth,
    content.learningExperience || {},
    drawPageHeader,
    drawBanner
  )
  drawRpmPdfAssessmentAndSignatures(
    doc,
    leftX,
    contentWidth,
    content.assessment || {},
    user,
    drawPageHeader,
    drawBanner
  )
  drawRpmPdfAppendices(
    doc,
    leftX,
    contentWidth,
    user,
    { shortGroupStr, shortSemesterWeekStr, groupStr: groupDetailStr, semesterStr, weekStr },
    assessments
  )

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
  const { buildPaudAssessmentPdf } = await import('#services/paud_assessment_export_service')
  return buildPaudAssessmentPdf(assessment, user)
}

export async function exportPaudAssessmentBundlePdf(
  assessments: PaudAssessment[],
  user: User,
  themeTitle = 'Kenalkan',
  charge = true
) {
  if (charge) await consumePdfExport(user)
  const { buildPaudAssessmentBundlePdf } = await import('#services/paud_assessment_export_service')
  return buildPaudAssessmentBundlePdf(assessments, user, themeTitle)
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
