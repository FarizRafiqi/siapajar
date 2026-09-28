import type SchoolClass from '#models/school_class'
import type User from '#models/user'

interface PartialSchoolClass {
  name?: string
  gradeLevel?: number
  groupContext?: string | null
  rombelNumber?: string | null
}

interface PartialUser {
  institutionType?: string | null
  isTk?: boolean
  schoolName?: string | null
  educationLevel?: string | null
}

export type ClassParam = SchoolClass | PartialSchoolClass | null | undefined
export type UserParam = User | PartialUser | null | undefined

export interface InstitutionInfo {
  ministry: string
  subtitle: string
  level: string
  assessmentHeaderTitle: string
}

export function detectInstitutionInfo(
  schoolName?: string | null,
  educationLevel?: string | null,
  institutionType?: string | null
): InstitutionInfo {
  const sName = (schoolName || '').trim()
  const edu = (educationLevel || '').trim().toUpperCase()
  const institution = (institutionType || '').trim().toUpperCase()
  const explicitNonEarlyLevel = edu && !['RA', 'TK', 'PAUD'].includes(edu)

  const hasRa =
    !explicitNonEarlyLevel &&
    (institution === 'RA' ||
      /\b(RA|Raudhatul|Athfal|Madrasah|Kemenag)\b/i.test(sName) ||
      edu === 'RA' ||
      /Raudhatul\s+Athfal/i.test(sName))
  const hasTk =
    !explicitNonEarlyLevel &&
    (institution === 'TK' || /\b(TK|Taman\s+Kanak|TKK)\b/i.test(sName) || edu === 'TK')
  const hasPaud =
    !explicitNonEarlyLevel &&
    (institution === 'PAUD' ||
      /\b(PAUD|KB|Kelompok\s+Bermain|TPA|SPS)\b/i.test(sName) ||
      edu === 'PAUD')

  // An explicit non-PAUD level wins over stale institution/name metadata.
  // This keeps legacy SD accounts from receiving RA/TK headers.
  if (explicitNonEarlyLevel) {
    const religious = ['MI', 'MTS', 'MA', 'MAK'].includes(edu)
    const ministry = religious
      ? 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'
      : 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI'
    const curriculum = religious ? 'KURIKULUM MERDEKA MADRASAH' : 'KURIKULUM MERDEKA'
    return {
      ministry,
      subtitle: `MODUL AJAR ${curriculum} ${edu}`,
      level: edu,
      assessmentHeaderTitle: `ASESMEN ${edu}`,
    }
  }

  if (hasRa) {
    return {
      ministry: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
      subtitle: 'MODUL AJAR KURIKULUM BERBASIS CINTA (KBC) RA - FASE FONDASI',
      level: 'RA',
      assessmentHeaderTitle: 'ASESMEN RA',
    }
  }

  if (hasTk) {
    return {
      ministry: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI',
      subtitle: 'MODUL AJAR KURIKULUM MERDEKA TK - FASE FONDASI',
      level: 'TK',
      assessmentHeaderTitle: 'ASESMEN TK',
    }
  }

  if (hasPaud) {
    return {
      ministry: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI',
      subtitle: 'MODUL AJAR KURIKULUM MERDEKA PAUD - FASE FONDASI',
      level: 'PAUD',
      assessmentHeaderTitle: 'ASESMEN PAUD',
    }
  }

  return {
    ministry: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
    subtitle: 'MODUL AJAR KURIKULUM BERBASIS CINTA (KBC) RA - FASE FONDASI',
    level: 'RA',
    assessmentHeaderTitle: 'ASESMEN RA',
  }
}

function resolveRombelCode(groupLetter: string, rombel: string, rawName: string): string {
  if (rombel) return `${groupLetter}${rombel}`
  if (/^[AB]\d+$/i.test(rawName)) return rawName.toUpperCase()
  return groupLetter
}

function resolveFallbackCover(inst: string, fallbackGroup?: string): string {
  if (!fallbackGroup) return `${inst} / B1`
  const match = /Kelompok\s+([AB]\d*)/i.exec(fallbackGroup)
  if (match) {
    return `${inst} / ${match[1].toUpperCase()}`
  }
  return `${inst} / ${fallbackGroup.toUpperCase()}`
}

