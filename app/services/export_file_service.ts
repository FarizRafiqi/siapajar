import type { HttpContext } from '@adonisjs/core/http'

export const EXPORT_CONTENT_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const

/** Keep filenames portable across Windows, macOS, Linux, and browser downloads. */
export function exportFilename(
  parts: Array<string | number | null | undefined>,
  extension: string
) {
  const name = parts
    .filter((part) => part !== null && part !== undefined && String(part).trim() !== '')
    .join(' - ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/g, '')
    .slice(0, 150)

  return `${name || 'siapajar-dokumen'}.${extension.replace(/^\./, '')}`
}

export function sendExport(
  response: HttpContext['response'],
  buffer: Buffer,
  contentType: string,
  filename: string,
  options: { inline?: boolean } = {}
) {
  response.header('Content-Type', contentType)
  response.header(
    'Content-Disposition',
    `${options.inline ? 'inline' : 'attachment'}; filename="${filename}"`
  )
  response.header('X-Content-Type-Options', 'nosniff')
  response.header('Cache-Control', 'private, no-store')
  return response.send(buffer)
}

export function wantsInlinePreview(request: HttpContext['request']) {
  return (
    request.input('disposition') === 'inline' ||
    request.header('accept')?.includes('application/pdf')
  )
}
