import type User from '#models/user'
import { callAiJsonForUser } from '#services/user_ai_service'

/**
 * Service AI khusus untuk Asesmen PAUD / RA
 * Menggunakan format TOON (Token-Optimized Object Notation) untuk menghemat ~60% kuota token,
 * dan mem-parse kembali secara tangguh menjadi objek JSON standar untuk database & frontend.
 */
export class PaudAssessmentAiService {
  /**
   * 1. Generate Analisis & Kejadian Catatan Anekdot via TOON
   */
  async generateAnecdotal(
    user: User,
    params: {
      studentName?: string
      className?: string
      theme?: string
      context?: string
      observedBehaviorNotes: string
    }
  ) {
    const prompt =
      `Anda adalah Asisten Pakar Kurikulum Merdeka PAUD / Raudhatul Athfal (RA).\n` +
      `Tugas Anda adalah menyusun Catatan Anekdot yang komprehensif, objektif, dan faktual berdasarkan catatan observasi guru.\n\n` +
      `Data Observasi:\n` +
      `- Nama Anak: ${params.studentName || 'Anak'}\n` +
      `- Kelompok: ${params.className || 'Kelompok B (5-6 Tahun)'}\n` +
      `- Tema / Topik: ${params.theme || 'Kenalkan'}\n` +
      `- Latar / Konteks: ${params.context || 'Saat bermain bebas di kelas/halaman'}\n` +
      `- Catatan Kasar Pengamatan: ${params.observedBehaviorNotes}\n\n` +
      `Petunjuk:\n` +
      `1. "KEJADIAN": Tuliskan peristiwa secara deskriptif, faktual, tidak menghakimi, menggambarkan apa yang diucapkan dan dilakukan anak.\n` +
      `2. "ANALISIS": Analisis ketercapaian Elemen Capaian Pembelajaran (Nilai Agama & Budi Pekerti, Jati Diri, dan/atau Dasar Literasi & STEAM) beserta perkembangan karakter/sosial anak.\n\n` +
      `Kembalikan hasil dalam format TOON berikut:\n` +
      `[TOON:ANEKDOT]\n` +
      `KEJADIAN:: (isi deskripsi kejadian teramati faktual)\n` +
      `ANALISIS:: (isi analisis capaian pembelajaran dan karakter anak)\n` +
      `[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      kejadianTeramati?: string
      analisisCapaian?: string
      observedEvent?: string
      achievementAnalysis?: string
      toon?: string
    }>(user, {
      combo: 'siapajar-docgen',
      systemPrompt:
        'Anda adalah asisten AI ahli Kurikulum Merdeka PAUD/RA. Gunakan format TOON hemat token.',
      userPrompt: prompt,
    })

    return parseToonAnecdote(rawResponse)
  }

  /**
   * 2. Generate Butir Ceklis IKTP via TOON
   */
  async generateChecklist(
    user: User,
    params: {
      studentName?: string
      className?: string
      theme?: string
      learningObjective?: string
      targetIndicators?: string[]
      roughNotes?: string
    }
  ) {
    const prompt =
      `Anda adalah Pakar Penilaian PAUD / RA.\n` +
      `Susun butir Ceklis IKTP (Indikator Ketercapaian Tujuan Pembelajaran) yang relevan untuk anak usia 4-6 tahun.\n\n` +
      `Data:\n` +
      `- Nama Anak: ${params.studentName || 'Anak'}\n` +
      `- Kelompok: ${params.className || 'Kelompok B'}\n` +
      `- Tema / Topik: ${params.theme || 'Kenalkan'}\n` +
      `- Tujuan Pembelajaran: ${params.learningObjective || 'Mengenal identitas diri dan berinteraksi sosial secara positif'}\n` +
      `- Indikator Acuan: ${params.targetIndicators?.filter(Boolean).join(', ') || 'Belum ditentukan'}\n` +
      `- Catatan Pengamatan Guru: ${params.roughNotes || 'Anak aktif dan kooperatif'}\n\n` +
      `Instruksi:\n` +
      `Hasilkan 3-5 butir indikator perilaku konkret yang dapat diamati, tentukan status "sudah_muncul" atau "belum_muncul", beserta catatan kejadian singkat.\n\n` +
      `Kembalikan dalam format TOON:\n` +
      `[TOON:CEKLIS]\n` +
      `ITEM:: (teks indikator 1) | (sudah_muncul/belum_muncul) | (keterangan kejadian teramati 1)\n` +
      `ITEM:: (teks indikator 2) | (sudah_muncul/belum_muncul) | (keterangan kejadian teramati 2)\n` +
      `ITEM:: (teks indikator 3) | (sudah_muncul/belum_muncul) | (keterangan kejadian teramati 3)\n` +
      `NOTE:: (catatan umum guru tentang kemajuan anak)\n` +
      `[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      items?: Array<{ indicator?: string; status?: string; event?: string }>
      generalNote?: string
      toon?: string
    }>(user, {
      combo: 'siapajar-docgen',
      systemPrompt: 'Anda adalah pakar instrumen asesmen PAUD/RA. Gunakan format TOON hemat token.',
      userPrompt: prompt,
    })

    return parseToonChecklist(rawResponse)
  }

