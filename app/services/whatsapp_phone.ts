/**
 * Normalizes Indonesian phone numbers into international format without '+' sign.
 * E.g., '081234567890' -> '6281234567890', '+62 812-3456-7890' -> '6281234567890'.
 * Returns null if invalid (outside 10-15 digits range or non-Indonesian format).
 */
export function normalizeIndonesianPhone(input: string | null | undefined): string | null {
  if (!input) return null
  let cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '')
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1)
  }

  if (!/^\d+$/.test(cleaned)) {
    return null
  }

  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2)
  } else if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  }

  if (!cleaned.startsWith('62')) {
    return null
  }

  if (cleaned.length < 10 || cleaned.length > 15) {
    return null
  }

  return cleaned
}
