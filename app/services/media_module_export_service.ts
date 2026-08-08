import PptxGenJSModule from 'pptxgenjs'
import PDFDocument from 'pdfkit'
import type MediaModule from '#models/media_module'
import type User from '#models/user'
import {
  commitUsageReservation,
  releaseUsageReservation,
  reserveUsage,
} from '#services/entitlement_service'
import { auditService } from '#services/audit_service'
import { randomUUID } from 'node:crypto'

type MediaSlide = {
  slideNumber?: number
  title?: string
  visualDescription?: string
  imageUrl?: string
  teacherNotes?: string
  keyQuestion?: string
}

type LoosePartsGuide = {
  materials?: string[]
  activities?: string[]
  safetyNotes?: string
}

type PptxOptions = Record<string, unknown>
type PptxSlide = {
  background: { color: string }
  addText(value: string, options: PptxOptions): void
  addShape(shape: unknown, options: PptxOptions): void
  addImage?(options: PptxOptions): void
}
type PptxPresentation = {
  ShapeType: Record<string, unknown>
  layout: string
  author: string
  subject: string
  title: string
  company: string
  lang: string
  addSlide(): PptxSlide
  write(options: PptxOptions): Promise<string | ArrayBuffer | Blob | Uint8Array>
}

const PptxGenJS = PptxGenJSModule as unknown as { new (): PptxPresentation }

function text(value: unknown, fallback = '-') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function list(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function decodeDataImage(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return null
  const separator = value.indexOf(',')
  if (separator < 0) return null

  const encoded = value.slice(separator + 1)
  if (!encoded) return null

  try {
    const buffer = Buffer.from(encoded, 'base64')
    return buffer.length > 0 ? buffer : null
  } catch {
    return null
  }
}

function safeFilename(value: string) {
  return (
    value
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, ' ')
      .trim() || 'media-ajar'
  )
}

async function withExportQuota<T>(
  user: User,
  featureKey: 'export_pptx' | 'export_pdf',
  work: () => Promise<T>,
  charge = true
) {
  if (!charge) return work()
  const reservationKey = `media-export:${user.id}:${featureKey}:${randomUUID()}`
  const reserved = await reserveUsage(user, featureKey, reservationKey, 1, {
    resource: 'media_module',
  })

  try {
    const result = await work()
    if (reserved) await commitUsageReservation(reservationKey)
    await auditService.record({
      actorId: user.id,
      action: 'media_module.export',
      entityType: 'media_module',
      metadata: { featureKey },
    })
    return result
  } catch (error) {
    if (reserved) await releaseUsageReservation(reservationKey)
    throw error
  }
}

function addPptxText(slide: PptxSlide, value: string, options: PptxOptions) {
  slide.addText(value, { margin: 0.05, breakLine: false, ...options })
}

