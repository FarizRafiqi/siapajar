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
  examMode?: 'lisan' | 'tertulis_visual' | 'multiple_choice' | 'essay' | 'practical'
  isPaud?: boolean
  isRa?: boolean
}): AiPrompt {
  const subjectBoundary = /agama|pai|moral|akhlak|islam/i.test(params.subject)
    ? ' Fokus hanya pada Pendidikan Agama Islam, moral, akhlak, nabi, malaikat, doa, dan perilaku baik. DILARANG membuat soal matematika atau mata pelajaran lain.'
    : ` Fokus hanya pada mata pelajaran ${params.subject}. DILARANG mencampurkan materi matematika, agama, bahasa, atau mata pelajaran lain kecuali memang bagian dari mata pelajaran tersebut.`

  if (params.examMode === 'essay') {
    return {
      system:
        'Kamu pembuat soal uraian untuk pendidikan Indonesia. Balas HANYA JSON valid tanpa teks lain dengan struktur persis: ' +
        '{"questions": [{"question": string, "instruction": string, "answer": string, "explanation": string, "rubric": string}]}. ' +
        'Buat pertanyaan terbuka, ruang jawaban, kunci ideal, dan rubrik deskriptif yang dapat dinilai guru.',
      user: `Buatkan ${params.questionCount} soal uraian untuk mata pelajaran ${params.subject}, topik "${params.topic}", jenis ${params.type}.${subjectBoundary}`,
    }
  }

  if (params.examMode === 'practical') {
    return {
      system:
        'Kamu pembuat instrumen praktik/performa untuk pendidikan Indonesia. Balas HANYA JSON valid tanpa teks lain dengan struktur persis: ' +
        '{"questions": [{"question": string, "instruction": string, "answer": string, "rubric": string, "scoringGuide": string}]}. ' +
        'Setiap instrumen harus memiliki tindakan yang diamati, bukti performa, jawaban/hasil ideal, dan rubrik deskriptif.',
      user: `Buatkan ${params.questionCount} instrumen praktik untuk tema/topik "${params.topic}" (${params.subject}), jenis ${params.type}.${subjectBoundary}`,
    }
  }

  if ((params.isPaud || params.isRa) && params.examMode === 'multiple_choice') {
    return {
      system:
        'Kamu pembuat soal pilihan ganda RA/TK Indonesia untuk anak usia dini. ' +
        'Balas HANYA JSON valid tanpa teks lain dengan struktur: ' +
        '{"questions": [{"type": "multiple_choice", "sectionKey": "multiple_choice", "sectionTitle": "Pilihan Ganda", "question": string, "visualType": string, "instruction": string, "imagePrompt": string, "options": [{"label": string, "text": string, "imagePrompt": string}], "answer": string, "explanation": string, "rubric": string}]}. ' +
        'Semua butir WAJIB bertipe multiple_choice. Maksimal 5 butir. Opsi berjumlah 3 dan relevan dengan mata pelajaran. ' +
        'Jika pertanyaan membutuhkan gambar atau benda, setiap opsi wajib memiliki imagePrompt; jangan memakai teks generik seperti Pilihan A. ' +
        'Bahasa Indonesia, ramah anak, tanpa istilah Inggris, snake_case, emoji, atau materi lintas mata pelajaran.',
      user: `Buatkan maksimal ${params.questionCount} soal pilihan ganda untuk mata pelajaran ${params.subject}, topik "${params.topic}", jenis ${params.type}.${subjectBoundary}`,
    }
  }

  if (
    params.isPaud ||
    params.isRa ||
    params.examMode === 'lisan' ||
    params.examMode === 'tertulis_visual'
  ) {
    if (params.examMode === 'lisan') {
      return {
        system:
          'Kamu pembuat instrumen Ujian/Asesmen Lisan untuk anak RA (Raudhatul Athfal) / TK PAUD Kurikulum Merdeka. ' +
          'Balas HANYA JSON valid tanpa teks lain, dengan struktur persis: ' +
          '{"questions": [{"question": string, "instruction": string, "answer": string, "rubric": string}]}. ' +
          'Sertakan hafalan surah pendek, doa harian, hadits pilihan, atau pertanyaan lisan kontekstual anak.',
        user: `Buatkan ${params.questionCount} soal/instrumen lisan untuk tema/topik "${params.topic}" (${params.subject}).${subjectBoundary}`,
      }
    }
    return {
      system:
        'Kamu pembuat soal lembar kerja anak RA (Raudhatul Athfal) / TK B PAUD Kurikulum Merdeka. ' +
        'Balas HANYA JSON valid tanpa teks lain dengan format TOON/JSON ringkas: ' +
        '{"questions": [{"type": "multiple_choice"|"matching"|"visual"|"fill_blank_image"|"vertical_math"|"number_writing"|"count_and_circle"|"coloring"|"tracing", "sectionKey": string, "sectionTitle": string, "question": string, "visualType": string, "instruction": string, "imagePrompt": string, "traceText": string, "leftItems": [{"id": string, "label": string, "imagePrompt": string}], "rightItems": [{"id": string, "label": string}], "pairs": [{"leftId": string, "rightId": string}], "options": [{"label": string, "text": string, "imagePrompt": string}], "mathProblems": [{"topNumber": number, "bottomNumber": number, "operator": "+"|"-"}], "countItems": [{"count": number, "imagePrompt": string, "options": number[]}], "answer": string, "explanation": string, "rubric": string}]}. ' +
        'KOMPOSISI: susun bagian berurutan dengan sectionKey/sectionTitle. Bagian diberi huruf kapital A, B, C, dan seterusnya oleh aplikasi; jumlah bagian adaptif sesuai kapasitas satu lembar, bukan selalu tiga. ' +
        'Pola Kognitif: Tulis Angka Bilangan, Hitung Bersusun/Pengurangan, lalu Hitung dan Lingkari. Pola mapel bahasa/sains/agama dapat menggabungkan Pilihan Ganda, Isian, Hubungkan Garis, Terjemahan, atau Mewarnai sesuai materi; jangan memaksa aktivitas yang tidak relevan. ' +
        'Setiap jenis maksimal 5 butir. Jika gambar/aktivitas berat, kurangi butir atau bagian visual agar lembar tetap terbaca. ' +
        'ATURAN PILIHAN GANDA (multiple_choice): ' +
        '1. Untuk soal teks (seperti Agama, Malaikat, Nabi, Bahasa, Sains): options WAJIB berisi 3 jawaban teks relevan (contoh untuk "Nabi pertama": options=[{"label":"a","text":"Nabi Adam"},{"label":"b","text":"Nabi Nuh"},{"label":"c","text":"Nabi Muhammad"}]). DILARANG KERAS memberikan opsi angka "4" atau "..." jika soalnya tentang nama nabi/malaikat/agama! ' +
        '2. Hanya untuk soal hitung angka visual (seperti "Berapa jumlah 4 apel"): options boleh angka. ' +
        '3. PILIHAN GANDA BERGAMBAR: jika visualType menyebut gambar/ilustrasi/benda, setiap option WAJIB memiliki imagePrompt dan gambar; jangan mengisi opsi dengan teks generik seperti "Pilihan A". ' +
        'HITUNG DAN LINGKARI: buat 2-5 countItem dengan jumlah count berbeda; setiap item memiliki 3 atau 4 options angka, label subbutir a, b, c, dan seterusnya dibuat aplikasi. Setiap countItem WAJIB memiliki imagePrompt untuk objek yang benar-benar digambar dan diulang sesuai count; jangan memakai titik atau emoji sebagai pengganti gambar. ' +
        'HUBUNGKAN GARIS (matching): leftItems wajib berupa ilustrasi konsep dengan imagePrompt per item; rightItems wajib berupa teks saja tanpa imageUrl dan tanpa imagePrompt. Keduanya berisi pasangan tepat (seperti ilustrasi kapal <-> "Nabi Nuh"). DILARANG menempelkan ikon bintang pada teks. ' +
        'VISUALTYPE: selalu gunakan label jenis soal dalam bahasa Indonesia dengan Title Case. DILARANG mengirim label Inggris, snake_case, atau istilah seperti simple_islamic_symbol, matching_symbols, counting_objects, letter_tracing, dan coloring_page. ' +
        'MEWARNAI: Wajib sertakan imagePrompt untuk ilustrasi hitam-putih tanpa warna, termasuk MEWARNAI SESUAI BILANGAN. TRACING ANGKA/TEKS: Wajib sertakan traceText berupa angka atau kata yang dirender sebagai titik-titik. TRACING GAMBAR: Wajib sertakan imagePrompt untuk line-art putus-putus. Gambar tidak boleh berupa emoji.',
      user: `Buatkan maksimal ${params.questionCount} butir pada setiap bagian lembar kegiatan visual tertulis RA/TK untuk tema/topik "${params.topic}" (${params.subject}).${subjectBoundary}`,
    }
  }

  return {
    system:
      'Kamu pembuat soal pilihan ganda SD Indonesia. Balas HANYA JSON valid tanpa teks lain, dengan struktur persis: ' +
      '{"questions": [{"question": string, "options": string[], "answer": string, "explanation": string}]}. ' +
      'options berisi 4 pilihan diawali "A. ", "B. ", "C. ", "D. ". answer isi huruf opsi benar saja (contoh "A").',
    user: `Buatkan ${params.questionCount} soal pilihan ganda mata pelajaran ${params.subject}, topik "${params.topic}", jenis ${params.type}.${subjectBoundary}`,
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

/** TK / RA — RPM KBC (Rencana Pembelajaran Mendalam Kurikulum Berbasis Cinta) */
export function rpmKbcRaPrompt(params: {
  theme: string
  subtheme?: string
  semester?: number
  weekNumber?: number
  groupName?: string
  schoolName?: string
  teacherName?: string
  dplSuggestions?: string[]
  kbcSuggestions?: string[]
  loosePartsSuggestions?: string[]
  curriculumContext?: {
    cps?: Array<{ code: string; title: string; element?: string }>
    objectives?: Array<{ code: string; title: string }>
  }
}): AiPrompt {
  const subthemeText = params.subtheme ? ` Subtopik/Subtema: "${params.subtheme}".` : ''
  const semesterText = params.semester ? `Semester ${params.semester}` : 'Semester 1'
  const weekText = params.weekNumber ? `Pekan ke-${params.weekNumber}` : 'Pekan 1'
  const group = params.groupName || 'Kelompok B (5-6 Tahun)'
  const school = params.schoolName || 'RA / TK PAUD'
  const teacher = params.teacherName || 'Guru Kelas'

  const cpContextStr = params.curriculumContext?.cps?.length
    ? `\nData CP Acuan Guru:\n` +
      params.curriculumContext.cps
        .map((c) => `- [${c.code}] ${c.element || ''}: ${c.title}`)
        .join('\n')
    : ''

  const tpContextStr = params.curriculumContext?.objectives?.length
    ? `\nData TP Acuan Guru:\n` +
      params.curriculumContext.objectives.map((t) => `- [${t.code}] ${t.title}`).join('\n')
    : ''

  return {
    system:
      'Kamu adalah pakar kurikulum PAUD/RA (Raudhatul Athfal Kemenag) dan ahli Rencana Pembelajaran Mendalam (RPM) Kurikulum Berbasis Cinta (KBC) & Deep Learning. ' +
      'Tugasmu menyusun dokumen Modul Ajar Mingguan (RPM KBC RA) yang sangat komprehensif, operasional, islami, berbasis Loose Parts dan STEAM, ramah anak, dan terstruktur. ' +
      'Balas HANYA JSON valid tanpa teks lain, tanpa markdown wrapping selain format JSON murni dengan struktur persis:\n' +
      '{\n' +
      '  "theme": string,\n' +
      '  "subtheme": string,\n' +
      '  "semester": number,\n' +
      '  "weekNumber": number,\n' +
      '  "groupContext": string,\n' +
      '  "allocation": string,\n' +
      '  "identification": {\n' +
      '    "studentCharacteristics": string,\n' +
      '    "essentialMaterial": string,\n' +
      '    "appliedMaterial": string,\n' +
      '    "valueMaterial": string,\n' +
      '    "dpl": string[],\n' +
      '    "kbcValues": string[],\n' +
      '    "pancaCintaValues": string[]\n' +
      '  },\n' +
      '  "learningDesign": {\n' +
      '    "cpElements": string[],\n' +
      '    "crossDisciplinary": string,\n' +
      '    "learningObjectives": string[],\n' +
      '    "pedagogicalPractices": string,\n' +
      '    "partnerships": string,\n' +
      '    "learningEnvironment": string,\n' +
      '    "digitalUtilization": string\n' +
      '  },\n' +
      '  "learningExperience": {\n' +
      '    "openingActivities": string[],\n' +
      '    "openingQuestions": string[],\n' +
      '    "dailyCoreActivities": [\n' +
      '      {\n' +
      '        "day": "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat",\n' +
      '        "title": string,\n' +
      '        "stage": "MEMAHAMI (BERKESADARAN, BERMAKNA)" | "MENGAPLIKASIKAN (BERKESADARAN, BERMAKNA)" | "MEREFLEKSI (BERKESADARAN, BERMAKNA)",\n' +
      '        "dplFocus": string,\n' +
      '        "kbcFocus": string,\n' +
      '        "activities": string[],\n' +
      '        "activitiesDetail": [\n' +
      '          {\n' +
      '            "name": string,\n' +
      '            "focus": string,\n' +
      '            "materials": string,\n' +
      '            "instructions": string,\n' +
      '            "benefits": string\n' +
      '          }\n' +
      '        ],\n' +
      '        "mediaLooseParts": string\n' +
      '      }\n' +
      '    ],\n' +
      '    "closingActivities": string[]\n' +
      '  },\n' +
      '  "assessment": {\n' +
      '    "techniques": string[],\n' +
      '    "indicators": string[],\n' +
      '    "earlyAssessment": string[],\n' +
      '    "processAssessment": string[],\n' +
      '    "finalAssessment": string[]\n' +
      '  },\n' +
      '  "nilaiAgamaBudiPekerti": string[],\n' +
      '  "jatiDiri": string[],\n' +
      '  "literasiSainsTeknologi": string[],\n' +
      '  "rencanaKegiatan": string[]\n' +
      '}\n\n' +
      'Panduan Isi:\n' +
      '1. DPL (Dimensi Profil Lulusan): Pilih relevan dari DPL 1 (Keimanan), DPL 2 (Kewargaan), DPL 3 (Penalaran Kritis), DPL 4 (Kreativitas), DPL 5 (Kolaborasi), DPL 6 (Kemandirian), DPL 7 (Kesehatan), DPL 8 (Komunikasi).\n' +
      '2. Panca Cinta KBC: Pilih relevan dari Cinta Alloh & RosulNya, Cinta Diri & Sesama, Cinta Ilmu, Cinta Lingkungan, Cinta Tanah Air.\n' +
      '3. Inti Pembelajaran: Sediakan 5 hari (Senin s.d. Jumat) dengan masing-masing 3 kegiatan bermain bermakna dengan rincian nama kegiatan, fokus karakter, alat/bahan, cara bermain, dan manfaat.\n' +
      '4. Pastikan selaras dengan Capaian Pembelajaran Fase Fondasi (NABP, Jati Diri, Literasi-STEAM).',
    user:
      `Buatkan dokumen lengkap RPM KBC RA untuk:\n` +
      `- Guru: ${teacher}\n` +
      `- Satuan: ${school}\n` +
      `- Kelompok: ${group}\n` +
      `- Periode: ${semesterText}, ${weekText}\n` +
      `- Tema/Topik: "${params.theme}"\n` +
      `${subthemeText}${cpContextStr}${tpContextStr}`,
  }
}

/** TK — RPPM: rencana mingguan, 3 elemen CP PAUD Kurikulum Merdeka (Legacy Fallback). */
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

/** TK / RA — LKPD (Lembar Kerja Peserta Didik / Lembar Aktivitas Anak). */
export function lkpdPrompt(params: {
  theme: string
  subtheme?: string
  ageGroup?: string
  institutionType?: string
}): AiPrompt {
  const isRa = params.institutionType?.toUpperCase() === 'RA'
  const subthemeText = params.subtheme ? ` sub-tema "${params.subtheme}"` : ''
  const instName = isRa ? 'RA (Raudhatul Athfal Kemenag)' : 'TK/PAUD Kemendikdasmen'
  const islamInstruction = isRa ? 'Sertakan unsur pembiasaan Islam (Doa/Surah/Hadits).' : ''
  const groupName = params.ageGroup || 'Kelompok B'

  return {
    system:
      `Kamu asisten guru ${instName} ahli Kurikulum Merdeka Fase Fondasi. ` +
      'Balas HANYA JSON valid tanpa teks lain, dengan struktur persis: ' +
      '{"title": string, "tujuanPembelajaran": string[], "petunjukBelajar": string, "stimulusCerita": string, ' +
      '"aktivitasMotorik": string[], "aktivitasKognitifBahasa": string[], "aktivitasSeniMewarnai": string[], "refleksiEmosi": string[]}. ' +
      `${islamInstruction} ` +
      'Aktivitas disesuaikan ramah anak TK/RA (menebalkan, mencocokkan, melingkari, menggambar).',
    user: `Buatkan Lembar Kerja Peserta Didik (LKPD / Lembar Aktivitas Anak) untuk tema "${params.theme}"${subthemeText} untuk kelompok ${groupName}.`,
  }
}

/** TK / RA — Media Ajar & Outline Slide Visual + Loose Parts Guide. */
export function mediaModulePrompt(params: {
  theme: string
  subtheme?: string
  institutionType?: string
}): AiPrompt {
  const isRa = params.institutionType?.toUpperCase() === 'RA'
  const subthemeText = params.subtheme ? ` sub-tema "${params.subtheme}"` : ''
  const instName = isRa ? 'RA (Raudhatul Athfal)' : 'TK/PAUD'

  return {
    system:
      `Kamu pembuat Media Ajar visual (presentation-creator) anak ${instName} Kurikulum Merdeka. ` +
      'Gunakan kerangka GACTF (Goal, Audience, Content, Tone, Format). ' +
      'Balas HANYA JSON valid tanpa teks lain, dengan struktur persis: ' +
      '{"slides": [{"slideNumber": number, "slideType": "title"|"agenda"|"concept_story"|"loose_parts"|"summary", "title": string, "visualDescription": string, "imagePrompt": string, "teacherNotes": string, "keyQuestion": string}], ' +
      '"loosePartsGuide": {"materials": string[], "activities": string[], "safetyNotes": string}}. ' +
      'Buatkan 5 slide presentasi visual anak (Slide 1: Title, 2: Agenda, 3: Concept Story, 4: Loose Parts, 5: Summary). ' +
      'imagePrompt WAJIB berformat Nano Banana Line-Art: "Simple, cute, high-contrast black-and-white vector line art illustration for kids, [subject], transparent white background, no text, no watermark, no logo, clean lines".',
    user: `Buatkan outline Media Ajar visual dan panduan Loose Parts untuk tema "${params.theme}"${subthemeText}.`,
  }
}