  /**
   * 3. Generate Deskripsi & Analisis Hasil Karya via TOON
   */
  async generateWorkSample(
    user: User,
    params: {
      studentName?: string
      className?: string
      theme?: string
      workTitle: string
      childQuotesOrDescription?: string
    }
  ) {
    const prompt =
      `Anda adalah Pakar Asesmen Dokumentasi Hasil Karya PAUD / RA.\n` +
      `Susun deskripsi foto hasil karya dan analisis capaian perkembangan berdasarkan karya anak.\n\n` +
      `Data:\n` +
      `- Nama Anak: ${params.studentName || 'Anak'}\n` +
      `- Kelompok: ${params.className || 'Kelompok B'}\n` +
      `- Tema: ${params.theme || 'Kenalkan'}\n` +
      `- Judul Karya: ${params.workTitle}\n` +
      `- Catatan / Celoteh Anak: ${params.childQuotesOrDescription || 'Anak membuat karya seni'}\n\n` +
      `Instruksi:\n` +
      `1. "DESKRIPSI": Deskripsikan karya secara visual dan tuliskan celoteh/cerita anak tentang karyanya.\n` +
      `2. "ANALISIS": Uraikan capaian motorik halus, kognitif (pola/bentuk/warna), bahasa, dan kreativitas seni.\n\n` +
      `Kembalikan format TOON:\n` +
      `[TOON:KARYA]\n` +
      `DESKRIPSI:: (deskripsi karya & celoteh anak)\n` +
      `ANALISIS:: (analisis capaian perkembangan)\n` +
      `[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      workDescription?: string
      achievementAnalysis?: string
      description?: string
      analysis?: string
      toon?: string
    }>(user, {
      combo: 'siapajar-docgen',
      systemPrompt: 'Anda adalah pakar asesmen hasil karya PAUD/RA. Gunakan format TOON.',
      userPrompt: prompt,
    })

    return parseToonWorkSample(rawResponse)
  }

  /**
   * 4. Generate Tahapan & Analisis Foto Berseri via TOON
   */
  async generatePhotoSeries(
    user: User,
    params: {
      studentName?: string
      className?: string
      theme?: string
      activityTitle: string
      stageNotes?: string
    }
  ) {
    const prompt =
      `Anda adalah Pakar Asesmen Foto Berseri PAUD / RA.\n` +
      `Susun deskripsi 3 tahapan kegiatan proses anak dan analisis capaian pembelajaran (CP).\n\n` +
      `Data:\n` +
      `- Nama Anak: ${params.studentName || 'Anak'}\n` +
      `- Kelompok: ${params.className || 'Kelompok B'}\n` +
      `- Tema: ${params.theme || 'Kenalkan'}\n` +
      `- Judul Kegiatan: ${params.activityTitle}\n` +
      `- Catatan Tahapan Guru: ${params.stageNotes || 'Tahap awal persiapan, proses eksplorasi, dan hasil akhir'}\n\n` +
      `Instruksi:\n` +
      `1. Tuliskan 3 tahapan berurutan (TAHAP1, TAHAP2, TAHAP3) yang menunjukkan kemajuan proses.\n` +
      `2. Tuliskan analisis capaian pembelajaran anak secara menyeluruh.\n\n` +
      `Kembalikan format TOON:\n` +
      `[TOON:FOTOBERSERI]\n` +
      `TAHAP1:: (uraian tahap awal persiapan)\n` +
      `TAHAP2:: (uraian tahap proses pengerjaan)\n` +
      `TAHAP3:: (uraian tahap akhir hasil penyelesaian)\n` +
      `ANALISIS:: (analisis capaian pembelajaran)\n` +
      `[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      stepDescriptions?: string[]
      achievementAnalysis?: string
      stages?: string[]
      analysis?: string
      toon?: string
    }>(user, {
      combo: 'siapajar-docgen',
      systemPrompt: 'Anda adalah pakar asesmen foto berseri PAUD/RA. Gunakan format TOON.',
      userPrompt: prompt,
    })

    return parseToonPhotoSeries(rawResponse)
  }
}

// -----------------------------------------------------------------------------
// Safe TOON & JSON Linear Parsers
// -----------------------------------------------------------------------------

function extractRawText(res: any): string {
  if (typeof res?.toon === 'string') return res.toon
  if (typeof res === 'string') return res
  return JSON.stringify(res || {})
}