export async function exportMediaModulePptx(mediaModule: MediaModule, user: User, charge = true) {
  return withExportQuota(
    user,
    'export_pptx',
    async () => {
      const pptx = new PptxGenJS()
      pptx.layout = 'LAYOUT_WIDE'
      pptx.author = user.fullName || user.email
      pptx.subject = `Media Ajar: ${mediaModule.theme}`
      pptx.title = mediaModule.title
      pptx.company = user.schoolName || 'SiapAjar'
      pptx.lang = 'id-ID'

      const slides = (mediaModule.slides || []) as MediaSlide[]
      const guide = (mediaModule.loosePartsGuide || {}) as LoosePartsGuide
      const colors = {
        ink: '123B35',
        emerald: '0F766E',
        mint: 'ECFDF5',
        amber: 'FFFBEB',
        muted: '52605D',
      }

      const cover = pptx.addSlide()
      cover.background = { color: colors.mint }
      addPptxText(cover, text(user.schoolName, 'Media Ajar'), {
        x: 0.7,
        y: 0.65,
        w: 11.3,
        h: 0.35,
        fontFace: 'Aptos',
        fontSize: 14,
        color: colors.emerald,
        bold: true,
        align: 'center',
        charSpacing: 1.2,
      })
      addPptxText(cover, mediaModule.title, {
        x: 0.8,
        y: 2.15,
        w: 11.2,
        h: 1.0,
        fontFace: 'Aptos Display',
        fontSize: 30,
        color: colors.ink,
        bold: true,
        align: 'center',
        fit: 'shrink',
      })
      addPptxText(
        cover,
        `Kelompok ${text(mediaModule.schoolClass?.name)} • Tema ${mediaModule.theme}`,
        {
          x: 1.2,
          y: 3.45,
          w: 10.4,
          h: 0.45,
          fontSize: 16,
          color: colors.muted,
          align: 'center',
        }
      )
      addPptxText(cover, 'Media Ajar Visual', {
        x: 1.2,
        y: 5.75,
        w: 10.4,
        h: 0.35,
        fontSize: 12,
        color: colors.emerald,
        bold: true,
        align: 'center',
      })

      for (const [index, item] of slides.entries()) {
        const slide = pptx.addSlide()
        slide.background = { color: 'FFFFFF' }
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: 13.333,
          h: 0.18,
          line: { color: colors.emerald },
          fill: { color: colors.emerald },
        })
        addPptxText(slide, `SLIDE ${item.slideNumber || index + 1}`, {
          x: 0.65,
          y: 0.55,
          w: 2.2,
          h: 0.3,
          fontSize: 11,
          color: colors.emerald,
          bold: true,
        })
        addPptxText(slide, text(item.title, `Kegiatan ${index + 1}`), {
          x: 0.65,
          y: 1.05,
          w: 12,
          h: 0.65,
          fontSize: 27,
          color: colors.ink,
          bold: true,
          fit: 'shrink',
        })
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.65,
          y: 2.0,
          w: 12,
          h: 1.55,
          rectRadius: 0.08,
          line: { color: 'A7F3D0', pt: 1 },
          fill: { color: colors.mint },
        })
        addPptxText(slide, 'VISUAL / ILUSTRASI', {
          x: 0.95,
          y: 2.25,
          w: 3,
          h: 0.25,
          fontSize: 10,
          color: colors.emerald,
          bold: true,
        })
        addPptxText(slide, text(item.visualDescription), {
          x: 0.95,
          y: 2.65,
          w: 11.3,
          h: 0.55,
          fontSize: 17,
          color: colors.ink,
          italic: true,
          fit: 'shrink',
        })
        if (item.imageUrl?.startsWith('data:image/') && decodeDataImage(item.imageUrl)) {
          slide.addImage?.({ data: item.imageUrl, x: 8.55, y: 2.2, w: 3.45, h: 1.15 })
        }
        if (item.keyQuestion) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: 0.65,
            y: 3.9,
            w: 12,
            h: 0.95,
            rectRadius: 0.08,
            line: { color: 'FDE68A', pt: 1 },
            fill: { color: colors.amber },
          })
          addPptxText(slide, `Pertanyaan pemantik: ${item.keyQuestion}`, {
            x: 0.95,
            y: 4.2,
            w: 11.3,
            h: 0.35,
            fontSize: 15,
            color: '78350F',
            fit: 'shrink',
          })
        }
        addPptxText(slide, `Catatan guru: ${text(item.teacherNotes)}`, {
          x: 0.65,
          y: 6.55,
          w: 12,
          h: 0.35,
          fontSize: 10,
          color: colors.muted,
          fit: 'shrink',
        })
      }

      const guideSlide = pptx.addSlide()
      guideSlide.background = { color: 'F8FAFC' }
      addPptxText(guideSlide, 'Panduan Loose Parts', {
        x: 0.7,
        y: 0.65,
        w: 11.8,
        h: 0.5,
        fontSize: 26,
        bold: true,
        color: colors.ink,
      })
      addPptxText(guideSlide, `Bahan: ${list(guide.materials).join(' • ') || '-'}`, {
        x: 0.8,
        y: 1.65,
        w: 5.7,
        h: 2.1,
        fontSize: 15,
        color: colors.ink,
        breakLine: true,
        valign: 'top',
        fit: 'shrink',
      })
      addPptxText(guideSlide, `Kegiatan: ${list(guide.activities).join(' • ') || '-'}`, {
        x: 6.8,
        y: 1.65,
        w: 5.7,
        h: 2.1,
        fontSize: 15,
        color: colors.ink,
        breakLine: true,
        valign: 'top',
        fit: 'shrink',
      })
      addPptxText(guideSlide, `Keselamatan: ${text(guide.safetyNotes)}`, {
        x: 0.8,
        y: 5.3,
        w: 11.7,
        h: 0.8,
        fontSize: 14,
        color: '78350F',
        fill: { color: colors.amber },
        margin: 0.18,
        fit: 'shrink',
      })

      const output = await pptx.write({ outputType: 'nodebuffer' })
      if (output instanceof Blob || typeof output === 'string') {
        throw new Error('PPTX export returned an unsupported output type')
      }
      if (output instanceof ArrayBuffer) return Buffer.from(new Uint8Array(output))
      return Buffer.from(output as Uint8Array<ArrayBuffer>)
    },
    charge
  )
}

