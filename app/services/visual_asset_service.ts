import { Resvg } from '@resvg/resvg-js'
import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import VisualAsset from '#models/visual_asset'
import type { VisualAssetKind, VisualAssetSource } from '#models/visual_asset'
import type User from '#models/user'

const MAX_SVG_BYTES = 512 * 1024
const MAX_RASTER_BYTES = 8 * 1024 * 1024
const SAFE_TAGS = new Set([
  'svg',
  'g',
  'path',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'rect',
])
const SAFE_ATTRIBUTES = new Set([
  'xmlns',
  'viewbox',
  'width',
  'height',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'fill-rule',
  'clip-rule',
  'd',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'points',
  'transform',
  'opacity',
])

export interface VisualAssetRequest {
  userId: number
  prompt: string
  preferredKind?: VisualAssetKind | 'auto'
  purpose?: 'exam' | 'media' | 'document' | 'generic'
  sourceHint?: 'icon_library' | 'svg_composer' | 'svg_llm' | 'image_model'
  metadata?: Record<string, unknown>
}

export interface PersistVisualAssetOptions {
  user: User
  source: VisualAssetSource
  kind: VisualAssetKind
  prompt?: string
  provider?: string | null
  model?: string | null
  metadata?: Record<string, unknown>
  svg?: string
  dataUrl?: string
  viewBox?: string | null
  width?: number | null
  height?: number | null
}

export function promptHash(prompt: string, metadata: Record<string, unknown> = {}) {
  return createHash('sha256')
    .update(JSON.stringify({ prompt: prompt.trim(), metadata }))
    .digest('hex')
}

