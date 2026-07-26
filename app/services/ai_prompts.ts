/**
 * Prompt terpisah per jenjang & resource — inti "TK penuh": SD dan TK
 * tidak boleh pakai template sama (Modul Ajar vs RPPH/RPPM).
 */

interface AiPrompt {
  system: string
  user: string
}

export function teachingModulePrompt(params: {
  subject: string
  topic: string
  phase: string
}): AiPrompt {
  return {
    system:
      'Kamu asisten guru SD Indonesia ahli Kurikulum Merdeka. Balas HANYA JSON valid tanpa teks lain, ' +
      'dengan struktur persis: {"kompetensiDasar": string[], "tujuanPembelajaran": string[], ' +
      '"kegiatan": string[], "penilaian": string[], "sumberBelajar": string[]}. ' +
      'Tiap array isi butir-butir singkat siap pakai guru, bahasa Indonesia.',
    user: `Buatkan Modul Ajar Kurikulum Merdeka untuk mata pelajaran ${params.subject}, topik "${params.topic}", Fase ${params.phase}.`,
  }
}

export function examPrompt(params: {
  subject: string
  topic: string
  type: string
  questionCount: number
}): AiPrompt {
  return {
    system:
      'Kamu pembuat soal ujian SD Indonesia. Balas HANYA JSON valid tanpa teks lain, dengan struktur persis: ' +
      '{"questions": [{"question": string, "options": string[], "answer": string, "explanation": string}]}. ' +
      'options berisi 4 pilihan diawali "A. ", "B. ", "C. ", "D. ". answer isi huruf opsi benar saja (contoh "A").',
    user: `Buatkan ${params.questionCount} soal pilihan ganda mata pelajaran ${params.subject}, topik "${params.topic}", jenis ${params.type}.`,
  }
}

export function annualPlanPrompt(params: { subject: string }): AiPrompt {
  return {
    system:
      'Kamu asisten guru SD Indonesia ahli Kurikulum Merdeka. Balas HANYA JSON valid tanpa teks lain, ' +
      'dengan struktur persis: {"kompetensi": string[], "alokasiWaktu": string[], "kegiatan": string[], "minggu": string[]}.',
    user: `Buatkan Program Tahunan (Protah) Kurikulum Merdeka untuk mata pelajaran ${params.subject} selama satu tahun ajaran.`,
  }
}

export function semesterPlanPrompt(params: { subject: string }): AiPrompt {
  return {
    system:
      'Kamu asisten guru SD Indonesia ahli Kurikulum Merdeka. Balas HANYA JSON valid tanpa teks lain, ' +
      'dengan struktur persis: {"minggu": string[], "kegiatan": string[], "target": string[], "materi": string[]}.',
    user: `Buatkan Program Semester (Promes) Kurikulum Merdeka untuk mata pelajaran ${params.subject}.`,
  }
}

/** TK — RPPM: rencana mingguan, 3 elemen CP PAUD Kurikulum Merdeka. */
export function weeklyLessonPlanPrompt(params: { theme: string }): AiPrompt {
  return {
    system:
      'Kamu asisten guru TK/PAUD Indonesia ahli Kurikulum Merdeka Fase Fondasi. Balas HANYA JSON valid tanpa teks lain, ' +
      'dengan struktur persis: {"nilaiAgamaBudiPekerti": string[], "jatiDiri": string[], ' +
      '"literasiSainsTeknologi": string[], "rencanaKegiatan": string[]}. ' +
      'Ketiga elemen pertama adalah 3 elemen Capaian Pembelajaran Fase Fondasi PAUD — jangan pakai istilah K-13 lama (motorik/kognitif/bahasa).',
    user: `Buatkan RPPM (Rencana Pelaksanaan Pembelajaran Mingguan) untuk tema "${params.theme}".`,
  }
}

/** TK — RPPH: rencana harian, turunan RPPM. */
export function dailyLessonPlanPrompt(params: { theme: string; date: string }): AiPrompt {
  return {
    system:
      'Kamu asisten guru TK/PAUD Indonesia ahli Kurikulum Merdeka. Balas HANYA JSON valid tanpa teks lain, ' +
      'dengan struktur persis: {"kegiatanPembuka": string[], "kegiatanInti": string[], ' +
      '"kegiatanPenutup": string[], "alatBahan": string[], "rencanaAsesmen": string[]}.',
    user: `Buatkan RPPH (Rencana Pelaksanaan Pembelajaran Harian) untuk tema "${params.theme}" tanggal ${params.date}.`,
  }
}
