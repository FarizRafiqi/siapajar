/**
 * Normalize the two profile fields that identify the product experience.
 * Older accounts may only have `educationLevel`, while PAUD/RA accounts
 * created during onboarding can also carry `institutionType`.
 */
export function isPaudProfile(
  educationLevel?: string | null,
  institutionType?: string | null
): boolean {
  const level = educationLevel?.trim().toLowerCase()
  const institution = institutionType?.trim().toLowerCase()

  // An explicitly selected non-PAUD level must win over stale legacy
  // institution metadata (for example SD + TK from an older account).
  if (level && !['tk', 'paud'].includes(level)) return false

  return level === 'tk' || level === 'paud' || institution === 'tk' || institution === 'ra'
}