function extractToonSections(raw: string, prefixes: string[]): Record<string, string> {
  const sections: Record<string, string> = {}
  let currentKey: string | null = null

  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('[/TOON]') || trimmed.startsWith('[TOON:')) {
      currentKey = null
      continue
    }

    const matchedPrefix = prefixes.find((p) => trimmed.startsWith(p))
    if (matchedPrefix) {
      currentKey = matchedPrefix.replace('::', '')
      const content = trimmed.slice(matchedPrefix.length).trim()
      sections[currentKey] = sections[currentKey] ? `${sections[currentKey]}\n${content}` : content
    } else if (currentKey && trimmed) {
      sections[currentKey] = sections[currentKey] ? `${sections[currentKey]}\n${trimmed}` : trimmed
    }
  }

  return sections
}

export function parseToonAnecdote(res: any) {
  if (res?.kejadianTeramati && res?.analisisCapaian) {
    return {
      kejadianTeramati: String(res.kejadianTeramati).trim(),
      analisisCapaian: String(res.analisisCapaian).trim(),
    }
  }

  const raw = extractRawText(res)
  const sections = extractToonSections(raw, ['KEJADIAN::', 'ANALISIS::'])

  const parsedKejadian = sections['KEJADIAN']?.trim()
  const fallbackKejadian = res?.kejadianTeramati || res?.observedEvent || ''
  const parsedAnalisis = sections['ANALISIS']?.trim()
  const fallbackAnalisis = res?.analisisCapaian || res?.achievementAnalysis || ''

  return {
    kejadianTeramati: parsedKejadian || String(fallbackKejadian),
    analisisCapaian: parsedAnalisis || String(fallbackAnalisis),
  }
}

export function parseToonChecklist(res: any) {
  if (Array.isArray(res?.items) && res.items.length > 0) {
    return {
      items: res.items.map((item: any, idx: number) => {
        const rawStatus = String(item?.status || '').toLowerCase()
        const status = rawStatus.includes('belum') ? 'belum_muncul' : 'sudah_muncul'
        return {
          indicator: String(item?.indicator || item?.indikator || `Indikator ${idx + 1}`).trim(),
          status,
          event: String(item?.event || item?.kejadian || '').trim(),
        }
      }),
      generalNote: String(res?.generalNote || res?.note || '').trim(),
    }
  }

  const raw = extractRawText(res)
  const items: Array<{ indicator: string; status: string; event: string }> = []
  let generalNote = ''

  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('ITEM::')) {
      const parts = trimmed
        .slice(6)
        .split('|')
        .map((s: string) => s.trim())
      if (parts[0]) {
        const itemStatus = parts[1]?.toLowerCase().includes('belum')
          ? 'belum_muncul'
          : 'sudah_muncul'
        items.push({
          indicator: parts[0],
          status: itemStatus,
          event: parts[2] || '',
        })
      }
    } else if (trimmed.startsWith('NOTE::')) {
      generalNote = trimmed.slice(6).trim()
    }
  }

  const fallbackItems = res?.items || []
  const fallbackNote = res?.generalNote || ''

  return {
    items: items.length > 0 ? items : fallbackItems,
    generalNote: generalNote || String(fallbackNote),
  }
}

export function parseToonWorkSample(res: any) {
  if (res?.workDescription && res?.achievementAnalysis) {
    return {
      workDescription: String(res.workDescription).trim(),
      achievementAnalysis: String(res.achievementAnalysis).trim(),
    }
  }

  const raw = extractRawText(res)
  const sections = extractToonSections(raw, ['DESKRIPSI::', 'ANALISIS::'])

  const parsedDesc = sections['DESKRIPSI']?.trim()
  const fallbackDesc = res?.workDescription || res?.description || ''
  const parsedAnalysis = sections['ANALISIS']?.trim()
  const fallbackAnalysis = res?.achievementAnalysis || res?.analysis || ''

  return {
    workDescription: parsedDesc || String(fallbackDesc),
    achievementAnalysis: parsedAnalysis || String(fallbackAnalysis),
  }
}

export function parseToonPhotoSeries(res: any) {
  if (Array.isArray(res?.stepDescriptions) && res.stepDescriptions.length > 0) {
    return {
      stepDescriptions: res.stepDescriptions
        .map((s: unknown) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean),
      achievementAnalysis: String(res?.achievementAnalysis || '').trim(),
    }
  }

  const raw = extractRawText(res)
  const sections = extractToonSections(raw, ['TAHAP1::', 'TAHAP2::', 'TAHAP3::', 'ANALISIS::'])

  const steps = [
    sections['TAHAP1']?.trim(),
    sections['TAHAP2']?.trim(),
    sections['TAHAP3']?.trim(),
  ].filter((s): s is string => Boolean(s))

  const fallbackSteps = res?.stepDescriptions || res?.stages || []
  const parsedAnalysis = sections['ANALISIS']?.trim()
  const fallbackAnalysis = res?.achievementAnalysis || res?.analysis || ''

  return {
    stepDescriptions: steps.length > 0 ? steps : fallbackSteps,
    achievementAnalysis: parsedAnalysis || String(fallbackAnalysis),
  }
}

export const paudAssessmentAiService = new PaudAssessmentAiService()
