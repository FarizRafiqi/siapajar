import * as XLSX from 'xlsx'
import Assessment from '#models/assessment'
import User from '#models/user'

/**
 * Layout kolom mengikuti struktur RPT Digital / e-Rapor SD agar copy-paste
 * ke halaman penilaian minim gesekan — lihat Fase 5.3 di plan.
 */
export function exportAssessmentScores(assessment: Assessment, user: User) {
  const header = ['No', 'NIS', 'Nama Siswa', 'Nilai', 'Catatan']
  const rows = assessment.scores.map((score, index) => [
    index + 1,
    score.student.nis,
    score.student.fullName,
    score.value ?? '',
    score.note ?? '',
  ])

  const sheetData = [
    [user.schoolName || 'Sekolah'],
    [`${assessment.title} — ${assessment.subject}`],
    [`Kelas ${assessment.schoolClass.name} — ${assessment.date.toFormat('dd/MM/yyyy')}`],
    [],
    header,
    ...rows,
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  worksheet['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 30 }, { wch: 10 }, { wch: 30 }]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Nilai')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}