function pdfBuffer(doc: PDFKit.PDFDocument) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    doc.end()
  })
}

export async function exportMediaModulePdf(mediaModule: MediaModule, user: User, charge = true) {
  return withExportQuota(
    user,
    'export_pdf',
    async () => {
      // Match PPTX LAYOUT_WIDE so browser fallback and downloaded PDF stay landscape.
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 48,
        autoFirstPage: false,
      })
      const slides = (mediaModule.slides || []) as MediaSlide[]
      const guide = (mediaModule.loosePartsGuide || {}) as LoosePartsGuide
      const addHeader = (subtitle: string) => {
        doc
          .font('Helvetica-Bold')
          .fontSize(14)
          .text(user.schoolName || 'Media Ajar', { align: 'center' })
        doc.font('Helvetica').fontSize(10).text(subtitle, { align: 'center' })
        doc.moveDown(1)
      }
      doc.addPage()
      addHeader(mediaModule.title)
      doc.font('Helvetica-Bold').fontSize(22).text(mediaModule.title, { align: 'center' })
      doc.moveDown(0.5)
      doc
        .font('Helvetica')
        .fontSize(11)
        .text(`Kelompok ${text(mediaModule.schoolClass?.name)} • Tema ${mediaModule.theme}`, {
          align: 'center',
        })
      for (const [index, item] of slides.entries()) {
        doc.addPage()
        addHeader(`Slide ${item.slideNumber || index + 1} • ${mediaModule.theme}`)
        doc
          .font('Helvetica-Bold')
          .fontSize(20)
          .text(text(item.title, `Kegiatan ${index + 1}`))
        doc.moveDown(0.7)
        doc.font('Helvetica-Bold').fontSize(11).text('Visual / ilustrasi')
        doc.font('Helvetica').fontSize(12).text(text(item.visualDescription))
        const imageBuffer = decodeDataImage(item.imageUrl)
        if (imageBuffer) {
          doc.image(imageBuffer, {
            fit: [260, 140],
            align: 'center',
          })
        }
        if (item.keyQuestion) {
          doc.moveDown(0.7)
          doc.font('Helvetica-Bold').fontSize(11).text('Pertanyaan pemantik')
          doc.font('Helvetica').fontSize(12).text(item.keyQuestion)
        }
        doc.moveDown(0.7)
        doc.font('Helvetica-Bold').fontSize(11).text('Catatan guru')
        doc.font('Helvetica').fontSize(11).text(text(item.teacherNotes))
      }
      doc.addPage()
      addHeader('Panduan Loose Parts')
      doc.font('Helvetica-Bold').fontSize(13).text('Bahan yang disarankan')
      const materials = list(guide.materials)
      if (materials.length > 0) {
        doc.font('Helvetica').fontSize(11).list(materials, { bulletRadius: 2 })
      } else {
        doc.font('Helvetica').fontSize(11).text('-')
      }
      doc.moveDown(0.8)
      doc.font('Helvetica-Bold').fontSize(13).text('Ragam kegiatan')
      const activities = list(guide.activities)
      if (activities.length > 0) {
        doc.font('Helvetica').fontSize(11).list(activities, { bulletRadius: 2 })
      } else {
        doc.font('Helvetica').fontSize(11).text('-')
      }
      doc.moveDown(0.8)
      doc.font('Helvetica-Bold').fontSize(13).text('Catatan keselamatan')
      doc.font('Helvetica').fontSize(11).text(text(guide.safetyNotes))
      return pdfBuffer(doc)
    },
    charge
  )
}

export { safeFilename }