function quoteAttributeValue(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

/** Sanitize LLM SVG. Text and external resources deliberately unsupported. */
export function sanitizeSvg(value: string): { svg: string; viewBox: string | null } {
  const input = value
    .trim()
    .replace(/^```(?:svg|xml)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  if (!input || Buffer.byteLength(input, 'utf8') > MAX_SVG_BYTES) {
    throw new Error('SVG terlalu besar atau kosong.')
  }
  if (
    !/^<svg(?:\s|>)/i.test(input) ||
    /<(?:script|foreignObject|iframe|object|embed|image)\b/i.test(input)
  ) {
    throw new Error('SVG tidak memenuhi format aman.')
  }
  if (/<\s*!doctype|<\?xml/i.test(input)) {
    throw new Error('SVG dengan deklarasi eksternal tidak didukung.')
  }

  let rootSeen = false
  let rootAttributes: string[] = []
  const tags = input.match(/<\/?[A-Za-z][\w:-]*(?:\s[^<>]*?)?\/?>/g) || []
  if (!tags.length || tags.length > 2500) throw new Error('SVG memiliki struktur tidak aman.')

  const sanitized = input.replace(/<\/?[A-Za-z][\w:-]*(?:\s[^<>]*?)?\/?>/g, (tag) => {
    const opening = /^<([A-Za-z][\w:-]*)/.exec(tag)
    const closing = /^<\/([A-Za-z][\w:-]*)/.exec(tag)
    const tagName = (opening?.[1] || closing?.[1] || '').toLowerCase()
    if (!SAFE_TAGS.has(tagName)) throw new Error(`Elemen SVG ${tagName} tidak diizinkan.`)
    if (closing) return `</${tagName}>`
    const selfClosing = /\/\s*>$/.test(tag)
    const attrText = tag
      .replace(/^<[A-Za-z][\w:-]*/, '')
      .replace(/\/\s*>$/, '')
      .replace(/>$/, '')
    const attrs: string[] = []
    const attrPattern = /([A-Za-z_:][\w:.-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g
    let match: RegExpExecArray | null
    while ((match = attrPattern.exec(attrText))) {
      const name = match[1]
      const lowerName = name.toLowerCase()
      const rawValue = match[2].replace(/^['"]|['"]$/g, '')
      if (lowerName.startsWith('on') || !SAFE_ATTRIBUTES.has(lowerName)) {
        throw new Error(`Atribut SVG ${name} tidak diizinkan.`)
      }
      if (/javascript:|https?:|data:/i.test(rawValue)) {
        throw new Error('SVG tidak boleh memuat URL eksternal.')
      }
      attrs.push(`${lowerName}="${quoteAttributeValue(rawValue)}"`)
    }
    if (tagName === 'svg') {
      if (rootSeen) throw new Error('SVG memiliki root ganda.')
      rootSeen = true
      rootAttributes = attrs.filter(
        (attribute) =>
          !/^(?:fill|stroke|stroke-width|stroke-linecap|stroke-linejoin)=/i.test(attribute)
      )
    }
    return `<${tagName}${attrs.length ? ` ${attrs.join(' ')}` : ''}${selfClosing ? ' />' : '>'}`
  })

  if (!rootSeen || !/^<svg\b[^>]*>[\s\S]*<\/svg>$/i.test(sanitized)) {
    throw new Error('Root SVG tidak valid.')
  }
  if (
    /<[^>]*>[^<]*\S[^<]*<\/[^>]+>/i.test(sanitized.replace(/<svg[^>]*>/i, '').replace('</svg>', ''))
  ) {
    throw new Error('SVG tidak boleh memuat teks bebas.')
  }

  const rootAttributeText = rootAttributes.join(' ')
  const viewBoxMatch = /\bviewBox="([^"]+)"/i.exec(rootAttributeText)
  const viewBox = viewBoxMatch?.[1] || null
  const root = `<svg${rootAttributeText ? ` ${rootAttributeText}` : ''} fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`
  return { svg: sanitized.replace(/^<svg[^>]*>/i, root), viewBox }
}

function decodeDataUrl(dataUrl: string) {
  const match = /^data:(image\/(?:png|jpeg|jpg));base64,([A-Za-z0-9+/=]+)$/i.exec(dataUrl)
  if (!match) throw new Error('Format gambar tidak didukung.')
  const mimeType = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase()
  const data = Buffer.from(match[2], 'base64')
  if (!data.length || data.length > MAX_RASTER_BYTES) throw new Error('Ukuran gambar tidak aman.')
  return { mimeType, data }
}

function extensionForMime(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg'
  return 'png'
}

export async function findCachedVisualAsset(
  userId: number,
  cacheKey: string,
  kind: VisualAssetKind
) {
  return VisualAsset.query()
    .where('user_id', userId)
    .where('prompt_hash', cacheKey)
    .where('kind', kind)
    .where('status', 'ready')
    .orderBy('id', 'desc')
    .first()
}

export async function persistVisualAsset(options: PersistVisualAssetOptions) {
  const metadata = options.metadata || {}
  const cacheKey = options.prompt ? promptHash(options.prompt, metadata) : null
  const existing = cacheKey
    ? await findCachedVisualAsset(options.user.id, cacheKey, options.kind)
    : null
  if (existing) return existing

  const token = randomUUID()
  const directory = resolve(
    process.cwd(),
    'public',
    'uploads',
    'visual-assets',
    String(options.user.id)
  )
  await mkdir(directory, { recursive: true })

  let mimeType: string
  let extension: string
  let content: Buffer
  let viewBox = options.viewBox || null

  if (options.kind === 'svg') {
    const sanitized = sanitizeSvg(options.svg || '')
    content = Buffer.from(sanitized.svg, 'utf8')
    mimeType = 'image/svg+xml'
    extension = 'svg'
    viewBox = sanitized.viewBox || viewBox
  } else {
    const decoded = decodeDataUrl(options.dataUrl || '')
    content = decoded.data
    mimeType = decoded.mimeType
    extension = extensionForMime(mimeType)
  }

  const fileName = `${token}.${extension}`
  const storagePath = `public/uploads/visual-assets/${options.user.id}/${fileName}`
  await writeFile(resolve(process.cwd(), storagePath), content)

  return VisualAsset.create({
    userId: options.user.id,
    schoolId: options.user.schoolId,
    source: options.source,
    kind: options.kind,
    status: 'ready',
    mimeType,
    url: `/uploads/visual-assets/${options.user.id}/${fileName}`,
    storagePath,
    prompt: options.prompt?.trim() || null,
    promptHash: cacheKey,
    provider: options.provider || null,
    model: options.model || null,
    viewBox,
    width: options.width || null,
    height: options.height || null,
    error: null,
    metadata,
  })
}

export async function persistUploadedVisualAsset(options: {
  user: User
  filePath: string
  mimeType: string | null | undefined
  originalName?: string | null
}) {
  const mimeType = options.mimeType?.toLowerCase() || ''
  if (!['image/png', 'image/jpeg'].includes(mimeType)) {
    throw new Error('Format gambar harus PNG atau JPG.')
  }
  const content = await readFile(options.filePath)
  if (!content.length || content.length > MAX_RASTER_BYTES) {
    throw new Error('Ukuran gambar tidak aman.')
  }

  const token = randomUUID()
  const directory = resolve(
    process.cwd(),
    'public',
    'uploads',
    'visual-assets',
    String(options.user.id)
  )
  await mkdir(directory, { recursive: true })
  const fileName = `${token}.${extensionForMime(mimeType)}`
  const storagePath = `public/uploads/visual-assets/${options.user.id}/${fileName}`
  await writeFile(resolve(process.cwd(), storagePath), content)

  return VisualAsset.create({
    userId: options.user.id,
    schoolId: options.user.schoolId,
    source: 'user_upload',
    kind: 'raster',
    status: 'ready',
    mimeType,
    url: `/uploads/visual-assets/${options.user.id}/${fileName}`,
    storagePath,
    prompt: null,
    promptHash: null,
    provider: null,
    model: null,
    viewBox: null,
    width: null,
    height: null,
    error: null,
    metadata: { originalName: options.originalName || null },
  })
}

export async function readSvgAsset(value: string) {
  return readFile(resolvePublicAssetPath(value), 'utf8')
}

export async function rasterizeSvg(value: string, width = 1024, _height = 1024) {
  const svg = value.trim().startsWith('<svg') ? value : await readSvgAsset(value)
  const rendered = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render()
  return Buffer.from(rendered.asPng())
}

export function rasterizeSvgSync(value: string, width = 1024, _height = 1024) {
  const svg = value.trim().startsWith('<svg')
    ? value
    : readFileSync(resolvePublicAssetPath(value), 'utf8')
  const rendered = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render()
  return Buffer.from(rendered.asPng())
}

export function readRasterAssetSync(value: string) {
  const extension = /\.([a-z0-9]+)(?:\?.*)?$/i.exec(value)?.[1]?.toLowerCase()
  if (extension === 'webp' || !['png', 'jpg', 'jpeg'].includes(extension || '')) {
    throw new Error('Format gambar DOCX tidak didukung.')
  }
  return {
    data: readFileSync(resolvePublicAssetPath(value)),
    type: extension === 'jpg' || extension === 'jpeg' ? ('jpg' as const) : ('png' as const),
  }
}

function resolvePublicAssetPath(value: string) {
  const publicRoot = resolve(process.cwd(), 'public')
  const filePath = resolve(publicRoot, value.replace(/^\/+/, ''))
  if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${sep}`)) {
    throw new Error('Visual asset path tidak valid.')
  }
  return filePath
}

