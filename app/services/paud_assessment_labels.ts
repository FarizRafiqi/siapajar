export const PAUD_ACHIEVEMENT_LABELS: Record<string, string> = {
  belum_terlihat: 'Belum terlihat',
  mulai_berkembang: 'Mulai berkembang',
  berkembang_sesuai_harapan: 'Berkembang sesuai harapan',
  berkembang_sangat_baik: 'Berkembang sangat baik',
}

export function paudAchievementLabel(status: string | null | undefined): string | null {
  if (!status) {
    return null
  }
  return PAUD_ACHIEVEMENT_LABELS[status] ?? status
}
