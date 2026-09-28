/**
 * Normalized education metadata shared by Express tools and AI prompts.
 *
 * Keep this layer data-driven: adding a new jenjang should only require a
 * profile entry (or a user-provided label), not a new copy of every tool.
 * The current UI still exposes TK/RA and SD defaults, while the fallback
 * profile keeps requests for SMP/SMA/SMK and future levels meaningful.
 */
export interface EducationProfile {
  educationLevel: string | null
  institutionType: string | null
  audience: string
  curriculumLabel: string
  frameworkLabel: string
  defaultPhase: string
  isEarlyChildhood: boolean
  isReligiousEarlyChildhood: boolean
}

const PROFILE_LABELS: Record<string, { label: string; phase: string }> = {
  tk: { label: 'TK/PAUD', phase: 'Fondasi' },
  paud: { label: 'PAUD', phase: 'Fondasi' },
  sd: { label: 'SD', phase: 'A' },
  mi: { label: 'MI', phase: 'A' },
  smp: { label: 'SMP', phase: 'D' },
  mts: { label: 'MTs', phase: 'D' },
  sma: { label: 'SMA', phase: 'E' },
  ma: { label: 'MA', phase: 'E' },
  smk: { label: 'SMK', phase: 'E' },
  mak: { label: 'MAK', phase: 'E' },
}

function normalize(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function resolveEducationProfile(
  educationLevel?: unknown,
  institutionType?: unknown,
  curriculumVersion?: unknown
): EducationProfile {
  const level = normalize(educationLevel) || null
  const institution = normalize(institutionType) || null
  // Level is the primary source of truth. Older records can retain a TK/RA
  // institution value after a user switches to SD or another future level.
  const earlyChildhood = level
    ? level === 'tk' || level === 'paud'
    : institution === 'tk' || institution === 'ra'
  const religiousEarlyChildhood = earlyChildhood && institution === 'ra'
  const configured = level ? PROFILE_LABELS[level] : undefined
  const label = configured?.label || (level ? titleCase(level) : 'satuan pendidikan')
  const audience = religiousEarlyChildhood
    ? 'RA (Raudhatul Athfal)'
    : earlyChildhood
      ? label === 'PAUD'
        ? 'PAUD'
        : 'TK/PAUD'
      : label

  return {
    educationLevel: level,
    institutionType: institution,
    audience,
    curriculumLabel:
      typeof curriculumVersion === 'string' && curriculumVersion.trim()
        ? curriculumVersion.trim()
        : 'Kurikulum Merdeka',
    frameworkLabel: religiousEarlyChildhood
      ? 'Kurikulum Merdeka dan P2RA'
      : earlyChildhood
        ? 'Kurikulum Merdeka Fase Fondasi'
        : 'Kurikulum Merdeka',
    defaultPhase: configured?.phase || (earlyChildhood ? 'Fondasi' : 'A'),
    isEarlyChildhood: earlyChildhood,
    isReligiousEarlyChildhood: religiousEarlyChildhood,
  }
}

export function isEarlyChildhoodProfile(educationLevel?: unknown, institutionType?: unknown) {
  return resolveEducationProfile(educationLevel, institutionType).isEarlyChildhood
}
