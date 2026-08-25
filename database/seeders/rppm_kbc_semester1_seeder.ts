import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CurriculumPreset from '#models/curriculum_preset'
import CurriculumCp from '#models/curriculum_cp'
import LearningObjective from '#models/learning_objective'
import LearningSequence from '#models/learning_sequence'
import IktpIndicator from '#models/iktp_indicator'
import TeachingModule from '#models/teaching_module'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import AcademicYear from '#models/academic_year'
import { DateTime } from 'luxon'

export const RPPM_KBC_SEMESTER_1 = [
  {
    weekNum: 1,
    filename: '37_TK_B_Smt1_01_Kenalkan.docx',
    title: 'DIRIKU: IDENTITAS',
    topic: 'DIRIKU',
    subtopic: 'IDENTITAS',
    modelPembelajaran: 'Kolaboratif, STEAM',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Juli 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: false,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: false,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: true,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: true,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: true,
      },
      {
        name: 'Personal',
        checked: true,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak kelompok B (5-6 tahun) memiliki kemampuan dasar mengenal identitas diri namun masih memerlukan bimbingan untuk mengekspresikan secara verbal dan menunjukkan kepercayaan diri. Mereka memiliki rasa ingin tahu tinggi tentang diri sendiri dan teman-temannya, serta mulai memahami perbedaan karakteristik fisik dan keluarga. Anak-anak pada usia ini senang berinteraksi sosial dan mampu mengikuti aturan sederhana dalam permainan kelompok.',
      learningMaterial:
        'Materi identitas diri mencakup pengetahuan esensial tentang nama lengkap, alamat, anggota keluarga, dan ciri-ciri fisik. Pengetahuan aplikatif meliputi kemampuan memperkenalkan diri, berinteraksi dengan teman, dan menunjukkan kemandirian. Pengetahuan nilai dan karakter berfokus pada rasa syukur atas keunikan diri, menghargai perbedaan, dan mengembangkan kepercayaan diri sebagai individu yang berharga.',
    },
    learningDesign: {
      cp: 'CP Jati Diri: Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budayaCP Jati Diri: Murid mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia',
      crossDisciplinary:
        'Nilai agama dan moral (pengenalan diri sebagai ciptaan Tuhan yang istimewa), sosial emosional (berinteraksi dan menghargai perbedaan dengan teman), fisik motorik (kegiatan koordinasi dan keterampilan halus), kognitif (mengenal konsep identitas dan keluarga), bahasa (komunikasi dan bercerita tentang diri), seni (membuat karya kreatif yang mengekspresikan identitas).',
      tp: 'Anak mampu mengenal dan memahami identitas dirinya serta berinteraksi dengan teman dan guru di sekolah. Anak dapat mengembangkan perilaku positif terhadap perannya, memahami aturan dan norma yang berlaku di lingkungannya, Anak mampu menyesuaikan diri dengan baik dengan lingkungannya',
      pedagogicalPractice:
        'Menggunakan pendekatan bermain sebagai cara alami anak belajar, bercerita untuk membangun pemahaman, bernyanyi untuk menciptakan suasana menyenangkan, dan eksplorasi langsung dimana anak dapat mengalami pembelajaran secara konkret sesuai tahap perkembangannya.',
      partnership:
        'Guru kelas, orang tua/keluarga anak, teman sebaya dalam kelompok bermain, dan komunitas sekolah untuk menciptakan lingkungan belajar yang mendukung pengembangan identitas diri anak.',
      environment:
        'Ruang kelas yang fleksibel dengan area bermain yang mendukung aktivitas individual dan kelompok, lingkungan outdoor untuk eksplorasi fisik, serta budaya belajar yang aman dan menyenangkan dimana setiap anak merasa dihargai dan bebas mengekspresikan diri.',
      digitalUtilization:
        'Perencanaan: Persiapan video cerita dan lagu digital, aplikasi dokumentasi pembelajaran Pelaksanaan: Video interaktif Ayo Berkenalan, musik latar untuk aktivitas, dokumentasi foto dan video proses belajar anak Asesmen: Portofolio digital karya anak, rekaman video presentasi sederhana anakDukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Renungan/nasehat/motivasi pagi yang bermakna',
      'Menyanyikan lagu 1234 Pergi Sekolah dengan gembira',
      'Asesmen awal melalui diskusi ide kegiatan hari ini',
      'Kegiatan pemantik berupa cerita/video Ayo Berkenalan',
      'Menyiapkan kesepakatan kelas dan aturan bermain',
    ],
    openingQuestions: [
      'Siapa yang bisa menceritakan nama lengkapnya dengan suara yang jelas? (Komunikasi),',
      'Apa yang membuat dirimu istimewa sebagai ciptaan Tuhan? (Keimanan dan Ketakwaan),',
      'Bagaimana cara kita menghargai teman yang berbeda dengan kita? (Kewargaan),',
      'Apa yang bisa kamu lakukan sendiri tanpa bantuan orang lain? (Kemandirian)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Kegiatan Melatih Koordinasi (Kesehatan). Alat dan bahan: Matras, ring, traffic cone. Cara Bermain: Siapkan matras di lantai kemudian letakkan du traffic cone di depannya, di sertai dengan ring. Kemudian mintalah anak untuk posisi telungkup dan memasukkan ring pada traffic cone menggunakan ke dua tangan secara bersamaan. Manfaat kegiatan ini untuk meningkatkan ketrampilan membaca, koordinasi bagian bawah dan atasKegiatan 2 : Nama Teman dari Kancing (Komunikasi). Alat dan bahan: Kancing warna-warni, karton, lem Cara bermain: Anak-anak duduk melingkar. Setiap anak mengambil kancing sesuai jumlah huruf dalam namanya. Secara bergantian, anak menempelkan kancing di karton membentuk namanya sambil memperkenalkan diri. Teman lain dapat membantu jika ada kesulitan. Kegiatan 3 : Membuat Bentuk Tubuh Teman (Kolaborasi, Kreativitas). Alat dan bahan: Berbagai jenis loose parts seperti lego, kayu, daun-daunan, batu, dll. Cara bermain: Anak-anak bekerja sama dalam kelompok kecil. Satu anak berbaring di lantai, sementara yang lain menggunakan loose parts untuk membuat pola mengikuti bentuk tubuh temannya. Kegiatan ini mengembangkan kreativitas, keterampilan sosial, dan pemahaman tentang bentuk tubuh manusia.',
        activities: [
          {
            activityNumber: 1,
            title: 'Kegiatan Melatih Koordinasi (Kesehatan)',
            toolsAndMaterials: 'Matras, ring, traffic cone',
            howToPlay:
              'Siapkan matras di lantai kemudian letakkan du traffic cone di depannya, di sertai dengan ring. Kemudian mintalah anak untuk posisi telungkup dan memasukkan ring pada traffic cone menggunakan ke dua tangan secara bersamaan. Manfaat kegiatan ini untuk meningkatkan ketrampilan membaca, koordinasi bagian bawah dan atas',
            fullDescription:
              'Kegiatan 1: Kegiatan Melatih Koordinasi (Kesehatan). Alat dan bahan: Matras, ring, traffic cone. Cara Bermain: Siapkan matras di lantai kemudian letakkan du traffic cone di depannya, di sertai dengan ring. Kemudian mintalah anak untuk posisi telungkup dan memasukkan ring pada traffic cone menggunakan ke dua tangan secara bersamaan. Manfaat kegiatan ini untuk meningkatkan ketrampilan membaca, koordinasi bagian bawah dan atas',
          },
          {
            activityNumber: 2,
            title: 'Nama Teman dari Kancing (Komunikasi)',
            toolsAndMaterials: 'Kancing warna-warni, karton, lem',
            howToPlay:
              'Anak-anak duduk melingkar. Setiap anak mengambil kancing sesuai jumlah huruf dalam namanya. Secara bergantian, anak menempelkan kancing di karton membentuk namanya sambil memperkenalkan diri. Teman lain dapat membantu jika ada kesulitan.',
            fullDescription:
              'Kegiatan 2: Nama Teman dari Kancing (Komunikasi). Alat dan bahan: Kancing warna-warni, karton, lem Cara bermain: Anak-anak duduk melingkar. Setiap anak mengambil kancing sesuai jumlah huruf dalam namanya. Secara bergantian, anak menempelkan kancing di karton membentuk namanya sambil memperkenalkan diri. Teman lain dapat membantu jika ada kesulitan.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Bentuk Tubuh Teman (Kolaborasi, Kreativitas)',
            toolsAndMaterials:
              'Berbagai jenis loose parts seperti lego, kayu, daun-daunan, batu, dll',
            howToPlay:
              'Anak-anak bekerja sama dalam kelompok kecil. Satu anak berbaring di lantai, sementara yang lain menggunakan loose parts untuk membuat pola mengikuti bentuk tubuh temannya. Kegiatan ini mengembangkan kreativitas, keterampilan sosial, dan pemahaman tentang bentuk tubuh manusia.',
            fullDescription:
              'Kegiatan 3: Membuat Bentuk Tubuh Teman (Kolaborasi, Kreativitas). Alat dan bahan: Berbagai jenis loose parts seperti lego, kayu, daun-daunan, batu, dll. Cara bermain: Anak-anak bekerja sama dalam kelompok kecil. Satu anak berbaring di lantai, sementara yang lain menggunakan loose parts untuk membuat pola mengikuti bentuk tubuh temannya. Kegiatan ini mengembangkan kreativitas, keterampilan sosial, dan pemahaman tentang bentuk tubuh manusia.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Membuat Boneka Jari Keluarga (Kemandirian). Alat dan bahan: Kertas karton, spidol, cat warna, gunting, stik es krim, pensil, krayon, lem. Cara Membuat: Siapkan kertas karton, kemudian mintalah anak-anak untuk meletakkan telapak tangan mereka di atas kertas karton kemudian jiplak menggunakan pensil sesuai ukuran tangan anak (mintalah anak-anak untuk bergantian dengan teman). Selanjutnya potong pola yang sudah di jiplak. Pada kertas karton lain mintalah anak-anak untuk menggambarkan anggota keluarga mereka, kemudian warnai dan gunting, sisihkan. Kertas karton yang berbentuk tangan juga di beri gambar sesuai kreativitas dan imajinasi anak. Jika sudah selesai rekatkan anggota keluarga yang sudah di buat pada jari-jari. Terakhir beri stik es krim untuk pegangan. Jika sudah jadi, bimbing anak-anak membuat cerita pendek menggunakan boneka jari mereka. Kegiatan 2 : Cermin Ajaib (Kreativitas, Keimanan dan Ketakwaan). Alat dan bahan: Cermin besar Cara bermain: Anak-anak bergantian berdiri di depan cermin. Mereka diminta untuk mengamati dan menyebutkan ciri-ciri fisik mereka, seperti warna kulit, bentuk rambut, atau warna mata. Teman-teman lain dapat membantu menambahkan informasi. Kegiatan 3 : Menyusun Menara Angka (Penalaran Kritis). Alat dan bahan: Balok kayu, tutup botol, kartu angka. Cara bermain: Anak-anak menyusun menara menggunakan balok kayu atau tutup botol sesuai dengan angka yang tertera pada kartu. Misalnya, jika kartu menunjukkan angka 5, anak harus menyusun 5 balok. Kegiatan ini membantu perkembangan numerasi dan keterampilan motorik halus.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Boneka Jari Keluarga (Kemandirian)',
            toolsAndMaterials:
              'Kertas karton, spidol, cat warna, gunting, stik es krim, pensil, krayon, lem',
            howToPlay:
              'Siapkan kertas karton, kemudian mintalah anak-anak untuk meletakkan telapak tangan mereka di atas kertas karton kemudian jiplak menggunakan pensil sesuai ukuran tangan anak (mintalah anak-anak untuk bergantian dengan teman). Selanjutnya potong pola yang sudah di jiplak. Pada kertas karton lain mintalah anak-anak untuk menggambarkan anggota keluarga mereka, kemudian warnai dan gunting, sisihkan. Kertas karton yang berbentuk tangan juga di beri gambar sesuai kreativitas dan imajinasi anak. Jika sudah selesai rekatkan anggota keluarga yang sudah di buat pada jari-jari. Terakhir beri stik es krim untuk pegangan. Jika sudah jadi, bimbing anak-anak membuat cerita pendek menggunakan boneka jari mereka.',
            fullDescription:
              'Kegiatan 1: Membuat Boneka Jari Keluarga (Kemandirian). Alat dan bahan: Kertas karton, spidol, cat warna, gunting, stik es krim, pensil, krayon, lem. Cara Membuat: Siapkan kertas karton, kemudian mintalah anak-anak untuk meletakkan telapak tangan mereka di atas kertas karton kemudian jiplak menggunakan pensil sesuai ukuran tangan anak (mintalah anak-anak untuk bergantian dengan teman). Selanjutnya potong pola yang sudah di jiplak. Pada kertas karton lain mintalah anak-anak untuk menggambarkan anggota keluarga mereka, kemudian warnai dan gunting, sisihkan. Kertas karton yang berbentuk tangan juga di beri gambar sesuai kreativitas dan imajinasi anak. Jika sudah selesai rekatkan anggota keluarga yang sudah di buat pada jari-jari. Terakhir beri stik es krim untuk pegangan. Jika sudah jadi, bimbing anak-anak membuat cerita pendek menggunakan boneka jari mereka.',
          },
          {
            activityNumber: 2,
            title: 'Cermin Ajaib (Kreativitas, Keimanan dan Ketakwaan)',
            toolsAndMaterials: 'Cermin besar',
            howToPlay:
              'Anak-anak bergantian berdiri di depan cermin. Mereka diminta untuk mengamati dan menyebutkan ciri-ciri fisik mereka, seperti warna kulit, bentuk rambut, atau warna mata. Teman-teman lain dapat membantu menambahkan informasi.',
            fullDescription:
              'Kegiatan 2: Cermin Ajaib (Kreativitas, Keimanan dan Ketakwaan). Alat dan bahan: Cermin besar Cara bermain: Anak-anak bergantian berdiri di depan cermin. Mereka diminta untuk mengamati dan menyebutkan ciri-ciri fisik mereka, seperti warna kulit, bentuk rambut, atau warna mata. Teman-teman lain dapat membantu menambahkan informasi.',
          },
          {
            activityNumber: 3,
            title: 'Menyusun Menara Angka (Penalaran Kritis)',
            toolsAndMaterials: 'Balok kayu, tutup botol, kartu angka',
            howToPlay:
              'Anak-anak menyusun menara menggunakan balok kayu atau tutup botol sesuai dengan angka yang tertera pada kartu. Misalnya, jika kartu menunjukkan angka 5, anak harus menyusun 5 balok. Kegiatan ini membantu perkembangan numerasi dan keterampilan motorik halus.',
            fullDescription:
              'Kegiatan 3: Menyusun Menara Angka (Penalaran Kritis). Alat dan bahan: Balok kayu, tutup botol, kartu angka. Cara bermain: Anak-anak menyusun menara menggunakan balok kayu atau tutup botol sesuai dengan angka yang tertera pada kartu. Misalnya, jika kartu menunjukkan angka 5, anak harus menyusun 5 balok. Kegiatan ini membantu perkembangan numerasi dan keterampilan motorik halus.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : STEAM Membuat Gitar Dari Daur Ulang (Kreativitas). Alat dan bahan: Kotak Sepatu, 3 karet gelang, 2 pensil, Cara Membuat: Potong lingkaran dari atas kotak sepatu. Regangkan karet gelang dan letakkan di sekitar kotak memanjang, diposisikan di atas lubang. Masukkan pensil secara horizontal di bawah karet gelang, satu di setiap sisi lingkaran. Cabut karet gelang untuk membuat musik. Kegiatan 2 : Kolase Wajah Teman (Kewargaan). Alat dan bahan: Kertas, lem, biji-bijian, kerikil, daun kering Cara bermain: Anak-anak berpasangan. Mereka membuat kolase wajah teman mereka menggunakan bahan alam. Setelah selesai, mereka memperkenalkan teman mereka kepada kelompok menggunakan kolase yang dibuat. Kegiatan 3 : Tebak Suara Teman (Komunikasi). Alat dan bahan: Kain penutup mata, benda-benda yang dapat mengeluarkan suara (kerikil dalam botol, sendok dan panci, dll) Cara bermain: Satu anak ditutup matanya. Anak lain membuat suara menggunakan benda-benda yang tersedia. Anak yang ditutup matanya harus menebak siapa yang membuat suara. Jika berhasil, anak yang suaranya ditebak gantian ditutup matanya.',
        activities: [
          {
            activityNumber: 1,
            title: 'STEAM Membuat Gitar Dari Daur Ulang (Kreativitas)',
            toolsAndMaterials: 'Kotak Sepatu, 3 karet gelang, 2 pensil',
            howToPlay:
              'Potong lingkaran dari atas kotak sepatu. Regangkan karet gelang dan letakkan di sekitar kotak memanjang, diposisikan di atas lubang. Masukkan pensil secara horizontal di bawah karet gelang, satu di setiap sisi lingkaran. Cabut karet gelang untuk membuat musik.',
            fullDescription:
              'Kegiatan 1: STEAM Membuat Gitar Dari Daur Ulang (Kreativitas). Alat dan bahan: Kotak Sepatu, 3 karet gelang, 2 pensil, Cara Membuat: Potong lingkaran dari atas kotak sepatu. Regangkan karet gelang dan letakkan di sekitar kotak memanjang, diposisikan di atas lubang. Masukkan pensil secara horizontal di bawah karet gelang, satu di setiap sisi lingkaran. Cabut karet gelang untuk membuat musik.',
          },
          {
            activityNumber: 2,
            title: 'Kolase Wajah Teman (Kewargaan)',
            toolsAndMaterials: 'Kertas, lem, biji-bijian, kerikil, daun kering',
            howToPlay:
              'Anak-anak berpasangan. Mereka membuat kolase wajah teman mereka menggunakan bahan alam. Setelah selesai, mereka memperkenalkan teman mereka kepada kelompok menggunakan kolase yang dibuat.',
            fullDescription:
              'Kegiatan 2: Kolase Wajah Teman (Kewargaan). Alat dan bahan: Kertas, lem, biji-bijian, kerikil, daun kering Cara bermain: Anak-anak berpasangan. Mereka membuat kolase wajah teman mereka menggunakan bahan alam. Setelah selesai, mereka memperkenalkan teman mereka kepada kelompok menggunakan kolase yang dibuat.',
          },
          {
            activityNumber: 3,
            title: 'Tebak Suara Teman (Komunikasi)',
            toolsAndMaterials:
              'Kain penutup mata, benda-benda yang dapat mengeluarkan suara (kerikil dalam botol, sendok dan panci, dll)',
            howToPlay:
              'Satu anak ditutup matanya. Anak lain membuat suara menggunakan benda-benda yang tersedia. Anak yang ditutup matanya harus menebak siapa yang membuat suara. Jika berhasil, anak yang suaranya ditebak gantian ditutup matanya.',
            fullDescription:
              'Kegiatan 3: Tebak Suara Teman (Komunikasi). Alat dan bahan: Kain penutup mata, benda-benda yang dapat mengeluarkan suara (kerikil dalam botol, sendok dan panci, dll) Cara bermain: Satu anak ditutup matanya. Anak lain membuat suara menggunakan benda-benda yang tersedia. Anak yang ditutup matanya harus menebak siapa yang membuat suara. Jika berhasil, anak yang suaranya ditebak gantian ditutup matanya.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Eksperimen Ilmu Penyerapan Air (Penalaran Kritis). Alat dan bahan, kertas, serbet, tisu, kaus kaki, busa, kain, spons, spidol atau pena, wadah, air. Cara Membuat: Siapkan wadah, kemudian isi dengan air. Siapkan gelas atau awad lalu beri label. Masukkan secara bergantian, bisa mulai dari kaus kaki, serbet, busa, kain dam lainnya ke dalam wadah berisi air, hingga benar-benar terrendam sempurna. Selanjutnya angkat dan peras ke dalam wadah yang sudah di beri label. Terakhir periksalah gelas atau wadah tampung, mana yang paling banyak menyerap air dapat di diskusikan dengan anak-anak. Kegiatan 2 : Lempar Bola Pertanyaan (Komunikasi). Alat dan bahan: Bola kecil, daftar pertanyaan sederhana Cara bermain: Anak-anak berdiri melingkar. Guru melempar bola ke salah satu anak sambil mengajukan pertanyaan sederhana seperti Apa warna kesukaanmu?. Anak yang menangkap bola harus menjawab, lalu melempar bola ke anak lain sambil mengajukan pertanyaan baru. Kegiatan 3 : Cerita Berantai (Kreativitas, Kolaborasi). Alat dan bahan: Tidak ada Cara bermain: Anak-anak duduk melingkar. Guru memulai cerita dengan satu kalimat, misalnya Pada suatu hari, ada seekor kucing.... Anak pertama melanjutkan cerita dengan satu kalimat, dilanjutkan anak berikutnya. Cerita berlanjut hingga semua anak mendapat giliran.',
        activities: [
          {
            activityNumber: 1,
            title: 'Eksperimen Ilmu Penyerapan Air (Penalaran Kritis)',
            toolsAndMaterials:
              'kertas, serbet, tisu, kaus kaki, busa, kain, spons, spidol atau pena, wadah, air',
            howToPlay:
              'Siapkan wadah, kemudian isi dengan air. Siapkan gelas atau awad lalu beri label. Masukkan secara bergantian, bisa mulai dari kaus kaki, serbet, busa, kain dam lainnya ke dalam wadah berisi air, hingga benar-benar terrendam sempurna. Selanjutnya angkat dan peras ke dalam wadah yang sudah di beri label. Terakhir periksalah gelas atau wadah tampung, mana yang paling banyak menyerap air dapat di diskusikan dengan anak-anak.',
            fullDescription:
              'Kegiatan 1: Eksperimen Ilmu Penyerapan Air (Penalaran Kritis). Alat dan bahan, kertas, serbet, tisu, kaus kaki, busa, kain, spons, spidol atau pena, wadah, air. Cara Membuat: Siapkan wadah, kemudian isi dengan air. Siapkan gelas atau awad lalu beri label. Masukkan secara bergantian, bisa mulai dari kaus kaki, serbet, busa, kain dam lainnya ke dalam wadah berisi air, hingga benar-benar terrendam sempurna. Selanjutnya angkat dan peras ke dalam wadah yang sudah di beri label. Terakhir periksalah gelas atau wadah tampung, mana yang paling banyak menyerap air dapat di diskusikan dengan anak-anak.',
          },
          {
            activityNumber: 2,
            title: 'Lempar Bola Pertanyaan (Komunikasi)',
            toolsAndMaterials: 'Bola kecil, daftar pertanyaan sederhana',
            howToPlay:
              'Anak-anak berdiri melingkar. Guru melempar bola ke salah satu anak sambil mengajukan pertanyaan sederhana seperti Apa warna kesukaanmu?. Anak yang menangkap bola harus menjawab, lalu melempar bola ke anak lain sambil mengajukan pertanyaan baru.',
            fullDescription:
              'Kegiatan 2: Lempar Bola Pertanyaan (Komunikasi). Alat dan bahan: Bola kecil, daftar pertanyaan sederhana Cara bermain: Anak-anak berdiri melingkar. Guru melempar bola ke salah satu anak sambil mengajukan pertanyaan sederhana seperti Apa warna kesukaanmu?. Anak yang menangkap bola harus menjawab, lalu melempar bola ke anak lain sambil mengajukan pertanyaan baru.',
          },
          {
            activityNumber: 3,
            title: 'Cerita Berantai (Kreativitas, Kolaborasi)',
            toolsAndMaterials: 'Tidak ada',
            howToPlay:
              'Anak-anak duduk melingkar. Guru memulai cerita dengan satu kalimat, misalnya Pada suatu hari, ada seekor kucing.... Anak pertama melanjutkan cerita dengan satu kalimat, dilanjutkan anak berikutnya. Cerita berlanjut hingga semua anak mendapat giliran.',
            fullDescription:
              'Kegiatan 3: Cerita Berantai (Kreativitas, Kolaborasi). Alat dan bahan: Tidak ada Cara bermain: Anak-anak duduk melingkar. Guru memulai cerita dengan satu kalimat, misalnya Pada suatu hari, ada seekor kucing.... Anak pertama melanjutkan cerita dengan satu kalimat, dilanjutkan anak berikutnya. Cerita berlanjut hingga semua anak mendapat giliran.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Tracing Sesuai Angka (Kemandirian). Alat dan bahan: kardus bekas, tutup botol, lem, gunting, tali Sepatu/benang. Cara membuat: Siapkan kardus bekas, kemudian potong membentuk persegi. Selanjutnya, rekatkan tutup botol di atasnya dengan lem, lalu beri angka. Tuliskan angka di atasnya, kemudian mintalah anak untuk tracing menggunakan benang sesuai angka yang di perintahkan. Kegiatan 2 :Kolase Diriku (Kreativitas, Keimanan dan Ketakwaan). Alat dan bahan: Kertas gambar, foto anak-anak, berbagai bahan kolase (kain perca, kertas warna, daun kering, dll), lem Cara bermain: Setiap anak diberikan kertas gambar dengan foto diri mereka di tengah. Mereka diminta untuk menghias sekeliling foto dengan bahan kolase, membentuk hal-hal yang menggambarkan identitas mereka (misalnya, bunga untuk anak yang suka berkebun, bola untuk yang suka olahraga). Kegiatan 3 : Tebak Suara Teman (Komunikasi). Alat dan bahan: Penutup mata Cara bermain: Satu anak ditutup matanya. Anak-anak lain bergantian mengucapkan Halo, siapa aku? Anak yang matanya ditutup harus menebak siapa yang berbicara. Jika berhasil menebak, anak yang suaranya ditebak gantian ditutup matanya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Tracing Sesuai Angka (Kemandirian)',
            toolsAndMaterials: 'kardus bekas, tutup botol, lem, gunting, tali Sepatu/benang',
            howToPlay:
              'Siapkan kardus bekas, kemudian potong membentuk persegi. Selanjutnya, rekatkan tutup botol di atasnya dengan lem, lalu beri angka. Tuliskan angka di atasnya, kemudian mintalah anak untuk tracing menggunakan benang sesuai angka yang di perintahkan.',
            fullDescription:
              'Kegiatan 1: Tracing Sesuai Angka (Kemandirian). Alat dan bahan: kardus bekas, tutup botol, lem, gunting, tali Sepatu/benang. Cara membuat: Siapkan kardus bekas, kemudian potong membentuk persegi. Selanjutnya, rekatkan tutup botol di atasnya dengan lem, lalu beri angka. Tuliskan angka di atasnya, kemudian mintalah anak untuk tracing menggunakan benang sesuai angka yang di perintahkan.',
          },
          {
            activityNumber: 2,
            title: 'Kolase Diriku (Kreativitas, Keimanan dan Ketakwaan)',
            toolsAndMaterials:
              'Kertas gambar, foto anak-anak, berbagai bahan kolase (kain perca, kertas warna, daun kering, dll), lem',
            howToPlay:
              'Setiap anak diberikan kertas gambar dengan foto diri mereka di tengah. Mereka diminta untuk menghias sekeliling foto dengan bahan kolase, membentuk hal-hal yang menggambarkan identitas mereka (misalnya, bunga untuk anak yang suka berkebun, bola untuk yang suka olahraga).',
            fullDescription:
              'Kegiatan 2: Kolase Diriku (Kreativitas, Keimanan dan Ketakwaan). Alat dan bahan: Kertas gambar, foto anak-anak, berbagai bahan kolase (kain perca, kertas warna, daun kering, dll), lem Cara bermain: Setiap anak diberikan kertas gambar dengan foto diri mereka di tengah. Mereka diminta untuk menghias sekeliling foto dengan bahan kolase, membentuk hal-hal yang menggambarkan identitas mereka (misalnya, bunga untuk anak yang suka berkebun, bola untuk yang suka olahraga).',
          },
          {
            activityNumber: 3,
            title: 'Tebak Suara Teman (Komunikasi)',
            toolsAndMaterials: 'Penutup mata',
            howToPlay:
              'Satu anak ditutup matanya. Anak-anak lain bergantian mengucapkan Halo, siapa aku? Anak yang matanya ditutup harus menebak siapa yang berbicara. Jika berhasil menebak, anak yang suaranya ditebak gantian ditutup matanya.',
            fullDescription:
              'Kegiatan 3: Tebak Suara Teman (Komunikasi). Alat dan bahan: Penutup mata Cara bermain: Satu anak ditutup matanya. Anak-anak lain bergantian mengucapkan Halo, siapa aku? Anak yang matanya ditutup harus menebak siapa yang berbicara. Jika berhasil menebak, anak yang suaranya ditebak gantian ditutup matanya.',
          },
        ],
      },
    ],
    closingActivities: [
      'Recalling kegiatan hari ini dengan bertanya Apa yang paling menyenangkan hari ini?',
      'Pameran mini hasil karya dimana setiap anak memamerkan karyanya dengan bangga',
      'Tepuk tangan apresiasi bersama untuk semua pencapaian anak hari ini',
      'Bernyanyi lagu penutup yang ceria tentang kebanggaan diri',
      'Yel-yel semangat untuk kegiatan esok hari',
      'Doa penutup dengan penuh syukur dan persiapan pulang yang gembira',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan nama lengkap dan alamat rumahnya dengan jelas saat ditanya dengan lembut',
      },
      {
        no: 2,
        indicator:
          'Anak mampu menggambar diri dan keluarganya secara bebas tanpa bantuan berlebihan',
      },
      {
        no: 3,
        indicator: 'Anak menunjukkan kepercayaan diri saat memperkenalkan diri kepada teman baru',
      },
      {
        no: 4,
        indicator:
          'Anak mengucapkan kata-kata sopan (terima kasih, maaf, permisi) secara spontan selama bermain',
      },
      {
        no: 5,
        indicator:
          'Anak dapat menyelesaikan tugas mandiri seperti merapikan mainan tanpa diingatkan berulang',
      },
      {
        no: 6,
        indicator:
          'Anak menunjukkan keterampilan motorik halus yang baik dalam kegiatan membuat karya (menggunting, menempel, mewarnai)',
      },
      {
        no: 7,
        indicator: 'Anak mampu bekerjasama dengan teman dalam kegiatan kelompok dan berbagi peran',
      },
      {
        no: 8,
        indicator:
          'Anak menghargai perbedaan karakteristik teman (warna kulit, bentuk rambut) dengan sikap positif',
      },
      {
        no: 9,
        indicator:
          'Anak dapat bercerita atau bernyanyi dengan komunikasi yang jelas dan percaya diri',
      },
      {
        no: 10,
        indicator:
          'Anak mampu mempresentasikan hasil karyanya di depan teman-teman dengan antusias',
      },
      {
        no: 11,
        indicator:
          'Anak dapat merefleksi pengalaman belajarnya dengan menjawab pertanyaan sederhana tentang dirinya',
      },
      {
        no: 12,
        indicator:
          'Anak menunjukkan peningkatan kemandirian dan kepercayaan diri dari awal hingga akhir pembelajaran',
      },
    ],
    assessmentSteps: {
      initial: [
        'Ajak anak bercerita tentang dirinya sambil bermain boneka atau foto keluarga',
        'Minta anak menggambar dirinya dan keluarganya secara bebas tanpa tekanan',
        'Observasi bagaimana anak memperkenalkan diri kepada teman baru di awal kegiatan',
        'Catat kemampuan anak menyebutkan nama, alamat, dan anggota keluarga saat ditanya dengan lembut',
        'Amati tingkat kepercayaan diri anak saat berbicara di depan kelompok kecil',
      ],
      process: [
        'Foto dan video anak saat bermain untuk melihat interaksi sosial dan keterampilan motorik',
        'Buat catatan singkat tentang kata-kata sopan yang diucapkan anak secara spontan',
        'Dokumentasikan cara anak menyelesaikan tugas mandiri seperti merapikan mainan',
        'Rekam suara anak saat bercerita atau bernyanyi untuk menilai kemampuan komunikasi',
        'Amati bagaimana anak bekerjasama dalam kegiatan kelompok dan menghargai perbedaan teman',
      ],
      final: [
        'Minta anak mempresentasikan hasil karyanya dengan cara yang menyenangkan',
        'Ajak anak merefleksi dengan pertanyaan Apa yang kamu pelajari tentang dirimu hari ini?',
        'Observasi perubahan sikap anak dari awal hingga akhir pembelajaran',
        'Dokumentasikan kemampuan anak mengekspresikan perasaan dan pengalaman belajarnya',
        'Catat perkembangan kemandirian dan kepercayaan diri anak melalui aktivitas sehari-hari',
      ],
    },
  },
  {
    weekNum: 2,
    filename: '38_TK_B_Smt1_02_Indonesiaku.docx',
    title: 'AKU CINTA INDONESIA: NEGERI SERIBU PULAU',
    topic: 'TANAH AIR',
    subtopic: 'INDONESIA',
    modelPembelajaran: 'Inkuiri',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Agustus 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: true,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun memiliki rasa ingin tahu yang tinggi terhadap lingkungan sekitar dan mulai memahami konsep identitas diri dalam konteks yang lebih luas. Mereka mampu mengekspresikan perasaan melalui berbagai cara, senang melakukan aktivitas fisik, dan mulai memahami aturan sederhana. Anak-anak pada usia ini juga mulai menunjukkan kemandirian dalam aktivitas sehari-hari dan memiliki kemampuan berinteraksi sosial dengan teman sebaya. Mereka memiliki kemampuan motorik halus dan kasar yang berkembang pesat, serta mulai memahami konsep dasar tentang keberagaman.',
      learningMaterial:
        'Materi pembelajaran berfokus pada pengenalan identitas Indonesia melalui simbol-simbol negara, keberagaman budaya, dan nilai-nilai Pancasila yang disajikan secara konkret dan menyenangkan. Materi mencakup pengetahuan esensial tentang burung Garuda, bendera merah putih, dan lagu Indonesia Raya sebagai simbol negara. Pengetahuan aplikatif diwujudkan melalui kegiatan membuat karya seni, permainan tradisional, dan eksplorasi keberagaman budaya Indonesia. Materi juga mengintegrasikan nilai-nilai karakter seperti cinta tanah air, menghargai perbedaan, dan rasa bangga menjadi bagian dari Indonesia.',
    },
    learningDesign: {
      cp: 'CP Jati Diri: Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budayaCP Jati Diri: Murid mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia',
      crossDisciplinary:
        'Nilai agama dan moral (menghargai ciptaan Tuhan melalui keberagaman Indonesia), Nilai Pancasila (mengembangkan sikap cinta tanah air dan menghargai keberagaman), Fisik motorik (mengembangkan koordinasi melalui tarian daerah dan pembuatan karya seni), Kognitif (mengenal simbol-simbol negara dan memahami konsep keberagaman), Bahasa (mengekspresikan perasaan tentang Indonesia dan bercerita tentang pengalaman), Sosial emosional (mengembangkan empati dan sikap inklusif terhadap perbedaan budaya).',
      tp: 'Anak dapat menjelaskan dan menghargai aspek-aspek yang membentuk identitas diri mereka, termasuk minat, kebutuhan, karakteristik gender, agama, dan latar belakang sosial budaya, Anak dapat mengaitkannya dengan keberagaman yang ada di Indonesia. Anak dapat mengenal dan menjelaskan minimal 3 simbol terkait negara Indonesia serta menunjukkan sikap menghargai keberagaman budaya Indonesia.',
      pedagogicalPractice:
        'Pembelajaran dilaksanakan melalui pendekatan bermain yang mengintegrasikan eksplorasi, kreativitas, dan interaksi sosial. Metode bercerita digunakan untuk membangun pemahaman anak tentang keberagaman Indonesia melalui narasi yang menarik dan relatable. Pendekatan bernyanyi membantu anak mengingat informasi penting sambil mengembangkan keterampilan bahasa dan ritme. Eksplorasi langsung melalui permainan dan pembuatan karya seni memberikan pengalaman konkret yang mendukung pemahaman mendalam. Metode-metode ini dipilih karena sesuai dengan cara belajar alami anak usia dini yang learn by doing, serta mendukung prinsip pembelajaran yang berkesadaran melalui keterlibatan aktif, bermakna melalui koneksi dengan kehidupan nyata, dan menggembirakan melalui aktivitas yang menyenangkan.',
      partnership:
        'Melibatkan orang tua dalam berbagi cerita tentang asal daerah keluarga dan tradisi yang dimiliki. Bekerjasama dengan komunitas lokal atau sanggar seni untuk mengenalkan tarian atau musik tradisional. Mengundang narasumber dari berbagai latar belakang budaya untuk berbagi pengalaman. Kolaborasi dengan perpustakaan daerah untuk akses buku-buku tentang Indonesia dan mendukung literasi anak tentang keberagaman budaya Indonesia.',
      environment:
        'Ruang fisik dikonfigurasi dengan area bermain yang fleksibel, pojok baca dengan buku-buku tentang Indonesia, dan area display untuk memamerkan karya anak. Ruang virtual memanfaatkan platform digital untuk menampilkan video dan gambar tentang keberagaman Indonesia. Budaya belajar diciptakan melalui atmosfer yang menghargai setiap kontribusi anak, mendorong eksplorasi bebas, dan memfasilitasi diskusi terbuka tentang perbedaan dengan cara yang positif dan inklusif.',
      digitalUtilization:
        'Penggunaan video edukasi tentang Indonesia, media pembelajaran interaktif, dokumentasi digital hasil karya anak, dan platform pembelajaran yang sesuai usia. Teknologi digunakan sebagai pendukung eksplorasi dan tidak menggantikan pengalaman bermain langsung. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Memulai hari dengan penuh semangat dan kegembiraan! Guru menyambut anak-anak dengan hangat untuk mempersiapkan petualangan seru mengenal Indonesia yang indah.',
      'Kegiatan Pembuka:',
      'Salam dan doa pembuka untuk menciptakan suasana spiritual yang positif',
      'Menyanyikan lagu 1234 Pergi Sekolah untuk membangun semangat belajar',
      'Kegiatan pemantik berupa buku cerita/video Aku Cinta Indonesia',
      'Asesmen awal melalui diskusi ide-ide kegiatan dan review pengalaman sebelumnya',
      'Menyiapkan aturan bermain dan kesepakatan kelas untuk pembelajaran yang kondusif',
      'Ceritakan tentang makanan daerah favorit kalian! (Komunikasi)',
    ],
    openingQuestions: [
      'Apa yang membuat Indonesia istimewa menurut kalian? (Kewargaan),',
      'Bagaimana perasaan kalian melihat keindahan alam Indonesia? (Keimanan dan Ketakwaan),',
      'Apa yang bisa kita lakukan untuk menjaga Indonesia? (Kemandirian),',
      'Mengapa kita harus menghargai teman yang berbeda suku? (Kolaborasi),',
      'Bagaimana cara kita menunjukkan cinta kepada Indonesia? (Kreativitas),',
      'Apa yang kalian ketahui tentang simbol-simbol negara? (Penalaran Kritis),',
      'Bagaimana kita bisa hidup sehat seperti pahlawan Indonesia? (Kesehatan),',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Lukisan Burung Garuda dengan Teknik Percikan (Kreativitas, Kemandirian). Alat dan bahan: Mangkuk, Pewarna makanan merah (sesuai keinginan), Sikat gigi, Sisir, Air, Kertas HVS, Guntintg, Printable gambar burung garuda, Cara Membuat: Siapkan printable burung garuda, lalu gunting. Letakkan burung garuda di ats kertas HVS. Campurkan pewarna makanan dan iar ke dalam satu mangkuk yang sama, aduk-aduk menggunakan sikat gigi, lalu percikan di atas gambar burung garuda menggunakan sisir. Kegiatan 2 : Peta Indonesia dari Biji-bijian (Penalaran Kritis, Komunikasi). Alat dan bahan: Kertas karton besar, berbagai jenis biji-bijian (beras, kacang hijau, jagung, dll), lem. Cara bermain: Gambar peta Indonesia di kertas karton. Anak-anak diminta untuk menempelkan biji-bijian berbeda untuk setiap pulau besar di Indonesia. Sambil bermain, diskusikan nama-nama pulau dan keunikan masing-masing daerah. Kegiatan 3 : Garuda Pancasila (Kewargaan, Kolaborasi). dari Bahan Alam Alat dan bahan: Ranting, daun kering, batu kecil, biji-bijian, lem, kertas karton. Cara bermain: Buat sketsa Garuda Pancasila di kertas karton. Anak-anak diminta untuk mengisi sketsa tersebut dengan bahan-bahan alam yang tersedia. Jelaskan makna Garuda Pancasila sebagai lambang negara.',
        activities: [
          {
            activityNumber: 1,
            title:
              'Membuat Lukisan Burung Garuda dengan Teknik Percikan (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Mangkuk, Pewarna makanan merah (sesuai keinginan), Sikat gigi, Sisir, Air, Kertas HVS, Guntintg, Printable gambar burung garuda',
            howToPlay:
              'Siapkan printable burung garuda, lalu gunting. Letakkan burung garuda di ats kertas HVS. Campurkan pewarna makanan dan iar ke dalam satu mangkuk yang sama, aduk-aduk menggunakan sikat gigi, lalu percikan di atas gambar burung garuda menggunakan sisir.',
            fullDescription:
              'Kegiatan 1: Membuat Lukisan Burung Garuda dengan Teknik Percikan (Kreativitas, Kemandirian). Alat dan bahan: Mangkuk, Pewarna makanan merah (sesuai keinginan), Sikat gigi, Sisir, Air, Kertas HVS, Guntintg, Printable gambar burung garuda, Cara Membuat: Siapkan printable burung garuda, lalu gunting. Letakkan burung garuda di ats kertas HVS. Campurkan pewarna makanan dan iar ke dalam satu mangkuk yang sama, aduk-aduk menggunakan sikat gigi, lalu percikan di atas gambar burung garuda menggunakan sisir.',
          },
          {
            activityNumber: 2,
            title: 'Peta Indonesia dari Biji-bijian (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials:
              'Kertas karton besar, berbagai jenis biji-bijian (beras, kacang hijau, jagung, dll), lem',
            howToPlay:
              'Gambar peta Indonesia di kertas karton. Anak-anak diminta untuk menempelkan biji-bijian berbeda untuk setiap pulau besar di Indonesia. Sambil bermain, diskusikan nama-nama pulau dan keunikan masing-masing daerah.',
            fullDescription:
              'Kegiatan 2: Peta Indonesia dari Biji-bijian (Penalaran Kritis, Komunikasi). Alat dan bahan: Kertas karton besar, berbagai jenis biji-bijian (beras, kacang hijau, jagung, dll), lem. Cara bermain: Gambar peta Indonesia di kertas karton. Anak-anak diminta untuk menempelkan biji-bijian berbeda untuk setiap pulau besar di Indonesia. Sambil bermain, diskusikan nama-nama pulau dan keunikan masing-masing daerah.',
          },
          {
            activityNumber: 3,
            title: 'Garuda Pancasila (Kewargaan, Kolaborasi). dari Bahan Alam',
            toolsAndMaterials: 'Ranting, daun kering, batu kecil, biji-bijian, lem, kertas karton',
            howToPlay:
              'Buat sketsa Garuda Pancasila di kertas karton. Anak-anak diminta untuk mengisi sketsa tersebut dengan bahan-bahan alam yang tersedia. Jelaskan makna Garuda Pancasila sebagai lambang negara.',
            fullDescription:
              'Kegiatan 3: Garuda Pancasila (Kewargaan, Kolaborasi). dari Bahan Alam Alat dan bahan: Ranting, daun kering, batu kecil, biji-bijian, lem, kertas karton. Cara bermain: Buat sketsa Garuda Pancasila di kertas karton. Anak-anak diminta untuk mengisi sketsa tersebut dengan bahan-bahan alam yang tersedia. Jelaskan makna Garuda Pancasila sebagai lambang negara.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Memindahkan Gelas Dengan Kipas (Kesehatan, Kemandirian). Alat dan Bahan: Gelas kertas, Selotip, Kipas. Cara Membuat dan bermain: Beri tanda pembatas menggunakan selotip pada meja. Tata gelas tepat di depan penanda. Beri warna atau penanda yang berbeda pada gelas untuk membedakan gelas antar lawanSelanjutnya minta anak-anak untuk duduk saling berhadapan, dengan masing-masing membawa kipas, dan masing-masing dari mereka harus menggunakan kipas untuk memindahkan gelas milik sendiri ke daerah milik lawan. Yang dapat memindahkan gelas sendiri lebih banyak ke dalam daerah milik lawan dan lebih cepat dari lawan itu yang menang. Kegiatan 2 : Huruf dari Alam (Komunikasi, Kreativitas). Alat dan bahan: Ranting, daun, kerikil, bunga. Cara bermain: Anak-anak menggunakan bahan-bahan alam untuk membentuk huruf-huruf alfabet. Mereka bisa membuat nama mereka sendiri atau kata-kata sederhana. Kegiatan ini membantu perkembangan literasi dan kreativitas. Kegiatan 3 : Menyusun Pola Batik dengan Biji-bijian (Kewargaan, Penalaran Kritis). Alat dan bahan: Kertas karton, berbagai jenis biji-bijian, lem. Cara bermain: Gambar pola batik sederhana di kertas karton. Anak-anak mengisi pola tersebut dengan biji-bijian berwarna-warni. Diskusikan makna filosofis di balik motif batik.',
        activities: [
          {
            activityNumber: 1,
            title: 'Memindahkan Gelas Dengan Kipas (Kesehatan, Kemandirian)',
            toolsAndMaterials: 'Gelas kertas, Selotip, Kipas',
            howToPlay:
              'dan bermain: Beri tanda pembatas menggunakan selotip pada meja. Tata gelas tepat di depan penanda. Beri warna atau penanda yang berbeda pada gelas untuk membedakan gelas antar lawanSelanjutnya minta anak-anak untuk duduk saling berhadapan, dengan masing-masing membawa kipas, dan masing-masing dari mereka harus menggunakan kipas untuk memindahkan gelas milik sendiri ke daerah milik lawan. Yang dapat memindahkan gelas sendiri lebih banyak ke dalam daerah milik lawan dan lebih cepat dari lawan itu yang menang.',
            fullDescription:
              'Kegiatan 1: Memindahkan Gelas Dengan Kipas (Kesehatan, Kemandirian). Alat dan Bahan: Gelas kertas, Selotip, Kipas. Cara Membuat dan bermain: Beri tanda pembatas menggunakan selotip pada meja. Tata gelas tepat di depan penanda. Beri warna atau penanda yang berbeda pada gelas untuk membedakan gelas antar lawanSelanjutnya minta anak-anak untuk duduk saling berhadapan, dengan masing-masing membawa kipas, dan masing-masing dari mereka harus menggunakan kipas untuk memindahkan gelas milik sendiri ke daerah milik lawan. Yang dapat memindahkan gelas sendiri lebih banyak ke dalam daerah milik lawan dan lebih cepat dari lawan itu yang menang.',
          },
          {
            activityNumber: 2,
            title: 'Huruf dari Alam (Komunikasi, Kreativitas)',
            toolsAndMaterials: 'Ranting, daun, kerikil, bunga',
            howToPlay:
              'Anak-anak menggunakan bahan-bahan alam untuk membentuk huruf-huruf alfabet. Mereka bisa membuat nama mereka sendiri atau kata-kata sederhana. Kegiatan ini membantu perkembangan literasi dan kreativitas.',
            fullDescription:
              'Kegiatan 2: Huruf dari Alam (Komunikasi, Kreativitas). Alat dan bahan: Ranting, daun, kerikil, bunga. Cara bermain: Anak-anak menggunakan bahan-bahan alam untuk membentuk huruf-huruf alfabet. Mereka bisa membuat nama mereka sendiri atau kata-kata sederhana. Kegiatan ini membantu perkembangan literasi dan kreativitas.',
          },
          {
            activityNumber: 3,
            title: 'Menyusun Pola Batik dengan Biji-bijian (Kewargaan, Penalaran Kritis)',
            toolsAndMaterials: 'Kertas karton, berbagai jenis biji-bijian, lem',
            howToPlay:
              'Gambar pola batik sederhana di kertas karton. Anak-anak mengisi pola tersebut dengan biji-bijian berwarna-warni. Diskusikan makna filosofis di balik motif batik.',
            fullDescription:
              'Kegiatan 3: Menyusun Pola Batik dengan Biji-bijian (Kewargaan, Penalaran Kritis). Alat dan bahan: Kertas karton, berbagai jenis biji-bijian, lem. Cara bermain: Gambar pola batik sederhana di kertas karton. Anak-anak mengisi pola tersebut dengan biji-bijian berwarna-warni. Diskusikan makna filosofis di balik motif batik.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Bermain Menara Jenga (Kolaborasi, Penalaran Kritis). Alat dan bahan: Kayu atau bambu, Keranjang baju, Bola plastik, Kursi. Cara Membuat dan Bermain: Ring yang digunakan bisa di ganti dengan keranjang baju seperti pada gambar. Kemudian pada bagian bawa beri bambu sebanyak mungkin dan isi dengan bola plastik dan beri lagi pada bagian Tengah maupun atas sehingga bola tidak jatuh ke bawah. Cara bermain anak-anak harus mengambil bambu tanpa harus menjatuhkan bola, jika ada yang menjatuhkan bola , bisa di hukum, (misalnya : harus nyanyikan lagu, meniru gerakan bunga beroyang, berhitung angka, menyebutkan huruf atau kegiatan yang sudah di lakukan)Kegiatan 2 : Membuat Jam dari Loose Parts (Penalaran Kritis, Kemandirian). Alat dan bahan: Piring kertas, jarum dari karton, berbagai loose parts untuk angka. Cara bermain: Anak-anak membuat jam dinding sederhana menggunakan piring kertas sebagai dasar dan loose parts untuk menandai angka. Kegiatan ini membantu pemahaman tentang waktu. Kegiatan 3 : Bermain Klasifikasi Tekstur (Penalaran Kritis, Komunikasi). Alat dan bahan: Berbagai benda dengan tekstur berbeda (lembut, kasar, halus, dll). Cara bermain: Anak-anak mengeksplorasi tekstur berbagai benda, lalu mengelompokkannya berdasarkan tekstur. Kegiatan ini mengembangkan kepekaan sensorik dan kemampuan klasifikasi.',
        activities: [
          {
            activityNumber: 1,
            title: 'Bermain Menara Jenga (Kolaborasi, Penalaran Kritis)',
            toolsAndMaterials: 'Kayu atau bambu, Keranjang baju, Bola plastik, Kursi',
            howToPlay:
              'dan Bermain: Ring yang digunakan bisa di ganti dengan keranjang baju seperti pada gambar. Kemudian pada bagian bawa beri bambu sebanyak mungkin dan isi dengan bola plastik dan beri lagi pada bagian Tengah maupun atas sehingga bola tidak jatuh ke bawah. Cara bermain anak-anak harus mengambil bambu tanpa harus menjatuhkan bola, jika ada yang menjatuhkan bola , bisa di hukum, (misalnya : harus nyanyikan lagu, meniru gerakan bunga beroyang, berhitung angka, menyebutkan huruf atau kegiatan yang sudah di lakukan)',
            fullDescription:
              'Kegiatan 1: Bermain Menara Jenga (Kolaborasi, Penalaran Kritis). Alat dan bahan: Kayu atau bambu, Keranjang baju, Bola plastik, Kursi. Cara Membuat dan Bermain: Ring yang digunakan bisa di ganti dengan keranjang baju seperti pada gambar. Kemudian pada bagian bawa beri bambu sebanyak mungkin dan isi dengan bola plastik dan beri lagi pada bagian Tengah maupun atas sehingga bola tidak jatuh ke bawah. Cara bermain anak-anak harus mengambil bambu tanpa harus menjatuhkan bola, jika ada yang menjatuhkan bola , bisa di hukum, (misalnya : harus nyanyikan lagu, meniru gerakan bunga beroyang, berhitung angka, menyebutkan huruf atau kegiatan yang sudah di lakukan)',
          },
          {
            activityNumber: 2,
            title: 'Membuat Jam dari Loose Parts (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Piring kertas, jarum dari karton, berbagai loose parts untuk angka',
            howToPlay:
              'Anak-anak membuat jam dinding sederhana menggunakan piring kertas sebagai dasar dan loose parts untuk menandai angka. Kegiatan ini membantu pemahaman tentang waktu.',
            fullDescription:
              'Kegiatan 2: Membuat Jam dari Loose Parts (Penalaran Kritis, Kemandirian). Alat dan bahan: Piring kertas, jarum dari karton, berbagai loose parts untuk angka. Cara bermain: Anak-anak membuat jam dinding sederhana menggunakan piring kertas sebagai dasar dan loose parts untuk menandai angka. Kegiatan ini membantu pemahaman tentang waktu.',
          },
          {
            activityNumber: 3,
            title: 'Bermain Klasifikasi Tekstur (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials: 'Berbagai benda dengan tekstur berbeda (lembut, kasar, halus, dll)',
            howToPlay:
              'Anak-anak mengeksplorasi tekstur berbagai benda, lalu mengelompokkannya berdasarkan tekstur. Kegiatan ini mengembangkan kepekaan sensorik dan kemampuan klasifikasi.',
            fullDescription:
              'Kegiatan 3: Bermain Klasifikasi Tekstur (Penalaran Kritis, Komunikasi). Alat dan bahan: Berbagai benda dengan tekstur berbeda (lembut, kasar, halus, dll). Cara bermain: Anak-anak mengeksplorasi tekstur berbagai benda, lalu mengelompokkannya berdasarkan tekstur. Kegiatan ini mengembangkan kepekaan sensorik dan kemampuan klasifikasi.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Mengenal Huruf dan Bunyi (Komunikasi, Penalaran Kritis). Alat dan bahan: Kertas HVS/kardus susu bekas, Gunting, Penggaris, Spidol, Mainan yang memiliki huruf awal dengan huruf yang akan di kenalkan. Cara Membuat: Siapkan kertas HVS atau kardus susu, lalu garis membentuk persegi/kotak, kemudian gunting buat sebanyak jumlah huruf alfabet. Jika kertas sudah di gunting semua, tulis huruf alfabet menggunakan spidol (atau bisa juga menggunakan flashcard alfabet). Kemudian mintalah anak-anak untuk mencocokkan gambar atau mainan dengan huruf awal, misalnya A, untuk apel atau J, untuk jeruk. Kegiatan 2 : Membuat Peta Sederhana (Kreativitas, Kolaborasi). Alat dan bahan: Kertas besar, berbagai loose parts (balok, tutup botol, ranting, dll). Cara bermain: Anak-anak membuat peta sederhana dari ruang kelas atau taman bermain menggunakan loose parts. Kegiatan ini membantu pemahaman spasial dan orientasi. Kegiatan 3 : Membuat Replika Candi dari Balok Kayu (Kewargaan, Kreativitas). Alat dan bahan: Balok kayu bekas, ranting, daun kering. Cara bermain: Anak-anak menyusun balok kayu membentuk replika candi seperti Borobudur atau Prambanan. Gunakan ranting dan daun untuk dekorasi. Ceritakan sejarah singkat candi-candi di Indonesia.',
        activities: [
          {
            activityNumber: 1,
            title: 'Mengenal Huruf dan Bunyi (Komunikasi, Penalaran Kritis)',
            toolsAndMaterials:
              'Kertas HVS/kardus susu bekas, Gunting, Penggaris, Spidol, Mainan yang memiliki huruf awal dengan huruf yang akan di kenalkan',
            howToPlay:
              'Siapkan kertas HVS atau kardus susu, lalu garis membentuk persegi/kotak, kemudian gunting buat sebanyak jumlah huruf alfabet. Jika kertas sudah di gunting semua, tulis huruf alfabet menggunakan spidol (atau bisa juga menggunakan flashcard alfabet). Kemudian mintalah anak-anak untuk mencocokkan gambar atau mainan dengan huruf awal, misalnya A, untuk apel atau J, untuk jeruk.',
            fullDescription:
              'Kegiatan 1: Mengenal Huruf dan Bunyi (Komunikasi, Penalaran Kritis). Alat dan bahan: Kertas HVS/kardus susu bekas, Gunting, Penggaris, Spidol, Mainan yang memiliki huruf awal dengan huruf yang akan di kenalkan. Cara Membuat: Siapkan kertas HVS atau kardus susu, lalu garis membentuk persegi/kotak, kemudian gunting buat sebanyak jumlah huruf alfabet. Jika kertas sudah di gunting semua, tulis huruf alfabet menggunakan spidol (atau bisa juga menggunakan flashcard alfabet). Kemudian mintalah anak-anak untuk mencocokkan gambar atau mainan dengan huruf awal, misalnya A, untuk apel atau J, untuk jeruk.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Peta Sederhana (Kreativitas, Kolaborasi)',
            toolsAndMaterials:
              'Kertas besar, berbagai loose parts (balok, tutup botol, ranting, dll)',
            howToPlay:
              'Anak-anak membuat peta sederhana dari ruang kelas atau taman bermain menggunakan loose parts. Kegiatan ini membantu pemahaman spasial dan orientasi.',
            fullDescription:
              'Kegiatan 2: Membuat Peta Sederhana (Kreativitas, Kolaborasi). Alat dan bahan: Kertas besar, berbagai loose parts (balok, tutup botol, ranting, dll). Cara bermain: Anak-anak membuat peta sederhana dari ruang kelas atau taman bermain menggunakan loose parts. Kegiatan ini membantu pemahaman spasial dan orientasi.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Replika Candi dari Balok Kayu (Kewargaan, Kreativitas)',
            toolsAndMaterials: 'Balok kayu bekas, ranting, daun kering',
            howToPlay:
              'Anak-anak menyusun balok kayu membentuk replika candi seperti Borobudur atau Prambanan. Gunakan ranting dan daun untuk dekorasi. Ceritakan sejarah singkat candi-candi di Indonesia.',
            fullDescription:
              'Kegiatan 3: Membuat Replika Candi dari Balok Kayu (Kewargaan, Kreativitas). Alat dan bahan: Balok kayu bekas, ranting, daun kering. Cara bermain: Anak-anak menyusun balok kayu membentuk replika candi seperti Borobudur atau Prambanan. Gunakan ranting dan daun untuk dekorasi. Ceritakan sejarah singkat candi-candi di Indonesia.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Miniatur Lapangan Sepak Bola dari Kardus (Kesehatan, Kolaborasi). Alat dan bahan: Kardus bekas, Gunting, Lem, Kertas hijau, Sedotan plastik, Benang putih, Miniatur pemain (opsional), atau gambar orang-orangan, penjepit jemuran, tusuk sate atau lidi. Cara Membuat: Potong kardus sesuai ukuran lapangan yang diinginkan. Tempelkan kertas hijau di atas kardus. Buat garis-garis lapangan dengan benang putih, kemudian lubangi kardus pada bagian sisi kanan dan kiri menggunakan pelubang. Masukkan tusuk kaki ke dalam lubang. Gunting gambar orang-orangan, kemudian rekatkan menggunakan lem pada penjepit jamuran. Jepitkan pada lidi, pada bagian gawang kardus dapat di lubangi. Masukkan bola dan anak-anak dapat langsun memainkannya dengan menggeser-geser lidi agar penjepit bergerak dan menggerakkan bola ke dalam gawang. Kegiatan 2 : Sorting Bentuk dan Warna (Penalaran Kritis, Kemandirian). Alat dan bahan: Berbagai benda kecil dengan bentuk dan warna berbeda, wadah. Cara bermain: Anak-anak mengelompokkan benda-benda berdasarkan bentuk atau warnanya ke dalam wadah yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi dan pengenalan bentuk serta warna. Kegiatan 3 : Alat Musik Tradisional (Kewargaan, Kreativitas). Alat dan bahan: Kaleng bekas, karet gelang, biji-bijian, ranting. Cara bermain: Anak-anak membuat alat musik sederhana seperti marakas dari kaleng berisi biji-bijian atau gendang dari kaleng yang ditutup karet. Ajak mereka memainkan lagu-lagu daerah dengan alat musik buatan sendiri. Kegiatan ini mengembangkan kreativitas dan apresiasi terhadap musik tradisional Indonesia.',
        activities: [
          {
            activityNumber: 1,
            title: 'Miniatur Lapangan Sepak Bola dari Kardus (Kesehatan, Kolaborasi)',
            toolsAndMaterials:
              'Kardus bekas, Gunting, Lem, Kertas hijau, Sedotan plastik, Benang putih, Miniatur pemain (opsional), atau gambar orang-orangan, penjepit jemuran, tusuk sate atau lidi',
            howToPlay:
              'Potong kardus sesuai ukuran lapangan yang diinginkan. Tempelkan kertas hijau di atas kardus. Buat garis-garis lapangan dengan benang putih, kemudian lubangi kardus pada bagian sisi kanan dan kiri menggunakan pelubang. Masukkan tusuk kaki ke dalam lubang. Gunting gambar orang-orangan, kemudian rekatkan menggunakan lem pada penjepit jamuran. Jepitkan pada lidi, pada bagian gawang kardus dapat di lubangi. Masukkan bola dan anak-anak dapat langsun memainkannya dengan menggeser-geser lidi agar penjepit bergerak dan menggerakkan bola ke dalam gawang.',
            fullDescription:
              'Kegiatan 1: Miniatur Lapangan Sepak Bola dari Kardus (Kesehatan, Kolaborasi). Alat dan bahan: Kardus bekas, Gunting, Lem, Kertas hijau, Sedotan plastik, Benang putih, Miniatur pemain (opsional), atau gambar orang-orangan, penjepit jemuran, tusuk sate atau lidi. Cara Membuat: Potong kardus sesuai ukuran lapangan yang diinginkan. Tempelkan kertas hijau di atas kardus. Buat garis-garis lapangan dengan benang putih, kemudian lubangi kardus pada bagian sisi kanan dan kiri menggunakan pelubang. Masukkan tusuk kaki ke dalam lubang. Gunting gambar orang-orangan, kemudian rekatkan menggunakan lem pada penjepit jamuran. Jepitkan pada lidi, pada bagian gawang kardus dapat di lubangi. Masukkan bola dan anak-anak dapat langsun memainkannya dengan menggeser-geser lidi agar penjepit bergerak dan menggerakkan bola ke dalam gawang.',
          },
          {
            activityNumber: 2,
            title: 'Sorting Bentuk dan Warna (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Berbagai benda kecil dengan bentuk dan warna berbeda, wadah',
            howToPlay:
              'Anak-anak mengelompokkan benda-benda berdasarkan bentuk atau warnanya ke dalam wadah yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi dan pengenalan bentuk serta warna.',
            fullDescription:
              'Kegiatan 2: Sorting Bentuk dan Warna (Penalaran Kritis, Kemandirian). Alat dan bahan: Berbagai benda kecil dengan bentuk dan warna berbeda, wadah. Cara bermain: Anak-anak mengelompokkan benda-benda berdasarkan bentuk atau warnanya ke dalam wadah yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi dan pengenalan bentuk serta warna.',
          },
          {
            activityNumber: 3,
            title: 'Alat Musik Tradisional (Kewargaan, Kreativitas)',
            toolsAndMaterials: 'Kaleng bekas, karet gelang, biji-bijian, ranting',
            howToPlay:
              'Anak-anak membuat alat musik sederhana seperti marakas dari kaleng berisi biji-bijian atau gendang dari kaleng yang ditutup karet. Ajak mereka memainkan lagu-lagu daerah dengan alat musik buatan sendiri. Kegiatan ini mengembangkan kreativitas dan apresiasi terhadap musik tradisional Indonesia.',
            fullDescription:
              'Kegiatan 3: Alat Musik Tradisional (Kewargaan, Kreativitas). Alat dan bahan: Kaleng bekas, karet gelang, biji-bijian, ranting. Cara bermain: Anak-anak membuat alat musik sederhana seperti marakas dari kaleng berisi biji-bijian atau gendang dari kaleng yang ditutup karet. Ajak mereka memainkan lagu-lagu daerah dengan alat musik buatan sendiri. Kegiatan ini mengembangkan kreativitas dan apresiasi terhadap musik tradisional Indonesia.',
          },
        ],
      },
    ],
    closingActivities: [
      'Saatnya berkumpul dalam lingkaran besar untuk merayakan petualangan seru hari ini! Guru mengajak anak-anak untuk duduk bersama dengan penuh kegembiraan dan berbagi cerita tentang pengalaman mereka menjadi anak Indonesia yang hebat.',
      'Kegiatan Penutup:',
      'Yel-yel Indonesia Hebat! dengan gerakan semangat bersama-sama untuk merayakan pencapaian hari ini',
      'Parade Mini Karya Indonesia - anak-anak berkeliling kelas memamerkan hasil karya sambil bercerita dengan bangga',
      'Permainan Tebak Suara Indonesia - mendengarkan suara khas Indonesia (gamelan, burung, alam) dan menebak dengan antusias',
      'Sesi Aku Bangga Karena... - setiap anak berbagi satu hal yang membanggakan tentang dirinya dan Indonesia hari ini',
      'Tarian Gembira Garuda Pancasila dengan gerakan sederhana yang energik dan menyenangkan',
      'Bernyanyi Indonesia Pusaka sambil bertepuk tangan dan bergoyang bersama',
      'Permainan High Five Indonesia - anak-anak saling tos sambil menyebut satu kata tentang Indonesia',
      'Magic Box Surprise - guru mengeluarkan permen/stiker bergambar Indonesia sebagai apresiasi semangat belajar',
      'Menginformasikan petualangan seru esok hari dengan nada misterius dan menggembirakan yang membuat anak penasaran',
      'Doa penutup dengan gerakan - berdoa sambil mengangkat tangan ke atas seperti burung Garuda yang terbang',
      'Pelukan grup Indonesia Satu - semua anak dan guru berpelukan bersama sambil berteriak Indonesia Satu! penuh semangat',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan minimal 3 simbol negara Indonesia (bendera merah putih, burung Garuda, lagu Indonesia Raya) saat ditanya dalam circle time',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan antusiasme dan ekspresi positif saat melihat gambar-gambar keindahan Indonesia',
      },
      {
        no: 3,
        indicator:
          'Anak mampu bercerita tentang daerah asal keluarga atau makanan tradisional yang dikenal dengan bahasa sederhana',
      },
      {
        no: 4,
        indicator:
          'Anak menunjukkan kemandirian dalam memilih area bermain dan menyiapkan alat-alat yang dibutuhkan',
      },
      {
        no: 5,
        indicator:
          'Anak berpartisipasi aktif dalam kegiatan kelompok dan menunjukkan sikap kolaboratif dengan teman yang berbeda latar belakang',
      },
      {
        no: 6,
        indicator:
          'Anak mampu membuat karya seni (lukisan Garuda, peta biji-bijian, replika candi) dengan kreativitas dan ketekunan',
      },
      {
        no: 7,
        indicator:
          'Anak dapat mengikuti instruksi step-by-step dalam aktivitas bermain dan menyelesaikan tugas hingga selesai',
      },
      {
        no: 8,
        indicator:
          'Anak menunjukkan kemampuan problem solving saat menghadapi tantangan dalam permainan (Jenga, sorting, klasifikasi)',
      },
      {
        no: 9,
        indicator:
          'Anak mampu mengomunikasikan hasil karya dan pengalaman bermain dengan jelas saat gallery walk',
      },
      {
        no: 10,
        indicator:
          'Anak menunjukkan sikap menghargai dan memberikan pujian positif kepada karya teman yang berbeda',
      },
      {
        no: 11,
        indicator:
          'Anak dapat melakukan recall atau mengingat kembali informasi tentang Indonesia yang dipelajari saat interview individual',
      },
      {
        no: 12,
        indicator:
          'Anak mengekspresikan perasaan positif tentang pembelajaran melalui emoticon, testimoni video, dan reflection journal',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 3,
    filename: '39_TK_B_Smt1_03_Kebinekaan.docx',
    title: 'KITA INDONESIA SESUNGGUHNYA',
    topic: 'TANAH AIR',
    subtopic: 'KEBINEKAAN',
    modelPembelajaran: 'Kolaboratif, STEAM',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Agustus 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: false,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: true,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak kelompok B (5-6 tahun) memiliki karakteristik perkembangan yang sudah mampu mengenal identitas diri dan mulai memahami perbedaan di sekitarnya. Mereka memiliki rasa ingin tahu yang tinggi tentang keberagaman budaya, tradisi, dan perbedaan fisik teman-temannya. Anak-anak pada usia ini sudah dapat mengekspresikan perasaan dan pendapat sederhana, serta mulai menunjukkan kemampuan berempati terhadap orang lain. Mereka juga sudah dapat berpartisipasi dalam kegiatan kelompok dan menunjukkan sikap toleransi dengan bimbingan.',
      learningMaterial:
        'Materi kebinekaan untuk anak usia dini mencakup pengenalan keberagaman budaya, agama, suku, dan tradisi di Indonesia melalui pendekatan yang konkret dan menyenangkan. Materi ini relevan dengan kehidupan anak karena mereka dapat melihat perbedaan langsung di lingkungan sekitar. Tingkat kesulitan disesuaikan dengan tahap perkembangan kognitif anak melalui kegiatan bermain, bercerita, dan berkarya. Struktur materi dirancang dari pengenalan diri, pemahaman perbedaan, hingga penerapan sikap saling menghargai. Integrasi nilai dan karakter difokuskan pada pengembangan toleransi, empati, dan rasa syukur atas keberagaman sebagai ciptaan Tuhan.',
    },
    learningDesign: {
      cp: 'CP Nilai Agama dan Budi Pekerti: Murid menghargai sesama manusia dengan berbagai perbedaannya sehingga mempraktikkan perilaku baik dan berakhlak muliaCP Jati Diri: Murid mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia',
      crossDisciplinary:
        'Nilai agama dan moral (penghayatan nilai keberagaman sebagai ciptaan Tuhan), Nilai Pancasila (pengembangan sikap toleransi dan persatuan), Fisik motorik (koordinasi gerak dalam aktivitas seni dan permainan tradisional), Kognitif (pemahaman konsep perbedaan dan persamaan), Bahasa (komunikasi tentang keberagaman dan ekspresi perasaan), Sosial emosional (empati dan keterampilan berinteraksi dengan teman yang berbeda latar belakang)',
      tp: 'Anak dapat memahami dan menghargai keberagaman budaya, agama, dan tradisi di lingkungan sekitar, Anak mampu menunjukkan perilaku inklusif dan saling menghormati dalam interaksi sehari-hari dengan teman-teman yang berbeda latar belakang',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain hands-on seperti membuat karya seni dan membangun bersama, bercerita untuk memperkenalkan konsep keberagaman, bernyanyi dan gerak tubuh untuk mengingat nilai toleransi, serta eksplorasi sensori untuk pengalaman konkret tentang perbedaan. Pendekatan ini mendukung pembelajaran berkesadaran melalui keterlibatan aktif, bermakna melalui keterkaitan dengan pengalaman anak, dan menggembirakan melalui aktivitas menyenangkan.',
      partnership:
        'Kolaborasi dengan orang tua untuk berbagi cerita latar belakang keluarga, mengundang komunitas sekitar untuk berbagi tradisi budaya, kerja sama guru lintas kelas dalam kegiatan keberagaman, dan menghadirkan narasumber dari berbagai latar belakang budaya atau agama sesuai kebutuhan pembelajaran',
      environment:
        'Ruang kelas ditata fleksibel dengan area-area bermain yang mendukung aktivitas kolaboratif dan eksplorasi. Lingkungan fisik diperkaya dengan visual keberagaman budaya Indonesia seperti gambar pakaian adat, rumah tradisional, dan makanan khas daerah. Area digital dimanfaatkan untuk menampilkan video edukatif tentang keberagaman. Budaya belajar yang dikembangkan menekankan saling menghargai, mendengarkan pendapat teman, dan merayakan perbedaan sebagai kekayaan bersama.',
      digitalUtilization:
        'Penggunaan video edukatif tentang keberagaman, cerita digital interaktif, dan media pembelajaran visual untuk mengenalkan budaya IndonesiaDukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penghayatan keberagaman dalam beribadah',
      'Renungan/nasehat/motivasi pagi tentang keindahan perbedaan',
      'Menyanyikan lagu 1234 Pergi Sekolah dengan gerakan yang menggembirakan',
      'Asesmen awal melalui diskusi ide-ide kegiatan dan review kegiatan sebelumnya',
      'Kegiatan pemantik berupa buku cerita/video Menghargai Perbedaan',
      'Menyiapkan properti kelas dan kesepakatan bermain yang menghargai keberagaman',
    ],
    openingQuestions: [
      'Apa yang membuat setiap orang istimewa di mata Tuhan? (Keimanan dan Ketakwaan)',
      'Bagaimana kita bisa menjadi teman baik untuk semua orang yang berbeda? (Kewargaan)',
      'Mengapa ada perbedaan warna kulit, bahasa, dan makanan di Indonesia? (Penalaran Kritis)',
      'Apa hal menarik yang bisa kita buat bersama meskipun kita berbeda? (Kreativitas)',
      'Bagaimana rasanya ketika kita bermain bersama teman yang berbeda? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri untuk menghargai perbedaan? (Kemandirian)',
      'Mengapa penting menjaga tubuh sehat agar bisa bermain dengan semua teman? (Kesehatan)',
      'Bagaimana cara menyampaikan perasaan kita dengan baik kepada teman yang berbeda? (Komunikasi)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Burung Garuda Dari Stik Es Krim (Kreativitas, Kewargaan). Alat dan bahan: Stik es krim (jumlah sesuaikan dengan kebutuhan), Printable kepala burung Garuda yang sudah digunting , Lem (lem putih atau lem tembak), Gunting, Kertas berwarna ,Cara Membuat: Pastikan semua stik es krim bersih dan kering. Cetak dan gunting gambar kepala burung Garuda hingga mendapatkan bentuk yang diinginkan. Ambil beberapa stik es krim dan atur sejajar untuk membentuk badan burung Garuda. Oleskan lem pada tepi masing-masing stik es krim dan tempelkan satu per satu hingga membentuk badan. Biarkan lem mengering selama beberapa menit. Oleskan lem di bagian belakang printable kepala burung Garuda yang sudah digunting, kemudian tempelkan di bagian atas badan stik es krim. Pastikan kepala Garuda berada di tempat yang tepat dan biarkan lem mengering sepenuhnya. Kegiatan 2 : Membangun Rumah Adat Bersama (Kolaborasi, Penalaran Kritis). Alat dan bahan: Berbagai jenis loose parts seperti balok kayu, ranting, daun kering, batu kecil, kain perca. Cara bermain: Bagi anak-anak menjadi beberapa kelompok yang mewakili suku-suku di Indonesia. Setiap kelompok bertugas membangun miniatur rumah adat dari daerah yang berbeda menggunakan loose parts yang tersedia. Setelah selesai, anak-anak dapat mempresentasikan rumah adat mereka dan menempatkannya berdampingan untuk membentuk desa Indonesia yang beragam namun bersatu. Kegiatan 3 : Membangun Menara Keberagaman (Kolaborasi, Komunikasi). Alat dan bahan: Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda. Cara bermain: Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Burung Garuda Dari Stik Es Krim (Kreativitas, Kewargaan)',
            toolsAndMaterials:
              'Stik es krim (jumlah sesuaikan dengan kebutuhan), Printable kepala burung Garuda yang sudah digunting , Lem (lem putih atau lem tembak), Gunting, Kertas berwarna',
            howToPlay:
              'Pastikan semua stik es krim bersih dan kering. Cetak dan gunting gambar kepala burung Garuda hingga mendapatkan bentuk yang diinginkan. Ambil beberapa stik es krim dan atur sejajar untuk membentuk badan burung Garuda. Oleskan lem pada tepi masing-masing stik es krim dan tempelkan satu per satu hingga membentuk badan. Biarkan lem mengering selama beberapa menit. Oleskan lem di bagian belakang printable kepala burung Garuda yang sudah digunting, kemudian tempelkan di bagian atas badan stik es krim. Pastikan kepala Garuda berada di tempat yang tepat dan biarkan lem mengering sepenuhnya.',
            fullDescription:
              'Kegiatan 1: Membuat Burung Garuda Dari Stik Es Krim (Kreativitas, Kewargaan). Alat dan bahan: Stik es krim (jumlah sesuaikan dengan kebutuhan), Printable kepala burung Garuda yang sudah digunting , Lem (lem putih atau lem tembak), Gunting, Kertas berwarna ,Cara Membuat: Pastikan semua stik es krim bersih dan kering. Cetak dan gunting gambar kepala burung Garuda hingga mendapatkan bentuk yang diinginkan. Ambil beberapa stik es krim dan atur sejajar untuk membentuk badan burung Garuda. Oleskan lem pada tepi masing-masing stik es krim dan tempelkan satu per satu hingga membentuk badan. Biarkan lem mengering selama beberapa menit. Oleskan lem di bagian belakang printable kepala burung Garuda yang sudah digunting, kemudian tempelkan di bagian atas badan stik es krim. Pastikan kepala Garuda berada di tempat yang tepat dan biarkan lem mengering sepenuhnya.',
          },
          {
            activityNumber: 2,
            title: 'Membangun Rumah Adat Bersama (Kolaborasi, Penalaran Kritis)',
            toolsAndMaterials:
              'Berbagai jenis loose parts seperti balok kayu, ranting, daun kering, batu kecil, kain perca',
            howToPlay:
              'Bagi anak-anak menjadi beberapa kelompok yang mewakili suku-suku di Indonesia. Setiap kelompok bertugas membangun miniatur rumah adat dari daerah yang berbeda menggunakan loose parts yang tersedia. Setelah selesai, anak-anak dapat mempresentasikan rumah adat mereka dan menempatkannya berdampingan untuk membentuk desa Indonesia yang beragam namun bersatu.',
            fullDescription:
              'Kegiatan 2: Membangun Rumah Adat Bersama (Kolaborasi, Penalaran Kritis). Alat dan bahan: Berbagai jenis loose parts seperti balok kayu, ranting, daun kering, batu kecil, kain perca. Cara bermain: Bagi anak-anak menjadi beberapa kelompok yang mewakili suku-suku di Indonesia. Setiap kelompok bertugas membangun miniatur rumah adat dari daerah yang berbeda menggunakan loose parts yang tersedia. Setelah selesai, anak-anak dapat mempresentasikan rumah adat mereka dan menempatkannya berdampingan untuk membentuk desa Indonesia yang beragam namun bersatu.',
          },
          {
            activityNumber: 3,
            title: 'Membangun Menara Keberagaman (Kolaborasi, Komunikasi)',
            toolsAndMaterials: 'Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda',
            howToPlay:
              'Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok.',
            fullDescription:
              'Kegiatan 3: Membangun Menara Keberagaman (Kolaborasi, Komunikasi). Alat dan bahan: Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda. Cara bermain: Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Pengenalan Huruf Dengan Kolase (Kreativitas, Kemandirian): Alat dan bahan: Prin table huruf alfabet, lem, sedotan, gunting, manik-manik, pasir, koran, krayon, daun, dan lainnya. Cara Membuat: Siapkan printtable huruf, kemudian pada huruf awan bisa membuat kolase dengan bahan-bahan sedotan yang di gunting-gunting. Untung huruf selanjutnya dapat menggunakan pasir. Dan seerusnya. Setiap selesai menyelesaikan dalam pembuatan kolase dapat bersama-sama mempelajari hurufnya, bisa menyebutkan hurufnya secara bersama-sama, atau menyebutkan nama buah, hewan atau benda yang di epannya memiliki huruf yan sedang di bahas. Jika kolase huruf sudah selesai hingga huruf Z dapat, di jadikan 1 dengan melubangi salah satu sisi pada kertas dan menjepit satu di ikat dengan tali pita, sehingga menjadi buku pembelajaran yang menyenangkan untuk anak-anak. Sampul buku dapat di beri nama sesuia keinginan anak-anakKegiatan 2 : Kolase Burung Garuda (Kewargaan, Kreativitas). Alat dan bahan: Gambar outline Garuda Pancasila, berbagai bahan alam seperti daun, biji-bijian, kerikil, ranting kecil. Cara bermain: Anak-anak bekerja sama membuat kolase Garuda Pancasila menggunakan bahan-bahan alam. Setiap anak bertanggung jawab untuk bagian yang berbeda, menunjukkan bahwa meskipun mengerjakan bagian yang berbeda, hasilnya adalah satu kesatuan yang indah. Kegiatan 3 : Membuat Rantai Persahabatan (Komunikasi, Kolaborasi). Alat dan bahan: Potongan kertas warna-warni, lem, spidol. Cara bermain: Setiap anak menulis namanya dan satu hal baik tentang temannya di potongan kertas. Kemudian mereka membuat rantai kertas dengan menggabungkan semua potongan. Diskusikan bagaimana perbedaan warna membuat rantai menjadi indah, seperti keberagaman di Indonesia.',
        activities: [
          {
            activityNumber: 1,
            title: 'Pengenalan Huruf Dengan Kolase (Kreativitas, Kemandirian):',
            toolsAndMaterials:
              'Prin table huruf alfabet, lem, sedotan, gunting, manik-manik, pasir, koran, krayon, daun, dan lainnya',
            howToPlay:
              'Siapkan printtable huruf, kemudian pada huruf awan bisa membuat kolase dengan bahan-bahan sedotan yang di gunting-gunting. Untung huruf selanjutnya dapat menggunakan pasir. Dan seerusnya. Setiap selesai menyelesaikan dalam pembuatan kolase dapat bersama-sama mempelajari hurufnya, bisa menyebutkan hurufnya secara bersama-sama, atau menyebutkan nama buah, hewan atau benda yang di epannya memiliki huruf yan sedang di bahas. Jika kolase huruf sudah selesai hingga huruf Z dapat, di jadikan 1 dengan melubangi salah satu sisi pada kertas dan menjepit satu di ikat dengan tali pita, sehingga menjadi buku pembelajaran yang menyenangkan untuk anak-anak. Sampul buku dapat di beri nama sesuia keinginan anak-anak',
            fullDescription:
              'Kegiatan 1: Pengenalan Huruf Dengan Kolase (Kreativitas, Kemandirian): Alat dan bahan: Prin table huruf alfabet, lem, sedotan, gunting, manik-manik, pasir, koran, krayon, daun, dan lainnya. Cara Membuat: Siapkan printtable huruf, kemudian pada huruf awan bisa membuat kolase dengan bahan-bahan sedotan yang di gunting-gunting. Untung huruf selanjutnya dapat menggunakan pasir. Dan seerusnya. Setiap selesai menyelesaikan dalam pembuatan kolase dapat bersama-sama mempelajari hurufnya, bisa menyebutkan hurufnya secara bersama-sama, atau menyebutkan nama buah, hewan atau benda yang di epannya memiliki huruf yan sedang di bahas. Jika kolase huruf sudah selesai hingga huruf Z dapat, di jadikan 1 dengan melubangi salah satu sisi pada kertas dan menjepit satu di ikat dengan tali pita, sehingga menjadi buku pembelajaran yang menyenangkan untuk anak-anak. Sampul buku dapat di beri nama sesuia keinginan anak-anak',
          },
          {
            activityNumber: 2,
            title: 'Kolase Burung Garuda (Kewargaan, Kreativitas)',
            toolsAndMaterials:
              'Gambar outline Garuda Pancasila, berbagai bahan alam seperti daun, biji-bijian, kerikil, ranting kecil',
            howToPlay:
              'Anak-anak bekerja sama membuat kolase Garuda Pancasila menggunakan bahan-bahan alam. Setiap anak bertanggung jawab untuk bagian yang berbeda, menunjukkan bahwa meskipun mengerjakan bagian yang berbeda, hasilnya adalah satu kesatuan yang indah.',
            fullDescription:
              'Kegiatan 2: Kolase Burung Garuda (Kewargaan, Kreativitas). Alat dan bahan: Gambar outline Garuda Pancasila, berbagai bahan alam seperti daun, biji-bijian, kerikil, ranting kecil. Cara bermain: Anak-anak bekerja sama membuat kolase Garuda Pancasila menggunakan bahan-bahan alam. Setiap anak bertanggung jawab untuk bagian yang berbeda, menunjukkan bahwa meskipun mengerjakan bagian yang berbeda, hasilnya adalah satu kesatuan yang indah.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Rantai Persahabatan (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Potongan kertas warna-warni, lem, spidol',
            howToPlay:
              'Setiap anak menulis namanya dan satu hal baik tentang temannya di potongan kertas. Kemudian mereka membuat rantai kertas dengan menggabungkan semua potongan. Diskusikan bagaimana perbedaan warna membuat rantai menjadi indah, seperti keberagaman di Indonesia.',
            fullDescription:
              'Kegiatan 3: Membuat Rantai Persahabatan (Komunikasi, Kolaborasi). Alat dan bahan: Potongan kertas warna-warni, lem, spidol. Cara bermain: Setiap anak menulis namanya dan satu hal baik tentang temannya di potongan kertas. Kemudian mereka membuat rantai kertas dengan menggabungkan semua potongan. Diskusikan bagaimana perbedaan warna membuat rantai menjadi indah, seperti keberagaman di Indonesia.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Kolase Peta Indonesia dari Kapas (Kewargaan, Kreativitas). Alat dan bahan: Map atau gambar peta Indonesia, lem, kapas, cat warna, pipet, mangkuk. Cara Membuat: Siapkan map atau gambar peta Indonesia, kemudian olesi dengan lem. Selanjutnya, rekatkan kapan di atas peta. Terakhir, siapka cat warna ke dalam mangkuk, kemudian dengan menggunakan pipet untuk mewarnai peta IndonesiaKegiatan 2 : Membangun Menara Keberagaman (Kolaborasi, Penalaran Kritis). Alat dan bahan: Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda. Cara bermain: Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok. Kegiatan 3 : Membuat Mural Keberagaman (Kreativitas, Kolaborasi). Alat dan bahan: Kertas besar, berbagai bahan alam untuk mewarnai (bunga, daun, tanah, dll), air. Cara bermain: Anak-anak bersama-sama membuat mural yang menggambarkan keberagaman Indonesia menggunakan bahan-bahan alam sebagai pewarna. Setiap anak berkontribusi pada bagian yang berbeda, namun hasilnya adalah satu karya yang utuh.',
        activities: [
          {
            activityNumber: 1,
            title: 'Kolase Peta Indonesia dari Kapas (Kewargaan, Kreativitas)',
            toolsAndMaterials:
              'Map atau gambar peta Indonesia, lem, kapas, cat warna, pipet, mangkuk',
            howToPlay:
              'Siapkan map atau gambar peta Indonesia, kemudian olesi dengan lem. Selanjutnya, rekatkan kapan di atas peta. Terakhir, siapka cat warna ke dalam mangkuk, kemudian dengan menggunakan pipet untuk mewarnai peta Indonesia',
            fullDescription:
              'Kegiatan 1: Kolase Peta Indonesia dari Kapas (Kewargaan, Kreativitas). Alat dan bahan: Map atau gambar peta Indonesia, lem, kapas, cat warna, pipet, mangkuk. Cara Membuat: Siapkan map atau gambar peta Indonesia, kemudian olesi dengan lem. Selanjutnya, rekatkan kapan di atas peta. Terakhir, siapka cat warna ke dalam mangkuk, kemudian dengan menggunakan pipet untuk mewarnai peta Indonesia',
          },
          {
            activityNumber: 2,
            title: 'Membangun Menara Keberagaman (Kolaborasi, Penalaran Kritis)',
            toolsAndMaterials: 'Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda',
            howToPlay:
              'Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok.',
            fullDescription:
              'Kegiatan 2: Membangun Menara Keberagaman (Kolaborasi, Penalaran Kritis). Alat dan bahan: Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda. Cara bermain: Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Mural Keberagaman (Kreativitas, Kolaborasi)',
            toolsAndMaterials:
              'Kertas besar, berbagai bahan alam untuk mewarnai (bunga, daun, tanah, dll), air',
            howToPlay:
              'Anak-anak bersama-sama membuat mural yang menggambarkan keberagaman Indonesia menggunakan bahan-bahan alam sebagai pewarna. Setiap anak berkontribusi pada bagian yang berbeda, namun hasilnya adalah satu karya yang utuh.',
            fullDescription:
              'Kegiatan 3: Membuat Mural Keberagaman (Kreativitas, Kolaborasi). Alat dan bahan: Kertas besar, berbagai bahan alam untuk mewarnai (bunga, daun, tanah, dll), air. Cara bermain: Anak-anak bersama-sama membuat mural yang menggambarkan keberagaman Indonesia menggunakan bahan-bahan alam sebagai pewarna. Setiap anak berkontribusi pada bagian yang berbeda, namun hasilnya adalah satu karya yang utuh.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Gantungan Keluarga (Komunikasi, Kemandirian). Alat dan bahan: Kertas HVS, krayon, pelubang kertas, gunting. Hanger, benang. Cara Membuat: Beri semua anak kertas HVS, kemudian mintalah anak-anak untuk menggambar keluarga mereka (bisa terdiri dari ayah, ibu, kakak, adik, nenek, kakek, paman, bibi) di sesuaikan dengan keluarga masing-masing anak. Selanjutnya mintalah anak-anak untuk menggambarkan rumah di kertas HVS yang berbeda. Jika sudah selesai menggambar mintalah anak-anak untuk mewarnai gambar dan menggunting gambar sesuai dengan pola gambar. Siapkan hanger, kemudian gunting gambar rumah, dan lubangi bagian tepinya lalu beri benang dan ikatkan gambar rumah tepat di bagian tengah hanger. Lubangi gambar keluarga, yang sudah di gunting kemudian beri benang dan ikat pada hanger. Kegiatan 2 : Permainan Kata Berantai Bahasa Daerah (Komunikasi, Penalaran Kritis). Alat dan bahan: Kartu kata dalam berbagai bahasa daerah, kotak atau wadah. Cara bermain: Anak-anak duduk melingkar. Satu anak mengambil kartu, menyebutkan kata dalam bahasa daerah, dan memberikan artinya. Anak berikutnya harus mengambil kartu dengan kata yang berawalan huruf terakhir dari kata sebelumnya. Ini mengajarkan keberagaman bahasa dan kerjasama dalam permainan. Kegiatan 3 : Membuat Peta Timbul Indonesia (Kolaborasi, Kreativitas). Alat dan bahan: Adonan playdough atau tanah liat, peta Indonesia sebagai panduan, berbagai biji-bijian atau kerikil. Cara bermain: Anak-anak bekerja sama membuat peta timbul Indonesia. Setiap anak bertanggung jawab untuk membentuk pulau atau kepulauan tertentu. Gunakan biji-bijian atau kerikil untuk menandai kota-kota penting. Diskusikan bagaimana setiap pulau adalah bagian penting dari Indonesia.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Gantungan Keluarga (Komunikasi, Kemandirian)',
            toolsAndMaterials: 'Kertas HVS, krayon, pelubang kertas, gunting. Hanger, benang',
            howToPlay:
              'Beri semua anak kertas HVS, kemudian mintalah anak-anak untuk menggambar keluarga mereka (bisa terdiri dari ayah, ibu, kakak, adik, nenek, kakek, paman, bibi) di sesuaikan dengan keluarga masing-masing anak. Selanjutnya mintalah anak-anak untuk menggambarkan rumah di kertas HVS yang berbeda. Jika sudah selesai menggambar mintalah anak-anak untuk mewarnai gambar dan menggunting gambar sesuai dengan pola gambar. Siapkan hanger, kemudian gunting gambar rumah, dan lubangi bagian tepinya lalu beri benang dan ikatkan gambar rumah tepat di bagian tengah hanger. Lubangi gambar keluarga, yang sudah di gunting kemudian beri benang dan ikat pada hanger.',
            fullDescription:
              'Kegiatan 1: Membuat Gantungan Keluarga (Komunikasi, Kemandirian). Alat dan bahan: Kertas HVS, krayon, pelubang kertas, gunting. Hanger, benang. Cara Membuat: Beri semua anak kertas HVS, kemudian mintalah anak-anak untuk menggambar keluarga mereka (bisa terdiri dari ayah, ibu, kakak, adik, nenek, kakek, paman, bibi) di sesuaikan dengan keluarga masing-masing anak. Selanjutnya mintalah anak-anak untuk menggambarkan rumah di kertas HVS yang berbeda. Jika sudah selesai menggambar mintalah anak-anak untuk mewarnai gambar dan menggunting gambar sesuai dengan pola gambar. Siapkan hanger, kemudian gunting gambar rumah, dan lubangi bagian tepinya lalu beri benang dan ikatkan gambar rumah tepat di bagian tengah hanger. Lubangi gambar keluarga, yang sudah di gunting kemudian beri benang dan ikat pada hanger.',
          },
          {
            activityNumber: 2,
            title: 'Permainan Kata Berantai Bahasa Daerah (Komunikasi, Penalaran Kritis)',
            toolsAndMaterials: 'Kartu kata dalam berbagai bahasa daerah, kotak atau wadah',
            howToPlay:
              'Anak-anak duduk melingkar. Satu anak mengambil kartu, menyebutkan kata dalam bahasa daerah, dan memberikan artinya. Anak berikutnya harus mengambil kartu dengan kata yang berawalan huruf terakhir dari kata sebelumnya. Ini mengajarkan keberagaman bahasa dan kerjasama dalam permainan.',
            fullDescription:
              'Kegiatan 2: Permainan Kata Berantai Bahasa Daerah (Komunikasi, Penalaran Kritis). Alat dan bahan: Kartu kata dalam berbagai bahasa daerah, kotak atau wadah. Cara bermain: Anak-anak duduk melingkar. Satu anak mengambil kartu, menyebutkan kata dalam bahasa daerah, dan memberikan artinya. Anak berikutnya harus mengambil kartu dengan kata yang berawalan huruf terakhir dari kata sebelumnya. Ini mengajarkan keberagaman bahasa dan kerjasama dalam permainan.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Peta Timbul Indonesia (Kolaborasi, Kreativitas)',
            toolsAndMaterials:
              'Adonan playdough atau tanah liat, peta Indonesia sebagai panduan, berbagai biji-bijian atau kerikil',
            howToPlay:
              'Anak-anak bekerja sama membuat peta timbul Indonesia. Setiap anak bertanggung jawab untuk membentuk pulau atau kepulauan tertentu. Gunakan biji-bijian atau kerikil untuk menandai kota-kota penting. Diskusikan bagaimana setiap pulau adalah bagian penting dari Indonesia.',
            fullDescription:
              'Kegiatan 3: Membuat Peta Timbul Indonesia (Kolaborasi, Kreativitas). Alat dan bahan: Adonan playdough atau tanah liat, peta Indonesia sebagai panduan, berbagai biji-bijian atau kerikil. Cara bermain: Anak-anak bekerja sama membuat peta timbul Indonesia. Setiap anak bertanggung jawab untuk membentuk pulau atau kepulauan tertentu. Gunakan biji-bijian atau kerikil untuk menandai kota-kota penting. Diskusikan bagaimana setiap pulau adalah bagian penting dari Indonesia.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Roket Terbang (Kreativitas, Kemandirian). Alat dan Bahan: Kertas Konstruksi hitam, benang, lem, solatip, gunting, pelubang buku, prin table gambar roket, bintang dan bulan, krayon. Cara Membuat: Siapkan prin table gambar roket, bintang dan bulan, kemudian, beri warna dengan krayon. Jika sudah di beri warna, gunting kemudian rekatkan bulan, dan Bintang di atas kertas konstruksi hitam. Lubangi bagian atas dan bawah kertas hitam menggunakan pelubang. Siapkan benang kemudian rekatkan benang dengan roket menggunakan selitop. Masukkan ke dua ujung benang ke dalam ke dua lubang yangsudah di buat (baian atas dan bawah. Kemudian balik kertas dan ikat benang. Roket siap terbang dengan cara rarik ke atas dan kebawah. Kegiatan 2 : Membuat Cetak Daun (Kreativitas, Kesehatan). Alat dan bahan: Daun-daun segar, cat poster, kertas. Cara bermain: Oleskan cat pada salah satu sisi daun, lalu tekankan daun tersebut pada kertas untuk membuat cetakan. Biarkan anak-anak bereksperimen dengan berbagai jenis daun dan warna. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang bentuk dan tekstur. Kegiatan 3 : Pohon Persahabatan (Kolaborasi, Komunikasi). Alat dan Bahan: Kertas besar dan cat. Cara Bermain: Anak-anak menggambar pohon besar dan menempelkan berbagai gambar hasil karya mereka di cabang-cabang pohon, menggambarkan perbedaan yang membuat mereka satu.',
        activities: [
          {
            activityNumber: 1,
            title: 'Roket Terbang (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Kertas Konstruksi hitam, benang, lem, solatip, gunting, pelubang buku, prin table gambar roket, bintang dan bulan, krayon',
            howToPlay:
              'Siapkan prin table gambar roket, bintang dan bulan, kemudian, beri warna dengan krayon. Jika sudah di beri warna, gunting kemudian rekatkan bulan, dan Bintang di atas kertas konstruksi hitam. Lubangi bagian atas dan bawah kertas hitam menggunakan pelubang. Siapkan benang kemudian rekatkan benang dengan roket menggunakan selitop. Masukkan ke dua ujung benang ke dalam ke dua lubang yangsudah di buat (baian atas dan bawah. Kemudian balik kertas dan ikat benang. Roket siap terbang dengan cara rarik ke atas dan kebawah.',
            fullDescription:
              'Kegiatan 1: Roket Terbang (Kreativitas, Kemandirian). Alat dan Bahan: Kertas Konstruksi hitam, benang, lem, solatip, gunting, pelubang buku, prin table gambar roket, bintang dan bulan, krayon. Cara Membuat: Siapkan prin table gambar roket, bintang dan bulan, kemudian, beri warna dengan krayon. Jika sudah di beri warna, gunting kemudian rekatkan bulan, dan Bintang di atas kertas konstruksi hitam. Lubangi bagian atas dan bawah kertas hitam menggunakan pelubang. Siapkan benang kemudian rekatkan benang dengan roket menggunakan selitop. Masukkan ke dua ujung benang ke dalam ke dua lubang yangsudah di buat (baian atas dan bawah. Kemudian balik kertas dan ikat benang. Roket siap terbang dengan cara rarik ke atas dan kebawah.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Cetak Daun (Kreativitas, Kesehatan)',
            toolsAndMaterials: 'Daun-daun segar, cat poster, kertas',
            howToPlay:
              'Oleskan cat pada salah satu sisi daun, lalu tekankan daun tersebut pada kertas untuk membuat cetakan. Biarkan anak-anak bereksperimen dengan berbagai jenis daun dan warna. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang bentuk dan tekstur.',
            fullDescription:
              'Kegiatan 2: Membuat Cetak Daun (Kreativitas, Kesehatan). Alat dan bahan: Daun-daun segar, cat poster, kertas. Cara bermain: Oleskan cat pada salah satu sisi daun, lalu tekankan daun tersebut pada kertas untuk membuat cetakan. Biarkan anak-anak bereksperimen dengan berbagai jenis daun dan warna. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang bentuk dan tekstur.',
          },
          {
            activityNumber: 3,
            title: 'Pohon Persahabatan (Kolaborasi, Komunikasi)',
            toolsAndMaterials: 'Kertas besar dan cat',
            howToPlay:
              'Anak-anak menggambar pohon besar dan menempelkan berbagai gambar hasil karya mereka di cabang-cabang pohon, menggambarkan perbedaan yang membuat mereka satu.',
            fullDescription:
              'Kegiatan 3: Pohon Persahabatan (Kolaborasi, Komunikasi). Alat dan Bahan: Kertas besar dan cat. Cara Bermain: Anak-anak menggambar pohon besar dan menempelkan berbagai gambar hasil karya mereka di cabang-cabang pohon, menggambarkan perbedaan yang membuat mereka satu.',
          },
        ],
      },
    ],
    closingActivities: [
      'Recalling kegiatan hari ini dengan tepuk tangan semangat dan tanya jawab ceria',
      'Parade hasil karya: anak menunjukkan hasil karya dengan bangga sambil bercerita',
      'Yel-yel persahabatan dan lagu penutup tentang keberagaman dengan gerakan riang',
      'Lingkaran apresiasi: anak saling memuji dan berterima kasih atas kebersamaan',
      'Games tebak kegiatan esok hari dengan clue menarik yang membuat penasaran',
      'Doa penutup dengan penuh syukur dan semangat, diikuti high-five dengan teman',
      'Pembiasaan saat pulang: merapikan tas sambil bernyanyi dan pulang dengan senyum',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak mampu menyebutkan nama teman yang berbeda dengan dirinya dan menjelaskan perbedaannya',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan reaksi positif saat melihat gambar anak-anak dari berbagai suku dan agama',
      },
      {
        no: 3,
        indicator: 'Anak dapat menyebutkan minimal 2 pakaian adat atau makanan dari daerah berbeda',
      },
      {
        no: 4,
        indicator:
          'Anak menunjukkan sikap inklusif dengan mengajak teman berbeda untuk bermain bersama',
      },
      {
        no: 5,
        indicator:
          'Anak mampu bekerja sama dengan teman yang berbeda latar belakang dalam kegiatan kelompok',
      },
      {
        no: 6,
        indicator: 'Anak menggunakan kata-kata positif saat membicarakan perbedaan teman-temannya',
      },
      {
        no: 7,
        indicator: 'Anak menunjukkan antusiasme saat mendengar cerita tentang keberagaman budaya',
      },
      {
        no: 8,
        indicator: 'Anak bersedia berbagi alat dan bahan bermain dengan teman yang berbeda',
      },
      {
        no: 9,
        indicator: 'Anak dapat menceritakan makna dari karya yang dibuatnya terkait keberagaman',
      },
      {
        no: 10,
        indicator: 'Anak mampu mengekspresikan rasa syukur atas perbedaan sebagai ciptaan Tuhan',
      },
      {
        no: 11,
        indicator:
          'Anak menunjukkan konsistensi sikap toleransi dalam interaksi sehari-hari selama pembelajaran',
      },
      {
        no: 12,
        indicator:
          'Anak dapat menggambar dan menceritakan tentang teman-teman istimewa yang berbeda dengannya',
      },
    ],
    assessmentSteps: {
      initial: [
        'Ajukan pertanyaan terbuka: Siapa teman kalian yang berbeda dengan kalian?',
        'Tunjukkan gambar anak-anak berbeda suku/agama, amati reaksi dan komentar anak',
        'Lakukan permainan Tebak Asal Daerah dari foto pakaian adat, catat pengetahuan awal',
        'Amati interaksi spontan anak dengan teman yang berbeda saat bermain bebas',
        'Dokumentasikan respons anak terhadap cerita singkat tentang perbedaan budaya',
      ],
      process: [
        'Foto dan video interaksi anak saat kegiatan kelompok dengan teman berbeda',
        'Catat dialog anak tentang perbedaan selama aktivitas bermain',
        'Amati dan dokumentasikan ekspresi anak saat mendengar cerita keberagaman',
        'Rekam kemampuan anak berbagi alat/bahan dengan teman yang berbeda',
        'Pantau konsistensi sikap toleransi anak dari hari ke hari',
        'Dokumentasikan hasil karya anak dan cerita di balik pembuatannya',
      ],
      final: [
        'Minta anak mempresentasikan satu karya favorit dan jelaskan maknanya',
        'Lakukan wawancara sederhana: Apa yang kamu pelajari tentang teman-teman yang berbeda?',
        'Amati bermain bebas anak, catat sikap inklusif yang ditunjukkan',
        'Minta anak menggambar Teman-teman Istimewaku dan ceritakan gambarnya',
        'Evaluasi kemampuan anak mengajak teman berbeda untuk bermain bersama',
        'Dokumentasikan refleksi anak tentang kegiatan pembelajaran keberagaman',
      ],
    },
  },
  {
    weekNum: 4,
    filename: '40_TK_B_Smt1_04_P5_Kemerdekaan.docx',
    title: 'MERAYAKAN KEMERDEKAAN',
    topic: 'AKU CINTA INDONESIA',
    subtopic: 'HARI MERDEKA',
    modelPembelajaran: 'Projek Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Agustus 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: true,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun sudah memiliki kemampuan kognitif yang lebih matang dalam memahami konsep abstrak seperti sejarah dan nasionalisme dalam bentuk sederhana. Mereka mampu mengingat informasi yang diberikan melalui cerita dan menghubungkannya dengan pengalaman nyata. Karakteristik sosial-emosional mereka menunjukkan kemampuan untuk memahami konsep kebersamaan, kebanggaan, dan rasa memiliki terhadap kelompok. Kemampuan motorik halus dan kasar sudah berkembang baik untuk kegiatan seni dan permainan kompetitif. Mereka antusias terhadap aktivitas yang melibatkan drama, bernyanyi, dan berkarya. Latar belakang keluarga yang beragam memberikan variasi pemahaman tentang konsep cinta tanah air dan tradisi kemerdekaan.',
      learningMaterial:
        'Materi mengintegrasikan pengetahuan faktual tentang sejarah kemerdekaan Indonesia dan simbol-simbol negara, konseptual tentang nilai patriotisme dan kebangsaan, prosedural dalam berkarya seni dan permainan tradisional, dan metakognitif melalui refleksi kebanggaan sebagai warga negara Indonesia. Relevan dengan pengalaman anak dalam perayaan kemerdekaan di lingkungan keluarga dan masyarakat. Tingkat kesulitan dirancang bertahap dari mengenal simbol hingga mengekspresikan rasa cinta tanah air melalui karya dan tindakan nyata. MERAYAKAN KEMERDEKAAN Sejarah Kemerdekaan Cerita perjuangan sederhana Pahlawan kemerdekaan Tanggal 17 Agustus 1945 Simbol-simbol Negara Bendera Merah Putih Lagu Indonesia Raya Lambang Garuda Pancasila Makna warna dan simbol Nilai-nilai Patriotisme Cinta tanah air Menghargai perbedaan Persatuan dan kesatuan Semangat gotong royong Ekspresi Cinta Tanah Air Karya seni patriotik Permainan tradisional Lomba kemerdekaan Upacara bendera sederhana',
    },
    learningDesign: {
      cp: 'Dimensi Berkebinekaan Global; Elemen: Mengenal dan menghargai budaya; Subelemen: Mendalami budaya dan identitas budaya; CP Akhir: Mengenali identitas diri dan kebiasaan-kebiasaan budaya dalam keluarga Dimensi Berkebinekaan Global; Elemen: Berkeadilan sosial; Subelemen: Memahami peran individu dalam demokrasi; CP Akhir: Mulai mengenali keberadaan dan perannya dalam lingkungan keluarga dan sekolah Dimensi Bergotong Royong; Elemen: Kolaborasi; Subelemen: Kerja sama; CP Akhir: Terbiasa bekerja bersama dalam melakukan kegiatan dengan kelompok (melibatkan dua atau lebih orang) Dimensi Kreatif; Elemen: Menghasilkan karya dan tindakan yang orisinal; CP Akhir: Mengeksplorasi dan mengekspresikan pikiran dan/atau perasaannya dalam bentuk karya dan/atau tindakan sederhana serta mengapresiasi karya dan tindakan yang dihasilkan Dimensi Mandiri; Elemen: Pemahaman diri dan situasi yang dihadapi; Subelemen: Mengenali kualitas dan minat diri; CP Akhir: Mengenali kemampuan dan minat/kesukaan diri serta menerima keberadaan dan keunikan diri sendiri',
      crossDisciplinary:
        'Nilai Pancasila (pemahaman persatuan, kesatuan, dan keadilan sosial), Sejarah (pengenalan peristiwa kemerdekaan dengan bahasa sederhana), Fisik Motorik (keterampilan motorik halus dalam berkarya seni dan motorik kasar dalam permainan tradisional), Kognitif (pemahaman konsep waktu, sebab-akibat, dan identifikasi simbol), Bahasa (bercerita pengalaman, menyanyikan lagu nasional, dan komunikasi dalam presentasi), Sosial Emosional (pengembangan rasa bangga, kerjasama tim, dan empati terhadap perjuangan pahlawan).',
      tp: 'Setelah mengikuti projek selama 1 minggu, peserta didik mampu mengintegrasikan pemahaman dasar tentang kemerdekaan Indonesia dengan nilai-nilai patriotisme dan kebangsaan melalui pengalaman bermakna dalam berkarya seni, permainan tradisional, dan ekspresi kreatif yang merefleksikan rasa cinta tanah air dan kebanggaan sebagai warga negara Indonesia.',
      pedagogicalPractice:
        'Guru berperan sebagai fasilitator dan pendamping dalam mengembangkan rasa nasionalisme anak melalui pengalaman langsung yang menyenangkan. Menggunakan model Pembelajaran Berbasis Projek Kolaboratif dengan strategi pembelajaran melalui cerita interaktif, bermain peran sejarah, dan eksplorasi kreatif serta pendekatan belajar sambil bermain dalam kelompok.',
      partnership:
        'Melibatkan kolaborasi internal antar guru dalam persiapan materi sejarah yang sesuai usia, kemitraan eksternal dengan tokoh masyarakat atau veteran untuk sharing pengalaman kemerdekaan, koordinasi dengan orang tua dalam persiapan kostum dan properti lomba, serta peer learning melalui kerjasama antar peserta didik dalam kelompok projek dan kompetisi sehat antar tim.',
      environment:
        'Mengintegrasikan ruang fisik kelas dengan dekorasi bernuansa kemerdekaan dan learning center patriotik, ruang outdoor untuk permainan tradisional dan upacara bendera, dan budaya belajar yang menumbuhkan rasa bangga dan cinta tanah air melalui aktivitas yang menyenangkan.',
      digitalUtilization:
        'Penggunaan video pembelajaran interaktif dan buku cerita digital untuk memperkenalkan jenis-jenis pakaian dan cara berpakaian yang baik. Pemanfaatan media audio untuk lagu-lagu tematik tentang pakaian yang mendukung pembelajaran melalui music and movement. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [],
    openingQuestions: [],
    coreDays: [
      {
        day: 1,
        phase: 'RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN',
        rawContent:
          'HARI 1: MENGENAL SEJARAH KEMERDEKAAN INDONESIA** Penguatan Karakter Utama: BERKEBINEKAAN GLOBAL & KEWARGAANKegiatan Awal (15 menit)Prinsip: Berkesadaran - Membangun kesadaran sejarah bangsaPembuka Inspiratif Perjalanan Waktu ke 17 Agustus 1945Guru menyambut anak dengan mengenakan kostum sederhana ala pejuang kemerdekaanMenciptakan suasana nostalgia dengan musik instrumental lagu nasionalOrientasi bermakna: Hari ini kita akan melakukan perjalanan waktu yang sangat istimewaDimensi Profil Lulusan: Berkebinekaan Global (memahami sejarah bangsa), Kewargaan (mengenal identitas nasional)Kegiatan Inti (40 menit)MEMAHAMI (15 menit) Prinsip: Berkesadaran - Memahami peristiwa bersejarah dengan cara menyenangkanAktivitas: Time Travel Story Proklamasi KemerdekaanGuru bercerita interaktif tentang proklamasi kemerdekaan menggunakan alat peraga sederhanaAnak-anak diajak bermain peran sebagai rakyat yang mendengar proklamasiPengenalan tokoh Soekarno-Hatta dengan cara yang mudah dipahami anakDimensi Profil Lulusan: Berkebinekaan Global (memahami sejarah bangsa), Bernalar Kritis (memahami sebab-akibat), Komunikasi (mendengarkan cerita aktif)MENGAPLIKASI (15 menit) Prinsip: Bermakna - Menghubungkan sejarah dengan pengalaman konkretAktivitas: Dramatic Play Detik-Detik ProklamasiAnak dibagi kelompok untuk memerankan moment proklamasi sederhanaMenggunakan properti sederhana: bendera kecil, mikrofon mainan, kostumSetiap kelompok mendapat giliran menjadi Bung Karno yang membacakan proklamasiDimensi Profil Lulusan: Kreatif (interpretasi drama sejarah), Bergotong Royong (kerjasama dalam drama), Kewargaan (menghayati moment bersejarah)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Mengekspresikan perasaan banggaAktivitas: Pride Expression Perasaan MerdekaAnak menggambar ekspresi wajah mereka saat mendengar cerita kemerdekaanBerbagi perasaan: Bagaimana rasanya kalau kita hidup di zaman penjajahan vs zaman merdeka?Dimensi Profil Lulusan: Mandiri (mengekspresikan perasaan personal), Komunikasi (berbagi emosi), Kreatif (ekspresi visual)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Menumbuhkan semangat patriotismeMenyanyikan lagu Hari Merdeka dengan gerakan sederhanaPreview esok: Besok kita akan menjadi detektif simbol-simbol negara kita!Doa syukur atas kemerdekaan yang dimiliki IndonesiaDimensi Profil Lulusan: Beriman Bertakwa (bersyukur atas kemerdekaan), Kewargaan (ekspresi nasionalisme), Bergotong Royong (bernyanyi bersama)',
        activities: [
          {
            activityNumber: 1,
            title: 'Kegiatan 1',
            toolsAndMaterials: '',
            howToPlay:
              'HARI 1: MENGENAL SEJARAH KEMERDEKAAN INDONESIA** Penguatan Karakter Utama: BERKEBINEKAAN GLOBAL & KEWARGAANKegiatan Awal (15 menit)Prinsip: Berkesadaran - Membangun kesadaran sejarah bangsaPembuka Inspiratif Perjalanan Waktu ke 17 Agustus 1945Guru menyambut anak dengan mengenakan kostum sederhana ala pejuang kemerdekaanMenciptakan suasana nostalgia dengan musik instrumental lagu nasionalOrientasi bermakna: Hari ini kita akan melakukan perjalanan waktu yang sangat istimewaDimensi Profil Lulusan: Berkebinekaan Global (memahami sejarah bangsa), Kewargaan (mengenal identitas nasional)Kegiatan Inti (40 menit)MEMAHAMI (15 menit) Prinsip: Berkesadaran - Memahami peristiwa bersejarah dengan cara menyenangkanAktivitas: Time Travel Story Proklamasi KemerdekaanGuru bercerita interaktif tentang proklamasi kemerdekaan menggunakan alat peraga sederhanaAnak-anak diajak bermain peran sebagai rakyat yang mendengar proklamasiPengenalan tokoh Soekarno-Hatta dengan cara yang mudah dipahami anakDimensi Profil Lulusan: Berkebinekaan Global (memahami sejarah bangsa), Bernalar Kritis (memahami sebab-akibat), Komunikasi (mendengarkan cerita aktif)MENGAPLIKASI (15 menit) Prinsip: Bermakna - Menghubungkan sejarah dengan pengalaman konkretAktivitas: Dramatic Play Detik-Detik ProklamasiAnak dibagi kelompok untuk memerankan moment proklamasi sederhanaMenggunakan properti sederhana: bendera kecil, mikrofon mainan, kostumSetiap kelompok mendapat giliran menjadi Bung Karno yang membacakan proklamasiDimensi Profil Lulusan: Kreatif (interpretasi drama sejarah), Bergotong Royong (kerjasama dalam drama), Kewargaan (menghayati moment bersejarah)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Mengekspresikan perasaan banggaAktivitas: Pride Expression Perasaan MerdekaAnak menggambar ekspresi wajah mereka saat mendengar cerita kemerdekaanBerbagi perasaan: Bagaimana rasanya kalau kita hidup di zaman penjajahan vs zaman merdeka?Dimensi Profil Lulusan: Mandiri (mengekspresikan perasaan personal), Komunikasi (berbagi emosi), Kreatif (ekspresi visual)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Menumbuhkan semangat patriotismeMenyanyikan lagu Hari Merdeka dengan gerakan sederhanaPreview esok: Besok kita akan menjadi detektif simbol-simbol negara kita!Doa syukur atas kemerdekaan yang dimiliki IndonesiaDimensi Profil Lulusan: Beriman Bertakwa (bersyukur atas kemerdekaan), Kewargaan (ekspresi nasionalisme), Bergotong Royong (bernyanyi bersama)',
            fullDescription:
              'HARI 1: MENGENAL SEJARAH KEMERDEKAAN INDONESIA** Penguatan Karakter Utama: BERKEBINEKAAN GLOBAL & KEWARGAANKegiatan Awal (15 menit)Prinsip: Berkesadaran - Membangun kesadaran sejarah bangsaPembuka Inspiratif Perjalanan Waktu ke 17 Agustus 1945Guru menyambut anak dengan mengenakan kostum sederhana ala pejuang kemerdekaanMenciptakan suasana nostalgia dengan musik instrumental lagu nasionalOrientasi bermakna: Hari ini kita akan melakukan perjalanan waktu yang sangat istimewaDimensi Profil Lulusan: Berkebinekaan Global (memahami sejarah bangsa), Kewargaan (mengenal identitas nasional)Kegiatan Inti (40 menit)MEMAHAMI (15 menit) Prinsip: Berkesadaran - Memahami peristiwa bersejarah dengan cara menyenangkanAktivitas: Time Travel Story Proklamasi KemerdekaanGuru bercerita interaktif tentang proklamasi kemerdekaan menggunakan alat peraga sederhanaAnak-anak diajak bermain peran sebagai rakyat yang mendengar proklamasiPengenalan tokoh Soekarno-Hatta dengan cara yang mudah dipahami anakDimensi Profil Lulusan: Berkebinekaan Global (memahami sejarah bangsa), Bernalar Kritis (memahami sebab-akibat), Komunikasi (mendengarkan cerita aktif)MENGAPLIKASI (15 menit) Prinsip: Bermakna - Menghubungkan sejarah dengan pengalaman konkretAktivitas: Dramatic Play Detik-Detik ProklamasiAnak dibagi kelompok untuk memerankan moment proklamasi sederhanaMenggunakan properti sederhana: bendera kecil, mikrofon mainan, kostumSetiap kelompok mendapat giliran menjadi Bung Karno yang membacakan proklamasiDimensi Profil Lulusan: Kreatif (interpretasi drama sejarah), Bergotong Royong (kerjasama dalam drama), Kewargaan (menghayati moment bersejarah)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Mengekspresikan perasaan banggaAktivitas: Pride Expression Perasaan MerdekaAnak menggambar ekspresi wajah mereka saat mendengar cerita kemerdekaanBerbagi perasaan: Bagaimana rasanya kalau kita hidup di zaman penjajahan vs zaman merdeka?Dimensi Profil Lulusan: Mandiri (mengekspresikan perasaan personal), Komunikasi (berbagi emosi), Kreatif (ekspresi visual)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Menumbuhkan semangat patriotismeMenyanyikan lagu Hari Merdeka dengan gerakan sederhanaPreview esok: Besok kita akan menjadi detektif simbol-simbol negara kita!Doa syukur atas kemerdekaan yang dimiliki IndonesiaDimensi Profil Lulusan: Beriman Bertakwa (bersyukur atas kemerdekaan), Kewargaan (ekspresi nasionalisme), Bergotong Royong (bernyanyi bersama)',
          },
        ],
      },
      {
        day: 2,
        phase: 'RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN',
        rawContent:
          'HARI 2: MENGENAL SIMBOL-SIMBOL NEGARA** Penguatan Karakter Utama: KEWARGAAN & BERNALAR KRITISKegiatan Awal (15 menit)Prinsip: Berkesadaran - Memahami makna simbol dalam kehidupan berbangsaPembuka Inspiratif Detektif Simbol NegaraGuru menyambut anak dengan mengenakan topi detektif dan kaca pembesarMenunjukkan berbagai simbol negara dalam bentuk teka-teki visualOrientasi bermakna: Hari ini kita akan menjadi detektif yang mencari makna tersembunyi simbol negaraDimensi Profil Lulusan: Kewargaan (mengenal simbol nasional), Bernalar Kritis (investigasi makna simbol), Komunikasi (teka-teki visual)Kegiatan Inti (40 menit)MEMAHAMI (15 menit) Prinsip: Berkesadaran - Memahami makna mendalam simbol negaraAktivitas: Symbol Detective Misteri Bendera Merah PutihAnak mengamati bendera Indonesia dan membandingkan dengan bendera negara lainDiskusi makna warna: Merah = keberanian pahlawan, Putih = hati yang suciEksplorasi simbol lain: Garuda, lagu Indonesia Raya, lambang sila PancasilaDimensi Profil Lulusan: Kewargaan (memahami simbol nasional), Berkebinekaan Global (membandingkan dengan negara lain), Bernalar Kritis (analisis makna)MENGAPLIKASI (15 menit) Prinsip: Bermakna - Mempraktikkan penghormatan terhadap simbol negaraAktivitas: Mini Ceremony Upacara Bendera KecilAnak berlatih upacara bendera sederhana dengan tata cara yang disederhanakanBergiliran menjadi pembawa bendera, pemimpin upacara, dan peserta upacaraMenyanyikan lagu Indonesia Raya dengan sikap hormatDimensi Profil Lulusan: Kewargaan (menghormati simbol negara), Mandiri (mengambil peran tanggung jawab), Bergotong Royong (kerjasama upacara)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Mengekspresikan kebanggaan melalui seniAktivitas: Patriotic Art Bendera ImpiankuAnak mendesain bendera impian mereka dengan menggabungkan elemen IndonesiaBercerita tentang makna warna dan gambar yang mereka pilihDimensi Profil Lulusan: Kreatif (desain bendera personal), Kewargaan (identitas nasional), Komunikasi (presentasi karya)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Komitmen menjaga simbol negaraAnak berkomitmen untuk selalu menghormati bendera dan simbol negaraPreview esok: Besok kita akan menjadi seniman patriot membuat karya kemerdekaan!Hormat kepada bendera dan menyanyikan Tanah AirkuDimensi Profil Lulusan: Kewargaan (komitmen nasionalisme), Beriman Bertakwa (penghormatan), Mandiri (tekad personal)',
        activities: [
          {
            activityNumber: 1,
            title: 'Kegiatan 1',
            toolsAndMaterials: '',
            howToPlay:
              'HARI 2: MENGENAL SIMBOL-SIMBOL NEGARA** Penguatan Karakter Utama: KEWARGAAN & BERNALAR KRITISKegiatan Awal (15 menit)Prinsip: Berkesadaran - Memahami makna simbol dalam kehidupan berbangsaPembuka Inspiratif Detektif Simbol NegaraGuru menyambut anak dengan mengenakan topi detektif dan kaca pembesarMenunjukkan berbagai simbol negara dalam bentuk teka-teki visualOrientasi bermakna: Hari ini kita akan menjadi detektif yang mencari makna tersembunyi simbol negaraDimensi Profil Lulusan: Kewargaan (mengenal simbol nasional), Bernalar Kritis (investigasi makna simbol), Komunikasi (teka-teki visual)Kegiatan Inti (40 menit)MEMAHAMI (15 menit) Prinsip: Berkesadaran - Memahami makna mendalam simbol negaraAktivitas: Symbol Detective Misteri Bendera Merah PutihAnak mengamati bendera Indonesia dan membandingkan dengan bendera negara lainDiskusi makna warna: Merah = keberanian pahlawan, Putih = hati yang suciEksplorasi simbol lain: Garuda, lagu Indonesia Raya, lambang sila PancasilaDimensi Profil Lulusan: Kewargaan (memahami simbol nasional), Berkebinekaan Global (membandingkan dengan negara lain), Bernalar Kritis (analisis makna)MENGAPLIKASI (15 menit) Prinsip: Bermakna - Mempraktikkan penghormatan terhadap simbol negaraAktivitas: Mini Ceremony Upacara Bendera KecilAnak berlatih upacara bendera sederhana dengan tata cara yang disederhanakanBergiliran menjadi pembawa bendera, pemimpin upacara, dan peserta upacaraMenyanyikan lagu Indonesia Raya dengan sikap hormatDimensi Profil Lulusan: Kewargaan (menghormati simbol negara), Mandiri (mengambil peran tanggung jawab), Bergotong Royong (kerjasama upacara)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Mengekspresikan kebanggaan melalui seniAktivitas: Patriotic Art Bendera ImpiankuAnak mendesain bendera impian mereka dengan menggabungkan elemen IndonesiaBercerita tentang makna warna dan gambar yang mereka pilihDimensi Profil Lulusan: Kreatif (desain bendera personal), Kewargaan (identitas nasional), Komunikasi (presentasi karya)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Komitmen menjaga simbol negaraAnak berkomitmen untuk selalu menghormati bendera dan simbol negaraPreview esok: Besok kita akan menjadi seniman patriot membuat karya kemerdekaan!Hormat kepada bendera dan menyanyikan Tanah AirkuDimensi Profil Lulusan: Kewargaan (komitmen nasionalisme), Beriman Bertakwa (penghormatan), Mandiri (tekad personal)',
            fullDescription:
              'HARI 2: MENGENAL SIMBOL-SIMBOL NEGARA** Penguatan Karakter Utama: KEWARGAAN & BERNALAR KRITISKegiatan Awal (15 menit)Prinsip: Berkesadaran - Memahami makna simbol dalam kehidupan berbangsaPembuka Inspiratif Detektif Simbol NegaraGuru menyambut anak dengan mengenakan topi detektif dan kaca pembesarMenunjukkan berbagai simbol negara dalam bentuk teka-teki visualOrientasi bermakna: Hari ini kita akan menjadi detektif yang mencari makna tersembunyi simbol negaraDimensi Profil Lulusan: Kewargaan (mengenal simbol nasional), Bernalar Kritis (investigasi makna simbol), Komunikasi (teka-teki visual)Kegiatan Inti (40 menit)MEMAHAMI (15 menit) Prinsip: Berkesadaran - Memahami makna mendalam simbol negaraAktivitas: Symbol Detective Misteri Bendera Merah PutihAnak mengamati bendera Indonesia dan membandingkan dengan bendera negara lainDiskusi makna warna: Merah = keberanian pahlawan, Putih = hati yang suciEksplorasi simbol lain: Garuda, lagu Indonesia Raya, lambang sila PancasilaDimensi Profil Lulusan: Kewargaan (memahami simbol nasional), Berkebinekaan Global (membandingkan dengan negara lain), Bernalar Kritis (analisis makna)MENGAPLIKASI (15 menit) Prinsip: Bermakna - Mempraktikkan penghormatan terhadap simbol negaraAktivitas: Mini Ceremony Upacara Bendera KecilAnak berlatih upacara bendera sederhana dengan tata cara yang disederhanakanBergiliran menjadi pembawa bendera, pemimpin upacara, dan peserta upacaraMenyanyikan lagu Indonesia Raya dengan sikap hormatDimensi Profil Lulusan: Kewargaan (menghormati simbol negara), Mandiri (mengambil peran tanggung jawab), Bergotong Royong (kerjasama upacara)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Mengekspresikan kebanggaan melalui seniAktivitas: Patriotic Art Bendera ImpiankuAnak mendesain bendera impian mereka dengan menggabungkan elemen IndonesiaBercerita tentang makna warna dan gambar yang mereka pilihDimensi Profil Lulusan: Kreatif (desain bendera personal), Kewargaan (identitas nasional), Komunikasi (presentasi karya)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Komitmen menjaga simbol negaraAnak berkomitmen untuk selalu menghormati bendera dan simbol negaraPreview esok: Besok kita akan menjadi seniman patriot membuat karya kemerdekaan!Hormat kepada bendera dan menyanyikan Tanah AirkuDimensi Profil Lulusan: Kewargaan (komitmen nasionalisme), Beriman Bertakwa (penghormatan), Mandiri (tekad personal)',
          },
        ],
      },
      {
        day: 3,
        phase: 'RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN',
        rawContent:
          'HARI 3: BERKARYA SENI PATRIOTIK** Penguatan Karakter Utama: KREATIF & BERGOTONG ROYONGKegiatan Awal (15 menit)Prinsip: Berkesadaran - Mengekspresikan cinta tanah air melalui seniPembuka Inspiratif Seniman Patriot CilikGuru menunjukkan berbagai karya seni bertema kemerdekaan (lukisan, kerajinan, dll)Anak mengamati dan mendiskusikan pesan yang terkandung dalam karya seniOrientasi bermakna: Hari ini kita akan menjadi seniman patriot yang mengekspresikan cinta IndonesiaDimensi Profil Lulusan: Kreatif (apresiasi seni), Kewargaan (ekspresi patriotisme), Bernalar Kritis (interpretasi karya seni)Kegiatan Inti (40 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami seni sebagai media ekspresi patriotismeAktivitas: Art Gallery Walk Inspirasi Karya PatriotikAnak berkeliling galeri mini karya seni bertema kemerdekaanMengidentifikasi elemen-elemen patriotik dalam setiap karyaDiskusi: Bagaimana seniman mengekspresikan cinta tanah air?Dimensi Profil Lulusan: Kreatif (apresiasi estetika), Kewargaan (interpretasi patriotisme), Berkebinekaan Global (ragam ekspresi seni)MENGAPLIKASI (25 menit) Prinsip: Bermakna - Mewujudkan ekspresi patriotisme dalam karya personalAktivitas: Creative Workshop Lampion Kemerdekaan & Janur KuningAnak dibagi kelompok untuk membuat lampion dari botol bekas dengan hiasan patriotikKelompok lain membuat janur kuning sederhana dari kertas warnaSetiap karya dihias dengan simbol-simbol kemerdekaan dan harapan untuk IndonesiaDimensi Profil Lulusan: Kreatif (menghasilkan karya orisinal), Bergotong Royong (kerjasama kelompok), Kewargaan (ekspresi cinta tanah air)MEREFLEKSI (5 menit) Prinsip: Menggembirakan - Berbagi makna karya dan harapanAktivitas: Artist Sharing Karya dan Harapanku untuk IndonesiaSetiap kelompok mempresentasikan karya mereka dan bercerita tentang harapan untuk IndonesiaSaling mengapresiasi karya dengan memberikan pujian positifDimensi Profil Lulusan: Komunikasi (presentasi karya), Kreatif (refleksi artistik), Kewargaan (harapan untuk bangsa)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Memamerkan karya dengan banggaMemasang karya di galeri kelas sebagai dekorasi kemerdekaanPreview esok: Besok kita akan menjadi atlet juara dalam festival permainan tradisional!Doa agar Indonesia semakin maju dan sejahteraDimensi Profil Lulusan: Kreatif (memamerkan karya), Kewargaan (harapan bangsa), Beriman Bertakwa (doa untuk negara)',
        activities: [
          {
            activityNumber: 1,
            title: 'Kegiatan 1',
            toolsAndMaterials: '',
            howToPlay:
              'HARI 3: BERKARYA SENI PATRIOTIK** Penguatan Karakter Utama: KREATIF & BERGOTONG ROYONGKegiatan Awal (15 menit)Prinsip: Berkesadaran - Mengekspresikan cinta tanah air melalui seniPembuka Inspiratif Seniman Patriot CilikGuru menunjukkan berbagai karya seni bertema kemerdekaan (lukisan, kerajinan, dll)Anak mengamati dan mendiskusikan pesan yang terkandung dalam karya seniOrientasi bermakna: Hari ini kita akan menjadi seniman patriot yang mengekspresikan cinta IndonesiaDimensi Profil Lulusan: Kreatif (apresiasi seni), Kewargaan (ekspresi patriotisme), Bernalar Kritis (interpretasi karya seni)Kegiatan Inti (40 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami seni sebagai media ekspresi patriotismeAktivitas: Art Gallery Walk Inspirasi Karya PatriotikAnak berkeliling galeri mini karya seni bertema kemerdekaanMengidentifikasi elemen-elemen patriotik dalam setiap karyaDiskusi: Bagaimana seniman mengekspresikan cinta tanah air?Dimensi Profil Lulusan: Kreatif (apresiasi estetika), Kewargaan (interpretasi patriotisme), Berkebinekaan Global (ragam ekspresi seni)MENGAPLIKASI (25 menit) Prinsip: Bermakna - Mewujudkan ekspresi patriotisme dalam karya personalAktivitas: Creative Workshop Lampion Kemerdekaan & Janur KuningAnak dibagi kelompok untuk membuat lampion dari botol bekas dengan hiasan patriotikKelompok lain membuat janur kuning sederhana dari kertas warnaSetiap karya dihias dengan simbol-simbol kemerdekaan dan harapan untuk IndonesiaDimensi Profil Lulusan: Kreatif (menghasilkan karya orisinal), Bergotong Royong (kerjasama kelompok), Kewargaan (ekspresi cinta tanah air)MEREFLEKSI (5 menit) Prinsip: Menggembirakan - Berbagi makna karya dan harapanAktivitas: Artist Sharing Karya dan Harapanku untuk IndonesiaSetiap kelompok mempresentasikan karya mereka dan bercerita tentang harapan untuk IndonesiaSaling mengapresiasi karya dengan memberikan pujian positifDimensi Profil Lulusan: Komunikasi (presentasi karya), Kreatif (refleksi artistik), Kewargaan (harapan untuk bangsa)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Memamerkan karya dengan banggaMemasang karya di galeri kelas sebagai dekorasi kemerdekaanPreview esok: Besok kita akan menjadi atlet juara dalam festival permainan tradisional!Doa agar Indonesia semakin maju dan sejahteraDimensi Profil Lulusan: Kreatif (memamerkan karya), Kewargaan (harapan bangsa), Beriman Bertakwa (doa untuk negara)',
            fullDescription:
              'HARI 3: BERKARYA SENI PATRIOTIK** Penguatan Karakter Utama: KREATIF & BERGOTONG ROYONGKegiatan Awal (15 menit)Prinsip: Berkesadaran - Mengekspresikan cinta tanah air melalui seniPembuka Inspiratif Seniman Patriot CilikGuru menunjukkan berbagai karya seni bertema kemerdekaan (lukisan, kerajinan, dll)Anak mengamati dan mendiskusikan pesan yang terkandung dalam karya seniOrientasi bermakna: Hari ini kita akan menjadi seniman patriot yang mengekspresikan cinta IndonesiaDimensi Profil Lulusan: Kreatif (apresiasi seni), Kewargaan (ekspresi patriotisme), Bernalar Kritis (interpretasi karya seni)Kegiatan Inti (40 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami seni sebagai media ekspresi patriotismeAktivitas: Art Gallery Walk Inspirasi Karya PatriotikAnak berkeliling galeri mini karya seni bertema kemerdekaanMengidentifikasi elemen-elemen patriotik dalam setiap karyaDiskusi: Bagaimana seniman mengekspresikan cinta tanah air?Dimensi Profil Lulusan: Kreatif (apresiasi estetika), Kewargaan (interpretasi patriotisme), Berkebinekaan Global (ragam ekspresi seni)MENGAPLIKASI (25 menit) Prinsip: Bermakna - Mewujudkan ekspresi patriotisme dalam karya personalAktivitas: Creative Workshop Lampion Kemerdekaan & Janur KuningAnak dibagi kelompok untuk membuat lampion dari botol bekas dengan hiasan patriotikKelompok lain membuat janur kuning sederhana dari kertas warnaSetiap karya dihias dengan simbol-simbol kemerdekaan dan harapan untuk IndonesiaDimensi Profil Lulusan: Kreatif (menghasilkan karya orisinal), Bergotong Royong (kerjasama kelompok), Kewargaan (ekspresi cinta tanah air)MEREFLEKSI (5 menit) Prinsip: Menggembirakan - Berbagi makna karya dan harapanAktivitas: Artist Sharing Karya dan Harapanku untuk IndonesiaSetiap kelompok mempresentasikan karya mereka dan bercerita tentang harapan untuk IndonesiaSaling mengapresiasi karya dengan memberikan pujian positifDimensi Profil Lulusan: Komunikasi (presentasi karya), Kreatif (refleksi artistik), Kewargaan (harapan untuk bangsa)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Memamerkan karya dengan banggaMemasang karya di galeri kelas sebagai dekorasi kemerdekaanPreview esok: Besok kita akan menjadi atlet juara dalam festival permainan tradisional!Doa agar Indonesia semakin maju dan sejahteraDimensi Profil Lulusan: Kreatif (memamerkan karya), Kewargaan (harapan bangsa), Beriman Bertakwa (doa untuk negara)',
          },
        ],
      },
      {
        day: 4,
        phase: 'RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN',
        rawContent:
          'HARI 4: FESTIVAL PERMAINAN TRADISIONAL** Penguatan Karakter Utama: BERKEBINEKAAN GLOBAL & KESEHATANKegiatan Awal (15 menit)Prinsip: Berkesadaran - Mengenal kekayaan budaya permainan tradisionalPembuka Inspiratif Olimpiade NusantaraGuru mengenakan kostum olahraga dengan aksesoris tradisional IndonesiaMenunjukkan berbagai alat permainan tradisional: egrang, bakiak, kelereng, dllOrientasi bermakna: Hari ini kita akan menjadi atlet juara dalam Olimpiade Nusantara!Dimensi Profil Lulusan: Berkebinekaan Global (mengenal budaya tradisional), Kesehatan (semangat olahraga), Kewargaan (bangga budaya lokal)Kegiatan Inti (45 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami nilai budaya dalam permainan tradisionalAktivitas: Cultural Sports Briefing Permainan Nenek MoyangGuru menjelaskan asal-usul dan filosofi permainan tradisional IndonesiaAnak mengamati dan mencoba memegang berbagai alat permainan tradisionalDiskusi: Mengapa nenek moyang kita membuat permainan seperti ini?Dimensi Profil Lulusan: Berkebinekaan Global (memahami warisan budaya), Bernalar Kritis (filosofi permainan), Kesehatan (pengenalan aktivitas fisik)MENGAPLIKASI (30 menit) Prinsip: Bermakna - Mempraktikkan permainan tradisional dalam kompetisi sehatAktivitas: Traditional Games Festival Lomba 17 Agustus CilikLomba Estafet Bendera (10 menit): Tim berlari sambil membawa bendera IndonesiaLomba Bakiak Berpasangan (10 menit): Kerjasama berjalan dengan bakiak kayuLomba Memasukkan Paku ke Botol (10 menit): Ketangkasan dan konsentrasiDimensi Profil Lulusan: Kesehatan (aktivitas fisik), Bergotong Royong (kerjasama tim), Mandiri (sportivitas dan keberanian)MEREFLEKSI (5 menit) Prinsip: Menggembirakan - Merayakan pencapaian dan sportivitasAktivitas: Victory Circle Juara SejatiSemua anak berkumpul melingkar untuk apresiasi pencapaianMemberikan medali sederhana untuk semua peserta dengan kategori unik masing-masingDimensi Profil Lulusan: Mandiri (menerima apresiasi), Bergotong Royong (menghargai teman), Kesehatan (refleksi aktivitas fisik)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Komitmen melestarikan budayaAnak berkomitmen untuk mengajarkan permainan tradisional kepada adik atau temanPreview esok: Besok kita akan menjadi presenter budaya dalam parade keragaman!Yel-yel sederhana: Indonesia Juara!Dimensi Profil Lulusan: Berkebinekaan Global (komitmen pelestarian budaya), Kewargaan (semangat nasionalisme), Komunikasi (yel-yel bersama)',
        activities: [
          {
            activityNumber: 1,
            title: 'Kegiatan 1',
            toolsAndMaterials: '',
            howToPlay:
              'HARI 4: FESTIVAL PERMAINAN TRADISIONAL** Penguatan Karakter Utama: BERKEBINEKAAN GLOBAL & KESEHATANKegiatan Awal (15 menit)Prinsip: Berkesadaran - Mengenal kekayaan budaya permainan tradisionalPembuka Inspiratif Olimpiade NusantaraGuru mengenakan kostum olahraga dengan aksesoris tradisional IndonesiaMenunjukkan berbagai alat permainan tradisional: egrang, bakiak, kelereng, dllOrientasi bermakna: Hari ini kita akan menjadi atlet juara dalam Olimpiade Nusantara!Dimensi Profil Lulusan: Berkebinekaan Global (mengenal budaya tradisional), Kesehatan (semangat olahraga), Kewargaan (bangga budaya lokal)Kegiatan Inti (45 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami nilai budaya dalam permainan tradisionalAktivitas: Cultural Sports Briefing Permainan Nenek MoyangGuru menjelaskan asal-usul dan filosofi permainan tradisional IndonesiaAnak mengamati dan mencoba memegang berbagai alat permainan tradisionalDiskusi: Mengapa nenek moyang kita membuat permainan seperti ini?Dimensi Profil Lulusan: Berkebinekaan Global (memahami warisan budaya), Bernalar Kritis (filosofi permainan), Kesehatan (pengenalan aktivitas fisik)MENGAPLIKASI (30 menit) Prinsip: Bermakna - Mempraktikkan permainan tradisional dalam kompetisi sehatAktivitas: Traditional Games Festival Lomba 17 Agustus CilikLomba Estafet Bendera (10 menit): Tim berlari sambil membawa bendera IndonesiaLomba Bakiak Berpasangan (10 menit): Kerjasama berjalan dengan bakiak kayuLomba Memasukkan Paku ke Botol (10 menit): Ketangkasan dan konsentrasiDimensi Profil Lulusan: Kesehatan (aktivitas fisik), Bergotong Royong (kerjasama tim), Mandiri (sportivitas dan keberanian)MEREFLEKSI (5 menit) Prinsip: Menggembirakan - Merayakan pencapaian dan sportivitasAktivitas: Victory Circle Juara SejatiSemua anak berkumpul melingkar untuk apresiasi pencapaianMemberikan medali sederhana untuk semua peserta dengan kategori unik masing-masingDimensi Profil Lulusan: Mandiri (menerima apresiasi), Bergotong Royong (menghargai teman), Kesehatan (refleksi aktivitas fisik)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Komitmen melestarikan budayaAnak berkomitmen untuk mengajarkan permainan tradisional kepada adik atau temanPreview esok: Besok kita akan menjadi presenter budaya dalam parade keragaman!Yel-yel sederhana: Indonesia Juara!Dimensi Profil Lulusan: Berkebinekaan Global (komitmen pelestarian budaya), Kewargaan (semangat nasionalisme), Komunikasi (yel-yel bersama)',
            fullDescription:
              'HARI 4: FESTIVAL PERMAINAN TRADISIONAL** Penguatan Karakter Utama: BERKEBINEKAAN GLOBAL & KESEHATANKegiatan Awal (15 menit)Prinsip: Berkesadaran - Mengenal kekayaan budaya permainan tradisionalPembuka Inspiratif Olimpiade NusantaraGuru mengenakan kostum olahraga dengan aksesoris tradisional IndonesiaMenunjukkan berbagai alat permainan tradisional: egrang, bakiak, kelereng, dllOrientasi bermakna: Hari ini kita akan menjadi atlet juara dalam Olimpiade Nusantara!Dimensi Profil Lulusan: Berkebinekaan Global (mengenal budaya tradisional), Kesehatan (semangat olahraga), Kewargaan (bangga budaya lokal)Kegiatan Inti (45 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami nilai budaya dalam permainan tradisionalAktivitas: Cultural Sports Briefing Permainan Nenek MoyangGuru menjelaskan asal-usul dan filosofi permainan tradisional IndonesiaAnak mengamati dan mencoba memegang berbagai alat permainan tradisionalDiskusi: Mengapa nenek moyang kita membuat permainan seperti ini?Dimensi Profil Lulusan: Berkebinekaan Global (memahami warisan budaya), Bernalar Kritis (filosofi permainan), Kesehatan (pengenalan aktivitas fisik)MENGAPLIKASI (30 menit) Prinsip: Bermakna - Mempraktikkan permainan tradisional dalam kompetisi sehatAktivitas: Traditional Games Festival Lomba 17 Agustus CilikLomba Estafet Bendera (10 menit): Tim berlari sambil membawa bendera IndonesiaLomba Bakiak Berpasangan (10 menit): Kerjasama berjalan dengan bakiak kayuLomba Memasukkan Paku ke Botol (10 menit): Ketangkasan dan konsentrasiDimensi Profil Lulusan: Kesehatan (aktivitas fisik), Bergotong Royong (kerjasama tim), Mandiri (sportivitas dan keberanian)MEREFLEKSI (5 menit) Prinsip: Menggembirakan - Merayakan pencapaian dan sportivitasAktivitas: Victory Circle Juara SejatiSemua anak berkumpul melingkar untuk apresiasi pencapaianMemberikan medali sederhana untuk semua peserta dengan kategori unik masing-masingDimensi Profil Lulusan: Mandiri (menerima apresiasi), Bergotong Royong (menghargai teman), Kesehatan (refleksi aktivitas fisik)Kegiatan Penutup (5 menit)Prinsip: Menggembirakan - Komitmen melestarikan budayaAnak berkomitmen untuk mengajarkan permainan tradisional kepada adik atau temanPreview esok: Besok kita akan menjadi presenter budaya dalam parade keragaman!Yel-yel sederhana: Indonesia Juara!Dimensi Profil Lulusan: Berkebinekaan Global (komitmen pelestarian budaya), Kewargaan (semangat nasionalisme), Komunikasi (yel-yel bersama)',
          },
        ],
      },
      {
        day: 5,
        phase: 'RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN',
        rawContent:
          'HARI 5: UPACARA KEMERDEKAAN & REFLEKSI** Penguatan Karakter Utama: KEWARGAAN & MANDIRIKegiatan Awal (20 menit)Prinsip: Berkesadaran - Menghayati makna upacara sebagai wujud penghormatanPembuka Inspiratif Pemimpin Masa DepanGuru mengenakan seragam upacara dan menjelaskan pentingnya upacara kemerdekaanAnak dipersiapkan untuk upacara dengan briefing tata cara dan makna setiap gerakanOrientasi bermakna: Hari ini kita akan menjadi pemimpin masa depan yang menghormati bangsaDimensi Profil Lulusan: Kewargaan (penghormatan bangsa), Mandiri (tanggung jawab upacara), Beriman Bertakwa (sikap khidmat)Kegiatan Inti (50 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami makna upacara kemerdekaanAktivitas: Ceremony Briefing Makna di Balik UpacaraGuru menjelaskan mengapa setiap 17 Agustus diadakan upacara kemerdekaanAnak belajar tentang sikap hormat, pengibaran bendera, dan menyanyikan lagu kebangsaanDimensi Profil Lulusan: Kewargaan (memahami tradisi bangsa), Bernalar Kritis (makna simbolik upacara), Mandiri (persiapan mental)MENGAPLIKASI (30 menit) Prinsip: Bermakna - Melaksanakan upacara kemerdekaan dengan penghayatanAktivitas: Independence Ceremony Upacara 17 Agustus SekolahPengibaran Bendera (10 menit): Anak bergiliran menjadi petugas upacara dengan bimbingan guruPembacaan Teks Proklamasi (5 menit): Anak terpilih membacakan teks proklamasi sederhanaMenyanyikan Lagu Kebangsaan (10 menit): Seluruh peserta menyanyikan Indonesia Raya dan lagu nasional lainnyaPembacaan Janji (5 menit): Anak mengucapkan janji untuk mencintai Indonesia dengan bahasa sederhanaDimensi Profil Lulusan: Kewargaan (pelaksanaan tradisi bangsa), Mandiri (kepemimpinan upacara), Beriman Bertakwa (sikap khidmat dan penghormatan)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Menginternalisasi pengalaman bermaknaAktivitas: Patriotic Reflection Janji Cinta IndonesiaAnak duduk melingkar dan berbagi perasaan setelah mengikuti upacaraSetiap anak menyampaikan satu janji untuk Indonesia: Saya berjanji akan...Menulis atau menggambar janji tersebut di Kartu Janji Patriot CilikDimensi Profil Lulusan: Mandiri (komitmen personal), Kewargaan (tekad berbakti bangsa), Komunikasi (refleksi verbal)Kegiatan Penutup (15 menit)Prinsip: Menggembirakan - Penutupan yang menginspirasi dan memberdayakanAktivitas: Future Leaders Pemimpin Masa Depan IndonesiaAnak berdiri dengan memegang kartu janji mereka dan mengucapkan komitmen bersamaPenyerahan Sertifikat Patriot Cilik kepada setiap anak sebagai apresiasiFoto bersama dengan latar belakang bendera dan karya-karya yang telah dibuat selama 1 mingguDoa penutup untuk Indonesia yang lebih baik dan komitmen menjadi generasi penerus bangsaDimensi Profil Lulusan: Kewargaan (komitmen nasionalisme), Mandiri (tekad leadership), Beriman Bertakwa (doa untuk bangsa), Bergotong Royong (solidaritas generasi)',
        activities: [
          {
            activityNumber: 1,
            title: 'Kegiatan 1',
            toolsAndMaterials: '',
            howToPlay:
              'HARI 5: UPACARA KEMERDEKAAN & REFLEKSI** Penguatan Karakter Utama: KEWARGAAN & MANDIRIKegiatan Awal (20 menit)Prinsip: Berkesadaran - Menghayati makna upacara sebagai wujud penghormatanPembuka Inspiratif Pemimpin Masa DepanGuru mengenakan seragam upacara dan menjelaskan pentingnya upacara kemerdekaanAnak dipersiapkan untuk upacara dengan briefing tata cara dan makna setiap gerakanOrientasi bermakna: Hari ini kita akan menjadi pemimpin masa depan yang menghormati bangsaDimensi Profil Lulusan: Kewargaan (penghormatan bangsa), Mandiri (tanggung jawab upacara), Beriman Bertakwa (sikap khidmat)Kegiatan Inti (50 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami makna upacara kemerdekaanAktivitas: Ceremony Briefing Makna di Balik UpacaraGuru menjelaskan mengapa setiap 17 Agustus diadakan upacara kemerdekaanAnak belajar tentang sikap hormat, pengibaran bendera, dan menyanyikan lagu kebangsaanDimensi Profil Lulusan: Kewargaan (memahami tradisi bangsa), Bernalar Kritis (makna simbolik upacara), Mandiri (persiapan mental)MENGAPLIKASI (30 menit) Prinsip: Bermakna - Melaksanakan upacara kemerdekaan dengan penghayatanAktivitas: Independence Ceremony Upacara 17 Agustus SekolahPengibaran Bendera (10 menit): Anak bergiliran menjadi petugas upacara dengan bimbingan guruPembacaan Teks Proklamasi (5 menit): Anak terpilih membacakan teks proklamasi sederhanaMenyanyikan Lagu Kebangsaan (10 menit): Seluruh peserta menyanyikan Indonesia Raya dan lagu nasional lainnyaPembacaan Janji (5 menit): Anak mengucapkan janji untuk mencintai Indonesia dengan bahasa sederhanaDimensi Profil Lulusan: Kewargaan (pelaksanaan tradisi bangsa), Mandiri (kepemimpinan upacara), Beriman Bertakwa (sikap khidmat dan penghormatan)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Menginternalisasi pengalaman bermaknaAktivitas: Patriotic Reflection Janji Cinta IndonesiaAnak duduk melingkar dan berbagi perasaan setelah mengikuti upacaraSetiap anak menyampaikan satu janji untuk Indonesia: Saya berjanji akan...Menulis atau menggambar janji tersebut di Kartu Janji Patriot CilikDimensi Profil Lulusan: Mandiri (komitmen personal), Kewargaan (tekad berbakti bangsa), Komunikasi (refleksi verbal)Kegiatan Penutup (15 menit)Prinsip: Menggembirakan - Penutupan yang menginspirasi dan memberdayakanAktivitas: Future Leaders Pemimpin Masa Depan IndonesiaAnak berdiri dengan memegang kartu janji mereka dan mengucapkan komitmen bersamaPenyerahan Sertifikat Patriot Cilik kepada setiap anak sebagai apresiasiFoto bersama dengan latar belakang bendera dan karya-karya yang telah dibuat selama 1 mingguDoa penutup untuk Indonesia yang lebih baik dan komitmen menjadi generasi penerus bangsaDimensi Profil Lulusan: Kewargaan (komitmen nasionalisme), Mandiri (tekad leadership), Beriman Bertakwa (doa untuk bangsa), Bergotong Royong (solidaritas generasi)',
            fullDescription:
              'HARI 5: UPACARA KEMERDEKAAN & REFLEKSI** Penguatan Karakter Utama: KEWARGAAN & MANDIRIKegiatan Awal (20 menit)Prinsip: Berkesadaran - Menghayati makna upacara sebagai wujud penghormatanPembuka Inspiratif Pemimpin Masa DepanGuru mengenakan seragam upacara dan menjelaskan pentingnya upacara kemerdekaanAnak dipersiapkan untuk upacara dengan briefing tata cara dan makna setiap gerakanOrientasi bermakna: Hari ini kita akan menjadi pemimpin masa depan yang menghormati bangsaDimensi Profil Lulusan: Kewargaan (penghormatan bangsa), Mandiri (tanggung jawab upacara), Beriman Bertakwa (sikap khidmat)Kegiatan Inti (50 menit)MEMAHAMI (10 menit) Prinsip: Berkesadaran - Memahami makna upacara kemerdekaanAktivitas: Ceremony Briefing Makna di Balik UpacaraGuru menjelaskan mengapa setiap 17 Agustus diadakan upacara kemerdekaanAnak belajar tentang sikap hormat, pengibaran bendera, dan menyanyikan lagu kebangsaanDimensi Profil Lulusan: Kewargaan (memahami tradisi bangsa), Bernalar Kritis (makna simbolik upacara), Mandiri (persiapan mental)MENGAPLIKASI (30 menit) Prinsip: Bermakna - Melaksanakan upacara kemerdekaan dengan penghayatanAktivitas: Independence Ceremony Upacara 17 Agustus SekolahPengibaran Bendera (10 menit): Anak bergiliran menjadi petugas upacara dengan bimbingan guruPembacaan Teks Proklamasi (5 menit): Anak terpilih membacakan teks proklamasi sederhanaMenyanyikan Lagu Kebangsaan (10 menit): Seluruh peserta menyanyikan Indonesia Raya dan lagu nasional lainnyaPembacaan Janji (5 menit): Anak mengucapkan janji untuk mencintai Indonesia dengan bahasa sederhanaDimensi Profil Lulusan: Kewargaan (pelaksanaan tradisi bangsa), Mandiri (kepemimpinan upacara), Beriman Bertakwa (sikap khidmat dan penghormatan)MEREFLEKSI (10 menit) Prinsip: Menggembirakan - Menginternalisasi pengalaman bermaknaAktivitas: Patriotic Reflection Janji Cinta IndonesiaAnak duduk melingkar dan berbagi perasaan setelah mengikuti upacaraSetiap anak menyampaikan satu janji untuk Indonesia: Saya berjanji akan...Menulis atau menggambar janji tersebut di Kartu Janji Patriot CilikDimensi Profil Lulusan: Mandiri (komitmen personal), Kewargaan (tekad berbakti bangsa), Komunikasi (refleksi verbal)Kegiatan Penutup (15 menit)Prinsip: Menggembirakan - Penutupan yang menginspirasi dan memberdayakanAktivitas: Future Leaders Pemimpin Masa Depan IndonesiaAnak berdiri dengan memegang kartu janji mereka dan mengucapkan komitmen bersamaPenyerahan Sertifikat Patriot Cilik kepada setiap anak sebagai apresiasiFoto bersama dengan latar belakang bendera dan karya-karya yang telah dibuat selama 1 mingguDoa penutup untuk Indonesia yang lebih baik dan komitmen menjadi generasi penerus bangsaDimensi Profil Lulusan: Kewargaan (komitmen nasionalisme), Mandiri (tekad leadership), Beriman Bertakwa (doa untuk bangsa), Bergotong Royong (solidaritas generasi)',
          },
        ],
      },
    ],
    closingActivities: [],
    iktpItems: [
      {
        no: 1,
        indicator:
          '1. HARI 1: Mengenal Sejarah Kemerdekaan IndonesiaMenyebutkan tanggal kemerdekaan Indonesia (17 Agustus 1945)Mengenali tokoh Soekarno-Hatta dalam cerita proklamasiMenunjukkan antusiasme dalam dramatic play proklamasiMengekspresikan perasaan bangga melalui gambar',
      },
      {
        no: 2,
        indicator:
          '2. HARI 2: Menjelajahi Simbol-simbol NegaraMengenali dan menyebutkan makna warna bendera merah putihMenunjukkan sikap hormat saat upacara bendera miniMenyanyikan lagu Indonesia Raya dengan sikap yang tepatMendesain bendera impian dengan kreativitas',
      },
      {
        no: 3,
        indicator:
          'HARI 3: Berkarya Seni PatriotikMengapresiasi karya seni bertema kemerdekaanBekerja sama dalam kelompok membuat lampion/janur kuningMenghasilkan karya seni dengan tema patriotikMempresentasikan karya dan harapan untuk Indonesia',
      },
      {
        no: 4,
        indicator:
          'HARI 4: Festival Permainan TradisionalMemahami nilai budaya dalam permainan tradisionalBerpartisipasi aktif dalam lomba tradisionalMenunjukkan sportivitas dan kerjasama timBerkomitmen melestarikan permainan tradisional',
      },
      {
        no: 5,
        indicator:
          'HARI 5: Parade Keragaman Budaya IndonesiaMengenal keragaman budaya daerah di IndonesiaMempresentasikan budaya daerah dengan percaya diriMenghargai perbedaan budaya dalam paradeMengekspresikan persatuan dalam keragaman',
      },
      {
        no: 6,
        indicator:
          'HARI 6: Upacara Kemerdekaan & RefleksiMelaksanakan upacara kemerdekaan dengan sikap hormatBerpartisipasi aktif dalam pembacaan proklamasiMembuat komitmen personal untuk IndonesiaMerefleksikan pembelajaran patriotisme dengan bermakna',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 5,
    filename: '41_TK_B_Smt1_05_Pakaian_Adat.docx',
    title: 'KEINDAHAN PAKAIAN ADAT NUSANTARA',
    topic: 'TANAH AIR',
    subtopic: 'BAJU ADAT',
    modelPembelajaran: 'PjBL, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'September 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: true,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Peserta didik kelompok B (usia 5-6 tahun) memiliki karakteristik perkembangan yang siap untuk mengeksplorasi konsep budaya dan identitas daerah. Mereka menunjukkan rasa ingin tahu yang tinggi terhadap hal-hal baru, mulai memahami perbedaan dan keberagaman, serta mampu mengekspresikan pemahaman melalui berbagai cara seperti bercerita, menggambar, dan bermain peran. Anak-anak pada usia ini juga mulai mengembangkan kemampuan motorik halus yang memungkinkan mereka terlibat dalam kegiatan seni dan kreativitas yang lebih kompleks.',
      learningMaterial:
        'Materi pembelajaran tentang pakaian adat mencakup pengetahuan esensial mengenai keberagaman budaya Indonesia, pengetahuan aplikatif tentang ciri-ciri khas pakaian tradisional, dan pengetahuan nilai karakter tentang menghargai warisan budaya bangsa. Materi ini relevan dengan kehidupan anak karena mengaitkan identitas budaya dengan pengalaman sehari-hari mereka dalam berpakaian. Tingkat kesulitan disesuaikan dengan kemampuan kognitif anak usia 5-6 tahun melalui eksplorasi visual, sensori, dan pengalaman langsung.',
    },
    learningDesign: {
      cp: 'CP Dasar Literasi dan STEAM: Murid mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan, menunjukkan minat, dan berpartisipasi dalam kegiatan pramembaca. CP Dasar Literasi dan STEAM: Murid mengeksplorasi berbagai proses seni, mengekspresikannya, serta mengapresiasi karya seni.',
      crossDisciplinary:
        'Nilai agama dan moral (menghargai ciptaan Tuhan melalui keberagaman budaya), Nilai Pancasila (menghargai kebhinekaan dan persatuan dalam keberagaman), Fisik motorik (mengembangkan koordinasi melalui gerakan tari dan kegiatan seni), Kognitif (mengidentifikasi, membandingkan, dan mengelompokkan ciri-ciri pakaian adat), Bahasa (mengekspresikan pemahaman melalui bercerita dan komunikasi), Sosial emosional (mengembangkan rasa bangga terhadap budaya dan empati terhadap keberagaman).',
      tp: 'Anak mampu menjelaskan ciri khas minimal 3 jenis baju adat dari daerah yang berbeda di Indonesia dan mengomunikasikannya secara lisan atau melalui media gambar. Anak mampu memahami dan menghargai nilai budaya yang terkandung dalam baju adat, Anak mampu mengekspresikan pemahaman mereka melalui kreasi seni dan gerakan tari sederhana yang terinspirasi dari budaya daerah.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain edukatif yang mengintegrasikan eksplorasi sensorik, bercerita interaktif, dan aktivitas seni kreatif. Metode bermain peran dan hands-on activities mendukung pembelajaran yang berkesadaran melalui keterlibatan aktif, bermakna melalui keterkaitan budaya, dan menggembirakan melalui permainan kreatif.',
      partnership:
        'Melibatkan orang tua untuk berbagi cerita budaya keluarga, guru seni untuk pengembangan kreativitas, tokoh masyarakat atau budayawan lokal, perpustakaan daerah untuk akses buku budaya, dan museum/sanggar budaya untuk pengalaman belajar otentik.',
      environment:
        'Ruang fisik ditata fleksibel dengan area eksplorasi budaya, gambar pakaian adat, space seni dan bermain peran. Ruang virtual memanfaatkan video budaya nusantara. Budaya belajar menghargai keberagaman dan mendukung pembelajaran kolaboratif inklusif.',
      digitalUtilization:
        'Video edukatif tentang pakaian adat, lagu-lagu daerah, permainan interaktif sederhana tentang budaya, dan dokumentasi kegiatan anak melalui foto/video untuk portofolio perkembangan. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Menyanyikan lagu 1234 Pergi Sekolah untuk menciptakan suasana gembira',
      'Menyiapkan aturan bermain dan harapan belajar bersama',
      'Kegiatan pemantik melalui buku cerita/video Mengenal Bagian Pakaian Adat',
    ],
    openingQuestions: [
      'Apa yang membuat pakaian adat begitu istimewa sebagai ciptaan budaya bangsa kita? (Keimanan dan ketakwaan)',
      'Bagaimana perasaanmu melihat keberagaman pakaian dari berbagai daerah di Indonesia? (Kewargaan)',
      'Apa perbedaan yang kamu lihat antara pakaian adat dan pakaian sehari-hari? (Penalaran kritis)',
      'Bagaimana kita bisa membuat karya seni yang terinspirasi dari pakaian adat? (Kreativitas)',
      'Siapa saja yang bisa membantu kita belajar tentang pakaian adat? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri untuk menjaga dan menghargai budaya? (Kemandirian)',
      'Bagaimana cara merawat tubuh kita seperti merawat pakaian adat yang berharga? (Kesehatan)',
      'Bagaimana kamu akan menceritakan tentang pakaian adat kepada teman-temanmu? (Komunikasi)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Membuat Jam Tangan Dari Gelas Kertas (Kreativitas, Kemandirian). Alat dan bahan: Gelas kertas, gunting, spidol, pinCara Membuat: Siapkan gelas kertas, kemudian garis agar presisi pada bagian yang akan di gunting. Setelah itu gunting sisa gelas kertas, sehingga membentuk seperti pada gambar No.3. Tulis angka menggunakan spidol atau pena. Buat jarum jam lalu pasang tepat di tengah-tengah lingkaran, lalu tusukkan pin atau bisa juga menggunakan lem agar jarum tidak terlepasKegiatan 2 : Memakai dan Melepas Kebaya Mini (Kemandirian, Kesehatan). Alat dan bahan: Kebaya mini atau baju tradisional sederhana dengan kancing. Cara bermain: Sediakan beberapa kebaya mini atau baju tradisional sederhana dengan kancing. Minta anak-anak untuk berlatih memakai dan melepas baju tersebut secara mandiri. Guru dapat memberikan panduan langkah demi langkah, seperti cara memasukkan tangan ke lengan baju dan mengancingkan kancing. Kegiatan ini melatih koordinasi mata-tangan, motorik halus, dan kemandirian dalam berpakaian. Kegiatan 3 : Mengikat Tali Sepatu (Kemandirian, Kesehatan). Alat dan bahan: Sepatu atau replika sepatu dengan tali. Cara bermain: Sediakan sepatu atau replika sepatu dengan tali. Ajarkan anak-anak cara mengikat tali sepatu langkah demi langkah. Mulai dari membuat simpul dasar hingga membuat pita. Buat kompetisi kecil untuk melihat siapa yang bisa mengikat tali sepatu dengan benar dan rapi dalam waktu tertentu. Kegiatan ini melatih motorik halus, koordinasi mata-tangan, dan kemandirian dalam mengenakan sepatu.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Jam Tangan Dari Gelas Kertas (Kreativitas, Kemandirian)',
            toolsAndMaterials: 'Gelas kertas, gunting, spidol, pin',
            howToPlay:
              'Siapkan gelas kertas, kemudian garis agar presisi pada bagian yang akan di gunting. Setelah itu gunting sisa gelas kertas, sehingga membentuk seperti pada gambar No.3. Tulis angka menggunakan spidol atau pena. Buat jarum jam lalu pasang tepat di tengah-tengah lingkaran, lalu tusukkan pin atau bisa juga menggunakan lem agar jarum tidak terlepas',
            fullDescription:
              'Kegiatan 1: Membuat Jam Tangan Dari Gelas Kertas (Kreativitas, Kemandirian). Alat dan bahan: Gelas kertas, gunting, spidol, pinCara Membuat: Siapkan gelas kertas, kemudian garis agar presisi pada bagian yang akan di gunting. Setelah itu gunting sisa gelas kertas, sehingga membentuk seperti pada gambar No.3. Tulis angka menggunakan spidol atau pena. Buat jarum jam lalu pasang tepat di tengah-tengah lingkaran, lalu tusukkan pin atau bisa juga menggunakan lem agar jarum tidak terlepas',
          },
          {
            activityNumber: 2,
            title: 'Memakai dan Melepas Kebaya Mini (Kemandirian, Kesehatan)',
            toolsAndMaterials: 'Kebaya mini atau baju tradisional sederhana dengan kancing',
            howToPlay:
              'Sediakan beberapa kebaya mini atau baju tradisional sederhana dengan kancing. Minta anak-anak untuk berlatih memakai dan melepas baju tersebut secara mandiri. Guru dapat memberikan panduan langkah demi langkah, seperti cara memasukkan tangan ke lengan baju dan mengancingkan kancing. Kegiatan ini melatih koordinasi mata-tangan, motorik halus, dan kemandirian dalam berpakaian.',
            fullDescription:
              'Kegiatan 2: Memakai dan Melepas Kebaya Mini (Kemandirian, Kesehatan). Alat dan bahan: Kebaya mini atau baju tradisional sederhana dengan kancing. Cara bermain: Sediakan beberapa kebaya mini atau baju tradisional sederhana dengan kancing. Minta anak-anak untuk berlatih memakai dan melepas baju tersebut secara mandiri. Guru dapat memberikan panduan langkah demi langkah, seperti cara memasukkan tangan ke lengan baju dan mengancingkan kancing. Kegiatan ini melatih koordinasi mata-tangan, motorik halus, dan kemandirian dalam berpakaian.',
          },
          {
            activityNumber: 3,
            title: 'Mengikat Tali Sepatu (Kemandirian, Kesehatan)',
            toolsAndMaterials: 'Sepatu atau replika sepatu dengan tali',
            howToPlay:
              'Sediakan sepatu atau replika sepatu dengan tali. Ajarkan anak-anak cara mengikat tali sepatu langkah demi langkah. Mulai dari membuat simpul dasar hingga membuat pita. Buat kompetisi kecil untuk melihat siapa yang bisa mengikat tali sepatu dengan benar dan rapi dalam waktu tertentu. Kegiatan ini melatih motorik halus, koordinasi mata-tangan, dan kemandirian dalam mengenakan sepatu.',
            fullDescription:
              'Kegiatan 3: Mengikat Tali Sepatu (Kemandirian, Kesehatan). Alat dan bahan: Sepatu atau replika sepatu dengan tali. Cara bermain: Sediakan sepatu atau replika sepatu dengan tali. Ajarkan anak-anak cara mengikat tali sepatu langkah demi langkah. Mulai dari membuat simpul dasar hingga membuat pita. Buat kompetisi kecil untuk melihat siapa yang bisa mengikat tali sepatu dengan benar dan rapi dalam waktu tertentu. Kegiatan ini melatih motorik halus, koordinasi mata-tangan, dan kemandirian dalam mengenakan sepatu.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Lompat, Lewat, dan Putar (Kesehatan, Kolaborasi). Alat dan Bahan: Tongkat, petunjuk arah. Cara Membuat dan MemainkanSiapkan karton dan letakkan atau posisikan seperti gambar , lalau beri petunjuk pada setiap sisi karton (seperti gambar)Selanjutnnya, mintalah anak-anak untuk lompat dan melewati memutar sesuai arah petunjuk. Kegiatan 2 : Bermain Peran Desainer Pakaian Adat (Kreativitas, Komunikasi). Alat dan bahan: Kertas gambar besar, pensil warna, majalah bekas, gunting, lem. Cara bermain: Minta anak-anak membayangkan mereka adalah desainer pakaian adat. Mereka bisa menggambar desain pakaian adat baru atau membuat kolase dari potongan gambar di majalah. Dorong mereka untuk menjelaskan desain mereka. Ini mengembangkan kreativitas dan kemampuan berbahasa. Kegiatan 3 : Membuat Pola Batik dengan Stempel (Kreativitas, Penalaran Kritis). Alat dan bahan: Kertas, cat, stempel dari bahan alam (seperti potongan pelepah pisang, belimbing, daun atau lainnya). Cara bermain: Ajarkan anak-anak membuat pola batik sederhana menggunakan stempel dari bahan alam. Mereka bisa membuat pola berulang atau bebas. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang pola.',
        activities: [
          {
            activityNumber: 1,
            title: 'Lompat, Lewat, dan Putar (Kesehatan, Kolaborasi)',
            toolsAndMaterials: 'Tongkat, petunjuk arah',
            howToPlay:
              'dan MemainkanSiapkan karton dan letakkan atau posisikan seperti gambar , lalau beri petunjuk pada setiap sisi karton (seperti gambar)Selanjutnnya, mintalah anak-anak untuk lompat dan melewati memutar sesuai arah petunjuk.',
            fullDescription:
              'Kegiatan 1: Lompat, Lewat, dan Putar (Kesehatan, Kolaborasi). Alat dan Bahan: Tongkat, petunjuk arah. Cara Membuat dan MemainkanSiapkan karton dan letakkan atau posisikan seperti gambar , lalau beri petunjuk pada setiap sisi karton (seperti gambar)Selanjutnnya, mintalah anak-anak untuk lompat dan melewati memutar sesuai arah petunjuk.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Peran Desainer Pakaian Adat (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Kertas gambar besar, pensil warna, majalah bekas, gunting, lem',
            howToPlay:
              'Minta anak-anak membayangkan mereka adalah desainer pakaian adat. Mereka bisa menggambar desain pakaian adat baru atau membuat kolase dari potongan gambar di majalah. Dorong mereka untuk menjelaskan desain mereka. Ini mengembangkan kreativitas dan kemampuan berbahasa.',
            fullDescription:
              'Kegiatan 2: Bermain Peran Desainer Pakaian Adat (Kreativitas, Komunikasi). Alat dan bahan: Kertas gambar besar, pensil warna, majalah bekas, gunting, lem. Cara bermain: Minta anak-anak membayangkan mereka adalah desainer pakaian adat. Mereka bisa menggambar desain pakaian adat baru atau membuat kolase dari potongan gambar di majalah. Dorong mereka untuk menjelaskan desain mereka. Ini mengembangkan kreativitas dan kemampuan berbahasa.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Pola Batik dengan Stempel (Kreativitas, Penalaran Kritis)',
            toolsAndMaterials:
              'Kertas, cat, stempel dari bahan alam (seperti potongan pelepah pisang, belimbing, daun atau lainnya)',
            howToPlay:
              'Ajarkan anak-anak membuat pola batik sederhana menggunakan stempel dari bahan alam. Mereka bisa membuat pola berulang atau bebas. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang pola.',
            fullDescription:
              'Kegiatan 3: Membuat Pola Batik dengan Stempel (Kreativitas, Penalaran Kritis). Alat dan bahan: Kertas, cat, stempel dari bahan alam (seperti potongan pelepah pisang, belimbing, daun atau lainnya). Cara bermain: Ajarkan anak-anak membuat pola batik sederhana menggunakan stempel dari bahan alam. Mereka bisa membuat pola berulang atau bebas. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang pola.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Lompat Sesuai Intruksi Yang di Dengar (Kesehatan, Penalaran Kritis). Alat dan bahan: Selotip atau kapur. Cara Membuat dan Bermain: Siapkan solatip warn atau kapur kemudian buat, garis-garis seperti pada gambar. Mintalah anak-anak secara bergantian untuk bediri tepat di Tengah-tengah garis yang sudah di buat. MIntalah anak-anak mendengarkan instruksi tang di berikan, dan harus melompat untuk menginjak warna garis sesuai instuksi, (misalnya: merah, berati anak-anak harus melompat dan menginjak garis warna merah. Kegiatan 2 : Mengurutkan Cerita tentang Pembuatan Pakaian Adat (Penalaran Kritis, Komunikasi). Alat dan bahan: Kartu bergambar proses pembuatan pakaian adat (misalnya, menenun, mewarnai, menjahit). Cara bermain: Berikan anak-anak kartu bergambar proses pembuatan pakaian adat secara acak. Minta mereka mengurutkan kartu tersebut sesuai urutan yang benar. Kegiatan ini mengembangkan pemahaman tentang urutan dan proses. Kegiatan 3 : Bermain Siapa Aku? versi Pakaian Adat (Komunikasi, Kolaborasi). Alat dan bahan: Kartu dengan nama pakaian adat atau daerah, pita untuk mengikat di kepala. Cara bermain: Tempelkan kartu di dahi anak tanpa memberitahu isinya. Anak tersebut harus menebak pakaian adat atau daerah yang tertulis di kartu dengan mengajukan pertanyaan ya/tidak kepada teman-temannya. Ini mengembangkan kemampuan bertanya dan berpikir logis.',
        activities: [
          {
            activityNumber: 1,
            title: 'Lompat Sesuai Intruksi Yang di Dengar (Kesehatan, Penalaran Kritis)',
            toolsAndMaterials: 'Selotip atau kapur',
            howToPlay:
              'dan Bermain: Siapkan solatip warn atau kapur kemudian buat, garis-garis seperti pada gambar. Mintalah anak-anak secara bergantian untuk bediri tepat di Tengah-tengah garis yang sudah di buat. MIntalah anak-anak mendengarkan instruksi tang di berikan, dan harus melompat untuk menginjak warna garis sesuai instuksi, (misalnya: merah, berati anak-anak harus melompat dan menginjak garis warna merah.',
            fullDescription:
              'Kegiatan 1: Lompat Sesuai Intruksi Yang di Dengar (Kesehatan, Penalaran Kritis). Alat dan bahan: Selotip atau kapur. Cara Membuat dan Bermain: Siapkan solatip warn atau kapur kemudian buat, garis-garis seperti pada gambar. Mintalah anak-anak secara bergantian untuk bediri tepat di Tengah-tengah garis yang sudah di buat. MIntalah anak-anak mendengarkan instruksi tang di berikan, dan harus melompat untuk menginjak warna garis sesuai instuksi, (misalnya: merah, berati anak-anak harus melompat dan menginjak garis warna merah.',
          },
          {
            activityNumber: 2,
            title:
              'Mengurutkan Cerita tentang Pembuatan Pakaian Adat (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials:
              'Kartu bergambar proses pembuatan pakaian adat (misalnya, menenun, mewarnai, menjahit)',
            howToPlay:
              'Berikan anak-anak kartu bergambar proses pembuatan pakaian adat secara acak. Minta mereka mengurutkan kartu tersebut sesuai urutan yang benar. Kegiatan ini mengembangkan pemahaman tentang urutan dan proses.',
            fullDescription:
              'Kegiatan 2: Mengurutkan Cerita tentang Pembuatan Pakaian Adat (Penalaran Kritis, Komunikasi). Alat dan bahan: Kartu bergambar proses pembuatan pakaian adat (misalnya, menenun, mewarnai, menjahit). Cara bermain: Berikan anak-anak kartu bergambar proses pembuatan pakaian adat secara acak. Minta mereka mengurutkan kartu tersebut sesuai urutan yang benar. Kegiatan ini mengembangkan pemahaman tentang urutan dan proses.',
          },
          {
            activityNumber: 3,
            title: 'Bermain Siapa Aku? versi Pakaian Adat (Komunikasi, Kolaborasi)',
            toolsAndMaterials:
              'Kartu dengan nama pakaian adat atau daerah, pita untuk mengikat di kepala',
            howToPlay:
              'Tempelkan kartu di dahi anak tanpa memberitahu isinya. Anak tersebut harus menebak pakaian adat atau daerah yang tertulis di kartu dengan mengajukan pertanyaan ya/tidak kepada teman-temannya. Ini mengembangkan kemampuan bertanya dan berpikir logis.',
            fullDescription:
              'Kegiatan 3: Bermain Siapa Aku? versi Pakaian Adat (Komunikasi, Kolaborasi). Alat dan bahan: Kartu dengan nama pakaian adat atau daerah, pita untuk mengikat di kepala. Cara bermain: Tempelkan kartu di dahi anak tanpa memberitahu isinya. Anak tersebut harus menebak pakaian adat atau daerah yang tertulis di kartu dengan mengajukan pertanyaan ya/tidak kepada teman-temannya. Ini mengembangkan kemampuan bertanya dan berpikir logis.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Kolase Rumah Gadang Sumatra Barat dari Biji-bijian (Kreativitas, Kewargaan). Alat dan bahan: Biji-bijian (misalnya: Kacang hijau, beras, kwaci, biji pakan burung), Karton atau papan dasar sebagai alas, Lem , Gunting untuk anak-anak, Prin table gambar rumah gadang, Cara Membuat: Siapkan prin table gambar rumah gadang. Gunakan lidi atau cotton buds kecil mengaplikasikan pada permukaan kertas dan tempelkan biji-nbijian dengan hati-hati. Pastikan semua bagian tertempel dengan baik dan biarkan lem mengering sempurna. Tinjau kembali bersama anak untuk memastikan tidak ada bagian yang terlewat atau tidak menempel dengan baik. Kegiatan 2 : Bermain Peran Butik Kecil (Komunikasi, Kolaborasi). Alat dan bahan: Berbagai jenis pakaian anak-anak, cermin, gantungan baju, label harga mainan. Cara bermain: Set up area kelas seperti butik kecil. Bagi anak-anak menjadi penjual dan pembeli. Penjual harus melayani pembeli dengan ramah, sementara pembeli belajar memilih pakaian dan berinteraksi sopan. Setelah bermain, diskusikan perasaan mereka saat berperan sebagai penjual atau pembeli. Kegiatan ini membantu anak-anak belajar mengelola emosi dalam situasi sosial, melatih kesabaran, dan mengembangkan empati. Kegiatan 3 : Topeng Perasaan (Kreativitas, Komunikasi). Alat dan bahan: Kertas karton, karet gelang, pensil warna. Cara bermain: Anak-anak membuat topeng yang menggambarkan emosi tertentu. Mereka kemudian memakai topeng dan memerankan situasi yang sesuai dengan emosi tersebut. Kegiatan ini membantu anak-anak mengekspresikan emosi melalui seni dan drama.',
        activities: [
          {
            activityNumber: 1,
            title:
              'Membuat Kolase Rumah Gadang Sumatra Barat dari Biji-bijian (Kreativitas, Kewargaan)',
            toolsAndMaterials:
              'Biji-bijian (misalnya: Kacang hijau, beras, kwaci, biji pakan burung), Karton atau papan dasar sebagai alas, Lem , Gunting untuk anak-anak, Prin table gambar rumah gadang',
            howToPlay:
              'Siapkan prin table gambar rumah gadang. Gunakan lidi atau cotton buds kecil mengaplikasikan pada permukaan kertas dan tempelkan biji-nbijian dengan hati-hati. Pastikan semua bagian tertempel dengan baik dan biarkan lem mengering sempurna. Tinjau kembali bersama anak untuk memastikan tidak ada bagian yang terlewat atau tidak menempel dengan baik.',
            fullDescription:
              'Kegiatan 1: Membuat Kolase Rumah Gadang Sumatra Barat dari Biji-bijian (Kreativitas, Kewargaan). Alat dan bahan: Biji-bijian (misalnya: Kacang hijau, beras, kwaci, biji pakan burung), Karton atau papan dasar sebagai alas, Lem , Gunting untuk anak-anak, Prin table gambar rumah gadang, Cara Membuat: Siapkan prin table gambar rumah gadang. Gunakan lidi atau cotton buds kecil mengaplikasikan pada permukaan kertas dan tempelkan biji-nbijian dengan hati-hati. Pastikan semua bagian tertempel dengan baik dan biarkan lem mengering sempurna. Tinjau kembali bersama anak untuk memastikan tidak ada bagian yang terlewat atau tidak menempel dengan baik.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Peran Butik Kecil (Komunikasi, Kolaborasi)',
            toolsAndMaterials:
              'Berbagai jenis pakaian anak-anak, cermin, gantungan baju, label harga mainan',
            howToPlay:
              'Set up area kelas seperti butik kecil. Bagi anak-anak menjadi penjual dan pembeli. Penjual harus melayani pembeli dengan ramah, sementara pembeli belajar memilih pakaian dan berinteraksi sopan. Setelah bermain, diskusikan perasaan mereka saat berperan sebagai penjual atau pembeli. Kegiatan ini membantu anak-anak belajar mengelola emosi dalam situasi sosial, melatih kesabaran, dan mengembangkan empati.',
            fullDescription:
              'Kegiatan 2: Bermain Peran Butik Kecil (Komunikasi, Kolaborasi). Alat dan bahan: Berbagai jenis pakaian anak-anak, cermin, gantungan baju, label harga mainan. Cara bermain: Set up area kelas seperti butik kecil. Bagi anak-anak menjadi penjual dan pembeli. Penjual harus melayani pembeli dengan ramah, sementara pembeli belajar memilih pakaian dan berinteraksi sopan. Setelah bermain, diskusikan perasaan mereka saat berperan sebagai penjual atau pembeli. Kegiatan ini membantu anak-anak belajar mengelola emosi dalam situasi sosial, melatih kesabaran, dan mengembangkan empati.',
          },
          {
            activityNumber: 3,
            title: 'Topeng Perasaan (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Kertas karton, karet gelang, pensil warna',
            howToPlay:
              'Anak-anak membuat topeng yang menggambarkan emosi tertentu. Mereka kemudian memakai topeng dan memerankan situasi yang sesuai dengan emosi tersebut. Kegiatan ini membantu anak-anak mengekspresikan emosi melalui seni dan drama.',
            fullDescription:
              'Kegiatan 3: Topeng Perasaan (Kreativitas, Komunikasi). Alat dan bahan: Kertas karton, karet gelang, pensil warna. Cara bermain: Anak-anak membuat topeng yang menggambarkan emosi tertentu. Mereka kemudian memakai topeng dan memerankan situasi yang sesuai dengan emosi tersebut. Kegiatan ini membantu anak-anak mengekspresikan emosi melalui seni dan drama.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Melengkapi Urutan Gambar Sesuai Petunjuk (Penalaran Kritis, Kemandirian). Alat dan Bahan: Kertas karton, kertas HVS, spidol, gunting, penggaris. Cara Membuat dan Memainkan: Siapkan kertas karton, kemudian buat gambar bentuk persegi menggunakan penggaris. Beri petunjuk arah setiap membuat bentuk persegi. Buat bentuk persegi diatas kertas HVS dengan ukuran yang sama. Tuliskan tanda titik pada kertas yang sudah di buat sebelumnya, kemudian gunting bentuk persegi yang sudah di beri tanda titi-titik sesuai urutan. Instruksikan anak-anak untuk meletakkan bentuk persegi yang terdapat tanda titik-titik untuk melengkapi gambar persegi yang kosong sesuai dengan petunjuk arah (seperti pada gambar)Kegiatan 2 : Cerita Berantai Emosi (Komunikasi, Kolaborasi). Alat dan bahan: Bola kecil, daftar emosi. Cara bermain: Anak-anak duduk melingkar. Guru memulai cerita dengan menyebutkan emosi (Hari ini Ani merasa senang...). Anak yang memegang bola melanjutkan cerita dengan emosi lain. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang perubahan emosi dalam situasi berbeda. Kegiatan 3 : Boneka Wortel Kreativitas, Komunikasi). Alat dan bahan: Wortel, pisau (digunakan oleh guru), pita, kancing, lem. Cara bermain: Guru memotong wortel menjadi dua bagian. Anak-anak menghias wortel menjadi boneka dengan ekspresi berbeda menggunakan pita dan kancing. Diskusikan situasi yang mungkin membuat boneka merasakan emosi tersebut. Kegiatan ini mengembangkan kreativitas dan pemahaman kontekstual emosi.',
        activities: [
          {
            activityNumber: 1,
            title: 'Melengkapi Urutan Gambar Sesuai Petunjuk (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Kertas karton, kertas HVS, spidol, gunting, penggaris',
            howToPlay:
              'dan Memainkan: Siapkan kertas karton, kemudian buat gambar bentuk persegi menggunakan penggaris. Beri petunjuk arah setiap membuat bentuk persegi. Buat bentuk persegi diatas kertas HVS dengan ukuran yang sama. Tuliskan tanda titik pada kertas yang sudah di buat sebelumnya, kemudian gunting bentuk persegi yang sudah di beri tanda titi-titik sesuai urutan. Instruksikan anak-anak untuk meletakkan bentuk persegi yang terdapat tanda titik-titik untuk melengkapi gambar persegi yang kosong sesuai dengan petunjuk arah (seperti pada gambar)',
            fullDescription:
              'Kegiatan 1: Melengkapi Urutan Gambar Sesuai Petunjuk (Penalaran Kritis, Kemandirian). Alat dan Bahan: Kertas karton, kertas HVS, spidol, gunting, penggaris. Cara Membuat dan Memainkan: Siapkan kertas karton, kemudian buat gambar bentuk persegi menggunakan penggaris. Beri petunjuk arah setiap membuat bentuk persegi. Buat bentuk persegi diatas kertas HVS dengan ukuran yang sama. Tuliskan tanda titik pada kertas yang sudah di buat sebelumnya, kemudian gunting bentuk persegi yang sudah di beri tanda titi-titik sesuai urutan. Instruksikan anak-anak untuk meletakkan bentuk persegi yang terdapat tanda titik-titik untuk melengkapi gambar persegi yang kosong sesuai dengan petunjuk arah (seperti pada gambar)',
          },
          {
            activityNumber: 2,
            title: 'Cerita Berantai Emosi (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Bola kecil, daftar emosi',
            howToPlay:
              'Anak-anak duduk melingkar. Guru memulai cerita dengan menyebutkan emosi (Hari ini Ani merasa senang...). Anak yang memegang bola melanjutkan cerita dengan emosi lain. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang perubahan emosi dalam situasi berbeda.',
            fullDescription:
              'Kegiatan 2: Cerita Berantai Emosi (Komunikasi, Kolaborasi). Alat dan bahan: Bola kecil, daftar emosi. Cara bermain: Anak-anak duduk melingkar. Guru memulai cerita dengan menyebutkan emosi (Hari ini Ani merasa senang...). Anak yang memegang bola melanjutkan cerita dengan emosi lain. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang perubahan emosi dalam situasi berbeda.',
          },
          {
            activityNumber: 3,
            title: 'Boneka Wortel Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Wortel, pisau (digunakan oleh guru), pita, kancing, lem',
            howToPlay:
              'Guru memotong wortel menjadi dua bagian. Anak-anak menghias wortel menjadi boneka dengan ekspresi berbeda menggunakan pita dan kancing. Diskusikan situasi yang mungkin membuat boneka merasakan emosi tersebut. Kegiatan ini mengembangkan kreativitas dan pemahaman kontekstual emosi.',
            fullDescription:
              'Kegiatan 3: Boneka Wortel Kreativitas, Komunikasi). Alat dan bahan: Wortel, pisau (digunakan oleh guru), pita, kancing, lem. Cara bermain: Guru memotong wortel menjadi dua bagian. Anak-anak menghias wortel menjadi boneka dengan ekspresi berbeda menggunakan pita dan kancing. Diskusikan situasi yang mungkin membuat boneka merasakan emosi tersebut. Kegiatan ini mengembangkan kreativitas dan pemahaman kontekstual emosi.',
          },
        ],
      },
    ],
    closingActivities: [
      'Recalling kegiatan dengan antusias dan berbagi perasaan',
      'Pamer hasil karya dengan bangga dan saling mengapresiasi',
      'Diskusi menyenangkan tentang hal menarik yang dipelajari hari ini',
      'Tepuk tangan bersama untuk merayakan pencapaian semua anak',
      'Bernyanyi lagu penutup tentang keberagaman budaya Indonesia',
      'Rencana seru untuk kegiatan esok hari',
      'Doa penutup dan pulang dengan gembira',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak menunjukkan antusiasme dan respons positif saat melihat gambar pakaian adat dari berbagai daerah Indonesia',
      },
      {
        no: 2,
        indicator:
          'Anak dapat menyebutkan minimal 2-3 nama pakaian adat dan daerah asalnya dengan bantuan visual',
      },
      {
        no: 3,
        indicator:
          'Anak berpartisipasi aktif dalam kegiatan bermain peran Desainer Pakaian Adat dan Butik Kecil',
      },
      {
        no: 4,
        indicator:
          'Anak mampu membuat pola sederhana menggunakan teknik stempel pada kegiatan membuat batik',
      },
      {
        no: 5,
        indicator:
          'Anak dapat mengurutkan 3-4 gambar proses pembuatan pakaian adat sesuai urutan yang benar',
      },
      {
        no: 6,
        indicator:
          'Anak berhasil mengajukan pertanyaan yang tepat dalam permainan Siapa Aku? versi pakaian adat',
      },
      {
        no: 7,
        indicator:
          'Anak menunjukkan kreativitas dalam membuat kolase rumah gadang dan replika kebaya dari kertas',
      },
      {
        no: 8,
        indicator:
          'Anak dapat mengekspresikan emosi melalui pembuatan topeng perasaan dan bermain peran',
      },
      {
        no: 9,
        indicator:
          'Anak mampu mengikuti instruksi kompleks dalam permainan lompat sesuai petunjuk warna',
      },
      {
        no: 10,
        indicator:
          'Anak berpartisipasi dalam cerita berantai emosi dengan menambahkan ide yang relevan dan kreatif',
      },
      {
        no: 11,
        indicator:
          'Anak menunjukkan kemandirian dalam kegiatan memakai kebaya mini dan mengikat tali sepatu',
      },
      {
        no: 12,
        indicator:
          'Anak dapat menceritakan minimal 1 hal menarik tentang pakaian adat dan menunjukkan sikap menghargai keberagaman budaya',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 6,
    filename: '42_TK_B_Smt1_06_Lingkungan_Bersih.docx',
    title: 'LINGKUNGANKU BERSIH, HIDUPKU SEHAT',
    topic: 'LINGKUNGANKU',
    subtopic: 'HIDUP BERSIH DAN SEHAT',
    modelPembelajaran: 'Inkuiri, STEAM',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'September 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: true,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun (Kelompok B) memiliki rasa ingin tahu tinggi tentang lingkungan sekitar, mulai memahami konsep sebab-akibat, dan mampu melakukan aktivitas kebersihan sederhana dengan bimbingan. Mereka antusias dalam kegiatan bermain sambil belajar dan mulai menyadari pentingnya menjaga kesehatan diri.',
      learningMaterial:
        'Pembelajaran tentang perilaku hidup bersih dan sehat (PHBS) yang mencakup pengetahuan esensial tentang kebersihan diri dan lingkungan, pengetahuan aplikatif dalam praktik hidup sehat sehari-hari, serta pengetahuan nilai dan karakter tentang tanggung jawab terhadap diri dan lingkungan sebagai wujud syukur kepada Tuhan YME.',
    },
    learningDesign: {
      cp: 'CP Nilai Agama dan Budi Pekerti: Murid menghargai diri sendiri dan memiliki rasa syukur terhadap Tuhan YME sehingga dapat berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan dirinyaCP Jati Diri: Murid mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia',
      crossDisciplinary:
        'Nilai agama dan moral (pengembangan syukur dan tanggung jawab), nilai Pancasila (kepedulian lingkungan dan gotong royong), fisik motorik (gerakan mencuci tangan dan membersihkan), kognitif (pemahaman sebab-akibat kebersihan), bahasa (komunikasi pentingnya hidup sehat), sosial emosional (kepedulian terhadap lingkungan bersama).',
      tp: 'Anak menerapkan kebiasaan hidup bersih dan sehat (seperti mencuci tangan, membuang sampah pada tempatnya) sebagai wujud rasa syukur kepada Tuhan Yang Maha EsaAnak dapat mengembangkan perilaku positif terhadap perannya menjaga kebersihan diri dan lingkungan sebagai bagian dari keluarga, sekolah, dan masyarakatAnak menunjukkan kepedulian dan kerjasama dalam menjaga kebersihan lingkungan dengan melakukan gerakan yang tepat dan terkoordinasi',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain sambil belajar melalui eksperimen sederhana, seni kreatif, dan permainan berkelompok. Metode bercerita dan bernyanyi diintegrasikan untuk memperkuat pemahaman konsep kebersihan. Eksplorasi langsung melalui praktik mencuci tangan dan membersihkan lingkungan memberikan pengalaman konkret yang mendukung prinsip berkesadaran, bermakna, dan menggembirakan.',
      partnership:
        'Melibatkan orang tua dalam menerapkan PHBS di rumah, kerjasama dengan puskesmas setempat untuk edukasi kesehatan, dan partisipasi masyarakat sekitar dalam menjaga kebersihan lingkungan sekolah.',
      environment:
        'Mengintegrasikan ruang kelas, area bermain outdoor, dan lingkungan sekitar sekolah. Menciptakan sudut kebersihan dan kesehatan di kelas dengan budaya belajar yang mendorong kemandirian, kolaborasi, dan tanggung jawab anak dalam menjaga kebersihan.',
      digitalUtilization:
        'Penggunaan video edukasi tentang PHBS, lagu-lagu digital bertema kebersihan untuk mendukung kegiatan bernyanyi, serta dokumentasi digital hasil karya anak. Platform pembelajaran digital sederhana dapat digunakan untuk berbagi dokumentasi kegiatan dengan orang tua. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Menyanyikan lagu 1234 Pergi Sekolah untuk membangun semangat',
      'Menonton video PHBS yang bermakna dan menarik',
      'Diskusi ide-ide kegiatan hari ini bersama anak',
      'Menyiapkan aturan bermain dan kesepakatan kelas',
    ],
    openingQuestions: [
      'Apa yang kamu lihat di video yang menunjukkan keindahan ciptaan Tuhan? (Keimanan dan Ketakwaan),',
      'Bagaimana cara kita menjaga kebersihan sebagai bentuk syukur? (Keimanan dan Ketakwaan),',
      'Mengapa penting membantu menjaga kebersihan sekolah bersama-sama? (Kewargaan),',
      'Apa yang terjadi jika kita tidak menjaga kebersihan? (Penalaran Kritis),',
      'Bagaimana perasaanmu ketika lingkungan bersih? (Kesehatan)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Seni Kreatif Ampas Kelapa (Kreativitas, Kemandirian). Alat dan Bahan: Ampas Kelapa, Pewarna makanan, Nampan atau wadah, Kertas HVS, Lem, Pensil, Cara Membuat: Siapkan ampas kelapa, kemudian masukkan ke dalam wadah. Bagi ampas kelapa menjadi beberapa bagian pada nampan atau wadah yang berbeda. Beri pewarna makanan yang berbeda pada ampas kelapa, kemudian aduk-aduk hingga tercampur rata, lalu jemur di bawah Terik matahari hingga kering. Jika ampas kelapa sudah ringan berarti tandanya ampas kelapa sudah benar-benar kering. Buat pola bunga atau sesuai kreativitas atau imajinasi anak di atas kertas HVS. Oleskan lem di atas pola gambar yang sudah di buat. Taburkan ampas kelapa di atas gambar yang sudah di olesi dengan lem. Kegiatan 2 : Eksperimen Mencuci Tangan (Penalaran Kritis, Kesehatan). Alat dan bahan: Piring berisi air, merica bubuk, sabun cair. Cara bermain: Taburkan merica di atas air sebagai representasi kuman. Minta anak mencelupkan jari ke air tanpa sabun, lalu dengan sabun. Amati perbedaannya. Kegiatan ini menjelaskan pentingnya sabun dalam membersihkan kuman. Kegiatan 3 : Bermain Tebak Gerakan Kebersihan (Komunikasi, Kolaborasi). Alat dan bahan: Kartu dengan nama aktivitas kebersihan. Cara bermain: Satu anak mengambil kartu dan memperagakan aktivitas tanpa suara, anak lain menebak. Kegiatan ini mengembangkan kemampuan komunikasi non-verbal dan pengenalan aktivitas kebersihan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Seni Kreatif Ampas Kelapa (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Ampas Kelapa, Pewarna makanan, Nampan atau wadah, Kertas HVS, Lem, Pensil',
            howToPlay:
              'Siapkan ampas kelapa, kemudian masukkan ke dalam wadah. Bagi ampas kelapa menjadi beberapa bagian pada nampan atau wadah yang berbeda. Beri pewarna makanan yang berbeda pada ampas kelapa, kemudian aduk-aduk hingga tercampur rata, lalu jemur di bawah Terik matahari hingga kering. Jika ampas kelapa sudah ringan berarti tandanya ampas kelapa sudah benar-benar kering. Buat pola bunga atau sesuai kreativitas atau imajinasi anak di atas kertas HVS. Oleskan lem di atas pola gambar yang sudah di buat. Taburkan ampas kelapa di atas gambar yang sudah di olesi dengan lem.',
            fullDescription:
              'Kegiatan 1: Seni Kreatif Ampas Kelapa (Kreativitas, Kemandirian). Alat dan Bahan: Ampas Kelapa, Pewarna makanan, Nampan atau wadah, Kertas HVS, Lem, Pensil, Cara Membuat: Siapkan ampas kelapa, kemudian masukkan ke dalam wadah. Bagi ampas kelapa menjadi beberapa bagian pada nampan atau wadah yang berbeda. Beri pewarna makanan yang berbeda pada ampas kelapa, kemudian aduk-aduk hingga tercampur rata, lalu jemur di bawah Terik matahari hingga kering. Jika ampas kelapa sudah ringan berarti tandanya ampas kelapa sudah benar-benar kering. Buat pola bunga atau sesuai kreativitas atau imajinasi anak di atas kertas HVS. Oleskan lem di atas pola gambar yang sudah di buat. Taburkan ampas kelapa di atas gambar yang sudah di olesi dengan lem.',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Mencuci Tangan (Penalaran Kritis, Kesehatan)',
            toolsAndMaterials: 'Piring berisi air, merica bubuk, sabun cair',
            howToPlay:
              'Taburkan merica di atas air sebagai representasi kuman. Minta anak mencelupkan jari ke air tanpa sabun, lalu dengan sabun. Amati perbedaannya. Kegiatan ini menjelaskan pentingnya sabun dalam membersihkan kuman.',
            fullDescription:
              'Kegiatan 2: Eksperimen Mencuci Tangan (Penalaran Kritis, Kesehatan). Alat dan bahan: Piring berisi air, merica bubuk, sabun cair. Cara bermain: Taburkan merica di atas air sebagai representasi kuman. Minta anak mencelupkan jari ke air tanpa sabun, lalu dengan sabun. Amati perbedaannya. Kegiatan ini menjelaskan pentingnya sabun dalam membersihkan kuman.',
          },
          {
            activityNumber: 3,
            title: 'Bermain Tebak Gerakan Kebersihan (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Kartu dengan nama aktivitas kebersihan',
            howToPlay:
              'Satu anak mengambil kartu dan memperagakan aktivitas tanpa suara, anak lain menebak. Kegiatan ini mengembangkan kemampuan komunikasi non-verbal dan pengenalan aktivitas kebersihan.',
            fullDescription:
              'Kegiatan 3: Bermain Tebak Gerakan Kebersihan (Komunikasi, Kolaborasi). Alat dan bahan: Kartu dengan nama aktivitas kebersihan. Cara bermain: Satu anak mengambil kartu dan memperagakan aktivitas tanpa suara, anak lain menebak. Kegiatan ini mengembangkan kemampuan komunikasi non-verbal dan pengenalan aktivitas kebersihan.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Mengambil Pompom Menggunakan Botol Plastik (Kemandirian, Penalaran Kritis). Alat dan Bahan : Botol plastic, pom-pom, nampan. Cara Bermain: Siapkan nampan, kemudian ini dengan pom-pom. Selanjunya, minta beberapa anak untuk menambil pom-pom yang sesuai dengan warna (setiap anak sudah di tentukan warna apa yang harus di ambil, sebelum permainan)Anak yang berhasil mengumpulkan lebih banyak dengan waktu tertentu yang menang. Kegiatan 2 : Membuat Sabun Apung (Kreativitas, Penalaran Kritis). Alat dan bahan: Sabun batang, parutan, air hangat, baking soda, cetakan silikon. Cara bermain: Bantu anak memarut sabun, campur dengan air hangat dan baking soda. Cetak dan biarkan mengeras. Uji apakah sabun dapat mengapung. Kegiatan ini mengembangkan pemahaman tentang densitas. Kegiatan 3 : Membuat Diorama Lingkungan Bersih (Kewargaan, Kreativitas). Alat dan bahan: Kotak sepatu, tanah, ranting, daun, balok kayu mini, kertas warna. Cara bermain: Ajak anak membuat diorama lingkungan bersih dalam kotak sepatu menggunakan bahan alam dan balok kayu mini. Kegiatan ini mengembangkan kreativitas dan kesadaran lingkungan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Mengambil Pompom Menggunakan Botol Plastik (Kemandirian, Penalaran Kritis)',
            toolsAndMaterials: 'Botol plastic, pom-pom, nampan',
            howToPlay:
              'Siapkan nampan, kemudian ini dengan pom-pom. Selanjunya, minta beberapa anak untuk menambil pom-pom yang sesuai dengan warna (setiap anak sudah di tentukan warna apa yang harus di ambil, sebelum permainan)Anak yang berhasil mengumpulkan lebih banyak dengan waktu tertentu yang menang.',
            fullDescription:
              'Kegiatan 1: Mengambil Pompom Menggunakan Botol Plastik (Kemandirian, Penalaran Kritis). Alat dan Bahan : Botol plastic, pom-pom, nampan. Cara Bermain: Siapkan nampan, kemudian ini dengan pom-pom. Selanjunya, minta beberapa anak untuk menambil pom-pom yang sesuai dengan warna (setiap anak sudah di tentukan warna apa yang harus di ambil, sebelum permainan)Anak yang berhasil mengumpulkan lebih banyak dengan waktu tertentu yang menang.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Sabun Apung (Kreativitas, Penalaran Kritis)',
            toolsAndMaterials: 'Sabun batang, parutan, air hangat, baking soda, cetakan silikon',
            howToPlay:
              'Bantu anak memarut sabun, campur dengan air hangat dan baking soda. Cetak dan biarkan mengeras. Uji apakah sabun dapat mengapung. Kegiatan ini mengembangkan pemahaman tentang densitas.',
            fullDescription:
              'Kegiatan 2: Membuat Sabun Apung (Kreativitas, Penalaran Kritis). Alat dan bahan: Sabun batang, parutan, air hangat, baking soda, cetakan silikon. Cara bermain: Bantu anak memarut sabun, campur dengan air hangat dan baking soda. Cetak dan biarkan mengeras. Uji apakah sabun dapat mengapung. Kegiatan ini mengembangkan pemahaman tentang densitas.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Diorama Lingkungan Bersih (Kewargaan, Kreativitas)',
            toolsAndMaterials: 'Kotak sepatu, tanah, ranting, daun, balok kayu mini, kertas warna',
            howToPlay:
              'Ajak anak membuat diorama lingkungan bersih dalam kotak sepatu menggunakan bahan alam dan balok kayu mini. Kegiatan ini mengembangkan kreativitas dan kesadaran lingkungan.',
            fullDescription:
              'Kegiatan 3: Membuat Diorama Lingkungan Bersih (Kewargaan, Kreativitas). Alat dan bahan: Kotak sepatu, tanah, ranting, daun, balok kayu mini, kertas warna. Cara bermain: Ajak anak membuat diorama lingkungan bersih dalam kotak sepatu menggunakan bahan alam dan balok kayu mini. Kegiatan ini mengembangkan kreativitas dan kesadaran lingkungan.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Menggiring Gelas Menggunakan Sedotan (Kemandirian, Kesehatan). Alat dan bahan: Sedotan, gelas kertas, selotip, meja. Cara Bemain: SIapkan meja, kemudian gambar kotak persegi panjang menggunakan selotip. Selanjunya pada sisi yang berlawanan letakkan 5 pcs gelas kertas. Mintalah anak-anak untuk memasukkan gelas kertas ke dalam kotak yang ada di depan mereka dengan cara m eniupkan gelas kertas menggunakan sedotan. Kegiatan 2 : Eksperimen Erosi Tanah (Penalaran Kritis, Kewargaan). Alat dan bahan: Nampan, tanah, rumput atau tanaman kecil, air, gelas. Cara bermain: Buat dua model bukit di nampan, satu ditanami rumput, satu tidak. Siram dengan air dan amati perbedaan erosi. Kegiatan ini menjelaskan pentingnya tanaman dalam menjaga lingkungan. Kegiatan 3 : Membuat Kaca Pembesar dari Air (Penalaran Kritis, Kreativitas). Alat dan bahan: Plastik bening, karet gelang, air. Cara bermain: Bantu anak membuat kaca pembesar sederhana dengan meregangkan plastik bening di atas gelas dan meneteskan air di tengahnya. Gunakan untuk mengamati benda-benda kecil. Kegiatan ini mengenalkan konsep pembesaran optik.',
        activities: [
          {
            activityNumber: 1,
            title: 'Menggiring Gelas Menggunakan Sedotan (Kemandirian, Kesehatan)',
            toolsAndMaterials:
              'Sedotan, gelas kertas, selotip, meja. Cara Bemain: SIapkan meja, kemudian gambar kotak persegi panjang menggunakan selotip. Selanjunya pada sisi yang berlawanan letakkan 5 pcs gelas kertas. Mintalah anak-anak untuk memasukkan gelas kertas ke dalam kotak yang ada di depan mereka dengan cara m eniupkan gelas kertas menggunakan sedotan.',
            howToPlay: '',
            fullDescription:
              'Kegiatan 1: Menggiring Gelas Menggunakan Sedotan (Kemandirian, Kesehatan). Alat dan bahan: Sedotan, gelas kertas, selotip, meja. Cara Bemain: SIapkan meja, kemudian gambar kotak persegi panjang menggunakan selotip. Selanjunya pada sisi yang berlawanan letakkan 5 pcs gelas kertas. Mintalah anak-anak untuk memasukkan gelas kertas ke dalam kotak yang ada di depan mereka dengan cara m eniupkan gelas kertas menggunakan sedotan.',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Erosi Tanah (Penalaran Kritis, Kewargaan)',
            toolsAndMaterials: 'Nampan, tanah, rumput atau tanaman kecil, air, gelas',
            howToPlay:
              'Buat dua model bukit di nampan, satu ditanami rumput, satu tidak. Siram dengan air dan amati perbedaan erosi. Kegiatan ini menjelaskan pentingnya tanaman dalam menjaga lingkungan.',
            fullDescription:
              'Kegiatan 2: Eksperimen Erosi Tanah (Penalaran Kritis, Kewargaan). Alat dan bahan: Nampan, tanah, rumput atau tanaman kecil, air, gelas. Cara bermain: Buat dua model bukit di nampan, satu ditanami rumput, satu tidak. Siram dengan air dan amati perbedaan erosi. Kegiatan ini menjelaskan pentingnya tanaman dalam menjaga lingkungan.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Kaca Pembesar dari Air (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials: 'Plastik bening, karet gelang, air',
            howToPlay:
              'Bantu anak membuat kaca pembesar sederhana dengan meregangkan plastik bening di atas gelas dan meneteskan air di tengahnya. Gunakan untuk mengamati benda-benda kecil. Kegiatan ini mengenalkan konsep pembesaran optik.',
            fullDescription:
              'Kegiatan 3: Membuat Kaca Pembesar dari Air (Penalaran Kritis, Kreativitas). Alat dan bahan: Plastik bening, karet gelang, air. Cara bermain: Bantu anak membuat kaca pembesar sederhana dengan meregangkan plastik bening di atas gelas dan meneteskan air di tengahnya. Gunakan untuk mengamati benda-benda kecil. Kegiatan ini mengenalkan konsep pembesaran optik.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Kerajinan Handprint Hutan (Kreativitas, Kewargaan). Alat dan bahan: Cat warna abu-abu, hijau, putih dan hitam, Kuas, Kertas coklat, Gunting, Lem, Kertas HVS, Daun - opsional, Cara Membuat: Mintalah anak-anak mengecat telapak tangan mereka dengan cat abu-abu. Buatlah cetakan menggunakan telapak tangan dengan jari-jari mengarah ke bawah. Lukis tangan masing-masing anak dan mintalah mereka membuat cetakan di dekat cetakan tangan ibu jari. Warnai bagian ibu jari dengan cat warna hitam untuk menandakan bagian belalai gajah. Saat cat mengering, potong kertas berwarna coklat menjadi potongan-potongan. Mintalah anak-anak meremas-remas potongan kertas tersebut. Tambahkan lem di sekeliling sisi kertas dan juga bagian atas sehingga menyerupai batang pohon yang bercabang. Tempelkan potongan kantong kertas coklat yang sudah di remas-remas untuk membuat pepohonan. Rekatkan ke dahan, jika tidak memiliki daun, dapat menggantinya dengan mengecatnya atau bahkan membuat daun cap jempol berwarna hijau. Anak-anak mungkin juga suka merobek kertas tisu hijau dan menempelkannya di ujung dahan. Saat cat abu-abu sudah kering, gunakan ujung kuas kecil untuk mengecat titik-titik putih kecil pada jari kaki gajah. Buat juga lingkaran putih untuk matanya. Gunakan cat hitam untuk membuat lingkaran kecil di dalam lingkaran putih. Lukis garis hitam sederhana untuk telinga gajah. Selanjutnya, cat hanya bagian jari saja dengan cat hijau dan buat cetakan di sepanjang tepi bawah untuk membuat rumput. Ulangi langkah ini sebanyak yang diperlukan sehingga mencakup seluruh bagian bawah halaman. Kegiatan 2 : Estafet Spons Bersih (Kolaborasi, Kesehatan). Alat dan bahan: Spons, ember berisi air, ember kosong, gelas plastik. Cara bermain: Bagi anak menjadi beberapa tim. Setiap tim harus memindahkan air dari ember berisi ke ember kosong menggunakan spons. Anak berlari membawa spons basah dan memerasnya ke ember kosong. Kegiatan ini melatih motorik kasar dan koordinasi. Kegiatan 3 : Menghitung dan Mengelompokkan Biji-bijian (Penalaran Kritis, Kemandirian). Alat dan bahan: Berbagai jenis biji-bijian (seperti kacang merah, kacang hijau, jagung), wadah kecil, kartu angka. Cara bermain: Siapkan beberapa wadah kecil dan isi dengan berbagai jenis biji-bijian yang sudah dicampur. Minta anak untuk mengelompokkan biji-bijian sesuai jenisnya ke dalam wadah terpisah. Setelah itu, ajak anak menghitung jumlah biji-bijian di setiap wadah dan mencocokkannya dengan kartu angka yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi, berhitung, dan pengenalan angka.',
        activities: [
          {
            activityNumber: 1,
            title: 'Kerajinan Handprint Hutan (Kreativitas, Kewargaan)',
            toolsAndMaterials:
              'Cat warna abu-abu, hijau, putih dan hitam, Kuas, Kertas coklat, Gunting, Lem, Kertas HVS, Daun - opsional',
            howToPlay:
              'Mintalah anak-anak mengecat telapak tangan mereka dengan cat abu-abu. Buatlah cetakan menggunakan telapak tangan dengan jari-jari mengarah ke bawah. Lukis tangan masing-masing anak dan mintalah mereka membuat cetakan di dekat cetakan tangan ibu jari. Warnai bagian ibu jari dengan cat warna hitam untuk menandakan bagian belalai gajah. Saat cat mengering, potong kertas berwarna coklat menjadi potongan-potongan. Mintalah anak-anak meremas-remas potongan kertas tersebut. Tambahkan lem di sekeliling sisi kertas dan juga bagian atas sehingga menyerupai batang pohon yang bercabang. Tempelkan potongan kantong kertas coklat yang sudah di remas-remas untuk membuat pepohonan. Rekatkan ke dahan, jika tidak memiliki daun, dapat menggantinya dengan mengecatnya atau bahkan membuat daun cap jempol berwarna hijau. Anak-anak mungkin juga suka merobek kertas tisu hijau dan menempelkannya di ujung dahan. Saat cat abu-abu sudah kering, gunakan ujung kuas kecil untuk mengecat titik-titik putih kecil pada jari kaki gajah. Buat juga lingkaran putih untuk matanya. Gunakan cat hitam untuk membuat lingkaran kecil di dalam lingkaran putih. Lukis garis hitam sederhana untuk telinga gajah. Selanjutnya, cat hanya bagian jari saja dengan cat hijau dan buat cetakan di sepanjang tepi bawah untuk membuat rumput. Ulangi langkah ini sebanyak yang diperlukan sehingga mencakup seluruh bagian bawah halaman.',
            fullDescription:
              'Kegiatan 1: Kerajinan Handprint Hutan (Kreativitas, Kewargaan). Alat dan bahan: Cat warna abu-abu, hijau, putih dan hitam, Kuas, Kertas coklat, Gunting, Lem, Kertas HVS, Daun - opsional, Cara Membuat: Mintalah anak-anak mengecat telapak tangan mereka dengan cat abu-abu. Buatlah cetakan menggunakan telapak tangan dengan jari-jari mengarah ke bawah. Lukis tangan masing-masing anak dan mintalah mereka membuat cetakan di dekat cetakan tangan ibu jari. Warnai bagian ibu jari dengan cat warna hitam untuk menandakan bagian belalai gajah. Saat cat mengering, potong kertas berwarna coklat menjadi potongan-potongan. Mintalah anak-anak meremas-remas potongan kertas tersebut. Tambahkan lem di sekeliling sisi kertas dan juga bagian atas sehingga menyerupai batang pohon yang bercabang. Tempelkan potongan kantong kertas coklat yang sudah di remas-remas untuk membuat pepohonan. Rekatkan ke dahan, jika tidak memiliki daun, dapat menggantinya dengan mengecatnya atau bahkan membuat daun cap jempol berwarna hijau. Anak-anak mungkin juga suka merobek kertas tisu hijau dan menempelkannya di ujung dahan. Saat cat abu-abu sudah kering, gunakan ujung kuas kecil untuk mengecat titik-titik putih kecil pada jari kaki gajah. Buat juga lingkaran putih untuk matanya. Gunakan cat hitam untuk membuat lingkaran kecil di dalam lingkaran putih. Lukis garis hitam sederhana untuk telinga gajah. Selanjutnya, cat hanya bagian jari saja dengan cat hijau dan buat cetakan di sepanjang tepi bawah untuk membuat rumput. Ulangi langkah ini sebanyak yang diperlukan sehingga mencakup seluruh bagian bawah halaman.',
          },
          {
            activityNumber: 2,
            title: 'Estafet Spons Bersih (Kolaborasi, Kesehatan)',
            toolsAndMaterials: 'Spons, ember berisi air, ember kosong, gelas plastik',
            howToPlay:
              'Bagi anak menjadi beberapa tim. Setiap tim harus memindahkan air dari ember berisi ke ember kosong menggunakan spons. Anak berlari membawa spons basah dan memerasnya ke ember kosong. Kegiatan ini melatih motorik kasar dan koordinasi.',
            fullDescription:
              'Kegiatan 2: Estafet Spons Bersih (Kolaborasi, Kesehatan). Alat dan bahan: Spons, ember berisi air, ember kosong, gelas plastik. Cara bermain: Bagi anak menjadi beberapa tim. Setiap tim harus memindahkan air dari ember berisi ke ember kosong menggunakan spons. Anak berlari membawa spons basah dan memerasnya ke ember kosong. Kegiatan ini melatih motorik kasar dan koordinasi.',
          },
          {
            activityNumber: 3,
            title: 'Menghitung dan Mengelompokkan Biji-bijian (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials:
              'Berbagai jenis biji-bijian (seperti kacang merah, kacang hijau, jagung), wadah kecil, kartu angka',
            howToPlay:
              'Siapkan beberapa wadah kecil dan isi dengan berbagai jenis biji-bijian yang sudah dicampur. Minta anak untuk mengelompokkan biji-bijian sesuai jenisnya ke dalam wadah terpisah. Setelah itu, ajak anak menghitung jumlah biji-bijian di setiap wadah dan mencocokkannya dengan kartu angka yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi, berhitung, dan pengenalan angka.',
            fullDescription:
              'Kegiatan 3: Menghitung dan Mengelompokkan Biji-bijian (Penalaran Kritis, Kemandirian). Alat dan bahan: Berbagai jenis biji-bijian (seperti kacang merah, kacang hijau, jagung), wadah kecil, kartu angka. Cara bermain: Siapkan beberapa wadah kecil dan isi dengan berbagai jenis biji-bijian yang sudah dicampur. Minta anak untuk mengelompokkan biji-bijian sesuai jenisnya ke dalam wadah terpisah. Setelah itu, ajak anak menghitung jumlah biji-bijian di setiap wadah dan mencocokkannya dengan kartu angka yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi, berhitung, dan pengenalan angka.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Membawa Gelas Menggunakan Lidi Sambil Melompat Lewati Rintangan (Kesehatan, Kemandirian). Alat dan Bahan: 2 Gelas kertas, 2 Lidi, busa/ hula hop. Cara Membuat dan Memainkannya: Siapkan busa atau hula hop, kemudian tata di atas lantai dengan di beri jarak. Ajak anak-anak untuk bergantian membawa gelas kertas menggunakan lidi sambil berjalan melewati busa atau hula hop yang sudah di tata di atas lantai dengan melompat dari busa atau hula hop satu ke busa atau hula hop lainya hingga finish dan meletakkan gelas pada wadah yang sudah di sediakan. Kegiatan 2 : Lomba Mengepel Estafet (Kolaborasi, Kewargaan). Alat dan bahan: Kain pel mini, ember kecil berisi air, botol plastik sebagai rintangan. Cara bermain: Buat jalur mengepel dengan meletakkan botol plastik sebagai rintangan. Bagi anak menjadi beberapa tim untuk berlomba mengepel melewati rintangan. Kegiatan ini melatih koordinasi, keseimbangan, dan kecepatan. Kegiatan 3 : Memindahkan Biji-bijian dengan Sumpit (Kemandirian, Penalaran Kritis). Alat dan bahan: Dua mangkuk, biji-bijian (seperti kacang atau manik-manik besar), sumpit kayu. Cara bermain: Minta anak memindahkan biji-bijian dari satu mangkuk ke mangkuk lain menggunakan sumpit. Kegiatan ini melatih motorik halus dan koordinasi mata-tangan.',
        activities: [
          {
            activityNumber: 1,
            title:
              'Membawa Gelas Menggunakan Lidi Sambil Melompat Lewati Rintangan (Kesehatan, Kemandirian)',
            toolsAndMaterials: '2 Gelas kertas, 2 Lidi, busa/ hula hop',
            howToPlay:
              'dan Memainkannya: Siapkan busa atau hula hop, kemudian tata di atas lantai dengan di beri jarak. Ajak anak-anak untuk bergantian membawa gelas kertas menggunakan lidi sambil berjalan melewati busa atau hula hop yang sudah di tata di atas lantai dengan melompat dari busa atau hula hop satu ke busa atau hula hop lainya hingga finish dan meletakkan gelas pada wadah yang sudah di sediakan.',
            fullDescription:
              'Kegiatan 1: Membawa Gelas Menggunakan Lidi Sambil Melompat Lewati Rintangan (Kesehatan, Kemandirian). Alat dan Bahan: 2 Gelas kertas, 2 Lidi, busa/ hula hop. Cara Membuat dan Memainkannya: Siapkan busa atau hula hop, kemudian tata di atas lantai dengan di beri jarak. Ajak anak-anak untuk bergantian membawa gelas kertas menggunakan lidi sambil berjalan melewati busa atau hula hop yang sudah di tata di atas lantai dengan melompat dari busa atau hula hop satu ke busa atau hula hop lainya hingga finish dan meletakkan gelas pada wadah yang sudah di sediakan.',
          },
          {
            activityNumber: 2,
            title: 'Lomba Mengepel Estafet (Kolaborasi, Kewargaan)',
            toolsAndMaterials:
              'Kain pel mini, ember kecil berisi air, botol plastik sebagai rintangan',
            howToPlay:
              'Buat jalur mengepel dengan meletakkan botol plastik sebagai rintangan. Bagi anak menjadi beberapa tim untuk berlomba mengepel melewati rintangan. Kegiatan ini melatih koordinasi, keseimbangan, dan kecepatan.',
            fullDescription:
              'Kegiatan 2: Lomba Mengepel Estafet (Kolaborasi, Kewargaan). Alat dan bahan: Kain pel mini, ember kecil berisi air, botol plastik sebagai rintangan. Cara bermain: Buat jalur mengepel dengan meletakkan botol plastik sebagai rintangan. Bagi anak menjadi beberapa tim untuk berlomba mengepel melewati rintangan. Kegiatan ini melatih koordinasi, keseimbangan, dan kecepatan.',
          },
          {
            activityNumber: 3,
            title: 'Memindahkan Biji-bijian dengan Sumpit (Kemandirian, Penalaran Kritis)',
            toolsAndMaterials:
              'Dua mangkuk, biji-bijian (seperti kacang atau manik-manik besar), sumpit kayu',
            howToPlay:
              'Minta anak memindahkan biji-bijian dari satu mangkuk ke mangkuk lain menggunakan sumpit. Kegiatan ini melatih motorik halus dan koordinasi mata-tangan.',
            fullDescription:
              'Kegiatan 3: Memindahkan Biji-bijian dengan Sumpit (Kemandirian, Penalaran Kritis). Alat dan bahan: Dua mangkuk, biji-bijian (seperti kacang atau manik-manik besar), sumpit kayu. Cara bermain: Minta anak memindahkan biji-bijian dari satu mangkuk ke mangkuk lain menggunakan sumpit. Kegiatan ini melatih motorik halus dan koordinasi mata-tangan.',
          },
        ],
      },
    ],
    closingActivities: [
      'Bermain tepuk tangan Tepuk Bersih-Bersih dengan irama ceria',
      'Anak bergiliran menunjukkan gerakan favorit dari kegiatan hari ini',
      'Parade hasil karya keliling kelas sambil bernyanyi gembira',
      'Permainan Aku Bisa Apa? - setiap anak menyebutkan satu hal baru yang dipelajari dengan penuh semangat',
      'Yel-yel kebersihan bersama dengan gerakan tubuh yang energik',
      'Memberikan stiker bintang kebersihan kepada setiap anak sambil memuji pencapaiannya',
      'Merencanakan misi kebersihan esok hari dengan antusias tinggi',
      'Berdoa penutup sambil berpegangan tangan membentuk lingkaran',
      'High-five dan pelukan grup sebelum pulang',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak merespons pertanyaan pemantik tentang kebersihan dengan antusias dan sesuai pengalaman',
      },
      {
        no: 2,
        indicator: 'Anak menunjukkan minat dan keterlibatan aktif saat menonton video PHBS',
      },
      {
        no: 3,
        indicator: 'Anak mengucapkan doa sebelum dan sesudah kegiatan dengan kesadaran penuh',
      },
      {
        no: 4,
        indicator:
          'Anak melakukan eksperimen mencuci tangan dengan mengikuti langkah-langkah yang benar',
      },
      {
        no: 5,
        indicator:
          'Anak berpartisipasi aktif dalam kegiatan kelompok dan menunjukkan sikap kerjasama',
      },
      {
        no: 6,
        indicator:
          'Anak menunjukkan kreativitas dalam membuat karya seni menggunakan berbagai media',
      },
      {
        no: 7,
        indicator: 'Anak mampu memindahkan benda dengan koordinasi mata-tangan yang baik',
      },
      {
        no: 8,
        indicator: 'Anak menunjukkan inisiatif dalam menjaga kebersihan area bermain tanpa diminta',
      },
      {
        no: 9,
        indicator:
          'Anak dapat menceritakan kembali kegiatan yang dilakukan dengan bahasa sederhana',
      },
      {
        no: 10,
        indicator:
          'Anak menunjukkan kepedulian terhadap lingkungan melalui kegiatan membersihkan mainan',
      },
      {
        no: 11,
        indicator:
          'Anak mengekspresikan rasa syukur dan kegembiraan atas pengalaman belajar hari ini',
      },
      {
        no: 12,
        indicator: 'Anak mampu menyebutkan minimal 2 cara menjaga kebersihan diri dan lingkungan',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 7,
    filename: '43_TK_B_Smt1_07_Rumahku.docx',
    title: 'RUMAHKU SURGAKU S',
    topic: 'LINGKUNGANKU',
    subtopic: 'RUMAHKU',
    modelPembelajaran: 'PjBL, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'September 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: false,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: true,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: true,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun (Kelompok B) memiliki kemampuan motorik halus yang berkembang untuk membuat miniatur dan menggunting, rasa ingin tahu tinggi tentang lingkungan sekitar terutama rumah sebagai tempat tinggal, kemampuan berkomunikasi sederhana untuk menyampaikan ide, dan minat besar terhadap kegiatan konstruktif seperti membangun dan merancang.',
      learningMaterial:
        'Materi tentang rumah dan bagian-bagiannya mencakup pengetahuan esensial mengenai fungsi setiap ruangan, pengetahuan aplikatif dalam merancang dan membuat model rumah, serta pengetahuan nilai dan karakter melalui rasa syukur atas tempat tinggal dan menghargai perbedaan jenis rumah. Materi relevan dengan kehidupan sehari-hari anak dan mengintegrasikan nilai-nilai keagamaan, sosial, dan estetika.',
    },
    learningDesign: {
      cp: 'CP Jati Diri: Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budayaCP Dasar Literasi dan STEAM: Murid mampu mengamati, menyebutkan alasan, pilihan atau keputusannya, mampu memecahkan masalah sederhana, serta mengetahui hubungan sebab akibat dari suatu kondisi atau situasi yang dipengaruhi oleh hukum alam dan kondisi sosial',
      crossDisciplinary:
        'Nilai agama dan moral (menghargai ciptaan Tuhan melalui rumah sebagai tempat berlindung), Nilai Pancasila (menghormati keberagaman jenis rumah), Fisik motorik (keterampilan menggunting dan menempel dalam membuat miniatur), Kognitif (memahami fungsi bagian rumah dan hubungan sebab-akibat), Bahasa (mengomunikasikan ide tentang rumah impian), Sosial emosional (berbagi dan bekerja sama dalam kegiatan kelompok)',
      tp: 'Anak dapat mengembangkan pemahaman tentang keberagaman, kemampuan mengekspresikan diri, serta keterampilan motorik halusnya, Anak dapat memahami hubungan sebab-akibat terkait pemilihan bahan bangunan untuk rumah serta mengaplikasikan pengetahuannya dalam membuat model rumah sederhana.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain konstruktif melalui pembuatan miniatur rumah, bercerita tentang rumah impian, bernyanyi lagu tentang bagian rumah, dan eksplorasi bahan bangunan. Metode ini mendukung pembelajaran berkesadaran melalui observasi langsung, bermakna dengan menghubungkan konsep rumah dengan kehidupan sehari-hari, dan menggembirakan melalui aktivitas kreatif yang menyenangkan.',
      partnership:
        'Melibatkan orang tua dalam menceritakan sejarah rumah keluarga, mengundang tukang bangunan lokal untuk berbagi pengalaman, dan berkolaborasi dengan teman sekelas dalam proyek membuat miniatur rumah bersama-sama.',
      environment:
        'Ruang kelas diatur fleksibel dengan area konstruksi untuk membuat miniatur, sudut eksplorasi bahan bangunan, dan ruang presentasi. Budaya belajar kolaboratif dengan menghargai kreativitas setiap anak dan menciptakan suasana aman untuk mengekspresikan ide.',
      digitalUtilization:
        'Video pembelajaran tentang bagian-bagian rumah, media interaktif untuk pengenalan huruf dan angka, serta dokumentasi digital hasil karya anak. Teknologi digunakan sebagai pendukung pembelajaran yang memperkaya pengalaman belajar anak melalui media audio visual yang menarik. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Bernyanyi lagu Rumahku untuk menciptakan suasana gembira',
      'Bercerita tentang keragaman rumah di Indonesia yang bermakna',
      'Review kegiatan sebelumnya dengan antusias',
      'Menyiapkan aturan bermain dan kesepakatan kelas',
      'Ceritakan bagian rumah favoritmu dan alasannya! (Komunikasi)',
    ],
    openingQuestions: [
      'Apa yang membuat rumahmu istimewa sebagai ciptaan Tuhan? (Keimanan dan Ketakwaan)',
      'Bagaimana kamu bisa membantu menjaga rumah bersama keluarga? (Kewargaan)',
      'Mengapa atap rumah biasanya dibuat miring, bukan datar? (Penalaran Kritis)',
      'Jika kamu bisa mendesain rumah impian, seperti apa bentuknya? (Kreativitas)',
      'Siapa saja yang membantu membangun rumah? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri untuk merawat kamarmu? (Kemandirian)',
      'Bagaimana rumah melindungi kesehatan kita? (Kesehatan)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Membuat Rumah Gadang Dari Daun (Kreativitas, Kemandirian). Alat dan bahan: Kertas HVS, Daun (berbagai jenis dan ukuran, lebih baik yang berwarna hijau), Gunting (pastikan anak menggunakan gunting yang aman untuk anak-anak), Lem (lem yang aman untuk anak-anak, seperti lem kertas), Cara Membuat: Gambarlah bentuk dasar rumah gadang di atas kertas HVS menggunakan pensil atau spidol. Pastikan bentuk tersebut cukup besar agar mudah bagi anak untuk menempelkan daun-daun. Siapkan daun-daun yang sudah dikumpulkan. Ajarkan anak untuk menggunting daun kecil-kecil. Bisa dipotong sesuai dengan kesukaan anak, misalnya berbentuk seperti genting atau papan. Beri lem pada area rumah gadang yang digambar di kertas HVS. Ajak anak untuk menempelkan potongan daun di atas lem sesuai tempatnya. Mulailah dari bagian atap rumah gadang, lalu susun daun-daun agar menyerupai genting atap rumah Lanjutkan dengan menempelkan daun pada bagian dinding rumah gadang. Setelah semua bagian rumah tertutup oleh daun, periksalah apakah setiap potongan daun telah tertempel dengan baik. Angin-anginkan biarkan lem mengeringKegiatan 2: Miniatur Rumah dari Kardus (Kolaborasi, Komunikasi). Alat dan bahan: Kardus bekas berbagai ukuran, gunting, lem, kertas warna, spidol, dan pensil warna. Cara bermain: Anak-anak dibagi menjadi kelompok kecil dan diberikan kardus bekas serta alat-alat lainnya. Mereka diminta untuk membuat miniatur rumah menggunakan kardus tersebut. Guru membimbing anak-anak untuk membuat bagian-bagian rumah seperti atap, dinding, jendela, dan pintu. Anak-anak dapat menghias rumah mereka menggunakan kertas warna dan pensil warna. Setelah selesai, setiap kelompok mempresentasikan rumah mereka dan menyebutkan bagian-bagiannya. Kegiatan 3: Eksperimen Atap Bocor (Penalaran Kritis). Alat dan Bahan: Botol semprot air, karton, plastik. Cara Bermain: Anak membuat atap dari berbagai bahan dan menyemprotkan air untuk melihat bahan mana yang terbaik untuk atap.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Rumah Gadang Dari Daun (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Kertas HVS, Daun (berbagai jenis dan ukuran, lebih baik yang berwarna hijau), Gunting (pastikan anak menggunakan gunting yang aman untuk anak-anak), Lem (lem yang aman untuk anak-anak, seperti lem kertas)',
            howToPlay:
              'Gambarlah bentuk dasar rumah gadang di atas kertas HVS menggunakan pensil atau spidol. Pastikan bentuk tersebut cukup besar agar mudah bagi anak untuk menempelkan daun-daun. Siapkan daun-daun yang sudah dikumpulkan. Ajarkan anak untuk menggunting daun kecil-kecil. Bisa dipotong sesuai dengan kesukaan anak, misalnya berbentuk seperti genting atau papan. Beri lem pada area rumah gadang yang digambar di kertas HVS. Ajak anak untuk menempelkan potongan daun di atas lem sesuai tempatnya. Mulailah dari bagian atap rumah gadang, lalu susun daun-daun agar menyerupai genting atap rumah Lanjutkan dengan menempelkan daun pada bagian dinding rumah gadang. Setelah semua bagian rumah tertutup oleh daun, periksalah apakah setiap potongan daun telah tertempel dengan baik. Angin-anginkan biarkan lem mengering',
            fullDescription:
              'Kegiatan 1: Membuat Rumah Gadang Dari Daun (Kreativitas, Kemandirian). Alat dan bahan: Kertas HVS, Daun (berbagai jenis dan ukuran, lebih baik yang berwarna hijau), Gunting (pastikan anak menggunakan gunting yang aman untuk anak-anak), Lem (lem yang aman untuk anak-anak, seperti lem kertas), Cara Membuat: Gambarlah bentuk dasar rumah gadang di atas kertas HVS menggunakan pensil atau spidol. Pastikan bentuk tersebut cukup besar agar mudah bagi anak untuk menempelkan daun-daun. Siapkan daun-daun yang sudah dikumpulkan. Ajarkan anak untuk menggunting daun kecil-kecil. Bisa dipotong sesuai dengan kesukaan anak, misalnya berbentuk seperti genting atau papan. Beri lem pada area rumah gadang yang digambar di kertas HVS. Ajak anak untuk menempelkan potongan daun di atas lem sesuai tempatnya. Mulailah dari bagian atap rumah gadang, lalu susun daun-daun agar menyerupai genting atap rumah Lanjutkan dengan menempelkan daun pada bagian dinding rumah gadang. Setelah semua bagian rumah tertutup oleh daun, periksalah apakah setiap potongan daun telah tertempel dengan baik. Angin-anginkan biarkan lem mengering',
          },
          {
            activityNumber: 2,
            title: 'Miniatur Rumah dari Kardus (Kolaborasi, Komunikasi)',
            toolsAndMaterials:
              'Kardus bekas berbagai ukuran, gunting, lem, kertas warna, spidol, dan pensil warna',
            howToPlay:
              'Anak-anak dibagi menjadi kelompok kecil dan diberikan kardus bekas serta alat-alat lainnya. Mereka diminta untuk membuat miniatur rumah menggunakan kardus tersebut. Guru membimbing anak-anak untuk membuat bagian-bagian rumah seperti atap, dinding, jendela, dan pintu. Anak-anak dapat menghias rumah mereka menggunakan kertas warna dan pensil warna. Setelah selesai, setiap kelompok mempresentasikan rumah mereka dan menyebutkan bagian-bagiannya.',
            fullDescription:
              'Kegiatan 2: Miniatur Rumah dari Kardus (Kolaborasi, Komunikasi). Alat dan bahan: Kardus bekas berbagai ukuran, gunting, lem, kertas warna, spidol, dan pensil warna. Cara bermain: Anak-anak dibagi menjadi kelompok kecil dan diberikan kardus bekas serta alat-alat lainnya. Mereka diminta untuk membuat miniatur rumah menggunakan kardus tersebut. Guru membimbing anak-anak untuk membuat bagian-bagian rumah seperti atap, dinding, jendela, dan pintu. Anak-anak dapat menghias rumah mereka menggunakan kertas warna dan pensil warna. Setelah selesai, setiap kelompok mempresentasikan rumah mereka dan menyebutkan bagian-bagiannya.',
          },
          {
            activityNumber: 3,
            title: 'Eksperimen Atap Bocor (Penalaran Kritis)',
            toolsAndMaterials: 'Botol semprot air, karton, plastik',
            howToPlay:
              'Anak membuat atap dari berbagai bahan dan menyemprotkan air untuk melihat bahan mana yang terbaik untuk atap.',
            fullDescription:
              'Kegiatan 3: Eksperimen Atap Bocor (Penalaran Kritis). Alat dan Bahan: Botol semprot air, karton, plastik. Cara Bermain: Anak membuat atap dari berbagai bahan dan menyemprotkan air untuk melihat bahan mana yang terbaik untuk atap.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Mencari dan Menyusun Huruf Membentuk Kata Rumah Ku (Komunikasi, Kemandirian). Alat dan Bahan, printable huruf (setiap huruf di buat lebih dari satu), Kertas karton/ kardus bekas, Lem, Cara Membuat dan MemainkannyaSiapkan printable huruf sesuai nama anak-anak. Siapkan printable huruf yang sudah di potong-potong, lalu letakkan di atas lantai. Mintalah anak-anak untuk mencari huruf dan menyusunnya membentuk Namanya sendiri. Kemudian oleskan lem dan rekatkan pada kardus. Kegiatan 2: Bermain Peran Keluarga di Rumah (Kewargaan, Kolaborasi). Alat dan bahan: Kostum sederhana (celemek, topi koki, dll.), peralatan rumah tangga mainan (piring, gelas, sapu, dll.), dan area bermain yang ditata menyerupai ruangan di rumah. Cara bermain: Anak-anak dibagi menjadi beberapa kelompok yang mewakili keluarga. Setiap anak mendapat peran sebagai anggota keluarga (ayah, ibu, anak, kakek, nenek). Mereka diminta untuk bermain peran melakukan aktivitas sehari-hari di rumah, seperti memasak, makan bersama, membersihkan rumah, atau bersantai di ruang keluarga. Guru membimbing anak-anak untuk menyebutkan nama ruangan dan fungsinya saat bermain peran. Kegiatan 3: Arsitek Cilik - Merancang Rumah Ramah Lingkungan (Penalaran Kritis, Kreativitas). Alat dan bahan: Kertas gambar, pensil, krayon, stiker pohon dan bunga, kertas origami hijau, lem stick, gunting anak, template panel surya dari kertas silver, cotton buds, kertas biru. Cara bermain: Anak menggambar bentuk dasar rumah menggunakan penggaris, menempel template panel surya di atap, membuat kincir angin dari cotton buds, menambahkan taman dengan stiker pohon dan bunga, membuat kolam air hujan dari kertas biru, lalu mewarnai seluruh rumah. Setelah selesai, anak mempresentasikan hasil karyanya dan menjelaskan bagaimana setiap elemen membantu menjaga lingkungan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Mencari dan Menyusun Huruf Membentuk Kata Rumah Ku (Komunikasi, Kemandirian)',
            toolsAndMaterials:
              'printable huruf (setiap huruf di buat lebih dari satu), Kertas karton/ kardus bekas, Lem',
            howToPlay:
              'dan MemainkannyaSiapkan printable huruf sesuai nama anak-anak. Siapkan printable huruf yang sudah di potong-potong, lalu letakkan di atas lantai. Mintalah anak-anak untuk mencari huruf dan menyusunnya membentuk Namanya sendiri. Kemudian oleskan lem dan rekatkan pada kardus.',
            fullDescription:
              'Kegiatan 1: Mencari dan Menyusun Huruf Membentuk Kata Rumah Ku (Komunikasi, Kemandirian). Alat dan Bahan, printable huruf (setiap huruf di buat lebih dari satu), Kertas karton/ kardus bekas, Lem, Cara Membuat dan MemainkannyaSiapkan printable huruf sesuai nama anak-anak. Siapkan printable huruf yang sudah di potong-potong, lalu letakkan di atas lantai. Mintalah anak-anak untuk mencari huruf dan menyusunnya membentuk Namanya sendiri. Kemudian oleskan lem dan rekatkan pada kardus.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Peran Keluarga di Rumah (Kewargaan, Kolaborasi)',
            toolsAndMaterials:
              'Kostum sederhana (celemek, topi koki, dll.), peralatan rumah tangga mainan (piring, gelas, sapu, dll.), dan area bermain yang ditata menyerupai ruangan di rumah',
            howToPlay:
              'Anak-anak dibagi menjadi beberapa kelompok yang mewakili keluarga. Setiap anak mendapat peran sebagai anggota keluarga (ayah, ibu, anak, kakek, nenek). Mereka diminta untuk bermain peran melakukan aktivitas sehari-hari di rumah, seperti memasak, makan bersama, membersihkan rumah, atau bersantai di ruang keluarga. Guru membimbing anak-anak untuk menyebutkan nama ruangan dan fungsinya saat bermain peran.',
            fullDescription:
              'Kegiatan 2: Bermain Peran Keluarga di Rumah (Kewargaan, Kolaborasi). Alat dan bahan: Kostum sederhana (celemek, topi koki, dll.), peralatan rumah tangga mainan (piring, gelas, sapu, dll.), dan area bermain yang ditata menyerupai ruangan di rumah. Cara bermain: Anak-anak dibagi menjadi beberapa kelompok yang mewakili keluarga. Setiap anak mendapat peran sebagai anggota keluarga (ayah, ibu, anak, kakek, nenek). Mereka diminta untuk bermain peran melakukan aktivitas sehari-hari di rumah, seperti memasak, makan bersama, membersihkan rumah, atau bersantai di ruang keluarga. Guru membimbing anak-anak untuk menyebutkan nama ruangan dan fungsinya saat bermain peran.',
          },
          {
            activityNumber: 3,
            title:
              'Arsitek Cilik - Merancang Rumah Ramah Lingkungan (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials:
              'Kertas gambar, pensil, krayon, stiker pohon dan bunga, kertas origami hijau, lem stick, gunting anak, template panel surya dari kertas silver, cotton buds, kertas biru',
            howToPlay:
              'Anak menggambar bentuk dasar rumah menggunakan penggaris, menempel template panel surya di atap, membuat kincir angin dari cotton buds, menambahkan taman dengan stiker pohon dan bunga, membuat kolam air hujan dari kertas biru, lalu mewarnai seluruh rumah. Setelah selesai, anak mempresentasikan hasil karyanya dan menjelaskan bagaimana setiap elemen membantu menjaga lingkungan.',
            fullDescription:
              'Kegiatan 3: Arsitek Cilik - Merancang Rumah Ramah Lingkungan (Penalaran Kritis, Kreativitas). Alat dan bahan: Kertas gambar, pensil, krayon, stiker pohon dan bunga, kertas origami hijau, lem stick, gunting anak, template panel surya dari kertas silver, cotton buds, kertas biru. Cara bermain: Anak menggambar bentuk dasar rumah menggunakan penggaris, menempel template panel surya di atap, membuat kincir angin dari cotton buds, menambahkan taman dengan stiker pohon dan bunga, membuat kolam air hujan dari kertas biru, lalu mewarnai seluruh rumah. Setelah selesai, anak mempresentasikan hasil karyanya dan menjelaskan bagaimana setiap elemen membantu menjaga lingkungan.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Memindahkan Bola Sambil Merangkak Membawa Buku (Kesehatan, Kemandirian). Alat dan Bahan, Bola plastik, Wadah/keranjang, Buku, Cara Membuat dam Memainkannya Bagi anak menjadi dua, lalu mintalah anak-anak berbaris sesuai kelompok masing-masing. Siapkan wadah masukkan bola plastik ke dalam wadah, lalu siapkan juga wadah kosong dan letakkan pada sisi yang berlawan. Mintalah anak untuk merangkak mulai dari wadah bola yang kosong menuju wadah bola yang sudah di isi dengan bola sambil merangkak dengan membawa buku yang di letakkan pada punggung. Jalan sambil merangkak jangan sampai buku terjatuh, lalu ambil bola dan pindahkan ke wadah yang kosongJika sudah selesai giliran teman berikutnya yang berada di belakangnya, lakukan hingga mendapatkan giliran semua. Kelompok yang terlebih dahulu mengumpulkan bola lebih banyak itu yang menang. Kegiatan 2: Menggambar dan Mewarnai Rumah Impian (Kreativitas, Komunikasi). Alat dan bahan: Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air. Cara bermain: Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar. Kegiatan 3: Membangun Rumah dari Lego (Kolaborasi, Penalaran Kritis). Alat dan Bahan: Balok Lego berbagai ukuran dan warna, alas bermain Lego, kartu contoh rumah sederhana. Cara Bermain: Anak dibagi kelompok 2-3 orang, masing-masing mendapat satu set Lego dan alas. Guru menunjukkan kartu contoh rumah sebagai inspirasi. Anak menyusun balok Lego membentuk rumah dengan dinding, atap, pintu, dan jendela. Setelah selesai, anak menghitung jumlah bagian rumah yang dibuat dan menyebutkan warna balok untuk setiap bagian. Kegiatan diakhiri dengan tur melihat hasil karya kelompok lain.',
        activities: [
          {
            activityNumber: 1,
            title: 'Memindahkan Bola Sambil Merangkak Membawa Buku (Kesehatan, Kemandirian)',
            toolsAndMaterials: 'Bola plastik, Wadah/keranjang, Buku',
            howToPlay:
              'dam Memainkannya Bagi anak menjadi dua, lalu mintalah anak-anak berbaris sesuai kelompok masing-masing. Siapkan wadah masukkan bola plastik ke dalam wadah, lalu siapkan juga wadah kosong dan letakkan pada sisi yang berlawan. Mintalah anak untuk merangkak mulai dari wadah bola yang kosong menuju wadah bola yang sudah di isi dengan bola sambil merangkak dengan membawa buku yang di letakkan pada punggung. Jalan sambil merangkak jangan sampai buku terjatuh, lalu ambil bola dan pindahkan ke wadah yang kosongJika sudah selesai giliran teman berikutnya yang berada di belakangnya, lakukan hingga mendapatkan giliran semua. Kelompok yang terlebih dahulu mengumpulkan bola lebih banyak itu yang menang.',
            fullDescription:
              'Kegiatan 1: Memindahkan Bola Sambil Merangkak Membawa Buku (Kesehatan, Kemandirian). Alat dan Bahan, Bola plastik, Wadah/keranjang, Buku, Cara Membuat dam Memainkannya Bagi anak menjadi dua, lalu mintalah anak-anak berbaris sesuai kelompok masing-masing. Siapkan wadah masukkan bola plastik ke dalam wadah, lalu siapkan juga wadah kosong dan letakkan pada sisi yang berlawan. Mintalah anak untuk merangkak mulai dari wadah bola yang kosong menuju wadah bola yang sudah di isi dengan bola sambil merangkak dengan membawa buku yang di letakkan pada punggung. Jalan sambil merangkak jangan sampai buku terjatuh, lalu ambil bola dan pindahkan ke wadah yang kosongJika sudah selesai giliran teman berikutnya yang berada di belakangnya, lakukan hingga mendapatkan giliran semua. Kelompok yang terlebih dahulu mengumpulkan bola lebih banyak itu yang menang.',
          },
          {
            activityNumber: 2,
            title: 'Menggambar dan Mewarnai Rumah Impian (Kreativitas, Komunikasi)',
            toolsAndMaterials:
              'Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air',
            howToPlay:
              'Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar.',
            fullDescription:
              'Kegiatan 2: Menggambar dan Mewarnai Rumah Impian (Kreativitas, Komunikasi). Alat dan bahan: Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air. Cara bermain: Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar.',
          },
          {
            activityNumber: 3,
            title: 'Membangun Rumah dari Lego (Kolaborasi, Penalaran Kritis)',
            toolsAndMaterials:
              'Balok Lego berbagai ukuran dan warna, alas bermain Lego, kartu contoh rumah sederhana',
            howToPlay:
              'Anak dibagi kelompok 2-3 orang, masing-masing mendapat satu set Lego dan alas. Guru menunjukkan kartu contoh rumah sebagai inspirasi. Anak menyusun balok Lego membentuk rumah dengan dinding, atap, pintu, dan jendela. Setelah selesai, anak menghitung jumlah bagian rumah yang dibuat dan menyebutkan warna balok untuk setiap bagian. Kegiatan diakhiri dengan tur melihat hasil karya kelompok lain.',
            fullDescription:
              'Kegiatan 3: Membangun Rumah dari Lego (Kolaborasi, Penalaran Kritis). Alat dan Bahan: Balok Lego berbagai ukuran dan warna, alas bermain Lego, kartu contoh rumah sederhana. Cara Bermain: Anak dibagi kelompok 2-3 orang, masing-masing mendapat satu set Lego dan alas. Guru menunjukkan kartu contoh rumah sebagai inspirasi. Anak menyusun balok Lego membentuk rumah dengan dinding, atap, pintu, dan jendela. Setelah selesai, anak menghitung jumlah bagian rumah yang dibuat dan menyebutkan warna balok untuk setiap bagian. Kegiatan diakhiri dengan tur melihat hasil karya kelompok lain.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Menyusun Puzzle (Penalaran Kritis, Kemandirian). Alat dan Bahan : Kertas HVS, Spidol, Gunting, Cara Membuat dan Memainkannya :Buat bentuk kotak-kotak pada kertas HVS. Beri tanda titik di atasnya. Lalu potong dengan gunting. Di atas kertas HVS lain gambar bentuk kotak-kotak disertai dengan titik. Lalu mintalah kepada anak-anak untuk memasang puzzle sesuai dengan gambar yang ada di kertas HVS. NB : untuk membuat puzzle dapat menggunakan kardus bekas atau karton dan warnai dengan krayon atau pensil warna, dapat juga menggunakan gambar yang akan di pelajari bersama anak-anak. Kegiatan 2: Puzzle Bagian-bagian Rumah (Komunikasi, Kreativitas). Alat dan bahan: Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air. Cara bermain: Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar. Kegiatan 3: Eksperimen Cahaya dan Jendela (Penalaran Kritis). Alat dan Bahan: Senter, kertas transparan, kertas buram. Cara Bermain: Anak mencoba melihat bagaimana cahaya masuk melalui berbagai bahan yang digunakan untuk jendela.',
        activities: [
          {
            activityNumber: 1,
            title: 'Menyusun Puzzle (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Kertas HVS, Spidol, Gunting',
            howToPlay:
              'dan Memainkannya :Buat bentuk kotak-kotak pada kertas HVS. Beri tanda titik di atasnya. Lalu potong dengan gunting. Di atas kertas HVS lain gambar bentuk kotak-kotak disertai dengan titik. Lalu mintalah kepada anak-anak untuk memasang puzzle sesuai dengan gambar yang ada di kertas HVS. NB : untuk membuat puzzle dapat menggunakan kardus bekas atau karton dan warnai dengan krayon atau pensil warna, dapat juga menggunakan gambar yang akan di pelajari bersama anak-anak.',
            fullDescription:
              'Kegiatan 1: Menyusun Puzzle (Penalaran Kritis, Kemandirian). Alat dan Bahan : Kertas HVS, Spidol, Gunting, Cara Membuat dan Memainkannya :Buat bentuk kotak-kotak pada kertas HVS. Beri tanda titik di atasnya. Lalu potong dengan gunting. Di atas kertas HVS lain gambar bentuk kotak-kotak disertai dengan titik. Lalu mintalah kepada anak-anak untuk memasang puzzle sesuai dengan gambar yang ada di kertas HVS. NB : untuk membuat puzzle dapat menggunakan kardus bekas atau karton dan warnai dengan krayon atau pensil warna, dapat juga menggunakan gambar yang akan di pelajari bersama anak-anak.',
          },
          {
            activityNumber: 2,
            title: 'Puzzle Bagian-bagian Rumah (Komunikasi, Kreativitas)',
            toolsAndMaterials:
              'Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air',
            howToPlay:
              'Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar.',
            fullDescription:
              'Kegiatan 2: Puzzle Bagian-bagian Rumah (Komunikasi, Kreativitas). Alat dan bahan: Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air. Cara bermain: Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar.',
          },
          {
            activityNumber: 3,
            title: 'Eksperimen Cahaya dan Jendela (Penalaran Kritis)',
            toolsAndMaterials: 'Senter, kertas transparan, kertas buram',
            howToPlay:
              'Anak mencoba melihat bagaimana cahaya masuk melalui berbagai bahan yang digunakan untuk jendela.',
            fullDescription:
              'Kegiatan 3: Eksperimen Cahaya dan Jendela (Penalaran Kritis). Alat dan Bahan: Senter, kertas transparan, kertas buram. Cara Bermain: Anak mencoba melihat bagaimana cahaya masuk melalui berbagai bahan yang digunakan untuk jendela.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1: Permainan Sasaran Air (Kesehatan, Kemandirian). Alat dan Bahan :, Wadah, Lego untuk sasaran (dapat di beri pemberat agar tenggelam), Sedotan, Air, Tutup botol atau balon, Cara Membuat dan Memainkannya: Siapkan wadah, kemudian isi dengan air. Selanjutnya masukkan lego atau benda untuk di gunakan sebagai sasaran objek. Masukkan juga tutup botol atau balon dengan warna yang sesuai dengan objek sasaran. Mintalah anak untuk meniup balon atau tutup botol menggunakan sedotan agar dapat bergerak menuju objek sasaran yang memiliki warna yang sama dengan balon atau tutup botol. Kegiatan 2: Eksplorasi Bahan Bangunan Rumah (Penalaran Kritis, Kreativitas). Alat dan bahan: Berbagai bahan bangunan dalam ukuran kecil dan aman (misalnya potongan kayu kecil, batu bata mainan, genteng miniatur, pasir, dll.), wadah air, dan cetakan pasir. Cara bermain: Anak-anak dibagi menjadi kelompok kecil. Setiap kelompok diberikan berbagai bahan bangunan miniatur. Mereka diminta untuk mengeksplorasi bahan-bahan tersebut, merasakan teksturnya, dan mencoba membuat struktur sederhana. Guru menjelaskan fungsi dari setiap bahan dalam pembangunan rumah. Anak-anak juga dapat bermain dengan pasir dan air untuk membuat semen dan mencoba membangun dinding kecil. Kegiatan ini membantu anak-anak memahami bahan-bahan yang digunakan dalam membangun rumah. Kegiatan 3: Mengukur dengan Penggaris (Penalaran Kritis). Alat dan Bahan: Penggaris, kertas gambar. Cara Bermain: Anak mengukur gambar jendela atau pintu yang mereka buat dan mencatat hasilnya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Permainan Sasaran Air (Kesehatan, Kemandirian)',
            toolsAndMaterials:
              ', Wadah, Lego untuk sasaran (dapat di beri pemberat agar tenggelam), Sedotan, Air, Tutup botol atau balon',
            howToPlay:
              'dan Memainkannya: Siapkan wadah, kemudian isi dengan air. Selanjutnya masukkan lego atau benda untuk di gunakan sebagai sasaran objek. Masukkan juga tutup botol atau balon dengan warna yang sesuai dengan objek sasaran. Mintalah anak untuk meniup balon atau tutup botol menggunakan sedotan agar dapat bergerak menuju objek sasaran yang memiliki warna yang sama dengan balon atau tutup botol.',
            fullDescription:
              'Kegiatan 1: Permainan Sasaran Air (Kesehatan, Kemandirian). Alat dan Bahan :, Wadah, Lego untuk sasaran (dapat di beri pemberat agar tenggelam), Sedotan, Air, Tutup botol atau balon, Cara Membuat dan Memainkannya: Siapkan wadah, kemudian isi dengan air. Selanjutnya masukkan lego atau benda untuk di gunakan sebagai sasaran objek. Masukkan juga tutup botol atau balon dengan warna yang sesuai dengan objek sasaran. Mintalah anak untuk meniup balon atau tutup botol menggunakan sedotan agar dapat bergerak menuju objek sasaran yang memiliki warna yang sama dengan balon atau tutup botol.',
          },
          {
            activityNumber: 2,
            title: 'Eksplorasi Bahan Bangunan Rumah (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials:
              'Berbagai bahan bangunan dalam ukuran kecil dan aman (misalnya potongan kayu kecil, batu bata mainan, genteng miniatur, pasir, dll.), wadah air, dan cetakan pasir',
            howToPlay:
              'Anak-anak dibagi menjadi kelompok kecil. Setiap kelompok diberikan berbagai bahan bangunan miniatur. Mereka diminta untuk mengeksplorasi bahan-bahan tersebut, merasakan teksturnya, dan mencoba membuat struktur sederhana. Guru menjelaskan fungsi dari setiap bahan dalam pembangunan rumah. Anak-anak juga dapat bermain dengan pasir dan air untuk membuat semen dan mencoba membangun dinding kecil. Kegiatan ini membantu anak-anak memahami bahan-bahan yang digunakan dalam membangun rumah.',
            fullDescription:
              'Kegiatan 2: Eksplorasi Bahan Bangunan Rumah (Penalaran Kritis, Kreativitas). Alat dan bahan: Berbagai bahan bangunan dalam ukuran kecil dan aman (misalnya potongan kayu kecil, batu bata mainan, genteng miniatur, pasir, dll.), wadah air, dan cetakan pasir. Cara bermain: Anak-anak dibagi menjadi kelompok kecil. Setiap kelompok diberikan berbagai bahan bangunan miniatur. Mereka diminta untuk mengeksplorasi bahan-bahan tersebut, merasakan teksturnya, dan mencoba membuat struktur sederhana. Guru menjelaskan fungsi dari setiap bahan dalam pembangunan rumah. Anak-anak juga dapat bermain dengan pasir dan air untuk membuat semen dan mencoba membangun dinding kecil. Kegiatan ini membantu anak-anak memahami bahan-bahan yang digunakan dalam membangun rumah.',
          },
          {
            activityNumber: 3,
            title: 'Mengukur dengan Penggaris (Penalaran Kritis)',
            toolsAndMaterials: 'Penggaris, kertas gambar',
            howToPlay:
              'Anak mengukur gambar jendela atau pintu yang mereka buat dan mencatat hasilnya.',
            fullDescription:
              'Kegiatan 3: Mengukur dengan Penggaris (Penalaran Kritis). Alat dan Bahan: Penggaris, kertas gambar. Cara Bermain: Anak mengukur gambar jendela atau pintu yang mereka buat dan mencatat hasilnya.',
          },
        ],
      },
    ],
    closingActivities: [
      'Parade rumah impian keliling kelas sambil bernyanyi dengan gembira',
      'Tebak-tebakan seru tentang bagian rumah dengan hadiah tepuk tangan meriah',
      'Dance party Rumah Bahagia dengan gerakan membangun rumah',
      'Sesi foto bersama hasil karya dengan pose arsitek cilik',
      'Cerita singkat Aku Bangga Jadi Arsitek dengan antusias',
      'High-five keliling untuk semua pencapaian hari ini',
      'Yel-yel kelas Rumah Impian, Kami Bisa! dengan suara lantang',
      'Doa penutup sambil memeluk hasil karya dengan hati senang',
      'Rencana esok hari disampaikan dengan nada misterius dan menarik',
    ],
    iktpItems: [
      {
        no: 1,
        indicator: 'Anak dapat menyebutkan minimal 3 bagian rumah dan fungsinya dengan benar',
      },
      {
        no: 2,
        indicator:
          'Anak mampu membuat miniatur rumah menggunakan bahan daur ulang dengan kreativitas',
      },
      {
        no: 3,
        indicator:
          'Anak dapat menjelaskan alasan pemilihan bahan untuk bagian tertentu rumah (sebab-akibat)',
      },
      {
        no: 4,
        indicator: 'Anak menunjukkan kemampuan bekerja sama dan berbagi dalam kegiatan kelompok',
      },
      {
        no: 5,
        indicator: 'Anak dapat menceritakan rumah impiannya dengan kalimat sederhana dan jelas',
      },
      {
        no: 6,
        indicator:
          'Anak mampu menggunakan alat seperti gunting dan lem dengan koordinasi motorik halus yang baik',
      },
      {
        no: 7,
        indicator:
          'Anak menunjukkan sikap menghargai dan memberikan apresiasi terhadap hasil karya teman',
      },
      {
        no: 8,
        indicator: 'Anak dapat mengikuti instruksi bertahap dalam membuat kerajinan dengan mandiri',
      },
      {
        no: 9,
        indicator:
          'Anak mampu mengungkapkan perasaan dan pengalaman tentang kegiatan yang dilakukan',
      },
      {
        no: 10,
        indicator: 'Anak menunjukkan kemandirian dalam membereskan dan menata kembali alat-bahan',
      },
      {
        no: 11,
        indicator: 'Anak dapat menghubungkan konsep rumah dengan rasa syukur sebagai ciptaan Tuhan',
      },
      {
        no: 12,
        indicator: 'Anak mampu mempresentasikan hasil karyanya di depan teman dengan percaya diri',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 8,
    filename: '44_TK_B_Smt1_08_Sekolahku.docx',
    title: 'SERUNYA BERMAIN DI TAMAN SEKOLAHKU',
    topic: 'LINGKUNGANKU',
    subtopic: 'SEKOLAHKU',
    modelPembelajaran: 'STEAM, PjBL, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'September 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: true,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: true,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak kelompok B (5-6 tahun) memiliki rasa ingin tahu yang tinggi tentang lingkungan sekolah, mulai mengembangkan kemandirian dalam aktivitas sehari-hari, dan membutuhkan pengalaman bermakna untuk memahami perannya sebagai bagian dari komunitas sekolah. Anak-anak pada usia ini senang bereksplorasi, bermain bersama teman, dan memerlukan dukungan dalam mengembangkan kepercayaan diri serta keterampilan sosial emosional.',
      learningMaterial:
        'Materi pengenalan lingkungan sekolah mencakup pengetahuan esensial tentang identitas diri di sekolah, pengetahuan aplikatif dalam berinteraksi dengan lingkungan sekolah, dan pengetahuan nilai-karakter tentang sikap positif terhadap sekolah. Materi ini relevan dengan kehidupan sehari-hari anak, memiliki tingkat kesulitan yang sesuai perkembangan, dan terintegrasi dengan pembentukan karakter serta nilai-nilai kehidupan.',
    },
    learningDesign: {
      cp: 'CP Jati Diri: Murid mengenali, mengekspresikan, dan mengelola emosi diri, serta membangun hubungan sosial secara sehatCP Jati Diri: Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budaya',
      crossDisciplinary:
        'Nilai agama dan moral (pengembangan kesadaran spiritual dan akhlak mulia), Nilai Pancasila (pengenalan identitas sebagai anak Indonesia), Fisik motorik (koordinasi gerak dalam aktivitas sekolah), Kognitif (pemahaman konsep dan pemecahan masalah sederhana), Bahasa (komunikasi efektif dalam lingkungan sekolah), Sosial emosional (keterampilan berinteraksi dan bekerja sama).',
      tp: 'Anak dapat mengembangkan kemampuan identitas diri, keterampilan sosial-emosional, dan kemampuan fisik motorik halus secara terpadu dalam konteks pengenalan lingkungan sekolah. Anak mampu mengekspresi pemahaman dan perasaan positif tentang dirinya sebagai bagian dari komunitas sekolah, Anak mampu menunjukkan sikap baik terhadap guru dan teman dalam konteks kegiatan sekolah.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain yang menyenangkan, bercerita untuk membangun imajinasi, bernyanyi untuk mengembangkan bahasa dan motorik, serta eksplorasi langsung lingkungan sekolah. Metode ini mendukung pembelajaran berkesadaran melalui keterlibatan aktif, bermakna melalui konteks nyata, dan menggembirakan melalui aktivitas yang sesuai minat anak.',
      partnership:
        'Melibatkan guru kelas lain, kepala sekolah sebagai narasumber, orang tua dalam kegiatan rumah, dan komunitas sekolah seperti petugas kebersihan atau satpam untuk memberikan perspektif berbeda tentang kehidupan sekolah kepada anak-anak.',
      environment:
        'Ruang kelas yang fleksibel untuk berbagai aktivitas, area outdoor sekolah untuk eksplorasi, penggunaan platform digital sederhana untuk dokumentasi karya anak, serta budaya belajar yang saling menghargai dan mendukung setiap anak untuk berekspresi dengan percaya diri.',
      digitalUtilization:
        'Penggunaan media digital sederhana seperti video edukatif dan buku cerita digital untuk mendukung pemahaman anak tentang lingkungan sekolah. Media digital digunakan secara terbatas dan seimbang dengan kegiatan hands-on untuk menjaga keseimbangan perkembangan anak. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Renungan/nasehat/motivasi pagi yang bermakna',
      'Menyanyikan lagu 1234 Pergi Sekolah dengan gembira',
      'Asesmen awal dan diskusi ide kegiatan hari ini',
      'Kegiatan pemantik berupa buku cerita/video Oru Senang Sekolah',
      'Menyiapkan properti kelas dan kesepakatan bermain',
    ],
    openingQuestions: [
      'Apa yang membuat kamu senang di sekolah? (Keimanan dan ketakwaan)',
      'Siapa saja teman-teman di kelasmu? (Kolaborasi dan komunikasi)',
      'Bagaimana caramu membantu teman? (Kewargaan dan kemandirian)',
      'Apa yang kamu pelajari hari ini? (Penalaran kritis)',
      'Karya apa yang ingin kamu buat? (Kreativitas)',
      'Bagaimana caramu menjaga kesehatan di sekolah? (Kesehatan)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Balap Memindahkan Traffic Cone Dengan Kaki (Kesehatan, Kemandirian). Alat dan Bahan: Traffic Cone (bisa menggunakan benda lain yang ringan dan mudah dijepit dengan kaki), Hula hopCara Membuat dan Memainkannya; Siapkan traffic cone dan pastikan ada area bermain yang cukup luas dan bebas hambatan. Pastikan juga kondisi traffic cone dalam keadaan baik. Tata hula hop dengan di sejajarkan dengan rapi kemudian letakkan traffic cone di luar hula hop dengan di beri jarak. Letakkan traffic cone di antara kedua kaki lalu jepit traffic cone dengan kedua kaki kemudian lakukan gerakan melompat untuk memindahkan traffic cone ke dalam hula hop yang telah ditentukan sebelumnya. Lakukan hal yang sama untuk memindahkan traffic cone ke dalam hula hop yang telah ditentukan. Kegiatan 2 : Bermain Telepon-teleponan (Komunikasi, Kolaborasi). Alat dan bahan: Dua buah gelas plastik, tali panjang. Cara bermain: Buat telepon sederhana dengan menghubungkan dua gelas plastik menggunakan tali. Bagi anak-anak berpasangan dan minta mereka bercakap-cakap menggunakan telepon tersebut. Berikan tema percakapan, seperti mengundang teman ke pesta ulang tahun atau menanyakan kabar teman yang sakit. Kegiatan ini melatih keterampilan berbicara dan mendengarkan, serta mengembangkan kemampuan berkomunikasi dalam berbagai konteks sosial. Kegiatan 3 : Permainan Apa yang Berubah? (Penalaran Kritis, Komunikasi). Alat dan bahan: Berbagai benda kecil. Cara bermain: Letakkan beberapa benda di atas meja. Minta anak-anak mengamati benda-benda tersebut selama satu menit. Kemudian, minta anak-anak menutup mata. Ubah posisi atau hilangkan salah satu benda. Minta anak-anak membuka mata dan menjelaskan apa yang berubah. Dorong mereka untuk menjelaskan dengan kalimat lengkap. Kegiatan ini melatih kemampuan observasi, memori, dan kemampuan menjelaskan dengan bahasa yang jelas.',
        activities: [
          {
            activityNumber: 1,
            title: 'Balap Memindahkan Traffic Cone Dengan Kaki (Kesehatan, Kemandirian)',
            toolsAndMaterials:
              'Traffic Cone (bisa menggunakan benda lain yang ringan dan mudah dijepit dengan kaki), Hula hop',
            howToPlay:
              'dan Memainkannya; Siapkan traffic cone dan pastikan ada area bermain yang cukup luas dan bebas hambatan. Pastikan juga kondisi traffic cone dalam keadaan baik. Tata hula hop dengan di sejajarkan dengan rapi kemudian letakkan traffic cone di luar hula hop dengan di beri jarak. Letakkan traffic cone di antara kedua kaki lalu jepit traffic cone dengan kedua kaki kemudian lakukan gerakan melompat untuk memindahkan traffic cone ke dalam hula hop yang telah ditentukan sebelumnya. Lakukan hal yang sama untuk memindahkan traffic cone ke dalam hula hop yang telah ditentukan.',
            fullDescription:
              'Kegiatan 1: Balap Memindahkan Traffic Cone Dengan Kaki (Kesehatan, Kemandirian). Alat dan Bahan: Traffic Cone (bisa menggunakan benda lain yang ringan dan mudah dijepit dengan kaki), Hula hopCara Membuat dan Memainkannya; Siapkan traffic cone dan pastikan ada area bermain yang cukup luas dan bebas hambatan. Pastikan juga kondisi traffic cone dalam keadaan baik. Tata hula hop dengan di sejajarkan dengan rapi kemudian letakkan traffic cone di luar hula hop dengan di beri jarak. Letakkan traffic cone di antara kedua kaki lalu jepit traffic cone dengan kedua kaki kemudian lakukan gerakan melompat untuk memindahkan traffic cone ke dalam hula hop yang telah ditentukan sebelumnya. Lakukan hal yang sama untuk memindahkan traffic cone ke dalam hula hop yang telah ditentukan.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Telepon-teleponan (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Dua buah gelas plastik, tali panjang',
            howToPlay:
              'Buat telepon sederhana dengan menghubungkan dua gelas plastik menggunakan tali. Bagi anak-anak berpasangan dan minta mereka bercakap-cakap menggunakan telepon tersebut. Berikan tema percakapan, seperti mengundang teman ke pesta ulang tahun atau menanyakan kabar teman yang sakit. Kegiatan ini melatih keterampilan berbicara dan mendengarkan, serta mengembangkan kemampuan berkomunikasi dalam berbagai konteks sosial.',
            fullDescription:
              'Kegiatan 2: Bermain Telepon-teleponan (Komunikasi, Kolaborasi). Alat dan bahan: Dua buah gelas plastik, tali panjang. Cara bermain: Buat telepon sederhana dengan menghubungkan dua gelas plastik menggunakan tali. Bagi anak-anak berpasangan dan minta mereka bercakap-cakap menggunakan telepon tersebut. Berikan tema percakapan, seperti mengundang teman ke pesta ulang tahun atau menanyakan kabar teman yang sakit. Kegiatan ini melatih keterampilan berbicara dan mendengarkan, serta mengembangkan kemampuan berkomunikasi dalam berbagai konteks sosial.',
          },
          {
            activityNumber: 3,
            title: 'Permainan Apa yang Berubah? (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials: 'Berbagai benda kecil',
            howToPlay:
              'Letakkan beberapa benda di atas meja. Minta anak-anak mengamati benda-benda tersebut selama satu menit. Kemudian, minta anak-anak menutup mata. Ubah posisi atau hilangkan salah satu benda. Minta anak-anak membuka mata dan menjelaskan apa yang berubah. Dorong mereka untuk menjelaskan dengan kalimat lengkap. Kegiatan ini melatih kemampuan observasi, memori, dan kemampuan menjelaskan dengan bahasa yang jelas.',
            fullDescription:
              'Kegiatan 3: Permainan Apa yang Berubah? (Penalaran Kritis, Komunikasi). Alat dan bahan: Berbagai benda kecil. Cara bermain: Letakkan beberapa benda di atas meja. Minta anak-anak mengamati benda-benda tersebut selama satu menit. Kemudian, minta anak-anak menutup mata. Ubah posisi atau hilangkan salah satu benda. Minta anak-anak membuka mata dan menjelaskan apa yang berubah. Dorong mereka untuk menjelaskan dengan kalimat lengkap. Kegiatan ini melatih kemampuan observasi, memori, dan kemampuan menjelaskan dengan bahasa yang jelas.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : STEAM Membuat Kipas Matahari dari Piring Kertas (Kreativitas, Kemandirian). Alat dan bahan: Piring kertas, Stik es krim, Kertas origami warna kuning dan oranye, Lem, Gunting, Cat warna. Cara Membuat: Warnailah bagian depan piring kertas dengan warna kuning dan oranye, kemudiankan diamkan sebentar tunggu hingga mengering. Potong kertas origami kuning dan oranye menjadi bentuk segitiga kecil (sekitar 4-5 cm). Buat beberapa potongan (6-8 lembar kuning dan 6-8 lembar oranye). Tempelkan segitiga kuning dan oranye tersebut di sekeliling tepi piring kertas sehingga menyerupai sinar matahari. Tempelkan stik es krim di bagian belakang piring kertas menggunakan lem. Pastikan stik es krim terpasang kuat sehingga bisa digunakan sebagai pegangan. Biarkan lem mengering selama beberapa menit agar semua bagian menempel dengan kuat. Periksa kembali seluruh bagian kipas matahari, pastikan semua bagian sudah terpasang dengan baik dan lem telah kering. Kegiatan 2 : Membuat Maket Sekolah (Kreativitas, Kolaborasi). Alat dan bahan: Kardus bekas, kertas warna, lem, gunting, bahan alam (ranting, daun kering). Cara bermain: Ajak anak-anak membuat maket sekolah menggunakan kardus bekas. Mereka dapat menambahkan detail seperti pohon dari ranting dan daun kering. Kegiatan ini melatih perencanaan, motorik halus, dan kreativitas. Kegiatan 3 : Permainan Simon Says versi Sopan Santun (Kewargaan, Komunikasi). Alat dan bahan: Tidak diperlukan alat khusus. Cara bermain: Guru memberikan instruksi yang berhubungan dengan sopan santun, misalnya Simon says ucapkan terima kasih, Simon says minta maaf, atau Simon says bersalaman. Anak-anak harus melakukan instruksi jika diawali dengan Simon says. Jika tidak, mereka harus tetap diam. Kegiatan ini melatih pendengaran, konsentrasi, dan membiasakan anak-anak dengan perilaku sopan santun.',
        activities: [
          {
            activityNumber: 1,
            title: 'STEAM Membuat Kipas Matahari dari Piring Kertas (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Piring kertas, Stik es krim, Kertas origami warna kuning dan oranye, Lem, Gunting, Cat warna',
            howToPlay:
              'Warnailah bagian depan piring kertas dengan warna kuning dan oranye, kemudiankan diamkan sebentar tunggu hingga mengering. Potong kertas origami kuning dan oranye menjadi bentuk segitiga kecil (sekitar 4-5 cm). Buat beberapa potongan (6-8 lembar kuning dan 6-8 lembar oranye). Tempelkan segitiga kuning dan oranye tersebut di sekeliling tepi piring kertas sehingga menyerupai sinar matahari. Tempelkan stik es krim di bagian belakang piring kertas menggunakan lem. Pastikan stik es krim terpasang kuat sehingga bisa digunakan sebagai pegangan. Biarkan lem mengering selama beberapa menit agar semua bagian menempel dengan kuat. Periksa kembali seluruh bagian kipas matahari, pastikan semua bagian sudah terpasang dengan baik dan lem telah kering.',
            fullDescription:
              'Kegiatan 1: STEAM Membuat Kipas Matahari dari Piring Kertas (Kreativitas, Kemandirian). Alat dan bahan: Piring kertas, Stik es krim, Kertas origami warna kuning dan oranye, Lem, Gunting, Cat warna. Cara Membuat: Warnailah bagian depan piring kertas dengan warna kuning dan oranye, kemudiankan diamkan sebentar tunggu hingga mengering. Potong kertas origami kuning dan oranye menjadi bentuk segitiga kecil (sekitar 4-5 cm). Buat beberapa potongan (6-8 lembar kuning dan 6-8 lembar oranye). Tempelkan segitiga kuning dan oranye tersebut di sekeliling tepi piring kertas sehingga menyerupai sinar matahari. Tempelkan stik es krim di bagian belakang piring kertas menggunakan lem. Pastikan stik es krim terpasang kuat sehingga bisa digunakan sebagai pegangan. Biarkan lem mengering selama beberapa menit agar semua bagian menempel dengan kuat. Periksa kembali seluruh bagian kipas matahari, pastikan semua bagian sudah terpasang dengan baik dan lem telah kering.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Maket Sekolah (Kreativitas, Kolaborasi)',
            toolsAndMaterials:
              'Kardus bekas, kertas warna, lem, gunting, bahan alam (ranting, daun kering)',
            howToPlay:
              'Ajak anak-anak membuat maket sekolah menggunakan kardus bekas. Mereka dapat menambahkan detail seperti pohon dari ranting dan daun kering. Kegiatan ini melatih perencanaan, motorik halus, dan kreativitas.',
            fullDescription:
              'Kegiatan 2: Membuat Maket Sekolah (Kreativitas, Kolaborasi). Alat dan bahan: Kardus bekas, kertas warna, lem, gunting, bahan alam (ranting, daun kering). Cara bermain: Ajak anak-anak membuat maket sekolah menggunakan kardus bekas. Mereka dapat menambahkan detail seperti pohon dari ranting dan daun kering. Kegiatan ini melatih perencanaan, motorik halus, dan kreativitas.',
          },
          {
            activityNumber: 3,
            title: 'Permainan Simon Says versi Sopan Santun (Kewargaan, Komunikasi)',
            toolsAndMaterials: 'Tidak diperlukan alat khusus',
            howToPlay:
              'Guru memberikan instruksi yang berhubungan dengan sopan santun, misalnya Simon says ucapkan terima kasih, Simon says minta maaf, atau Simon says bersalaman. Anak-anak harus melakukan instruksi jika diawali dengan Simon says. Jika tidak, mereka harus tetap diam. Kegiatan ini melatih pendengaran, konsentrasi, dan membiasakan anak-anak dengan perilaku sopan santun.',
            fullDescription:
              'Kegiatan 3: Permainan Simon Says versi Sopan Santun (Kewargaan, Komunikasi). Alat dan bahan: Tidak diperlukan alat khusus. Cara bermain: Guru memberikan instruksi yang berhubungan dengan sopan santun, misalnya Simon says ucapkan terima kasih, Simon says minta maaf, atau Simon says bersalaman. Anak-anak harus melakukan instruksi jika diawali dengan Simon says. Jika tidak, mereka harus tetap diam. Kegiatan ini melatih pendengaran, konsentrasi, dan membiasakan anak-anak dengan perilaku sopan santun.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Coding Warna. Alat dan Bahan (Penalaran Kritis, Kemandirian): printable gambar lingkaran berwarna, Spidol, Cara Membuat dan memainkannya;Siapkan printable gambar lingkaran berwarna (untuk gambar dapat di sesuaikanKemudian, buat ketentuan : Jika lingkaran berwarna kuning maka harus di beri t tegak lurus (vertikal) (I) menggunakan spidol. Jika lingkaran berwarna merah maka harus di beri t silang (X) menggunakan spidolJika lingkaran berwarna biru maka harus di beri t strip (-) menggunakan spidolJika lingkaran berwarna hijau maka harus di beri t plus (+) menggunakan spidolAnak-anak harus mencoret warna sesuai dengan petunjuk atau ketentuanKegiatan 2 : Membangun Gedung Sekolah dari Balok Magnetik (Kreativitas, Kolaborasi). Alat dan bahan: Balok magnetik berbagai bentuk dan warna. Cara bermain: Tantang anak-anak untuk membangun replika gedung sekolah menggunakan balok magnetik. Mereka harus memperhatikan bentuk dan warna sesuai dengan gedung sekolah asli. Kegiatan ini melatih koordinasi mata-tangan dan pemahaman spasial. Kegiatan 3 : Tebak Emosi (Komunikasi, Kolaborasi). Alat dan bahan: Kartu bergambar ekspresi wajah yang menunjukkan berbagai emosi. Cara bermain: Tunjukkan kartu emosi kepada seorang anak tanpa memperlihatkannya kepada yang lain. Anak tersebut harus memperagakan emosi yang ada di kartu tanpa berbicara. Anak-anak lain harus menebak emosi apa yang diperagakan. Setelah berhasil ditebak, diskusikan situasi yang mungkin menyebabkan emosi tersebut. Kegiatan ini membantu anak-anak memahami dan mengekspresikan emosi, serta mengembangkan empati.',
        activities: [
          {
            activityNumber: 1,
            title: 'Coding Warna',
            toolsAndMaterials:
              '(Penalaran Kritis, Kemandirian): printable gambar lingkaran berwarna, Spidol',
            howToPlay:
              'dan memainkannya;Siapkan printable gambar lingkaran berwarna (untuk gambar dapat di sesuaikanKemudian, buat ketentuan : Jika lingkaran berwarna kuning maka harus di beri t tegak lurus (vertikal) (I) menggunakan spidol. Jika lingkaran berwarna merah maka harus di beri t silang (X) menggunakan spidolJika lingkaran berwarna biru maka harus di beri t strip (-) menggunakan spidolJika lingkaran berwarna hijau maka harus di beri t plus (+) menggunakan spidolAnak-anak harus mencoret warna sesuai dengan petunjuk atau ketentuan',
            fullDescription:
              'Kegiatan 1: Coding Warna. Alat dan Bahan (Penalaran Kritis, Kemandirian): printable gambar lingkaran berwarna, Spidol, Cara Membuat dan memainkannya;Siapkan printable gambar lingkaran berwarna (untuk gambar dapat di sesuaikanKemudian, buat ketentuan : Jika lingkaran berwarna kuning maka harus di beri t tegak lurus (vertikal) (I) menggunakan spidol. Jika lingkaran berwarna merah maka harus di beri t silang (X) menggunakan spidolJika lingkaran berwarna biru maka harus di beri t strip (-) menggunakan spidolJika lingkaran berwarna hijau maka harus di beri t plus (+) menggunakan spidolAnak-anak harus mencoret warna sesuai dengan petunjuk atau ketentuan',
          },
          {
            activityNumber: 2,
            title: 'Membangun Gedung Sekolah dari Balok Magnetik (Kreativitas, Kolaborasi)',
            toolsAndMaterials: 'Balok magnetik berbagai bentuk dan warna',
            howToPlay:
              'Tantang anak-anak untuk membangun replika gedung sekolah menggunakan balok magnetik. Mereka harus memperhatikan bentuk dan warna sesuai dengan gedung sekolah asli. Kegiatan ini melatih koordinasi mata-tangan dan pemahaman spasial.',
            fullDescription:
              'Kegiatan 2: Membangun Gedung Sekolah dari Balok Magnetik (Kreativitas, Kolaborasi). Alat dan bahan: Balok magnetik berbagai bentuk dan warna. Cara bermain: Tantang anak-anak untuk membangun replika gedung sekolah menggunakan balok magnetik. Mereka harus memperhatikan bentuk dan warna sesuai dengan gedung sekolah asli. Kegiatan ini melatih koordinasi mata-tangan dan pemahaman spasial.',
          },
          {
            activityNumber: 3,
            title: 'Tebak Emosi (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Kartu bergambar ekspresi wajah yang menunjukkan berbagai emosi',
            howToPlay:
              'Tunjukkan kartu emosi kepada seorang anak tanpa memperlihatkannya kepada yang lain. Anak tersebut harus memperagakan emosi yang ada di kartu tanpa berbicara. Anak-anak lain harus menebak emosi apa yang diperagakan. Setelah berhasil ditebak, diskusikan situasi yang mungkin menyebabkan emosi tersebut. Kegiatan ini membantu anak-anak memahami dan mengekspresikan emosi, serta mengembangkan empati.',
            fullDescription:
              'Kegiatan 3: Tebak Emosi (Komunikasi, Kolaborasi). Alat dan bahan: Kartu bergambar ekspresi wajah yang menunjukkan berbagai emosi. Cara bermain: Tunjukkan kartu emosi kepada seorang anak tanpa memperlihatkannya kepada yang lain. Anak tersebut harus memperagakan emosi yang ada di kartu tanpa berbicara. Anak-anak lain harus menebak emosi apa yang diperagakan. Setelah berhasil ditebak, diskusikan situasi yang mungkin menyebabkan emosi tersebut. Kegiatan ini membantu anak-anak memahami dan mengekspresikan emosi, serta mengembangkan empati.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Roket Nama Sendiri (Kreativitas, Kemandirian). Alat dan bahan: Kertas HVS/kertas konstruksi hitam, Kertas Origami, Lem, Gunting, Spidol, Crayon, Stik es krim. Cara Membuat: Siapkan kertas konstruksi hitam atau kertas HVS. Kemudian siapkan, kertas origami lalu buat gambar segitiga dan gunting. Selanjutnya buat gambar persegi sebanyak jumlah nama anak. Jika sudah rekatkan di atas kertas konstruksi hitam atau kertas HVS, kemudian mintalah anak-anak menuliskan huruf pada kertas origami berbentuk persegi membentuk nama mereka sendiri. Buat bentuk astronot menggunakan stik es krim dan membuat bentuk lingkaran untuk kepala. Anak-anak juga dapat menggambarkan bentuk bumi di sekitar bentuk roket. Kegiatan 2 : Melengkapi Huruf yang Hilang (Penalaran Kritis, Komunikasi). Alat dan bahan: printable huruf, kertas origami, lem. Cara bermain: Siapkan printable huruf dengan beberapa huruf dikosongkan secara acak. Buat bentuk persegi dari kertas origami lalu potong, kemudian tulis huruf-huruf. Selanjutnya ajak anak-anak untuk menemukan dan menempelkan huruf yang hilang sehingga huruf-huruf dapat diisi sesuai urutan yang benar. Kegiatan ini membantu pengembangan keterampilan bahasa, pengenalan huruf, dan pemahaman tentang urutan huruf dalam kata-kataKegiatan 3 : Cerita Berantai (Komunikasi, Kolaborasi). Alat dan bahan: Bola kecil atau boneka tangan. Cara bermain: Anak-anak duduk dalam lingkaran. Guru memulai cerita dengan satu kalimat, lalu memberikan bola atau boneka tangan kepada anak di sebelahnya. Anak tersebut harus melanjutkan cerita dengan satu kalimat, lalu memberikan bola ke anak berikutnya. Lanjutkan hingga semua anak mendapat giliran dan cerita selesai. Kegiatan ini mengembangkan kreativitas, kemampuan mendengarkan, dan keterampilan berbicara.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Roket Nama Sendiri (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Kertas HVS/kertas konstruksi hitam, Kertas Origami, Lem, Gunting, Spidol, Crayon, Stik es krim',
            howToPlay:
              'Siapkan kertas konstruksi hitam atau kertas HVS. Kemudian siapkan, kertas origami lalu buat gambar segitiga dan gunting. Selanjutnya buat gambar persegi sebanyak jumlah nama anak. Jika sudah rekatkan di atas kertas konstruksi hitam atau kertas HVS, kemudian mintalah anak-anak menuliskan huruf pada kertas origami berbentuk persegi membentuk nama mereka sendiri. Buat bentuk astronot menggunakan stik es krim dan membuat bentuk lingkaran untuk kepala. Anak-anak juga dapat menggambarkan bentuk bumi di sekitar bentuk roket.',
            fullDescription:
              'Kegiatan 1: Membuat Roket Nama Sendiri (Kreativitas, Kemandirian). Alat dan bahan: Kertas HVS/kertas konstruksi hitam, Kertas Origami, Lem, Gunting, Spidol, Crayon, Stik es krim. Cara Membuat: Siapkan kertas konstruksi hitam atau kertas HVS. Kemudian siapkan, kertas origami lalu buat gambar segitiga dan gunting. Selanjutnya buat gambar persegi sebanyak jumlah nama anak. Jika sudah rekatkan di atas kertas konstruksi hitam atau kertas HVS, kemudian mintalah anak-anak menuliskan huruf pada kertas origami berbentuk persegi membentuk nama mereka sendiri. Buat bentuk astronot menggunakan stik es krim dan membuat bentuk lingkaran untuk kepala. Anak-anak juga dapat menggambarkan bentuk bumi di sekitar bentuk roket.',
          },
          {
            activityNumber: 2,
            title: 'Melengkapi Huruf yang Hilang (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials: 'printable huruf, kertas origami, lem',
            howToPlay:
              'Siapkan printable huruf dengan beberapa huruf dikosongkan secara acak. Buat bentuk persegi dari kertas origami lalu potong, kemudian tulis huruf-huruf. Selanjutnya ajak anak-anak untuk menemukan dan menempelkan huruf yang hilang sehingga huruf-huruf dapat diisi sesuai urutan yang benar. Kegiatan ini membantu pengembangan keterampilan bahasa, pengenalan huruf, dan pemahaman tentang urutan huruf dalam kata-kata',
            fullDescription:
              'Kegiatan 2: Melengkapi Huruf yang Hilang (Penalaran Kritis, Komunikasi). Alat dan bahan: printable huruf, kertas origami, lem. Cara bermain: Siapkan printable huruf dengan beberapa huruf dikosongkan secara acak. Buat bentuk persegi dari kertas origami lalu potong, kemudian tulis huruf-huruf. Selanjutnya ajak anak-anak untuk menemukan dan menempelkan huruf yang hilang sehingga huruf-huruf dapat diisi sesuai urutan yang benar. Kegiatan ini membantu pengembangan keterampilan bahasa, pengenalan huruf, dan pemahaman tentang urutan huruf dalam kata-kata',
          },
          {
            activityNumber: 3,
            title: 'Cerita Berantai (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Bola kecil atau boneka tangan',
            howToPlay:
              'Anak-anak duduk dalam lingkaran. Guru memulai cerita dengan satu kalimat, lalu memberikan bola atau boneka tangan kepada anak di sebelahnya. Anak tersebut harus melanjutkan cerita dengan satu kalimat, lalu memberikan bola ke anak berikutnya. Lanjutkan hingga semua anak mendapat giliran dan cerita selesai. Kegiatan ini mengembangkan kreativitas, kemampuan mendengarkan, dan keterampilan berbicara.',
            fullDescription:
              'Kegiatan 3: Cerita Berantai (Komunikasi, Kolaborasi). Alat dan bahan: Bola kecil atau boneka tangan. Cara bermain: Anak-anak duduk dalam lingkaran. Guru memulai cerita dengan satu kalimat, lalu memberikan bola atau boneka tangan kepada anak di sebelahnya. Anak tersebut harus melanjutkan cerita dengan satu kalimat, lalu memberikan bola ke anak berikutnya. Lanjutkan hingga semua anak mendapat giliran dan cerita selesai. Kegiatan ini mengembangkan kreativitas, kemampuan mendengarkan, dan keterampilan berbicara.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : STEAM Kamera Mainan (Kreativitas, Kemandirian). Alat dan bahan: Tabung karton, Lem, Kotak kecil (dapat menggunakan kotak sereal mini), selotip (selotip bermotif / opsional), Gunting, Pita. Cara Membuat: Potong menjadi dua bagian dari tabung karton dan rekatkan ke tengah kotak untuk membuat lensa kamera. Tutupi kamera dan lensa kamera dengan selotip bermotif. Potong lubang persegi kecil di atas lensa di bagian depan kotak. Kemudian potong lubang persegi panjang di tempat yang sama di bagian belakang kotak untuk membuat jendela bidik. Rekatkan plastik pada kedua lubang untuk menutupinya. Di sisi kotak, rekatkan ujung pita yang cukup panjang untuk digunakan sebagai tali gantungan. Kegiatan 2 : Bermain Peran Sekolah-sekolahan (Kewargaan, Komunikasi). Alat dan bahan: Meja, kursi, papan tulis mini, alat tulis. Cara bermain: Atur ruangan menyerupai kelas. Biarkan anak-anak bergantian berperan sebagai guru dan murid. Guru dapat memberikan tema atau situasi sederhana, seperti hari pertama sekolah atau belajar tentang hewan. Anak yang berperan sebagai guru harus memimpin kelas, memberikan instruksi sederhana, dan berinteraksi dengan murid-muridnya. Anak-anak yang berperan sebagai murid harus mendengarkan, mengikuti instruksi, dan berpartisipasi dalam pelajaran. Kegiatan ini mengembangkan keterampilan sosial, kemampuan berbicara di depan umum, dan pemahaman tentang peran dan tanggung jawab di lingkungan sekolahKegiatan 3 : Mencocokkan Huruf dan Gambar (Penalaran Kritis, Komunikasi). Alat dan bahan: Kartu huruf, kartu gambar benda/hewan yang namanya diawali huruf tersebut. Cara bermain: Letakkan kartu huruf dan kartu gambar secara acak di lantai. Minta anak-anak untuk mencocokkan kartu huruf dengan gambar yang sesuai, misalnya huruf A dengan gambar apel. Kegiatan ini membantu anak mengenal huruf dan mengasosiasikannya dengan kata, yang merupakan dasar literasi. Anak juga belajar mengkategorikan dan menghubungkan konsep.',
        activities: [
          {
            activityNumber: 1,
            title: 'STEAM Kamera Mainan (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Tabung karton, Lem, Kotak kecil (dapat menggunakan kotak sereal mini), selotip (selotip bermotif / opsional), Gunting, Pita',
            howToPlay:
              'Potong menjadi dua bagian dari tabung karton dan rekatkan ke tengah kotak untuk membuat lensa kamera. Tutupi kamera dan lensa kamera dengan selotip bermotif. Potong lubang persegi kecil di atas lensa di bagian depan kotak. Kemudian potong lubang persegi panjang di tempat yang sama di bagian belakang kotak untuk membuat jendela bidik. Rekatkan plastik pada kedua lubang untuk menutupinya. Di sisi kotak, rekatkan ujung pita yang cukup panjang untuk digunakan sebagai tali gantungan.',
            fullDescription:
              'Kegiatan 1: STEAM Kamera Mainan (Kreativitas, Kemandirian). Alat dan bahan: Tabung karton, Lem, Kotak kecil (dapat menggunakan kotak sereal mini), selotip (selotip bermotif / opsional), Gunting, Pita. Cara Membuat: Potong menjadi dua bagian dari tabung karton dan rekatkan ke tengah kotak untuk membuat lensa kamera. Tutupi kamera dan lensa kamera dengan selotip bermotif. Potong lubang persegi kecil di atas lensa di bagian depan kotak. Kemudian potong lubang persegi panjang di tempat yang sama di bagian belakang kotak untuk membuat jendela bidik. Rekatkan plastik pada kedua lubang untuk menutupinya. Di sisi kotak, rekatkan ujung pita yang cukup panjang untuk digunakan sebagai tali gantungan.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Peran Sekolah-sekolahan (Kewargaan, Komunikasi)',
            toolsAndMaterials: 'Meja, kursi, papan tulis mini, alat tulis',
            howToPlay:
              'Atur ruangan menyerupai kelas. Biarkan anak-anak bergantian berperan sebagai guru dan murid. Guru dapat memberikan tema atau situasi sederhana, seperti hari pertama sekolah atau belajar tentang hewan. Anak yang berperan sebagai guru harus memimpin kelas, memberikan instruksi sederhana, dan berinteraksi dengan murid-muridnya. Anak-anak yang berperan sebagai murid harus mendengarkan, mengikuti instruksi, dan berpartisipasi dalam pelajaran. Kegiatan ini mengembangkan keterampilan sosial, kemampuan berbicara di depan umum, dan pemahaman tentang peran dan tanggung jawab di lingkungan sekolah',
            fullDescription:
              'Kegiatan 2: Bermain Peran Sekolah-sekolahan (Kewargaan, Komunikasi). Alat dan bahan: Meja, kursi, papan tulis mini, alat tulis. Cara bermain: Atur ruangan menyerupai kelas. Biarkan anak-anak bergantian berperan sebagai guru dan murid. Guru dapat memberikan tema atau situasi sederhana, seperti hari pertama sekolah atau belajar tentang hewan. Anak yang berperan sebagai guru harus memimpin kelas, memberikan instruksi sederhana, dan berinteraksi dengan murid-muridnya. Anak-anak yang berperan sebagai murid harus mendengarkan, mengikuti instruksi, dan berpartisipasi dalam pelajaran. Kegiatan ini mengembangkan keterampilan sosial, kemampuan berbicara di depan umum, dan pemahaman tentang peran dan tanggung jawab di lingkungan sekolah',
          },
          {
            activityNumber: 3,
            title: 'Mencocokkan Huruf dan Gambar (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials:
              'Kartu huruf, kartu gambar benda/hewan yang namanya diawali huruf tersebut',
            howToPlay:
              'Letakkan kartu huruf dan kartu gambar secara acak di lantai. Minta anak-anak untuk mencocokkan kartu huruf dengan gambar yang sesuai, misalnya huruf A dengan gambar apel. Kegiatan ini membantu anak mengenal huruf dan mengasosiasikannya dengan kata, yang merupakan dasar literasi. Anak juga belajar mengkategorikan dan menghubungkan konsep.',
            fullDescription:
              'Kegiatan 3: Mencocokkan Huruf dan Gambar (Penalaran Kritis, Komunikasi). Alat dan bahan: Kartu huruf, kartu gambar benda/hewan yang namanya diawali huruf tersebut. Cara bermain: Letakkan kartu huruf dan kartu gambar secara acak di lantai. Minta anak-anak untuk mencocokkan kartu huruf dengan gambar yang sesuai, misalnya huruf A dengan gambar apel. Kegiatan ini membantu anak mengenal huruf dan mengasosiasikannya dengan kata, yang merupakan dasar literasi. Anak juga belajar mengkategorikan dan menghubungkan konsep.',
          },
        ],
      },
    ],
    closingActivities: [
      'Yel-yel kelas bersama dengan gerakan ceria Aku anak pintar, aku anak hebat!',
      'Parade karya keliling kelas sambil bertepuk tangan dan bernyanyi',
      'Permainan Siapa yang paling hebat hari ini? dengan saling memberikan pujian',
      'Tarian sederhana Sekolahku Menyenangkan dengan musik ceria',
      'Berbagi cerita lucu atau momen seru yang dialami hari ini',
      'Tepuk tangan meriah untuk semua pencapaian teman-teman',
      'Meneriakkan semangat Besok kita belajar lagi! dengan suara lantang',
      'Bermain Tos Sayang bergiliran dengan semua teman',
      'Menyanyi lagu perpisahan Sampai Jumpa Kawan dengan gerakan',
      'Doa penutup dengan nada riang dan penuh syukur',
      'High-five dengan guru sambil menyebutkan satu hal yang paling disukai hari ini',
      'Berbaris keluar dengan langkah mars sambil bernyanyi',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak mampu menyebutkan nama sekolah dan kelasnya dengan jelas saat ditanya guru',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan antusiasme dan kegembiraan ketika tiba di sekolah dan mengikuti kegiatan',
      },
      {
        no: 3,
        indicator:
          'Anak mampu bekerja sama dalam kelompok untuk menyelesaikan tugas seperti membuat maket atau proyek',
      },
      {
        no: 4,
        indicator:
          'Anak dapat mengekspresikan emosi dengan tepat dan mengenali emosi teman saat bermain tebak emosi',
      },
      {
        no: 5,
        indicator:
          'Anak menunjukkan kreativitas dalam membuat karya seperti kipas matahari, roket nama, atau kamera mainan',
      },
      {
        no: 6,
        indicator:
          'Anak mampu berkomunikasi dengan jelas saat bermain telepon-teleponan atau cerita berantai',
      },
      {
        no: 7,
        indicator:
          'Anak menunjukkan kemandirian dalam menyelesaikan coding warna dan melengkapi huruf yang hilang',
      },
      {
        no: 8,
        indicator:
          'Anak mampu membangun struktur bangunan sederhana menggunakan balok magnetik atau bahan lainnya',
      },
      {
        no: 9,
        indicator:
          'Anak dapat mengikuti instruksi permainan seperti Simon Says dan menunjukkan perilaku sopan santun',
      },
      {
        no: 10,
        indicator:
          'Anak mampu menceritakan pengalaman dan perasaannya tentang sekolah dengan bahasa sederhana',
      },
      {
        no: 11,
        indicator:
          'Anak menunjukkan kemampuan motorik halus saat menempel, menggunting, dan membuat karya kerajinan',
      },
      {
        no: 12,
        indicator:
          'Anak dapat mempresentasikan hasil karyanya dengan percaya diri di depan teman-teman',
      },
    ],
    assessmentSteps: {
      initial: [
        'Lakukan tanya jawab informal saat anak tiba di kelas tentang perasaan mereka terhadap sekolah',
        'Amati cara anak berinteraksi dengan teman sebaya saat bermain bebas selama 10 menit',
        'Dokumentasikan dengan foto bagaimana anak menata tas dan barang pribadi mereka',
        'Catat respon anak saat ditunjukkan gambar atau video tentang aktivitas sekolah',
        'Observasi tingkat kemandirian anak dalam aktivitas rutin seperti cuci tangan dan merapikan tempat duduk',
        'Rekam kemampuan anak menyebutkan nama sekolah, kelas, dan nama teman-teman terdekat',
        'Amati ekspresi emosi dan body language anak saat menghadapi situasi baru atau instruksi guru',
      ],
      process: [
        'Dokumentasikan dengan foto setiap tahap pembuatan karya anak dari awal hingga selesai',
        'Catat dialog dan percakapan anak saat bekerja dalam kelompok menggunakan catatan anekdot',
        'Rekam video singkat (30 detik) saat anak mempresentasikan hasil karyanya',
        'Amati dan catat strategi pemecahan masalah yang digunakan anak saat menghadapi kesulitan',
        'Dokumentasikan kemajuan keterampilan motorik halus melalui foto hasil tulisan atau guntingan anak',
        'Observasi cara anak memberikan bantuan atau meminta bantuan dari teman',
        'Catat perkembangan bahasa anak melalui rekaman audio saat bercerita atau bernyanyi',
        'Amati tingkat konsentrasi dan keterlibatan anak dalam setiap aktivitas pembelajaran',
      ],
      final: [
        'Minta anak mempresentasikan satu karya favorit mereka dan ceritakan proses pembuatannya',
        'Lakukan wawancara sederhana tentang pengalaman belajar dengan pertanyaan Apa yang paling kamu suka?',
        'Dokumentasikan portofolio karya anak selama satu minggu pembelajaran dalam folder khusus',
        'Amati kemampuan anak dalam mengevaluasi karya sendiri dengan pertanyaan Bagaimana menurutmu hasil karyamu?',
        'Rekam video anak saat bermain peran atau mendemonstrasikan keterampilan yang dipelajari',
        'Catat pencapaian tujuan pembelajaran melalui checklist observasi terstruktur',
        'Dokumentasikan testimoni anak tentang perasaan mereka terhadap sekolah setelah pembelajaran',
        'Lakukan penilaian holistik dengan melibatkan anak dalam refleksi sederhana tentang perkembangan mereka',
      ],
    },
  },
  {
    weekNum: 9,
    filename: '45_TK_B_Smt1_09_Kebun_Binatang.docx',
    title: 'PETUALANGAN DI KEBUN BINATANG',
    topic: 'BINATANG',
    subtopic: 'KEBUN BINATANG',
    modelPembelajaran: 'STEAM, PjBL, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Oktober 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: true,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: true,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun memiliki rasa ingin tahu yang tinggi terhadap dunia hewan dan lingkungan sekitar. Mereka aktif mengeksplorasi informasi baru melalui pengalaman langsung dan senang berinteraksi dalam kegiatan berkelompok. Anak-anak pada usia ini mampu mengklasifikasikan objek berdasarkan karakteristik sederhana, mengungkapkan pendapat, dan menunjukkan kepedulian terhadap makhluk hidup. Mereka juga mulai memahami konsep angka, huruf, dan dapat mengikuti instruksi bertahap.',
      learningMaterial:
        'Pembelajaran tentang kebun binatang mencakup pengenalan berbagai jenis hewan, habitat, makanan, dan karakteristik hewan. Materi ini relevan dengan kehidupan anak karena dapat dikaitkan dengan pengalaman mereka melihat hewan di sekitar rumah atau kebun binatang. Tingkat kesulitan disesuaikan dengan kemampuan kognitif anak usia 5-6 tahun melalui kegiatan bermain, berkreasi, dan eksplorasi langsung. Integrasi nilai karakter mencakup rasa syukur atas ciptaan Tuhan, kepedulian terhadap makhluk hidup, dan tanggung jawab menjaga lingkungan.',
    },
    learningDesign: {
      cp: 'CP Dasar Literasi dan STEAM: Murid mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan, menunjukkan minat, dan berpartisipasi dalam kegiatan pramembacaCP Dasar Literasi dan STEAM: Murid menunjukkan rasa ingin tahu melalui observasi, eksplorasi, dan eksperimen dengan menggunakan lingkungan sekitar dan media sebagai sumber belajar untuk mendapatkan gagasan mengenai fenomena alam dan sosial',
      crossDisciplinary:
        'Nilai agama dan moral (mensyukuri ciptaan Tuhan melalui pengenalan hewan), Nilai Pancasila (kepedulian terhadap sesama makhluk hidup), Fisik motorik (gerakan menirukan hewan dan kegiatan kreatif), Kognitif (klasifikasi hewan, konsep bilangan, pemecahan masalah), Bahasa (bercerita tentang hewan, kosakata baru), Sosial emosional (empati terhadap hewan, kerja sama dalam kelompok)',
      tp: 'Anak mampu menceritakan kembali informasi tentang binatang di kebun binatang menggunakan kalimat sederhana Anak mampu menunjukkan pemahaman konsep bilangan 1-10. Anak dapat memahami dan menjelaskan informasi dasar mengenai 5 hewan di kebun binatang seperti habitat, makanan, dan suara mereka, Anak mampu membangun percakapan singkat dengan teman sebaya mengenai pengalaman mereka di kebun binatang.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain sambil belajar melalui kegiatan eksplorasi, bercerita, bernyanyi, dan permainan peran. Metode ini dipilih karena sesuai dengan karakteristik anak usia dini yang belajar melalui pengalaman konkret dan menyenangkan. Aktivitas dirancang untuk mendukung prinsip berkesadaran melalui keterlibatan aktif, bermakna melalui koneksi dengan kehidupan nyata, dan menggembirakan melalui suasana belajar yang positif dan menarik.',
      partnership:
        'Melibatkan orang tua dalam berbagi pengalaman berkunjung ke kebun binatang, guru kelas lain untuk kegiatan lintas usia, dan tokoh masyarakat yang memiliki pengetahuan tentang hewan.',
      environment:
        'Ruang kelas fleksibel dengan area bermain dan eksplorasi, halaman sekolah untuk kegiatan motorik, serta pemanfaatan media digital seperti video dan audio untuk mendukung pembelajaran interaktif yang menyenangkan.',
      digitalUtilization:
        'Platform pembelajaran daring untuk video cerita, aplikasi sederhana untuk mengenal suara hewan, dan dokumentasi digital hasil karya anakDukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Renungan tentang keagungan ciptaan Tuhan melalui keberagaman hewan',
      'Menyanyikan lagu 1234 Pergi Sekolah dengan gerakan riang',
      'Review kegiatan sebelumnya dan diskusi harapan hari ini',
      'Menyiapkan aturan bermain dan kesepakatan kelas yang menyenangkan',
      'Cerita/video pemantik: Kalkun di Kebun Binatang',
    ],
    openingQuestions: [
      'Apa yang membuat kalian takjub dengan ciptaan Tuhan di kebun binatang? (Keimanan),',
      'Bagaimana cara kita menunjukkan kasih sayang kepada hewan? (Kewargaan),',
      'Apa yang terjadi jika kita tidak merawat hewan? (Penalaran Kritis),',
      'Bagaimana perasaan kalian jika menjadi hewan di kebun binatang? (Komunikasi)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : STEAM Membuat Kandang Binatang Mini dari Stik Es Krim (Kreativitas, Kemandirian). Alat dan Bahan: Stik es krim, lem, cat warna, kardus atau biasa mengunakan sterofoam lembaran. Cara Membuat: Siapkan sterofoam, kemuian alasi dengan kertas warna hijau atau cat warna. Selanjutnya tusukkan stik es krim di atas sterofoam, hingga mengelilingi dan membentuk kendang. Jika ingin di beri atap bisa menggunakan sterofoam lagi dan lakukan hal yang sama atau kardus dengan di rekatnya menggunakan lem, jika sudah jadi bisa tambahkan kandang denagn miniature Binatang atau Binatang yang sudah di buat. Kegiatan 2 : Mengelompokkan Binatang (Penalaran Kritis). Alat dan bahan main: Gambar binatang kebun binatang dengan ukuran berbeda, kartu bertuliskan lebih besar dari dan lebih kecil dari Cara bermain: Anak diminta untuk membandingkan ukuran dua binatang dan meletakkan kartu lebih besar dari atau lebih kecil dari di antara kedua gambar binatang tersebut. Kegiatan 3 : Membuat Topeng Hewan (Kreativitas, Komunikasi). Alat dan bahan: Piring kertas, cat, karet gelang, gunting, lem, bahan dekorasi seperti bulu atau kertas krep. Cara bermain: Anak-anak dapat memilih hewan favorit mereka dan membuat topeng menggunakan piring kertas. Mereka bisa menggambar dan mewarnai wajah hewan, lalu menambahkan detail seperti telinga atau hidung menggunakan bahan tambahan. Setelah selesai, mereka bisa memakainya dan bermain peran sebagai hewan tersebut.',
        activities: [
          {
            activityNumber: 1,
            title:
              'STEAM Membuat Kandang Binatang Mini dari Stik Es Krim (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Stik es krim, lem, cat warna, kardus atau biasa mengunakan sterofoam lembaran',
            howToPlay:
              'Siapkan sterofoam, kemuian alasi dengan kertas warna hijau atau cat warna. Selanjutnya tusukkan stik es krim di atas sterofoam, hingga mengelilingi dan membentuk kendang. Jika ingin di beri atap bisa menggunakan sterofoam lagi dan lakukan hal yang sama atau kardus dengan di rekatnya menggunakan lem, jika sudah jadi bisa tambahkan kandang denagn miniature Binatang atau Binatang yang sudah di buat.',
            fullDescription:
              'Kegiatan 1: STEAM Membuat Kandang Binatang Mini dari Stik Es Krim (Kreativitas, Kemandirian). Alat dan Bahan: Stik es krim, lem, cat warna, kardus atau biasa mengunakan sterofoam lembaran. Cara Membuat: Siapkan sterofoam, kemuian alasi dengan kertas warna hijau atau cat warna. Selanjutnya tusukkan stik es krim di atas sterofoam, hingga mengelilingi dan membentuk kendang. Jika ingin di beri atap bisa menggunakan sterofoam lagi dan lakukan hal yang sama atau kardus dengan di rekatnya menggunakan lem, jika sudah jadi bisa tambahkan kandang denagn miniature Binatang atau Binatang yang sudah di buat.',
          },
          {
            activityNumber: 2,
            title: 'Mengelompokkan Binatang (Penalaran Kritis)',
            toolsAndMaterials:
              'main: Gambar binatang kebun binatang dengan ukuran berbeda, kartu bertuliskan lebih besar dari dan lebih kecil dari',
            howToPlay:
              'Anak diminta untuk membandingkan ukuran dua binatang dan meletakkan kartu lebih besar dari atau lebih kecil dari di antara kedua gambar binatang tersebut.',
            fullDescription:
              'Kegiatan 2: Mengelompokkan Binatang (Penalaran Kritis). Alat dan bahan main: Gambar binatang kebun binatang dengan ukuran berbeda, kartu bertuliskan lebih besar dari dan lebih kecil dari Cara bermain: Anak diminta untuk membandingkan ukuran dua binatang dan meletakkan kartu lebih besar dari atau lebih kecil dari di antara kedua gambar binatang tersebut.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Topeng Hewan (Kreativitas, Komunikasi)',
            toolsAndMaterials:
              'Piring kertas, cat, karet gelang, gunting, lem, bahan dekorasi seperti bulu atau kertas krep',
            howToPlay:
              'Anak-anak dapat memilih hewan favorit mereka dan membuat topeng menggunakan piring kertas. Mereka bisa menggambar dan mewarnai wajah hewan, lalu menambahkan detail seperti telinga atau hidung menggunakan bahan tambahan. Setelah selesai, mereka bisa memakainya dan bermain peran sebagai hewan tersebut.',
            fullDescription:
              'Kegiatan 3: Membuat Topeng Hewan (Kreativitas, Komunikasi). Alat dan bahan: Piring kertas, cat, karet gelang, gunting, lem, bahan dekorasi seperti bulu atau kertas krep. Cara bermain: Anak-anak dapat memilih hewan favorit mereka dan membuat topeng menggunakan piring kertas. Mereka bisa menggambar dan mewarnai wajah hewan, lalu menambahkan detail seperti telinga atau hidung menggunakan bahan tambahan. Setelah selesai, mereka bisa memakainya dan bermain peran sebagai hewan tersebut.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Menghias Cangkang Telur (Kreativitas, Kemandirian). Alat dan bahan: Cangkang telur, cat warna, kuas, pallet atau mangkuk atau lainnya untuk wadah cat. Cara Membuat: Siapkan cangkang telur, kemudian cuci hinga bersih (sebelum digunkan sebaiknya di jemur terlebih ahulu agar benar-benar bersih dan tidak berbau amis)Tuang cat warna ke dalam wadah, kemudian instruksikan kepada anak-anak untuk melukis pada cangkang teur yang sudah di siapkan, sesuai imajinasi dan kreativitas anak-anakKegiatan 2 : Permainan Memori Hewan (Penalaran Kritis). Alat dan bahan: Kartu bergambar hewan kebun binatang (dua set identik). Cara bermain: Letakkan kartu secara terbalik di meja. Anak-anak bergantian membalik dua kartu untuk menemukan pasangannya. Jika cocok, mereka bisa mengambil kartu tersebut. Permainan ini melatih daya ingat dan konsentrasi anak. Kegiatan 3 : Permainan Peran Penjaga Kebun Binatang (Kolaborasi, Komunikasi). Alat dan bahan: Kostum penjaga kebun binatang sederhana (topi, rompi), peralatan mainan (sekop, ember, sikat), boneka hewan. Cara bermain: Anak-anak dapat berperan sebagai penjaga kebun binatang. Mereka bisa memberi makan boneka hewan, membersihkan kandang imajiner, atau memberikan perawatan medis pada hewan yang sakit. Permainan ini mengembangkan imajinasi dan pemahaman tentang perawatan hewan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Menghias Cangkang Telur (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Cangkang telur, cat warna, kuas, pallet atau mangkuk atau lainnya untuk wadah cat',
            howToPlay:
              'Siapkan cangkang telur, kemudian cuci hinga bersih (sebelum digunkan sebaiknya di jemur terlebih ahulu agar benar-benar bersih dan tidak berbau amis)Tuang cat warna ke dalam wadah, kemudian instruksikan kepada anak-anak untuk melukis pada cangkang teur yang sudah di siapkan, sesuai imajinasi dan kreativitas anak-anak',
            fullDescription:
              'Kegiatan 1: Menghias Cangkang Telur (Kreativitas, Kemandirian). Alat dan bahan: Cangkang telur, cat warna, kuas, pallet atau mangkuk atau lainnya untuk wadah cat. Cara Membuat: Siapkan cangkang telur, kemudian cuci hinga bersih (sebelum digunkan sebaiknya di jemur terlebih ahulu agar benar-benar bersih dan tidak berbau amis)Tuang cat warna ke dalam wadah, kemudian instruksikan kepada anak-anak untuk melukis pada cangkang teur yang sudah di siapkan, sesuai imajinasi dan kreativitas anak-anak',
          },
          {
            activityNumber: 2,
            title: 'Permainan Memori Hewan (Penalaran Kritis)',
            toolsAndMaterials: 'Kartu bergambar hewan kebun binatang (dua set identik)',
            howToPlay:
              'Letakkan kartu secara terbalik di meja. Anak-anak bergantian membalik dua kartu untuk menemukan pasangannya. Jika cocok, mereka bisa mengambil kartu tersebut. Permainan ini melatih daya ingat dan konsentrasi anak.',
            fullDescription:
              'Kegiatan 2: Permainan Memori Hewan (Penalaran Kritis). Alat dan bahan: Kartu bergambar hewan kebun binatang (dua set identik). Cara bermain: Letakkan kartu secara terbalik di meja. Anak-anak bergantian membalik dua kartu untuk menemukan pasangannya. Jika cocok, mereka bisa mengambil kartu tersebut. Permainan ini melatih daya ingat dan konsentrasi anak.',
          },
          {
            activityNumber: 3,
            title: 'Permainan Peran Penjaga Kebun Binatang (Kolaborasi, Komunikasi)',
            toolsAndMaterials:
              'Kostum penjaga kebun binatang sederhana (topi, rompi), peralatan mainan (sekop, ember, sikat), boneka hewan',
            howToPlay:
              'Anak-anak dapat berperan sebagai penjaga kebun binatang. Mereka bisa memberi makan boneka hewan, membersihkan kandang imajiner, atau memberikan perawatan medis pada hewan yang sakit. Permainan ini mengembangkan imajinasi dan pemahaman tentang perawatan hewan.',
            fullDescription:
              'Kegiatan 3: Permainan Peran Penjaga Kebun Binatang (Kolaborasi, Komunikasi). Alat dan bahan: Kostum penjaga kebun binatang sederhana (topi, rompi), peralatan mainan (sekop, ember, sikat), boneka hewan. Cara bermain: Anak-anak dapat berperan sebagai penjaga kebun binatang. Mereka bisa memberi makan boneka hewan, membersihkan kandang imajiner, atau memberikan perawatan medis pada hewan yang sakit. Permainan ini mengembangkan imajinasi dan pemahaman tentang perawatan hewan.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Harimau Lucu (Kreativitas, Kemandirian). Alat dan Bahan : Kertas karton (warna oranye dan kuning), pensil, gunting, penggaris. Cara Membuat dan Memainkannya: Siapkan kertas warna oranye dan kuning, pertama buat bentuk setengah lingkaran pada bagian atas dan setengah lingkaran pada bagian bawah, di beri jarak beberapa cm dan sambungkan menggunakan garis. Kemudian lapisi bagian atas menggunakan kertas karton berwarna oranye dengan membentuk persegi Panjang. Buat bentuk lingkaran untuk telinga dan mata, kemudian tempel pada salah satu bagian bentuk setengah lingkaran. Setelah itu lipat menjadi dua satukan antara bentuk setengah lingkaran atas dan bawah, lalu lipat ke bawah sehingga jika di satukan membentuk satu lingkaran penuh. Kemudian pasang bagian hidung harimau. Buka Kembali dan pasang gigi harimau yang sudah di buat. Gunting bentuk persegi Panjang, namun dengan ukuran lebih pendek dan rekatkan pada bagian atas dan bawah di belakang bentuk lingkaran (untuk pegangan). Terakhir mainkan kerajinan hari mau dengan membuka tutupnya. Kegiatan 2 : Konsep Bilangan (Penalaran Kritis). Alat dan bahan main: Kartu angka 1-10, miniatur binatang kebun binatang Cara bermain: Anak diminta untuk mengambil kartu angka secara acak, kemudian menghitung dan mengambil miniatur binatang sesuai dengan angka pada kartu. Kegiatan 3 : Menirukan Gerakan Binatang (Kesehatan, Komunikasi). Alat dan bahan main: Area kosong untuk bergerak Cara bermain: Guru menyebutkan nama binatang dan anak diminta untuk menirukan gerakan binatang tersebut. Misalnya, Gerakkan seperti gajah!, Melompat seperti kanguru!, Merayap seperti ular!.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Harimau Lucu (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Kertas karton (warna oranye dan kuning), pensil, gunting, penggaris',
            howToPlay:
              'dan Memainkannya: Siapkan kertas warna oranye dan kuning, pertama buat bentuk setengah lingkaran pada bagian atas dan setengah lingkaran pada bagian bawah, di beri jarak beberapa cm dan sambungkan menggunakan garis. Kemudian lapisi bagian atas menggunakan kertas karton berwarna oranye dengan membentuk persegi Panjang. Buat bentuk lingkaran untuk telinga dan mata, kemudian tempel pada salah satu bagian bentuk setengah lingkaran. Setelah itu lipat menjadi dua satukan antara bentuk setengah lingkaran atas dan bawah, lalu lipat ke bawah sehingga jika di satukan membentuk satu lingkaran penuh. Kemudian pasang bagian hidung harimau. Buka Kembali dan pasang gigi harimau yang sudah di buat. Gunting bentuk persegi Panjang, namun dengan ukuran lebih pendek dan rekatkan pada bagian atas dan bawah di belakang bentuk lingkaran (untuk pegangan). Terakhir mainkan kerajinan hari mau dengan membuka tutupnya.',
            fullDescription:
              'Kegiatan 1: Membuat Harimau Lucu (Kreativitas, Kemandirian). Alat dan Bahan : Kertas karton (warna oranye dan kuning), pensil, gunting, penggaris. Cara Membuat dan Memainkannya: Siapkan kertas warna oranye dan kuning, pertama buat bentuk setengah lingkaran pada bagian atas dan setengah lingkaran pada bagian bawah, di beri jarak beberapa cm dan sambungkan menggunakan garis. Kemudian lapisi bagian atas menggunakan kertas karton berwarna oranye dengan membentuk persegi Panjang. Buat bentuk lingkaran untuk telinga dan mata, kemudian tempel pada salah satu bagian bentuk setengah lingkaran. Setelah itu lipat menjadi dua satukan antara bentuk setengah lingkaran atas dan bawah, lalu lipat ke bawah sehingga jika di satukan membentuk satu lingkaran penuh. Kemudian pasang bagian hidung harimau. Buka Kembali dan pasang gigi harimau yang sudah di buat. Gunting bentuk persegi Panjang, namun dengan ukuran lebih pendek dan rekatkan pada bagian atas dan bawah di belakang bentuk lingkaran (untuk pegangan). Terakhir mainkan kerajinan hari mau dengan membuka tutupnya.',
          },
          {
            activityNumber: 2,
            title: 'Konsep Bilangan (Penalaran Kritis)',
            toolsAndMaterials: 'main: Kartu angka 1-10, miniatur binatang kebun binatang',
            howToPlay:
              'Anak diminta untuk mengambil kartu angka secara acak, kemudian menghitung dan mengambil miniatur binatang sesuai dengan angka pada kartu.',
            fullDescription:
              'Kegiatan 2: Konsep Bilangan (Penalaran Kritis). Alat dan bahan main: Kartu angka 1-10, miniatur binatang kebun binatang Cara bermain: Anak diminta untuk mengambil kartu angka secara acak, kemudian menghitung dan mengambil miniatur binatang sesuai dengan angka pada kartu.',
          },
          {
            activityNumber: 3,
            title: 'Menirukan Gerakan Binatang (Kesehatan, Komunikasi)',
            toolsAndMaterials: 'main: Area kosong untuk bergerak',
            howToPlay:
              'Guru menyebutkan nama binatang dan anak diminta untuk menirukan gerakan binatang tersebut. Misalnya, Gerakkan seperti gajah!, Melompat seperti kanguru!, Merayap seperti ular!.',
            fullDescription:
              'Kegiatan 3: Menirukan Gerakan Binatang (Kesehatan, Komunikasi). Alat dan bahan main: Area kosong untuk bergerak Cara bermain: Guru menyebutkan nama binatang dan anak diminta untuk menirukan gerakan binatang tersebut. Misalnya, Gerakkan seperti gajah!, Melompat seperti kanguru!, Merayap seperti ular!.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: STEAM Membuat Payung Bentuk Katak Dari Kertas (Kreativitas, Kemandirian). Alat dan bahan: Kertas hijau dan putih, pensil, selotip dua sisi, Gunting. Cara Membuat: Mari kita mulai kerajinan ini dengan memotong lingkaran dari lembaran berwarna hijau. Lipat lingkaran menjadi seperempat dan oleskan selotip dua sisi di bagian belakang kuartal. Buat beberapa perempat lagi seperti itu dari kertas lembaran hijau dan oleskan delotip dua sisi pada masing-masing. Tempelkan semua perempat lingkaran dengan pita dua sisi. Gulung kertas lembaran hijau menjadi tongkat dan tempel ujungnya menggunakan selotip dua sisi. Tempelkan selotip dua sisi pada satu sisi perempat lingkaran dengan menekannya sekali. Tempelkan perempat pada tongkat dengan selotip. Lem atau beri selotip pada sisa lingkaran yang saling bertemuPotong sedikit pegangan paying bagian atas, dan tekuk seperti membentuk huruf J untuk peganganTeakhir buat mata katak, dan payu sudah jadi. Kegiatan 2 : Safari Alfabet (Komunikasi, Penalaran Kritis). Alat dan bahan: Kartu alfabet, gambar hewan kebun binatang. Cara bermain: Sebarkan kartu alfabet dan gambar hewan di lantai. Anak-anak harus mencocokkan hewan dengan huruf awal namanya (mis. G untuk Gajah, S untuk Singa). Mereka juga bisa menyusun nama hewan menggunakan kartu huruf. Kegiatan 3 : Hitung Kaki Hewan (Penalaran Kritis). Alat dan bahan: Kartu bergambar hewan kebun binatang, papan tulis kecil, spidol. Cara bermain: Anak-anak mengambil kartu hewan, menghitung jumlah kaki hewan tersebut, dan menuliskan angkanya di papan tulis. Mereka bisa membandingkan jumlah kaki antar hewan dan menjumlahkannya.',
        activities: [
          {
            activityNumber: 1,
            title: 'STEAM Membuat Payung Bentuk Katak Dari Kertas (Kreativitas, Kemandirian)',
            toolsAndMaterials: 'Kertas hijau dan putih, pensil, selotip dua sisi, Gunting',
            howToPlay:
              'Mari kita mulai kerajinan ini dengan memotong lingkaran dari lembaran berwarna hijau. Lipat lingkaran menjadi seperempat dan oleskan selotip dua sisi di bagian belakang kuartal. Buat beberapa perempat lagi seperti itu dari kertas lembaran hijau dan oleskan delotip dua sisi pada masing-masing. Tempelkan semua perempat lingkaran dengan pita dua sisi. Gulung kertas lembaran hijau menjadi tongkat dan tempel ujungnya menggunakan selotip dua sisi. Tempelkan selotip dua sisi pada satu sisi perempat lingkaran dengan menekannya sekali. Tempelkan perempat pada tongkat dengan selotip. Lem atau beri selotip pada sisa lingkaran yang saling bertemuPotong sedikit pegangan paying bagian atas, dan tekuk seperti membentuk huruf J untuk peganganTeakhir buat mata katak, dan payu sudah jadi.',
            fullDescription:
              'Kegiatan 1: STEAM Membuat Payung Bentuk Katak Dari Kertas (Kreativitas, Kemandirian). Alat dan bahan: Kertas hijau dan putih, pensil, selotip dua sisi, Gunting. Cara Membuat: Mari kita mulai kerajinan ini dengan memotong lingkaran dari lembaran berwarna hijau. Lipat lingkaran menjadi seperempat dan oleskan selotip dua sisi di bagian belakang kuartal. Buat beberapa perempat lagi seperti itu dari kertas lembaran hijau dan oleskan delotip dua sisi pada masing-masing. Tempelkan semua perempat lingkaran dengan pita dua sisi. Gulung kertas lembaran hijau menjadi tongkat dan tempel ujungnya menggunakan selotip dua sisi. Tempelkan selotip dua sisi pada satu sisi perempat lingkaran dengan menekannya sekali. Tempelkan perempat pada tongkat dengan selotip. Lem atau beri selotip pada sisa lingkaran yang saling bertemuPotong sedikit pegangan paying bagian atas, dan tekuk seperti membentuk huruf J untuk peganganTeakhir buat mata katak, dan payu sudah jadi.',
          },
          {
            activityNumber: 2,
            title: 'Safari Alfabet (Komunikasi, Penalaran Kritis)',
            toolsAndMaterials: 'Kartu alfabet, gambar hewan kebun binatang',
            howToPlay:
              'Sebarkan kartu alfabet dan gambar hewan di lantai. Anak-anak harus mencocokkan hewan dengan huruf awal namanya (mis. G untuk Gajah, S untuk Singa). Mereka juga bisa menyusun nama hewan menggunakan kartu huruf.',
            fullDescription:
              'Kegiatan 2: Safari Alfabet (Komunikasi, Penalaran Kritis). Alat dan bahan: Kartu alfabet, gambar hewan kebun binatang. Cara bermain: Sebarkan kartu alfabet dan gambar hewan di lantai. Anak-anak harus mencocokkan hewan dengan huruf awal namanya (mis. G untuk Gajah, S untuk Singa). Mereka juga bisa menyusun nama hewan menggunakan kartu huruf.',
          },
          {
            activityNumber: 3,
            title: 'Hitung Kaki Hewan (Penalaran Kritis)',
            toolsAndMaterials: 'Kartu bergambar hewan kebun binatang, papan tulis kecil, spidol',
            howToPlay:
              'Anak-anak mengambil kartu hewan, menghitung jumlah kaki hewan tersebut, dan menuliskan angkanya di papan tulis. Mereka bisa membandingkan jumlah kaki antar hewan dan menjumlahkannya.',
            fullDescription:
              'Kegiatan 3: Hitung Kaki Hewan (Penalaran Kritis). Alat dan bahan: Kartu bergambar hewan kebun binatang, papan tulis kecil, spidol. Cara bermain: Anak-anak mengambil kartu hewan, menghitung jumlah kaki hewan tersebut, dan menuliskan angkanya di papan tulis. Mereka bisa membandingkan jumlah kaki antar hewan dan menjumlahkannya.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Sensory Pathway Dengan Tutup Botol (Kesehatan, Kemandirian). Alat dan Bahan, Nampan atau kardus bekas, Tutup Botol, Gambar , Tepung, Lem, Kertas HVS, Pensil. Cara Membuat dan Memainkannya: Siapkan nampan atau kardus, kemudian tata tutup botol di atasnya (jumlah tutup botol dapat di sesuaikan sesuai kebutuhan)Selanjutnya lem tutup .Kemudian masukkan tepung ke dalam nampan dan ratakan tepung akan merata. Buat pola di atas kertas HVS, dan mintalah anak-anak untuk menirukan pola sesuai gambar di atas nampan dengan jari. Kegiatan 2 : Permainan Tebak Suara Hewan (Komunikasi, Penalaran Kritis). Alat dan bahan: Rekaman suara hewan kebun binatang, pemutar audio. Cara bermain: Putar rekaman suara hewan dan minta anak-anak menebak hewan apa yang mengeluarkan suara tersebut. Mereka bisa mengangkat tangan atau menulis jawabannya. Kegiatan ini melatih pendengaran dan pengetahuan anak tentang berbagai jenis hewan. Kegiatan 3 : Sand Art Hewan Kebun Binatang (Kreativitas): Alat: Lem, pasir berwarna, gambar hewan. Cara bermain: Anak-anak mengoleskan lem pada gambar hewan dan menaburkan pasir berwarna di atasnya, menciptakan desain berwarna. Ini melatih kreativitas dan koordinasi tangan-mata.',
        activities: [
          {
            activityNumber: 1,
            title: 'Sensory Pathway Dengan Tutup Botol (Kesehatan, Kemandirian)',
            toolsAndMaterials:
              'Nampan atau kardus bekas, Tutup Botol, Gambar , Tepung, Lem, Kertas HVS, Pensil',
            howToPlay:
              'dan Memainkannya: Siapkan nampan atau kardus, kemudian tata tutup botol di atasnya (jumlah tutup botol dapat di sesuaikan sesuai kebutuhan)Selanjutnya lem tutup .Kemudian masukkan tepung ke dalam nampan dan ratakan tepung akan merata. Buat pola di atas kertas HVS, dan mintalah anak-anak untuk menirukan pola sesuai gambar di atas nampan dengan jari.',
            fullDescription:
              'Kegiatan 1: Sensory Pathway Dengan Tutup Botol (Kesehatan, Kemandirian). Alat dan Bahan, Nampan atau kardus bekas, Tutup Botol, Gambar , Tepung, Lem, Kertas HVS, Pensil. Cara Membuat dan Memainkannya: Siapkan nampan atau kardus, kemudian tata tutup botol di atasnya (jumlah tutup botol dapat di sesuaikan sesuai kebutuhan)Selanjutnya lem tutup .Kemudian masukkan tepung ke dalam nampan dan ratakan tepung akan merata. Buat pola di atas kertas HVS, dan mintalah anak-anak untuk menirukan pola sesuai gambar di atas nampan dengan jari.',
          },
          {
            activityNumber: 2,
            title: 'Permainan Tebak Suara Hewan (Komunikasi, Penalaran Kritis)',
            toolsAndMaterials: 'Rekaman suara hewan kebun binatang, pemutar audio',
            howToPlay:
              'Putar rekaman suara hewan dan minta anak-anak menebak hewan apa yang mengeluarkan suara tersebut. Mereka bisa mengangkat tangan atau menulis jawabannya. Kegiatan ini melatih pendengaran dan pengetahuan anak tentang berbagai jenis hewan.',
            fullDescription:
              'Kegiatan 2: Permainan Tebak Suara Hewan (Komunikasi, Penalaran Kritis). Alat dan bahan: Rekaman suara hewan kebun binatang, pemutar audio. Cara bermain: Putar rekaman suara hewan dan minta anak-anak menebak hewan apa yang mengeluarkan suara tersebut. Mereka bisa mengangkat tangan atau menulis jawabannya. Kegiatan ini melatih pendengaran dan pengetahuan anak tentang berbagai jenis hewan.',
          },
          {
            activityNumber: 3,
            title:
              'Sand Art Hewan Kebun Binatang (Kreativitas): Alat: Lem, pasir berwarna, gambar hewan',
            toolsAndMaterials: '',
            howToPlay:
              'Anak-anak mengoleskan lem pada gambar hewan dan menaburkan pasir berwarna di atasnya, menciptakan desain berwarna. Ini melatih kreativitas dan koordinasi tangan-mata.',
            fullDescription:
              'Kegiatan 3: Sand Art Hewan Kebun Binatang (Kreativitas): Alat: Lem, pasir berwarna, gambar hewan. Cara bermain: Anak-anak mengoleskan lem pada gambar hewan dan menaburkan pasir berwarna di atasnya, menciptakan desain berwarna. Ini melatih kreativitas dan koordinasi tangan-mata.',
          },
        ],
      },
    ],
    closingActivities: [
      'Parade Hewan Favorit: Anak mengenakan topeng hewan buatan mereka dan berbaris sambil menirukan suara hewan favoritnya dengan penuh kegembiraan',
      'Tarian Kebun Binatang: Menari bersama dengan gerakan berbagai hewan sambil menyanyikan lagu tentang kebun binatang atau lagu yang mereka ciptakan sendiri',
      'Show and Tell Karya Hebat: Setiap anak memamerkan hasil karya terbaiknya dengan bangga dan menerima tepuk tangan meriah dari teman-teman',
      'Permainan Tebak Hewan Express: Anak bergantian memeragakan hewan secara cepat sementara yang lain menebak dengan antusias dan tawa riang',
      'High Five Appreciation: Setiap anak memberikan high five sambil menyebutkan satu hal yang mereka pelajari hari ini dengan penuh kebanggaan',
      'Rencana Mimpi Besar: Anak berbagi mimpi mereka tentang hewan apa yang ingin mereka temui atau rawat di masa depan dengan mata berbinar',
      'Lagu Penutup: Menyanyikan lagu penutup khusus dengan gerakan yang mengekspresikan rasa syukur dan kegembiraan',
      'Doa Bersyukur Riang: Berdoa bersama dengan penuh syukur atas pembelajaran yang menyenangkan sambil tersenyum bahagia',
      'Persiapan Pulang Ceria: Membereskan mainan sambil bernyanyi dan saling membantu dengan wajah sumringah penuh semangat',
    ],
    iktpItems: [
      {
        no: 1,
        indicator: 'Anak dapat menyebutkan minimal 3 nama hewan kebun binatang saat ditanya guru',
      },
      {
        no: 2,
        indicator:
          'Anak mampu mengelompokkan gambar hewan berdasarkan ukuran (besar-kecil) dengan tepat',
      },
      {
        no: 3,
        indicator: 'Anak dapat menghitung jumlah miniatur hewan dari 1-10 dengan benar',
      },
      {
        no: 4,
        indicator:
          'Anak mampu menirukan minimal 3 gerakan hewan dengan koordinasi motorik yang baik',
      },
      {
        no: 5,
        indicator:
          'Anak dapat menceritakan habitat hewan (darat/air/udara) menggunakan kalimat sederhana',
      },
      {
        no: 6,
        indicator:
          'Anak menunjukkan sikap empati dan kepedulian terhadap hewan melalui kata dan tindakan',
      },
      {
        no: 7,
        indicator: 'Anak mampu bekerja sama dalam kegiatan kelompok dan berbagi alat dengan teman',
      },
      {
        no: 8,
        indicator: 'Anak dapat mengikuti instruksi bertahap dalam kegiatan STEAM dengan mandiri',
      },
      {
        no: 9,
        indicator:
          'Anak menunjukkan kreativitas dalam membuat kandang mini, topeng, dan karya seni lainnya',
      },
      {
        no: 10,
        indicator: 'Anak mampu mengenali dan mencocokkan minimal 5 suara hewan yang berbeda',
      },
      {
        no: 11,
        indicator:
          'Anak dapat mempresentasikan hasil karyanya dengan percaya diri di depan teman-teman',
      },
      {
        no: 12,
        indicator:
          'Anak menunjukkan antusiasme dan partisipasi aktif dalam semua kegiatan pembelajaran tentang kebun binatang',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 10,
    filename: '46_TK_B_Smt1_10_Binatang_Air.docx',
    title: 'MENGENAL KEHIDUPAN DI BAWAH LAUT',
    topic: 'BINATANG',
    subtopic: 'BINATANG AIR',
    modelPembelajaran: 'PjBL, STEAM, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Oktober 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: true,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: true,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: true,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: true,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun (TK B) memiliki karakteristik rasa ingin tahu yang tinggi terhadap lingkungan sekitar, khususnya makhluk hidup. Mereka sudah mampu melakukan observasi sederhana, membandingkan objek, dan mengekspresikan pemahaman melalui berbagai cara seperti bercerita, menggambar, dan bermain peran. Pada usia ini, anak juga mulai memahami konsep tanggung jawab terhadap makhluk hidup dan lingkungan.',
      learningMaterial:
        'Materi tentang binatang air mencakup pengetahuan esensial mengenai jenis-jenis binatang air, habitat, dan ciri-ciri khususnya. Pengetahuan aplikatif meliputi cara merawat binatang air dan menjaga kelestarian lingkungan air. Pengetahuan nilai dan karakter terkait rasa syukur terhadap ciptaan Tuhan, tanggung jawab dalam merawat makhluk hidup, dan sikap peduli lingkungan. Materi ini relevan dengan kehidupan sehari-hari anak karena banyak dijumpai di lingkungan sekitar.',
    },
    learningDesign: {
      cp: 'CP Nilai Agama dan Budi Pekerti: Murid menghargai alam dan seluruh makhluk hidup ciptaan Tuhan Yang Maha EsaCP Dasar Literasi dan STEAM: Murid menunjukkan rasa ingin tahu melalui observasi, eksplorasi, dan eksperimen dengan menggunakan lingkungan sekitar dan media sebagai sumber belajar untuk mendapatkan gagasan mengenai fenomena alam dan sosial',
      crossDisciplinary:
        'Nilai agama dan moral (menghargai ciptaan Tuhan melalui perawatan binatang air), Nilai Pancasila (gotong royong dalam menjaga lingkungan), Fisik motorik (koordinasi gerakan dalam aktivitas bermain air), Kognitif (observasi dan klasifikasi binatang air), Bahasa (bercerita tentang pengalaman dengan binatang air), Sosial emosional (empati terhadap makhluk hidup).',
      tp: 'Anak mampu mendemonstrasikan cara merawat habitat binatang air sebagai bentuk penghargaan terhadap alam ciptaan Tuhan Yang Maha Esa. Anak dapat mengidentifikasi minimal 5 jenis binatang air beserta ciri-ciri khususnya, Anak dapat menjelaskan secara sederhana bagaimana binatang-binatang tersebut beradaptasi dengan lingkungan air.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain sambil belajar melalui eksplorasi langsung, bercerita interaktif, dan bernyanyi tematik. Metode pembelajaran berbasis proyek diterapkan untuk membuat diorama ekosistem air, while pembelajaran inkuiri mendorong anak mengajukan pertanyaan dan mencari jawaban melalui observasi. Pendekatan ini mendukung prinsip berkesadaran dengan melibatkan seluruh indra anak, bermakna karena terhubung dengan pengalaman nyata, dan menggembirakan melalui aktivitas yang menyenangkan.',
      partnership:
        'Melibatkan orang tua dalam berbagi pengalaman anak dengan binatang air di rumah, kerjasama dengan komunitas pecinta ikan hias untuk memberikan wawasan langsung, dan kolaborasi dengan perpustakaan untuk menyediakan buku-buku tematik yang mendukung pembelajaran.',
      environment:
        'Ruang kelas diatur dengan area eksplorasi yang dilengkapi akuarium mini dan media visual binatang air. Area bermain disediakan untuk aktivitas motorik kasar. Lingkungan virtual memanfaatkan video pembelajaran interaktif. Budaya belajar dikembangkan melalui sikap saling menghormati, kerjasama, dan apresiasi terhadap ciptaan Tuhan.',
      digitalUtilization:
        'Penggunaan video edukatif tentang binatang air untuk pengenalan konsep, penggunaan media digital untuk menunjukkan habitat binatang air, dan dokumentasi digital untuk portofolio anak. Teknologi digunakan sebagai alat bantu pembelajaran yang mendukung pengalaman langsung anakDukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka bersama',
      'Renungan singkat tentang keagungan ciptaan Tuhan',
      'Menyanyikan lagu 1234 Pergi Sekolah dengan gerakan',
      'Diskusi ide-ide kegiatan hari ini bersama anak',
      'Penetapan aturan bermain dan harapan bersama',
      'Kegiatan pemantik melalui video Ikan Badut',
    ],
    openingQuestions: [
      'Siapa yang menciptakan ikan-ikan cantik ini? (Keimanan),',
      'Bagaimana perasaanmu melihat ikan berenang bebas? (Komunikasi),',
      'Apa yang terjadi jika kita tidak merawat rumah ikan? (Kewargaan),',
      'Mengapa ikan bisa bernapas di dalam air? (Penalaran Kritis)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Kolase Ikan dari Cup Cake (Kreativitas, Kemandirian). Alat dan bahan: Kertas gambar, lem, Kertas cup cake), spidol. Cara membuat: Gambar outline ikan di kertas, cup cake kemudian beri warna. Atau bisa juga membuat ikan menggunakan piring kertas. Kegiatan 2 : Kolam Angka Ikan (Penalaran Kritis, Komunikasi). Alat dan bahan: Kertas biru besar, gambar ikan dari kertas warna-warni, spidol, tali, magnetik. Cara bermain: Buat kolam dari kertas biru. Tulis angka 1-10 pada ikan kertas. Minta anak-anak memancing ikan menggunakan tali dan magnetik dan menyebutkan angkanya. Setelah itu, mereka bisa mengurutkan ikan dari angka terkecil ke terbesar. Kegiatan ini mengembangkan pengenalan angka dan konsep urutanKegiatan 3 : Hitung Sisik Ikan (Penalaran Kritis, Kemandirian). Alat dan bahan: Gambar ikan besar, kancing atau kerikil sebagai sisik. Cara bermain: Sediakan gambar ikan besar. Minta anak-anak menempelkan sisik (kancing atau kerikil) pada ikan sambil menghitung. Beri mereka target jumlah tertentu, misalnya 15 sisik. Kegiatan ini melatih keterampilan berhitung dan korespondensi satu-satu.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Kolase Ikan dari Cup Cake (Kreativitas, Kemandirian)',
            toolsAndMaterials: 'Kertas gambar, lem, Kertas cup cake), spidol',
            howToPlay:
              'Gambar outline ikan di kertas, cup cake kemudian beri warna. Atau bisa juga membuat ikan menggunakan piring kertas.',
            fullDescription:
              'Kegiatan 1: Membuat Kolase Ikan dari Cup Cake (Kreativitas, Kemandirian). Alat dan bahan: Kertas gambar, lem, Kertas cup cake), spidol. Cara membuat: Gambar outline ikan di kertas, cup cake kemudian beri warna. Atau bisa juga membuat ikan menggunakan piring kertas.',
          },
          {
            activityNumber: 2,
            title: 'Kolam Angka Ikan (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials:
              'Kertas biru besar, gambar ikan dari kertas warna-warni, spidol, tali, magnetik',
            howToPlay:
              'Buat kolam dari kertas biru. Tulis angka 1-10 pada ikan kertas. Minta anak-anak memancing ikan menggunakan tali dan magnetik dan menyebutkan angkanya. Setelah itu, mereka bisa mengurutkan ikan dari angka terkecil ke terbesar. Kegiatan ini mengembangkan pengenalan angka dan konsep urutan',
            fullDescription:
              'Kegiatan 2: Kolam Angka Ikan (Penalaran Kritis, Komunikasi). Alat dan bahan: Kertas biru besar, gambar ikan dari kertas warna-warni, spidol, tali, magnetik. Cara bermain: Buat kolam dari kertas biru. Tulis angka 1-10 pada ikan kertas. Minta anak-anak memancing ikan menggunakan tali dan magnetik dan menyebutkan angkanya. Setelah itu, mereka bisa mengurutkan ikan dari angka terkecil ke terbesar. Kegiatan ini mengembangkan pengenalan angka dan konsep urutan',
          },
          {
            activityNumber: 3,
            title: 'Hitung Sisik Ikan (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Gambar ikan besar, kancing atau kerikil sebagai sisik',
            howToPlay:
              'Sediakan gambar ikan besar. Minta anak-anak menempelkan sisik (kancing atau kerikil) pada ikan sambil menghitung. Beri mereka target jumlah tertentu, misalnya 15 sisik. Kegiatan ini melatih keterampilan berhitung dan korespondensi satu-satu.',
            fullDescription:
              'Kegiatan 3: Hitung Sisik Ikan (Penalaran Kritis, Kemandirian). Alat dan bahan: Gambar ikan besar, kancing atau kerikil sebagai sisik. Cara bermain: Sediakan gambar ikan besar. Minta anak-anak menempelkan sisik (kancing atau kerikil) pada ikan sambil menghitung. Beri mereka target jumlah tertentu, misalnya 15 sisik. Kegiatan ini melatih keterampilan berhitung dan korespondensi satu-satu.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : STEAM Membuat Kerajinan Hiu Piring Kertas Bergerak (Kreativitas, Penalaran Kritis). Alat dan Bahan: Piring kertas, Printable ambar hiu atau binatang lainnya, kertas warna dengan berbagai warna, Mata Googly, stik es krim, LemSpidol, Pensil, Gunting. Cara Membuat: Gunting printable gambar hiu, kemudian rekatkan pada stik es krimBuat pola sepeti gelombang ait di atas kertas biru, kemudian gunting membentuk lingkaran di sesuiakan dengan ukuran bagian bawah piring kertas. Gunakan gunting untuk memotong celah panjang di tepi bawah bagian tengah pelat kertas. Selanjutnya, gunting kertas yang sudah di buat pola gelombang, lalu rekatkan pada piring kertas. Rekatkan tanaman laut di bawah air. Tambahkan item tambahan hiasan seperti rumput laut, bintang laut, ikan kecil, batu, dll. Masukkan stik es krim paa bagian piring yang sudah di potong, hiaupun dapat berenang. Kegiatan 2 : Ukur Ikan dengan Stik Eskrim (Penalaran Kritis, Komunikasi). Alat dan bahan: Gambar ikan berbagai ukuran, stik eskrim. Cara bermain: Sediakan gambar ikan dalam berbagai ukuran. Minta anak-anak mengukur panjang ikan menggunakan stik eskrim sebagai unit pengukuran non-standar. Mereka bisa membandingkan ukuran ikan. Ini memperkenalkan konsep pengukuran dan perbandingan. Kegiatan 3 : Ikan Pola (Penalaran Kritis, Kreativitas). Alat dan bahan: Stik eskrim warna-warni, lem, kertas. Cara bermain: Buat pola sederhana menggunakan stik eskrim warna (misalnya: merah-biru-merah-biru) membentuk ikan. Minta anak-anak melanjutkan pola. Diskusikan pola yang terbentuk. Kegiatan ini mengembangkan pemahaman tentang pola dan urutan.',
        activities: [
          {
            activityNumber: 1,
            title:
              'STEAM Membuat Kerajinan Hiu Piring Kertas Bergerak (Kreativitas, Penalaran Kritis)',
            toolsAndMaterials:
              'Piring kertas, Printable ambar hiu atau binatang lainnya, kertas warna dengan berbagai warna, Mata Googly, stik es krim, LemSpidol, Pensil, Gunting',
            howToPlay:
              'Gunting printable gambar hiu, kemudian rekatkan pada stik es krimBuat pola sepeti gelombang ait di atas kertas biru, kemudian gunting membentuk lingkaran di sesuiakan dengan ukuran bagian bawah piring kertas. Gunakan gunting untuk memotong celah panjang di tepi bawah bagian tengah pelat kertas. Selanjutnya, gunting kertas yang sudah di buat pola gelombang, lalu rekatkan pada piring kertas. Rekatkan tanaman laut di bawah air. Tambahkan item tambahan hiasan seperti rumput laut, bintang laut, ikan kecil, batu, dll. Masukkan stik es krim paa bagian piring yang sudah di potong, hiaupun dapat berenang.',
            fullDescription:
              'Kegiatan 1: STEAM Membuat Kerajinan Hiu Piring Kertas Bergerak (Kreativitas, Penalaran Kritis). Alat dan Bahan: Piring kertas, Printable ambar hiu atau binatang lainnya, kertas warna dengan berbagai warna, Mata Googly, stik es krim, LemSpidol, Pensil, Gunting. Cara Membuat: Gunting printable gambar hiu, kemudian rekatkan pada stik es krimBuat pola sepeti gelombang ait di atas kertas biru, kemudian gunting membentuk lingkaran di sesuiakan dengan ukuran bagian bawah piring kertas. Gunakan gunting untuk memotong celah panjang di tepi bawah bagian tengah pelat kertas. Selanjutnya, gunting kertas yang sudah di buat pola gelombang, lalu rekatkan pada piring kertas. Rekatkan tanaman laut di bawah air. Tambahkan item tambahan hiasan seperti rumput laut, bintang laut, ikan kecil, batu, dll. Masukkan stik es krim paa bagian piring yang sudah di potong, hiaupun dapat berenang.',
          },
          {
            activityNumber: 2,
            title: 'Ukur Ikan dengan Stik Eskrim (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials: 'Gambar ikan berbagai ukuran, stik eskrim',
            howToPlay:
              'Sediakan gambar ikan dalam berbagai ukuran. Minta anak-anak mengukur panjang ikan menggunakan stik eskrim sebagai unit pengukuran non-standar. Mereka bisa membandingkan ukuran ikan. Ini memperkenalkan konsep pengukuran dan perbandingan.',
            fullDescription:
              'Kegiatan 2: Ukur Ikan dengan Stik Eskrim (Penalaran Kritis, Komunikasi). Alat dan bahan: Gambar ikan berbagai ukuran, stik eskrim. Cara bermain: Sediakan gambar ikan dalam berbagai ukuran. Minta anak-anak mengukur panjang ikan menggunakan stik eskrim sebagai unit pengukuran non-standar. Mereka bisa membandingkan ukuran ikan. Ini memperkenalkan konsep pengukuran dan perbandingan.',
          },
          {
            activityNumber: 3,
            title: 'Ikan Pola (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials: 'Stik eskrim warna-warni, lem, kertas',
            howToPlay:
              'Buat pola sederhana menggunakan stik eskrim warna (misalnya: merah-biru-merah-biru) membentuk ikan. Minta anak-anak melanjutkan pola. Diskusikan pola yang terbentuk. Kegiatan ini mengembangkan pemahaman tentang pola dan urutan.',
            fullDescription:
              'Kegiatan 3: Ikan Pola (Penalaran Kritis, Kreativitas). Alat dan bahan: Stik eskrim warna-warni, lem, kertas. Cara bermain: Buat pola sederhana menggunakan stik eskrim warna (misalnya: merah-biru-merah-biru) membentuk ikan. Minta anak-anak melanjutkan pola. Diskusikan pola yang terbentuk. Kegiatan ini mengembangkan pemahaman tentang pola dan urutan.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Susun Puzzle Berdasarkan Angka (Penalaran Kritis, Kemandirian). Alat dan bahan: Puzzle dan angka. Cara Bermain: Siapkan puzzle yang terdiri dari 12 potong. Minta anak mencocokkan potongan-potongan puzzle berdasarkan angka. Beri pujian pada anak setiap kali mereka berhasil menemukan potongan yang cocok. Hal ini akan memotivasi mereka untuk melanjutkan menyelesaikan puzzle. Setelah semua potongan tertata di tempatnya, puji hasil kerja anak dan bisa juga berdiskusi tentang gambar yang sudah terbentuk dari puzzle tersebut. Kegiatan 2 : Tangkap Ikan Sesuai Jumlah (Penalaran Kritis, Kolaborasi). Alat dan bahan: Kertas berbentuk ikan dengan angka, jaring kecil atau sendok. Cara bermain: Sebar ikan kertas dengan angka di lantai. Sebutkan sebuah angka dan minta anak-anak menangkap sejumlah ikan yang sesuai dengan angka tersebut. Ini melatih pengenalan angka dan konsep kuantitas. Kegiatan 3 : Tebak Jumlah Ikan (Penalaran Kritis, Komunikasi). Alat dan bahan: Stoples kaca, kancing atau manik-manik sebagai ikan. Cara bermain: Isi stoples dengan sejumlah ikan. Minta anak-anak menebak berapa jumlah ikan dalam stoples. Setelah semua menebak, hitung bersama-sama. Kegiatan ini mengembangkan estimasi dan keterampilan berhitung.',
        activities: [
          {
            activityNumber: 1,
            title: 'Susun Puzzle Berdasarkan Angka (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Puzzle dan angka',
            howToPlay:
              'Siapkan puzzle yang terdiri dari 12 potong. Minta anak mencocokkan potongan-potongan puzzle berdasarkan angka. Beri pujian pada anak setiap kali mereka berhasil menemukan potongan yang cocok. Hal ini akan memotivasi mereka untuk melanjutkan menyelesaikan puzzle. Setelah semua potongan tertata di tempatnya, puji hasil kerja anak dan bisa juga berdiskusi tentang gambar yang sudah terbentuk dari puzzle tersebut.',
            fullDescription:
              'Kegiatan 1: Susun Puzzle Berdasarkan Angka (Penalaran Kritis, Kemandirian). Alat dan bahan: Puzzle dan angka. Cara Bermain: Siapkan puzzle yang terdiri dari 12 potong. Minta anak mencocokkan potongan-potongan puzzle berdasarkan angka. Beri pujian pada anak setiap kali mereka berhasil menemukan potongan yang cocok. Hal ini akan memotivasi mereka untuk melanjutkan menyelesaikan puzzle. Setelah semua potongan tertata di tempatnya, puji hasil kerja anak dan bisa juga berdiskusi tentang gambar yang sudah terbentuk dari puzzle tersebut.',
          },
          {
            activityNumber: 2,
            title: 'Tangkap Ikan Sesuai Jumlah (Penalaran Kritis, Kolaborasi)',
            toolsAndMaterials: 'Kertas berbentuk ikan dengan angka, jaring kecil atau sendok',
            howToPlay:
              'Sebar ikan kertas dengan angka di lantai. Sebutkan sebuah angka dan minta anak-anak menangkap sejumlah ikan yang sesuai dengan angka tersebut. Ini melatih pengenalan angka dan konsep kuantitas.',
            fullDescription:
              'Kegiatan 2: Tangkap Ikan Sesuai Jumlah (Penalaran Kritis, Kolaborasi). Alat dan bahan: Kertas berbentuk ikan dengan angka, jaring kecil atau sendok. Cara bermain: Sebar ikan kertas dengan angka di lantai. Sebutkan sebuah angka dan minta anak-anak menangkap sejumlah ikan yang sesuai dengan angka tersebut. Ini melatih pengenalan angka dan konsep kuantitas.',
          },
          {
            activityNumber: 3,
            title: 'Tebak Jumlah Ikan (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials: 'Stoples kaca, kancing atau manik-manik sebagai ikan',
            howToPlay:
              'Isi stoples dengan sejumlah ikan. Minta anak-anak menebak berapa jumlah ikan dalam stoples. Setelah semua menebak, hitung bersama-sama. Kegiatan ini mengembangkan estimasi dan keterampilan berhitung.',
            fullDescription:
              'Kegiatan 3: Tebak Jumlah Ikan (Penalaran Kritis, Komunikasi). Alat dan bahan: Stoples kaca, kancing atau manik-manik sebagai ikan. Cara bermain: Isi stoples dengan sejumlah ikan. Minta anak-anak menebak berapa jumlah ikan dalam stoples. Setelah semua menebak, hitung bersama-sama. Kegiatan ini mengembangkan estimasi dan keterampilan berhitung.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Isi Sesuai Jumlah Yang Ada Di Dalam Lingkaran (Penalaran Kritis, Kemandirian). Alat dan Bahan :Holahop. Printable angkaMainan, balok kayu, lego atau yang lainnya Cara Membuat dan MemainkannyaTata holahop berjejer dengan rapi, kemudian letakkan printable di Tengah-tengah holahop. Mintalah anak-anak untuk meletakkan mainan atau lego atau lainnya ke dalam holahop sesuai dengan jumlah angka yang terdapat di dalam holahop. Kegiatan 2 : Ikan Simetris (Kreativitas, Penalaran Kritis). Alat dan bahan: Kertas, cat air, kuas. Cara bermain: Lipat kertas menjadi dua. Minta anak-anak melukis setengah ikan di satu sisi lipatan dengan cat air. Lipat kertas untuk membuat cetakan simetris di sisi lain. Diskusikan konsep simetri. Ini mengembangkan pemahaman tentang simetri dan kreativitas. Kegiatan 3 : Estafet Ikan Plastisin (Kesehatan, Kolaborasi). Alat dan bahan: Plastisin untuk membuat ikan, sendok. Cara bermain: Anak-anak membuat ikan kecil dari plastisin. Kemudian, dalam bentuk lomba estafet, mereka memindahkan ikan dari satu tempat ke tempat lain menggunakan sendok. Ini melatih keseimbangan, koordinasi, dan kontrol motorik halus.',
        activities: [
          {
            activityNumber: 1,
            title: 'Isi Sesuai Jumlah Yang Ada Di Dalam Lingkaran (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Holahop. Printable angkaMainan, balok kayu, lego atau yang lainnya',
            howToPlay:
              'dan MemainkannyaTata holahop berjejer dengan rapi, kemudian letakkan printable di Tengah-tengah holahop. Mintalah anak-anak untuk meletakkan mainan atau lego atau lainnya ke dalam holahop sesuai dengan jumlah angka yang terdapat di dalam holahop.',
            fullDescription:
              'Kegiatan 1: Isi Sesuai Jumlah Yang Ada Di Dalam Lingkaran (Penalaran Kritis, Kemandirian). Alat dan Bahan :Holahop. Printable angkaMainan, balok kayu, lego atau yang lainnya Cara Membuat dan MemainkannyaTata holahop berjejer dengan rapi, kemudian letakkan printable di Tengah-tengah holahop. Mintalah anak-anak untuk meletakkan mainan atau lego atau lainnya ke dalam holahop sesuai dengan jumlah angka yang terdapat di dalam holahop.',
          },
          {
            activityNumber: 2,
            title: 'Ikan Simetris (Kreativitas, Penalaran Kritis)',
            toolsAndMaterials: 'Kertas, cat air, kuas',
            howToPlay:
              'Lipat kertas menjadi dua. Minta anak-anak melukis setengah ikan di satu sisi lipatan dengan cat air. Lipat kertas untuk membuat cetakan simetris di sisi lain. Diskusikan konsep simetri. Ini mengembangkan pemahaman tentang simetri dan kreativitas.',
            fullDescription:
              'Kegiatan 2: Ikan Simetris (Kreativitas, Penalaran Kritis). Alat dan bahan: Kertas, cat air, kuas. Cara bermain: Lipat kertas menjadi dua. Minta anak-anak melukis setengah ikan di satu sisi lipatan dengan cat air. Lipat kertas untuk membuat cetakan simetris di sisi lain. Diskusikan konsep simetri. Ini mengembangkan pemahaman tentang simetri dan kreativitas.',
          },
          {
            activityNumber: 3,
            title: 'Estafet Ikan Plastisin (Kesehatan, Kolaborasi)',
            toolsAndMaterials: 'Plastisin untuk membuat ikan, sendok',
            howToPlay:
              'Anak-anak membuat ikan kecil dari plastisin. Kemudian, dalam bentuk lomba estafet, mereka memindahkan ikan dari satu tempat ke tempat lain menggunakan sendok. Ini melatih keseimbangan, koordinasi, dan kontrol motorik halus.',
            fullDescription:
              'Kegiatan 3: Estafet Ikan Plastisin (Kesehatan, Kolaborasi). Alat dan bahan: Plastisin untuk membuat ikan, sendok. Cara bermain: Anak-anak membuat ikan kecil dari plastisin. Kemudian, dalam bentuk lomba estafet, mereka memindahkan ikan dari satu tempat ke tempat lain menggunakan sendok. Ini melatih keseimbangan, koordinasi, dan kontrol motorik halus.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Menjatuhkan Bola Menggunakan Air (Kesehatan, Penalaran Kritis). Alat dan bahan: Bola plastic, gelas kertas, Meja, botol spray (bisa diganti spuit besar), air. Cara Bermain: Siapkan bola plastic yang di letakkan di atas gelas kertas, kemudian letakkan di atas meja. Buat garis pembatas tempat berdiri. Mintalah anak-anak untuk berdiri pada garis yang sudah di siapkan untuk menembek bola. Anak yang berhasil menjatuhkan bola paling banyak dengan waktu yang di tentukan , yang menang. Kegiatan 2 : Ikan Keseimbangan (Kesehatan, Kemandirian). Alat dan bahan: Bantal kecil atau kantong biji berbentuk ikan yang dibuat dari kain dan diisi biji-bijian. Cara bermain: Anak-anak mencoba menyeimbangkan ikan di atas kepala mereka sambil berjalan pada garis lurus yang dibuat dari ranting. Variasikan dengan meletakkan ikan di bagian tubuh lain. Ini melatih keseimbangan dan postur tubuh. Kegiatan 3 : Lompat Ikan Salmon (Kesehatan, Kreativitas). Alat dan bahan: Ranting pohon sebagai rintangan, karet gelang. Cara bermain: Susun ranting di lantai sebagai air terjun. Anak-anak melompati ranting sambil memegang karet gelang di antara jari kaki mereka, seolah-olah mereka adalah ikan salmon yang melompat. Tingkatkan kesulitan dengan menambah tinggi rintangan. Ini melatih kekuatan kaki dan koordinasi tubuh.',
        activities: [
          {
            activityNumber: 1,
            title: 'Menjatuhkan Bola Menggunakan Air (Kesehatan, Penalaran Kritis)',
            toolsAndMaterials:
              'Bola plastic, gelas kertas, Meja, botol spray (bisa diganti spuit besar), air',
            howToPlay:
              'Siapkan bola plastic yang di letakkan di atas gelas kertas, kemudian letakkan di atas meja. Buat garis pembatas tempat berdiri. Mintalah anak-anak untuk berdiri pada garis yang sudah di siapkan untuk menembek bola. Anak yang berhasil menjatuhkan bola paling banyak dengan waktu yang di tentukan , yang menang.',
            fullDescription:
              'Kegiatan 1: Menjatuhkan Bola Menggunakan Air (Kesehatan, Penalaran Kritis). Alat dan bahan: Bola plastic, gelas kertas, Meja, botol spray (bisa diganti spuit besar), air. Cara Bermain: Siapkan bola plastic yang di letakkan di atas gelas kertas, kemudian letakkan di atas meja. Buat garis pembatas tempat berdiri. Mintalah anak-anak untuk berdiri pada garis yang sudah di siapkan untuk menembek bola. Anak yang berhasil menjatuhkan bola paling banyak dengan waktu yang di tentukan , yang menang.',
          },
          {
            activityNumber: 2,
            title: 'Ikan Keseimbangan (Kesehatan, Kemandirian)',
            toolsAndMaterials:
              'Bantal kecil atau kantong biji berbentuk ikan yang dibuat dari kain dan diisi biji-bijian',
            howToPlay:
              'Anak-anak mencoba menyeimbangkan ikan di atas kepala mereka sambil berjalan pada garis lurus yang dibuat dari ranting. Variasikan dengan meletakkan ikan di bagian tubuh lain. Ini melatih keseimbangan dan postur tubuh.',
            fullDescription:
              'Kegiatan 2: Ikan Keseimbangan (Kesehatan, Kemandirian). Alat dan bahan: Bantal kecil atau kantong biji berbentuk ikan yang dibuat dari kain dan diisi biji-bijian. Cara bermain: Anak-anak mencoba menyeimbangkan ikan di atas kepala mereka sambil berjalan pada garis lurus yang dibuat dari ranting. Variasikan dengan meletakkan ikan di bagian tubuh lain. Ini melatih keseimbangan dan postur tubuh.',
          },
          {
            activityNumber: 3,
            title: 'Lompat Ikan Salmon (Kesehatan, Kreativitas)',
            toolsAndMaterials: 'Ranting pohon sebagai rintangan, karet gelang',
            howToPlay:
              'Susun ranting di lantai sebagai air terjun. Anak-anak melompati ranting sambil memegang karet gelang di antara jari kaki mereka, seolah-olah mereka adalah ikan salmon yang melompat. Tingkatkan kesulitan dengan menambah tinggi rintangan. Ini melatih kekuatan kaki dan koordinasi tubuh.',
            fullDescription:
              'Kegiatan 3: Lompat Ikan Salmon (Kesehatan, Kreativitas). Alat dan bahan: Ranting pohon sebagai rintangan, karet gelang. Cara bermain: Susun ranting di lantai sebagai air terjun. Anak-anak melompati ranting sambil memegang karet gelang di antara jari kaki mereka, seolah-olah mereka adalah ikan salmon yang melompat. Tingkatkan kesulitan dengan menambah tinggi rintangan. Ini melatih kekuatan kaki dan koordinasi tubuh.',
          },
        ],
      },
    ],
    closingActivities: [
      'Parade hasil karya dengan musik ceria berkeliling kelas sambil menunjukkan bangga',
      'Tepuk tangan meriah untuk semua hasil karya teman-teman',
      'Bermain tebak-tebakan seru tentang binatang air dengan hadiah stiker',
      'Menari Tarian Ikan Berenang bersama-sama dengan gerakan lucu',
      'Bernyanyi lagu Terima Kasih Tuhan sambil bertepuk tangan riang',
      'Sesi Aku Bangga Hari Ini dimana setiap anak bercerita dengan semangat',
      'Yel-yel kelas tentang menjaga binatang air dengan suara lantang',
      'Pelukan hangat dan high-five dengan teman dan guru',
      'Perencanaan petualangan besok dengan antusiasme tinggi',
      'Doa penutup yang energik dengan gerakan tangan ke atas',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan minimal 3 jenis binatang air saat ditunjukkan gambar pada circle time awal',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan reaksi positif dan antusias saat melihat video ikan badut yang ditayangkan',
      },
      {
        no: 3,
        indicator:
          'Anak mampu membuat kolase ikan dari cup cake dengan rapi dan kreatif sesuai imajinasinya',
      },
      {
        no: 4,
        indicator:
          'Anak dapat mengurutkan angka 1-10 pada kegiatan memancing ikan kertas dengan benar',
      },
      {
        no: 5,
        indicator:
          'Anak menghitung jumlah sisik ikan sesuai target 15 dengan bantuan minimal dari guru',
      },
      {
        no: 6,
        indicator:
          'Anak berhasil membuat kerajinan hiu bergerak dan dapat menjelaskan cara kerjanya sederhana',
      },
      {
        no: 7,
        indicator: 'Anak menunjukkan kemampuan kerjasama yang baik saat bermain dalam kelompok',
      },
      {
        no: 8,
        indicator:
          'Anak dapat mengukur panjang ikan menggunakan stik eskrim dan membandingkan ukurannya',
      },
      {
        no: 9,
        indicator:
          'Anak menyelesaikan puzzle 12 potong berdasarkan urutan angka dengan tekun dan sabar',
      },
      {
        no: 10,
        indicator:
          'Anak mendemonstrasikan cara merawat ikan mainan dengan penuh kasih sayang dan hati-hati',
      },
      {
        no: 11,
        indicator:
          'Anak mampu menceritakan pengalaman belajarnya dengan antusias saat show and tell',
      },
      {
        no: 12,
        indicator:
          'Anak mengekspresikan rasa syukur kepada Tuhan atas keindahan binatang air ciptaan-Nya melalui doa dan cerita',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 11,
    filename: '47_TK_B_Smt1_11_Binatang_Darat.docx',
    title: 'JELAJAH DUNIA: BINATANG DARAT SEKITAR KITA',
    topic: 'BINATANG',
    subtopic: 'BINATANG DARAT',
    modelPembelajaran: 'Inkuiri, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Oktober 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: true,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: true,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun (Kelompok B) memiliki keingintahuan tinggi terhadap dunia sekitar, khususnya binatang. Mereka sudah mampu berkomunikasi dengan kalimat sederhana, mulai memahami konsep angka dan pola, serta senang bereksplorasi melalui aktivitas bermain. Anak-anak pada usia ini membutuhkan pembelajaran yang melibatkan seluruh panca indera dan memberikan pengalaman langsung untuk membangun pemahaman konseptual.',
      learningMaterial:
        'Pembelajaran tentang binatang darat mengintegrasikan pengetahuan esensial mengenai karakteristik dan habitat binatang, pengetahuan aplikatif melalui pengamatan dan klasifikasi, serta pengetahuan nilai dan karakter melalui pemahaman kasih sayang terhadap makhluk hidup ciptaan Tuhan. Materi ini relevan dengan kehidupan anak karena mereka sering berinteraksi dengan binatang di sekitar rumah dan lingkungan.',
    },
    learningDesign: {
      cp: 'CP Dasar Literasi dan STEAM: Murid mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan, menunjukkan minat, dan berpartisipasi dalam kegiatan pramembacaElemen: Dasar Literasi dan STEAM: Anak memiliki kemampuan menyatakan hubungan antar bilangan dengan berbagai cara (kesadaran bilangan), mengidentifikasi pola, mengenali bentuk dan karakteristik benda di sekitar yang dapat dibandingkan dan diukur, mengklasifikasi objek, dan kesadaran mengenai waktu melalui proses eksplorasi dan pengalaman langsung dengan benda-benda konkret di lingkungan',
      crossDisciplinary:
        'Nilai agama dan moral (menghargai ciptaan Tuhan melalui kasih sayang pada binatang), Nilai Pancasila (gotong royong dalam merawat lingkungan), Fisik motorik (gerakan meniru binatang dan koordinasi mata-tangan), Kognitif (mengklasifikasi, menghitung, dan mengidentifikasi pola), Bahasa (bercerita dan mendeskripsikan karakteristik binatang), Sosial emosional (empati terhadap makhluk hidup dan kerja sama).',
      tp: 'Anak mampu mendeskripsikan karakteristik dan habitat binatang darat serta mengomunikasikannya secara lisan dengan kalimat sederhana. Anak dapat meningkatkan kemampuan berhitung dengan jumlah yang lebih besar, Anak dapat mengukur dan membandingkan ukuran menggunakan alat ukur non-standar, Anak dapat mengidentifikasi dan menciptakan pola yang lebih kompleks, serta Anak dapat memahami konsep waktu sederhana terkait aktivitas binatang darat.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain sambil belajar melalui eksplorasi langsung, bercerita untuk membangun imajinasi, bernyanyi untuk memperkuat memori, dan eksperimen sederhana untuk mengembangkan rasa ingin tahu. Metode ini mendukung prinsip berkesadaran dengan melibatkan seluruh panca indera, bermakna melalui pengalaman konkret, dan menggembirakan dengan suasana yang menyenangkan.',
      partnership:
        'Melibatkan orang tua sebagai narasumber tentang hewan peliharaan di rumah, komunitas peternak lokal untuk memberikan pengalaman langsung, serta kakak kelas untuk aktivitas bercerita dan berbagi pengalaman tentang binatang kesayangan.',
      environment:
        'Mengintegrasikan ruang dalam dan luar kelas sebagai laboratorium alam, memanfaatkan halaman sekolah untuk observasi, serta menciptakan sudut-sudut bermain tematik yang mendukung eksplorasi dan kolaborasi anak dalam suasana yang aman dan menyenangkan.',
      digitalUtilization:
        'Media pembelajaran digital berupa video edukatif tentang binatang darat, audio suara binatang untuk permainan tebak suara, dan platform pembelajaran interaktif sederhana. Teknologi digunakan untuk memperkaya pengalaman belajar anak tanpa menggantikan interaksi langsung dan permainan aktif. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka',
      'Menyanyikan lagu sesuai tema',
      'Mengamati video/buku cerita tentang binatang darat',
      'Menyiapkan kesepakatan kelas dan aturan bermain',
    ],
    openingQuestions: [
      'Siapa yang menciptakan semua binatang di bumi ini? (Keimanan dan Ketakwaan)',
      'Bagaimana cara kita menjaga binatang di sekitar rumah? (Kewargaan)',
      'Mengapa gajah punya telinga besar dan jerapah punya leher panjang? (Penalaran Kritis)',
      'Apa yang terjadi jika semua binatang sama bentuknya? (Kreativitas)',
      'Bagaimana binatang saling membantu di hutan? (Kolaborasi)',
      'Binatang apa yang bisa hidup sendiri tanpa induknya? (Kemandirian)',
      'Mengapa penting bagi binatang untuk tetap sehat dan kuat? (Kesehatan)',
      "Bagaimana cara binatang 'berbicara' dengan temannya? (Komunikasi)",
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Ayam Bersuara (Kreativitas, Komunikasi). Alat dan Bahan: Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting. Cara Membuat dan Memainkannya :Siapkan printable ayam, lalu beri warna dan gunting. Selanjutnya lubangi gelas plastik pada bagian bawah gelas. Selanjutnya masukkan senar ke dalam gelas plastik dan beri lidi lalu ikat sebagai penghalang agar senar tidak lepas. Selanjutnya lem printable ayam yang sudah di gunting dan di beri warna dengan plastik pada bagian kiri kanan (seperti pada gambar). Terakhir tarik senar agar bergoyang sehingga menghasilkan suara, karena gesekan senar dan lidi yang di tarik. Kegiatan 2 : Mengelompokkan Binatang (Penalaran Kritis, Kognitif). Alat dan bahan: Kartu bergambar berbagai binatang darat, keranjang/wadah Cara bermain: Guru menyediakan kartu bergambar binatang darat dan 2 keranjang. Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki). Kegiatan 3 : Estafet Beri Makan Binatang (Kolaborasi, Kesehatan). Alat dan bahan: Ember berisi makanan (jagung, kacang-kacangan, daun), sendok, gambar ayam dan kambing. Cara bermain: Anak berlomba memindahkan makanan ke piring yang benar di depan gambar binatang sesuai dengan makanannya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Ayam Bersuara (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting',
            howToPlay:
              'dan Memainkannya :Siapkan printable ayam, lalu beri warna dan gunting. Selanjutnya lubangi gelas plastik pada bagian bawah gelas. Selanjutnya masukkan senar ke dalam gelas plastik dan beri lidi lalu ikat sebagai penghalang agar senar tidak lepas. Selanjutnya lem printable ayam yang sudah di gunting dan di beri warna dengan plastik pada bagian kiri kanan (seperti pada gambar). Terakhir tarik senar agar bergoyang sehingga menghasilkan suara, karena gesekan senar dan lidi yang di tarik.',
            fullDescription:
              'Kegiatan 1: Ayam Bersuara (Kreativitas, Komunikasi). Alat dan Bahan: Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting. Cara Membuat dan Memainkannya :Siapkan printable ayam, lalu beri warna dan gunting. Selanjutnya lubangi gelas plastik pada bagian bawah gelas. Selanjutnya masukkan senar ke dalam gelas plastik dan beri lidi lalu ikat sebagai penghalang agar senar tidak lepas. Selanjutnya lem printable ayam yang sudah di gunting dan di beri warna dengan plastik pada bagian kiri kanan (seperti pada gambar). Terakhir tarik senar agar bergoyang sehingga menghasilkan suara, karena gesekan senar dan lidi yang di tarik.',
          },
          {
            activityNumber: 2,
            title: 'Mengelompokkan Binatang (Penalaran Kritis, Kognitif)',
            toolsAndMaterials: 'Kartu bergambar berbagai binatang darat, keranjang/wadah',
            howToPlay:
              'Guru menyediakan kartu bergambar binatang darat dan 2 keranjang. Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki).',
            fullDescription:
              'Kegiatan 2: Mengelompokkan Binatang (Penalaran Kritis, Kognitif). Alat dan bahan: Kartu bergambar berbagai binatang darat, keranjang/wadah Cara bermain: Guru menyediakan kartu bergambar binatang darat dan 2 keranjang. Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki).',
          },
          {
            activityNumber: 3,
            title: 'Estafet Beri Makan Binatang (Kolaborasi, Kesehatan)',
            toolsAndMaterials:
              'Ember berisi makanan (jagung, kacang-kacangan, daun), sendok, gambar ayam dan kambing',
            howToPlay:
              'Anak berlomba memindahkan makanan ke piring yang benar di depan gambar binatang sesuai dengan makanannya.',
            fullDescription:
              'Kegiatan 3: Estafet Beri Makan Binatang (Kolaborasi, Kesehatan). Alat dan bahan: Ember berisi makanan (jagung, kacang-kacangan, daun), sendok, gambar ayam dan kambing. Cara bermain: Anak berlomba memindahkan makanan ke piring yang benar di depan gambar binatang sesuai dengan makanannya.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Balap Lari Kelinci dan Kura-Kura (Kemandirian, Kesehatan). Alat dan Bahan: Printable gambar kelinci dan kura-kura, sedotan, gunting, lem, benang. Cara Membuat dan Memiankannya : Siapkan gambar printable kelinci dan kua-kura, kemudian gunting. Potong sedotan menjadi 4 bagian, lalu rekatkan masing -masing 2 sedotan untuk setiapk gambar. Masukkan benang ke dalam sedotan. Gantungkan benang yang terdapat di antara ke dua sedotan pada benda yang lebih tinggi. Missal: gagang pintu, hanger dan lainnya. Kemudian tarik kedua ujung benang secara bergantian sehingga membuat gambar naik, gambar yang dapat naik atau yang berada paling di depan itu yang menang. Kegiatan 2 : Labirin Padang Rumput (Penalaran Kritis, Kemandirian). Alat dan bahan: Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat. Cara bermain: Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu sapi mereka melalui labirin untuk mencapai padang rumput. Kegiatan 3 : Membuat Lonceng Sapi (Kreativitas, Kemandirian). Alat dan bahan: Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering. Cara bermain: Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher sapi mereka saat bermain peran.',
        activities: [
          {
            activityNumber: 1,
            title: 'Balap Lari Kelinci dan Kura-Kura (Kemandirian, Kesehatan)',
            toolsAndMaterials:
              'Printable gambar kelinci dan kura-kura, sedotan, gunting, lem, benang',
            howToPlay:
              'dan Memiankannya : Siapkan gambar printable kelinci dan kua-kura, kemudian gunting. Potong sedotan menjadi 4 bagian, lalu rekatkan masing -masing 2 sedotan untuk setiapk gambar. Masukkan benang ke dalam sedotan. Gantungkan benang yang terdapat di antara ke dua sedotan pada benda yang lebih tinggi. Missal: gagang pintu, hanger dan lainnya. Kemudian tarik kedua ujung benang secara bergantian sehingga membuat gambar naik, gambar yang dapat naik atau yang berada paling di depan itu yang menang.',
            fullDescription:
              'Kegiatan 1: Balap Lari Kelinci dan Kura-Kura (Kemandirian, Kesehatan). Alat dan Bahan: Printable gambar kelinci dan kura-kura, sedotan, gunting, lem, benang. Cara Membuat dan Memiankannya : Siapkan gambar printable kelinci dan kua-kura, kemudian gunting. Potong sedotan menjadi 4 bagian, lalu rekatkan masing -masing 2 sedotan untuk setiapk gambar. Masukkan benang ke dalam sedotan. Gantungkan benang yang terdapat di antara ke dua sedotan pada benda yang lebih tinggi. Missal: gagang pintu, hanger dan lainnya. Kemudian tarik kedua ujung benang secara bergantian sehingga membuat gambar naik, gambar yang dapat naik atau yang berada paling di depan itu yang menang.',
          },
          {
            activityNumber: 2,
            title: 'Labirin Padang Rumput (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials:
              'Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat',
            howToPlay:
              'Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu sapi mereka melalui labirin untuk mencapai padang rumput.',
            fullDescription:
              'Kegiatan 2: Labirin Padang Rumput (Penalaran Kritis, Kemandirian). Alat dan bahan: Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat. Cara bermain: Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu sapi mereka melalui labirin untuk mencapai padang rumput.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Lonceng Sapi (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering',
            howToPlay:
              'Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher sapi mereka saat bermain peran.',
            fullDescription:
              'Kegiatan 3: Membuat Lonceng Sapi (Kreativitas, Kemandirian). Alat dan bahan: Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering. Cara bermain: Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher sapi mereka saat bermain peran.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Ayam Bersuara (Kolaborasi, Kesehatan). Alat dan Bahan: Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting. Cara Membuat dan Memainkannya :Siapkan printable ayam, lalu beri warna dan gunting. Selanjutnya lubangi gelas plastik pada bagian bawah gelas. Selanjutnya masukkan senar ke dalam gelas plastik dan beri lidi lalu ikat sebagai penghalang agar senar tidak lepas. Selanjutnya lem printable ayam yang sudah di gunting dan di beri warna dengan plastik pada bagian kiri kanan (seperti pada gambar). Terakhir tarik senar agar bergoyang sehingga menghasilkan suara, karena gesekan senar dan lidi yang di tarik. Kegiatan 2 : Mengelompokkan Binatang (Penalaran Kritis, Komunikasi). Alat dan bahan: Kartu bergambar berbagai binatang darat, keranjang/wadah Cara bermain: Guru menyediakan kartu bergambar binatang darat dan 2 keranjang (Penalaran Kritis, Komunikasi). Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki). Kegiatan 3 : Estafet Beri Makan Binatang (Kolaborasi, Kesehatan, Keimanan dan Ketakwaan). Alat dan bahan: Ember berisi makanan (jagung, kacang-kacangan, daun), sendok, gambar ayam dan kambing. Cara bermain: Anak berlomba memindahkan makanan ke piring yang benar di depan gambar binatang sesuai dengan makanannya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Ayam Bersuara (Kolaborasi, Kesehatan)',
            toolsAndMaterials: 'Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting',
            howToPlay:
              'dan Memainkannya :Siapkan printable ayam, lalu beri warna dan gunting. Selanjutnya lubangi gelas plastik pada bagian bawah gelas. Selanjutnya masukkan senar ke dalam gelas plastik dan beri lidi lalu ikat sebagai penghalang agar senar tidak lepas. Selanjutnya lem printable ayam yang sudah di gunting dan di beri warna dengan plastik pada bagian kiri kanan (seperti pada gambar). Terakhir tarik senar agar bergoyang sehingga menghasilkan suara, karena gesekan senar dan lidi yang di tarik.',
            fullDescription:
              'Kegiatan 1: Ayam Bersuara (Kolaborasi, Kesehatan). Alat dan Bahan: Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting. Cara Membuat dan Memainkannya :Siapkan printable ayam, lalu beri warna dan gunting. Selanjutnya lubangi gelas plastik pada bagian bawah gelas. Selanjutnya masukkan senar ke dalam gelas plastik dan beri lidi lalu ikat sebagai penghalang agar senar tidak lepas. Selanjutnya lem printable ayam yang sudah di gunting dan di beri warna dengan plastik pada bagian kiri kanan (seperti pada gambar). Terakhir tarik senar agar bergoyang sehingga menghasilkan suara, karena gesekan senar dan lidi yang di tarik.',
          },
          {
            activityNumber: 2,
            title: 'Mengelompokkan Binatang (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials: 'Kartu bergambar berbagai binatang darat, keranjang/wadah',
            howToPlay:
              'Guru menyediakan kartu bergambar binatang darat dan 2 keranjang (Penalaran Kritis, Komunikasi). Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki).',
            fullDescription:
              'Kegiatan 2: Mengelompokkan Binatang (Penalaran Kritis, Komunikasi). Alat dan bahan: Kartu bergambar berbagai binatang darat, keranjang/wadah Cara bermain: Guru menyediakan kartu bergambar binatang darat dan 2 keranjang (Penalaran Kritis, Komunikasi). Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki).',
          },
          {
            activityNumber: 3,
            title: 'Estafet Beri Makan Binatang (Kolaborasi, Kesehatan, Keimanan dan Ketakwaan)',
            toolsAndMaterials:
              'Ember berisi makanan (jagung, kacang-kacangan, daun), sendok, gambar ayam dan kambing',
            howToPlay:
              'Anak berlomba memindahkan makanan ke piring yang benar di depan gambar binatang sesuai dengan makanannya.',
            fullDescription:
              'Kegiatan 3: Estafet Beri Makan Binatang (Kolaborasi, Kesehatan, Keimanan dan Ketakwaan). Alat dan bahan: Ember berisi makanan (jagung, kacang-kacangan, daun), sendok, gambar ayam dan kambing. Cara bermain: Anak berlomba memindahkan makanan ke piring yang benar di depan gambar binatang sesuai dengan makanannya.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Kolase Domba Berbulu Kapas (Kreativitas, Kemandirian, Kesehatan). Alat dan Bahan: Kertas gambar dengan sketsa domba, kapas secukupnya, lem cair, crayon atau pensil warna, gunting (untuk guru), dan tisu basah untuk membersihkan tangan. Cara Bermain: Anak-anak diberikan kertas bergambar sketsa domba yang sudah disiapkan guru. Mereka mulai dengan mewarnai bagian kepala, kaki, dan ekor domba menggunakan crayon sesuai kreativitas masing-masing. Selanjutnya, anak-anak mengoleskan lem pada bagian tubuh domba yang akan ditempeli kapas. Kapas ditempelkan sedikit demi sedikit hingga menutupi seluruh tubuh domba, menciptakan tekstur bulu yang lembut dan realistis. Guru mendampingi anak untuk memastikan kapas menempel dengan baik dan memberikan apresiasi terhadap hasil karya setiap anak. Aktivitas ini mengembangkan kreativitas, koordinasi mata-tangan, dan kemampuan mengikuti instruksi sambil mengenalkan karakteristik fisik domba. Kegiatan 2 : Labirin Padang Rumput (Kreativitas, Kesehatan). Alat dan bahan: Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat. Cara bermain: Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu sapi mereka melalui labirin untuk mencapai padang rumput. Kegiatan 3 : Membuat Lonceng Sapi (Kemandirian, Kesehatan). Alat dan bahan: Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering. Cara bermain: Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher sapi mereka saat bermain peran.',
        activities: [
          {
            activityNumber: 1,
            title: 'Kolase Domba Berbulu Kapas (Kreativitas, Kemandirian, Kesehatan)',
            toolsAndMaterials:
              'Kertas gambar dengan sketsa domba, kapas secukupnya, lem cair, crayon atau pensil warna, gunting (untuk guru), dan tisu basah untuk membersihkan tangan',
            howToPlay:
              'Anak-anak diberikan kertas bergambar sketsa domba yang sudah disiapkan guru. Mereka mulai dengan mewarnai bagian kepala, kaki, dan ekor domba menggunakan crayon sesuai kreativitas masing-masing. Selanjutnya, anak-anak mengoleskan lem pada bagian tubuh domba yang akan ditempeli kapas. Kapas ditempelkan sedikit demi sedikit hingga menutupi seluruh tubuh domba, menciptakan tekstur bulu yang lembut dan realistis. Guru mendampingi anak untuk memastikan kapas menempel dengan baik dan memberikan apresiasi terhadap hasil karya setiap anak. Aktivitas ini mengembangkan kreativitas, koordinasi mata-tangan, dan kemampuan mengikuti instruksi sambil mengenalkan karakteristik fisik domba.',
            fullDescription:
              'Kegiatan 1: Kolase Domba Berbulu Kapas (Kreativitas, Kemandirian, Kesehatan). Alat dan Bahan: Kertas gambar dengan sketsa domba, kapas secukupnya, lem cair, crayon atau pensil warna, gunting (untuk guru), dan tisu basah untuk membersihkan tangan. Cara Bermain: Anak-anak diberikan kertas bergambar sketsa domba yang sudah disiapkan guru. Mereka mulai dengan mewarnai bagian kepala, kaki, dan ekor domba menggunakan crayon sesuai kreativitas masing-masing. Selanjutnya, anak-anak mengoleskan lem pada bagian tubuh domba yang akan ditempeli kapas. Kapas ditempelkan sedikit demi sedikit hingga menutupi seluruh tubuh domba, menciptakan tekstur bulu yang lembut dan realistis. Guru mendampingi anak untuk memastikan kapas menempel dengan baik dan memberikan apresiasi terhadap hasil karya setiap anak. Aktivitas ini mengembangkan kreativitas, koordinasi mata-tangan, dan kemampuan mengikuti instruksi sambil mengenalkan karakteristik fisik domba.',
          },
          {
            activityNumber: 2,
            title: 'Labirin Padang Rumput (Kreativitas, Kesehatan)',
            toolsAndMaterials:
              'Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat',
            howToPlay:
              'Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu sapi mereka melalui labirin untuk mencapai padang rumput.',
            fullDescription:
              'Kegiatan 2: Labirin Padang Rumput (Kreativitas, Kesehatan). Alat dan bahan: Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat. Cara bermain: Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu sapi mereka melalui labirin untuk mencapai padang rumput.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Lonceng Sapi (Kemandirian, Kesehatan)',
            toolsAndMaterials:
              'Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering',
            howToPlay:
              'Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher sapi mereka saat bermain peran.',
            fullDescription:
              'Kegiatan 3: Membuat Lonceng Sapi (Kemandirian, Kesehatan). Alat dan bahan: Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering. Cara bermain: Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher sapi mereka saat bermain peran.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Landak Dari Tanah Liat (Kreativitas, Kemandirian). Alat dan bahan: tusuk gigi atau lidi, tanah liat. Cara Membuat: Siapkan semua bahan, kemudian minta anak-anak untuk mengambil adonan tanah liat. Setelah itu, membuat bentuk bulat-bulat hingga membentuk badan landak. Jika sudah terbentuk mintalah anak-anak untuk menancapkan tusuk gigi atau ranting kayu pada tanah liat sebagai duri landak, lalu tambahkan batu untuk mata landak. Kemudian Guru dapat meminta anak untuk untuk menuliskan kata L-A-N-D-A-K dengan melihat kartu flashcard. Jika sudah anak-anak juga dapat menghitung berapa banyak tusuk gigi yang di gunakan untuk membuat duri landak. Kegiatan 2 : Lompat Kelinci (Kesehatan, Kemandirian, Keimanan dan Ketakwaan). Alat dan bahan: Kertas warna atau kapur untuk membuat lingkaran di lantai. Cara bermain: Buat beberapa lingkaran di lantai menggunakan kertas warna atau kapur. Minta anak-anak untuk berpura-pura menjadi katak dan melompat dari satu lingkaran ke lingkaran lainnya. Variasikan jarak antar lingkaran untuk meningkatkan tantangan. Kegiatan ini membantu mengembangkan kekuatan otot kaki dan koordinasiKegiatan 3 : Merayap Seperti Ular (Kesehatan, Kreativitas). Alat dan bahan: Tali atau selotip untuk membuat jalur meliuk-liuk di lantai. Cara bermain: Buat jalur meliuk-liuk di lantai menggunakan tali atau selotip. Minta anak-anak untuk merayap seperti ular mengikuti jalur tersebut. Variasikan dengan membuat terowongan dari kardus bekas untuk dilalui. Kegiatan ini membantu melatih koordinasi tubuh dan kelenturan',
        activities: [
          {
            activityNumber: 1,
            title: 'Landak Dari Tanah Liat (Kreativitas, Kemandirian)',
            toolsAndMaterials: 'tusuk gigi atau lidi, tanah liat',
            howToPlay:
              'Siapkan semua bahan, kemudian minta anak-anak untuk mengambil adonan tanah liat. Setelah itu, membuat bentuk bulat-bulat hingga membentuk badan landak. Jika sudah terbentuk mintalah anak-anak untuk menancapkan tusuk gigi atau ranting kayu pada tanah liat sebagai duri landak, lalu tambahkan batu untuk mata landak. Kemudian Guru dapat meminta anak untuk untuk menuliskan kata L-A-N-D-A-K dengan melihat kartu flashcard. Jika sudah anak-anak juga dapat menghitung berapa banyak tusuk gigi yang di gunakan untuk membuat duri landak.',
            fullDescription:
              'Kegiatan 1: Landak Dari Tanah Liat (Kreativitas, Kemandirian). Alat dan bahan: tusuk gigi atau lidi, tanah liat. Cara Membuat: Siapkan semua bahan, kemudian minta anak-anak untuk mengambil adonan tanah liat. Setelah itu, membuat bentuk bulat-bulat hingga membentuk badan landak. Jika sudah terbentuk mintalah anak-anak untuk menancapkan tusuk gigi atau ranting kayu pada tanah liat sebagai duri landak, lalu tambahkan batu untuk mata landak. Kemudian Guru dapat meminta anak untuk untuk menuliskan kata L-A-N-D-A-K dengan melihat kartu flashcard. Jika sudah anak-anak juga dapat menghitung berapa banyak tusuk gigi yang di gunakan untuk membuat duri landak.',
          },
          {
            activityNumber: 2,
            title: 'Lompat Kelinci (Kesehatan, Kemandirian, Keimanan dan Ketakwaan)',
            toolsAndMaterials: 'Kertas warna atau kapur untuk membuat lingkaran di lantai',
            howToPlay:
              'Buat beberapa lingkaran di lantai menggunakan kertas warna atau kapur. Minta anak-anak untuk berpura-pura menjadi katak dan melompat dari satu lingkaran ke lingkaran lainnya. Variasikan jarak antar lingkaran untuk meningkatkan tantangan. Kegiatan ini membantu mengembangkan kekuatan otot kaki dan koordinasi',
            fullDescription:
              'Kegiatan 2: Lompat Kelinci (Kesehatan, Kemandirian, Keimanan dan Ketakwaan). Alat dan bahan: Kertas warna atau kapur untuk membuat lingkaran di lantai. Cara bermain: Buat beberapa lingkaran di lantai menggunakan kertas warna atau kapur. Minta anak-anak untuk berpura-pura menjadi katak dan melompat dari satu lingkaran ke lingkaran lainnya. Variasikan jarak antar lingkaran untuk meningkatkan tantangan. Kegiatan ini membantu mengembangkan kekuatan otot kaki dan koordinasi',
          },
          {
            activityNumber: 3,
            title: 'Merayap Seperti Ular (Kesehatan, Kreativitas)',
            toolsAndMaterials: 'Tali atau selotip untuk membuat jalur meliuk-liuk di lantai',
            howToPlay:
              'Buat jalur meliuk-liuk di lantai menggunakan tali atau selotip. Minta anak-anak untuk merayap seperti ular mengikuti jalur tersebut. Variasikan dengan membuat terowongan dari kardus bekas untuk dilalui. Kegiatan ini membantu melatih koordinasi tubuh dan kelenturan',
            fullDescription:
              'Kegiatan 3: Merayap Seperti Ular (Kesehatan, Kreativitas). Alat dan bahan: Tali atau selotip untuk membuat jalur meliuk-liuk di lantai. Cara bermain: Buat jalur meliuk-liuk di lantai menggunakan tali atau selotip. Minta anak-anak untuk merayap seperti ular mengikuti jalur tersebut. Variasikan dengan membuat terowongan dari kardus bekas untuk dilalui. Kegiatan ini membantu melatih koordinasi tubuh dan kelenturan',
          },
        ],
      },
    ],
    closingActivities: [
      'Bermain Tebak Aku Siapa sambil menirukan gerakan dan suara binatang favorit',
      'Parade kostum binatang menggunakan hasil karya hari ini sambil berteriak Hore!',
      'Menyanyi dan menari lagu Kebun Binatang dengan gerakan lucu binatang',
      'Lomba cepat menyebutkan nama binatang sambil bertepuk tangan',
      'Bercerita singkat tentang petualangan seru bersama binatang kesayangan',
      'High-five keliling dengan teman sambil mengatakan Aku bangga!',
      'Yel-yel kelas Kami sayang binatang, binatang sayang kami!',
      'Merencanakan kegiatan esok hari bersama-sama',
      'Berdoa dengan gerakan tangan seperti sayap burung sambil tersenyum',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan nama dan menirukan suara 3-5 binatang darat dengan antusias',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan sikap kasih sayang terhadap binatang melalui kata-kata dan gerakan tubuh',
      },
      {
        no: 3,
        indicator:
          'Anak mampu mengelompokkan binatang berdasarkan jumlah kaki (2 kaki dan 4 kaki) dengan benar',
      },
      {
        no: 4,
        indicator:
          'Anak dapat menghitung jumlah binatang dalam kelompok sampai 10 menggunakan benda konkret',
      },
      {
        no: 5,
        indicator:
          'Anak mampu mengikuti dan melanjutkan pola sederhana berdasarkan karakteristik binatang',
      },
      {
        no: 6,
        indicator:
          'Anak dapat menceritakan habitat dan makanan binatang dengan kalimat sederhana 3-5 kata',
      },
      {
        no: 7,
        indicator:
          'Anak menunjukkan kreativitas dalam membuat karya seni (kolase, diorama) bertema binatang',
      },
      {
        no: 8,
        indicator:
          'Anak mampu bekerja sama dalam kegiatan kelompok dan berbagi alat bermain dengan teman',
      },
      {
        no: 9,
        indicator:
          'Anak menunjukkan kemandirian dalam menyelesaikan tugas tanpa bantuan berlebihan dari guru',
      },
      {
        no: 10,
        indicator:
          'Anak dapat menggunakan gerakan motorik kasar (melompat, merayap) dan halus (menggunting, menempel) dengan koordinasi baik',
      },
      {
        no: 11,
        indicator:
          'Anak mampu mengukur panjang objek menggunakan alat ukur non-standar (balok, tali)',
      },
      {
        no: 12,
        indicator:
          'Anak mengungkapkan rasa syukur kepada Tuhan atas keberagaman ciptaan-Nya melalui doa dan ucapan',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 12,
    filename: '48_TK_B_Smt1_12_Sayang_Binatang.docx',
    title: 'SAYANG SEMUA MAKHLUK CIPTAAN TUHAN',
    topic: 'BINATANG',
    subtopic: 'SAYANG BINATANG',
    modelPembelajaran: 'PjBL, STEAM',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Oktober 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: true,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: true,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: true,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: true,
      },
    ],
    identification: {
      students:
        'Anak-anak usia 5-6 tahun (Kelompok B) memiliki karakteristik rasa ingin tahu yang tinggi terhadap makhluk hidup di sekitarnya, mulai memahami konsep empati dan kepedulian, serta senang bereksplorasi melalui kegiatan hands-on. Mereka membutuhkan pengalaman langsung dan konkret untuk memahami cara merawat dan menyayangi binatang. Anak-anak pada usia ini juga mulai memahami tanggung jawab sederhana dan dapat bekerja sama dalam kelompok kecil.',
      learningMaterial:
        'Materi pembelajaran tentang cara menyayangi dan merawat binatang mencakup pengetahuan faktual tentang jenis-jenis binatang, habitat, makanan, dan kebutuhan dasar binatang. Materi ini sangat relevan dengan kehidupan sehari-hari anak karena mereka sering berinteraksi dengan binatang peliharaan atau melihat binatang di lingkungan sekitar. Tingkat kesulitan disesuaikan dengan kemampuan kognitif anak usia 5-6 tahun melalui kegiatan bermain, berkarya, dan bereksplorasi. Integrasi nilai dan karakter meliputi rasa sayang, tanggung jawab, dan kepedulian terhadap makhluk hidup ciptaan Tuhan.',
    },
    learningDesign: {
      cp: 'CP Nilai Agama dan Budi Pekerti: Murid menghargai alam dan seluruh makhluk hidup ciptaan Tuhan Yang Maha EsaCP Dasar Literasi dan STEAM: Murid menunjukkan kemampuan awal menggunakan dan merekayasa teknologi serta untuk mencari informasi, gagasan, dan keterampilan secara aman dan bertanggung jawab',
      crossDisciplinary:
        'Nilai agama dan moral (mengenal ciptaan Tuhan dan cara bersyukur), nilai Pancasila (sikap gotong royong dalam merawat binatang), fisik motorik (koordinasi mata-tangan saat membuat kerajinan), kognitif (mengklasifikasi jenis binatang dan habitatnya), bahasa (bercerita tentang pengalaman dengan binatang), sosial emosional (empati dan kepedulian terhadap makhluk hidup)',
      tp: 'Anak mampu menerapkan cara merawat lingkungan alam sekitarAnak mampu menunjukkan rasa sayang terhadap makhluk hidup di sekitarnyaAnak mampu menggunakan teknologi sederhana untuk menyelesaikan tugas dan kegiatanAnak mampu membuat alat teknologi sederhana',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain yang mengintegrasikan kegiatan bercerita, bernyanyi, dan eksplorasi langsung. Metode learning by doing diterapkan melalui proyek seni kolaboratif dan eksperimen sederhana. Pendekatan ini mendukung prinsip berkesadaran dengan melibatkan anak secara aktif, bermakna melalui pengalaman konkret, dan menggembirakan dengan suasana belajar yang menyenangkan dan penuh eksplorasi.',
      partnership:
        'Melibatkan orang tua dalam berbagi cerita tentang binatang peliharaan keluarga, guru kelas lain untuk kegiatan lintas kelas, dan pemanfaatan lingkungan sekolah sebagai laboratorium alam untuk pengamatan binatang kecil.',
      environment:
        'Integrasi ruang kelas untuk kegiatan berkarya, area outdoor untuk eksplorasi alam, dan sudut buku untuk kegiatan bercerita. Budaya belajar kolaboratif dikembangkan melalui kerja kelompok dan saling berbagi pengalaman tentang binatang peliharaan.',
      digitalUtilization:
        'Menggunakan tablet untuk menonton video edukasi tentang binatang, aplikasi menggambar sederhana untuk membuat karya digital, dan perekaman dokumentasi kegiatan anak. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Menyanyikan lagu Uci Binatang Peliharaan untuk menciptakan suasana gembira',
      'Kegiatan pemantik berupa buku cerita/video Uci Si Kucing Peliharaan',
      'Diskusi tentang pengalaman anak dengan binatang peliharaan',
      'Menetapkan aturan bermain dan kesepakatan kelas',
    ],
    openingQuestions: [
      'Siapa yang menciptakan semua binatang yang indah ini? (Keimanan dan Ketakwaan)',
      'Bagaimana cara kita menunjukkan rasa sayang kepada binatang? (Kewargaan)',
      'Mengapa binatang memerlukan makanan dan tempat tinggal? (Penalaran Kritis)',
      'Apa yang bisa kita buat untuk membantu binatang? (Kreativitas)',
      'Bagaimana kita bisa bekerja sama merawat binatang? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri untuk merawat binatang peliharaan? (Kemandirian)',
      'Mengapa kita harus menjaga kebersihan kandang binatang? (Kesehatan)',
      'Bagaimana cara memberitahu teman tentang cara merawat binatang? (Komunikasi)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Membuat Kipas Berbentuk Merak (Kreativitas). Alat dan Bahan , Kertas origami, Gunting, Lem, Cara Membuat :Siapkan kertas origami, selanjutnya lipat kertas seperti pada gambar Lipat kertas menjadi dua atas dan bawah, kemudian lipat kanan dan kiri dengan porsi yang berbeda satu sisi lebih sedikit kurang lebih sekitar 3-4 cm tergantung ukuran kertas)Selanjutnya gambar bentuk kepala merak, lalu gunting dan lipat bolak-balik kertas yang masih tersisa. Jika sudah lipat menjadi satu, dan rekatkan dengan lem. Terakhir hiasi dengan potongan sisa kertas atau gambar dengan krayon warna. Kegiatan 2 : Membuat Kolase Hewan dari Daun Kering (Keimanan dan Ketakwaan). Alat dan bahan: Daun kering berbagai bentuk dan warna, kertas karton, lem. Cara bermain: Ajak anak-anak mengumpulkan daun kering di halaman. Gambar sketsa hewan sederhana di kertas karton. Minta anak menempelkan daun-daun kering untuk mengisi sketsa, membentuk kolase hewan. Diskusikan tentang hewan yang dibuat, habitatnya, dan pentingnya menjaga lingkungan untuk melindungi hewan-hewan tersebut. Kegiatan 3 : Bermain Jejak Ayam (Penalaran Kritis). Alat dan bahan: Tanah basah atau pasir, gambar jejak ayam. Cara bermain: Siapkan area dengan tanah basah atau pasir. Tunjukkan gambar jejak ayam kepada anak-anak. Minta mereka membuat jejak hewan tersebut di tanah atau pasir menggunakan tangan atau alat sederhana. Diskusikan tentang hewan yang meninggalkan jejak tersebut dan makanannya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Kipas Berbentuk Merak (Kreativitas)',
            toolsAndMaterials: 'Kertas origami, Gunting, Lem',
            howToPlay:
              'Siapkan kertas origami, selanjutnya lipat kertas seperti pada gambar Lipat kertas menjadi dua atas dan bawah, kemudian lipat kanan dan kiri dengan porsi yang berbeda satu sisi lebih sedikit kurang lebih sekitar 3-4 cm tergantung ukuran kertas)Selanjutnya gambar bentuk kepala merak, lalu gunting dan lipat bolak-balik kertas yang masih tersisa. Jika sudah lipat menjadi satu, dan rekatkan dengan lem. Terakhir hiasi dengan potongan sisa kertas atau gambar dengan krayon warna.',
            fullDescription:
              'Kegiatan 1: Membuat Kipas Berbentuk Merak (Kreativitas). Alat dan Bahan , Kertas origami, Gunting, Lem, Cara Membuat :Siapkan kertas origami, selanjutnya lipat kertas seperti pada gambar Lipat kertas menjadi dua atas dan bawah, kemudian lipat kanan dan kiri dengan porsi yang berbeda satu sisi lebih sedikit kurang lebih sekitar 3-4 cm tergantung ukuran kertas)Selanjutnya gambar bentuk kepala merak, lalu gunting dan lipat bolak-balik kertas yang masih tersisa. Jika sudah lipat menjadi satu, dan rekatkan dengan lem. Terakhir hiasi dengan potongan sisa kertas atau gambar dengan krayon warna.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Kolase Hewan dari Daun Kering (Keimanan dan Ketakwaan)',
            toolsAndMaterials: 'Daun kering berbagai bentuk dan warna, kertas karton, lem',
            howToPlay:
              'Ajak anak-anak mengumpulkan daun kering di halaman. Gambar sketsa hewan sederhana di kertas karton. Minta anak menempelkan daun-daun kering untuk mengisi sketsa, membentuk kolase hewan. Diskusikan tentang hewan yang dibuat, habitatnya, dan pentingnya menjaga lingkungan untuk melindungi hewan-hewan tersebut.',
            fullDescription:
              'Kegiatan 2: Membuat Kolase Hewan dari Daun Kering (Keimanan dan Ketakwaan). Alat dan bahan: Daun kering berbagai bentuk dan warna, kertas karton, lem. Cara bermain: Ajak anak-anak mengumpulkan daun kering di halaman. Gambar sketsa hewan sederhana di kertas karton. Minta anak menempelkan daun-daun kering untuk mengisi sketsa, membentuk kolase hewan. Diskusikan tentang hewan yang dibuat, habitatnya, dan pentingnya menjaga lingkungan untuk melindungi hewan-hewan tersebut.',
          },
          {
            activityNumber: 3,
            title: 'Bermain Jejak Ayam (Penalaran Kritis)',
            toolsAndMaterials: 'Tanah basah atau pasir, gambar jejak ayam',
            howToPlay:
              'Siapkan area dengan tanah basah atau pasir. Tunjukkan gambar jejak ayam kepada anak-anak. Minta mereka membuat jejak hewan tersebut di tanah atau pasir menggunakan tangan atau alat sederhana. Diskusikan tentang hewan yang meninggalkan jejak tersebut dan makanannya.',
            fullDescription:
              'Kegiatan 3: Bermain Jejak Ayam (Penalaran Kritis). Alat dan bahan: Tanah basah atau pasir, gambar jejak ayam. Cara bermain: Siapkan area dengan tanah basah atau pasir. Tunjukkan gambar jejak ayam kepada anak-anak. Minta mereka membuat jejak hewan tersebut di tanah atau pasir menggunakan tangan atau alat sederhana. Diskusikan tentang hewan yang meninggalkan jejak tersebut dan makanannya.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : STEM Membuat Kandang Binatang (Kreativitas). Alat dan bahan: Piring kertas, Benang, Krayon atau cat warna, Pelubang buku, Gunting, Lem, Gambar atau mainan binatang kecil, Cara Membuat: Warnai piring kertas menggunakan krayon atau cat untuk membuat latar belakang kandang. Misalnya warna hijau untuk rumput atau coklat untuk tanah. Gunakan pelubang buku untuk membuat lubang-lubang di sekeliling tepi piring kertas dengan jarak yang sama. Buatlah sekitar 12-16 lubang. Potong benang sepanjang 30-40 cm. Jumlahnya sesuai dengan jumlah lubang yang dibuat. Masukkan ujung benang ke salah satu lubang dan ikat. Lalu tarik benang ke lubang di seberangnya dan ikat lagi. Lakukan hal yang sama untuk semua lubang hingga membentuk jeruji kandang. Gunting sisa benang yang berlebih. Gambar atau tempelkan gambar binatang di bagian dalam piring kertas. Atau letakkan mainan binatang kecil di dalamnya. Jika ingin membuat atap kandang, potong setengah lingkaran dari piring kertas lain. Warnai dan tempelkan di bagian atas piring utama. Tambahkan detail lain seperti pohon, batu, atau makanan binatang menggunakan krayon atau potongan kertas berwarna. Buat beberapa kandang dengan binatang berbeda untuk membuat kebun binatang mini. Kegiatan 2 : Bermain Tebak Suara Hewan (Komunikasi). Alat dan bahan: Rekaman suara hewan atau kemampuan menirukan suara hewan. Cara bermain: Di alam terbuka, mainkan atau tirukan suara hewan. Minta anak-anak menebak hewan apa yang bersuara tersebut. Diskusikan tentang hewan-hewan tersebut, habitatnya, dan pentingnya tidak mengganggu atau membuat hewan-hewan liar ketakutan. Kegiatan 3 : Membuat Boneka Jari Hewan dari Bahan Alam (Kolaborasi). Alat dan bahan: Sarung tangan kain, biji-bijian, daun kering, lem. Cara bermain: Bantu anak-anak menempelkan biji-bijian dan daun kering pada sarung tangan untuk membuat boneka jari hewan. Gunakan boneka ini untuk bercerita tentang kehidupan hewan dan mengapa kita harus memperlakukan mereka dengan baik.',
        activities: [
          {
            activityNumber: 1,
            title: 'STEM Membuat Kandang Binatang (Kreativitas)',
            toolsAndMaterials:
              'Piring kertas, Benang, Krayon atau cat warna, Pelubang buku, Gunting, Lem, Gambar atau mainan binatang kecil',
            howToPlay:
              'Warnai piring kertas menggunakan krayon atau cat untuk membuat latar belakang kandang. Misalnya warna hijau untuk rumput atau coklat untuk tanah. Gunakan pelubang buku untuk membuat lubang-lubang di sekeliling tepi piring kertas dengan jarak yang sama. Buatlah sekitar 12-16 lubang. Potong benang sepanjang 30-40 cm. Jumlahnya sesuai dengan jumlah lubang yang dibuat. Masukkan ujung benang ke salah satu lubang dan ikat. Lalu tarik benang ke lubang di seberangnya dan ikat lagi. Lakukan hal yang sama untuk semua lubang hingga membentuk jeruji kandang. Gunting sisa benang yang berlebih. Gambar atau tempelkan gambar binatang di bagian dalam piring kertas. Atau letakkan mainan binatang kecil di dalamnya. Jika ingin membuat atap kandang, potong setengah lingkaran dari piring kertas lain. Warnai dan tempelkan di bagian atas piring utama. Tambahkan detail lain seperti pohon, batu, atau makanan binatang menggunakan krayon atau potongan kertas berwarna. Buat beberapa kandang dengan binatang berbeda untuk membuat kebun binatang mini.',
            fullDescription:
              'Kegiatan 1: STEM Membuat Kandang Binatang (Kreativitas). Alat dan bahan: Piring kertas, Benang, Krayon atau cat warna, Pelubang buku, Gunting, Lem, Gambar atau mainan binatang kecil, Cara Membuat: Warnai piring kertas menggunakan krayon atau cat untuk membuat latar belakang kandang. Misalnya warna hijau untuk rumput atau coklat untuk tanah. Gunakan pelubang buku untuk membuat lubang-lubang di sekeliling tepi piring kertas dengan jarak yang sama. Buatlah sekitar 12-16 lubang. Potong benang sepanjang 30-40 cm. Jumlahnya sesuai dengan jumlah lubang yang dibuat. Masukkan ujung benang ke salah satu lubang dan ikat. Lalu tarik benang ke lubang di seberangnya dan ikat lagi. Lakukan hal yang sama untuk semua lubang hingga membentuk jeruji kandang. Gunting sisa benang yang berlebih. Gambar atau tempelkan gambar binatang di bagian dalam piring kertas. Atau letakkan mainan binatang kecil di dalamnya. Jika ingin membuat atap kandang, potong setengah lingkaran dari piring kertas lain. Warnai dan tempelkan di bagian atas piring utama. Tambahkan detail lain seperti pohon, batu, atau makanan binatang menggunakan krayon atau potongan kertas berwarna. Buat beberapa kandang dengan binatang berbeda untuk membuat kebun binatang mini.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Tebak Suara Hewan (Komunikasi)',
            toolsAndMaterials: 'Rekaman suara hewan atau kemampuan menirukan suara hewan',
            howToPlay:
              'Di alam terbuka, mainkan atau tirukan suara hewan. Minta anak-anak menebak hewan apa yang bersuara tersebut. Diskusikan tentang hewan-hewan tersebut, habitatnya, dan pentingnya tidak mengganggu atau membuat hewan-hewan liar ketakutan.',
            fullDescription:
              'Kegiatan 2: Bermain Tebak Suara Hewan (Komunikasi). Alat dan bahan: Rekaman suara hewan atau kemampuan menirukan suara hewan. Cara bermain: Di alam terbuka, mainkan atau tirukan suara hewan. Minta anak-anak menebak hewan apa yang bersuara tersebut. Diskusikan tentang hewan-hewan tersebut, habitatnya, dan pentingnya tidak mengganggu atau membuat hewan-hewan liar ketakutan.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Boneka Jari Hewan dari Bahan Alam (Kolaborasi)',
            toolsAndMaterials: 'Sarung tangan kain, biji-bijian, daun kering, lem',
            howToPlay:
              'Bantu anak-anak menempelkan biji-bijian dan daun kering pada sarung tangan untuk membuat boneka jari hewan. Gunakan boneka ini untuk bercerita tentang kehidupan hewan dan mengapa kita harus memperlakukan mereka dengan baik.',
            fullDescription:
              'Kegiatan 3: Membuat Boneka Jari Hewan dari Bahan Alam (Kolaborasi). Alat dan bahan: Sarung tangan kain, biji-bijian, daun kering, lem. Cara bermain: Bantu anak-anak menempelkan biji-bijian dan daun kering pada sarung tangan untuk membuat boneka jari hewan. Gunakan boneka ini untuk bercerita tentang kehidupan hewan dan mengapa kita harus memperlakukan mereka dengan baik.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Bekerjasama Menuang Air Dari Panci Ke Dalam Gelas (Kolaborasi). Alat dan bahan: Gelas plastik, Panci, Tambang, Air, Cara Membuat dan Bermain: Bagi anak ke dalam beberapa kelompok. Kemudian siapkan panci atau ember atau lainnya, kemudian ikat beberapa tambang bisa 3-5 agar dapat di angkat 5 orang secara bersamaan. Kemudian anak-anak harus memegang tali secara bersamaan agar dapat menuangkan air ke dalam gelas yang sudah di sediakan. Kelompok yang berhasil menuangkan air ke dalam gelas itu yang menang. Kegiatan 2 : Bermain Tebak Binatang dengan Bayangan (Kemandirian). Alat dan bahan: Senter, kertas putih besar, dan loose parts untuk membuat bentuk binatang. Cara bermain: Dalam ruangan gelap, pasang kertas putih di dinding. Gunakan senter untuk menciptakan bayangan dari bentuk binatang yang dibuat dengan loose parts. Anak-anak lain harus menebak binatang apa yang dibentuk. Diskusikan tentang ciri-ciri khas setiap binatang yang membantu dalam identifikasi. Kegiatan 3 : Kandang Sapi Mini (Kesehatan). Alat dan bahan: Balok kayu berbagai ukuran, figur sapi mainan, kertas hijau sebagai rumput. Cara bermain: Ajak anak-anak untuk membangun kandang sapi mini menggunakan balok kayu. Mereka dapat membuat pagar, tempat makan, dan area tidur untuk sapi. Letakkan figur sapi di dalam kandang dan beri alas kertas hijau sebagai rumput. Diskusikan tentang kebutuhan sapi dan cara merawatnya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Bekerjasama Menuang Air Dari Panci Ke Dalam Gelas (Kolaborasi)',
            toolsAndMaterials: 'Gelas plastik, Panci, Tambang, Air',
            howToPlay:
              'dan Bermain: Bagi anak ke dalam beberapa kelompok. Kemudian siapkan panci atau ember atau lainnya, kemudian ikat beberapa tambang bisa 3-5 agar dapat di angkat 5 orang secara bersamaan. Kemudian anak-anak harus memegang tali secara bersamaan agar dapat menuangkan air ke dalam gelas yang sudah di sediakan. Kelompok yang berhasil menuangkan air ke dalam gelas itu yang menang.',
            fullDescription:
              'Kegiatan 1: Bekerjasama Menuang Air Dari Panci Ke Dalam Gelas (Kolaborasi). Alat dan bahan: Gelas plastik, Panci, Tambang, Air, Cara Membuat dan Bermain: Bagi anak ke dalam beberapa kelompok. Kemudian siapkan panci atau ember atau lainnya, kemudian ikat beberapa tambang bisa 3-5 agar dapat di angkat 5 orang secara bersamaan. Kemudian anak-anak harus memegang tali secara bersamaan agar dapat menuangkan air ke dalam gelas yang sudah di sediakan. Kelompok yang berhasil menuangkan air ke dalam gelas itu yang menang.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Tebak Binatang dengan Bayangan (Kemandirian)',
            toolsAndMaterials:
              'Senter, kertas putih besar, dan loose parts untuk membuat bentuk binatang',
            howToPlay:
              'Dalam ruangan gelap, pasang kertas putih di dinding. Gunakan senter untuk menciptakan bayangan dari bentuk binatang yang dibuat dengan loose parts. Anak-anak lain harus menebak binatang apa yang dibentuk. Diskusikan tentang ciri-ciri khas setiap binatang yang membantu dalam identifikasi.',
            fullDescription:
              'Kegiatan 2: Bermain Tebak Binatang dengan Bayangan (Kemandirian). Alat dan bahan: Senter, kertas putih besar, dan loose parts untuk membuat bentuk binatang. Cara bermain: Dalam ruangan gelap, pasang kertas putih di dinding. Gunakan senter untuk menciptakan bayangan dari bentuk binatang yang dibuat dengan loose parts. Anak-anak lain harus menebak binatang apa yang dibentuk. Diskusikan tentang ciri-ciri khas setiap binatang yang membantu dalam identifikasi.',
          },
          {
            activityNumber: 3,
            title: 'Kandang Sapi Mini (Kesehatan)',
            toolsAndMaterials:
              'Balok kayu berbagai ukuran, figur sapi mainan, kertas hijau sebagai rumput',
            howToPlay:
              'Ajak anak-anak untuk membangun kandang sapi mini menggunakan balok kayu. Mereka dapat membuat pagar, tempat makan, dan area tidur untuk sapi. Letakkan figur sapi di dalam kandang dan beri alas kertas hijau sebagai rumput. Diskusikan tentang kebutuhan sapi dan cara merawatnya.',
            fullDescription:
              'Kegiatan 3: Kandang Sapi Mini (Kesehatan). Alat dan bahan: Balok kayu berbagai ukuran, figur sapi mainan, kertas hijau sebagai rumput. Cara bermain: Ajak anak-anak untuk membangun kandang sapi mini menggunakan balok kayu. Mereka dapat membuat pagar, tempat makan, dan area tidur untuk sapi. Letakkan figur sapi di dalam kandang dan beri alas kertas hijau sebagai rumput. Diskusikan tentang kebutuhan sapi dan cara merawatnya.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membalikan Posisi Yang Tepat Sesuai Angka (Penalaran Kritis). Alat dan Bahan, Hula hop, Kartu angka, Bentuk geometri lingkaran atau yang lainnya, Cara Membuat dan Memainkannya: Siapkan beberapa hula hop dan letakkan kartu angka di dalamnya. Selanjutnya siapkan beberapa bentuk geometri lingkaran dengan posisi terbalik (tidak ada warna / seperti gambar)Kemudian mintalah kepada anak-anak untuk membalikkan posisi bentuk geometri dengan tepat sesuai angka, kegiatan ini dapat di lakukan dua anak, dan setiap angka dapat di buat double, yang terlebih dahulu menyelesaikan tantangan ini yang menang. Kegiatan ini dapat membantu anak mengenal konsep dasar matematika, melatih koordinasi antara mata dan tangan, melatih konsentrasi, melatih percaya diri dan mandiri dalam menyelesaikan masalah. Kegiatan 2 : Peternakan Hewan (Kewargaan). Alat dan bahan: Balok kayu, figur hewan ternak (sapi, ayam, domba dll), kertas warna-warni. Cara bermain: Buat area peternakan menggunakan balok kayu. Bagi menjadi beberapa bagian untuk kandang hewan yang berbeda. Gunakan kertas warna-warni sebagai area rumput atau lumpur. Ajak anak-anak menempatkan hewan-hewan di kandang yang sesuai dan diskusikan karakteristik masing-masing hewan. Kegiatan 3 : Labirin Ayam (Kemandirian). Alat dan bahan: Balok kayu berbagai ukuran, figur ayam mainan, kertas kuning dibentuk bulat kecil sebagai biji jagung. Cara bermain: Bangun labirin menggunakan balok kayu. Letakkan figur ayam di satu ujung dan potongan kertas kuning sebagai jagung di ujung lain. Minta anak-anak mengarahkan ayam melalui labirin untuk mencapai makanannya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membalikan Posisi Yang Tepat Sesuai Angka (Penalaran Kritis)',
            toolsAndMaterials: 'Hula hop, Kartu angka, Bentuk geometri lingkaran atau yang lainnya',
            howToPlay:
              'dan Memainkannya: Siapkan beberapa hula hop dan letakkan kartu angka di dalamnya. Selanjutnya siapkan beberapa bentuk geometri lingkaran dengan posisi terbalik (tidak ada warna / seperti gambar)Kemudian mintalah kepada anak-anak untuk membalikkan posisi bentuk geometri dengan tepat sesuai angka, kegiatan ini dapat di lakukan dua anak, dan setiap angka dapat di buat double, yang terlebih dahulu menyelesaikan tantangan ini yang menang. Kegiatan ini dapat membantu anak mengenal konsep dasar matematika, melatih koordinasi antara mata dan tangan, melatih konsentrasi, melatih percaya diri dan mandiri dalam menyelesaikan masalah.',
            fullDescription:
              'Kegiatan 1: Membalikan Posisi Yang Tepat Sesuai Angka (Penalaran Kritis). Alat dan Bahan, Hula hop, Kartu angka, Bentuk geometri lingkaran atau yang lainnya, Cara Membuat dan Memainkannya: Siapkan beberapa hula hop dan letakkan kartu angka di dalamnya. Selanjutnya siapkan beberapa bentuk geometri lingkaran dengan posisi terbalik (tidak ada warna / seperti gambar)Kemudian mintalah kepada anak-anak untuk membalikkan posisi bentuk geometri dengan tepat sesuai angka, kegiatan ini dapat di lakukan dua anak, dan setiap angka dapat di buat double, yang terlebih dahulu menyelesaikan tantangan ini yang menang. Kegiatan ini dapat membantu anak mengenal konsep dasar matematika, melatih koordinasi antara mata dan tangan, melatih konsentrasi, melatih percaya diri dan mandiri dalam menyelesaikan masalah.',
          },
          {
            activityNumber: 2,
            title: 'Peternakan Hewan (Kewargaan)',
            toolsAndMaterials:
              'Balok kayu, figur hewan ternak (sapi, ayam, domba dll), kertas warna-warni',
            howToPlay:
              'Buat area peternakan menggunakan balok kayu. Bagi menjadi beberapa bagian untuk kandang hewan yang berbeda. Gunakan kertas warna-warni sebagai area rumput atau lumpur. Ajak anak-anak menempatkan hewan-hewan di kandang yang sesuai dan diskusikan karakteristik masing-masing hewan.',
            fullDescription:
              'Kegiatan 2: Peternakan Hewan (Kewargaan). Alat dan bahan: Balok kayu, figur hewan ternak (sapi, ayam, domba dll), kertas warna-warni. Cara bermain: Buat area peternakan menggunakan balok kayu. Bagi menjadi beberapa bagian untuk kandang hewan yang berbeda. Gunakan kertas warna-warni sebagai area rumput atau lumpur. Ajak anak-anak menempatkan hewan-hewan di kandang yang sesuai dan diskusikan karakteristik masing-masing hewan.',
          },
          {
            activityNumber: 3,
            title: 'Labirin Ayam (Kemandirian)',
            toolsAndMaterials:
              'Balok kayu berbagai ukuran, figur ayam mainan, kertas kuning dibentuk bulat kecil sebagai biji jagung',
            howToPlay:
              'Bangun labirin menggunakan balok kayu. Letakkan figur ayam di satu ujung dan potongan kertas kuning sebagai jagung di ujung lain. Minta anak-anak mengarahkan ayam melalui labirin untuk mencapai makanannya.',
            fullDescription:
              'Kegiatan 3: Labirin Ayam (Kemandirian). Alat dan bahan: Balok kayu berbagai ukuran, figur ayam mainan, kertas kuning dibentuk bulat kecil sebagai biji jagung. Cara bermain: Bangun labirin menggunakan balok kayu. Letakkan figur ayam di satu ujung dan potongan kertas kuning sebagai jagung di ujung lain. Minta anak-anak mengarahkan ayam melalui labirin untuk mencapai makanannya.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Kerajinan Pop Up Kelinci (Kreativitas). Alat dan Bahan: Kertas warna biru (dapat di sesuaikan), Spidol, Kertas HVS, Gunting, Lem, Kertas warna bermotif atau kertas origami atau lainnya., Cara Membuat: Siapkan kertas warna biru sebagai dasar kartu. Lipat kertas menjadi dua untuk membentuk kartu. Gunting kertas HVS menjadi bentuk telinga kelinci, buat telinga dengan Panjang yang sama. Tempelkan telinga kelinci di bagian atas kartu, di bagian lipatan kertas biru. Pastikan telinga terlihat saat kartu dibuka. Guting bentuk oval yang besar untuk telur sebanyak 4 atau dapat di sesuaikan, lalu gunting. Gunting kertas HVS yang tersisa menjadi bentuk kelinci, dengan membuat bentuk lingkaran besar untuk kepala, dan 2 lingkaran kecil untuk tangan serta 2 bentuk oval untuk kaki. Tempelkan bagian kepala dan tubuh kelinci di bagian di atas bagian telinga kelinci yang sudah di pasang. Dengan menggunakan spidol, gambar wajah kelinci di bagian kepala, anak-anak bisa menggambar mata, hidung, mulut, dan kumis kelinci. Lipat menjadi dua bentuk oval agar simetri, selanjutnya rekatkan menggunakan lem sisinya-sisinya agar merekat satu sama lain. Lalu tempelkan tepat di atas kepala kelinci, baru kemudian tempelkan kedua bentuk lingkaran untuk tangan, dan dua bentuk oval untuk kaki. Buat bentuk garis-garis pada bagian tangan dan kaki kelinci. Biarkan lem mengering sepenuhnya. Kegiatan 2 : Bermain Balap Keong (Kesehatan). Alat dan bahan: Keong hidup (pastikan untuk mengembalikannya ke habitat asli setelah bermain), kapur untuk menggambar garis start dan finish. Cara bermain: Gambar garis start dan finish, lalu letakkan keong di garis start. Lihat keong mana yang mencapai garis finish lebih dulu. Kegiatan ini mengajarkan kesabaran dan observasi alam. Kegiatan 3 : Melukis dengan Tanah Liat (Kreativitas). Alat dan bahan: Tanah liat alami, air, kertas tebal. Cara bermain: Campurkan tanah liat dengan sedikit air hingga menjadi pasta. Gunakan campuran ini untuk melukis di atas kertas tebal. Kegiatan ini mengembangkan kreativitas dan memberikan pengalaman sensorik yang unik.',
        activities: [
          {
            activityNumber: 1,
            title: 'Kerajinan Pop Up Kelinci (Kreativitas)',
            toolsAndMaterials:
              'Kertas warna biru (dapat di sesuaikan), Spidol, Kertas HVS, Gunting, Lem, Kertas warna bermotif atau kertas origami atau lainnya',
            howToPlay:
              'Siapkan kertas warna biru sebagai dasar kartu. Lipat kertas menjadi dua untuk membentuk kartu. Gunting kertas HVS menjadi bentuk telinga kelinci, buat telinga dengan Panjang yang sama. Tempelkan telinga kelinci di bagian atas kartu, di bagian lipatan kertas biru. Pastikan telinga terlihat saat kartu dibuka. Guting bentuk oval yang besar untuk telur sebanyak 4 atau dapat di sesuaikan, lalu gunting. Gunting kertas HVS yang tersisa menjadi bentuk kelinci, dengan membuat bentuk lingkaran besar untuk kepala, dan 2 lingkaran kecil untuk tangan serta 2 bentuk oval untuk kaki. Tempelkan bagian kepala dan tubuh kelinci di bagian di atas bagian telinga kelinci yang sudah di pasang. Dengan menggunakan spidol, gambar wajah kelinci di bagian kepala, anak-anak bisa menggambar mata, hidung, mulut, dan kumis kelinci. Lipat menjadi dua bentuk oval agar simetri, selanjutnya rekatkan menggunakan lem sisinya-sisinya agar merekat satu sama lain. Lalu tempelkan tepat di atas kepala kelinci, baru kemudian tempelkan kedua bentuk lingkaran untuk tangan, dan dua bentuk oval untuk kaki. Buat bentuk garis-garis pada bagian tangan dan kaki kelinci. Biarkan lem mengering sepenuhnya.',
            fullDescription:
              'Kegiatan 1: Kerajinan Pop Up Kelinci (Kreativitas). Alat dan Bahan: Kertas warna biru (dapat di sesuaikan), Spidol, Kertas HVS, Gunting, Lem, Kertas warna bermotif atau kertas origami atau lainnya., Cara Membuat: Siapkan kertas warna biru sebagai dasar kartu. Lipat kertas menjadi dua untuk membentuk kartu. Gunting kertas HVS menjadi bentuk telinga kelinci, buat telinga dengan Panjang yang sama. Tempelkan telinga kelinci di bagian atas kartu, di bagian lipatan kertas biru. Pastikan telinga terlihat saat kartu dibuka. Guting bentuk oval yang besar untuk telur sebanyak 4 atau dapat di sesuaikan, lalu gunting. Gunting kertas HVS yang tersisa menjadi bentuk kelinci, dengan membuat bentuk lingkaran besar untuk kepala, dan 2 lingkaran kecil untuk tangan serta 2 bentuk oval untuk kaki. Tempelkan bagian kepala dan tubuh kelinci di bagian di atas bagian telinga kelinci yang sudah di pasang. Dengan menggunakan spidol, gambar wajah kelinci di bagian kepala, anak-anak bisa menggambar mata, hidung, mulut, dan kumis kelinci. Lipat menjadi dua bentuk oval agar simetri, selanjutnya rekatkan menggunakan lem sisinya-sisinya agar merekat satu sama lain. Lalu tempelkan tepat di atas kepala kelinci, baru kemudian tempelkan kedua bentuk lingkaran untuk tangan, dan dua bentuk oval untuk kaki. Buat bentuk garis-garis pada bagian tangan dan kaki kelinci. Biarkan lem mengering sepenuhnya.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Balap Keong (Kesehatan)',
            toolsAndMaterials:
              'Keong hidup (pastikan untuk mengembalikannya ke habitat asli setelah bermain), kapur untuk menggambar garis start dan finish',
            howToPlay:
              'Gambar garis start dan finish, lalu letakkan keong di garis start. Lihat keong mana yang mencapai garis finish lebih dulu. Kegiatan ini mengajarkan kesabaran dan observasi alam.',
            fullDescription:
              'Kegiatan 2: Bermain Balap Keong (Kesehatan). Alat dan bahan: Keong hidup (pastikan untuk mengembalikannya ke habitat asli setelah bermain), kapur untuk menggambar garis start dan finish. Cara bermain: Gambar garis start dan finish, lalu letakkan keong di garis start. Lihat keong mana yang mencapai garis finish lebih dulu. Kegiatan ini mengajarkan kesabaran dan observasi alam.',
          },
          {
            activityNumber: 3,
            title: 'Melukis dengan Tanah Liat (Kreativitas)',
            toolsAndMaterials: 'Tanah liat alami, air, kertas tebal',
            howToPlay:
              'Campurkan tanah liat dengan sedikit air hingga menjadi pasta. Gunakan campuran ini untuk melukis di atas kertas tebal. Kegiatan ini mengembangkan kreativitas dan memberikan pengalaman sensorik yang unik.',
            fullDescription:
              'Kegiatan 3: Melukis dengan Tanah Liat (Kreativitas). Alat dan bahan: Tanah liat alami, air, kertas tebal. Cara bermain: Campurkan tanah liat dengan sedikit air hingga menjadi pasta. Gunakan campuran ini untuk melukis di atas kertas tebal. Kegiatan ini mengembangkan kreativitas dan memberikan pengalaman sensorik yang unik.',
          },
        ],
      },
    ],
    closingActivities: [
      'Parade karya binatang dengan musik ceria berkeliling kelas',
      'Permainan Siapa Aku? dengan gerakan dan suara binatang favorit',
      'Lomba menirukan suara binatang paling lucu dan unik',
      'Bernyanyi lagu Sayang Binatang sambil menari gembira',
      'High-five marathon untuk merayakan kerja sama yang hebat',
      'Berbagi momen paling seru hari ini dengan teman sebangku',
      'Tepuk tangan meriah untuk semua pencapaian hari ini',
      'Foto bersama dengan karya sambil berpose seperti binatang kesayangan',
      'Doa penutup dengan gerakan tangan yang ekspresif',
      'Memberikan stiker bintang kepada setiap anak sambil menyebutkan kebaikannya',
      'Lagu Sampai Jumpa Besok/ Sayonara dengan lambaian tangan semangat',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan nama binatang peliharaan dan menunjukkan gerakan binatang kesayangan',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan ekspresi empati dan kata-kata lembut saat membahas cara merawat binatang',
      },
      {
        no: 3,
        indicator:
          'Anak mampu menggunakan gunting dan lem dengan aman serta mandiri dalam membuat kerajinan',
      },
      {
        no: 4,
        indicator:
          'Anak dapat membuat kandang/tempat makan binatang sederhana dari bahan daur ulang secara kreatif',
      },
      {
        no: 5,
        indicator: 'Anak menunjukkan kemampuan kerja sama yang baik dalam proyek diorama kelompok',
      },
      {
        no: 6,
        indicator:
          'Anak mampu bercerita tentang karyanya dan menjelaskan fungsinya untuk binatang dengan lancar',
      },
      {
        no: 7,
        indicator:
          'Anak dapat menirukan minimal 5 suara binatang berbeda dan menunjukkan gerakannya',
      },
      {
        no: 8,
        indicator:
          'Anak mendemonstrasikan cara memberi makan dan merawat binatang dengan benar dan hati-hati',
      },
      {
        no: 9,
        indicator:
          'Anak berpartisipasi aktif dalam bermain peran sebagai pemilik binatang peliharaan yang bertanggung jawab',
      },
      {
        no: 10,
        indicator:
          'Anak mampu menyanyikan lagu tentang sayang binatang dengan semangat dan hafal liriknya',
      },
      {
        no: 11,
        indicator:
          'Anak menunjukkan kemampuan mengapresiasi karya teman dengan memberikan pujian dan komentar positif',
      },
      {
        no: 12,
        indicator:
          'Anak dapat membuat komitmen konkret untuk menyayangi dan merawat binatang di lingkungan sekitar',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 13,
    filename: '49_TK_B_Smt1_13_Makan_Minum.docx',
    title: 'KUISI PIRINGKU DENGAN MAKANAN SEHAT',
    topic: 'KEBUTUHANKU',
    subtopic: 'MAKAN DAN MINUM',
    modelPembelajaran: 'PjBL, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Oktober 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: true,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: true,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak kelompok B (5-6 tahun) memiliki karakteristik ingin tahu yang tinggi terhadap makanan dan minuman di sekitarnya, mulai memahami konsep sehat dan tidak sehat, serta mampu mengekspresikan preferensi makanan favorit. Mereka senang bereksplorasi dengan bahan-bahan makanan melalui permainan peran dan aktivitas praktis, namun masih memerlukan bimbingan dalam memahami kandungan gizi dan manfaat makanan bagi tubuh.',
      learningMaterial:
        'Materi tentang makanan dan minuman sehat mencakup pengetahuan faktual tentang jenis-jenis makanan bergizi, pengetahuan konseptual tentang pentingnya gizi seimbang untuk pertumbuhan, dan pengetahuan prosedural dalam memilih serta menyiapkan makanan sehat. Materi ini sangat relevan dengan kehidupan sehari-hari anak dan dapat diintegrasikan dengan nilai-nilai syukur kepada Tuhan serta kebiasaan hidup bersih.',
    },
    learningDesign: {
      cp: 'CP Nilai Agama dan Budi Pekerti: Murid menghargai diri sendiri dan memiliki rasa syukur terhadap Tuhan YME sehingga dapat berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan dirinya CP Jati Diri: Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budaya',
      crossDisciplinary:
        'Nilai agama dan moral (mensyukuri nikmat makanan ciptaan Tuhan), Nilai Pancasila (berbagi makanan dengan teman), Fisik motorik (keterampilan menggunakan alat makan dan menyiapkan makanan), Kognitif (mengelompokkan makanan sehat dan bergizi), Bahasa (menceritakan makanan favorit dan manfaatnya), Sosial emosional (berempati saat berbagi makanan dan bekerja sama dalam permainan peran)',
      tp: 'Anak mampu mengidentifikasi berbagai jenis makanan dan minuman yang sehat serta memahami dampaknya terhadap kesehatan tubuh, Anak dapat mengidentifikasi minimal 4 jenis makanan sehat beserta kandungan gizinya, Anak dapat menjelaskan minimal 2 manfaat air bagi tubuh, dan mampu menunjukkan minimal 3 perilaku positif terkait pola makan sehat.',
      pedagogicalPractice:
        'Pembelajaran dilaksanakan melalui pendekatan bermain peran, bercerita interaktif, bernyanyi, dan eksplorasi langsung dengan bahan makanan nyata. Metode ini dipilih karena sesuai dengan karakteristik anak usia dini yang belajar melalui pengalaman konkret dan menyenangkan, mendukung prinsip berkesadaran melalui keterlibatan aktif, bermakna karena terhubung dengan kehidupan sehari-hari, dan menggembirakan melalui permainan yang menarik.',
      partnership:
        'Melibatkan orang tua dalam berbagi pengalaman memasak di rumah, mengundang ahli gizi atau koki sebagai narasumber, serta berkolaborasi dengan pedagang sayur dan buah di sekitar sekolah untuk pembelajaran kontekstual.',
      environment:
        'Menciptakan suasana kelas yang menyerupai dapur dan restoran mini dengan perlengkapan bermain, memanfaatkan area outdoor untuk kegiatan berkebun sayuran, serta membangun budaya belajar yang mendukung eksplorasi rasa ingin tahu anak tentang makanan sehat.',
      digitalUtilization:
        'Platform pembelajaran digital untuk video edukatif tentang makanan sehat, aplikasi sederhana untuk mengenal jenis-jenis makanan, dan dokumentasi digital kegiatan anakDukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam, doa pembuka, dan penyambutan hangat',
      'Senam atau gerakan tubuh untuk membangun semangat',
      'Bernyanyi lagu Aku Suka Makan Sayur sesuai tema pembelajaran',
      'Menyepakati aturan bermain dan keselamatan dalam kegiatan',
      'Bercerita interaktif menggunakan media buku atau video Leaflet Isi Piringku',
      'Ceritakan makanan favorit kamu dan rasanya! (Komunikasi)',
    ],
    openingQuestions: [
      'Siapa yang memberi kita makanan enak setiap hari? (Keimanan dan Ketakwaan)',
      'Bagaimana caranya berbagi makanan dengan teman yang tidak membawa bekal? (Kewargaan)',
      'Mengapa tubuh kita butuh makan sayur dan buah? (Penalaran Kritis)',
      'Apa makanan baru yang ingin kamu coba buat? (Kreativitas)',
      'Bagaimana cara memasak bersama keluarga di rumah? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri saat makan? (Kemandirian)',
      'Makanan apa yang membuat tubuh jadi kuat? (Kesehatan)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Role Play Memasak Gado-Gado (Kreativitas, Komunikasi). Alat dan Bahan: Kertas origami, Lem, Gunting, Piring kertas, Cara Membuat: Potong kertas origami untuk membuat sayur yang biasa terdapat di gado-gado. Buat bentuk telur dadar menggunakan kertas HVS yang di gunting membentuk lingkaran dan di atsnya di lapisi kertas origami berwarna kuning. Biarkan anak-anak membuat sesuai jreativitas dan imajinasi mereka. Mintalah anak-anak untuk menyebutkan isi dari gado-gado yang mereka buat. Kegiatan 2: Membuat Menu Makanan Sehat (Penalaran Kritis, Kemandirian). Alat dan Bahan: Kertas, pensil warna, majalah bekas, gunting, lem. Cara Bermain: Anak-anak membuat menu makanan sehat untuk satu hari dengan menggambar atau menempel potongan gambar dari majalah. Kegiatan 3: Membuat Piramida Makanan (Kesehatan, Kolaborasi). Alat dan bahan: Kertas karton besar, gambar berbagai makanan, lem, gunting. Cara bermain: Anak-anak membuat piramida makanan dengan menempelkan gambar makanan sesuai kelompoknya (karbohidrat, protein, sayur, buah, dll). Manfaat: Mengenalkan kelompok makanan dan porsi yang dianjurkan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Role Play Memasak Gado-Gado (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Kertas origami, Lem, Gunting, Piring kertas',
            howToPlay:
              'Potong kertas origami untuk membuat sayur yang biasa terdapat di gado-gado. Buat bentuk telur dadar menggunakan kertas HVS yang di gunting membentuk lingkaran dan di atsnya di lapisi kertas origami berwarna kuning. Biarkan anak-anak membuat sesuai jreativitas dan imajinasi mereka. Mintalah anak-anak untuk menyebutkan isi dari gado-gado yang mereka buat.',
            fullDescription:
              'Kegiatan 1: Role Play Memasak Gado-Gado (Kreativitas, Komunikasi). Alat dan Bahan: Kertas origami, Lem, Gunting, Piring kertas, Cara Membuat: Potong kertas origami untuk membuat sayur yang biasa terdapat di gado-gado. Buat bentuk telur dadar menggunakan kertas HVS yang di gunting membentuk lingkaran dan di atsnya di lapisi kertas origami berwarna kuning. Biarkan anak-anak membuat sesuai jreativitas dan imajinasi mereka. Mintalah anak-anak untuk menyebutkan isi dari gado-gado yang mereka buat.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Menu Makanan Sehat (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Kertas, pensil warna, majalah bekas, gunting, lem',
            howToPlay:
              'Anak-anak membuat menu makanan sehat untuk satu hari dengan menggambar atau menempel potongan gambar dari majalah.',
            fullDescription:
              'Kegiatan 2: Membuat Menu Makanan Sehat (Penalaran Kritis, Kemandirian). Alat dan Bahan: Kertas, pensil warna, majalah bekas, gunting, lem. Cara Bermain: Anak-anak membuat menu makanan sehat untuk satu hari dengan menggambar atau menempel potongan gambar dari majalah.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Piramida Makanan (Kesehatan, Kolaborasi)',
            toolsAndMaterials: 'Kertas karton besar, gambar berbagai makanan, lem, gunting',
            howToPlay:
              'Anak-anak membuat piramida makanan dengan menempelkan gambar makanan sesuai kelompoknya (karbohidrat, protein, sayur, buah, dll). Manfaat: Mengenalkan kelompok makanan dan porsi yang dianjurkan.',
            fullDescription:
              'Kegiatan 3: Membuat Piramida Makanan (Kesehatan, Kolaborasi). Alat dan bahan: Kertas karton besar, gambar berbagai makanan, lem, gunting. Cara bermain: Anak-anak membuat piramida makanan dengan menempelkan gambar makanan sesuai kelompoknya (karbohidrat, protein, sayur, buah, dll). Manfaat: Mengenalkan kelompok makanan dan porsi yang dianjurkan.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Lompat Melewati Bola (Kesehatan, Kemandirian). Alat dan Bahan: Bola. Cara Bermain Siapkan bola (untuk ukuran bola disesuaikan dengan usia anak, semakan kecil usia anak maka ukuran bola juga semakin kecil dan semakin besar usia anak maka ukuran bola juga harus semakin besar)Selanjutnya mintalah anak untuk berbaris ke belakang. Kemudian gelundungkan bola dari depan dan anak harus melompat ketika akan lewat. Kegiatan 2: Bermain Peran Restoran Sehat (Komunikasi, Kolaborasi). Alat dan Bahan: Peralatan makan mainan, bahan makanan mainan, kostum koki dan pelayan. Cara Bermain: Anak-anak bermain peran sebagai koki, pelayan, dan pengunjung restoran, memesan dan menyajikan makanan sehat. Kegiatan 3: Eksperimen Warna Makanan (Penalaran Kritis, Kreativitas). Alat dan bahan: Berbagai jenis makanan berwarna alami (bit, kunyit, bayam), air, gelas transparan. Cara bermain: Anak-anak melakukan eksperimen mencampur warna dari bahan makanan alami dan mendiskusikan hasilnya. Manfaat: Mengenalkan sifat alami makanan dan mendorong kreativitas.',
        activities: [
          {
            activityNumber: 1,
            title: 'Lompat Melewati Bola (Kesehatan, Kemandirian)',
            toolsAndMaterials: 'Bola',
            howToPlay:
              'Siapkan bola (untuk ukuran bola disesuaikan dengan usia anak, semakan kecil usia anak maka ukuran bola juga semakin kecil dan semakin besar usia anak maka ukuran bola juga harus semakin besar)Selanjutnya mintalah anak untuk berbaris ke belakang. Kemudian gelundungkan bola dari depan dan anak harus melompat ketika akan lewat.',
            fullDescription:
              'Kegiatan 1: Lompat Melewati Bola (Kesehatan, Kemandirian). Alat dan Bahan: Bola. Cara Bermain Siapkan bola (untuk ukuran bola disesuaikan dengan usia anak, semakan kecil usia anak maka ukuran bola juga semakin kecil dan semakin besar usia anak maka ukuran bola juga harus semakin besar)Selanjutnya mintalah anak untuk berbaris ke belakang. Kemudian gelundungkan bola dari depan dan anak harus melompat ketika akan lewat.',
          },
          {
            activityNumber: 2,
            title: 'Bermain Peran Restoran Sehat (Komunikasi, Kolaborasi)',
            toolsAndMaterials:
              'Peralatan makan mainan, bahan makanan mainan, kostum koki dan pelayan',
            howToPlay:
              'Anak-anak bermain peran sebagai koki, pelayan, dan pengunjung restoran, memesan dan menyajikan makanan sehat.',
            fullDescription:
              'Kegiatan 2: Bermain Peran Restoran Sehat (Komunikasi, Kolaborasi). Alat dan Bahan: Peralatan makan mainan, bahan makanan mainan, kostum koki dan pelayan. Cara Bermain: Anak-anak bermain peran sebagai koki, pelayan, dan pengunjung restoran, memesan dan menyajikan makanan sehat.',
          },
          {
            activityNumber: 3,
            title: 'Eksperimen Warna Makanan (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials:
              'Berbagai jenis makanan berwarna alami (bit, kunyit, bayam), air, gelas transparan',
            howToPlay:
              'Anak-anak melakukan eksperimen mencampur warna dari bahan makanan alami dan mendiskusikan hasilnya. Manfaat: Mengenalkan sifat alami makanan dan mendorong kreativitas.',
            fullDescription:
              'Kegiatan 3: Eksperimen Warna Makanan (Penalaran Kritis, Kreativitas). Alat dan bahan: Berbagai jenis makanan berwarna alami (bit, kunyit, bayam), air, gelas transparan. Cara bermain: Anak-anak melakukan eksperimen mencampur warna dari bahan makanan alami dan mendiskusikan hasilnya. Manfaat: Mengenalkan sifat alami makanan dan mendorong kreativitas.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Memindahkan Bola Dengan Satu Tangan (Kesehatan, Kemandirian). Alat dan Bahan: Hula hop, 3 Buah piring (warna merah, hijau, biru atau warna dapat di sesuaikan), Bola plastik (warna yang sama dengan piring). Cara Membuat dan Memainkannya: Siapkan hula hop dan letakkan bola di tengah-tengah hula hopLetakkan piring di area luar hula hopSelanjutnya mintalah anak melakukan posisi push-up dan meletakkan bola ke dalam piring yang memiliki warna yang sama menggunakan satu tangan dan tangan satunya untuk menopang tubuhKegiatan 2: Eksperimen Air dan Minyak (Penalaran Kritis, Kreativitas). Alat dan Bahan: Gelas transparan, air, minyak sayur, pewarna makanan. Cara Bermain: Anak-anak melakukan eksperimen mencampur air dan minyak, mengamati bahwa keduanya tidak bisa bercampur, dan mendiskusikan pentingnya minum air untuk tubuh. Kegiatan 3: Membuat Menu Seimbang (Kesehatan, Komunikasi). Alat dan bahan: Kertas, pensil warna, contoh menu seimbang. Cara bermain: Anak-anak diminta membuat menu makanan seimbang untuk satu hari dengan menggambar atau menulis. Manfaat: Mengenalkan konsep gizi seimbang dan melatih kreativitas.',
        activities: [
          {
            activityNumber: 1,
            title: 'Memindahkan Bola Dengan Satu Tangan (Kesehatan, Kemandirian)',
            toolsAndMaterials:
              'Hula hop, 3 Buah piring (warna merah, hijau, biru atau warna dapat di sesuaikan), Bola plastik (warna yang sama dengan piring)',
            howToPlay:
              'dan Memainkannya: Siapkan hula hop dan letakkan bola di tengah-tengah hula hopLetakkan piring di area luar hula hopSelanjutnya mintalah anak melakukan posisi push-up dan meletakkan bola ke dalam piring yang memiliki warna yang sama menggunakan satu tangan dan tangan satunya untuk menopang tubuh',
            fullDescription:
              'Kegiatan 1: Memindahkan Bola Dengan Satu Tangan (Kesehatan, Kemandirian). Alat dan Bahan: Hula hop, 3 Buah piring (warna merah, hijau, biru atau warna dapat di sesuaikan), Bola plastik (warna yang sama dengan piring). Cara Membuat dan Memainkannya: Siapkan hula hop dan letakkan bola di tengah-tengah hula hopLetakkan piring di area luar hula hopSelanjutnya mintalah anak melakukan posisi push-up dan meletakkan bola ke dalam piring yang memiliki warna yang sama menggunakan satu tangan dan tangan satunya untuk menopang tubuh',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Air dan Minyak (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials: 'Gelas transparan, air, minyak sayur, pewarna makanan',
            howToPlay:
              'Anak-anak melakukan eksperimen mencampur air dan minyak, mengamati bahwa keduanya tidak bisa bercampur, dan mendiskusikan pentingnya minum air untuk tubuh.',
            fullDescription:
              'Kegiatan 2: Eksperimen Air dan Minyak (Penalaran Kritis, Kreativitas). Alat dan Bahan: Gelas transparan, air, minyak sayur, pewarna makanan. Cara Bermain: Anak-anak melakukan eksperimen mencampur air dan minyak, mengamati bahwa keduanya tidak bisa bercampur, dan mendiskusikan pentingnya minum air untuk tubuh.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Menu Seimbang (Kesehatan, Komunikasi)',
            toolsAndMaterials: 'Kertas, pensil warna, contoh menu seimbang',
            howToPlay:
              'Anak-anak diminta membuat menu makanan seimbang untuk satu hari dengan menggambar atau menulis. Manfaat: Mengenalkan konsep gizi seimbang dan melatih kreativitas.',
            fullDescription:
              'Kegiatan 3: Membuat Menu Seimbang (Kesehatan, Komunikasi). Alat dan bahan: Kertas, pensil warna, contoh menu seimbang. Cara bermain: Anak-anak diminta membuat menu makanan seimbang untuk satu hari dengan menggambar atau menulis. Manfaat: Mengenalkan konsep gizi seimbang dan melatih kreativitas.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Exercise Games Untuk Anak (Kesehatan, Kemandirian). Alat dan Bahan : Bantal, Bola, Tongkat/bambu, Cara bermain Exercise Games: Menendang Batal dengan kedua kaki bergantian: Berbaringlah terlentang di lantai. Angkat kedua kaki ke udara. Bergantian menendang ke arah bantal yang sedang di pegangi yang ada di depan menggunakan kedua kaki. Usahakan untuk menjaga posisi tubuh tetap stabil dan terlentang selama bermain. Kegiatan 2: Ular Tangga Gizi (Kolaborasi, Penalaran Kritis). Alat dan Bahan: Papan ular tangga besar dengan gambar makanan sehat dan tidak sehat, dadu besar. Cara Bermain: Anak-anak bermain ular tangga, naik jika mendarat di gambar makanan sehat dan turun jika di makanan tidak sehat. Kegiatan 3: Detektif Gula (Kreativitas, Komunikasi). Alat dan bahan: Berbagai kemasan minuman, tabel kandungan gula. Cara bermain: Anak-anak menjadi detektif yang mencari informasi kandungan gula pada kemasan minuman dan membandingkannya. Manfaat: Meningkatkan kesadaran tentang kandungan gula dalam minuman.',
        activities: [
          {
            activityNumber: 1,
            title: 'Exercise Games Untuk Anak (Kesehatan, Kemandirian)',
            toolsAndMaterials: 'Bantal, Bola, Tongkat/bambu',
            howToPlay:
              'Exercise Games: Menendang Batal dengan kedua kaki bergantian: Berbaringlah terlentang di lantai. Angkat kedua kaki ke udara. Bergantian menendang ke arah bantal yang sedang di pegangi yang ada di depan menggunakan kedua kaki. Usahakan untuk menjaga posisi tubuh tetap stabil dan terlentang selama bermain.',
            fullDescription:
              'Kegiatan 1: Exercise Games Untuk Anak (Kesehatan, Kemandirian). Alat dan Bahan : Bantal, Bola, Tongkat/bambu, Cara bermain Exercise Games: Menendang Batal dengan kedua kaki bergantian: Berbaringlah terlentang di lantai. Angkat kedua kaki ke udara. Bergantian menendang ke arah bantal yang sedang di pegangi yang ada di depan menggunakan kedua kaki. Usahakan untuk menjaga posisi tubuh tetap stabil dan terlentang selama bermain.',
          },
          {
            activityNumber: 2,
            title: 'Ular Tangga Gizi (Kolaborasi, Penalaran Kritis)',
            toolsAndMaterials:
              'Papan ular tangga besar dengan gambar makanan sehat dan tidak sehat, dadu besar',
            howToPlay:
              'Anak-anak bermain ular tangga, naik jika mendarat di gambar makanan sehat dan turun jika di makanan tidak sehat.',
            fullDescription:
              'Kegiatan 2: Ular Tangga Gizi (Kolaborasi, Penalaran Kritis). Alat dan Bahan: Papan ular tangga besar dengan gambar makanan sehat dan tidak sehat, dadu besar. Cara Bermain: Anak-anak bermain ular tangga, naik jika mendarat di gambar makanan sehat dan turun jika di makanan tidak sehat.',
          },
          {
            activityNumber: 3,
            title: 'Detektif Gula (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Berbagai kemasan minuman, tabel kandungan gula',
            howToPlay:
              'Anak-anak menjadi detektif yang mencari informasi kandungan gula pada kemasan minuman dan membandingkannya. Manfaat: Meningkatkan kesadaran tentang kandungan gula dalam minuman.',
            fullDescription:
              'Kegiatan 3: Detektif Gula (Kreativitas, Komunikasi). Alat dan bahan: Berbagai kemasan minuman, tabel kandungan gula. Cara bermain: Anak-anak menjadi detektif yang mencari informasi kandungan gula pada kemasan minuman dan membandingkannya. Manfaat: Meningkatkan kesadaran tentang kandungan gula dalam minuman.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1: Menggiring dan Lari Membawa Bola Dengan Zig-zag (Kesehatan, Kemandirian). Alat dan Bahan, Ban roda Dapat ganti dengan hula hop atau meja atau benda lainnya), Bola ,Cara Membuat dan Memainkannya: Siapkan ban roda atau hula hop atau lainnya, lalu susun berbaris dengan rapi dengan di beri jarak antara satu dengan yang lainnya agar dapat di lewati. Kemudian mintalah anak untuk menggiring bola melewati di antara ban roda dengan jalan zig-zag. Jika sudah selesai bawa bola dan lari balik dengan melewati ban roda dengan zig-zag lagi, kegiatan ini di lakuan dua orang yang berhasil melewati pertama itu yang menang. Kegiatan 2: Membuat Boneka Wortel (Kreativitas, Keimanan dan Ketakwaan). Alat dan Bahan: Kaus kaki oranye, bahan isian, kancing untuk mata, benang hijau untuk daun. Cara Bermain: Anak-anak membuat boneka wortel dari kaus kaki, sambil berdiskusi tentang manfaat wortel untuk kesehatan. Kegiatan 3: Membuat Kebun Mini (Kewargaan, Kolaborasi). Alat dan bahan: Pot kecil, tanah, biji sayuran cepat tumbuh (bayam, kangkung), alat berkebun mini. Cara bermain: Anak-anak menanam sayuran di pot dan merawatnya hingga dapat dipanen dan dikonsumsi. Manfaat: Mengenalkan proses pertumbuhan makanan dan mendorong konsumsi sayuran.',
        activities: [
          {
            activityNumber: 1,
            title: 'Menggiring dan Lari Membawa Bola Dengan Zig-zag (Kesehatan, Kemandirian)',
            toolsAndMaterials:
              'Ban roda Dapat ganti dengan hula hop atau meja atau benda lainnya), Bola',
            howToPlay:
              'dan Memainkannya: Siapkan ban roda atau hula hop atau lainnya, lalu susun berbaris dengan rapi dengan di beri jarak antara satu dengan yang lainnya agar dapat di lewati. Kemudian mintalah anak untuk menggiring bola melewati di antara ban roda dengan jalan zig-zag. Jika sudah selesai bawa bola dan lari balik dengan melewati ban roda dengan zig-zag lagi, kegiatan ini di lakuan dua orang yang berhasil melewati pertama itu yang menang.',
            fullDescription:
              'Kegiatan 1: Menggiring dan Lari Membawa Bola Dengan Zig-zag (Kesehatan, Kemandirian). Alat dan Bahan, Ban roda Dapat ganti dengan hula hop atau meja atau benda lainnya), Bola ,Cara Membuat dan Memainkannya: Siapkan ban roda atau hula hop atau lainnya, lalu susun berbaris dengan rapi dengan di beri jarak antara satu dengan yang lainnya agar dapat di lewati. Kemudian mintalah anak untuk menggiring bola melewati di antara ban roda dengan jalan zig-zag. Jika sudah selesai bawa bola dan lari balik dengan melewati ban roda dengan zig-zag lagi, kegiatan ini di lakuan dua orang yang berhasil melewati pertama itu yang menang.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Boneka Wortel (Kreativitas, Keimanan dan Ketakwaan)',
            toolsAndMaterials:
              'Kaus kaki oranye, bahan isian, kancing untuk mata, benang hijau untuk daun',
            howToPlay:
              'Anak-anak membuat boneka wortel dari kaus kaki, sambil berdiskusi tentang manfaat wortel untuk kesehatan.',
            fullDescription:
              'Kegiatan 2: Membuat Boneka Wortel (Kreativitas, Keimanan dan Ketakwaan). Alat dan Bahan: Kaus kaki oranye, bahan isian, kancing untuk mata, benang hijau untuk daun. Cara Bermain: Anak-anak membuat boneka wortel dari kaus kaki, sambil berdiskusi tentang manfaat wortel untuk kesehatan.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Kebun Mini (Kewargaan, Kolaborasi)',
            toolsAndMaterials:
              'Pot kecil, tanah, biji sayuran cepat tumbuh (bayam, kangkung), alat berkebun mini',
            howToPlay:
              'Anak-anak menanam sayuran di pot dan merawatnya hingga dapat dipanen dan dikonsumsi. Manfaat: Mengenalkan proses pertumbuhan makanan dan mendorong konsumsi sayuran.',
            fullDescription:
              'Kegiatan 3: Membuat Kebun Mini (Kewargaan, Kolaborasi). Alat dan bahan: Pot kecil, tanah, biji sayuran cepat tumbuh (bayam, kangkung), alat berkebun mini. Cara bermain: Anak-anak menanam sayuran di pot dan merawatnya hingga dapat dipanen dan dikonsumsi. Manfaat: Mengenalkan proses pertumbuhan makanan dan mendorong konsumsi sayuran.',
          },
        ],
      },
    ],
    closingActivities: [
      'Anak berteriak HOREE! sambil mengangkat hasil karya ke atas bersama-sama',
      'Bermain tepuk tangan Tepuk Makanan Sehat dengan tempo cepat dan riang',
      'Menari bersama lagu Aku Anak Sehat sambil menirukan gerakan makan sayur dan buah',
      'Saling memberikan high five dan pelukan apresiasi untuk pencapaian hari ini',
      'Bermain tebak-tebakan cepat tentang makanan dengan hadiah stiker atau pujian',
      'Bernyanyi keras-keras lagu penutup favorit sambil bertepuk tangan meriah',
      'Melakukan yel-yel semangat Besok kita main lagi, YEY YEY YEY!',
      'Parade keliling kelas sambil membawa hasil karya dan bersorak gembira',
      'Doa penutup dengan suara lantang dan salam perpisahan penuh semangat',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan minimal 3 jenis makanan sehat dan menjelaskan manfaatnya dengan bahasa sederhana',
      },
      {
        no: 2,
        indicator:
          'Anak mampu mengelompokkan makanan berdasarkan kandungan gizi (karbohidrat, protein, vitamin) melalui kegiatan piramida makanan',
      },
      {
        no: 3,
        indicator:
          'Anak menunjukkan sikap syukur dengan berdoa sebelum dan sesudah makan secara spontan dan khusyuk',
      },
      {
        no: 4,
        indicator:
          'Anak dapat menggunakan alat makan (sendok, garpu, menuang air) dengan koordinasi yang baik dan mandiri',
      },
      {
        no: 5,
        indicator:
          'Anak bersedia berbagi makanan atau alat bermain dengan teman yang membutuhkan tanpa diminta',
      },
      {
        no: 6,
        indicator:
          'Anak mampu berperan sebagai koki, pelayan, atau pembeli dalam permainan restoran sehat dengan antusias',
      },
      {
        no: 7,
        indicator:
          'Anak menunjukkan kreativitas dalam membuat menu makanan sehat, gado-gado kertas, atau boneka wortel',
      },
      {
        no: 8,
        indicator:
          'Anak dapat bekerjasama dalam kegiatan kelompok seperti eksperimen warna makanan atau ular tangga gizi',
      },
      {
        no: 9,
        indicator:
          'Anak mampu menjelaskan minimal 2 manfaat minum air putih untuk tubuh berdasarkan eksperimen yang dilakukan',
      },
      {
        no: 10,
        indicator:
          'Anak menunjukkan kemandirian dalam memilih makanan sehat dari berbagai pilihan yang disediakan',
      },
      {
        no: 11,
        indicator:
          'Anak dapat mengomunikasikan pengalaman bermain dan hasil karyanya dengan kalimat yang jelas dan antusias',
      },
      {
        no: 12,
        indicator:
          'Anak mendemonstrasikan perilaku hidup sehat seperti mencuci tangan, menjaga kebersihan makanan, dan merawat tanaman',
      },
    ],
    assessmentSteps: {
      initial: [
        'Lakukan tanya jawab santai saat anak tiba di kelas tentang sarapan yang dimakan',
        'Sediakan berbagai gambar makanan dan minta anak memilih yang menurutnya sehat',
        'Amati cara anak memegang dan menggunakan sendok/garpu saat snack time',
        'Catat respon anak ketika ditunjukkan video/cerita tentang makanan sehat',
        'Dokumentasikan ekspresi dan komentar spontan anak tentang makanan favorit',
        'Observasi kemampuan anak menyebutkan anggota keluarga yang memasak di rumah',
        'Perhatikan sikap anak saat berdoa sebelum makan (khusyuk, ikut serta, atau belum)',
        'Rekam kemampuan komunikasi anak dalam menceritakan pengalaman makan di rumah',
      ],
      process: [
        'Ambil foto setiap tahap kegiatan anak dari memahami hingga merefleksi pembelajaran',
        'Catat dalam anekdot perilaku unik atau breakthrough moment selama bermain',
        'Amati dan dokumentasikan hasil karya anak seperti gambar menu, kreasi gado-gado kertas',
        'Observasi interaksi sosial anak saat bermain peran restoran atau berbagi dalam kelompok',
        'Rekam percakapan anak saat menjelaskan pilihannya dalam eksperimen makanan',
        'Pantau perkembangan motorik halus saat anak menggunting, menempel, atau menuang air',
        'Catat kemampuan anak mengikuti instruksi multi-step dalam kegiatan memasak simulasi',
        'Dokumentasikan momen anak menunjukkan empati atau kepedulian kepada teman',
        'Amati tingkat antusiasme dan partisipasi anak dalam setiap variasi kegiatan',
        'Observasi kemampuan anak mengelompokkan makanan berdasarkan kriteria yang diberikan',
      ],
      final: [
        'Minta anak mendemonstrasikan cara memilih makanan sehat dari berbagai pilihan nyata',
        'Lakukan wawancara sederhana tentang 3 hal baru yang dipelajari anak tentang makanan',
        'Amati anak saat menceritakan kembali kegiatan favorit dengan detail dan antusiasme',
        'Dokumentasikan kemampuan anak membuat menu seimbang secara mandiri',
        'Observasi perilaku anak saat makan bersama (mandiri, bersih, berbagi)',
        'Catat kemampuan anak menjelaskan manfaat makanan dengan bahasa sendiri',
        'Minta anak menunjukkan gerakan atau lagu yang dipelajari terkait makanan sehat',
        'Amati sikap syukur dan doa yang dilakukan anak secara spontan',
        'Dokumentasikan rencana anak untuk menerapkan pembelajaran di rumah',
        'Lakukan refleksi bersama dengan bertanya Apa yang paling menyenangkan? dan Apa yang ingin dicoba lagi?',
        'Amati perubahan sikap anak terhadap makanan sehat dibanding hari pertama',
      ],
    },
  },
  {
    weekNum: 14,
    filename: '50_TK_B_Smt1_14_Pakaian.docx',
    title: 'AKU BISA BERPAKAIAN DAN BERSEPATU SENDIRI',
    topic: 'KEBUTUHANKU',
    subtopic: 'PAKAIAN',
    modelPembelajaran: 'Kolaboratif, STEAM',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'November 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: true,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: true,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak kelompok B (5-6 tahun) memiliki kemampuan fisik motorik yang berkembang pesat, rasa ingin tahu tinggi tentang lingkungan sekitar, dan mulai memahami konsep identitas diri. Mereka senang bereksplorasi dengan berbagai benda, mampu mengikuti instruksi sederhana, dan mulai menunjukkan kemandirian dalam aktivitas sehari-hari. Anak-anak pada usia ini juga mulai memahami perbedaan dan keunikan diri serta lingkungan sosialnya.',
      learningMaterial:
        'Materi pakaian mencakup pengetahuan tentang jenis-jenis pakaian, fungsi pakaian sesuai situasi dan cuaca, keterampilan berpakaian mandiri, serta pemahaman tentang keberagaman budaya melalui pakaian tradisional. Materi ini relevan dengan kehidupan sehari-hari anak, mengembangkan keterampilan hidup praktis, dan membangun kesadaran akan identitas diri dan budaya. Tingkat kesulitan disesuaikan dengan kemampuan motorik halus dan kognitif anak usia 5-6 tahun.',
    },
    learningDesign: {
      cp: 'CP Jati Diri: Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budaya CP Jati Diri: Murid memiliki fungsi gerak (motorik kasar, halus, dan taktil) untuk merawat dirinya, membangun kemandirian dan berkegiatan',
      crossDisciplinary:
        'Nilai agama dan moral (menghargai ciptaan Tuhan melalui pakaian), Nilai Pancasila (menghormati keberagaman budaya pakaian), Fisik motorik (keterampilan memakai dan melepas pakaian), Kognitif (mengklasifikasi jenis dan fungsi pakaian), Bahasa (menceritakan pengalaman berpakaian), Sosial emosional (kepercayaan diri dalam berpakaian dan menghargai perbedaan).',
      tp: 'Anak mampu mengidentifikasi dan menjelaskan fungsi pakaian sesuai dengan kebutuhan, karakteristik gender, agama, dan sosial budaya, serta mendemonstrasikan keterampilan berpakaian yang lebih kompleks dengan percaya diri.',
      pedagogicalPractice:
        'Pembelajaran dilaksanakan melalui bermain peran, eksplorasi langsung, bercerita interaktif, dan bernyanyi. Pendekatan ini mendukung prinsip berkesadaran dengan melibatkan anak secara aktif, bermakna melalui pengalaman nyata berpakaian, dan menggembirakan dengan aktivitas yang menyenangkan dan sesuai minat anak.',
      partnership:
        'Melibatkan orang tua dalam berbagi pengalaman pakaian tradisional keluarga, kerja sama dengan teman sebaya dalam aktivitas bermain peran, dan kolaborasi guru dalam mendukung pembelajaran yang holistik.',
      environment:
        'Pembelajaran mengintegrasikan ruang kelas yang fleksibel untuk aktivitas bermain peran, area praktek berpakaian, dan ruang virtual untuk berbagi pengalaman. Budaya belajar yang mendukung kreativitas, kemandirian, dan saling menghargai keunikan masing-anak.',
      digitalUtilization:
        'Penggunaan video pembelajaran interaktif dan buku cerita digital untuk memperkenalkan jenis-jenis pakaian dan cara berpakaian yang baik. Pemanfaatan media audio untuk lagu-lagu tematik tentang pakaian yang mendukung pembelajaran melalui music and movement. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka untuk memulai hari dengan kesadaran spiritual',
      'Apersepsi tentang pakaian yang dikenakan hari ini',
      'Menyanyikan lagu Pakaianku untuk menciptakan suasana gembira',
      'Diskusi tentang kegiatan yang akan dilakukan',
      'Menyiapkan aturan bermain dan kesepakatan kelas',
      'Bercerita tentang Memakai Baju dan Sepatu Sendiri',
    ],
    openingQuestions: [
      'Apa yang kamu rasakan ketika memakai baju favoritmu? (Kesehatan dan kemandirian)',
      'Mengapa kita perlu berterima kasih kepada Tuhan untuk pakaian yang kita miliki? (Keimanan dan ketakwaan)',
      'Bagaimana perasaanmu ketika melihat teman memakai pakaian yang berbeda? (Kewargaan dan komunikasi)',
      'Apa yang terjadi jika kita tidak memakai pakaian sesuai cuaca? (Penalaran kritis)',
      'Bagaimana cara membuat pakaian menjadi lebih indah? (Kreativitas)',
      'Siapa yang biasanya membantu kamu memilih pakaian? (Kolaborasi)',
      'Apa yang kamu lakukan jika bisa memakai baju sendiri? (Kemandirian)',
      'Bagaimana cara merawat pakaian agar tetap bersih? (Kesehatan)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Science, Air Selalu Mendatar (Penalaran Kritis). Alat dan Bahan, 3 botol ( 2 botol dengan ukuran yang sama, dan 1 tutup botol dengan ukuran yang lebih kecil), Selang, Air, Lem, Gunting, Cara Membuat dan Memainkannya: Siapkan botol yang akan di gunakanLubangi salah satu botol dengan ke dua sisi (bagian kanan dan kiri), dan 2 botol lainnya hanya satu sisi saja (seperti pada gambar). Masukkan selang ke dalam lubang, sehingga saling terhubung, lalu rekatkan dengan lem pada bagian sisi-sisi lubang agar tidak bocor, tunggu hingga kering. Beri tumpuan pada bagian bawah botol yang memiliki ukuran kecil (dapat menggunakan kardus, kayu atau lainnya), sehingga memiliki tinggi yang sama dengan kedua botol. Kemudian masukkan air. Ajak- anak-anak untuk memperhatikan apa yang terjadi ketika air, ketika di tuangkan ke dalam botol. Tutup botol pada bagian Tengah, dan biarkan ke dua botol pada bagian kanan dan kiri terbuka, lalu isi salah satu botol yang tidak tertutup, maka air perlahan akan mengisi pada bagian botol yang berada di tengah dan sampingnya, serta botol yang langsung di isi dengan air akan semakin penuh hingga tumpah. Tetapi ketika tutup botol di buka, maka ketiga botol tersebut akan memiliki ukuran air yang sama. Mintalah anak-anak untuk mencoba melakukan percobaan lainnya, misal dengan menutup salah satu tutup botol pada bagian samping dan mengisi ke dua tutup botol yang berada di tengah dan sampingnya, dan meminta membuka tutup botol yang tertutup, apa yang terjadi dengan airnya. Bisa juga ketiga-tiganya di buka dan di isi dengan air pada salah satu botol apa yang terjadi, atau biarkan anak-anak bereksperimen dengan menuangkan air ke dalam tutup botol yang mereka buat. Keterangan : Untuk membuat eksperimen ini, dapat membuat tutup botol seperti pada gambar pertama (yang lebih mudah dan simpel) atau yang kedua yang di isi dengan air biru. Atau dapat disesuaikan. Kegiatan 2: Fashion Show Budaya (Kewargaan, Komunikasi). Alat dan Bahan: Pakaian adat dari berbagai daerah (bisa menggunakan replika atau gambar) Cara Bermain: Anak-anak memilih pakaian adat dan melakukan fashion show, sambil menjelaskan asal dan keunikan pakaian tersebut Kegiatan 3: Permainan Memori Pakaian (Penalaran Kritis). Alat dan bahan: Kartu bergambar berbagai jenis pakaian (berpasangan). Cara bermain: Letakkan kartu tertutup, anak-anak bergantian membuka dua kartu untuk menemukan pasangannya. Manfaat: Melatih memori dan pengenalan jenis pakaian.',
        activities: [
          {
            activityNumber: 1,
            title: 'Science, Air Selalu Mendatar (Penalaran Kritis)',
            toolsAndMaterials:
              '3 botol ( 2 botol dengan ukuran yang sama, dan 1 tutup botol dengan ukuran yang lebih kecil), Selang, Air, Lem, Gunting',
            howToPlay:
              'dan Memainkannya: Siapkan botol yang akan di gunakanLubangi salah satu botol dengan ke dua sisi (bagian kanan dan kiri), dan 2 botol lainnya hanya satu sisi saja (seperti pada gambar). Masukkan selang ke dalam lubang, sehingga saling terhubung, lalu rekatkan dengan lem pada bagian sisi-sisi lubang agar tidak bocor, tunggu hingga kering. Beri tumpuan pada bagian bawah botol yang memiliki ukuran kecil (dapat menggunakan kardus, kayu atau lainnya), sehingga memiliki tinggi yang sama dengan kedua botol. Kemudian masukkan air. Ajak- anak-anak untuk memperhatikan apa yang terjadi ketika air, ketika di tuangkan ke dalam botol. Tutup botol pada bagian Tengah, dan biarkan ke dua botol pada bagian kanan dan kiri terbuka, lalu isi salah satu botol yang tidak tertutup, maka air perlahan akan mengisi pada bagian botol yang berada di tengah dan sampingnya, serta botol yang langsung di isi dengan air akan semakin penuh hingga tumpah. Tetapi ketika tutup botol di buka, maka ketiga botol tersebut akan memiliki ukuran air yang sama. Mintalah anak-anak untuk mencoba melakukan percobaan lainnya, misal dengan menutup salah satu tutup botol pada bagian samping dan mengisi ke dua tutup botol yang berada di tengah dan sampingnya, dan meminta membuka tutup botol yang tertutup, apa yang terjadi dengan airnya. Bisa juga ketiga-tiganya di buka dan di isi dengan air pada salah satu botol apa yang terjadi, atau biarkan anak-anak bereksperimen dengan menuangkan air ke dalam tutup botol yang mereka buat. Keterangan : Untuk membuat eksperimen ini, dapat membuat tutup botol seperti pada gambar pertama (yang lebih mudah dan simpel) atau yang kedua yang di isi dengan air biru. Atau dapat disesuaikan.',
            fullDescription:
              'Kegiatan 1: Science, Air Selalu Mendatar (Penalaran Kritis). Alat dan Bahan, 3 botol ( 2 botol dengan ukuran yang sama, dan 1 tutup botol dengan ukuran yang lebih kecil), Selang, Air, Lem, Gunting, Cara Membuat dan Memainkannya: Siapkan botol yang akan di gunakanLubangi salah satu botol dengan ke dua sisi (bagian kanan dan kiri), dan 2 botol lainnya hanya satu sisi saja (seperti pada gambar). Masukkan selang ke dalam lubang, sehingga saling terhubung, lalu rekatkan dengan lem pada bagian sisi-sisi lubang agar tidak bocor, tunggu hingga kering. Beri tumpuan pada bagian bawah botol yang memiliki ukuran kecil (dapat menggunakan kardus, kayu atau lainnya), sehingga memiliki tinggi yang sama dengan kedua botol. Kemudian masukkan air. Ajak- anak-anak untuk memperhatikan apa yang terjadi ketika air, ketika di tuangkan ke dalam botol. Tutup botol pada bagian Tengah, dan biarkan ke dua botol pada bagian kanan dan kiri terbuka, lalu isi salah satu botol yang tidak tertutup, maka air perlahan akan mengisi pada bagian botol yang berada di tengah dan sampingnya, serta botol yang langsung di isi dengan air akan semakin penuh hingga tumpah. Tetapi ketika tutup botol di buka, maka ketiga botol tersebut akan memiliki ukuran air yang sama. Mintalah anak-anak untuk mencoba melakukan percobaan lainnya, misal dengan menutup salah satu tutup botol pada bagian samping dan mengisi ke dua tutup botol yang berada di tengah dan sampingnya, dan meminta membuka tutup botol yang tertutup, apa yang terjadi dengan airnya. Bisa juga ketiga-tiganya di buka dan di isi dengan air pada salah satu botol apa yang terjadi, atau biarkan anak-anak bereksperimen dengan menuangkan air ke dalam tutup botol yang mereka buat. Keterangan : Untuk membuat eksperimen ini, dapat membuat tutup botol seperti pada gambar pertama (yang lebih mudah dan simpel) atau yang kedua yang di isi dengan air biru. Atau dapat disesuaikan.',
          },
          {
            activityNumber: 2,
            title: 'Fashion Show Budaya (Kewargaan, Komunikasi)',
            toolsAndMaterials:
              'Pakaian adat dari berbagai daerah (bisa menggunakan replika atau gambar)',
            howToPlay:
              'Anak-anak memilih pakaian adat dan melakukan fashion show, sambil menjelaskan asal dan keunikan pakaian tersebut',
            fullDescription:
              'Kegiatan 2: Fashion Show Budaya (Kewargaan, Komunikasi). Alat dan Bahan: Pakaian adat dari berbagai daerah (bisa menggunakan replika atau gambar) Cara Bermain: Anak-anak memilih pakaian adat dan melakukan fashion show, sambil menjelaskan asal dan keunikan pakaian tersebut',
          },
          {
            activityNumber: 3,
            title: 'Permainan Memori Pakaian (Penalaran Kritis)',
            toolsAndMaterials: 'Kartu bergambar berbagai jenis pakaian (berpasangan)',
            howToPlay:
              'Letakkan kartu tertutup, anak-anak bergantian membuka dua kartu untuk menemukan pasangannya. Manfaat: Melatih memori dan pengenalan jenis pakaian.',
            fullDescription:
              'Kegiatan 3: Permainan Memori Pakaian (Penalaran Kritis). Alat dan bahan: Kartu bergambar berbagai jenis pakaian (berpasangan). Cara bermain: Letakkan kartu tertutup, anak-anak bergantian membuka dua kartu untuk menemukan pasangannya. Manfaat: Melatih memori dan pengenalan jenis pakaian.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Lompat Zig-zag, Berjalan Dengan Hula hop & Menghindar Dari rintangan (Kesehatan, Kemandirian). Alat dan Bahan: Cone mangkuk/corong / benda lainnya, Trafic cone/ bambu atau kursi, Hula hop, Botol yang di gantungkan. Cara Membuat dan Memainkannya: Siapkan cone mangkuk atau benda lainnya atau dapat di ganti dengan kapur lalu buat garis untuk penanda. Kemudian tata traffin cone atau bambu atau kursi dengan di beri jarak selang seling, lalu ajak anak-anak untuk memakai goni atau kantong kemudian anak-anak harus lompat dengan zig-zag menggunakan goni untuk melewati tantangan pertama mereka. Untuk tantangan kedua anak-anak harus berjalan dengan hula hop, dengan cara berdiri di atas hula hop kemudian tangan satunya memindahkan hula hop, dan berpindah pada hula hop yang sudah di pindahkan kemudian lakukan hal yang sama sehingga berhasil melewati tantangan ke dua lanjut pada tantangan ketiga. Pada tantangan ketiga anak-anak harus melewati botol yang di gantung dengan di goyang-goyangkan, ketentuannya anak-anak harus dapat menghindari botol agar tidak mengenai mereka saat melewatinya. Jika tantangan ketiga dapat di selesaikan. Guru dapat memberikan permainan misalkan tebak huruf, angka atau kegiatan lainnya sesuai tema. Kegiatan 2: Desainer Cilik (Kreativitas, Komunikasi). Alat dan Bahan: Kertas gambar, pensil warna, majalah fashion bekas Cara Bermain: Anak-anak mendesain pakaian impian mereka, lalu menjelaskan fungsi dan alasan pemilihan desain tersebut. Kegiatan 3: Puzzle Pakaian Tradisional (Kewargaan, Penalaran Kritis). Alat dan bahan: Puzzle bergambar pakaian tradisional dari berbagai daerah. Cara bermain: Anak-anak menyusun puzzle dan berdiskusi tentang pakaian tradisional yang ditampilkan. Manfaat: Mengenalkan keberagaman budaya melalui pakaian tradisional.',
        activities: [
          {
            activityNumber: 1,
            title:
              'Lompat Zig-zag, Berjalan Dengan Hula hop & Menghindar Dari rintangan (Kesehatan, Kemandirian)',
            toolsAndMaterials:
              'Cone mangkuk/corong / benda lainnya, Trafic cone/ bambu atau kursi, Hula hop, Botol yang di gantungkan',
            howToPlay:
              'dan Memainkannya: Siapkan cone mangkuk atau benda lainnya atau dapat di ganti dengan kapur lalu buat garis untuk penanda. Kemudian tata traffin cone atau bambu atau kursi dengan di beri jarak selang seling, lalu ajak anak-anak untuk memakai goni atau kantong kemudian anak-anak harus lompat dengan zig-zag menggunakan goni untuk melewati tantangan pertama mereka. Untuk tantangan kedua anak-anak harus berjalan dengan hula hop, dengan cara berdiri di atas hula hop kemudian tangan satunya memindahkan hula hop, dan berpindah pada hula hop yang sudah di pindahkan kemudian lakukan hal yang sama sehingga berhasil melewati tantangan ke dua lanjut pada tantangan ketiga. Pada tantangan ketiga anak-anak harus melewati botol yang di gantung dengan di goyang-goyangkan, ketentuannya anak-anak harus dapat menghindari botol agar tidak mengenai mereka saat melewatinya. Jika tantangan ketiga dapat di selesaikan. Guru dapat memberikan permainan misalkan tebak huruf, angka atau kegiatan lainnya sesuai tema.',
            fullDescription:
              'Kegiatan 1: Lompat Zig-zag, Berjalan Dengan Hula hop & Menghindar Dari rintangan (Kesehatan, Kemandirian). Alat dan Bahan: Cone mangkuk/corong / benda lainnya, Trafic cone/ bambu atau kursi, Hula hop, Botol yang di gantungkan. Cara Membuat dan Memainkannya: Siapkan cone mangkuk atau benda lainnya atau dapat di ganti dengan kapur lalu buat garis untuk penanda. Kemudian tata traffin cone atau bambu atau kursi dengan di beri jarak selang seling, lalu ajak anak-anak untuk memakai goni atau kantong kemudian anak-anak harus lompat dengan zig-zag menggunakan goni untuk melewati tantangan pertama mereka. Untuk tantangan kedua anak-anak harus berjalan dengan hula hop, dengan cara berdiri di atas hula hop kemudian tangan satunya memindahkan hula hop, dan berpindah pada hula hop yang sudah di pindahkan kemudian lakukan hal yang sama sehingga berhasil melewati tantangan ke dua lanjut pada tantangan ketiga. Pada tantangan ketiga anak-anak harus melewati botol yang di gantung dengan di goyang-goyangkan, ketentuannya anak-anak harus dapat menghindari botol agar tidak mengenai mereka saat melewatinya. Jika tantangan ketiga dapat di selesaikan. Guru dapat memberikan permainan misalkan tebak huruf, angka atau kegiatan lainnya sesuai tema.',
          },
          {
            activityNumber: 2,
            title: 'Desainer Cilik (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Kertas gambar, pensil warna, majalah fashion bekas',
            howToPlay:
              'Anak-anak mendesain pakaian impian mereka, lalu menjelaskan fungsi dan alasan pemilihan desain tersebut.',
            fullDescription:
              'Kegiatan 2: Desainer Cilik (Kreativitas, Komunikasi). Alat dan Bahan: Kertas gambar, pensil warna, majalah fashion bekas Cara Bermain: Anak-anak mendesain pakaian impian mereka, lalu menjelaskan fungsi dan alasan pemilihan desain tersebut.',
          },
          {
            activityNumber: 3,
            title: 'Puzzle Pakaian Tradisional (Kewargaan, Penalaran Kritis)',
            toolsAndMaterials: 'Puzzle bergambar pakaian tradisional dari berbagai daerah',
            howToPlay:
              'Anak-anak menyusun puzzle dan berdiskusi tentang pakaian tradisional yang ditampilkan. Manfaat: Mengenalkan keberagaman budaya melalui pakaian tradisional.',
            fullDescription:
              'Kegiatan 3: Puzzle Pakaian Tradisional (Kewargaan, Penalaran Kritis). Alat dan bahan: Puzzle bergambar pakaian tradisional dari berbagai daerah. Cara bermain: Anak-anak menyusun puzzle dan berdiskusi tentang pakaian tradisional yang ditampilkan. Manfaat: Mengenalkan keberagaman budaya melalui pakaian tradisional.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Cocokan Dan Tempel (Kreativitas, Kemandirian). Alat dan Bahan :, Krayon/spidol, Kerta HVS, Kertas Origami, Lem, Gunting, Cara Membuat dan Memainkannya: Pertama, siapkan kertas HVS kemudian buat gambar lingkaran, batang dan daun (gambar bunga) menggunakan krayon. Selanjutnya siapkan kertas origami lalu potong-potong menjadi bentuk persegi panjang dan gambar bentuk titik-titik sesuai angka yang ada pada gambar lingkaran bunga. Selanjutnya mintalah anak-anak untuk menempel kertas origami yang memiliki titik-titik sesuai angka yang ada pada gambar. Kegiatan 2 : Puzzle Pakaian (Penalaran Kritis). Alat dan Bahan: Puzzle bergambar berbagai jenis pakaian dan fungsinya Cara Bermain: Anak-anak menyusun puzzle dan menjelaskan fungsi pakaian yang tergambar. Kegiatan 3: Membuat Gantungan Baju Hias (Kreativitas, Kesehatan). Alat dan bahan: Gantungan baju kayu, cat, kuas, hiasan (pita, kancing). Cara bermain: Anak-anak menghias gantungan baju sesuai kreativitas mereka. Manfaat: Mengembangkan kreativitas dan mengenalkan pentingnya menjaga kerapian pakaian.',
        activities: [
          {
            activityNumber: 1,
            title: 'Cocokan Dan Tempel (Kreativitas, Kemandirian)',
            toolsAndMaterials: ', Krayon/spidol, Kerta HVS, Kertas Origami, Lem, Gunting',
            howToPlay:
              'dan Memainkannya: Pertama, siapkan kertas HVS kemudian buat gambar lingkaran, batang dan daun (gambar bunga) menggunakan krayon. Selanjutnya siapkan kertas origami lalu potong-potong menjadi bentuk persegi panjang dan gambar bentuk titik-titik sesuai angka yang ada pada gambar lingkaran bunga. Selanjutnya mintalah anak-anak untuk menempel kertas origami yang memiliki titik-titik sesuai angka yang ada pada gambar.',
            fullDescription:
              'Kegiatan 1: Cocokan Dan Tempel (Kreativitas, Kemandirian). Alat dan Bahan :, Krayon/spidol, Kerta HVS, Kertas Origami, Lem, Gunting, Cara Membuat dan Memainkannya: Pertama, siapkan kertas HVS kemudian buat gambar lingkaran, batang dan daun (gambar bunga) menggunakan krayon. Selanjutnya siapkan kertas origami lalu potong-potong menjadi bentuk persegi panjang dan gambar bentuk titik-titik sesuai angka yang ada pada gambar lingkaran bunga. Selanjutnya mintalah anak-anak untuk menempel kertas origami yang memiliki titik-titik sesuai angka yang ada pada gambar.',
          },
          {
            activityNumber: 2,
            title: 'Puzzle Pakaian (Penalaran Kritis)',
            toolsAndMaterials: 'Puzzle bergambar berbagai jenis pakaian dan fungsinya',
            howToPlay: 'Anak-anak menyusun puzzle dan menjelaskan fungsi pakaian yang tergambar.',
            fullDescription:
              'Kegiatan 2: Puzzle Pakaian (Penalaran Kritis). Alat dan Bahan: Puzzle bergambar berbagai jenis pakaian dan fungsinya Cara Bermain: Anak-anak menyusun puzzle dan menjelaskan fungsi pakaian yang tergambar.',
          },
          {
            activityNumber: 3,
            title: 'Membuat Gantungan Baju Hias (Kreativitas, Kesehatan)',
            toolsAndMaterials: 'Gantungan baju kayu, cat, kuas, hiasan (pita, kancing)',
            howToPlay:
              'Anak-anak menghias gantungan baju sesuai kreativitas mereka. Manfaat: Mengembangkan kreativitas dan mengenalkan pentingnya menjaga kerapian pakaian.',
            fullDescription:
              'Kegiatan 3: Membuat Gantungan Baju Hias (Kreativitas, Kesehatan). Alat dan bahan: Gantungan baju kayu, cat, kuas, hiasan (pita, kancing). Cara bermain: Anak-anak menghias gantungan baju sesuai kreativitas mereka. Manfaat: Mengembangkan kreativitas dan mengenalkan pentingnya menjaga kerapian pakaian.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1: Bowling Angka (Penalaran Kritis, Kolaborasi). Alat dan Bahan :, Botol, Kertas origami, Spidol, Pasir, Lem, Nampan atau baki, Bola, Cara Membuat dan MemainkannyaSiapkan tutup botol bekas, kemudian isi botol dengan pasir untuk pemberat. Rekatkan kertas origami pada tutup botol, lalu tulis angka pada kertas origami yang di rekatkan pada tutup botol. Ajak anak-anak untuk berbaris, dan bergantian menggelindingkan bola agar mengenai tutup botol. Mintalah anak-anak untuk menuliskan angka yang berhasil di jatuhkan pada pasir yang terletak pada nampan atau baki menggunakan jari telunjuk Kegiatan 2: Bermain Peran Toko Pakaian (Komunikasi, Kolaborasi). Alat dan Bahan: Berbagai jenis pakaian, aksesori, uang mainan Cara Bermain: Anak-anak bermain peran sebagai penjual dan pembeli di toko pakaian, memilih pakaian sesuai kebutuhan. Kegiatan 3: Drama Sehari dalam Pakaianku (Kemandirian, Komunikasi). Alat dan bahan: Berbagai jenis pakaian untuk situasi berbeda (piyama, seragam sekolah, baju bermain). Cara bermain: Anak-anak memerankan kegiatan sehari-hari, mengganti pakaian sesuai situasi. Manfaat: Melatih pemahaman tentang kesesuaian pakaian dengan aktivitas dan waktu.',
        activities: [
          {
            activityNumber: 1,
            title: 'Bowling Angka (Penalaran Kritis, Kolaborasi)',
            toolsAndMaterials:
              ', Botol, Kertas origami, Spidol, Pasir, Lem, Nampan atau baki, Bola',
            howToPlay:
              'dan MemainkannyaSiapkan tutup botol bekas, kemudian isi botol dengan pasir untuk pemberat. Rekatkan kertas origami pada tutup botol, lalu tulis angka pada kertas origami yang di rekatkan pada tutup botol. Ajak anak-anak untuk berbaris, dan bergantian menggelindingkan bola agar mengenai tutup botol. Mintalah anak-anak untuk menuliskan angka yang berhasil di jatuhkan pada pasir yang terletak pada nampan atau baki menggunakan jari telunjuk',
            fullDescription:
              'Kegiatan 1: Bowling Angka (Penalaran Kritis, Kolaborasi). Alat dan Bahan :, Botol, Kertas origami, Spidol, Pasir, Lem, Nampan atau baki, Bola, Cara Membuat dan MemainkannyaSiapkan tutup botol bekas, kemudian isi botol dengan pasir untuk pemberat. Rekatkan kertas origami pada tutup botol, lalu tulis angka pada kertas origami yang di rekatkan pada tutup botol. Ajak anak-anak untuk berbaris, dan bergantian menggelindingkan bola agar mengenai tutup botol. Mintalah anak-anak untuk menuliskan angka yang berhasil di jatuhkan pada pasir yang terletak pada nampan atau baki menggunakan jari telunjuk',
          },
          {
            activityNumber: 2,
            title: 'Bermain Peran Toko Pakaian (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Berbagai jenis pakaian, aksesori, uang mainan',
            howToPlay:
              'Anak-anak bermain peran sebagai penjual dan pembeli di toko pakaian, memilih pakaian sesuai kebutuhan.',
            fullDescription:
              'Kegiatan 2: Bermain Peran Toko Pakaian (Komunikasi, Kolaborasi). Alat dan Bahan: Berbagai jenis pakaian, aksesori, uang mainan Cara Bermain: Anak-anak bermain peran sebagai penjual dan pembeli di toko pakaian, memilih pakaian sesuai kebutuhan.',
          },
          {
            activityNumber: 3,
            title: 'Drama Sehari dalam Pakaianku (Kemandirian, Komunikasi)',
            toolsAndMaterials:
              'Berbagai jenis pakaian untuk situasi berbeda (piyama, seragam sekolah, baju bermain)',
            howToPlay:
              'Anak-anak memerankan kegiatan sehari-hari, mengganti pakaian sesuai situasi. Manfaat: Melatih pemahaman tentang kesesuaian pakaian dengan aktivitas dan waktu.',
            fullDescription:
              'Kegiatan 3: Drama Sehari dalam Pakaianku (Kemandirian, Komunikasi). Alat dan bahan: Berbagai jenis pakaian untuk situasi berbeda (piyama, seragam sekolah, baju bermain). Cara bermain: Anak-anak memerankan kegiatan sehari-hari, mengganti pakaian sesuai situasi. Manfaat: Melatih pemahaman tentang kesesuaian pakaian dengan aktivitas dan waktu.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1: Pencarian Kata (Penalaran Kritis, Komunikasi). Alat dan Bahan :, Kertas karton, Spidol, Selotip, Cara membuat dan memainkannyaTentukan tema atau topik yang sesuai dengan tema misalnya: hewan, buah-buahan, warna, benda-benda di sekitar rumah, atau kata-kata yang sering di ucapkan anak-anak. Buat kisi-kisi dapat berupa gambar yang terkait dengan tema yang telah dipilih. Kisi-kisi ini akan menjadi acuan untuk membuat teka-teki pencarian kata, tujuannya agar anak-anak dapat lebih mudah menemukan atau mencari kata-kata tersebut. Letakkan kata-kata secara horizontal, vertikal, atau diagonal di atas karton dengan menuliskan huruf-hurufnya. Pastikan kata-kata tidak saling bertabrakan atau bersilangan secara tidak sengaja. Isi ruang kosong dalam teka-teki pencarian kata dengan huruf-huruf acak. Pastikan huruf-huruf tersebut tidak mengganggu atau mengaburkan kata-kata yang ada. Sediakan petunjuk atau berupa gambart untuk masing-masing kata dalam teka-teki pencarian kata Petunjuk ini akan membantu anak-anak dalam mencari dan mengidentifikasi kata-kata yang tersembunyi. Pastikan teka-teki pencarian kata telah terisi dengan benar dan tidak ada kesalahan pengetikan atau pengaturan huruf. Jika memungkinkan, sebaiknya cobalah menyelesaikan teka-teki pencarian kata sendiri untuk memastikan keakuratan dan kejelasan teka-teki. Kegiatan 2: Lipat dan Rapikan (Kemandirian, Kesehatan). Alat dan Bahan: Berbagai jenis pakaian sederhana Cara Bermain: Anak-anak belajar melipat berbagai jenis pakaian dengan rapi dan menyusunnya dalam lemari mainan. Kegiatan 3: Menjahit Palsu (Kreativitas, Kemandirian). Alat dan Bahan: Potongan kain kecil, jarum jahit yang aman untuk anak-anak, dan benang tebal warna-warni. Cara Bermain: Anak-anak mencoba menjahit potongan kain sesuai dengan desain sederhana yang telah digambar guru atau orang tua. Manfaat: Melatih koordinasi tangan-mata, keterampilan motorik halus, dan ketelitian.',
        activities: [
          {
            activityNumber: 1,
            title: 'Pencarian Kata (Penalaran Kritis, Komunikasi)',
            toolsAndMaterials: ', Kertas karton, Spidol, Selotip',
            howToPlay:
              'dan memainkannyaTentukan tema atau topik yang sesuai dengan tema misalnya: hewan, buah-buahan, warna, benda-benda di sekitar rumah, atau kata-kata yang sering di ucapkan anak-anak. Buat kisi-kisi dapat berupa gambar yang terkait dengan tema yang telah dipilih. Kisi-kisi ini akan menjadi acuan untuk membuat teka-teki pencarian kata, tujuannya agar anak-anak dapat lebih mudah menemukan atau mencari kata-kata tersebut. Letakkan kata-kata secara horizontal, vertikal, atau diagonal di atas karton dengan menuliskan huruf-hurufnya. Pastikan kata-kata tidak saling bertabrakan atau bersilangan secara tidak sengaja. Isi ruang kosong dalam teka-teki pencarian kata dengan huruf-huruf acak. Pastikan huruf-huruf tersebut tidak mengganggu atau mengaburkan kata-kata yang ada. Sediakan petunjuk atau berupa gambart untuk masing-masing kata dalam teka-teki pencarian kata Petunjuk ini akan membantu anak-anak dalam mencari dan mengidentifikasi kata-kata yang tersembunyi. Pastikan teka-teki pencarian kata telah terisi dengan benar dan tidak ada kesalahan pengetikan atau pengaturan huruf. Jika memungkinkan, sebaiknya cobalah menyelesaikan teka-teki pencarian kata sendiri untuk memastikan keakuratan dan kejelasan teka-teki.',
            fullDescription:
              'Kegiatan 1: Pencarian Kata (Penalaran Kritis, Komunikasi). Alat dan Bahan :, Kertas karton, Spidol, Selotip, Cara membuat dan memainkannyaTentukan tema atau topik yang sesuai dengan tema misalnya: hewan, buah-buahan, warna, benda-benda di sekitar rumah, atau kata-kata yang sering di ucapkan anak-anak. Buat kisi-kisi dapat berupa gambar yang terkait dengan tema yang telah dipilih. Kisi-kisi ini akan menjadi acuan untuk membuat teka-teki pencarian kata, tujuannya agar anak-anak dapat lebih mudah menemukan atau mencari kata-kata tersebut. Letakkan kata-kata secara horizontal, vertikal, atau diagonal di atas karton dengan menuliskan huruf-hurufnya. Pastikan kata-kata tidak saling bertabrakan atau bersilangan secara tidak sengaja. Isi ruang kosong dalam teka-teki pencarian kata dengan huruf-huruf acak. Pastikan huruf-huruf tersebut tidak mengganggu atau mengaburkan kata-kata yang ada. Sediakan petunjuk atau berupa gambart untuk masing-masing kata dalam teka-teki pencarian kata Petunjuk ini akan membantu anak-anak dalam mencari dan mengidentifikasi kata-kata yang tersembunyi. Pastikan teka-teki pencarian kata telah terisi dengan benar dan tidak ada kesalahan pengetikan atau pengaturan huruf. Jika memungkinkan, sebaiknya cobalah menyelesaikan teka-teki pencarian kata sendiri untuk memastikan keakuratan dan kejelasan teka-teki.',
          },
          {
            activityNumber: 2,
            title: 'Lipat dan Rapikan (Kemandirian, Kesehatan)',
            toolsAndMaterials: 'Berbagai jenis pakaian sederhana',
            howToPlay:
              'Anak-anak belajar melipat berbagai jenis pakaian dengan rapi dan menyusunnya dalam lemari mainan.',
            fullDescription:
              'Kegiatan 2: Lipat dan Rapikan (Kemandirian, Kesehatan). Alat dan Bahan: Berbagai jenis pakaian sederhana Cara Bermain: Anak-anak belajar melipat berbagai jenis pakaian dengan rapi dan menyusunnya dalam lemari mainan.',
          },
          {
            activityNumber: 3,
            title: 'Menjahit Palsu (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Potongan kain kecil, jarum jahit yang aman untuk anak-anak, dan benang tebal warna-warni',
            howToPlay:
              'Anak-anak mencoba menjahit potongan kain sesuai dengan desain sederhana yang telah digambar guru atau orang tua. Manfaat: Melatih koordinasi tangan-mata, keterampilan motorik halus, dan ketelitian.',
            fullDescription:
              'Kegiatan 3: Menjahit Palsu (Kreativitas, Kemandirian). Alat dan Bahan: Potongan kain kecil, jarum jahit yang aman untuk anak-anak, dan benang tebal warna-warni. Cara Bermain: Anak-anak mencoba menjahit potongan kain sesuai dengan desain sederhana yang telah digambar guru atau orang tua. Manfaat: Melatih koordinasi tangan-mata, keterampilan motorik halus, dan ketelitian.',
          },
        ],
      },
    ],
    closingActivities: [
      'Anak berbaris melingkar dan bergiliran memperagakan cara memakai topi sambil berteriak Aku hebat!',
      'Bermain Menjadi Patung - anak bergerak bebas lalu berhenti seperti patung ketika musik berhenti',
      'Setiap anak maju ke depan dan berpose seperti model sambil teman-teman bertepuk tangan',
      'Anak duduk melingkar dan saling memberikan pujian pakaian kepada teman di sebelahnya',
      'Menyanyi lagu Baju Bersih sambil melakukan gerakan mencuci, menjemur, dan melipat',
      'Anak berlomba menyusun puzzle pakaian sederhana dalam waktu 2 menit',
      'Bergiliran menceritakan Pakaian impianku dalam 1 kalimat sambil berdiri di kursi',
      'Permainan Simon Says dengan instruksi menyentuh bagian pakaian tertentu',
      'Anak berbaris dan berjalan sambil menyanyikan Sampai jumpa pakaianku sayang',
      'Bersama-sama berteriak Terima kasih Tuhan untuk pakaianku! sambil melambaikan tangan',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan nama dan fungsi minimal 5 jenis pakaian yang ditunjukkan',
      },
      {
        no: 2,
        indicator: 'Anak mampu memakai dan melepas sepatu serta mengancingkan baju secara mandiri',
      },
      {
        no: 3,
        indicator:
          'Anak menunjukkan kemampuan mengelompokkan pakaian berdasarkan warna, ukuran, atau fungsi dengan tepat',
      },
      {
        no: 4,
        indicator:
          'Anak dapat memilih pakaian yang sesuai untuk situasi tertentu (hujan, panas, dingin) dari beberapa pilihan',
      },
      {
        no: 5,
        indicator:
          'Anak mendemonstrasikan keterampilan melipat minimal 3 jenis pakaian dengan tingkat kerapian yang baik',
      },
      {
        no: 6,
        indicator:
          'Anak menunjukkan kreativitas dalam mendesain atau menghias pakaian sesuai imajinasinya',
      },
      {
        no: 7,
        indicator:
          'Anak dapat bermain peran sebagai penjual/pembeli di toko pakaian dengan komunikasi yang jelas',
      },
      {
        no: 8,
        indicator:
          'Anak menghargai dan menunjukkan sikap positif terhadap pakaian tradisional dari berbagai budaya',
      },
      {
        no: 9,
        indicator:
          'Anak mampu menceritakan pengalaman atau pembelajaran tentang pakaian dalam 3-5 kalimat yang runtut',
      },
      {
        no: 10,
        indicator:
          'Anak menunjukkan antusiasme dan partisipasi aktif dalam seluruh rangkaian kegiatan pembelajaran',
      },
      {
        no: 11,
        indicator: 'Anak dapat bekerja sama dengan teman dalam aktivitas kelompok terkait pakaian',
      },
      {
        no: 12,
        indicator:
          'Anak mendemonstrasikan kepercayaan diri saat mempresentasikan hasil karya atau keterampilan berpakaian',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 15,
    filename: '51_TK_B_Smt1_15_Air.docx',
    title: 'AIR UNTUK KEHIDUPAN: MISI KECIL PENYELAMAT BUMI',
    topic: 'MITIGASI BENCANA',
    subtopic: 'AIR',
    modelPembelajaran: 'STEAM, Inkuiri, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'November 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: false,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: true,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: true,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun kelompok B memiliki rasa ingin tahu yang tinggi terhadap fenomena alam, khususnya air. Mereka sudah mampu melakukan aktivitas fisik sederhana, mengekspresikan ide melalui berbagai media, dan mulai memahami konsep sebab-akibat. Anak-anak pada usia ini senang bereksperimen, bekerja sama dalam kelompok kecil, dan membutuhkan pembelajaran yang melibatkan seluruh indera untuk memahami konsep secara mendalam.',
      learningMaterial:
        'Mencakup pengetahuan esensial tentang manfaat dan bahaya air, pengetahuan aplikatif melalui eksperimen sains sederhana, dan pengetahuan nilai karakter melalui pemahaman pentingnya menjaga lingkungan dan keselamatan diri. Materi dirancang kontekstual dengan kehidupan sehari-hari anak, mengintegrasikan nilai-nilai ketakwaan, kepedulian lingkungan, dan kemandirian dalam bentuk kegiatan bermain yang menyenangkan.',
    },
    learningDesign: {
      cp: 'CP Dasar Literasi dan STEAM: Murid mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan, menunjukkan minat, dan berpartisipasi dalam kegiatan pramembaca CP Dasar Literasi dan STEAM: Murid mampu mengamati, menyebutkan alasan, pilihan atau keputusannya, mampu memecahkan masalah sederhana, serta mengetahui hubungan sebab akibat dari suatu kondisi atau situasi yang dipengaruhi oleh hukum alam dan kondisi sosial',
      crossDisciplinary:
        'Nilai agama dan moral (mensyukuri ciptaan Tuhan melalui air), nilai Pancasila (kepedulian terhadap lingkungan dan keselamatan bersama), fisik motorik (koordinasi gerak dalam eksperimen dan permainan air), kognitif (pemahaman sifat-sifat air dan konsep sebab-akibat), bahasa (komunikasi hasil pengamatan dan pengalaman), sosial emosional (kerjasama dalam eksperimen dan kepedulian terhadap keselamatan).',
      tp: 'Anak mampu memahami pentingnya air bagi kehidupan, mengenali bahaya air, Anak mampu mengomunikasikan pemahaman mereka menggunakan berbagai media, Anak mampu mengidentifikasi situasi berbahaya terkait air, dan mendemonstrasikan tindakan penyelamatan diri saat banjir.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain edukatif melalui eksperimen sains sederhana, bercerita interaktif, bernyanyi tematik, dan eksplorasi langsung dengan berbagai media air. Metode ini dipilih karena sesuai dengan karakteristik anak usia dini yang belajar melalui pengalaman konkret dan menyenangkan, mendukung prinsip berkesadaran melalui keterlibatan aktif, bermakna melalui koneksi dengan kehidupan sehari-hari, dan menggembirakan melalui aktivitas yang merangsang rasa ingin tahu.',
      partnership:
        'Melibatkan guru dari berbagai bidang, orang tua sebagai narasumber pengalaman sehari-hari dengan air, komunitas peduli lingkungan, dan petugas terkait untuk edukasi keselamatan dalam menghadapi bencana air.',
      environment:
        'Menciptakan integrasi ruang kelas dengan area eksperimen sains, ruang virtual melalui video edukasi tentang siklus air, dan budaya belajar yang mendorong rasa ingin tahu, kerjasama, dan kepedulian terhadap lingkungan serta keselamatan diri.',
      digitalUtilization:
        'Penggunaan video edukasi tentang siklus air, aplikasi sederhana untuk mengenal manfaat air, dokumentasi kegiatan melalui foto dan video, serta media audio untuk lagu-lagu tentang airDukungan media ajar digital tersedia',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan penuh kesadaran',
      'Renungan/nasehat/motivasi pagi tentang nikmat air dari Tuhan',
      'Menyanyikan lagu sesuai materi: 1234 Pergi Sekolah',
      'Asesmen awal melalui diskusi ide-ide kegiatan hari ini',
      'Kegiatan pemantik berupa buku cerita/video: Banjir Datang Tiba-Tiba',
      'Menyiapkan properti kelas dan kesepakatan bermain yang aman',
    ],
    openingQuestions: [
      'Siapa yang menciptakan air untuk kita? (Keimanan dan Ketakwaan)',
      'Bagaimana kita bisa menjaga air agar tetap bersih untuk semua orang? (Kewargaan)',
      'Mengapa menurutmu air bisa berubah menjadi es? (Penalaran Kritis)',
      'Apa ide kreatifmu untuk bermain dengan air yang aman? (Kreativitas)',
      'Bagaimana caranya kita bekerjasama saat bermain air? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri untuk menjaga diri saat bermain air? (Kemandirian)',
      'Mengapa kita harus minum air yang bersih? (Kesehatan)',
      'Bagaimana cara menceritakan pengalamanmu bermain air kepada teman? (Komunikasi)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Menghitung Dengan Manik-Manik (Penalaran Kritis, Kreativitas). Alat dan Bahan :, Kertas HVS, Kertas origami, Kawat bulu, Manik-manik, Spidol, Lem, Cara Membuat dan Memainkannya Siapkan kertas origami, buat setengah lingkaran, dan gunting bagian bawah membentuk garis bergelombang. Gunting kawat bulu sesuai secukupnya dan rekatkan dengan bentuk setengah lingkaran yang sudah di buat sebelumnya. Kemudian, rekatkan di atas kertas HVS (bagian kertas origaminya saja tanpa kawat bulu)Tulis angka yang ingin di kenalkan pada anak-anak di atas bentuk setengah lingkaran yang sudah membentuk payung. Sediakan manik-manik, dan mintalah anak-anak untuk memasukkan manik-manik ke dalam kawat bulu (pegangan payung) sesuai angka. Kegiatan 2 : Penyaringan Air Sederhana (Keimanan dan Ketakwaan, Penalaran Kritis). Alat dan Bahan: Botol plastik bekas, kerikil, pasir, kapas, air keruh Cara Bermain: Anak membuat alat penyaring air sederhana dengan menyusun kerikil, pasir, dan kapas dalam botol yang dipotong. Mereka menuangkan air keruh dan mengamati hasilnya. Kegiatan 3 : Mengurutkan Botol Air (Penalaran Kritis, Kemandirian). Alat dan bahan: Botol plastik bekas berbagai ukuran, air, pewarna makanan. Cara bermain: Isi botol-botol dengan air berwarna dalam jumlah yang berbeda-beda. Minta anak mengurutkan botol dari yang paling sedikit airnya hingga yang paling banyak. Kegiatan ini melatih konsep urutan, perbandingan, dan estimasi volume.',
        activities: [
          {
            activityNumber: 1,
            title: 'Menghitung Dengan Manik-Manik (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials: ', Kertas HVS, Kertas origami, Kawat bulu, Manik-manik, Spidol, Lem',
            howToPlay:
              'dan Memainkannya Siapkan kertas origami, buat setengah lingkaran, dan gunting bagian bawah membentuk garis bergelombang. Gunting kawat bulu sesuai secukupnya dan rekatkan dengan bentuk setengah lingkaran yang sudah di buat sebelumnya. Kemudian, rekatkan di atas kertas HVS (bagian kertas origaminya saja tanpa kawat bulu)Tulis angka yang ingin di kenalkan pada anak-anak di atas bentuk setengah lingkaran yang sudah membentuk payung. Sediakan manik-manik, dan mintalah anak-anak untuk memasukkan manik-manik ke dalam kawat bulu (pegangan payung) sesuai angka.',
            fullDescription:
              'Kegiatan 1: Menghitung Dengan Manik-Manik (Penalaran Kritis, Kreativitas). Alat dan Bahan :, Kertas HVS, Kertas origami, Kawat bulu, Manik-manik, Spidol, Lem, Cara Membuat dan Memainkannya Siapkan kertas origami, buat setengah lingkaran, dan gunting bagian bawah membentuk garis bergelombang. Gunting kawat bulu sesuai secukupnya dan rekatkan dengan bentuk setengah lingkaran yang sudah di buat sebelumnya. Kemudian, rekatkan di atas kertas HVS (bagian kertas origaminya saja tanpa kawat bulu)Tulis angka yang ingin di kenalkan pada anak-anak di atas bentuk setengah lingkaran yang sudah membentuk payung. Sediakan manik-manik, dan mintalah anak-anak untuk memasukkan manik-manik ke dalam kawat bulu (pegangan payung) sesuai angka.',
          },
          {
            activityNumber: 2,
            title: 'Penyaringan Air Sederhana (Keimanan dan Ketakwaan, Penalaran Kritis)',
            toolsAndMaterials: 'Botol plastik bekas, kerikil, pasir, kapas, air keruh',
            howToPlay:
              'Anak membuat alat penyaring air sederhana dengan menyusun kerikil, pasir, dan kapas dalam botol yang dipotong. Mereka menuangkan air keruh dan mengamati hasilnya.',
            fullDescription:
              'Kegiatan 2: Penyaringan Air Sederhana (Keimanan dan Ketakwaan, Penalaran Kritis). Alat dan Bahan: Botol plastik bekas, kerikil, pasir, kapas, air keruh Cara Bermain: Anak membuat alat penyaring air sederhana dengan menyusun kerikil, pasir, dan kapas dalam botol yang dipotong. Mereka menuangkan air keruh dan mengamati hasilnya.',
          },
          {
            activityNumber: 3,
            title: 'Mengurutkan Botol Air (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Botol plastik bekas berbagai ukuran, air, pewarna makanan',
            howToPlay:
              'Isi botol-botol dengan air berwarna dalam jumlah yang berbeda-beda. Minta anak mengurutkan botol dari yang paling sedikit airnya hingga yang paling banyak. Kegiatan ini melatih konsep urutan, perbandingan, dan estimasi volume.',
            fullDescription:
              'Kegiatan 3: Mengurutkan Botol Air (Penalaran Kritis, Kemandirian). Alat dan bahan: Botol plastik bekas berbagai ukuran, air, pewarna makanan. Cara bermain: Isi botol-botol dengan air berwarna dalam jumlah yang berbeda-beda. Minta anak mengurutkan botol dari yang paling sedikit airnya hingga yang paling banyak. Kegiatan ini melatih konsep urutan, perbandingan, dan estimasi volume.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Mencari Angka Dalam Air (Penalaran Kritis, Kreativitas). Alat dan Bahan: Wadah, fleshcard angka, sedotan, air, pewarna makanan. Cara Bermain: Siapkan flashcard angka, kemudian bungkus denga plastic. Selanjutnya, letakkan flashcard angka pada wadah (bisa di beri solasi atau pemberat agar tidak mengapung)Kemudian isi dengan air, dan tambahkan dengan pewarna makanan. Siapakn kertas HVS, kemuian tulis dengan angka-angka. Mintalah anak-anak untuk mencari angka yang teradapat dalam air dengan menggunakan sedotan dengan cara di tiup. Angka yang sudah dapat terlihat, dapat di tanai menggunakan cat warna. Siapkan wadah kemudian, isi dengan air dan beri pewarna makanan. Siapkan flashcard angka , agar tidak basah dapat di bungkus dengan plasticKegiatan 2 : Eksperimen Densitas Air (Kewargaan, Kesehatan). Alat dan bahan: Gelas tinggi, air, minyak sayur, sirup, pewarna makanan, berbagai benda kecil (koin, kelereng, potongan styrofoam). Cara bermain: Tuangkan air, minyak, dan sirup ke dalam gelas secara perlahan. Amati bagaimana cairan membentuk lapisan. Masukkan benda-benda kecil dan amati di lapisan mana mereka mengambang. Minta anak menjelaskan pengamatan mereka. Kegiatan ini mengajarkan konsep densitas dan melatih kemampuan observasi serta analisis. Kegiatan 3 : Eksperimen Pelarutan (Kolaborasi, Komunikasi). Alat dan bahan: Gelas plastik, air, berbagai bahan (gula, garam, pasir, minyak), sendok. Cara bermain: Isi gelas dengan air. Minta anak memprediksi apakah bahan akan larut atau tidak dalam air. Uji prediksi dengan memasukkan bahan satu per satu ke dalam air dan aduk. Catat hasil pengamatan. Kegiatan ini mengajarkan konsep pelarutan dan melatih kemampuan prediksi serta observasi. Diskusi hasil eksperimen dan kesimpulan (Keimanan dan Ketakwaan, Kemandirian)',
        activities: [
          {
            activityNumber: 1,
            title: 'Mencari Angka Dalam Air (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials: 'Wadah, fleshcard angka, sedotan, air, pewarna makanan',
            howToPlay:
              'Siapkan flashcard angka, kemudian bungkus denga plastic. Selanjutnya, letakkan flashcard angka pada wadah (bisa di beri solasi atau pemberat agar tidak mengapung)Kemudian isi dengan air, dan tambahkan dengan pewarna makanan. Siapakn kertas HVS, kemuian tulis dengan angka-angka. Mintalah anak-anak untuk mencari angka yang teradapat dalam air dengan menggunakan sedotan dengan cara di tiup. Angka yang sudah dapat terlihat, dapat di tanai menggunakan cat warna. Siapkan wadah kemudian, isi dengan air dan beri pewarna makanan. Siapkan flashcard angka , agar tidak basah dapat di bungkus dengan plastic',
            fullDescription:
              'Kegiatan 1: Mencari Angka Dalam Air (Penalaran Kritis, Kreativitas). Alat dan Bahan: Wadah, fleshcard angka, sedotan, air, pewarna makanan. Cara Bermain: Siapkan flashcard angka, kemudian bungkus denga plastic. Selanjutnya, letakkan flashcard angka pada wadah (bisa di beri solasi atau pemberat agar tidak mengapung)Kemudian isi dengan air, dan tambahkan dengan pewarna makanan. Siapakn kertas HVS, kemuian tulis dengan angka-angka. Mintalah anak-anak untuk mencari angka yang teradapat dalam air dengan menggunakan sedotan dengan cara di tiup. Angka yang sudah dapat terlihat, dapat di tanai menggunakan cat warna. Siapkan wadah kemudian, isi dengan air dan beri pewarna makanan. Siapkan flashcard angka , agar tidak basah dapat di bungkus dengan plastic',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Densitas Air (Kewargaan, Kesehatan)',
            toolsAndMaterials:
              'Gelas tinggi, air, minyak sayur, sirup, pewarna makanan, berbagai benda kecil (koin, kelereng, potongan styrofoam)',
            howToPlay:
              'Tuangkan air, minyak, dan sirup ke dalam gelas secara perlahan. Amati bagaimana cairan membentuk lapisan. Masukkan benda-benda kecil dan amati di lapisan mana mereka mengambang. Minta anak menjelaskan pengamatan mereka. Kegiatan ini mengajarkan konsep densitas dan melatih kemampuan observasi serta analisis.',
            fullDescription:
              'Kegiatan 2: Eksperimen Densitas Air (Kewargaan, Kesehatan). Alat dan bahan: Gelas tinggi, air, minyak sayur, sirup, pewarna makanan, berbagai benda kecil (koin, kelereng, potongan styrofoam). Cara bermain: Tuangkan air, minyak, dan sirup ke dalam gelas secara perlahan. Amati bagaimana cairan membentuk lapisan. Masukkan benda-benda kecil dan amati di lapisan mana mereka mengambang. Minta anak menjelaskan pengamatan mereka. Kegiatan ini mengajarkan konsep densitas dan melatih kemampuan observasi serta analisis.',
          },
          {
            activityNumber: 3,
            title: 'Eksperimen Pelarutan (Kolaborasi, Komunikasi)',
            toolsAndMaterials:
              'Gelas plastik, air, berbagai bahan (gula, garam, pasir, minyak), sendok',
            howToPlay:
              'Isi gelas dengan air. Minta anak memprediksi apakah bahan akan larut atau tidak dalam air. Uji prediksi dengan memasukkan bahan satu per satu ke dalam air dan aduk. Catat hasil pengamatan. Kegiatan ini mengajarkan konsep pelarutan dan melatih kemampuan prediksi serta observasi. Diskusi hasil eksperimen dan kesimpulan (Keimanan dan Ketakwaan, Kemandirian)',
            fullDescription:
              'Kegiatan 3: Eksperimen Pelarutan (Kolaborasi, Komunikasi). Alat dan bahan: Gelas plastik, air, berbagai bahan (gula, garam, pasir, minyak), sendok. Cara bermain: Isi gelas dengan air. Minta anak memprediksi apakah bahan akan larut atau tidak dalam air. Uji prediksi dengan memasukkan bahan satu per satu ke dalam air dan aduk. Catat hasil pengamatan. Kegiatan ini mengajarkan konsep pelarutan dan melatih kemampuan prediksi serta observasi. Diskusi hasil eksperimen dan kesimpulan (Keimanan dan Ketakwaan, Kemandirian)',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Mikroskop Air (Kreativitas, Penalaran Kritis). Alat dan Bahan: Gunting, gelas kertas, Pensil, plastik, Sendok, Air, Benda-benda kecil yang ingin di lihat dari dekat, seperti bagian-bagian bunga, sepotong buah, cangkang, atau daun. Cara Membuat: Potong bagian bawah gelas kertas. Kenudian tutup bagian bawah gelas yang sudah di potong debgab plastik, lalu beri selotip. Kemudian gambar U terbalik di setiap sisi gelas. Potong semua garis yang dibuat, sehingga cangkir memiliki lubang di bagian bawah dan dua sisi terbuka. Siapkan wadah lalu isi dengan air kemudian masukkan benda-benda yang ingin di lihat. Mintalah anak-anak untuk menggunakan mikrskop untuk melihat benda-benda yang ada di dalam air. Kegiatan 2 : Eksperimen Tegangan Permukaan (Kesehatan, Kewargaan). Alat dan bahan: Koin, pipet, air, sabun cair. Cara bermain: Letakkan koin di meja. Minta anak meneteskan air di atas koin menggunakan pipet, hitung berapa tetes yang bisa ditampung sebelum air tumpah. Ulangi eksperimen dengan menambahkan sedikit sabun cair ke air. Bandingkan hasilnya. Kegiatan ini mengajarkan tentang tegangan permukaan dan melatih kemampuan berhitung serta observasi. Kegiatan 3 : Bermain Huruf Terapung (Komunikasi, Kolaborasi). Alat dan bahan: Tutup botol plastik, spidol permanen, baskom berisi air. Cara bermain: Tulis huruf-huruf pada tutup botol plastik. Letakkan tutup botol di air dan minta anak menyusun kata-kata dari huruf yang terapung. Tambahkan tantangan dengan membuat kata sesuai tema tertentu. Kegiatan ini melatih pembentukan kata dan pemahaman tema.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Mikroskop Air (Kreativitas, Penalaran Kritis)',
            toolsAndMaterials:
              'Gunting, gelas kertas, Pensil, plastik, Sendok, Air, Benda-benda kecil yang ingin di lihat dari dekat, seperti bagian-bagian bunga, sepotong buah, cangkang, atau daun',
            howToPlay:
              'Potong bagian bawah gelas kertas. Kenudian tutup bagian bawah gelas yang sudah di potong debgab plastik, lalu beri selotip. Kemudian gambar U terbalik di setiap sisi gelas. Potong semua garis yang dibuat, sehingga cangkir memiliki lubang di bagian bawah dan dua sisi terbuka. Siapkan wadah lalu isi dengan air kemudian masukkan benda-benda yang ingin di lihat. Mintalah anak-anak untuk menggunakan mikrskop untuk melihat benda-benda yang ada di dalam air.',
            fullDescription:
              'Kegiatan 1: Membuat Mikroskop Air (Kreativitas, Penalaran Kritis). Alat dan Bahan: Gunting, gelas kertas, Pensil, plastik, Sendok, Air, Benda-benda kecil yang ingin di lihat dari dekat, seperti bagian-bagian bunga, sepotong buah, cangkang, atau daun. Cara Membuat: Potong bagian bawah gelas kertas. Kenudian tutup bagian bawah gelas yang sudah di potong debgab plastik, lalu beri selotip. Kemudian gambar U terbalik di setiap sisi gelas. Potong semua garis yang dibuat, sehingga cangkir memiliki lubang di bagian bawah dan dua sisi terbuka. Siapkan wadah lalu isi dengan air kemudian masukkan benda-benda yang ingin di lihat. Mintalah anak-anak untuk menggunakan mikrskop untuk melihat benda-benda yang ada di dalam air.',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Tegangan Permukaan (Kesehatan, Kewargaan)',
            toolsAndMaterials: 'Koin, pipet, air, sabun cair',
            howToPlay:
              'Letakkan koin di meja. Minta anak meneteskan air di atas koin menggunakan pipet, hitung berapa tetes yang bisa ditampung sebelum air tumpah. Ulangi eksperimen dengan menambahkan sedikit sabun cair ke air. Bandingkan hasilnya. Kegiatan ini mengajarkan tentang tegangan permukaan dan melatih kemampuan berhitung serta observasi.',
            fullDescription:
              'Kegiatan 2: Eksperimen Tegangan Permukaan (Kesehatan, Kewargaan). Alat dan bahan: Koin, pipet, air, sabun cair. Cara bermain: Letakkan koin di meja. Minta anak meneteskan air di atas koin menggunakan pipet, hitung berapa tetes yang bisa ditampung sebelum air tumpah. Ulangi eksperimen dengan menambahkan sedikit sabun cair ke air. Bandingkan hasilnya. Kegiatan ini mengajarkan tentang tegangan permukaan dan melatih kemampuan berhitung serta observasi.',
          },
          {
            activityNumber: 3,
            title: 'Bermain Huruf Terapung (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Tutup botol plastik, spidol permanen, baskom berisi air',
            howToPlay:
              'Tulis huruf-huruf pada tutup botol plastik. Letakkan tutup botol di air dan minta anak menyusun kata-kata dari huruf yang terapung. Tambahkan tantangan dengan membuat kata sesuai tema tertentu. Kegiatan ini melatih pembentukan kata dan pemahaman tema.',
            fullDescription:
              'Kegiatan 3: Bermain Huruf Terapung (Komunikasi, Kolaborasi). Alat dan bahan: Tutup botol plastik, spidol permanen, baskom berisi air. Cara bermain: Tulis huruf-huruf pada tutup botol plastik. Letakkan tutup botol di air dan minta anak menyusun kata-kata dari huruf yang terapung. Tambahkan tantangan dengan membuat kata sesuai tema tertentu. Kegiatan ini melatih pembentukan kata dan pemahaman tema.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Eksperimen Air Surut dan Masuk Ke Dalam Jar (Penalaran Kritis, Kreativitas). Alat dan Bahan: Mangkuk dangkal, Air, Lilin, Toples bening, playdough (Opsional). Cara Melakukan Eksperimen: Tempatkan lilin di tengah piring atau mangkuk, jika lilin tidak dapat berdiri sendiri gunakan beberapa playdough untuk membantunya berdiri tegak. Campur air dengan pewarna makanan dalam wadah terpisah, pewarnaan makanan membantu anak-anak melihat air yang naik lebih baik. Tuang air berwarna ke dalam piring (hingga sekitar 1 cm). Nyalakan lilin dengan korek api. Balikkan gelas atau stoples dan letakkan di atas lilin. Kegiatan 2 : Banjir Mini (Kewargaan, Kesehatan). Alat dan Bahan: Nampan plastik, tanah, rumah-rumahan kecil, air Cara Bermain: Anak membuat miniatur lingkungan di nampan menggunakan tanah dan rumah-rumahan. Mereka lalu menuangkan air perlahan dan mengamati apa yang terjadi saat air berlebih. Kegiatan 3 : Bermain Penjumlahan dengan Tetesan Air (Kolaborasi, Komunikasi). Alat dan bahan: Kertas dengan lingkaran-lingkaran kecil dan soal penjumlahan, pipet plastik, air. Cara bermain: Buat soal penjumlahan sederhana di kertas dengan lingkaran-lingkaran kecil di bawahnya. Minta anak menjawab soal dengan meneteskan air ke dalam lingkaran sesuai jumlah yang benar. Kegiatan ini melatih kemampuan penjumlahan dan kontrol motorik halus.',
        activities: [
          {
            activityNumber: 1,
            title: 'Eksperimen Air Surut dan Masuk Ke Dalam Jar (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials:
              'Mangkuk dangkal, Air, Lilin, Toples bening, playdough (Opsional). Cara Melakukan Eksperimen: Tempatkan lilin di tengah piring atau mangkuk, jika lilin tidak dapat berdiri sendiri gunakan beberapa playdough untuk membantunya berdiri tegak. Campur air dengan pewarna makanan dalam wadah terpisah, pewarnaan makanan membantu anak-anak melihat air yang naik lebih baik. Tuang air berwarna ke dalam piring (hingga sekitar 1 cm). Nyalakan lilin dengan korek api. Balikkan gelas atau stoples dan letakkan di atas lilin.',
            howToPlay: '',
            fullDescription:
              'Kegiatan 1: Eksperimen Air Surut dan Masuk Ke Dalam Jar (Penalaran Kritis, Kreativitas). Alat dan Bahan: Mangkuk dangkal, Air, Lilin, Toples bening, playdough (Opsional). Cara Melakukan Eksperimen: Tempatkan lilin di tengah piring atau mangkuk, jika lilin tidak dapat berdiri sendiri gunakan beberapa playdough untuk membantunya berdiri tegak. Campur air dengan pewarna makanan dalam wadah terpisah, pewarnaan makanan membantu anak-anak melihat air yang naik lebih baik. Tuang air berwarna ke dalam piring (hingga sekitar 1 cm). Nyalakan lilin dengan korek api. Balikkan gelas atau stoples dan letakkan di atas lilin.',
          },
          {
            activityNumber: 2,
            title: 'Banjir Mini (Kewargaan, Kesehatan)',
            toolsAndMaterials: 'Nampan plastik, tanah, rumah-rumahan kecil, air',
            howToPlay:
              'Anak membuat miniatur lingkungan di nampan menggunakan tanah dan rumah-rumahan. Mereka lalu menuangkan air perlahan dan mengamati apa yang terjadi saat air berlebih.',
            fullDescription:
              'Kegiatan 2: Banjir Mini (Kewargaan, Kesehatan). Alat dan Bahan: Nampan plastik, tanah, rumah-rumahan kecil, air Cara Bermain: Anak membuat miniatur lingkungan di nampan menggunakan tanah dan rumah-rumahan. Mereka lalu menuangkan air perlahan dan mengamati apa yang terjadi saat air berlebih.',
          },
          {
            activityNumber: 3,
            title: 'Bermain Penjumlahan dengan Tetesan Air (Kolaborasi, Komunikasi)',
            toolsAndMaterials:
              'Kertas dengan lingkaran-lingkaran kecil dan soal penjumlahan, pipet plastik, air',
            howToPlay:
              'Buat soal penjumlahan sederhana di kertas dengan lingkaran-lingkaran kecil di bawahnya. Minta anak menjawab soal dengan meneteskan air ke dalam lingkaran sesuai jumlah yang benar. Kegiatan ini melatih kemampuan penjumlahan dan kontrol motorik halus.',
            fullDescription:
              'Kegiatan 3: Bermain Penjumlahan dengan Tetesan Air (Kolaborasi, Komunikasi). Alat dan bahan: Kertas dengan lingkaran-lingkaran kecil dan soal penjumlahan, pipet plastik, air. Cara bermain: Buat soal penjumlahan sederhana di kertas dengan lingkaran-lingkaran kecil di bawahnya. Minta anak menjawab soal dengan meneteskan air ke dalam lingkaran sesuai jumlah yang benar. Kegiatan ini melatih kemampuan penjumlahan dan kontrol motorik halus.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Eksperimen Sains Pelangi Naik (Kreativitas, Penalaran Kritis). Alat dan bahan: Tisu kertas, Spidol yang bisa dicuci, Air, Dua gelas identik, Cara Membuat: Lipat tisu menjadi dua bagian secara horizontal. Potong sekitar 1/3 bagian tisu. Simpan bagian yang lebih kecil untuk nanti.ambarlah warna-warna pelangi di salah satu ujung tisu dapur dalam bentuk balok-balok persegi panjang. Pastikan untuk mengoleskan spidol beberapa kali ke atas warna-warna tersebut sehingga ada cukup pewarna untuk mengalir ke atas tisu dapur. Ulangi hal yang sama di ujung lainnya. Pastikan warnanya sejajar di kedua ujung. Tuangkan air ke dalam dua gelas hingga sekitar 3/4 penuh. Kegiatan 2 : Membuat Hujan (Kesehatan, Kewargaan). Alat dan Bahan: Toples kaca, air panas, es batu, piring kecil, shaving foam Cara Bermain: Anak menuangkan air panas ke dalam toples, lalu menambahkan shaving foam di atasnya sebagai awan. Mereka meneteskan air berwarna di atas foam dan mengamati hujan yang terbentuk. Kegiatan 3 : Mengukur Curah Hujan (Komunikasi, Kolaborasi). Alat dan Bahan: Botol plastik besar, gunting, penggaris, air Cara Bermain: Anak membuat alat pengukur curah hujan sederhana dari botol plastik. Mereka menempatkannya di luar ruangan dan mengukur jumlah air hujan yang tertampung setelah hujan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Eksperimen Sains Pelangi Naik (Kreativitas, Penalaran Kritis)',
            toolsAndMaterials: 'Tisu kertas, Spidol yang bisa dicuci, Air, Dua gelas identik',
            howToPlay:
              'Lipat tisu menjadi dua bagian secara horizontal. Potong sekitar 1/3 bagian tisu. Simpan bagian yang lebih kecil untuk nanti.ambarlah warna-warna pelangi di salah satu ujung tisu dapur dalam bentuk balok-balok persegi panjang. Pastikan untuk mengoleskan spidol beberapa kali ke atas warna-warna tersebut sehingga ada cukup pewarna untuk mengalir ke atas tisu dapur. Ulangi hal yang sama di ujung lainnya. Pastikan warnanya sejajar di kedua ujung. Tuangkan air ke dalam dua gelas hingga sekitar 3/4 penuh.',
            fullDescription:
              'Kegiatan 1: Eksperimen Sains Pelangi Naik (Kreativitas, Penalaran Kritis). Alat dan bahan: Tisu kertas, Spidol yang bisa dicuci, Air, Dua gelas identik, Cara Membuat: Lipat tisu menjadi dua bagian secara horizontal. Potong sekitar 1/3 bagian tisu. Simpan bagian yang lebih kecil untuk nanti.ambarlah warna-warna pelangi di salah satu ujung tisu dapur dalam bentuk balok-balok persegi panjang. Pastikan untuk mengoleskan spidol beberapa kali ke atas warna-warna tersebut sehingga ada cukup pewarna untuk mengalir ke atas tisu dapur. Ulangi hal yang sama di ujung lainnya. Pastikan warnanya sejajar di kedua ujung. Tuangkan air ke dalam dua gelas hingga sekitar 3/4 penuh.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Hujan (Kesehatan, Kewargaan)',
            toolsAndMaterials: 'Toples kaca, air panas, es batu, piring kecil, shaving foam',
            howToPlay:
              'Anak menuangkan air panas ke dalam toples, lalu menambahkan shaving foam di atasnya sebagai awan. Mereka meneteskan air berwarna di atas foam dan mengamati hujan yang terbentuk.',
            fullDescription:
              'Kegiatan 2: Membuat Hujan (Kesehatan, Kewargaan). Alat dan Bahan: Toples kaca, air panas, es batu, piring kecil, shaving foam Cara Bermain: Anak menuangkan air panas ke dalam toples, lalu menambahkan shaving foam di atasnya sebagai awan. Mereka meneteskan air berwarna di atas foam dan mengamati hujan yang terbentuk.',
          },
          {
            activityNumber: 3,
            title: 'Mengukur Curah Hujan (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Botol plastik besar, gunting, penggaris, air',
            howToPlay:
              'Anak membuat alat pengukur curah hujan sederhana dari botol plastik. Mereka menempatkannya di luar ruangan dan mengukur jumlah air hujan yang tertampung setelah hujan.',
            fullDescription:
              'Kegiatan 3: Mengukur Curah Hujan (Komunikasi, Kolaborasi). Alat dan Bahan: Botol plastik besar, gunting, penggaris, air Cara Bermain: Anak membuat alat pengukur curah hujan sederhana dari botol plastik. Mereka menempatkannya di luar ruangan dan mengukur jumlah air hujan yang tertampung setelah hujan.',
          },
        ],
      },
    ],
    closingActivities: [
      'Anak duduk melingkar dan menceritakan satu hal paling menarik dari eksperimen hari ini',
      'Bermain Tepuk Air: Anak bertepuk sesuai jumlah suku kata nama-nama benda yang menggunakan air',
      'Anak menunjukkan gerakan sederhana seperti ombak, hujan, atau air mengalir',
      'Guru dan anak bersama-sama merapikan alat eksperimen sambil bernyanyi',
      'Anak menulis atau menggambar satu hal yang akan mereka lakukan untuk menjaga air',
      'Permainan Tunjuk dan Sebut: Anak menunjuk benda di kelas yang membutuhkan air',
      'Anak berbaris dan bergiliran menyebutkan Terima kasih Tuhan untuk air yang...',
      'Guru membacakan rencana kegiatan besok dan anak merespons dengan antusias',
      'Anak bersalaman dengan teman sambil mengucapkan Jaga air, jaga bumi',
      'Doa penutup dipimpin salah satu anak secara bergiliran',
      'Anak menyiapkan tas sambil menyanyikan lagu tentang air',
      'Berbaris rapi menuju pintu sambil menyebutkan manfaat air satu per satu',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan minimal 3 manfaat air dalam kehidupan sehari-hari saat diskusi awal',
      },
      {
        no: 2,
        indicator:
          'Anak mampu mengidentifikasi 2 situasi bahaya terkait air (banjir, air kotor, tenggelam)',
      },
      {
        no: 3,
        indicator:
          'Anak dapat melakukan eksperimen penyaringan air sederhana dengan mengikuti urutan yang benar',
      },
      {
        no: 4,
        indicator:
          'Anak menunjukkan kemampuan mengurutkan botol berdasarkan volume air dari sedikit ke banyak',
      },
      {
        no: 5,
        indicator:
          'Anak mampu bekerja sama dalam kelompok saat melakukan eksperimen densitas dan pelarutan',
      },
      {
        no: 6,
        indicator:
          'Anak dapat menceritakan kembali hasil pengamatan eksperimen dengan bahasa sederhana dan urut',
      },
      {
        no: 7,
        indicator:
          'Anak menunjukkan sikap hati-hati dan mengikuti aturan keselamatan saat bermain dengan air',
      },
      {
        no: 8,
        indicator:
          'Anak mengungkapkan rasa syukur kepada Tuhan atas nikmat air dalam doa dan percakapan',
      },
      {
        no: 9,
        indicator:
          'Anak dapat membuat prediksi sederhana sebelum melakukan eksperimen tegangan permukaan',
      },
      {
        no: 10,
        indicator:
          'Anak menunjukkan kreativitas dalam membuat mikroskop sederhana dan karya seni air',
      },
      {
        no: 11,
        indicator:
          'Anak mampu menggunakan alat ukur sederhana (gelas ukur, penggaris) untuk mengukur volume air',
      },
      {
        no: 12,
        indicator:
          'Anak dapat mendemonstrasikan minimal 2 tindakan penyelamatan diri saat simulasi banjir mini',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 16,
    filename: '52_TK_B_Smt1_16_Api.docx',
    title: 'MENGAPA API TIDAK BOLEH DISENTUH?',
    topic: 'MITIGASI BENCANA',
    subtopic: 'API',
    modelPembelajaran: 'STEAM, Inkuiri, Kolaboratif',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'November 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: true,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: true,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun memiliki karakteristik rasa ingin tahu yang tinggi terhadap fenomena alam, kemampuan motorik halus dan kasar yang berkembang pesat, serta mulai mampu memahami konsep sebab akibat sederhana. Mereka memerlukan pembelajaran konkret dengan benda nyata, senang bereksplorasi, dan mulai mampu mengikuti aturan keselamatan sederhana. Anak-anak pada usia ini juga mulai mengembangkan kesadaran terhadap bahaya dan keselamatan diri.',
      learningMaterial:
        'Materi tentang api dan keselamatan kebakaran merupakan pengetahuan penting yang berkaitan langsung dengan kehidupan sehari-hari anak. Materi ini mengintegrasikan pengetahuan sains sederhana tentang sifat api, pengetahuan keselamatan praktis, dan pengembangan karakter peduli lingkungan. Pembelajaran dirancang secara bertahap dari pengenalan hingga aplikasi praktis dengan mengutamakan keselamatan dan pengawasan ketat dari orang dewasa.',
    },
    learningDesign: {
      cp: 'CP Dasar Literasi dan STEAM: Murid mampu mengamati, menyebutkan alasan, pilihan atau keputusannya, mampu memecahkan masalah sederhana, serta mengetahui hubungan sebab akibat dari suatu kondisi atau situasi yang dipengaruhi oleh hukum alam dan kondisi sosial CP Jati Diri: Murid memiliki fungsi gerak (motorik kasar, halus, dan taktil) untuk merawat dirinya, membangun kemandirian dan berkegiatan',
      crossDisciplinary:
        'Nilai agama dan moral (mensyukuri ciptaan Tuhan dan menjaga keselamatan), Nilai Pancasila (peduli lingkungan dan keselamatan bersama), Fisik motorik (koordinasi gerakan dalam simulasi penyelamatan), Kognitif (memahami sebab akibat kebakaran dan sifat benda), Bahasa (mengomunikasikan pengalaman dan pemahaman tentang keselamatan), Sosial emosional (kerja sama dalam kegiatan kelompok dan empati terhadap korban bencana).',
      tp: 'Anak mampu menjelaskan 3 bahaya api dan mendemonstrasikan 2 tindakan penyelamatan diri saat terjadi kebakaran Anak dapat menjelaskan proses terjadinya kebakaran, mengidentifikasi sumber-sumber api potensial di lingkungan sekitar, Anak dapat mendemonstrasikan langkah-langkah penyelamatan diri serta penggunaan alat pemadam api sederhana dengan aman.',
      pedagogicalPractice:
        'Pembelajaran dilaksanakan melalui pendekatan bermain sambil belajar dengan metode bercerita, bernyanyi, eksperimen sederhana, dan simulasi keselamatan. Pendekatan ini mendukung prinsip berkesadaran melalui pengamatan langsung, bermakna melalui keterkaitan dengan kehidupan sehari-hari, dan menggembirakan melalui permainan edukatif yang menarik.',
      partnership:
        'Melibatkan guru kelas, kepala sekolah, petugas keamanan sekolah, dan orangtua dalam mendukung pemahaman keselamatan. Kerjasama dengan pemadam kebakaran setempat untuk demonstrasi langsung.',
      environment:
        'Pembelajaran dilaksanakan di dalam kelas dan area terbuka sekolah dengan pengaturan fleksibel untuk eksperimen, simulasi, dan presentasi. Lingkungan dibuat aman namun tetap memungkinkan eksplorasi dengan pengawasan ketat.',
      digitalUtilization:
        'Video edukatif tentang manfaat dan bahaya api, media interaktif untuk pengenalan alat-alat yang menggunakan api, aplikasi sederhana untuk klasifikasi benda, dan dokumentasi digital untuk portofolio anakDukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka',
      'Renungan/nasehat/motivasi pagi',
      'Menyanyikan lagu sesuai materi: 1234 Pergi Sekolah',
      'Asesmen awal: mendiskusikan ide-ide kegiatan hari ini bersama anak',
      'Kegiatan pemantik berupa buku cerita/video: Manfaat dan Bahaya Api',
      'Menyiapkan properti kelas/aturan bermain/kesepakatan kelas',
    ],
    openingQuestions: [
      'Siapa yang menciptakan api untuk membantu kita memasak? (Keimanan dan Ketakwaan)',
      'Bagaimana cara kita menjaga teman-teman tetap aman dari api? (Kewargaan)',
      'Mengapa api bisa berbahaya dan bermanfaat? (Penalaran Kritis)',
      'Apa ide kreatif untuk membuat poster keselamatan? (Kreativitas)',
      'Bagaimana kita bisa bekerja sama saat ada bahaya? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri untuk tetap aman? (Kemandirian)',
      'Mengapa penting menjaga tubuh kita dari bahaya api? (Kesehatan)',
      'Bagaimana cara memberitahu orang lain tentang bahaya api? (Komunikasi)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Menggelindingkan Bola (Kemandirian, Kesehatan). Alat dan Bahan: Bola. Cara Memainkannya: Instruksikan anak-anak untuk berbaris. Secara bergantian anak-anak akan menggelindingkan bola dari depan agar sampai ke belakang. Dan jika anak-anak yang sudah mendapat giliran harus berpindah posisi ke belakang. Kegiatan 2 : Eksperimen Lilin dan Gelas (Penalaran Kritis, Keimanan dan Ketakwaan). Alat dan bahan: Lilin, gelas, korek api (digunakan oleh orang dewasa), stopwatch. Cara bermain: Nyalakan lilin dan tutup dengan gelas. Anak-anak mengamati dan mencatat berapa lama api bertahan, berdiskusi tentang mengapa api padam (konsep oksigen). Kegiatan 3 : Kolase Bahan Mudah Terbakar vs Tahan Api (Kreativitas, Kolaborasi). Alat dan bahan: Berbagai bahan (kertas, aluminium foil, batu), lem, karton. Cara bermain: Anak-anak mengelompokkan dan menempelkan bahan berdasarkan sifat mudah terbakar atau tahan api, berdiskusi tentang alasannya.',
        activities: [
          {
            activityNumber: 1,
            title: 'Menggelindingkan Bola (Kemandirian, Kesehatan)',
            toolsAndMaterials: 'Bola',
            howToPlay:
              'Instruksikan anak-anak untuk berbaris. Secara bergantian anak-anak akan menggelindingkan bola dari depan agar sampai ke belakang. Dan jika anak-anak yang sudah mendapat giliran harus berpindah posisi ke belakang.',
            fullDescription:
              'Kegiatan 1: Menggelindingkan Bola (Kemandirian, Kesehatan). Alat dan Bahan: Bola. Cara Memainkannya: Instruksikan anak-anak untuk berbaris. Secara bergantian anak-anak akan menggelindingkan bola dari depan agar sampai ke belakang. Dan jika anak-anak yang sudah mendapat giliran harus berpindah posisi ke belakang.',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Lilin dan Gelas (Penalaran Kritis, Keimanan dan Ketakwaan)',
            toolsAndMaterials: 'Lilin, gelas, korek api (digunakan oleh orang dewasa), stopwatch',
            howToPlay:
              'Nyalakan lilin dan tutup dengan gelas. Anak-anak mengamati dan mencatat berapa lama api bertahan, berdiskusi tentang mengapa api padam (konsep oksigen).',
            fullDescription:
              'Kegiatan 2: Eksperimen Lilin dan Gelas (Penalaran Kritis, Keimanan dan Ketakwaan). Alat dan bahan: Lilin, gelas, korek api (digunakan oleh orang dewasa), stopwatch. Cara bermain: Nyalakan lilin dan tutup dengan gelas. Anak-anak mengamati dan mencatat berapa lama api bertahan, berdiskusi tentang mengapa api padam (konsep oksigen).',
          },
          {
            activityNumber: 3,
            title: 'Kolase Bahan Mudah Terbakar vs Tahan Api (Kreativitas, Kolaborasi)',
            toolsAndMaterials: 'Berbagai bahan (kertas, aluminium foil, batu), lem, karton',
            howToPlay:
              'Anak-anak mengelompokkan dan menempelkan bahan berdasarkan sifat mudah terbakar atau tahan api, berdiskusi tentang alasannya.',
            fullDescription:
              'Kegiatan 3: Kolase Bahan Mudah Terbakar vs Tahan Api (Kreativitas, Kolaborasi). Alat dan bahan: Berbagai bahan (kertas, aluminium foil, batu), lem, karton. Cara bermain: Anak-anak mengelompokkan dan menempelkan bahan berdasarkan sifat mudah terbakar atau tahan api, berdiskusi tentang alasannya.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Kegiatan STEAM Membuat APE Pencocokkan Huruf Awal Sesuai Gambar (Komunikasi, Kreativitas). Alat dan Bahan: Kardus bekas, Kertas karton, printable gambar Binatang, kendaraan, profesi, buah, atau lainnya, Tutup botol, Gelas atau benda yang berbentuk lingkaran, Gunting, Pensil, Lem. Cara Membuat dan Memainkannya: Siapkan kardus bekas, kemudian gambar atau jiplak menggunakan gelas untuk membentuk lingkaran di atas kardus. Jika sudah selesai gunting gambar lingkaran yang sudah di jiplak tadi. Kemudian beri alas di bawah kardus dengan menggunakan kertas karton. Selanjutnya rekatkan printable gambar Binatang, kendaraan, profesi, bu ah, atau lainnya yang akan di kenalkan pada anak-anak dengan menggunakan lem. Jika dirasa lem sudah benar-benar merekat selanjutnya, beri alas kardus pada bagian bawah dan rekatkan menggunakan lem, bisa juga di double menggunakan selotip bagian pinggir-pinggirnya agar merekat satu sama lain dengan sempurna. Setelah itu rekatkan tutup botol dengan kardus yang berbentuk lingkaran yang tadi sudah di gunting, menggunakan lem, dan tuliskan huruf pada bagian tutup botol. Ajak anak untuk memasangkan huruf awal yang terdapat pada setiap gambar. Kegiatan 2 : Eksperimen Warna Api (Penalaran Kritis, Keimanan dan Ketakwaan). Alat dan bahan: Gambar api, garam dengan berbagai mineral (dilakukan oleh orang dewasa), air, pipet. Cara bermain: Demonstrasikan bagaimana mineral berbeda menghasilkan warna api berbeda. Anak-anak menggambar dan mewarnai api sesuai pengamatan. Kegiatan 3 : Melukis dengan Lilin dan Cat Air (Kreativitas, Kemandirian). Alat dan bahan: Kertas, lilin putih, cat air, kuas. Cara bermain: Anak-anak menggambar dengan lilin (tidak terlihat), lalu mewarnai dengan cat air. Gambar lilin akan muncul, mendemonstrasikan sifat air dan minyak.',
        activities: [
          {
            activityNumber: 1,
            title:
              'Kegiatan STEAM Membuat APE Pencocokkan Huruf Awal Sesuai Gambar (Komunikasi, Kreativitas)',
            toolsAndMaterials:
              'Kardus bekas, Kertas karton, printable gambar Binatang, kendaraan, profesi, buah, atau lainnya, Tutup botol, Gelas atau benda yang berbentuk lingkaran, Gunting, Pensil, Lem',
            howToPlay:
              'dan Memainkannya: Siapkan kardus bekas, kemudian gambar atau jiplak menggunakan gelas untuk membentuk lingkaran di atas kardus. Jika sudah selesai gunting gambar lingkaran yang sudah di jiplak tadi. Kemudian beri alas di bawah kardus dengan menggunakan kertas karton. Selanjutnya rekatkan printable gambar Binatang, kendaraan, profesi, bu ah, atau lainnya yang akan di kenalkan pada anak-anak dengan menggunakan lem. Jika dirasa lem sudah benar-benar merekat selanjutnya, beri alas kardus pada bagian bawah dan rekatkan menggunakan lem, bisa juga di double menggunakan selotip bagian pinggir-pinggirnya agar merekat satu sama lain dengan sempurna. Setelah itu rekatkan tutup botol dengan kardus yang berbentuk lingkaran yang tadi sudah di gunting, menggunakan lem, dan tuliskan huruf pada bagian tutup botol. Ajak anak untuk memasangkan huruf awal yang terdapat pada setiap gambar.',
            fullDescription:
              'Kegiatan 1: Kegiatan STEAM Membuat APE Pencocokkan Huruf Awal Sesuai Gambar (Komunikasi, Kreativitas). Alat dan Bahan: Kardus bekas, Kertas karton, printable gambar Binatang, kendaraan, profesi, buah, atau lainnya, Tutup botol, Gelas atau benda yang berbentuk lingkaran, Gunting, Pensil, Lem. Cara Membuat dan Memainkannya: Siapkan kardus bekas, kemudian gambar atau jiplak menggunakan gelas untuk membentuk lingkaran di atas kardus. Jika sudah selesai gunting gambar lingkaran yang sudah di jiplak tadi. Kemudian beri alas di bawah kardus dengan menggunakan kertas karton. Selanjutnya rekatkan printable gambar Binatang, kendaraan, profesi, bu ah, atau lainnya yang akan di kenalkan pada anak-anak dengan menggunakan lem. Jika dirasa lem sudah benar-benar merekat selanjutnya, beri alas kardus pada bagian bawah dan rekatkan menggunakan lem, bisa juga di double menggunakan selotip bagian pinggir-pinggirnya agar merekat satu sama lain dengan sempurna. Setelah itu rekatkan tutup botol dengan kardus yang berbentuk lingkaran yang tadi sudah di gunting, menggunakan lem, dan tuliskan huruf pada bagian tutup botol. Ajak anak untuk memasangkan huruf awal yang terdapat pada setiap gambar.',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Warna Api (Penalaran Kritis, Keimanan dan Ketakwaan)',
            toolsAndMaterials:
              'Gambar api, garam dengan berbagai mineral (dilakukan oleh orang dewasa), air, pipet',
            howToPlay:
              'Demonstrasikan bagaimana mineral berbeda menghasilkan warna api berbeda. Anak-anak menggambar dan mewarnai api sesuai pengamatan.',
            fullDescription:
              'Kegiatan 2: Eksperimen Warna Api (Penalaran Kritis, Keimanan dan Ketakwaan). Alat dan bahan: Gambar api, garam dengan berbagai mineral (dilakukan oleh orang dewasa), air, pipet. Cara bermain: Demonstrasikan bagaimana mineral berbeda menghasilkan warna api berbeda. Anak-anak menggambar dan mewarnai api sesuai pengamatan.',
          },
          {
            activityNumber: 3,
            title: 'Melukis dengan Lilin dan Cat Air (Kreativitas, Kemandirian)',
            toolsAndMaterials: 'Kertas, lilin putih, cat air, kuas',
            howToPlay:
              'Anak-anak menggambar dengan lilin (tidak terlihat), lalu mewarnai dengan cat air. Gambar lilin akan muncul, mendemonstrasikan sifat air dan minyak.',
            fullDescription:
              'Kegiatan 3: Melukis dengan Lilin dan Cat Air (Kreativitas, Kemandirian). Alat dan bahan: Kertas, lilin putih, cat air, kuas. Cara bermain: Anak-anak menggambar dengan lilin (tidak terlihat), lalu mewarnai dengan cat air. Gambar lilin akan muncul, mendemonstrasikan sifat air dan minyak.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Belajar Menganal Jam (Penalaran Kritis, Kemandirian). Alat dan Bahan: Hula hop, balok Kayu, kardus bekas, penggaris, lem, gunting. Cara Membuat dan Memainkannya: Pertama, buatlah jam terlebih dahulu dengan membuat bentuk lingkaran diatas kardus bekas menggunakan piring. Buat printable bentuk jam dinding tanpa gambar jarum jam, lalu gunting dan tempelkan diatas kardus. Buat 2 bentuk jarum dengan ukuran yang berbeda (Panjang dan pendek). Selanjutnya, buat dadu yang masing-masing sisi dadu berisi pukul atau waktu (missal 12:00, 2:00, 5:00). Tata, hula hop diatas balok kayu, untuk rintangan anak-anak agar dapat melewati hingga sampai di depan meja yang berisi jam. Kemudian , mintalah anak-anak untuk melempar dadu dan lihat berapa angka yang ke luar di atas dadu, jika yang keluar angka 4:00 berati anak harus memasangkan jarum panjang pada angka 12 dan jarum pendek di angka 4, lakukan hal yang sama untuk anak-anak lainnyaKegiatan 2 : Eksperimen Pembakaran Kertas (Penalaran Kritis, Kesehatan). Alat dan bahan: Berbagai jenis kertas, pinset, wadah logam, air (dilakukan oleh orang dewasa dengan pengawasan ketat). Cara bermain: Demonstrasikan bagaimana kertas berbeda terbakar dengan kecepatan berbeda. Anak-anak mencatat observasi dan berhipotesis mengapa. Kegiatan 3 : Eksperimen Suhu dan Warna (Kreativitas, Komunikasi). Alat dan bahan: Kertas thermochromic (berubah warna dengan suhu), es, air hangat. Cara bermain: Anak-anak mengamati perubahan warna kertas saat terkena suhu berbeda, membuat hubungan antara panas dan perubahan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Belajar Menganal Jam (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Hula hop, balok Kayu, kardus bekas, penggaris, lem, gunting',
            howToPlay:
              'dan Memainkannya: Pertama, buatlah jam terlebih dahulu dengan membuat bentuk lingkaran diatas kardus bekas menggunakan piring. Buat printable bentuk jam dinding tanpa gambar jarum jam, lalu gunting dan tempelkan diatas kardus. Buat 2 bentuk jarum dengan ukuran yang berbeda (Panjang dan pendek). Selanjutnya, buat dadu yang masing-masing sisi dadu berisi pukul atau waktu (missal 12:00, 2:00, 5:00). Tata, hula hop diatas balok kayu, untuk rintangan anak-anak agar dapat melewati hingga sampai di depan meja yang berisi jam. Kemudian , mintalah anak-anak untuk melempar dadu dan lihat berapa angka yang ke luar di atas dadu, jika yang keluar angka 4:00 berati anak harus memasangkan jarum panjang pada angka 12 dan jarum pendek di angka 4, lakukan hal yang sama untuk anak-anak lainnya',
            fullDescription:
              'Kegiatan 1: Belajar Menganal Jam (Penalaran Kritis, Kemandirian). Alat dan Bahan: Hula hop, balok Kayu, kardus bekas, penggaris, lem, gunting. Cara Membuat dan Memainkannya: Pertama, buatlah jam terlebih dahulu dengan membuat bentuk lingkaran diatas kardus bekas menggunakan piring. Buat printable bentuk jam dinding tanpa gambar jarum jam, lalu gunting dan tempelkan diatas kardus. Buat 2 bentuk jarum dengan ukuran yang berbeda (Panjang dan pendek). Selanjutnya, buat dadu yang masing-masing sisi dadu berisi pukul atau waktu (missal 12:00, 2:00, 5:00). Tata, hula hop diatas balok kayu, untuk rintangan anak-anak agar dapat melewati hingga sampai di depan meja yang berisi jam. Kemudian , mintalah anak-anak untuk melempar dadu dan lihat berapa angka yang ke luar di atas dadu, jika yang keluar angka 4:00 berati anak harus memasangkan jarum panjang pada angka 12 dan jarum pendek di angka 4, lakukan hal yang sama untuk anak-anak lainnya',
          },
          {
            activityNumber: 2,
            title: 'Eksperimen Pembakaran Kertas (Penalaran Kritis, Kesehatan)',
            toolsAndMaterials:
              'Berbagai jenis kertas, pinset, wadah logam, air (dilakukan oleh orang dewasa dengan pengawasan ketat)',
            howToPlay:
              'Demonstrasikan bagaimana kertas berbeda terbakar dengan kecepatan berbeda. Anak-anak mencatat observasi dan berhipotesis mengapa.',
            fullDescription:
              'Kegiatan 2: Eksperimen Pembakaran Kertas (Penalaran Kritis, Kesehatan). Alat dan bahan: Berbagai jenis kertas, pinset, wadah logam, air (dilakukan oleh orang dewasa dengan pengawasan ketat). Cara bermain: Demonstrasikan bagaimana kertas berbeda terbakar dengan kecepatan berbeda. Anak-anak mencatat observasi dan berhipotesis mengapa.',
          },
          {
            activityNumber: 3,
            title: 'Eksperimen Suhu dan Warna (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Kertas thermochromic (berubah warna dengan suhu), es, air hangat',
            howToPlay:
              'Anak-anak mengamati perubahan warna kertas saat terkena suhu berbeda, membuat hubungan antara panas dan perubahan.',
            fullDescription:
              'Kegiatan 3: Eksperimen Suhu dan Warna (Kreativitas, Komunikasi). Alat dan bahan: Kertas thermochromic (berubah warna dengan suhu), es, air hangat. Cara bermain: Anak-anak mengamati perubahan warna kertas saat terkena suhu berbeda, membuat hubungan antara panas dan perubahan.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Daur ulang Kerajinan Jamur 3D Menggunakan Kertas Dan Botol Plastik (Kewargaan, Kreativitas). Alat dan Bahan: Kertas kerajinan (warna merah, hitam dan putih), Jangka (benda berbentuk lingkaran), Pensil , Penggaris, Lem, Botol plastik (ukuran sedang), Gunting, Kawat bulu (opsional dapat di ganti dengan benang). Cara Membuat :Buat gambar lingkaran di atas kertas kerajinan warna merah dengan jangka atau benda yang berbentuk lingkaran, gambar lingkaran kecil di tengah lingkaran besar itu dan gunakan gambar skala garis dari tengah lingkaran, potong gari lurus pada gambar lingkaran di atas kertas warna merah. Potong lingkaran kecil yang terdapat pada tengah-tengah lingkaran besar di atas kertas warna merah. Letakkan kepala botol plastik tepat di lingkaran kecil yang sudah di potong, kemudian rekatkan ujung-ujung lingkaran besar yang sudah di gunting, membentuk seperti kerucut. Gunting kertas warna putih membentuk bulatan-bulatan kecil ,lalu tempel menggunakan lem di atas kertas warna merah. Gunting kertas warna hitam membentuk mata, lalu tempel di bagian botol. Gunting kertas warna merah membentuk mulut, dan tempelkan pada botol plastik. Terakhir pasang kawat bulu pada mulut botol atas bisa di ganti dengan benang untuk peganganKegiatan 2 : Poster Infografis: Apa yang Terbakar? (Komunikasi, Kolaborasi). Alat dan bahan: Kertas poster, gambar berbagai benda, spidol. Cara bermain: Anak-anak membuat infografis sederhana mengelompokkan benda berdasarkan kemampuan terbakar, menambahkan keterangan singkat. Kegiatan 3 : Pengelompokan Sumber Api (Penalaran Kritis, Kemandirian). Alat dan bahan: Kartu bergambar berbagai sumber api (korek api, kompor, lilin, api unggun). Cara bermain: Anak-anak mengelompokkan kartu berdasarkan ukuran api, menghitung jumlah dalam setiap kelompok.',
        activities: [
          {
            activityNumber: 1,
            title:
              'Daur ulang Kerajinan Jamur 3D Menggunakan Kertas Dan Botol Plastik (Kewargaan, Kreativitas)',
            toolsAndMaterials:
              'Kertas kerajinan (warna merah, hitam dan putih), Jangka (benda berbentuk lingkaran), Pensil , Penggaris, Lem, Botol plastik (ukuran sedang), Gunting, Kawat bulu (opsional dapat di ganti dengan benang)',
            howToPlay:
              'Buat gambar lingkaran di atas kertas kerajinan warna merah dengan jangka atau benda yang berbentuk lingkaran, gambar lingkaran kecil di tengah lingkaran besar itu dan gunakan gambar skala garis dari tengah lingkaran, potong gari lurus pada gambar lingkaran di atas kertas warna merah. Potong lingkaran kecil yang terdapat pada tengah-tengah lingkaran besar di atas kertas warna merah. Letakkan kepala botol plastik tepat di lingkaran kecil yang sudah di potong, kemudian rekatkan ujung-ujung lingkaran besar yang sudah di gunting, membentuk seperti kerucut. Gunting kertas warna putih membentuk bulatan-bulatan kecil ,lalu tempel menggunakan lem di atas kertas warna merah. Gunting kertas warna hitam membentuk mata, lalu tempel di bagian botol. Gunting kertas warna merah membentuk mulut, dan tempelkan pada botol plastik. Terakhir pasang kawat bulu pada mulut botol atas bisa di ganti dengan benang untuk pegangan',
            fullDescription:
              'Kegiatan 1: Daur ulang Kerajinan Jamur 3D Menggunakan Kertas Dan Botol Plastik (Kewargaan, Kreativitas). Alat dan Bahan: Kertas kerajinan (warna merah, hitam dan putih), Jangka (benda berbentuk lingkaran), Pensil , Penggaris, Lem, Botol plastik (ukuran sedang), Gunting, Kawat bulu (opsional dapat di ganti dengan benang). Cara Membuat :Buat gambar lingkaran di atas kertas kerajinan warna merah dengan jangka atau benda yang berbentuk lingkaran, gambar lingkaran kecil di tengah lingkaran besar itu dan gunakan gambar skala garis dari tengah lingkaran, potong gari lurus pada gambar lingkaran di atas kertas warna merah. Potong lingkaran kecil yang terdapat pada tengah-tengah lingkaran besar di atas kertas warna merah. Letakkan kepala botol plastik tepat di lingkaran kecil yang sudah di potong, kemudian rekatkan ujung-ujung lingkaran besar yang sudah di gunting, membentuk seperti kerucut. Gunting kertas warna putih membentuk bulatan-bulatan kecil ,lalu tempel menggunakan lem di atas kertas warna merah. Gunting kertas warna hitam membentuk mata, lalu tempel di bagian botol. Gunting kertas warna merah membentuk mulut, dan tempelkan pada botol plastik. Terakhir pasang kawat bulu pada mulut botol atas bisa di ganti dengan benang untuk pegangan',
          },
          {
            activityNumber: 2,
            title: 'Poster Infografis: Apa yang Terbakar? (Komunikasi, Kolaborasi)',
            toolsAndMaterials: 'Kertas poster, gambar berbagai benda, spidol',
            howToPlay:
              'Anak-anak membuat infografis sederhana mengelompokkan benda berdasarkan kemampuan terbakar, menambahkan keterangan singkat.',
            fullDescription:
              'Kegiatan 2: Poster Infografis: Apa yang Terbakar? (Komunikasi, Kolaborasi). Alat dan bahan: Kertas poster, gambar berbagai benda, spidol. Cara bermain: Anak-anak membuat infografis sederhana mengelompokkan benda berdasarkan kemampuan terbakar, menambahkan keterangan singkat.',
          },
          {
            activityNumber: 3,
            title: 'Pengelompokan Sumber Api (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials:
              'Kartu bergambar berbagai sumber api (korek api, kompor, lilin, api unggun)',
            howToPlay:
              'Anak-anak mengelompokkan kartu berdasarkan ukuran api, menghitung jumlah dalam setiap kelompok.',
            fullDescription:
              'Kegiatan 3: Pengelompokan Sumber Api (Penalaran Kritis, Kemandirian). Alat dan bahan: Kartu bergambar berbagai sumber api (korek api, kompor, lilin, api unggun). Cara bermain: Anak-anak mengelompokkan kartu berdasarkan ukuran api, menghitung jumlah dalam setiap kelompok.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : Senter Karakter (Kreativitas, Komunikasi). Alat dan Bahan , Gelas kertas, Selotip, Spidol, Senter, Gunting/cutter, Cara Membuat dan Memainkannya: Sediakan gelas kertas, kemudian lubangi bagian bawah gelas. Rekatkan selotip pada gelas kertas yang sudah di lubangi. Gambar di atas selotip berbagai macam bentuk sesuai kreativitas dan imajinasi anak-anak menggunakan spidol. Nyalakan senter, dengan memasukkan senter ke dalam gelas dan menghadapkan pada selotip yang sudah di gambar. Kegiatan 2 : Bentuk Geometris Api (Penalaran Kritis, Kreativitas). Alat dan bahan: Kertas berwarna (merah, oranye, kuning), gunting, lem. Cara bermain: Anak-anak memotong bentuk geometris (segitiga, lingkaran) untuk membuat kolase api, menghitung jumlah setiap bentuk yang digunakan. Kegiatan 3 : Berat Bahan Bakar (Penalaran Kritis, Kolaborasi). Alat dan bahan: Timbangan mainan, berbagai benda yang mewakili bahan bakar (batu untuk batu bara, stik untuk kayu). Cara bermain: Anak-anak menimbang dan membandingkan berat berbagai bahan bakar, mengurutkan dari yang teringan hingga terberat.',
        activities: [
          {
            activityNumber: 1,
            title: 'Senter Karakter (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Gelas kertas, Selotip, Spidol, Senter, Gunting/cutter',
            howToPlay:
              'dan Memainkannya: Sediakan gelas kertas, kemudian lubangi bagian bawah gelas. Rekatkan selotip pada gelas kertas yang sudah di lubangi. Gambar di atas selotip berbagai macam bentuk sesuai kreativitas dan imajinasi anak-anak menggunakan spidol. Nyalakan senter, dengan memasukkan senter ke dalam gelas dan menghadapkan pada selotip yang sudah di gambar.',
            fullDescription:
              'Kegiatan 1: Senter Karakter (Kreativitas, Komunikasi). Alat dan Bahan , Gelas kertas, Selotip, Spidol, Senter, Gunting/cutter, Cara Membuat dan Memainkannya: Sediakan gelas kertas, kemudian lubangi bagian bawah gelas. Rekatkan selotip pada gelas kertas yang sudah di lubangi. Gambar di atas selotip berbagai macam bentuk sesuai kreativitas dan imajinasi anak-anak menggunakan spidol. Nyalakan senter, dengan memasukkan senter ke dalam gelas dan menghadapkan pada selotip yang sudah di gambar.',
          },
          {
            activityNumber: 2,
            title: 'Bentuk Geometris Api (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials: 'Kertas berwarna (merah, oranye, kuning), gunting, lem',
            howToPlay:
              'Anak-anak memotong bentuk geometris (segitiga, lingkaran) untuk membuat kolase api, menghitung jumlah setiap bentuk yang digunakan.',
            fullDescription:
              'Kegiatan 2: Bentuk Geometris Api (Penalaran Kritis, Kreativitas). Alat dan bahan: Kertas berwarna (merah, oranye, kuning), gunting, lem. Cara bermain: Anak-anak memotong bentuk geometris (segitiga, lingkaran) untuk membuat kolase api, menghitung jumlah setiap bentuk yang digunakan.',
          },
          {
            activityNumber: 3,
            title: 'Berat Bahan Bakar (Penalaran Kritis, Kolaborasi)',
            toolsAndMaterials:
              'Timbangan mainan, berbagai benda yang mewakili bahan bakar (batu untuk batu bara, stik untuk kayu)',
            howToPlay:
              'Anak-anak menimbang dan membandingkan berat berbagai bahan bakar, mengurutkan dari yang teringan hingga terberat.',
            fullDescription:
              'Kegiatan 3: Berat Bahan Bakar (Penalaran Kritis, Kolaborasi). Alat dan bahan: Timbangan mainan, berbagai benda yang mewakili bahan bakar (batu untuk batu bara, stik untuk kayu). Cara bermain: Anak-anak menimbang dan membandingkan berat berbagai bahan bakar, mengurutkan dari yang teringan hingga terberat.',
          },
        ],
      },
    ],
    closingActivities: [
      'Recalling kegiatan hari ini dengan menanyakan perasaan anak',
      'Berdiskusi kegiatan yang dilakukan dan anak bangga menunjukkan hasil karya',
      'Penyimpulan bersama dan penguatan sikap-sikap yang dipelajari',
      'Permainan Pemadam Kebakaran Hero - anak berpura-pura jadi pemadam kebakaran dengan gerakan menyemprotkan air',
      'Bernyanyi lagu Hati-hati dengan Api sambil bertepuk tangan dengan irama riang',
      'Yel-yel keselamatan bersama: Api bahaya, kita harus hati-hati, yeay!',
      'Memberikan stiker bintang Pahlawan Keselamatan untuk setiap anak',
      'Menginformasikan kegiatan seru untuk esok hari dengan antusias',
      'Berdoa dengan gembira dan high-five sebelum pulang',
      'Berbaris sambil menyanyikan lagu perpisahan dengan semangat',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan minimal 3 sumber api yang ada di rumah (kompor, lilin, korek api) saat wawancara awal',
      },
      {
        no: 2,
        indicator:
          'Anak mampu menjelaskan minimal 3 bahaya api (membakar kulit, menimbulkan asap, menyebar cepat) dengan bahasa sederhana',
      },
      {
        no: 3,
        indicator:
          'Anak dapat mendemonstrasikan 2 langkah penyelamatan diri (merangkak rendah, tutup hidung dengan kain) dalam simulasi',
      },
      {
        no: 4,
        indicator:
          'Anak mampu mengidentifikasi benda yang mudah terbakar vs tahan api melalui kegiatan kolase dan permainan kartu',
      },
      {
        no: 5,
        indicator:
          'Anak dapat menjelaskan urutan proses terjadinya kebakaran (ada panas, ada bahan bakar, api menyebar) saat bercerita',
      },
      {
        no: 6,
        indicator:
          'Anak mampu menggunakan alat pemadam api sederhana (selimut api, ember air) dengan aman dalam simulasi',
      },
      {
        no: 7,
        indicator:
          'Anak dapat membuat poster keselamatan kebakaran yang informatif dengan minimal 3 elemen (gambar, tulisan, warna)',
      },
      {
        no: 8,
        indicator:
          'Anak mampu mempresentasikan hasil karya poster di depan teman dengan percaya diri dan suara jelas',
      },
      {
        no: 9,
        indicator:
          'Anak menunjukkan sikap hati-hati dan mengikuti aturan keselamatan selama eksperimen dengan pengawasan',
      },
      {
        no: 10,
        indicator:
          'Anak dapat bekerja sama dengan teman dalam kegiatan kelompok dan berbagi alat dengan tertib',
      },
      {
        no: 11,
        indicator:
          'Anak mampu merespons dengan tepat saat mendengar alarm kebakaran atau instruksi darurat dalam simulasi',
      },
      {
        no: 12,
        indicator:
          'Anak dapat mengomunikasikan pesan keselamatan api kepada teman atau keluarga menggunakan kata-kata sendiri',
      },
    ],
    assessmentSteps: {
      initial: [
        'Lakukan wawancara sederhana dengan setiap anak tentang pengalaman mereka dengan api di rumah',
        'Tunjukkan gambar berbagai sumber api dan minta anak menyebutkan apa yang mereka ketahui',
        'Amati reaksi dan respons anak saat menonton video/cerita tentang api dan kebakaran',
        'Dokumentasikan pengetahuan awal anak melalui lembar observasi dengan checklist',
        'Catat kemampuan motorik anak melalui kegiatan pemanasan sederhana',
        'Rekam kemampuan komunikasi anak saat menjawab pertanyaan pemantik',
        'Identifikasi anak yang memiliki pengalaman traumatis dengan api untuk pendampingan khusus',
        'Asesmen dilakukan pada 15 menit pertama pembelajaran hari pertama',
      ],
      process: [
        'Amati dan dokumentasikan partisipasi anak dalam setiap eksperimen menggunakan foto berseri',
        'Catat kemampuan anak menjelaskan sebab akibat melalui catatan anekdot selama diskusi',
        'Rekam video singkat saat anak mendemonstrasikan simulasi penyelamatan diri',
        'Kumpulkan dan dokumentasikan semua hasil karya anak (poster, kolase, lukisan)',
        'Observasi kemampuan kerja sama anak dalam kegiatan kelompok menggunakan rubrik sederhana',
        'Pantau perkembangan kemampuan komunikasi anak saat presentasi mini setiap hari',
        'Catat kemajuan pemahaman anak melalui dialog informal selama kegiatan berlangsung',
        'Dokumentasikan kreativitas anak dalam membuat solusi keselamatan',
        'Amati kepatuhan anak terhadap aturan keselamatan selama eksperimen',
      ],
      final: [
        'Minta anak mendemonstrasikan 2 langkah penyelamatan diri dan rekam dalam video',
        'Evaluasi kemampuan anak menyebutkan 3 bahaya api melalui wawancara terstruktur',
        'Penilaian hasil poster keselamatan menggunakan rubrik dengan kriteria sederhana (informasi, kreativitas, kerapihan)',
        'Amati kemampuan anak mengidentifikasi sumber api potensial melalui permainan kartu',
        'Lakukan simulasi kebakaran mini dan amati respons anak terhadap prosedur keselamatan',
        'Minta anak menceritakan kembali proses terjadinya kebakaran dengan urutan yang benar',
        'Evaluasi kemampuan anak menggunakan alat pemadam sederhana dalam simulasi aman',
        'Dokumentasikan kemampuan anak mempresentasikan poster dengan percaya diri',
        'Berikan asesmen diri sederhana: minta anak menunjukkan jempol (paham/belum paham)',
        'Lakukan refleksi bersama tentang pembelajaran dan catat respons anak',
        'Asesmen akhir dilakukan pada hari ke-6 dengan durasi 30 menit',
        'Kompilasi semua hasil asesmen dalam portofolio individual anak',
      ],
    },
  },
  {
    weekNum: 17,
    filename: '53_TK_B_Smt1_17_Udara.docx',
    title: 'MANUSIA MENGHIRUP UDARA',
    topic: 'MITIGASI BENCANA',
    subtopic: 'UDARA',
    modelPembelajaran: 'STEAM',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'November 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: true,
      },
      {
        name: 'Cinta Ilmu',
        checked: false,
      },
      {
        name: 'Cinta Lingkungan',
        checked: true,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: false,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: true,
      },
      {
        name: 'Ekologis',
        checked: false,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun kelompok B memiliki kemampuan motorik kasar yang berkembang pesat dan senang melakukan eksperimen sederhana. Mereka mulai menunjukkan keingintahuan tinggi terhadap fenomena alam sekitar, memiliki rentang perhatian yang lebih panjang, dan dapat mengikuti instruksi bertahap. Kemampuan bahasa mereka berkembang untuk mengekspresikan ide dan bertanya, serta mulai memahami konsep sebab-akibat sederhana.',
      learningMaterial:
        'Pembelajaran tentang udara dan angin mencakup pengetahuan esensial tentang sifat-sifat udara yang tidak terlihat namun dapat dirasakan, pengetahuan aplikatif melalui eksperimen dan permainan yang melibatkan udara, serta pengetahuan nilai dan karakter tentang mensyukuri ciptaan Tuhan dan kepedulian terhadap lingkungan. Materi ini sangat relevan dengan kehidupan sehari-hari anak dan dapat dipelajari melalui pengalaman langsung.',
    },
    learningDesign: {
      cp: 'CP Dasar Literasi dan STEAM: Sub Elemen: Murid menunjukkan rasa ingin tahu melalui observasi, eksplorasi, dan eksperimen dengan menggunakan lingkungan sekitar dan media sebagai sumber belajar untuk mendapatkan gagasan mengenai fenomena alam dan sosialCP Dasar Literasi dan STEAM: Murid mampu mengamati, menyebutkan alasan, pilihan atau keputusannya, mampu memecahkan masalah sederhana, serta mengetahui hubungan sebab akibat dari suatu kondisi atau situasi yang dipengaruhi oleh hukum alam dan kondisi sosial',
      crossDisciplinary:
        'Nilai agama dan moral (mensyukuri ciptaan Tuhan melalui pengamatan udara), Nilai Pancasila (kerjasama dalam eksperimen kelompok), Fisik motorik (gerakan meniup dan melempar), Kognitif (memahami konsep sebab akibat angin), Bahasa (mengungkapkan hasil pengamatan), Sosial emosional (berbagi peralatan dan bekerja sama)',
      tp: 'Anak dapat menceritakan peristiwa alam melalui percobaan sederhana tentang udara dan angin, mampu menyelesaikan masalah sederhana dalam eksperimen, serta mengungkapkan hasil karya yang dibuat secara lengkap dan berhubungan dengan fenomena udara di lingkungan sekitar.',
      pedagogicalPractice:
        'Pembelajaran menggunakan pendekatan bermain eksploratif dengan eksperimen sains sederhana, bercerita interaktif tentang fenomena udara, bernyanyi untuk mengenalkan konsep, dan eksplorasi langsung melalui permainan fisik. Metode ini mendukung prinsip berkesadaran melalui pengamatan fokus, bermakna melalui pengalaman langsung, dan menggembirakan melalui permainan aktif.',
      partnership:
        'Melibatkan orangtua dalam berbagi pengalaman tentang angin di rumah, guru sebagai fasilitator eksperimen, dan sesama anak sebagai partner dalam aktivitas kolaboratif dan saling berbagi hasil pengamatan.',
      environment:
        'Ruang kelas yang fleksibel untuk eksperimen, area outdoor untuk aktivitas angin, sudut sains dengan alat peraga udara, dan lingkungan yang aman untuk eksplorasi bebas dengan pengawasan yang mendukung kemandirian anak.',
      digitalUtilization:
        'Penggunaan video edukatif tentang udara dan angin, dokumentasi foto kegiatan anak, serta pemanfaatan platform digital untuk berbagi hasil karya anak dengan orang tua. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam dan doa pembuka dengan kesadaran penuh',
      'Senam gerakan angin untuk membangkitkan semangat',
      'Bercerita atau menonton video tentang petualangan udara',
      'Mengatur kesepakatan bermain dan eksplorasi',
      'Mempersiapkan alat dan bahan dengan antusias',
    ],
    openingQuestions: [
      'Apa ciptaan Tuhan yang tidak bisa kita lihat tapi bisa kita rasakan? (Keimanan dan Ketakwaan)',
      'Bagaimana cara kita berbagi mainan angin dengan teman? (Kewargaan)',
      'Mengapa bulu ayam bisa terbang tapi batu tidak bisa? (Penalaran Kritis)',
      'Apa yang terjadi jika kita membuat pesawat kertas dengan bentuk berbeda? (Kreativitas)',
      'Bagaimana cara kita bekerja sama membuat gelembung sabun besar? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri dengan udara? (Kemandirian)',
      'Bagaimana angin membantu tubuh kita tetap sejuk? (Kesehatan)',
      'Bagaimana cara menceritakan hasil percobaan angin kepada teman? (Komunikasi)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Membuat Telepon dari Bahan Daur Ulang (Kreativitas, Komunikasi). Alat dan bahan: gelas plastic, senar, lidi. Cara Membuat: Siapkan dua gelas plastic. Lubangi bagian bawah gelasMasukkan senar ke dalam lubang kemudian dari dalam ikatkan denan lidi agar senar tidak terlepas, lakukan hal yang sama untuk gelas plastic satunya. Nah telepon mainan sudah siap di gunakan. Kegiatan 2 : Lomba Tiup Bulu (Kesehatan, Kemandirian). Alat dan bahan: Bulu-bulu ringan atau kapas, meja panjang. Cara bermain: Letakkan bulu atau kapas di salah satu ujung meja. Minta anak-anak untuk meniup bulu atau kapas agar bergerak ke ujung meja lainnya. Buat garis finish dan adakan perlombaan siapa yang bisa membuat bulu atau kapas mencapai finish terlebih dahulu hanya dengan meniup. Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulut. Kegiatan 3 : Membuat dan Menerbangkan Pesawat Kertas (Penalaran Kritis, Kreativitas). Alat dan bahan: Kertas bekas, spidol, area terbuka. Cara bermain: Ajarkan anak-anak cara melipat berbagai jenis pesawat kertas. Biarkan mereka menghias pesawat mereka. Buat kompetisi dengan berbagai kategori, seperti pesawat yang terbang paling jauh, pesawat yang bisa mendarat di target tertentu, atau pesawat dengan desain paling kreatif. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang aerodinamika sederhana.',
        activities: [
          {
            activityNumber: 1,
            title: 'Membuat Telepon dari Bahan Daur Ulang (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'gelas plastic, senar, lidi',
            howToPlay:
              'Siapkan dua gelas plastic. Lubangi bagian bawah gelasMasukkan senar ke dalam lubang kemudian dari dalam ikatkan denan lidi agar senar tidak terlepas, lakukan hal yang sama untuk gelas plastic satunya. Nah telepon mainan sudah siap di gunakan.',
            fullDescription:
              'Kegiatan 1: Membuat Telepon dari Bahan Daur Ulang (Kreativitas, Komunikasi). Alat dan bahan: gelas plastic, senar, lidi. Cara Membuat: Siapkan dua gelas plastic. Lubangi bagian bawah gelasMasukkan senar ke dalam lubang kemudian dari dalam ikatkan denan lidi agar senar tidak terlepas, lakukan hal yang sama untuk gelas plastic satunya. Nah telepon mainan sudah siap di gunakan.',
          },
          {
            activityNumber: 2,
            title: 'Lomba Tiup Bulu (Kesehatan, Kemandirian)',
            toolsAndMaterials: 'Bulu-bulu ringan atau kapas, meja panjang',
            howToPlay:
              'Letakkan bulu atau kapas di salah satu ujung meja. Minta anak-anak untuk meniup bulu atau kapas agar bergerak ke ujung meja lainnya. Buat garis finish dan adakan perlombaan siapa yang bisa membuat bulu atau kapas mencapai finish terlebih dahulu hanya dengan meniup. Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulut.',
            fullDescription:
              'Kegiatan 2: Lomba Tiup Bulu (Kesehatan, Kemandirian). Alat dan bahan: Bulu-bulu ringan atau kapas, meja panjang. Cara bermain: Letakkan bulu atau kapas di salah satu ujung meja. Minta anak-anak untuk meniup bulu atau kapas agar bergerak ke ujung meja lainnya. Buat garis finish dan adakan perlombaan siapa yang bisa membuat bulu atau kapas mencapai finish terlebih dahulu hanya dengan meniup. Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulut.',
          },
          {
            activityNumber: 3,
            title: 'Membuat dan Menerbangkan Pesawat Kertas (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials: 'Kertas bekas, spidol, area terbuka',
            howToPlay:
              'Ajarkan anak-anak cara melipat berbagai jenis pesawat kertas. Biarkan mereka menghias pesawat mereka. Buat kompetisi dengan berbagai kategori, seperti pesawat yang terbang paling jauh, pesawat yang bisa mendarat di target tertentu, atau pesawat dengan desain paling kreatif. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang aerodinamika sederhana.',
            fullDescription:
              'Kegiatan 3: Membuat dan Menerbangkan Pesawat Kertas (Penalaran Kritis, Kreativitas). Alat dan bahan: Kertas bekas, spidol, area terbuka. Cara bermain: Ajarkan anak-anak cara melipat berbagai jenis pesawat kertas. Biarkan mereka menghias pesawat mereka. Buat kompetisi dengan berbagai kategori, seperti pesawat yang terbang paling jauh, pesawat yang bisa mendarat di target tertentu, atau pesawat dengan desain paling kreatif. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang aerodinamika sederhana.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Memasukkan Bola Ke Dalam Gelas (Penalaran Kritis, Kemandirian). Alat dan bahan: Baki atau nampan, gelas kertas, bola plastik, double tape. Cara Bermain: Siapkan baki atau nampan, kemudian rekatkan souble tape pada nampan kemudian satukan dengan gelas. Minta anak-anak untuk memegang nampan yang sudah di lem dengan gelas, kemudian letakkan bola pada nampan. Minta anak-anak untuk menggerakkan nampan agar bola dapat bergerak dan masuk ke dalam gelas. Bola dapat di letakkan pada nampan satu-satu. Kegiatan 2 : Gelembung Sabun Raksasa (Kolaborasi, Kreativitas). Alat dan bahan: Campuran air sabun, kawat pembentuk gelembung besar (bisa dibuat dari gantungan baju), wadah lebar. Cara bermain: Buat campuran air sabun dalam wadah lebar. Bentuk kawat menjadi lingkaran besar. Ajak anak-anak mencelupkan kawat ke dalam campuran sabun dan mengangkatnya perlahan, lalu berlari atau bergerak perlahan untuk membuat gelembung raksasa. Kegiatan ini melatih koordinasi gerakan tubuh dan pemahaman tentang tekanan udara. Kegiatan 3 : Menerbangkan Parasut Mini (Kesehatan, Penalaran Kritis). Alat dan bahan: Kain tipis atau plastik ringan berbentuk persegi, tali, batu kecil atau kerikil. Cara bermain: Buat parasut mini dengan mengikatkan tali pada keempat sudut kain atau plastik. Ikatkan batu kecil atau kerikil di ujung tali sebagai pemberat. Ajak anak-anak melemparkan parasut ke udara dan mengamati bagaimana udara menangkapnya. Mereka bisa berlari sambil memegang parasut untuk melihat efek angin. Kegiatan ini melatih koordinasi dan pemahaman tentang resistensi udara.',
        activities: [
          {
            activityNumber: 1,
            title: 'Memasukkan Bola Ke Dalam Gelas (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Baki atau nampan, gelas kertas, bola plastik, double tape',
            howToPlay:
              'Siapkan baki atau nampan, kemudian rekatkan souble tape pada nampan kemudian satukan dengan gelas. Minta anak-anak untuk memegang nampan yang sudah di lem dengan gelas, kemudian letakkan bola pada nampan. Minta anak-anak untuk menggerakkan nampan agar bola dapat bergerak dan masuk ke dalam gelas. Bola dapat di letakkan pada nampan satu-satu.',
            fullDescription:
              'Kegiatan 1: Memasukkan Bola Ke Dalam Gelas (Penalaran Kritis, Kemandirian). Alat dan bahan: Baki atau nampan, gelas kertas, bola plastik, double tape. Cara Bermain: Siapkan baki atau nampan, kemudian rekatkan souble tape pada nampan kemudian satukan dengan gelas. Minta anak-anak untuk memegang nampan yang sudah di lem dengan gelas, kemudian letakkan bola pada nampan. Minta anak-anak untuk menggerakkan nampan agar bola dapat bergerak dan masuk ke dalam gelas. Bola dapat di letakkan pada nampan satu-satu.',
          },
          {
            activityNumber: 2,
            title: 'Gelembung Sabun Raksasa (Kolaborasi, Kreativitas)',
            toolsAndMaterials:
              'Campuran air sabun, kawat pembentuk gelembung besar (bisa dibuat dari gantungan baju), wadah lebar',
            howToPlay:
              'Buat campuran air sabun dalam wadah lebar. Bentuk kawat menjadi lingkaran besar. Ajak anak-anak mencelupkan kawat ke dalam campuran sabun dan mengangkatnya perlahan, lalu berlari atau bergerak perlahan untuk membuat gelembung raksasa. Kegiatan ini melatih koordinasi gerakan tubuh dan pemahaman tentang tekanan udara.',
            fullDescription:
              'Kegiatan 2: Gelembung Sabun Raksasa (Kolaborasi, Kreativitas). Alat dan bahan: Campuran air sabun, kawat pembentuk gelembung besar (bisa dibuat dari gantungan baju), wadah lebar. Cara bermain: Buat campuran air sabun dalam wadah lebar. Bentuk kawat menjadi lingkaran besar. Ajak anak-anak mencelupkan kawat ke dalam campuran sabun dan mengangkatnya perlahan, lalu berlari atau bergerak perlahan untuk membuat gelembung raksasa. Kegiatan ini melatih koordinasi gerakan tubuh dan pemahaman tentang tekanan udara.',
          },
          {
            activityNumber: 3,
            title: 'Menerbangkan Parasut Mini (Kesehatan, Penalaran Kritis)',
            toolsAndMaterials:
              'Kain tipis atau plastik ringan berbentuk persegi, tali, batu kecil atau kerikil',
            howToPlay:
              'Buat parasut mini dengan mengikatkan tali pada keempat sudut kain atau plastik. Ikatkan batu kecil atau kerikil di ujung tali sebagai pemberat. Ajak anak-anak melemparkan parasut ke udara dan mengamati bagaimana udara menangkapnya. Mereka bisa berlari sambil memegang parasut untuk melihat efek angin. Kegiatan ini melatih koordinasi dan pemahaman tentang resistensi udara.',
            fullDescription:
              'Kegiatan 3: Menerbangkan Parasut Mini (Kesehatan, Penalaran Kritis). Alat dan bahan: Kain tipis atau plastik ringan berbentuk persegi, tali, batu kecil atau kerikil. Cara bermain: Buat parasut mini dengan mengikatkan tali pada keempat sudut kain atau plastik. Ikatkan batu kecil atau kerikil di ujung tali sebagai pemberat. Ajak anak-anak melemparkan parasut ke udara dan mengamati bagaimana udara menangkapnya. Mereka bisa berlari sambil memegang parasut untuk melihat efek angin. Kegiatan ini melatih koordinasi dan pemahaman tentang resistensi udara.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Mencocokkan Gambar Yang Sama (Penalaran Kritis, Kemandirian). Alat dan bahan :Gelas kertas, meja, spidol. Cara Membuat: Siapkan gelas kertas, kemudian gambar gelas pada bagian bawah (bisa berupa gambar sesuai tema, binatang, huruf, angka, buah, dan lainnya)Setiap satu gambar untuk 2 gelas (misalnya gambar apel, berti gelas yang di beri gambar apel sebanyak 2)Kemudian tata di atas meja secara acak, dan instruksikana anak-anak untuk mencoockan gambar yang sama yang terdapat pada gelas. Yang lebih dulu selesai itu pemenangnya. Kegiatan 2 : Mobil Balon (Kreativitas, Penalaran Kritis). Alat dan bahan: Kardus bekas, tutup botol untuk roda, sedotan, balon, lem, gunting. Cara bermain: Bantu anak-anak membuat mobil sederhana dari kardus bekas. Pasang tutup botol sebagai roda dan sedotan sebagai as. Pasang balon di bagian belakang mobil melalui sedotan. Tiup balon dan lepaskan mobil di lantai yang rata. Anak-anak dapat berlomba mobil balon mereka atau mencoba mengarahkan mobil ke target tertentu. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang gaya dorong udaraKegiatan 3 : Lompat Tali Angin (Kesehatan, Kolaborasi). Alat dan bahan: Tali panjang, pita atau kain ringan yang diikatkan pada tali. Cara bermain: Ikatkan beberapa pita atau potongan kain ringan pada tali panjang. Dua anak atau orang dewasa memegang ujung-ujung tali dan mengayunkannya. Anak-anak lain harus melompati tali sambil menghindari pita yang bergerak tertiup angin. Tingkatkan kesulitan dengan mengayunkan tali lebih cepat atau menambah pita. Kegiatan ini melatih koordinasi, keseimbangan, dan ketangkasan.',
        activities: [
          {
            activityNumber: 1,
            title: 'Mencocokkan Gambar Yang Sama (Penalaran Kritis, Kemandirian)',
            toolsAndMaterials: 'Gelas kertas, meja, spidol',
            howToPlay:
              'Siapkan gelas kertas, kemudian gambar gelas pada bagian bawah (bisa berupa gambar sesuai tema, binatang, huruf, angka, buah, dan lainnya)Setiap satu gambar untuk 2 gelas (misalnya gambar apel, berti gelas yang di beri gambar apel sebanyak 2)Kemudian tata di atas meja secara acak, dan instruksikana anak-anak untuk mencoockan gambar yang sama yang terdapat pada gelas. Yang lebih dulu selesai itu pemenangnya.',
            fullDescription:
              'Kegiatan 1: Mencocokkan Gambar Yang Sama (Penalaran Kritis, Kemandirian). Alat dan bahan :Gelas kertas, meja, spidol. Cara Membuat: Siapkan gelas kertas, kemudian gambar gelas pada bagian bawah (bisa berupa gambar sesuai tema, binatang, huruf, angka, buah, dan lainnya)Setiap satu gambar untuk 2 gelas (misalnya gambar apel, berti gelas yang di beri gambar apel sebanyak 2)Kemudian tata di atas meja secara acak, dan instruksikana anak-anak untuk mencoockan gambar yang sama yang terdapat pada gelas. Yang lebih dulu selesai itu pemenangnya.',
          },
          {
            activityNumber: 2,
            title: 'Mobil Balon (Kreativitas, Penalaran Kritis)',
            toolsAndMaterials: 'Kardus bekas, tutup botol untuk roda, sedotan, balon, lem, gunting',
            howToPlay:
              'Bantu anak-anak membuat mobil sederhana dari kardus bekas. Pasang tutup botol sebagai roda dan sedotan sebagai as. Pasang balon di bagian belakang mobil melalui sedotan. Tiup balon dan lepaskan mobil di lantai yang rata. Anak-anak dapat berlomba mobil balon mereka atau mencoba mengarahkan mobil ke target tertentu. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang gaya dorong udara',
            fullDescription:
              'Kegiatan 2: Mobil Balon (Kreativitas, Penalaran Kritis). Alat dan bahan: Kardus bekas, tutup botol untuk roda, sedotan, balon, lem, gunting. Cara bermain: Bantu anak-anak membuat mobil sederhana dari kardus bekas. Pasang tutup botol sebagai roda dan sedotan sebagai as. Pasang balon di bagian belakang mobil melalui sedotan. Tiup balon dan lepaskan mobil di lantai yang rata. Anak-anak dapat berlomba mobil balon mereka atau mencoba mengarahkan mobil ke target tertentu. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang gaya dorong udara',
          },
          {
            activityNumber: 3,
            title: 'Lompat Tali Angin (Kesehatan, Kolaborasi)',
            toolsAndMaterials: 'Tali panjang, pita atau kain ringan yang diikatkan pada tali',
            howToPlay:
              'Ikatkan beberapa pita atau potongan kain ringan pada tali panjang. Dua anak atau orang dewasa memegang ujung-ujung tali dan mengayunkannya. Anak-anak lain harus melompati tali sambil menghindari pita yang bergerak tertiup angin. Tingkatkan kesulitan dengan mengayunkan tali lebih cepat atau menambah pita. Kegiatan ini melatih koordinasi, keseimbangan, dan ketangkasan.',
            fullDescription:
              'Kegiatan 3: Lompat Tali Angin (Kesehatan, Kolaborasi). Alat dan bahan: Tali panjang, pita atau kain ringan yang diikatkan pada tali. Cara bermain: Ikatkan beberapa pita atau potongan kain ringan pada tali panjang. Dua anak atau orang dewasa memegang ujung-ujung tali dan mengayunkannya. Anak-anak lain harus melompati tali sambil menghindari pita yang bergerak tertiup angin. Tingkatkan kesulitan dengan mengayunkan tali lebih cepat atau menambah pita. Kegiatan ini melatih koordinasi, keseimbangan, dan ketangkasan.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        rawContent:
          'Kegiatan 1 : Eksperimen Balon, Garam dan Merica (Penalaran Kritis, Keimanan dan Ketakwaan). Alat dan Bahan :Balon (balon berwarna terang lebih disukai agar anak-anak dapat mengamati percobaan dengan jelas,), Garam, Lada Sendok Makan, Kain Wol Kering. Cara Membuat atau Memainkannya :Tiup balon terlebih dahulu dan anak-anak dapat menggambarnya sesuai keinginan mereka. Minta anak-anak untuk menakar satu sendok garam dan taburkan di atas piring. Kemudian tambahkan satu sendok lada dan campurkan dan masukkan ke dalam piring yang sudah di isi dengan garam, campur garam dan lada jadi satu. Dekatkan balon dengan lada dan mintalah anak-anak untuk mengamati ketika mendekatkan balon pada lada. Setelah itu gosokkan balon, dengan menggunakan kain kering atau kain wol. Jika sudah digosokkan terakhir, dekatkan balon pada campuran garam dan lada. Yang terjadi ketika balon yang sudah digosok dengan kain, maka merica menempel di balon tanpa menyentuhnya. Ini akan meningkatkan rasa ingin tahu anak-anak. Kegiatan 2 : Estafet Tiup Bola (Kolaborasi, Kesehatan). Alat dan bahan: Bola pingpong atau bola plastik ringan, sedotan, meja panjang. Cara bermain: Bagi anak-anak menjadi beberapa tim. Setiap tim berbaris di salah satu ujung meja. Letakkan bola di depan anak pertama. Mereka harus meniup bola menggunakan sedotan untuk memindahkannya ke ujung meja lainnya, lalu berlari ke ujung tersebut untuk giliran berikutnya. Tim yang menyelesaikan estafet terlebih dahulu adalah pemenangnya. Kegiatan ini melatih kontrol pernapasan dan koordinasiKegiatan 3 : Melukis dengan Tiupan (Kreativitas, Komunikasi). Alat dan bahan: Kertas, cat air cair, sedotan, celemek. Cara bermain: Teteskan beberapa warna cat air di atas kertas. Minta anak-anak menggunakan sedotan untuk meniup cat, menciptakan pola dan bentuk unik. Mereka bisa mencoba mengarahkan tiupan untuk membuat bentuk tertentu atau hanya bereksperimen dengan warna dan pola. Kegiatan ini melatih kontrol pernapasan dan kreativitas',
        activities: [
          {
            activityNumber: 1,
            title: 'Eksperimen Balon, Garam dan Merica (Penalaran Kritis, Keimanan dan Ketakwaan)',
            toolsAndMaterials:
              'Balon (balon berwarna terang lebih disukai agar anak-anak dapat mengamati percobaan dengan jelas,), Garam, Lada Sendok Makan, Kain Wol Kering',
            howToPlay:
              'atau Memainkannya :Tiup balon terlebih dahulu dan anak-anak dapat menggambarnya sesuai keinginan mereka. Minta anak-anak untuk menakar satu sendok garam dan taburkan di atas piring. Kemudian tambahkan satu sendok lada dan campurkan dan masukkan ke dalam piring yang sudah di isi dengan garam, campur garam dan lada jadi satu. Dekatkan balon dengan lada dan mintalah anak-anak untuk mengamati ketika mendekatkan balon pada lada. Setelah itu gosokkan balon, dengan menggunakan kain kering atau kain wol. Jika sudah digosokkan terakhir, dekatkan balon pada campuran garam dan lada. Yang terjadi ketika balon yang sudah digosok dengan kain, maka merica menempel di balon tanpa menyentuhnya. Ini akan meningkatkan rasa ingin tahu anak-anak.',
            fullDescription:
              'Kegiatan 1: Eksperimen Balon, Garam dan Merica (Penalaran Kritis, Keimanan dan Ketakwaan). Alat dan Bahan :Balon (balon berwarna terang lebih disukai agar anak-anak dapat mengamati percobaan dengan jelas,), Garam, Lada Sendok Makan, Kain Wol Kering. Cara Membuat atau Memainkannya :Tiup balon terlebih dahulu dan anak-anak dapat menggambarnya sesuai keinginan mereka. Minta anak-anak untuk menakar satu sendok garam dan taburkan di atas piring. Kemudian tambahkan satu sendok lada dan campurkan dan masukkan ke dalam piring yang sudah di isi dengan garam, campur garam dan lada jadi satu. Dekatkan balon dengan lada dan mintalah anak-anak untuk mengamati ketika mendekatkan balon pada lada. Setelah itu gosokkan balon, dengan menggunakan kain kering atau kain wol. Jika sudah digosokkan terakhir, dekatkan balon pada campuran garam dan lada. Yang terjadi ketika balon yang sudah digosok dengan kain, maka merica menempel di balon tanpa menyentuhnya. Ini akan meningkatkan rasa ingin tahu anak-anak.',
          },
          {
            activityNumber: 2,
            title: 'Estafet Tiup Bola (Kolaborasi, Kesehatan)',
            toolsAndMaterials: 'Bola pingpong atau bola plastik ringan, sedotan, meja panjang',
            howToPlay:
              'Bagi anak-anak menjadi beberapa tim. Setiap tim berbaris di salah satu ujung meja. Letakkan bola di depan anak pertama. Mereka harus meniup bola menggunakan sedotan untuk memindahkannya ke ujung meja lainnya, lalu berlari ke ujung tersebut untuk giliran berikutnya. Tim yang menyelesaikan estafet terlebih dahulu adalah pemenangnya. Kegiatan ini melatih kontrol pernapasan dan koordinasi',
            fullDescription:
              'Kegiatan 2: Estafet Tiup Bola (Kolaborasi, Kesehatan). Alat dan bahan: Bola pingpong atau bola plastik ringan, sedotan, meja panjang. Cara bermain: Bagi anak-anak menjadi beberapa tim. Setiap tim berbaris di salah satu ujung meja. Letakkan bola di depan anak pertama. Mereka harus meniup bola menggunakan sedotan untuk memindahkannya ke ujung meja lainnya, lalu berlari ke ujung tersebut untuk giliran berikutnya. Tim yang menyelesaikan estafet terlebih dahulu adalah pemenangnya. Kegiatan ini melatih kontrol pernapasan dan koordinasi',
          },
          {
            activityNumber: 3,
            title: 'Melukis dengan Tiupan (Kreativitas, Komunikasi)',
            toolsAndMaterials: 'Kertas, cat air cair, sedotan, celemek',
            howToPlay:
              'Teteskan beberapa warna cat air di atas kertas. Minta anak-anak menggunakan sedotan untuk meniup cat, menciptakan pola dan bentuk unik. Mereka bisa mencoba mengarahkan tiupan untuk membuat bentuk tertentu atau hanya bereksperimen dengan warna dan pola. Kegiatan ini melatih kontrol pernapasan dan kreativitas',
            fullDescription:
              'Kegiatan 3: Melukis dengan Tiupan (Kreativitas, Komunikasi). Alat dan bahan: Kertas, cat air cair, sedotan, celemek. Cara bermain: Teteskan beberapa warna cat air di atas kertas. Minta anak-anak menggunakan sedotan untuk meniup cat, menciptakan pola dan bentuk unik. Mereka bisa mencoba mengarahkan tiupan untuk membuat bentuk tertentu atau hanya bereksperimen dengan warna dan pola. Kegiatan ini melatih kontrol pernapasan dan kreativitas',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        rawContent:
          'Kegiatan 1 : STEAM Membuat Anemometer Dari Bahan Sederhana (Penalaran Kritis, Kreativitas). Alat dan bahan: 4 gelas kertas kecil, Pelubang buku, 2 sedotan kertas, Tusuk sate bambu, Karet gelang, Manik-manik , Playdough, Stopwatch, Kipas (opsional). Cara Membuat: Siapkan semua bahan yang akan di butuhkan. Kemudian lubangi gelas dengan menggunakan pelubang pada ke dua sisi yang simetris pada gelas, lakukan hal yang sama pada ketiga gelas lainnya yang akan di gunakan. Selanjutnya masukkan sedotan pada gelas yang sudah di lubangi. Ikatkan tusuk sate menggunakan karet gelang, kemudian masukkan sedotan dan beri manik-manik di atas sedotan untuk pembatas (ketika memasukkan sedotan paa tusuk sate, perhatikan arah gelas agar ke empatnya menghadap sama semua) Kemudian baru masukkan sedotan satunya dan paling ujung ikat dengan karet gelang agar sedotan tidak terlepas. Tusukkan tusuk sate pada playdough yang sudah di masukkan ke dalam gelas plastic agar tidak terjatuh ketika terkena angin. Lakukan uji coba dengan meniup salah satu gelas a[akah dapat berputar dengan baik atau tidak, dan lakukan uji coba lagi dengan kipas apakah mampu berputar lebih kencang, atau sama atau bahkan tidak mau bergerak. Kegiatan 2 : Lomba Kapal Daun (Kolaborasi, Kewargaan). Alat dan bahan: Daun besar (seperti daun pisang), ranting kecil untuk tiang, daun kecil untuk layar, wadah besar berisi air. Cara bermain: Bantu anak-anak membuat kapal sederhana dari daun besar dengan ranting sebagai tiang dan daun kecil sebagai layar. Isi wadah besar dengan air dan buat garis start dan finish. Anak-anak harus meniup kapal mereka dari start ke finish. Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulutKegiatan 3 : Tebak Benda dari Tiupan (Komunikasi, Penalaran Kritis). Alat dan bahan: Berbagai benda ringan (bulu, kapas, kertas, daun kering), kotak atau tas. Cara bermain: Masukkan berbagai benda ringan ke dalam kotak atau tas. Satu anak mengambil benda tanpa melihat dan harus meniupnya di depan teman-temannya. Teman-teman lain harus menebak benda apa yang ditiup berdasarkan cara benda tersebut bergerak di udara. Kegiatan ini melatih observasi dan pemahaman tentang sifat benda.',
        activities: [
          {
            activityNumber: 1,
            title: 'STEAM Membuat Anemometer Dari Bahan Sederhana (Penalaran Kritis, Kreativitas)',
            toolsAndMaterials:
              '4 gelas kertas kecil, Pelubang buku, 2 sedotan kertas, Tusuk sate bambu, Karet gelang, Manik-manik , Playdough, Stopwatch, Kipas (opsional)',
            howToPlay:
              'Siapkan semua bahan yang akan di butuhkan. Kemudian lubangi gelas dengan menggunakan pelubang pada ke dua sisi yang simetris pada gelas, lakukan hal yang sama pada ketiga gelas lainnya yang akan di gunakan. Selanjutnya masukkan sedotan pada gelas yang sudah di lubangi. Ikatkan tusuk sate menggunakan karet gelang, kemudian masukkan sedotan dan beri manik-manik di atas sedotan untuk pembatas (ketika memasukkan sedotan paa tusuk sate, perhatikan arah gelas agar ke empatnya menghadap sama semua) Kemudian baru masukkan sedotan satunya dan paling ujung ikat dengan karet gelang agar sedotan tidak terlepas. Tusukkan tusuk sate pada playdough yang sudah di masukkan ke dalam gelas plastic agar tidak terjatuh ketika terkena angin. Lakukan uji coba dengan meniup salah satu gelas a[akah dapat berputar dengan baik atau tidak, dan lakukan uji coba lagi dengan kipas apakah mampu berputar lebih kencang, atau sama atau bahkan tidak mau bergerak.',
            fullDescription:
              'Kegiatan 1: STEAM Membuat Anemometer Dari Bahan Sederhana (Penalaran Kritis, Kreativitas). Alat dan bahan: 4 gelas kertas kecil, Pelubang buku, 2 sedotan kertas, Tusuk sate bambu, Karet gelang, Manik-manik , Playdough, Stopwatch, Kipas (opsional). Cara Membuat: Siapkan semua bahan yang akan di butuhkan. Kemudian lubangi gelas dengan menggunakan pelubang pada ke dua sisi yang simetris pada gelas, lakukan hal yang sama pada ketiga gelas lainnya yang akan di gunakan. Selanjutnya masukkan sedotan pada gelas yang sudah di lubangi. Ikatkan tusuk sate menggunakan karet gelang, kemudian masukkan sedotan dan beri manik-manik di atas sedotan untuk pembatas (ketika memasukkan sedotan paa tusuk sate, perhatikan arah gelas agar ke empatnya menghadap sama semua) Kemudian baru masukkan sedotan satunya dan paling ujung ikat dengan karet gelang agar sedotan tidak terlepas. Tusukkan tusuk sate pada playdough yang sudah di masukkan ke dalam gelas plastic agar tidak terjatuh ketika terkena angin. Lakukan uji coba dengan meniup salah satu gelas a[akah dapat berputar dengan baik atau tidak, dan lakukan uji coba lagi dengan kipas apakah mampu berputar lebih kencang, atau sama atau bahkan tidak mau bergerak.',
          },
          {
            activityNumber: 2,
            title: 'Lomba Kapal Daun (Kolaborasi, Kewargaan)',
            toolsAndMaterials:
              'Daun besar (seperti daun pisang), ranting kecil untuk tiang, daun kecil untuk layar, wadah besar berisi air',
            howToPlay:
              'Bantu anak-anak membuat kapal sederhana dari daun besar dengan ranting sebagai tiang dan daun kecil sebagai layar. Isi wadah besar dengan air dan buat garis start dan finish. Anak-anak harus meniup kapal mereka dari start ke finish. Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulut',
            fullDescription:
              'Kegiatan 2: Lomba Kapal Daun (Kolaborasi, Kewargaan). Alat dan bahan: Daun besar (seperti daun pisang), ranting kecil untuk tiang, daun kecil untuk layar, wadah besar berisi air. Cara bermain: Bantu anak-anak membuat kapal sederhana dari daun besar dengan ranting sebagai tiang dan daun kecil sebagai layar. Isi wadah besar dengan air dan buat garis start dan finish. Anak-anak harus meniup kapal mereka dari start ke finish. Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulut',
          },
          {
            activityNumber: 3,
            title: 'Tebak Benda dari Tiupan (Komunikasi, Penalaran Kritis)',
            toolsAndMaterials:
              'Berbagai benda ringan (bulu, kapas, kertas, daun kering), kotak atau tas',
            howToPlay:
              'Masukkan berbagai benda ringan ke dalam kotak atau tas. Satu anak mengambil benda tanpa melihat dan harus meniupnya di depan teman-temannya. Teman-teman lain harus menebak benda apa yang ditiup berdasarkan cara benda tersebut bergerak di udara. Kegiatan ini melatih observasi dan pemahaman tentang sifat benda.',
            fullDescription:
              'Kegiatan 3: Tebak Benda dari Tiupan (Komunikasi, Penalaran Kritis). Alat dan bahan: Berbagai benda ringan (bulu, kapas, kertas, daun kering), kotak atau tas. Cara bermain: Masukkan berbagai benda ringan ke dalam kotak atau tas. Satu anak mengambil benda tanpa melihat dan harus meniupnya di depan teman-temannya. Teman-teman lain harus menebak benda apa yang ditiup berdasarkan cara benda tersebut bergerak di udara. Kegiatan ini melatih observasi dan pemahaman tentang sifat benda.',
          },
        ],
      },
    ],
    closingActivities: [
      'Pesta gelembung sabun bersama sambil berteriak Hore, aku bisa!',
      'Lomba cepat meniup balon dan melepaskannya terbang ke udara',
      'Tarian angin dengan gerakan berputar dan melompat riang',
      'Bernyanyi lagu Angin Sepoi-sepoi sambil tepuk tangan dan goyang',
      'Parade pesawat kertas terbang bersama di halaman',
      'Main Siapa yang paling kencang meniup dengan bulu-bulu warna-warni',
      'Sesi foto lucu dengan pose seperti ditiup angin kencang',
      'Tepuk tangan meriah untuk semua petualangan seru hari ini',
      'Teriak bersama Sampai jumpa angin! sambil lambaikan tangan',
      'Peluk group dan bernyanyi Disini Senang Disana Senang sebelum pulang',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menjawab pertanyaan terbuka tentang angin dengan minimal 2 jawaban yang relevan',
      },
      {
        no: 2,
        indicator:
          'Anak mampu meniup bulu ayam atau benda ringan dengan teknik yang tepat dan menunjukkan antusiasme',
      },
      {
        no: 3,
        indicator:
          'Anak dapat menjelaskan mengapa layang-layang bisa terbang dengan bahasa sederhana',
      },
      {
        no: 4,
        indicator:
          'Anak menunjukkan fokus minimal 10 menit pada satu aktivitas eksperimen tanpa gangguan',
      },
      {
        no: 5,
        indicator:
          'Anak mampu mengikuti instruksi bertahap (3-4 langkah) dalam membuat eksperimen sederhana',
      },
      {
        no: 6,
        indicator:
          'Anak dapat memecahkan masalah sederhana ketika eksperimen tidak berhasil dengan mencoba cara lain',
      },
      {
        no: 7,
        indicator:
          'Anak menunjukkan kemampuan berbagi alat dan bergiliran dengan teman selama aktivitas kelompok',
      },
      {
        no: 8,
        indicator:
          'Anak mampu mendemonstrasikan ulang minimal satu eksperimen kepada teman atau guru',
      },
      {
        no: 9,
        indicator:
          'Anak dapat memprediksi hasil eksperimen sebelum melakukan (Menurut kamu apa yang akan terjadi?)',
      },
      {
        no: 10,
        indicator:
          'Anak mampu menceritakan urutan kegiatan yang dilakukan dengan kronologi yang benar',
      },
      {
        no: 11,
        indicator:
          'Anak menunjukkan inovasi atau modifikasi dalam permainan (mengubah aturan atau cara bermain)',
      },
      {
        no: 12,
        indicator:
          'Anak mengekspresikan rasa syukur atau kekaguman terhadap ciptaan Tuhan melalui kata-kata atau ekspresi',
      },
    ],
    assessmentSteps: {
      initial: [],
      process: [],
      final: [],
    },
  },
  {
    weekNum: 18,
    filename: '54_TK_B_Smt1_18_Bumi.docx',
    title: 'MERAWAT BUMI TEMPAT KITA TINGGAL',
    topic: 'MITIGASI BENCANA',
    subtopic: 'BUMI',
    modelPembelajaran: 'STEAM, Coding',
    timeAllocation: '5 x 3 JP',
    grade: 'B (5-6 Tahun)',
    month: 'Desember 2026',
    dpl: [
      {
        name: 'DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME',
        checked: true,
      },
      {
        name: 'DPL 2: Kewargaan',
        checked: true,
      },
      {
        name: 'DPL 3: Penalaran Kritis',
        checked: true,
      },
      {
        name: 'DPL 4: Kreativitas',
        checked: true,
      },
      {
        name: 'DPL 5: Kolaborasi',
        checked: true,
      },
      {
        name: 'DPL 6: Kemandirian',
        checked: true,
      },
      {
        name: 'DPL 7: Kesehatan',
        checked: true,
      },
      {
        name: 'DPL 8: Komunikasi',
        checked: true,
      },
    ],
    kbcImplementation: [
      {
        name: 'Cinta Alloh dan RosulNya',
        checked: true,
      },
      {
        name: 'Cinta Ilmu',
        checked: true,
      },
      {
        name: 'Cinta Lingkungan',
        checked: false,
      },
      {
        name: 'Cinta Diri dan Sesama Manusia',
        checked: false,
      },
      {
        name: 'Cinta Tanah Air',
        checked: true,
      },
    ],
    kbcValues: [
      {
        name: 'Spiritual',
        checked: false,
      },
      {
        name: 'Personal',
        checked: false,
      },
      {
        name: 'Sosial',
        checked: false,
      },
      {
        name: 'Intelektual',
        checked: false,
      },
      {
        name: 'Kebangsaan',
        checked: false,
      },
      {
        name: 'Ekologis',
        checked: true,
      },
    ],
    identification: {
      students:
        'Anak usia 5-6 tahun (Kelompok B) memiliki kemampuan motorik kasar dan halus yang berkembang pesat, mulai memahami konsep abstrak sederhana, menunjukkan rasa ingin tahu tinggi terhadap lingkungan sekitar, dan mampu berinteraksi sosial dengan teman sebaya. Mereka memiliki daya konsentrasi 15-20 menit dan senang dengan kegiatan eksploratif yang melibatkan eksplorasi langsung.',
      learningMaterial:
        'Materi tentang bumi dan lingkungan mencakup pengetahuan faktual tentang makhluk hidup dan benda mati, konsep dasar pelestarian lingkungan, keterampilan merawat tumbuhan dan hewan, serta sikap peduli terhadap ciptaan Tuhan. Materi dikemas secara konkret melalui pengalaman langsung, relevan dengan kehidupan sehari-hari anak, dan mengintegrasikan nilai-nilai spiritual dan moral untuk membentuk karakter peduli lingkungan.',
    },
    learningDesign: {
      cp: 'CP Nilai Agama dan Budi Pekerti: Murid menghargai alam dan seluruh makhluk hidup ciptaan Tuhan Yang Maha EsaCP Dasar Literasi dan STEAM: Anak memiliki kemampuan menyatakan hubungan antar bilangan dengan berbagai cara, mengidentifikasi pola, mengenali bentuk dan karakteristik benda di sekitar yang dapat dibandingkan dan diukur',
      crossDisciplinary:
        'Nilai agama dan moral (menghargai ciptaan Tuhan melalui kegiatan merawat lingkungan), Nilai Pancasila (gotong royong dalam menjaga bumi bersama), Fisik motorik (kegiatan mengoper tongkat dan membuat kolase), Kognitif (mengenali pola alam dan memahami konsep gempa), Bahasa (bercerita tentang pengalaman merawat bumi), Sosial emosional (bekerja sama dalam proyek lingkungan)',
      tp: 'Anak dapat memahami pentingnya menjaga kelestarian lingkungan sebagai bentuk rasa syukur atas ciptaan Tuhan, Anak mampu mempraktikkan cara-cara sederhana untuk merawat lingkungan, Anak dapat menunjukkan kepedulian terhadap makhluk hidup di sekitarnya, serta Anak mampu mengenali pola dan hubungan antar benda yang berkaitan dengan bumi.',
      pedagogicalPractice:
        'Pembelajaran dilaksanakan melalui bermain eksploratif dengan eksperimen sederhana, bercerita interaktif tentang lingkungan, bernyanyi lagu-lagu alam, dan eksplorasi langsung di lingkungan sekitar. Pendekatan ini sesuai karena anak usia dini belajar optimal melalui pengalaman konkret yang menyenangkan, membangun kesadaran melalui discovery learning, dan menciptakan makna melalui keterlibatan aktif dalam kegiatan bermain yang menggembirakan.',
      partnership:
        'Melibatkan guru kelas, komunitas peduli lingkungan, pengelola bank sampah, dan masyarakat sekitar. Orang tua berpartisipasi dalam kegiatan home-based learning. Kemitraan ini memperkaya pengalaman belajar anak tentang praktik nyata peduli lingkungan.',
      environment:
        'Pembelajaran mengintegrasikan ruang kelas yang nyaman dengan area outdoor untuk eksplorasi alam. Lingkungan virtual berupa video dan gambar interaktif. Budaya belajar kolaboratif dan eksploratif dikembangkan dengan suasana yang mendukung rasa ingin tahu anak.',
      digitalUtilization:
        'Pemanfaatan teknologi digital untuk menampilkan video edukatif, media pembelajaran interaktif, dan dokumentasi proses pembelajaran anak. Teknologi digunakan sebagai alat bantu yang mendukung pembelajaran bermakna dan sesuai dengan tahap perkembangan anak. Dukungan media ajar digital tersedia melalui berbagai platform digital',
    },
    openingActivities: [
      'Salam, doa pembuka, dan ice breaking',
      'Renungan pagi dengan tema bersyukur atas ciptaan Tuhan',
      'Menyanyikan lagu bertema lingkungan',
      'Asesmen awal tentang pengetahuan anak tentang lingkungan',
      'Kegiatan pemantik berupa cerita/video Aku Sayang Bumi',
      'Diskusi ide-ide kegiatan hari ini bersama anak',
      'Menyiapkan aturan bermain dan kesepakatan kelas',
      'Ceritakan pengalamanmu merawat tanaman! (Komunikasi)',
    ],
    openingQuestions: [
      'Siapa yang menciptakan semua keindahan alam ini? (Keimanan dan Ketakwaan)',
      'Bagaimana cara kita merawat bumi bersama-sama? (Kewargaan)',
      'Mengapa pohon penting untuk kehidupan kita? (Penalaran Kritis)',
      'Apa yang bisa kita buat dari barang bekas? (Kreativitas)',
      'Bagaimana caranya bekerja sama membersihkan lingkungan? (Kolaborasi)',
      'Apa yang bisa kamu lakukan sendiri untuk menjaga lingkungan? (Kemandirian)',
      'Bagaimana perasaanmu saat berada di tempat yang bersih? (Kesehatan)',
    ],
    coreDays: [
      {
        day: 1,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        activities: [
          {
            activityNumber: 1,
            title: 'Mengenal Ciptaan Tuhan di Bumi (Keimanan dan Ketakwaan)',
            toolsAndMaterials: 'Kartu bergambar alam semesta, video keindahan bumi',
            howToPlay:
              'Anak-anak mengamati gambar keindahan bumi, mendiskusikan ciptaan Tuhan dan menyebutkan apa saja yang ada di bumi dengan rasa syukur.',
            fullDescription:
              'Kegiatan 1: Mengenal Ciptaan Tuhan di Bumi (Keimanan dan Ketakwaan). Alat dan bahan: Kartu bergambar alam semesta, video keindahan bumi. Cara Bermain: Anak-anak mengamati gambar keindahan bumi, mendiskusikan ciptaan Tuhan dan menyebutkan apa saja yang ada di bumi dengan rasa syukur.',
          },
          {
            activityNumber: 2,
            title: 'Bernyanyi Lagu Penjaga Bumi (Komunikasi)',
            toolsAndMaterials: 'Audio musik lagu anak bertema lingkungan',
            howToPlay:
              'Anak-anak bergerak dan bernyanyi bersama mengekspresikan semangat menjaga dan menyayangi bumi tempat tinggal kita.',
            fullDescription:
              'Kegiatan 2: Bernyanyi Lagu Penjaga Bumi (Komunikasi). Alat dan bahan: Audio musik lagu anak bertema lingkungan. Cara Bermain: Anak-anak bergerak dan bernyanyi bersama mengekspresikan semangat menjaga dan menyayangi bumi tempat tinggal kita.',
          },
          {
            activityNumber: 3,
            title: 'Eksplorasi Loose Parts Bentuk Bumi (Kreativitas, Kolaborasi)',
            toolsAndMaterials: 'Batu kerikil, daun kering, kancing biru dan hijau, tutup botol',
            howToPlay:
              'Anak-anak bekerja sama menyusun pola lingkaran bumi menggunakan bahan alam dan loose parts sesuai imajinasi.',
            fullDescription:
              'Kegiatan 3: Eksplorasi Loose Parts Bentuk Bumi (Kreativitas, Kolaborasi). Alat dan bahan: Batu kerikil, daun kering, kancing biru dan hijau, tutup botol. Cara Bermain: Anak-anak bekerja sama menyusun pola lingkaran bumi menggunakan bahan alam dan loose parts sesuai imajinasi.',
          },
        ],
      },
      {
        day: 2,
        phase: 'MEMAHAMI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
        activities: [
          {
            activityNumber: 1,
            title: 'Eksperimen Menanam Biji Kacang Hijau (Penalaran Kritis)',
            toolsAndMaterials: 'Pot kecil/cup daur ulang, tanah subur, biji kacang hijau, air',
            howToPlay:
              'Anak-anak menanam biji kacang hijau ke dalam tanah subur, menyiram secukupnya, dan mengamati proses bagaimana tumbuhan tumbuh merawat bumi.',
            fullDescription:
              'Kegiatan 1: Eksperimen Menanam Biji Kacang Hijau (Penalaran Kritis). Alat dan bahan: Pot kecil/cup daur ulang, tanah subur, biji kacang hijau, air. Cara Bermain: Anak-anak menanam biji kacang hijau ke dalam tanah subur, menyiram secukupnya, dan mengamati proses bagaimana tumbuhan tumbuh merawat bumi.',
          },
          {
            activityNumber: 2,
            title: 'Kolase Bumi Tercinta (Kreativitas, Kemandirian)',
            toolsAndMaterials:
              'Kertas gambar pola lingkaran bumi, kertas origami biru dan hijau, lem',
            howToPlay:
              'Anak-anak merobek kertas origami menjadi kepingan kecil lalu menempelkannya pada pola daratan (hijau) dan lautan (biru).',
            fullDescription:
              'Kegiatan 2: Kolase Bumi Tercinta (Kreativitas, Kemandirian). Alat dan bahan: Kertas gambar pola lingkaran bumi, kertas origami biru dan hijau, lem. Cara Bermain: Anak-anak merobek kertas origami menjadi kepingan kecil lalu menempelkannya pada pola daratan (hijau) dan lautan (biru).',
          },
          {
            activityNumber: 3,
            title: 'Gerak dan Lagu Pohon Rindang (Kesehatan)',
            toolsAndMaterials: 'Musik pengiring',
            howToPlay:
              'Anak-anak menirukan gerakan pohon berdiri kokoh, daun melambai tertiup angin sepoi-sepoi, dan membungkuk lentur melatih motorik kasar.',
            fullDescription:
              'Kegiatan 3: Gerak dan Lagu Pohon Rindang (Kesehatan). Alat dan bahan: Musik pengiring. Cara Bermain: Anak-anak menirukan gerakan pohon berdiri kokoh, daun melambai tertiup angin sepoi-sepoi, dan membungkuk lentur melatih motorik kasar.',
          },
        ],
      },
      {
        day: 3,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        activities: [
          {
            activityNumber: 1,
            title: 'Memilah Sampah Organik dan Anorganik (Kewargaan, Penalaran Kritis)',
            toolsAndMaterials:
              'Dua wadah sampah berlabel warna (hijau: organik, kuning: anorganik), contoh sampah bersih (daun, kertas, botol plastik)',
            howToPlay:
              'Anak-anak mengidentifikasi jenis sampah dan memasukkannya ke wadah yang benar sambil mendiskusikan manfaat daur ulang.',
            fullDescription:
              'Kegiatan 1: Memilah Sampah Organik dan Anorganik (Kewargaan, Penalaran Kritis). Alat dan bahan: Dua wadah sampah berlabel warna (hijau: organik, kuning: anorganik), contoh sampah bersih (daun, kertas, botol plastik). Cara Bermain: Anak-anak mengidentifikasi jenis sampah dan memasukkannya ke wadah yang benar sambil mendiskusikan manfaat daur ulang.',
          },
          {
            activityNumber: 2,
            title: 'Operasi Semut Bersih Lingkungan (Kolaborasi)',
            toolsAndMaterials: 'Sarung tangan kecil, kantong sampah daur ulang',
            howToPlay:
              'Anak-anak bersama guru berkeliling halaman sekolah mengumpulkan sampah yang berserakan dengan penuh kegembiraan.',
            fullDescription:
              'Kegiatan 2: Operasi Semut Bersih Lingkungan (Kolaborasi). Alat dan bahan: Sarung tangan kecil, kantong sampah daur ulang. Cara Bermain: Anak-anak bersama guru berkeliling halaman sekolah mengumpulkan sampah yang berserakan dengan penuh kegembiraan.',
          },
          {
            activityNumber: 3,
            title: 'STEAM Pot Bunga dari Botol Bekas (Kreativitas)',
            toolsAndMaterials:
              'Botol plastik bekas air mineral, cat warna/spidol, gunting (bimbingan guru)',
            howToPlay:
              'Anak-anak menghias botol bekas menjadi pot bunga karakter hewan yang lucu untuk diletakkan di sudut kelas.',
            fullDescription:
              'Kegiatan 3: STEAM Pot Bunga dari Botol Bekas (Kreativitas). Alat dan bahan: Botol plastik bekas air mineral, cat warna/spidol, gunting (bimbingan guru). Cara Bermain: Anak-anak menghias botol bekas menjadi pot bunga karakter hewan yang lucu untuk diletakkan di sudut kelas.',
          },
        ],
      },
      {
        day: 4,
        phase: 'MENGAPLIKASI (BERMAKNA, MENGGEMBIRAKAN)',
        activities: [
          {
            activityNumber: 1,
            title: 'Praktek Menyiram Tanaman dan Menjaga Air (Kemandirian)',
            toolsAndMaterials: 'Gayung kecil/botol semprot, air',
            howToPlay:
              'Anak-anak secara mandiri menyiram tanaman pot di sekolah dan belajar untuk tidak membuang-buang air bersih.',
            fullDescription:
              'Kegiatan 1: Praktek Menyiram Tanaman dan Menjaga Air (Kemandirian). Alat dan bahan: Gayung kecil/botol semprot, air. Cara Bermain: Anak-anak secara mandiri menyiram tanaman pot di sekolah dan belajar untuk tidak membuang-buang air bersih.',
          },
          {
            activityNumber: 2,
            title: 'Membuat Poster Cap Jari Sayangi Bumi (Komunikasi, Kreativitas)',
            toolsAndMaterials: 'Kertas karton besar, pewarna makanan aman (hijau dan biru), spidol',
            howToPlay:
              'Setiap anak mencapkan jarinya membentuk pohon rimbun di sekeliling bumi sebagai lambang persahabatan dan perlindungan alam.',
            fullDescription:
              'Kegiatan 2: Membuat Poster Cap Jari Sayangi Bumi (Komunikasi, Kreativitas). Alat dan bahan: Kertas karton besar, pewarna makanan aman (hijau dan biru), spidol. Cara Bermain: Setiap anak mencapkan jarinya membentuk pohon rimbun di sekeliling bumi sebagai lambang persahabatan dan perlindungan alam.',
          },
          {
            activityNumber: 3,
            title: 'Estafet Tongkat Peduli Lingkungan (Kesehatan, Kolaborasi)',
            toolsAndMaterials: 'Tongkat estafet warna-warni, rintangan cone sederhana',
            howToPlay:
              'Anak-anak berbaris estafet berlari zig-zag membawa pesan kebersihan secara sportif dan bergembira.',
            fullDescription:
              'Kegiatan 3: Estafet Tongkat Peduli Lingkungan (Kesehatan, Kolaborasi). Alat dan bahan: Tongkat estafet warna-warni, rintangan cone sederhana. Cara Bermain: Anak-anak berbaris estafet berlari zig-zag membawa pesan kebersihan secara sportif dan bergembira.',
          },
        ],
      },
      {
        day: 5,
        phase: 'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
        activities: [
          {
            activityNumber: 1,
            title: 'Pameran dan Refleksi Aku Penjaga Bumi (Komunikasi, Kewargaan)',
            toolsAndMaterials: 'Hasil karya anak selama 1 minggu, sertifikat/badge Penjaga Bumi',
            howToPlay:
              'Anak-anak memamerkan pot bunga, kolase, dan poster mereka, lalu menceritakan apa yang akan mereka lakukan untuk merawat bumi di rumah.',
            fullDescription:
              'Kegiatan 1: Pameran dan Refleksi Aku Penjaga Bumi (Komunikasi, Kewargaan). Alat dan bahan: Hasil karya anak selama 1 minggu, sertifikat/badge Penjaga Bumi. Cara Bermain: Anak-anak memamerkan pot bunga, kolase, dan poster mereka, lalu menceritakan apa yang akan mereka lakukan untuk merawat bumi di rumah.',
          },
          {
            activityNumber: 2,
            title: 'Bisik Berantai Pesan Sahabat Alam (Komunikasi)',
            toolsAndMaterials: 'Daftar pesan positif sederhana',
            howToPlay:
              'Anak-anak duduk melingkar dan membisikkan kalimat "Bumi kita indah dan bersih" secara berantai dari anak pertama ke anak terakhir.',
            fullDescription:
              'Kegiatan 2: Bisik Berantai Pesan Sahabat Alam (Komunikasi). Alat dan bahan: Daftar pesan positif sederhana. Cara Bermain: Anak-anak duduk melingkar dan membisikkan kalimat "Bumi kita indah dan bersih" secara berantai dari anak pertama ke anak terakhir.',
          },
          {
            activityNumber: 3,
            title: 'Ikrar dan Janji Sayang Bumi (Keimanan dan Ketakwaan)',
            toolsAndMaterials: 'Pohon komitmen dari kertas karton, daun kertas hijau',
            howToPlay:
              'Setiap anak menempelkan daun komitmen bertuliskan namanya di pohon kelas sebagai janji untuk selalu membuang sampah pada tempatnya.',
            fullDescription:
              'Kegiatan 3: Ikrar dan Janji Sayang Bumi (Keimanan dan Ketakwaan). Alat dan bahan: Pohon komitmen dari kertas karton, daun kertas hijau. Cara Bermain: Setiap anak menempelkan daun komitmen bertuliskan namanya di pohon kelas sebagai janji untuk selalu membuang sampah pada tempatnya.',
          },
        ],
      },
    ],
    closingActivities: [
      'Yel-yel Aku Penjaga Bumi dengan gerakan tangan yang energik',
      'Parade mini mengelilingi kelas sambil membawa hasil karya',
      'Permainan Tebak Suara Alam dengan efek suara yang menyenangkan',
      'Anak bergantian menjadi Reporter Cilik mewawancarai teman tentang kegiatan hari ini',
      'Dance party dengan lagu Sayang Bumi ciptaan anak-anak',
      'High-five berantai sambil menyebutkan satu hal yang akan dilakukan untuk bumi',
      'Foto bersama dengan pose superhero penjaga bumi',
      'Bernyanyi lagu penutup sambil bertepuk tangan ritmis',
      'Pemberian badge atau stiker penjaga bumi untuk setiap anak',
      'Countdown mundur 5-4-3-2-1 Sampai jumpa besok! dengan suara lantang',
      'Berdoa penutup dengan penuh semangat dan senyuman',
    ],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan minimal 3 ciptaan Tuhan di lingkungan sekitar saat circle time pembuka',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan antusiasme dan partisipasi aktif saat menonton video Aku Sayang Bumi',
      },
      {
        no: 3,
        indicator:
          'Anak mampu mengikuti instruksi dalam membuat dispenser air sederhana dengan urutan yang benar',
      },
      {
        no: 4,
        indicator:
          'Anak dapat mendemonstrasikan minimal 2 tindakan penyelamatan diri saat simulasi gempa bumi',
      },
      {
        no: 5,
        indicator:
          'Anak menunjukkan kemampuan kerjasama dalam kegiatan kelompok seperti mengoper tongkat dan drama evakuasi',
      },
      {
        no: 6,
        indicator:
          'Anak mampu membuat kolase bumi menggunakan bahan alam dengan kreativitas sendiri',
      },
      {
        no: 7,
        indicator:
          'Anak dapat mengklasifikasikan sampah organik dan anorganik dalam permainan memilah sampah',
      },
      {
        no: 8,
        indicator:
          'Anak menunjukkan sikap peduli lingkungan dengan merawat tanaman di area sekolah tanpa diminta',
      },
      {
        no: 9,
        indicator:
          'Anak mampu menceritakan pengalaman belajar tentang menjaga bumi dengan kalimat sederhana dan jelas',
      },
      {
        no: 10,
        indicator:
          'Anak dapat menghubungkan penyebab dan akibat gempa bumi dalam permainan kartu dengan tepat',
      },
      {
        no: 11,
        indicator:
          'Anak menunjukkan peningkatan kosakata lingkungan dalam percakapan sehari-hari selama pembelajaran',
      },
      {
        no: 12,
        indicator:
          'Anak mampu mengungkapkan komitmen konkret untuk menjaga lingkungan dalam kehidupan sehari-hari',
      },
    ],
    assessmentSteps: {
      initial: [
        'Lakukan circle time tanya jawab tentang pengalaman anak merawat tanaman/hewan di rumah',
        'Observasi respons anak saat menonton video Aku Sayang Bumi menggunakan lembar checklist',
        'Catat kemampuan anak menyebutkan nama-nama ciptaan Tuhan di sekitar mereka',
        'Dokumentasikan reaksi anak terhadap gambar lingkungan bersih vs kotor',
        'Amati tingkat partisipasi anak dalam diskusi pembuka tentang menjaga lingkungan',
        'Rekam kemampuan anak mengenali benda-benda alam melalui permainan Apa Ini?',
        'Observasi keterampilan motorik anak saat menyiapkan alat dan bahan kegiatan',
        'Catat pengetahuan awal anak tentang gempa bumi melalui brainstorming sederhana',
      ],
      process: [
        'Ambil foto berseri setiap tahap pembuatan karya anak (dispenser air, kolase, seismograf)',
        'Catat anekdotal sikap kerjasama anak dalam kegiatan kelompok setiap hari',
        'Observasi menggunakan checklist kemampuan anak mengikuti instruksi dalam eksperimen',
        'Rekam video singkat anak saat mempresentasikan hasil karyanya',
        'Dokumentasikan proses anak memecahkan masalah dalam kegiatan STEAM',
        'Catat perkembangan kosakata anak terkait lingkungan melalui percakapan harian',
        'Observasi kemampuan anak menerapkan tindakan penyelamatan diri saat simulasi gempa',
        'Dokumentasikan kreativitas anak dalam memodifikasi kegiatan sesuai ide mereka',
        'Rekam kemampuan komunikasi anak saat bercerita dalam kegiatan Cerita Berantai',
      ],
      final: [
        'Buat portofolio digital berisi foto semua hasil karya anak dengan deskripsi perkembangan',
        'Lakukan wawancara individual 5 menit dengan setiap anak tentang pembelajaran yang berkesan',
        'Observasi praktik nyata anak merawat tanaman di sekolah selama 1 minggu setelah pembelajaran',
        'Catat kemampuan anak mendemonstrasikan ulang tindakan penyelamatan diri dari gempa',
        'Dokumentasikan kemampuan anak mengklasifikasikan sampah dalam kegiatan sehari-hari',
        'Rekam video anak menceritakan komitmen mereka untuk menjaga lingkungan',
        'Amati transfer learning anak saat menerapkan pembelajaran di aktivitas bebas',
        'Buat laporan perkembangan komprehensif berdasarkan 8 dimensi profil lulusan',
        'Lakukan refleksi bersama orang tua tentang perubahan perilaku anak di rumah',
        'Dokumentasikan pencapaian anak dalam bentuk sertifikat Penjaga Bumi Cilik',
      ],
    },
  },
]

export default class RppmKbcSemester1Seeder extends BaseSeeder {
  private async ensureCurriculumCp() {
    const cpAgama = await CurriculumCp.updateOrCreate(
      { code: 'CP-FONDASI-AGAMA' },
      {
        code: 'CP-FONDASI-AGAMA',
        element: 'Nilai Agama dan Budi Pekerti',
        title: 'Mengenal dan mempraktikkan nilai agama serta akhlak mulia',
        description:
          'Anak mengenal Tuhan Yang Maha Esa, mempraktikkan ajaran pokok agama, dan menunjukkan perilaku baik dalam kehidupan sehari-hari.',
        phase: 'Fondasi',
        curriculumVersion: 'Kurikulum Merdeka',
        isOfficial: true,
      }
    )

    const cpJatiDiri = await CurriculumCp.updateOrCreate(
      { code: 'CP-FONDASI-JATI-DIRI' },
      {
        code: 'CP-FONDASI-JATI-DIRI',
        element: 'Jati Diri',
        title: 'Membangun jati diri dan kemampuan sosial emosional',
        description:
          'Anak mengenali identitas diri, mengelola emosi, membangun hubungan sehat, serta berpartisipasi dalam lingkungan.',
        phase: 'Fondasi',
        curriculumVersion: 'Kurikulum Merdeka',
        isOfficial: true,
      }
    )

    const cpLiterasi = await CurriculumCp.updateOrCreate(
      { code: 'CP-FONDASI-LITERASI' },
      {
        code: 'CP-FONDASI-LITERASI',
        element: 'Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
        title: 'Mengembangkan kemampuan literasi dan eksplorasi',
        description:
          'Anak mengeksplorasi bahasa, matematika, sains, teknologi, rekayasa, dan seni melalui bermain dan pengalaman bermakna.',
        phase: 'Fondasi',
        curriculumVersion: 'Kurikulum Merdeka',
        isOfficial: true,
      }
    )

    return { cpAgama, cpJatiDiri, cpLiterasi }
  }

  private async seedCurriculumPresets() {
    for (const item of RPPM_KBC_SEMESTER_1) {
      await CurriculumPreset.updateOrCreate(
        {
          code: `KBC-TK-B-SMT1-W${String(item.weekNum).padStart(2, '0')}`,
        },
        {
          educationLevel: 'tk',
          curriculumVersion: 'kurikulum_merdeka_kbc',
          semester: 1,
          weekNumber: item.weekNum,
          code: `KBC-TK-B-SMT1-W${String(item.weekNum).padStart(2, '0')}`,
          themeTitle: item.topic,
          subthemeTitle: item.subtopic,
          phase: 'fondasi',
          groupContext: 'b',
          data: {
            title: item.title,
            modelPembelajaran: item.modelPembelajaran,
            timeAllocation: item.timeAllocation,
            grade: item.grade,
            month: item.month,
            dpl: item.dpl
              .filter((d: { checked: boolean }) => d.checked)
              .map((d: { name: string }) => d.name),
            dplAll: item.dpl,
            kbcImplementation: item.kbcImplementation,
            kbcValues: item.kbcValues
              .filter((k: { checked: boolean }) => k.checked)
              .map((k: { name: string }) => k.name),
            kbcValuesAll: item.kbcValues,
            identification: item.identification,
            learningDesign: item.learningDesign,
            openingQuestions: item.openingQuestions,
            openingActivities: item.openingActivities,
            coreDays: item.coreDays,
            closingActivities: item.closingActivities,
            iktpItems: item.iktpItems,
            assessmentSteps: item.assessmentSteps,
          },
          isActive: true,
          sortOrder: item.weekNum,
        }
      )
    }
  }

  private async seedLearningObjectives(cps: {
    cpAgama: CurriculumCp
    cpJatiDiri: CurriculumCp
    cpLiterasi: CurriculumCp
  }) {
    const seededObjectives: { weekNum: number; objective: LearningObjective }[] = []

    for (const item of RPPM_KBC_SEMESTER_1) {
      const cpText = (item.learningDesign?.cp || '').toLowerCase()
      let targetCp = cps.cpLiterasi
      if (
        cpText.includes('agama') ||
        cpText.includes('budi pekerti') ||
        cpText.includes('syukur')
      ) {
        targetCp = cps.cpAgama
      } else if (
        cpText.includes('jati diri') ||
        cpText.includes('identitas') ||
        cpText.includes('emosi')
      ) {
        targetCp = cps.cpJatiDiri
      }

      // Bersihkan prefix [M... ...] - gunakan kalimat Tujuan Pembelajaran murni
      const tpTitle = item.learningDesign.tp
      const objective = await LearningObjective.updateOrCreate(
        {
          code: `TP-KBC-B-W${String(item.weekNum).padStart(2, '0')}`,
        },
        {
          cpId: targetCp.id,
          userId: null,
          code: `TP-KBC-B-W${String(item.weekNum).padStart(2, '0')}`,
          title: tpTitle,
          groupContext: 'b',
          source: 'library',
        }
      )

      seededObjectives.push({ weekNum: item.weekNum, objective })

      if (item.iktpItems?.length > 0) {
        for (const iktp of item.iktpItems) {
          await IktpIndicator.updateOrCreate(
            {
              learningObjectiveId: objective.id,
              description: iktp.indicator,
            },
            {
              learningObjectiveId: objective.id,
              userId: null,
              description: iktp.indicator,
              evidenceType: 'checklist',
              achievementCriteria: `Ketercapaian Minggu ${item.weekNum}: ${item.subtopic}`,
            }
          )
        }
      }
    }

    return seededObjectives
  }

  private buildTeachingModuleContent(item: any) {
    return {
      kompetensiDasar: [
        `Capaian Pembelajaran: ${item.learningDesign.cp}`,
        `Lintas Disiplin Ilmu: ${item.learningDesign.crossDisciplinary}`,
        `Dimensi Profil Lulusan: ${item.dpl
          .filter((d: { checked: boolean }) => d.checked)
          .map((d: { name: string }) => d.name)
          .join(', ')}`,
        `Nilai Karakter KBC: ${item.kbcValues
          .filter((k: { checked: boolean }) => k.checked)
          .map((k: { name: string }) => k.name)
          .join(', ')}`,
      ],
      tujuanPembelajaran: [
        item.learningDesign.tp,
        `Identifikasi Siswa: ${item.identification.students}`,
        `Materi Pokok: ${item.identification.learningMaterial}`,
      ],
      kegiatan: [
        `Kegiatan Pembuka / Awal: ${item.openingActivities.join('; ')}`,
        `Pertanyaan Pemantik: ${item.openingQuestions.join('; ')}`,
        ...item.coreDays.map(
          (d: {
            day: number
            phase: string
            activities: {
              activityNumber: number
              title: string
              toolsAndMaterials: string
              howToPlay: string
            }[]
          }) =>
            `Hari ${d.day} [${d.phase}]: ${d.activities
              .map(
                (a) =>
                  `Kegiatan ${a.activityNumber}: ${a.title} (Alat: ${a.toolsAndMaterials || '-'}) - Cara: ${a.howToPlay || '-'}`
              )
              .join(' | ')}`
        ),
        `Kegiatan Penutup / Refleksi: ${item.closingActivities.join('; ')}`,
      ],
      penilaian: [
        `Asesmen Awal: ${item.assessmentSteps.initial.join('; ')}`,
        `Asesmen Proses: ${item.assessmentSteps.process.join('; ')}`,
        `Asesmen Akhir: ${item.assessmentSteps.final.join('; ')}`,
        ...item.iktpItems.map(
          (ik: { no: number; indicator: string }) => `Indikator IKTP #${ik.no}: ${ik.indicator}`
        ),
      ],
      sumberBelajar: [
        `Praktik Pedagogis: ${item.learningDesign.pedagogicalPractice}`,
        `Kemitraan Pembelajaran: ${item.learningDesign.partnership}`,
        `Lingkungan Pembelajaran: ${item.learningDesign.environment}`,
        `Pemanfaatan Digital: ${item.learningDesign.digitalUtilization}`,
        'Bahan Alam & Loose Parts Ramah Anak',
      ],
    }
  }

  private async seedTeacherPlans(
    teacher: User,
    teacherClass: SchoolClass,
    atpItems: { learningObjectiveId: number; order: number; period: string }[]
  ) {
    await LearningSequence.updateOrCreate(
      {
        userId: teacher.id,
        title: 'Alur Tujuan Pembelajaran (ATP) KBC TK B - Semester 1',
      },
      {
        userId: teacher.id,
        schoolId: teacher.schoolId ?? null,
        title: 'Alur Tujuan Pembelajaran (ATP) KBC TK B - Semester 1',
        educationLevel: 'tk',
        groupContext: 'b',
        curriculumVersion: 'Kurikulum Merdeka KBC',
        status: 'published',
        items: atpItems,
      }
    )

    await TeachingModule.query()
      .where('user_id', teacher.id)
      .where('title', 'like', 'Modul Ajar KBC Minggu %')
      .delete()

    await WeeklyLessonPlan.query()
      .where('user_id', teacher.id)
      .where('class_id', teacherClass.id)
      .delete()

    for (const item of RPPM_KBC_SEMESTER_1) {
      const teachingModuleContent = this.buildTeachingModuleContent(item)

      await TeachingModule.updateOrCreate(
        {
          userId: teacher.id,
          title: `Modul Ajar KBC Minggu ${item.weekNum}: ${item.subtopic}`,
        },
        {
          userId: teacher.id,
          classId: teacherClass.id,
          title: `Modul Ajar KBC Minggu ${item.weekNum}: ${item.subtopic}`,
          subject: 'Tematik PAUD KBC',
          phase: 'Fondasi',
          status: 'published',
          content: teachingModuleContent,
        }
      )

      const weekStartDate = DateTime.fromISO('2026-07-13').plus({ weeks: item.weekNum - 1 })
      await WeeklyLessonPlan.updateOrCreate(
        {
          userId: teacher.id,
          theme: item.topic
            ? `${item.topic}: ${item.subtopic}`
            : `Minggu ${item.weekNum}: ${item.subtopic}`,
        },
        {
          userId: teacher.id,
          classId: teacherClass.id,
          theme: item.topic
            ? `${item.topic}: ${item.subtopic}`
            : `Minggu ${item.weekNum}: ${item.subtopic}`,
          weekStartDate,
          status: 'published',
          content: {
            weekNumber: item.weekNum,
            semester: 1,
            title: item.title,
            theme: item.topic,
            topic: item.topic,
            subtheme: item.subtopic,
            subtopic: item.subtopic,
            modelPembelajaran: item.modelPembelajaran,
            timeAllocation: item.timeAllocation,
            grade: item.grade,
            month: item.month,
            dpl: item.dpl
              .filter((d: { checked: boolean }) => d.checked)
              .map((d: { name: string }) => d.name),
            dplAll: item.dpl,
            kbcImplementation: item.kbcImplementation,
            kbcValues: item.kbcValues
              .filter((k: { checked: boolean }) => k.checked)
              .map((k: { name: string }) => k.name),
            kbcValuesAll: item.kbcValues,
            identification: item.identification,
            learningDesign: item.learningDesign,
            openingQuestions: item.openingQuestions,
            openingActivities: item.openingActivities,
            coreDays: item.coreDays,
            closingActivities: item.closingActivities,
            iktpChecklist: item.iktpItems,
            assessmentSteps: item.assessmentSteps,
          },
        }
      )
    }
  }

  async run() {
    const cps = await this.ensureCurriculumCp()
    await this.seedCurriculumPresets()
    const seededObjectives = await this.seedLearningObjectives(cps)

    const teachers = await User.query().where((q) => {
      q.where('education_level', 'tk')
        .orWhere('institution_type', 'tk')
        .orWhere('institution_type', 'ra')
        .orWhere('email', 'gurutk@siapajar.id')
        .orWhere('email', 'guru-normal@siapajar.id')
    })

    const activeAy =
      (await AcademicYear.query().where('is_active', true).first()) ||
      (await AcademicYear.first()) ||
      (await AcademicYear.create({ name: '2026/2027', isActive: true }))

    const atpItems = seededObjectives.map(({ weekNum, objective }) => ({
      learningObjectiveId: objective.id,
      order: weekNum,
      period: `Minggu ${weekNum}`,
    }))

    for (const teacher of teachers) {
      let teacherClass = await SchoolClass.query()
        .where('user_id', teacher.id)
        .where((q) => {
          q.where('group_context', 'b').orWhere('grade_level', 0)
        })
        .first()

      teacherClass ??= await SchoolClass.create({
        userId: teacher.id,
        academicYearId: activeAy.id,
        name: 'Kelompok B (5-6 Tahun) - Ibrahim',
        gradeLevel: 0,
        groupContext: 'b',
        rombelNumber: '1',
      })

      await this.seedTeacherPlans(teacher, teacherClass, atpItems)

      console.log(
        `Successfully seeded KBC Semester 1 modules for teacher ${teacher.email} (${teacher.fullName})`
      )
    }

    console.log(
      'Successfully integrated and seeded 18 PPM KBC Modules directly into CP, TP, ATP, Modul Ajar (TeachingModule), RPPM (WeeklyLessonPlan), and CurriculumPreset across all PAUD/TK/RA teachers!'
    )
  }
}
