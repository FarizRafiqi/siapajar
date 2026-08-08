export interface PresetIndicator {
  description: string
  evidenceType: 'observasi' | 'catatan_anekdot' | 'hasil_karya' | 'foto_berseri'
  achievementCriteria: string
}

export interface PresetObjective {
  code: string
  title: string
  groupContext?: 'a' | 'b' | null
  indicators: PresetIndicator[]
}

export interface PresetCp {
  code: string
  element: string
  title: string
  description: string
  objectives: PresetObjective[]
}

export interface PresetSequence {
  title: string
  educationLevel: 'tk' | 'sd'
  groupContext?: 'a' | 'b' | null
  objectiveCodes: string[]
}

export const PAUD_CURRICULUM_PRESETS: { cps: PresetCp[]; sequence: PresetSequence } = {
  cps: [
    {
      code: 'CP-NABP',
      element: 'Nilai Agama dan Budi Pekerti',
      title: 'Mengenal & Mencintai Ciptaan Allah serta Pembiasaan Akhlak Mulia',
      description:
        'Anak mengenali dan mempraktikkan nilai ajaran agama dalam kehidupan sehari-hari, mencintai sesama makhluk ciptaan Allah, dan menunjukkan kasih sayang.',
      objectives: [
        {
          code: 'TP-NABP-01',
          title: 'Anak mengenal nama Allah dan menyebutkan ciptaan-Nya di alam sekitar.',
          groupContext: 'a',
          indicators: [
            {
              description:
                'Anak dapat menyebutkan minimal 3 ciptaan Allah (tumbuhan, hewan, manusia) saat diajak mengamati taman.',
              evidenceType: 'observasi',
              achievementCriteria: 'Anak menyebutkan ciptaan Allah dengan antusias tanpa ragu.',
            },
            {
              description:
                'Anak mengucapkan kalimat thoyyibah (Alhamdulillah/Subhanallah) saat melihat keindahan alam.',
              evidenceType: 'catatan_anekdot',
              achievementCriteria: 'Spontan mengucapkan rasa syukur saat kegiatan di luar kelas.',
            },
          ],
        },
        {
          code: 'TP-NABP-02',
          title: 'Anak terbiasa berdoa sebelum dan sesudah melakukan kegiatan harian.',
          groupContext: 'a',
          indicators: [
            {
              description:
                'Anak mengangkat kedua tangan dan mengucap doa makan & belajar bersama teman.',
              evidenceType: 'observasi',
              achievementCriteria: 'Mengikuti gerakan doa secara mandiri dengan sikap khusyuk.',
            },
          ],
        },
        {
          code: 'TP-NABP-03',
          title: 'Anak menunjukkan sikap kasih sayang dan mau berbagi dengan teman di kelas.',
          groupContext: 'b',
          indicators: [
            {
              description: 'Anak mau meminjamkan mainan atau merapikan balok bersama teman.',
              evidenceType: 'foto_berseri',
              achievementCriteria: 'Berbagi mainan secara sukarela tanpa perlu diminta guru.',
            },
          ],
        },
      ],
    },
    {
      code: 'CP-JD',
      element: 'Jati Diri',
      title: 'Mengenali Emosi, Kemandirian Motorik, dan Hidup Sehat',
      description:
        'Anak mengenali, mengekspresikan, dan mengelola emosi diri serta membangun hubungan sosial yang sehat, serta menjaga kebersihan dan kesehatan tubuh.',
      objectives: [
        {
          code: 'TP-JD-01',
          title:
            'Anak dapat mengenali emosi diri (senang, sedih, marah) dan menyampaikannya secara positif.',
          groupContext: 'a',
          indicators: [
            {
              description: 'Anak memilih kartu emosi yang sesuai dengan perasaannya di pagi hari.',
              evidenceType: 'hasil_karya',
              achievementCriteria: 'Dapat menunjuk ekspresi emosi yang dirasakan pada papan emosi.',
            },
          ],
        },
        {
          code: 'TP-JD-02',
          title: 'Anak mampu melakukan koordinasi motorik kasar (melompat, berlari, menyeimbang).',
          groupContext: 'b',
          indicators: [
            {
              description: 'Anak dapat melompati papan titian sepanjang 2 meter tanpa terjatuh.',
              evidenceType: 'observasi',
              achievementCriteria: 'Menjaga keseimbangan tubuh hingga garis akhir.',
            },
          ],
        },
      ],
    },
    {
      code: 'CP-STEAM',
      element: 'Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa & Seni',
      title: 'Eksplorasi Lingkungan, Keaksaraan Awal, dan Berpikir Kritis',
      description:
        'Anak memiliki rasa ingin tahu, berminat pada keaksaraan awal, mampu mengamati fenomena sekitar, serta mengekspresikan imajinasi melalui karya seni.',
      objectives: [
        {
          code: 'TP-STEAM-01',
          title:
            'Anak menunjukkan minat pada buku cerita dan dapat menceritakan kembali gambar yang dilihat.',
          groupContext: 'a',
          indicators: [
            {
              description:
                'Anak membuka-buka buku cerita dan menceritakan alur gambar dengan kalimat sederhana.',
              evidenceType: 'observasi',
              achievementCriteria: 'Fokus mendengarkan cerita dan dapat merespons pertanyaan guru.',
            },
          ],
        },
        {
          code: 'TP-STEAM-02',
          title:
            'Anak mampu mengenali pola, mengelompokkan benda berdasarkan warna/bentuk, dan membilang 1-10.',
          groupContext: 'b',
          indicators: [
            {
              description:
                'Anak mengelompokkan daun berdasarkan ukuran besar-kecil dari bahan loose parts.',
              evidenceType: 'hasil_karya',
              achievementCriteria: 'Dapat mengelompokkan minimal 5 benda sesuai kategorinya.',
            },
          ],
        },
      ],
    },
  ],
  sequence: {
    title: 'ATP PAUD Fase Fondasi Siap Pakai',
    educationLevel: 'tk',
    groupContext: 'a',
    objectiveCodes: [
      'TP-NABP-01',
      'TP-NABP-02',
      'TP-JD-01',
      'TP-STEAM-01',
      'TP-NABP-03',
      'TP-JD-02',
      'TP-STEAM-02',
    ],
  },
}