export function formatRpmClassShortCode(
  schoolClass?: ClassParam,
  user?: UserParam,
  fallbackGroup?: string
): string {
  const info = detectInstitutionInfo(
    user?.schoolName,
    user?.educationLevel || (user?.isTk === false ? 'SD' : 'RA'),
    user?.institutionType
  )
  const inst = info.level

  if (!schoolClass) {
    if (!fallbackGroup) return `${inst}/B1`
    const match = /([AB]\d*)/i.exec(fallbackGroup)
    if (match) return `${inst}/${match[1].toUpperCase()}`
    return `${inst}/B1`
  }

  const groupLetter = (
    schoolClass.groupContext || (schoolClass.gradeLevel === 0 ? 'a' : 'b')
  ).toUpperCase()
  const rombel = schoolClass.rombelNumber ? String(schoolClass.rombelNumber).trim() : ''
  const rawName = schoolClass.name ? schoolClass.name.trim() : ''
  const rombelCode = resolveRombelCode(groupLetter, rombel, rawName)

  return `${inst}/${rombelCode}`
}

export function formatRpmClassCover(
  schoolClass?: ClassParam,
  user?: UserParam,
  fallbackGroup?: string
): string {
  const info = detectInstitutionInfo(
    user?.schoolName,
    user?.educationLevel || (user?.isTk === false ? 'SD' : 'RA'),
    user?.institutionType
  )
  const inst = info.level
  if (!schoolClass) return resolveFallbackCover(inst, fallbackGroup)

  const groupLetter = (
    schoolClass.groupContext || (schoolClass.gradeLevel === 0 ? 'a' : 'b')
  ).toUpperCase()
  const rombel = schoolClass.rombelNumber ? String(schoolClass.rombelNumber).trim() : ''
  const rawName = schoolClass.name ? schoolClass.name.trim() : ''
  const rombelCode = resolveRombelCode(groupLetter, rombel, rawName)
  const cleanName = rawName.toUpperCase()

  const isRedundantName =
    !cleanName ||
    cleanName === rombelCode ||
    cleanName === `KELOMPOK ${groupLetter}` ||
    cleanName === groupLetter

  if (!isRedundantName) {
    return `${inst} / ${rombelCode} (${cleanName})`
  }
  return `${inst} / ${rombelCode}`
}

export function formatRpmClassGroupDetail(
  schoolClass?: ClassParam,
  fallbackGroup?: string
): string {
  if (!schoolClass) {
    if (fallbackGroup) {
      const match = /([AB]\d*)/i.exec(fallbackGroup)
      const gLetter = match ? match[1].toUpperCase() : 'B1'
      const age = gLetter.startsWith('A') ? '4-5 Tahun' : '5-6 Tahun'
      return `${gLetter} / ${age}`
    }
    return 'B1 / 5-6 Tahun'
  }

  const groupLetter = (
    schoolClass.groupContext || (schoolClass.gradeLevel === 0 ? 'a' : 'b')
  ).toUpperCase()
  const ageRange = groupLetter === 'A' ? '4-5 Tahun' : '5-6 Tahun'
  const rombel = schoolClass.rombelNumber ? String(schoolClass.rombelNumber).trim() : ''
  const rawName = schoolClass.name ? schoolClass.name.trim() : ''
  const code = resolveRombelCode(groupLetter, rombel, rawName)

  return `${code} / ${ageRange}`
}

function formatPaudClassName(schoolClass: SchoolClass | PartialSchoolClass): string {
  const groupLetter = (
    schoolClass.groupContext || (schoolClass.gradeLevel === 0 ? 'a' : 'b')
  ).toUpperCase()
  const rombel = schoolClass.rombelNumber ? String(schoolClass.rombelNumber).trim() : ''
  const code = rombel ? `${groupLetter}${rombel}` : groupLetter
  const rawName = schoolClass.name ? schoolClass.name.trim() : ''
  if (
    rawName &&
    rawName.toUpperCase() !== code &&
    rawName.toUpperCase() !== `KELOMPOK ${groupLetter}`
  ) {
    return `Kelompok ${code} (${rawName})`
  }
  return `Kelompok ${code}`
}

function formatStandardClassName(schoolClass: SchoolClass | PartialSchoolClass): string {
  const grade = schoolClass.gradeLevel ?? ''
  const name = schoolClass.name ? schoolClass.name.trim() : ''
  if (grade && name) {
    if (name.startsWith(String(grade))) return `Kelas ${name}`
    return `Kelas ${grade}${name}`
  }
  return name ? `Kelas ${name}` : `Kelas ${grade}`
}

export function formatSchoolClassName(
  schoolClass?: ClassParam,
  institutionType?: string | null
): string {
  if (!schoolClass) return ''
  const inst = (institutionType || '').toLowerCase()
  if (inst === 'ra' || inst === 'tk') {
    return formatPaudClassName(schoolClass)
  }
  return formatStandardClassName(schoolClass)
}
