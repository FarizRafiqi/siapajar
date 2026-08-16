import type User from '#models/user'
import { callAiJsonForUser } from '#services/user_ai_service'

/**
 * Service AI khusus untuk Asesmen PAUD / RA
 * Menggunakan format TOON (Token-Optimized Object Notation) untuk menghemat kuota token,
 * lalu mem-parse kembali menjadi objek JSON standar untuk database & frontend.
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
    const prompt = `Anda adalah Asisten Pakar Kurikulum Merdeka PAUD / Raudhatul Athfal (RA).
Tugas Anda adalah menyusun Catatan Anekdot yang komprehensif, objektif, dan faktual berdasarkan catatan observasi guru.

Data Observasi:
- Nama Anak: ${params.studentName || 'Anak'}
- Kelompok: ${params.className || 'Kelompok B (5-6 Tahun)'}
- Tema / Topik: ${params.theme || 'Kenalkan'}
- Latar / Konteks: ${params.context || 'Saat bermain bebas di kelas/halaman'}
- Catatan Kasar Guru: ${params.observedBehaviorNotes}

Petunjuk:
1. "kejadianTeramati": Tuliskan peristiwa secara deskriptif, faktual, tidak menghakimi, menggambarkan apa yang diucapkan dan dilakukan anak.
2. "analisisCapaian": Analisis ketercapaian Elemen Capaian Pembelajaran (Nilai Agama & Budi Pekerti, Jati Diri, dan/atau Dasar Literasi & STEAM) beserta perkembangan karakter/sosial anak.

Kembalikan hasil dalam format TOON berikut:
[TOON:ANEKDOT]
KEJADIAN:: (isi deskripsi kejadian teramati faktual)
ANALISIS:: (isi analisis capaian pembelajaran dan karakter anak)
[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      kejadianTeramati?: string
      analisisCapaian?: string
      toon?: string
    }>(user, {
      combo: 'paud_assessment',
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
    const prompt = `Anda adalah Pakar Penilaian PAUD / RA.
Susun butir Ceklis IKTP (Indikator Ketercapaian Tujuan Pembelajaran) yang relevan untuk anak usia 4-6 tahun.

Data:
- Nama Anak: ${params.studentName || 'Anak'}
- Kelompok: ${params.className || 'Kelompok B'}
- Tema: ${params.theme || 'Kenalkan'}
- Tujuan Pembelajaran: ${params.learningObjective || 'Mengenal identitas diri dan berinteraksi sosial'}
- Indikator Tersedia: ${params.targetIndicators?.join(', ') || 'Belum ditentukan'}
- Catatan Pengamatan Guru: ${params.roughNotes || 'Anak aktif dan kooperatif'}

Instruksi:
Hasilkan 3-5 butir indikator perilaku konkret yang dapat diamati, tentukan status "sudah_muncul" atau "belum_muncul", beserta catatan kejadian singkat.

Kembalikan dalam format TOON:
[TOON:CEKLIS]
ITEM:: (teks indikator 1) | (sudah_muncul/belum_muncul) | (keterangan kejadian teramati 1)
ITEM:: (teks indikator 2) | (sudah_muncul/belum_muncul) | (keterangan kejadian teramati 2)
ITEM:: (teks indikator 3) | (sudah_muncul/belum_muncul) | (keterangan kejadian teramati 3)
NOTE:: (catatan umum guru tentang kemajuan anak)
[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      items?: Array<{ indicator: string; status: string; event?: string }>
      generalNote?: string
      toon?: string
    }>(user, {
      combo: 'paud_assessment',
      systemPrompt: 'Anda adalah pakar instrumen asesmen PAUD/RA. Gunakan format TOON.',
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
    const prompt = `Anda adalah Pakar Asesmen Dokumentasi Hasil Karya PAUD / RA.
Susun deskripsi foto hasil karya dan analisis capaian perkembangan berdasarkan karya anak.

Data:
- Nama Anak: ${params.studentName || 'Anak'}
- Kelompok: ${params.className || 'Kelompok B'}
- Tema: ${params.theme || 'Kenalkan'}
- Judul Karya: ${params.workTitle}
- Celoteh / Deskripsi Awal: ${params.childQuotesOrDescription || 'Anak membuat karya seni'}

Instruksi:
1. "workDescription": Deskripsikan karya secara visual dan tuliskan celoteh/cerita anak tentang karyanya.
2. "achievementAnalysis": Uraikan capaian motorik halus, kognitif (pola/bentuk/warna), bahasa, dan kreativitas seni.

Kembalikan format TOON:
[TOON:KARYA]
DESKRIPSI:: (deskripsi karya & celoteh anak)
ANALISIS:: (analisis capaian perkembangan)
[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      workDescription?: string
      achievementAnalysis?: string
      toon?: string
    }>(user, {
      combo: 'paud_assessment',
      systemPrompt: 'Anda adalah pakar asesmen hasil karya PAUD/RA.',
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
    const prompt = `Anda adalah Pakar Asesmen Foto Berseri PAUD / RA.
Susun deskripsi 3 tahapan kegiatan proses anak dan analisis capaian pembelajaran (CP).

Data:
- Nama Anak: ${params.studentName || 'Anak'}
- Kelompok: ${params.className || 'Kelompok B'}
- Tema: ${params.theme || 'Kenalkan'}
- Judul Kegiatan: ${params.activityTitle}
- Catatan Tahapan Guru: ${params.stageNotes || 'Tahap awal, proses pengerjaan, dan penyelesaian'}

Instruksi:
1. Tuliskan 3 tahapan berurutan (Tahap 1, Tahap 2, Tahap 3) yang menunjukkan kemajuan proses.
2. Tuliskan analisis capaian pembelajaran anak secara menyeluruh.

Kembalikan format TOON:
[TOON:FOTOBERSERI]
TAHAP1:: (uraian tahap awal persiapan)
TAHAP2:: (uraian tahap proses pengerjaan)
TAHAP3:: (uraian tahap akhir hasil penyelesaian)
ANALISIS:: (analisis capaian pembelajaran)
[/TOON]`

    const rawResponse = await callAiJsonForUser<{
      stepDescriptions?: string[]
      achievementAnalysis?: string
      toon?: string
    }>(user, {
      combo: 'paud_assessment',
      systemPrompt: 'Anda adalah pakar asesmen foto berseri PAUD/RA.',
      userPrompt: prompt,
    })

    return parseToonPhotoSeries(rawResponse)
  }
}

// -----------------------------------------------------------------------------
// TOON Parsers & Converters to clean standard JSON
// -----------------------------------------------------------------------------

function parseToonAnecdote(res: any) {
  if (res.kejadianTeramati && res.analisisCapaian) {
    return {
      kejadianTeramati: res.kejadianTeramati.trim(),
      analisisCapaian: res.analisisCapaian.trim(),
    }
  }

  const str = res.toon || JSON.stringify(res)
  const kejadianMatch = str.match(/KEJADIAN::\s*([\s\S]*?)(?=ANALISIS::|\[\/TOON\]|$)/i)
  const analisisMatch = str.match(/ANALISIS::\s*([\s\S]*?)(?=\[\/TOON\]|$)/i)

  return {
    kejadianTeramati: kejadianMatch ? kejadianMatch[1].trim() : res.kejadianTeramati || '',
    analisisCapaian: analisisMatch ? analisisMatch[1].trim() : res.analisisCapaian || '',
  }
}

function parseToonChecklist(res: any) {
  if (Array.isArray(res.items) && res.items.length > 0) {
    return {
      items: res.items,
      generalNote: res.generalNote || '',
    }
  }

  const str = res.toon || JSON.stringify(res)
  const itemMatches = [
    ...str.matchAll(/ITEM::\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)(?=\n|ITEM::|NOTE::|\[\/TOON\]|$)/gi),
  ]
  const noteMatch = str.match(/NOTE::\s*([\s\S]*?)(?=\[\/TOON\]|$)/i)

  const items = itemMatches.map((m) => ({
    indicator: m[1].trim(),
    status: m[2].trim().toLowerCase().includes('belum') ? 'belum_muncul' : 'sudah_muncul',
    event: m[3] ? m[3].trim() : '',
  }))

  return {
    items: items.length > 0 ? items : res.items || [],
    generalNote: noteMatch ? noteMatch[1].trim() : res.generalNote || '',
  }
}

function parseToonWorkSample(res: any) {
  if (res.workDescription && res.achievementAnalysis) {
    return {
      workDescription: res.workDescription.trim(),
      achievementAnalysis: res.achievementAnalysis.trim(),
    }
  }

  const str = res.toon || JSON.stringify(res)
  const deskripsiMatch = str.match(/DESKRIPSI::\s*([\s\S]*?)(?=ANALISIS::|\[\/TOON\]|$)/i)
  const analisisMatch = str.match(/ANALISIS::\s*([\s\S]*?)(?=\[\/TOON\]|$)/i)

  return {
    workDescription: deskripsiMatch ? deskripsiMatch[1].trim() : res.workDescription || '',
    achievementAnalysis: analisisMatch ? analisisMatch[1].trim() : res.achievementAnalysis || '',
  }
}

function parseToonPhotoSeries(res: any) {
  if (Array.isArray(res.stepDescriptions) && res.stepDescriptions.length > 0) {
    return {
      stepDescriptions: res.stepDescriptions,
      achievementAnalysis: res.achievementAnalysis || '',
    }
  }

  const str = res.toon || JSON.stringify(res)
  const t1 = str.match(/TAHAP1::\s*([\s\S]*?)(?=TAHAP2::|TAHAP3::|ANALISIS::|\[\/TOON\]|$)/i)
  const t2 = str.match(/TAHAP2::\s*([\s\S]*?)(?=TAHAP3::|ANALISIS::|\[\/TOON\]|$)/i)
  const t3 = str.match(/TAHAP3::\s*([\s\S]*?)(?=ANALISIS::|\[\/TOON\]|$)/i)
  const analisisMatch = str.match(/ANALISIS::\s*([\s\S]*?)(?=\[\/TOON\]|$)/i)

  const steps = [t1 ? t1[1].trim() : '', t2 ? t2[1].trim() : '', t3 ? t3[1].trim() : ''].filter(
    Boolean
  )

  return {
    stepDescriptions: steps.length > 0 ? steps : res.stepDescriptions || [],
    achievementAnalysis: analisisMatch ? analisisMatch[1].trim() : res.achievementAnalysis || '',
  }
}

export const paudAssessmentAiService = new PaudAssessmentAiService()