export function chooseVisualSource(request: VisualAssetRequest): 'svg' | 'raster' {
  if (
    request.preferredKind === 'svg' ||
    request.sourceHint === 'icon_library' ||
    request.sourceHint === 'svg_composer'
  ) {
    return 'svg'
  }
  if (request.preferredKind === 'raster') return 'raster'
  const prompt = request.prompt.toLowerCase()
  if (
    /color|warna|pemandangan|ilustrasi kompleks|tekstur|banyak objek|makanan tradisional/.test(
      prompt
    )
  ) {
    return 'raster'
  }
  return 'svg'
}

type OutlineIcon = {
  name: string
  aliases: RegExp
  elements: string
}

/**
 * Small server-side registry of Lucide-compatible outline assets.
 * It keeps common PAUD objects deterministic and avoids spending AI quota
 * when a suitable library icon already exists.
 */
const OUTLINE_ICONS: OutlineIcon[] = [
  {
    name: 'Apple',
    aliases: /\b(apel|apple)\b/i,
    elements:
      '<path d="M12 6.528V3a1 1 0 0 1 1-1"/><path d="M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21Z"/>',
  },
  {
    name: 'Leaf',
    aliases: /\b(daun|leaf|leafy)\b/i,
    elements:
      '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  },
  {
    name: 'Flower2',
    aliases: /\b(bunga|flower)\b/i,
    elements:
      '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/><circle cx="12" cy="8" r="2"/><path d="M12 10v12M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5ZM12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"/>',
  },
  {
    name: 'Sun',
    aliases: /\b(matahari|sun)\b/i,
    elements:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  },
  {
    name: 'Star',
    aliases: /\b(bintang|star)\b/i,
    elements:
      '<path d="m11.525 2.295.95 0 2.31 4.679 1.595 1.16 5.166.756.294.904-3.736 3.638-.611 1.878.882 5.14-.771.56-4.618-2.428-1.973 0-4.618 2.428-.77-.56.881-5.139-.611-1.879-3.736-3.638.294-.906 5.165-.755 1.597-1.16Z"/>',
  },
  {
    name: 'Fish',
    aliases: /\b(ikan|fish)\b/i,
    elements:
      '<path d="M16.17 7.83 2 22M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12Z"/>',
  },
  {
    name: 'BookOpen',
    aliases: /\b(buku|book|kitab)\b/i,
    elements:
      '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  },
  {
    name: 'Pencil',
    aliases: /\b(pensil|pencil)\b/i,
    elements:
      '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352.623.622 4.353-1.32a2 2 0 0 0 .83-.497Z"/><path d="m15 5 4 4"/>',
  },
  {
    name: 'House',
    aliases: /\b(rumah|house)\b/i,
    elements:
      '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  },
  {
    name: 'Cloud',
    aliases: /\b(awan|cloud)\b/i,
    elements: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  },
]

function iconSvg(icon: OutlineIcon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${icon.elements}</svg>`
}

export async function resolveKnownVisualAsset(user: User, request: VisualAssetRequest) {
  if (request.preferredKind === 'raster' || request.sourceHint === 'image_model') return null
  if (request.purpose === 'media' && /pemandangan|banyak objek|kompleks/i.test(request.prompt)) {
    return null
  }
  const icon = OUTLINE_ICONS.find((candidate) => candidate.aliases.test(request.prompt))
  if (!icon) return null

  return persistVisualAsset({
    user,
    source: 'icon_library',
    kind: 'svg',
    prompt: request.prompt,
    metadata: { ...request.metadata, library: 'lucide-react', icon: icon.name },
    svg: iconSvg(icon),
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
  })
}
