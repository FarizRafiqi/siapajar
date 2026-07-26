import ExcelJS from 'exceljs'

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
 * Cegah CSV/formula injection: nilai yang berasal dari file yang diunggah bisa saja
 * berakhir di sheet Excel lain (mis. export penilaian) — netralkan awalan formula
 * sebelum data ini pernah disimpan/ditampilkan lagi.
 */
function sanitizeCell(value: unknown): string {
  const str = String(value ?? '').trim()
  return /^[=+\-@]/.test(str) ? `'${str}` : str
}

/**
 * Parser fleksibel untuk file ekspor Dapodik (CSV/XLSX): mencocokkan header
 * kolom "NIS"/"NISN"/"Nama" tanpa peduli urutan atau kapitalisasi.
 *
 * Menggunakan exceljs (bukan paket `xlsx`) khusus untuk jalur ini karena `xlsx`
 * punya CVE prototype-pollution/ReDoS yang dipicu saat membaca file yang tidak
 * tepercaya — export DOCX/XLSX yang sudah ada tidak terpengaruh karena hanya
 * menulis dari data internal, tidak pernah membaca file unggahan.
 */
export async function parseStudentImportFile(
  filePath: string,
  extname: string
): Promise<StudentImportResult> {
  const workbook = new ExcelJS.Workbook()

  try {
    if (extname === 'csv') {
      await workbook.csv.readFile(filePath)
    } else {
      await workbook.xlsx.readFile(filePath)
    }
  } catch {
    return {
      rows: [],
      errors: ['File tidak dapat dibaca. Pastikan formatnya CSV atau Excel (.xlsx) yang valid.'],
    }
  }

  const worksheet = workbook.worksheets[0]

  if (!worksheet || worksheet.rowCount === 0) {
    return { rows: [], errors: ['File kosong atau tidak memiliki data'] }
  }

  const headers: string[] = []
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = sanitizeCell(cell.value).toLowerCase()
  })

  const findColumn = (aliases: string[]) => headers.findIndex((h) => aliases.includes(h))

  const nisCol = findColumn(HEADER_ALIASES.nis)
  const nisnCol = findColumn(HEADER_ALIASES.nisn)
  const nameCol = findColumn(HEADER_ALIASES.fullName)

  if (nisCol === -1 || nameCol === -1) {
    return {
      rows: [],
      errors: [
        `Kolom "NIS" dan "Nama" wajib ada di file. Kolom ditemukan: ${headers.filter(Boolean).join(', ')}`,
      ],
    }
  }

  const rows: ParsedStudentRow[] = []
  const errors: string[] = []

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber)
    const nis = sanitizeCell(row.getCell(nisCol).value)
    const fullName = sanitizeCell(row.getCell(nameCol).value)
    const nisn = nisnCol !== -1 ? sanitizeCell(row.getCell(nisnCol).value) : ''

    if (!nis || !fullName) {
      errors.push(`Baris ${rowNumber}: NIS atau Nama kosong, dilewati`)
      continue
    }

    rows.push({ nis, fullName, nisn: nisn || null })
  }

  return { rows, errors }
}
