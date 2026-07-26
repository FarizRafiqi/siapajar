import * as XLSX from 'xlsx'

export interface ParsedStudentRow {
  nis: string
  fullName: string
  nisn: string | null
}

export interface StudentImportResult {
  rows: ParsedStudentRow[]
  errors: string[]
}

const HEADER_ALIASES: Record<'nis' | 'nisn' | 'fullName', string[]> = {
  nis: ['nis'],
  nisn: ['nisn'],
  fullName: ['nama', 'nama siswa', 'nama lengkap'],
}

/**
 * Parser fleksibel untuk file ekspor Dapodik (CSV/XLSX): mencocokkan header
 * kolom "NIS"/"NISN"/"Nama" tanpa peduli urutan atau kapitalisasi.
 */
export function parseStudentImportFile(buffer: Buffer): StudentImportResult {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    return { rows: [], errors: ['File kosong atau tidak memiliki sheet'] }
  }

  const sheet = workbook.Sheets[sheetName]
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  if (raw.length === 0) {
    return { rows: [], errors: ['Tidak ada data ditemukan dalam file'] }
  }

  const sampleKeys = Object.keys(raw[0])
  const findKey = (aliases: string[]) =>
    sampleKeys.find((key) => aliases.includes(key.trim().toLowerCase()))

  const nisKey = findKey(HEADER_ALIASES.nis)
  const nisnKey = findKey(HEADER_ALIASES.nisn)
  const nameKey = findKey(HEADER_ALIASES.fullName)

  if (!nisKey || !nameKey) {
    return {
      rows: [],
      errors: [
        `Kolom "NIS" dan "Nama" wajib ada di file. Kolom ditemukan: ${sampleKeys.join(', ')}`,
      ],
    }
  }

  const rows: ParsedStudentRow[] = []
  const errors: string[] = []

  raw.forEach((row, index) => {
    const nis = String(row[nisKey] ?? '').trim()
    const fullName = String(row[nameKey] ?? '').trim()
    const nisn = nisnKey ? String(row[nisnKey] ?? '').trim() : ''

    if (!nis || !fullName) {
      errors.push(`Baris ${index + 2}: NIS atau Nama kosong, dilewati`)
      return
    }

    rows.push({ nis, fullName, nisn: nisn || null })
  })

  return { rows, errors }
}
