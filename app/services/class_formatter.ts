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
}

export type ClassParam = SchoolClass | PartialSchoolClass | null | undefined
export type UserParam = User | PartialUser | null | undefined

function resolveRombelCode(groupLetter: string, rombel: string, rawName: string): string {
  if (rombel) return `${groupLetter}${rombel}`
  if (/^[AB]\d+$/i.test(rawName)) return rawName.toUpperCase()
  return groupLetter
}

function resolveFallbackCover(inst: string, fallbackGroup?: string): string {
  if (!fallbackGroup) return `${inst} / B1`
  const match = /Kelompok\s+([AB])/i.exec(fallbackGroup)
  if (match) {
    return `${inst} / ${match[1].toUpperCase()}`
  }
  return `${inst} / ${fallbackGroup.toUpperCase()}`
}

export function formatRpmClassCover(
  schoolClass?: ClassParam,
  user?: UserParam,
  fallbackGroup?: string
): string {
  const inst = (user?.institutionType || (user?.isTk === false ? 'SD' : 'RA')).toUpperCase()
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
    return fallbackGroup || 'Kelompok B (5-6 Tahun)'
  }

  const groupLetter = (
    schoolClass.groupContext || (schoolClass.gradeLevel === 0 ? 'a' : 'b')
  ).toUpperCase()
  const ageRange = groupLetter === 'A' ? '4-5 Tahun' : '5-6 Tahun'
  const rombel = schoolClass.rombelNumber ? String(schoolClass.rombelNumber).trim() : ''
  const code = rombel ? `${groupLetter}${rombel}` : groupLetter
  const rawName = schoolClass.name ? schoolClass.name.trim() : ''
  const isRedundantName =
    !rawName ||
    rawName.toUpperCase() === code ||
    rawName.toUpperCase() === `KELOMPOK ${groupLetter}`

  if (!isRedundantName) {
    return `Kelompok ${code} (${ageRange}) - ${rawName}`
  }
  return `Kelompok ${code} (${ageRange})`
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
