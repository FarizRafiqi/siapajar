import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CurriculumPreset from '#models/curriculum_preset'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import LearningObjective from '#models/learning_objective'
import IktpIndicator from '#models/iktp_indicator'
import { DateTime } from 'luxon'

export const RPPM_KBC_SEMESTER_1 = [
  {
    weekNum: 1,
    title: 'AKU HAMBA ALLAH :',
    topic: 'DIRIKU',
    subtopic: 'IDENTITAS',
    modelPembelajaran: 'Kolaboratif, STEAM',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Kegiatan Melatih Koordinasi (Kesehatan) . Alat dan bahan: Matras, ring, traffic cone. Cara Bermain:',
      'Kegiatan 2 : Nama Teman dari Kancing (Komunikasi). Alat dan bahan: Kancing warna-warni, karton, lem Cara bermain: Anak-anak duduk melingkar. Setiap anak mengambil kancing sesuai jumlah huruf dalam namanya. Secara bergantian, anak menempelkan kancing di karton membentuk namanya sambil memperkenalkan diri. Teman lain dapat membantu jika ada kesulitan.',
      'Kegiatan 3 : Membuat Bentuk Tubuh Teman (Kolaborasi, Kreativitas). Alat dan bahan: Berbagai jenis loose parts seperti lego, kayu, daun-daunan, batu, dll. Cara bermain: Anak-anak bekerja sama dalam kelompok kecil. Satu anak berbaring di lantai, sementara yang lain menggunakan loose parts untuk membuat pola mengikuti bentuk tubuh temannya. Kegiatan ini mengembangkan kreativitas, keterampilan sosial, dan pemahaman tentang bentuk tubuh manusia.',
      'Kegiatan 1 : Membuat Boneka Jari Keluarga (Kemandirian) . Alat dan bahan: Kertas karton, spidol, cat warna, gunting, sti k es krim, pensil, krayon, lem.',
      'Kegiatan 2 : Cermin Ajaib (Kreativitas, Keimanan dan Ketakwaan) . Alat dan bahan: Cermin besar Cara bermain: Anak-anak bergantian berdiri di depan cermin. Mereka diminta untuk mengamati dan menyebutkan ciri-ciri fisik mereka, seperti warna kulit, bentuk rambut, atau warna mata. Teman-teman lain dapat membantu menambahkan informasi.',
      'Kegiatan 3 : Menyusun Menara Angka (Penalaran Kritis) . Alat dan bahan: Balok kayu, tutup botol, kartu angka. Cara bermain: Anak-anak menyusun menara menggunakan balok kayu atau tutup botol sesuai dengan angka yang tertera pada kartu. Misalnya, jika kartu menunjukkan angka 5, anak harus menyusun 5 balok. Kegiatan ini membantu perkembangan numerasi dan keterampilan motorik halus.',
      '3930853 95326 0 0 Kegiatan 1 : STEAM Membuat Gitar Dari Daur Ulang (Kreativitas) . Alat dan bahan: Kotak Sepatu, 3 karet gelang, 2 pensil , Cara Membuat:',
      'Kegiatan 2 : Kolase Wajah Teman (Kewargaan) . Alat dan bahan: Kertas, lem, biji-bijian, kerikil, daun kering Cara bermain: Anak-anak berpasangan. Mereka membuat kolase wajah teman mereka menggunakan bahan alam. Setelah selesai, mereka memperkenalkan teman mereka kepada kelompok menggunakan kolase yang dibuat.',
      'Kegiatan 3 : Tebak Suara Teman (Komunikasi) . Alat dan bahan: Kain penutup mata, benda-benda yang dapat mengeluarkan suara (kerikil dalam botol, sendok dan panci, dll) Cara bermain: Satu anak ditutup matanya. Anak lain membuat suara menggunakan benda-benda yang tersedia. Anak yang ditutup matanya harus menebak siapa yang membuat suara. Jika berhasil, anak yang suaranya ditebak gantian ditutup matanya.',
      'Kegiatan 1 : Eksperimen Ilmu Penyerapan Air (Penalaran Kritis) . Alat dan bahan , kertas, serbet, tisu, kaus kaki, busa, kain , spons, spidol atau pena , wadah, air. Cara Membuat:',
      'Kegiatan 2 : Lempar Bola Pertanyaan (Komunikasi) . Alat dan bahan: Bola kecil, daftar pertanyaan sederhana Cara bermain: Anak-anak berdiri melingkar. Guru melempar bola ke salah satu anak sambil mengajukan pertanyaan sederhana seperti "Apa warna kesukaanmu?". Anak yang menangkap bola harus menjawab, lalu melempar bola ke anak lain sambil mengajukan pertanyaan baru.',
      'Kegiatan 3 : Cerita Berantai (Kreativitas, Kolaborasi) . Alat dan bahan: Tidak ada Cara bermain: Anak-anak duduk melingkar. Guru memulai cerita dengan satu kalimat, misalnya "Pada suatu hari, ada seekor kucing...". Anak pertama melanjutkan cerita dengan satu kalimat, dilanjutkan anak berikutnya. Cerita berlanjut hingga semua anak mendapat giliran.',
      '3643492 113168 0 0 Kegiatan 1 : Tracing Sesuai Angka (Kemandirian) . Alat dan bahan: kardus bekas, tutup boto l , lem, gunting, ta l i Sepatu/benang. Cara membuat:',
      'Kegiatan 2 : Kolase Diriku (Kreativitas, Keimanan dan Ketakwaan) . Alat dan bahan: Kertas gambar, foto anak-anak, berbagai bahan kolase (kain perca, kertas warna, daun kering, dll), lem Cara bermain: Setiap anak diberikan kertas gambar dengan foto diri mereka di tengah. Mereka diminta untuk menghias sekeliling foto dengan bahan kolase, membentuk hal-hal yang menggambarkan identitas mereka (misalnya, bunga untuk anak yang suka berkebun, bola untuk yang suka olahraga).',
      'Kegiatan 3 : Tebak Suara Teman (Komunikasi) . Alat dan bahan: Penutup mata Cara bermain: Satu anak ditutup matanya. Anak-anak lain bergantian mengucapkan "Halo, siapa aku?" Anak yang matanya ditutup harus menebak siapa yang berbicara. Jika berhasil menebak, anak yang suaranya ditebak gantian ditutup matanya.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Recalling kegiatan hari ini dengan bertanya "Apa yang paling menyenangkan hari ini?"',
      'Pameran mini hasil karya dimana setiap anak memamerkan karyanya dengan bangga',
      'Tepuk tangan apresiasi bersama untuk semua pencapaian anak hari ini',
    ],
  },
  {
    weekNum: 2,
    title: 'AKU CINTA INDONESIA: NEGERI SERIBU PULAU',
    topic: 'TANAH AIR',
    subtopic: 'INDONESIA',
    modelPembelajaran: 'Inkuiri',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [
      'Salam dan doa pembuka untuk menciptakan suasana spiritual yang positif',
      'Menyanyikan lagu "1234 Pergi Sekolah" untuk membangun semangat belajar',
      'Kegiatan pemantik berupa buku cerita/video "Aku Cinta Indonesia"',
      'Asesmen awal melalui diskusi ide-ide kegiatan dan review pengalaman sebelumnya',
      'Menyiapkan aturan bermain dan kesepakatan kelas untuk pembelajaran yang kondusif',
    ],
    coreActivitiesText: [
      'Kegiatan 1 : Membuat Lukisan Burung Garuda dengan Teknik Percikan (Kreativitas, Kemandirian) . Alat dan bahan: Mangkuk, Pewarna makanan merah (sesuai keinginan), Sikat gigi, Sisir, Air, Kertas HVS, Guntintg, Printable gambar burung garuda, Cara Membuat:',
      'Kegiatan 2 : Peta Indonesia dari Biji-bijian (Penalaran Kritis, Komunikasi) . Alat dan bahan: Kertas karton besar, berbagai jenis biji-bijian (beras, kacang hijau, jagung, dll), lem. Cara bermain: Gambar peta Indonesia di kertas karton. Anak-anak diminta untuk menempelkan biji-bijian berbeda untuk setiap pulau besar di Indonesia. Sambil bermain, diskusikan nama-nama pulau dan keunikan masing-masing daerah.',
      'Kegiatan 3 : Garuda Pancasila (Kewargaan, Kolaborasi) . dari Bahan Alam Alat dan bahan: Ranting, daun kering, batu kecil, biji-bijian, lem, kertas karton. Cara bermain: Buat sketsa Garuda Pancasila di kertas karton. Anak-anak diminta untuk mengisi sketsa tersebut dengan bahan-bahan alam yang tersedia. Jelaskan makna Garuda Pancasila sebagai lambang negara.',
      'Kegiatan 1 : Memindahkan Gelas Dengan Kipas (Kesehatan, Kemandirian) . Alat dan Bahan: Gelas kertas, Selotip, Kipas . Cara Membuat dan bermain:',
      'Kegiatan 2 : Huruf dari Alam (Komunikasi, Kreativitas) . Alat dan bahan: Ranting, daun, kerikil, bunga. Cara bermain: Anak-anak menggunakan bahan-bahan alam untuk membentuk huruf-huruf alfabet. Mereka bisa membuat nama mereka sendiri atau kata-kata sederhana. Kegiatan ini membantu perkembangan literasi dan kreativitas.',
      'Kegiatan 3 : Menyusun Pola Batik dengan Biji-bijian (Kewargaan, Penalaran Kritis) . Alat dan bahan: Kertas karton, berbagai jenis biji-bijian, lem. Cara bermain: Gambar pola batik sederhana di kertas karton. Anak-anak mengisi pola tersebut dengan biji-bijian berwarna-warni. Diskusikan makna filosofis di balik motif batik.',
      'Kegiatan 1 : Bermain Menara Jenga (Kolaborasi, Penalaran Kritis) . Alat dan bahan: Kayu atau bambu, Keranjang baju, Bola plastik, Kursi . Cara Membuat dan Bermain:',
      'Kegiatan 2 : Membuat Jam dari Loose Parts (Penalaran Kritis, Kemandirian) . Alat dan bahan: Piring kertas, jarum dari karton, berbagai loose parts untuk angka. Cara bermain: Anak-anak membuat jam dinding sederhana menggunakan piring kertas sebagai dasar dan loose parts untuk menandai angka. Kegiatan ini membantu pemahaman tentang waktu.',
      'Kegiatan 3 : Bermain Klasifikasi Tekstur (Penalaran Kritis, Komunikasi) . Alat dan bahan: Berbagai benda dengan tekstur berbeda (lembut, kasar, halus, dll). Cara bermain: Anak-anak mengeksplorasi tekstur berbagai benda, lalu mengelompokkannya berdasarkan tekstur. Kegiatan ini mengembangkan kepekaan sensorik dan kemampuan klasifikasi.',
      'Kegiatan 2 : Membuat Peta Sederhana (Kreativitas, Kolaborasi) . Alat dan bahan: Kertas besar, berbagai loose parts (balok, tutup botol, ranting, dll). Cara bermain: Anak-anak membuat peta sederhana dari ruang kelas atau taman bermain menggunakan loose parts. Kegiatan ini membantu pemahaman spasial dan orientasi.',
      'Kegiatan 3 : Membuat Replika Candi dari Balok Kayu (Kewargaan, Kreativitas) . Alat dan bahan: Balok kayu bekas, ranting, daun kering. Cara bermain: Anak-anak menyusun balok kayu membentuk replika candi seperti Borobudur atau Prambanan. Gunakan ranting dan daun untuk dekorasi. Ceritakan sejarah singkat candi-candi di Indonesia.',
      'Kegiatan 2 : Sorting Bentuk dan Warna (Penalaran Kritis, Kemandirian) . Alat dan bahan: Berbagai benda kecil dengan bentuk dan warna berbeda, wadah. Cara bermain: Anak-anak mengelompokkan benda-benda berdasarkan bentuk atau warnanya ke dalam wadah yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi dan pengenalan bentuk serta warna.',
      'Kegiatan 3 : Alat Musik Tradisional (Kewargaan, Kreativitas) . Alat dan bahan: Kaleng bekas, karet gelang, biji-bijian, ranting. Cara bermain: Anak-anak membuat alat musik sederhana seperti marakas dari kaleng berisi biji-bijian atau gendang dari kaleng yang ditutup karet. Ajak mereka memainkan lagu-lagu daerah dengan alat musik buatan sendiri. Kegiatan ini mengembangkan kreativitas dan apresiasi terhadap musik tradisional Indonesia.',
    ],
    closingActivities: [
      'Saatnya berkumpul dalam lingkaran besar untuk merayakan petualangan seru hari ini! Guru mengajak anak-anak untuk duduk bersama dengan penuh kegembiraan dan berbagi cerita tentang pengalaman mereka menjadi anak Indonesia yang hebat.',
      'Yel-yel "Indonesia Hebat!" dengan gerakan semangat bersama-sama untuk merayakan pencapaian hari ini',
      'Parade Mini Karya Indonesia - anak-anak berkeliling kelas memamerkan hasil karya sambil bercerita dengan bangga',
      'Permainan "Tebak Suara Indonesia" - mendengarkan suara khas Indonesia (gamelan, burung, alam) dan menebak dengan antusias',
    ],
  },
  {
    weekNum: 3,
    title: 'KITA INDONESIA SESUNGGUHNYA',
    topic: 'TANAH AIR',
    subtopic: 'KEBINEKAAN',
    modelPembelajaran: 'Kolaboratif, STEAM',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Membuat Burung Garuda Dari Stik Es Krim (Kreativitas, Kewargaan) . Alat dan bahan: Stik es krim (jumlah sesuaikan dengan kebutuhan), Printable kepala burung Garuda yang sudah digunting , Lem (lem putih atau lem tembak), Gunting, Kertas berwarna ,',
      'Kegiatan 2 : Membangun Rumah Adat Bersama (Kolaborasi, Penalaran Kritis) . Alat dan bahan: Berbagai jenis loose parts seperti balok kayu, ranting, daun kering, batu kecil, kain perca. Cara bermain: Bagi anak-anak menjadi beberapa kelompok yang mewakili suku-suku di Indonesia. Setiap kelompok bertugas membangun miniatur rumah adat dari daerah yang berbeda menggunakan loose parts yang tersedia. Setelah selesai, anak-anak dapat mempresentasikan rumah adat mereka dan menempatkannya berdampingan untuk membentuk "desa Indonesia" yang beragam namun bersatu.',
      'Kegiatan 3 : Membangun Menara Keberagaman (Kolaborasi, Komunikasi) . Alat dan bahan: Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda. Cara bermain: Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok.',
      'Kegiatan 1 : Pengenalan Huruf Dengan Kolase (Kreativitas, Kemandirian) : Alat dan bahan: Prin table huruf alfabet, lem, sedotan, gunting, manik-manik, pasir, koran, krayon, daun, dan lainnya. Cara Membuat:',
      'Kegiatan 2 : Kolase Burung Garuda (Kewargaan, Kreativitas) . Alat dan bahan: Gambar outline Garuda Pancasila, berbagai bahan alam seperti daun, biji-bijian, kerikil, ranting kecil. Cara bermain: Anak-anak bekerja sama membuat kolase Garuda Pancasila menggunakan bahan-bahan alam. Setiap anak bertanggung jawab untuk bagian yang berbeda, menunjukkan bahwa meskipun mengerjakan bagian yang berbeda, hasilnya adalah satu kesatuan yang indah.',
      'Kegiatan 3 : Membuat Rantai Persahabatan (Komunikasi, Kolaborasi) . Alat dan bahan: Potongan kertas warna-warni, lem, spidol. Cara bermain: Setiap anak menulis namanya dan satu hal baik tentang temannya di potongan kertas. Kemudian mereka membuat rantai kertas dengan menggabungkan semua potongan. Diskusikan bagaimana perbedaan warna membuat rantai menjadi indah, seperti keberagaman di Indonesia.',
      '3432810 105410 0 0 Kegiatan 1 : Kolase Peta Indonesia dari Kapas (Kewargaan, Kreativitas) . Alat dan bahan: Map atau gambar peta Indonesia, lem, kapas, cat warna, pipet, mangkuk. Cara Membuat:',
      'Kegiatan 2 : Membangun Menara Keberagaman (Kolaborasi, Penalaran Kritis) . Alat dan bahan: Berbagai jenis balok atau kotak dengan ukuran dan warna berbeda. Cara bermain: Anak-anak bekerja sama membangun menara setinggi mungkin. Setiap anak hanya boleh menggunakan satu jenis balok, sehingga mereka harus berkoordinasi untuk menciptakan struktur yang kokoh dari berbagai jenis balok.',
      'Kegiatan 3 : Membuat Mural Keberagaman (Kreativitas, Kolaborasi) . Alat dan bahan: Kertas besar, berbagai bahan alam untuk mewarnai (bunga, daun, tanah, dll), air. Cara bermain: Anak-anak bersama-sama membuat mural yang menggambarkan keberagaman Indonesia menggunakan bahan-bahan alam sebagai pewarna. Setiap anak berkontribusi pada bagian yang berbeda, namun hasilnya adalah satu karya yang utuh.',
      'Kegiatan 1 : Membuat Gantungan Keluarga (Komunikasi, Kemandirian) . Alat dan bahan: Kertas HVS, krayon, pelubang kertas, gunting. Hanger, benang . Cara Membuat:',
      'Kegiatan 2 : Permainan Kata Berantai Bahasa Daerah (Komunikasi, Penalaran Kritis) . Alat dan bahan: Kartu kata dalam berbagai bahasa daerah, kotak atau wadah. Cara bermain: Anak-anak duduk melingkar. Satu anak mengambil kartu, menyebutkan kata dalam bahasa daerah, dan memberikan artinya. Anak berikutnya harus mengambil kartu dengan kata yang berawalan huruf terakhir dari kata sebelumnya. Ini mengajarkan keberagaman bahasa dan kerjasama dalam permainan.',
      'Kegiatan 3 : Membuat Peta Timbul Indonesia (Kolaborasi, Kreativitas) . Alat dan bahan: Adonan playdough atau tanah liat, peta Indonesia sebagai panduan, berbagai biji-bijian atau kerikil. Cara bermain: Anak-anak bekerja sama membuat peta timbul Indonesia. Setiap anak bertanggung jawab untuk membentuk pulau atau kepulauan tertentu. Gunakan biji-bijian atau kerikil untuk menandai kota-kota penting. Diskusikan bagaimana setiap pulau adalah bagian penting dari Indonesia.',
      'Kegiatan 1 : Roket Terbang (Kreativitas, Kemandirian) . Alat dan Bahan: Kertas Konstruksi hitam, benang, lem, solatip, gunting, pelubang buku, prin table gambar roket, bintang dan bulan, krayon.',
      'Kegiatan 2 : Membuat Cetak Daun (Kreativitas, Kesehatan) . Alat dan bahan: Daun-daun segar, cat poster, kertas. Cara bermain: Oleskan cat pada salah satu sisi daun, lalu tekankan daun tersebut pada kertas untuk membuat cetakan. Biarkan anak-anak bereksperimen dengan berbagai jenis daun dan warna. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang bentuk dan tekstur.',
      'Kegiatan 3 : Pohon Persahabatan (Kolaborasi, Komunikasi) . Alat dan Bahan: Kertas besar dan cat. Cara Bermain: Anak-anak menggambar pohon besar dan menempelkan berbagai gambar hasil karya mereka di cabang-cabang pohon, menggambarkan perbedaan yang membuat mereka satu.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada peserta didik atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan peserta didik terlibat dalam perencanaan pembelajaran selanjutnya. Kegiatan meliputi :',
      'Recalling kegiatan hari ini dengan tepuk tangan semangat dan tanya jawab ceria',
      'Parade hasil karya: anak menunjukkan hasil karya dengan bangga sambil bercerita',
      'Yel-yel persahabatan dan lagu penutup tentang keberagaman dengan gerakan riang',
    ],
  },
  {
    weekNum: 4,
    title: 'MERAYAKAN KEMERDEKAAN',
    topic: 'AKU CINTA INDONESIA',
    subtopic: 'HARI MERDEKA',
    modelPembelajaran: 'Projek Kolaboratif',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
    iktpItems: [
      {
        no: 1,
        indicator:
          '1. HARI 1: Mengenal Sejarah Kemerdekaan Indonesia Menyebutkan tanggal kemerdekaan Indonesia (17 Agustus 1945) Mengenali tokoh Soekarno-Hatta dalam cerita proklamasi Menunjukkan antusiasme dalam dramatic play proklamasi Mengekspresikan perasaan bangga melalui gambar',
      },
      {
        no: 2,
        indicator:
          '2. HARI 2: Menjelajahi Simbol-simbol Negara Mengenali dan menyebutkan makna warna bendera merah putih Menunjukkan sikap hormat saat upacara bendera mini Menyanyikan lagu Indonesia Raya dengan sikap yang tepat Mendesain bendera impian dengan kreativitas',
      },
      {
        no: 3,
        indicator:
          'HARI 3: Berkarya Seni Patriotik Mengapresiasi karya seni bertema kemerdekaan Bekerja sama dalam kelompok membuat lampion/janur kuning Menghasilkan karya seni dengan tema patriotik Mempresentasikan karya dan harapan untuk Indonesia',
      },
      {
        no: 4,
        indicator:
          'HARI 4: Festival Permainan Tradisional Memahami nilai budaya dalam permainan tradisional Berpartisipasi aktif dalam lomba tradisional Menunjukkan sportivitas dan kerjasama tim Berkomitmen melestarikan permainan tradisional',
      },
      {
        no: 5,
        indicator:
          'HARI 5: Parade Keragaman Budaya Indonesia Mengenal keragaman budaya daerah di Indonesia Mempresentasikan budaya daerah dengan percaya diri Menghargai perbedaan budaya dalam parade Mengekspresikan persatuan dalam keragaman',
      },
      {
        no: 6,
        indicator:
          'HARI 6: Upacara Kemerdekaan &amp; Refleksi Melaksanakan upacara kemerdekaan dengan sikap hormat Berpartisipasi aktif dalam pembacaan proklamasi Membuat komitmen personal untuk Indonesia Merefleksikan pembelajaran patriotisme dengan bermakna',
      },
    ],
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [],
    closingActivities: [
      '↓ (Internalisasi nilai patriotisme melalui upacara dan komitmen)',
      'RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN',
      'Uraian Kegiatan',
      'HARI 1: MENGENAL SEJARAH KEMERDEKAAN INDONESIA** Penguatan Karakter Utama: BERKEBINEKAAN GLOBAL &amp; KEWARGAAN',
    ],
  },
  {
    weekNum: 5,
    title: 'KEINDAHAN PAKAIAN ADAT NUSANTARA',
    topic: 'TANAH AIR',
    subtopic: 'BAJU ADAT',
    modelPembelajaran: 'PjBL, Kolaboratif',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
          'Anak berpartisipasi aktif dalam kegiatan bermain peran "Desainer Pakaian Adat" dan "Butik Kecil"',
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
          'Anak berhasil mengajukan pertanyaan yang tepat dalam permainan "Siapa Aku?" versi pakaian adat',
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Membuat Jam Tangan Dari Gelas Kertas (Kreativitas, Kemandirian) . Alat dan bahan: Gelas kertas, gunting, spidol, pin',
      'Kegiatan 2 : Memakai dan Melepas Kebaya Mini (Kemandirian, Kesehatan) . Alat dan bahan: Kebaya mini atau baju tradisional sederhana dengan kancing. Cara bermain: Sediakan beberapa kebaya mini atau baju tradisional sederhana dengan kancing. Minta anak-anak untuk berlatih memakai dan melepas baju tersebut secara mandiri. Guru dapat memberikan panduan langkah demi langkah, seperti cara memasukkan tangan ke lengan baju dan mengancingkan kancing. Kegiatan ini melatih koordinasi mata-tangan, motorik halus, dan kemandirian dalam berpakaian.',
      'Kegiatan 3 : Mengikat Tali Sepatu (Kemandirian, Kesehatan) . Alat dan bahan: Sepatu atau replika sepatu dengan tali. Cara bermain: Sediakan sepatu atau replika sepatu dengan tali. Ajarkan anak-anak cara mengikat tali sepatu langkah demi langkah. Mulai dari membuat simpul dasar hingga membuat pita. Buat kompetisi kecil untuk melihat siapa yang bisa mengikat tali sepatu dengan benar dan rapi dalam waktu tertentu. Kegiatan ini melatih motorik halus, koordinasi mata-tangan, dan kemandirian dalam mengenakan sepatu.',
      'Kegiatan 1 : Lompat , Lewat , dan Puta r (Kesehatan, Kolaborasi) . Alat da n Bahan: Tongkat, petunjuk arah. Cara Membuat dan Memainkan',
      'Kegiatan 2 : Bermain Peran "Desainer Pakaian Adat" (Kreativitas, Komunikasi) . Alat dan bahan: Kertas gambar besar, pensil warna, majalah bekas, gunting, lem. Cara bermain: Minta anak-anak membayangkan mereka adalah desainer pakaian adat. Mereka bisa menggambar desain pakaian adat baru atau membuat kolase dari potongan gambar di majalah. Dorong mereka untuk menjelaskan desain mereka. Ini mengembangkan kreativitas dan kemampuan berbahasa.',
      'Kegiatan 3 : Membuat Pola Batik dengan Stempel (Kreativitas, Penalaran Kritis) . Alat dan bahan: Kertas, cat, stempel dari bahan alam (seperti potongan pelepah pisang, belimbing, daun atau lainnya ). Cara bermain: Ajarkan anak-anak membuat pola batik sederhana menggunakan stempel dari bahan alam. Mereka bisa membuat pola berulang atau bebas. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang pola.',
      'Kegiatan 1 : Lompat Sesuai Intruksi Yang di Dengar (Kesehatan, Penalaran Kritis) . Alat dan bahan: Selotip atau kapur. Cara Membuat dan Bermain:',
      'Kegiatan 2 : Mengurutkan Cerita tentang Pembuatan Pakaian Adat (Penalaran Kritis, Komunikasi) . Alat dan bahan: Kartu bergambar proses pembuatan pakaian adat (misalnya, menenun, mewarnai, menjahit). Cara bermain: Berikan anak-anak kartu bergambar proses pembuatan pakaian adat secara acak. Minta mereka mengurutkan kartu tersebut sesuai urutan yang benar. Kegiatan ini mengembangkan pemahaman tentang urutan dan proses.',
      'Kegiatan 3 : Bermain "Siapa Aku?" versi Pakaian Adat (Komunikasi, Kolaborasi) . Alat dan bahan: Kartu dengan nama pakaian adat atau daerah, pita untuk mengikat di kepala. Cara bermain: Tempelkan kartu di dahi anak tanpa memberitahu isinya. Anak tersebut harus menebak pakaian adat atau daerah yang tertulis di kartu dengan mengajukan pertanyaan ya/tidak kepada teman-temannya. Ini mengembangkan kemampuan bertanya dan berpikir logis.',
      '3197225 471805 0 0 Kegiatan 1 : Membuat Kolase Rumah Gadang Sumatra Barat dari Biji-bijian (Kreativitas, Kewargaan) . Alat dan bahan: Biji-bijian (misalnya: Kacang hijau, beras, kwaci, biji pakan burung), Karton atau papan dasar sebagai alas, Lem , Gunting untuk anak-anak, Prin table gambar rumah gadang, Cara Membuat:',
      'Kegiatan 2 : Bermain Peran "Butik Kecil" (Komunikasi, Kolaborasi) . Alat dan bahan: Berbagai jenis pakaian anak-anak, cermin, gantungan baju, label harga mainan. Cara bermain: Set up area kelas seperti butik kecil. Bagi anak-anak menjadi penjual dan pembeli. Penjual harus melayani pembeli dengan ramah, sementara pembeli belajar memilih pakaian dan berinteraksi sopan. Setelah bermain, diskusikan perasaan mereka saat berperan sebagai penjual atau pembeli. Kegiatan ini membantu anak-anak belajar mengelola emosi dalam situasi sosial, melatih kesabaran, dan mengembangkan empati.',
      'Kegiatan 3 : "Topeng Perasaan" (Kreativitas, Komunikasi) . Alat dan bahan: Kertas karton, karet gelang, pensil warna. Cara bermain: Anak-anak membuat topeng yang menggambarkan emosi tertentu. Mereka kemudian memakai topeng dan memerankan situasi yang sesuai dengan emosi tersebut. Kegiatan ini membantu anak-anak mengekspresikan emosi melalui seni dan drama.',
      'Kegiatan 1 : Melengkapi Urutan Gambar Sesuai Petunjuk (Penalaran Kritis, Kemandirian) . Alat dan Bahan: Kertas karton, kertas HVS, spidol, gunting, penggaris. Cara Membuat dan Memainkan:',
      'Kegiatan 2 : "Cerita Berantai Emosi" (Komunikasi, Kolaborasi) . Alat dan bahan: Bola kecil, daftar emosi. Cara bermain: Anak-anak duduk melingkar. Guru memulai cerita dengan menyebutkan emosi ("Hari ini Ani merasa senang..."). Anak yang memegang bola melanjutkan cerita dengan emosi lain. Kegiatan ini mengembangkan kreativitas dan pemahaman tentang perubahan emosi dalam situasi berbeda.',
      'Kegiatan 3 : "Boneka Wortel" Kreativitas, Komunikasi) . Alat dan bahan: Wortel, pisau (digunakan oleh guru), pita, kancing, lem. Cara bermain: Guru memotong wortel menjadi dua bagian. Anak-anak menghias wortel menjadi boneka dengan ekspresi berbeda menggunakan pita dan kancing. Diskusikan situasi yang mungkin membuat boneka merasakan emosi tersebut. Kegiatan ini mengembangkan kreativitas dan pemahaman kontekstual emosi.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Recalling kegiatan dengan antusias dan berbagi perasaan',
      'Pamer hasil karya dengan bangga dan saling mengapresiasi',
      'Diskusi menyenangkan tentang hal menarik yang dipelajari hari ini',
    ],
  },
  {
    weekNum: 6,
    title: 'LINGKUNGANKU BERSIH, HIDUPKU SEHAT',
    topic: 'LINGKUNGANKU',
    subtopic: 'HIDUP BERSIH DAN SEHAT',
    modelPembelajaran: 'Inkuiri , STE A M',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Seni Kreatif Ampas Kelapa (Kreativitas, Kemandirian) . Alat dan Bahan: Ampas Kelapa, Pewarna makanan, Nampan atau wadah, Kertas HVS, Lem, Pensil, Cara Membuat:',
      'Kegiatan 2 : Eksperimen Mencuci Tangan (Penalaran Kritis, Kesehatan) . Alat dan bahan: Piring berisi air, merica bubuk, sabun cair. Cara bermain: Taburkan merica di atas air sebagai representasi kuman. Minta anak mencelupkan jari ke air tanpa sabun, lalu dengan sabun. Amati perbedaannya. Kegiatan ini menjelaskan pentingnya sabun dalam membersihkan kuman.',
      'Kegiatan 3 : Bermain Tebak Gerakan Kebersihan (Komunikasi, Kolaborasi) . Alat dan bahan: Kartu dengan nama aktivitas kebersihan. Cara bermain: Satu anak mengambil kartu dan memperagakan aktivitas tanpa suara, anak lain menebak. Kegiatan ini mengembangkan kemampuan komunikasi non-verbal dan pengenalan aktivitas kebersihan.',
      '3213735 273050 0 0 Kegiatan 1 : Mengambil Pompom Menggunakan Botol Plastik (Kemandirian, Penalaran Kritis) . Alat dan Bahan : Botol plastic , pom-pom , nampan. Cara Bermain:',
      'Kegiatan 2 : Membuat Sabun Apung (Kreativitas, Penalaran Kritis) . Alat dan bahan: Sabun batang, parutan, air hangat, baking soda, cetakan silikon. Cara bermain: Bantu anak memarut sabun, campur dengan air hangat dan baking soda. Cetak dan biarkan mengeras. Uji apakah sabun dapat mengapung. Kegiatan ini mengembangkan pemahaman tentang densitas.',
      'Kegiatan 3 : Membuat Diorama Lingkungan Bersih (Kewargaan, Kreativitas) . Alat dan bahan: Kotak sepatu, tanah, ranting, daun, balok kayu mini, kertas warna. Cara bermain: Ajak anak membuat diorama lingkungan bersih dalam kotak sepatu menggunakan bahan alam dan balok kayu mini. Kegiatan ini mengembangkan kreativitas dan kesadaran lingkungan.',
      'Kegiatan 1 : Menggiring Gelas Menggunakan Sedotan (Kemandirian, Kesehatan) . Alat dan bahan: Sedotan, gelas kertas, selotip, meja . Cara Bemain :',
      'Kegiatan 2 : Eksperimen Erosi Tanah (Penalaran Kritis, Kewargaan) . Alat dan bahan: Nampan, tanah, rumput atau tanaman kecil, air, gelas. Cara bermain: Buat dua model bukit di nampan, satu ditanami rumput, satu tidak. Siram dengan air dan amati perbedaan erosi. Kegiatan ini menjelaskan pentingnya tanaman dalam menjaga lingkungan.',
      'Kegiatan 3 : Membuat Kaca Pembesar dari Air (Penalaran Kritis, Kreativitas) . Alat dan bahan: Plastik bening, karet gelang, air. Cara bermain: Bantu anak membuat kaca pembesar sederhana dengan meregangkan plastik bening di atas gelas dan meneteskan air di tengahnya. Gunakan untuk mengamati benda-benda kecil. Kegiatan ini mengenalkan konsep pembesaran optik.',
      'Kegiatan 1 : Kerajinan Handprint Hutan (Kreativitas, Kewargaan) . Alat dan bahan: Cat warna abu-abu, hijau, putih dan hitam, Kuas, Kertas coklat, Gunting, Lem, Kertas HVS, Daun – opsional, Cara Membuat:',
      'Kegiatan 2 : Estafet Spons Bersih (Kolaborasi, Kesehatan) . Alat dan bahan: Spons, ember berisi air, ember kosong, gelas plastik. Cara bermain: Bagi anak menjadi beberapa tim. Setiap tim harus memindahkan air dari ember berisi ke ember kosong menggunakan spons. Anak berlari membawa spons basah dan memerasnya ke ember kosong. Kegiatan ini melatih motorik kasar dan koordinasi.',
      'Kegiatan 3 : Menghitung dan Mengelompokkan Biji-bijian (Penalaran Kritis, Kemandirian) . Alat dan bahan: Berbagai jenis biji-bijian (seperti kacang merah, kacang hijau, jagung), wadah kecil, kartu angka. Cara bermain: Siapkan beberapa wadah kecil dan isi dengan berbagai jenis biji-bijian yang sudah dicampur. Minta anak untuk mengelompokkan biji-bijian sesuai jenisnya ke dalam wadah terpisah. Setelah itu, ajak anak menghitung jumlah biji-bijian di setiap wadah dan mencocokkannya dengan kartu angka yang sesuai. Kegiatan ini mengembangkan kemampuan klasifikasi, berhitung, dan pengenalan angka.',
      'Kegiatan 1 : Membawa Gelas Menggunakan Lidi Sambil Melompat Lewati Rintangan (Kesehatan, Kemandirian) . Alat dan Bahan: 2 Gelas kertas, 2 Lidi, busa/ hula hop. Cara Membuat dan Memainkannya:',
      'Kegiatan 2 : Lomba Mengepel Estafet (Kolaborasi, Kewargaan) . Alat dan bahan: Kain pel mini, ember kecil berisi air, botol plastik sebagai rintangan. Cara bermain: Buat jalur mengepel dengan meletakkan botol plastik sebagai rintangan. Bagi anak menjadi beberapa tim untuk berlomba mengepel melewati rintangan. Kegiatan ini melatih koordinasi, keseimbangan, dan kecepatan.',
      'Kegiatan 3 : Memindahkan Biji-bijian dengan Sumpit (Kemandirian, Penalaran Kritis) . Alat dan bahan: Dua mangkuk, biji-bijian (seperti kacang atau manik-manik besar), sumpit kayu. Cara bermain: Minta anak memindahkan biji-bijian dari satu mangkuk ke mangkuk lain menggunakan sumpit. Kegiatan ini melatih motorik halus dan koordinasi mata-tangan.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Bermain tepuk tangan "Tepuk Bersih-Bersih " dengan irama ceria',
      'Anak bergiliran menunjukkan gerakan favorit dari kegiatan hari ini',
      'Parade hasil karya keliling kelas sambil bernyanyi gembira',
    ],
  },
  {
    weekNum: 7,
    title: 'RUMAHKU SURGA KU S',
    topic: 'LINGKUNGANKU',
    subtopic: 'RUMAHKU',
    modelPembelajaran: 'PjBL , Kolaboratif',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1: Membuat Rumah Gadang Dari Daun (Kreativitas, Kemandirian) . Alat dan bahan: Kertas HVS, Daun (berbagai jenis dan ukuran, lebih baik yang berwarna hijau), Gunting (pastikan anak menggunakan gunting yang aman untuk anak-anak), Lem (lem yang aman untuk anak-anak, seperti lem kertas),',
      'Kegiatan 2: Miniatur Rumah dari Kardus (Kolaborasi, Komunikasi) . Alat dan bahan: Kardus bekas berbagai ukuran, gunting, lem, kertas warna, spidol, dan pensil warna. Cara bermain: Anak-anak dibagi menjadi kelompok kecil dan diberikan kardus bekas serta alat-alat lainnya. Mereka diminta untuk membuat miniatur rumah menggunakan kardus tersebut. Guru membimbing anak-anak untuk membuat bagian-bagian rumah seperti atap, dinding, jendela, dan pintu. Anak-anak dapat menghias rumah mereka menggunakan kertas warna dan pensil warna. Setelah selesai, setiap kelompok mempresentasikan rumah mereka dan menyebutkan bagian-bagiannya.',
      'Kegiatan 3: Eksperimen Atap Bocor (Penalaran Kritis) . Alat dan Bahan: Botol semprot air, karton, plastik. Cara Bermain: Anak membuat atap dari berbagai bahan dan menyemprotkan air untuk melihat bahan mana yang terbaik untuk atap.',
      'Kegiatan 2: Bermain Peran "Keluarga di Rumah" (Kewargaan, Kolaborasi) . Alat dan bahan: Kostum sederhana (celemek, topi koki, dll.), peralatan rumah tangga mainan (piring, gelas, sapu, dll.), dan area bermain yang ditata menyerupai ruangan di rumah. Cara bermain: Anak-anak dibagi menjadi beberapa kelompok yang mewakili keluarga. Setiap anak mendapat peran sebagai anggota keluarga (ayah, ibu, anak, kakek, nenek). Mereka diminta untuk bermain peran melakukan aktivitas sehari-hari di rumah, seperti memasak, makan bersama, membersihkan rumah, atau bersantai di ruang keluarga. Guru membimbing anak-anak untuk menyebutkan nama ruangan dan fungsinya saat bermain peran.',
      'Kegiatan 3: Arsitek Cilik - Merancang Rumah Ramah Lingkungan (Penalaran Kritis, Kreativitas) . Alat dan bahan: Kertas gambar, pensil, krayon, stiker pohon dan bunga, kertas origami hijau, lem stick , gunting anak, template panel surya dari kertas silver , cotton buds , kertas biru. Cara bermain: Anak menggambar bentuk dasar rumah menggunakan penggaris, menempel template panel surya di atap, membuat kincir angin dari cotton buds , menambahkan taman dengan stiker pohon dan bunga, membuat kolam air hujan dari kertas biru, lalu mewarnai seluruh rumah. Setelah selesai, anak mempresentasikan hasil karyanya dan menjelaskan bagaimana setiap elemen membantu menjaga lingkungan.',
      'Kegiatan 2: Menggambar dan Mewarnai Rumah Impian (Kreativitas, Komunikasi) . Alat dan bahan: Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air. Cara bermain: Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar.',
      'Kegiatan 3: Membangun Rumah dari Lego (Kolaborasi, Penalaran Kritis) . Alat dan Bahan: Balok Lego berbagai ukuran dan warna, alas bermain Lego, kartu contoh rumah sederhana. Cara Bermain: Anak dibagi kelompok 2-3 orang, masing-masing mendapat satu set Lego dan alas. Guru menunjukkan kartu contoh rumah sebagai inspirasi. Anak menyusun balok Lego membentuk rumah dengan dinding, atap, pintu, dan jendela. Setelah selesai, anak menghitung jumlah bagian rumah yang dibuat dan menyebutkan warna balok untuk setiap bagian. Kegiatan diakhiri dengan tur melihat hasil karya kelompok lain.',
      'Kegiatan 2: Puzzle Bagian-bagian Rumah (Komunikasi, Kreativitas) . Alat dan bahan: Kertas gambar ukuran besar, pensil, pensil warna, krayon, atau cat air. Cara bermain: Setiap anak diberikan kertas gambar dan alat mewarnai. Mereka diminta untuk menggambar rumah impian mereka, termasuk bagian-bagian rumah yang mereka inginkan. Guru dapat memberikan contoh bagian-bagian rumah yang bisa digambar, seperti atap, jendela, pintu, taman, atau garasi. Setelah selesai menggambar, anak-anak mewarnai gambar mereka dan kemudian menceritakan tentang rumah impian mereka kepada teman-teman, termasuk menyebutkan bagian-bagian rumah yang mereka gambar.',
      'Kegiatan 3: Eksperimen Cahaya dan Jendela (Penalaran Kritis) . Alat dan Bahan: Senter, kertas transparan, kertas buram. Cara Bermain: Anak mencoba melihat bagaimana cahaya masuk melalui berbagai bahan yang digunakan untuk jendela.',
      'Kegiatan 2: Eksplorasi Bahan Bangunan Rumah (Penalaran Kritis, Kreativitas) . Alat dan bahan: Berbagai bahan bangunan dalam ukuran kecil dan aman (misalnya potongan kayu kecil, batu bata mainan, genteng miniatur, pasir, dll.), wadah air, dan cetakan pasir. Cara bermain: Anak-anak dibagi menjadi kelompok kecil. Setiap kelompok diberikan berbagai bahan bangunan miniatur. Mereka diminta untuk mengeksplorasi bahan-bahan tersebut, merasakan teksturnya, dan mencoba membuat struktur sederhana. Guru menjelaskan fungsi dari setiap bahan dalam pembangunan rumah. Anak-anak juga dapat bermain dengan pasir dan air untuk membuat "semen" dan mencoba "membangun" dinding kecil. Kegiatan ini membantu anak-anak memahami bahan-bahan yang digunakan dalam membangun rumah.',
      'Kegiatan 3: Mengukur dengan Penggaris (Penalaran Kritis) . Alat dan Bahan: Penggaris, kertas gambar. Cara Bermain: Anak mengukur gambar jendela atau pintu yang mereka buat dan mencatat hasilnya.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Parade rumah impian keliling kelas sambil bernyanyi dengan gembira',
      'Tebak-tebakan seru tentang bagian rumah dengan hadiah tepuk tangan meriah',
      'Dance party "Rumah Bahagia" dengan gerakan membangun rumah',
    ],
  },
  {
    weekNum: 8,
    title: 'SERUNYA BERMAIN DI TAMAN SEKOLAHKU',
    topic: 'LINGKUNGANKU',
    subtopic: 'SEKOLAHKU',
    modelPembelajaran: 'STEAM, PjBL, Kolaboratif',
    dpl: ['✅ DPL1 Keimanan dan Ketakwaan terhadap Tuhan YME'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Balap Memindahkan Traffic Cone Dengan Kaki (Kesehatan, Kemandirian) . Alat dan Bahan: Traffic Cone (bisa menggunakan benda lain yang ringan dan mudah dijepit dengan kaki) , Hula hop',
      'Kegiatan 2 : Bermain Telepon-teleponan (Komunikasi, Kolaborasi) . Alat dan bahan: Dua buah gelas plastik, tali panjang. Cara bermain: Buat "telepon" sederhana dengan menghubungkan dua gelas plastik menggunakan tali. Bagi anak-anak berpasangan dan minta mereka bercakap-cakap menggunakan "telepon" tersebut. Berikan tema percakapan, seperti "mengundang teman ke pesta ulang tahun" atau "menanyakan kabar teman yang sakit". Kegiatan ini melatih keterampilan berbicara dan mendengarkan, serta mengembangkan kemampuan berkomunikasi dalam berbagai konteks sosial.',
      'Kegiatan 3 : Permainan "Apa yang Berubah?" (Penalaran Kritis, Komunikasi) . Alat dan bahan: Berbagai benda kecil. Cara bermain: Letakkan beberapa benda di atas meja. Minta anak-anak mengamati benda-benda tersebut selama satu menit. Kemudian, minta anak-anak menutup mata. Ubah posisi atau hilangkan salah satu benda. Minta anak-anak membuka mata dan menjelaskan apa yang berubah. Dorong mereka untuk menjelaskan dengan kalimat lengkap. Kegiatan ini melatih kemampuan observasi, memori, dan kemampuan menjelaskan dengan bahasa yang jelas.',
      'Kegiatan 1 : STEAM Membuat Kipas Matahari dari Piring Kertas (Kreativitas, Kemandirian) . Alat dan bahan: Piring kertas, Stik es krim, Kertas origami warna kuning dan oranye, Lem, Gunting, Cat warna . Cara Membuat:',
      'Kegiatan 2 : Membuat Maket Sekolah (Kreativitas, Kolaborasi) . Alat dan bahan: Kardus bekas, kertas warna, lem, gunting, bahan alam (ranting, daun kering). Cara bermain: Ajak anak-anak membuat maket sekolah menggunakan kardus bekas. Mereka dapat menambahkan detail seperti pohon dari ranting dan daun kering. Kegiatan ini melatih perencanaan, motorik halus, dan kreativitas.',
      'Kegiatan 3 : Permainan "Simon Says" versi Sopan Santun (Kewargaan, Komunikasi) . Alat dan bahan: Tidak diperlukan alat khusus. Cara bermain: Guru memberikan instruksi yang berhubungan dengan sopan santun, misalnya "Simon says ucapkan terima kasih", "Simon says minta maaf", atau "Simon says bersalaman". Anak-anak harus melakukan instruksi jika diawali dengan "Simon says". Jika tidak, mereka harus tetap diam. Kegiatan ini melatih pendengaran, konsentrasi, dan membiasakan anak-anak dengan perilaku sopan santun.',
      'Kegiatan 1 : Coding Warna . Alat dan Bahan (Penalaran Kritis, Kemandirian) : Print table gambar lingkaran berwarna, Spidol,',
      'Kegiatan 2 : Membangun Gedung Sekolah dari Balok Magnetik (Kreativitas, Kolaborasi) . Alat dan bahan: Balok magnetik berbagai bentuk dan warna. Cara bermain: Tantang anak-anak untuk membangun replika gedung sekolah menggunakan balok magnetik. Mereka harus memperhatikan bentuk dan warna sesuai dengan gedung sekolah asli. Kegiatan ini melatih koordinasi mata-tangan dan pemahaman spasial.',
      'Kegiatan 3 : Tebak Emosi (Komunikasi, Kolaborasi) . Alat dan bahan: Kartu bergambar ekspresi wajah yang menunjukkan berbagai emosi. Cara bermain: Tunjukkan kartu emosi kepada seorang anak tanpa memperlihatkannya kepada yang lain. Anak tersebut harus memperagakan emosi yang ada di kartu tanpa berbicara. Anak-anak lain harus menebak emosi apa yang diperagakan. Setelah berhasil ditebak, diskusikan situasi yang mungkin menyebabkan emosi tersebut. Kegiatan ini membantu anak-anak memahami dan mengekspresikan emosi, serta mengembangkan empati.',
      'Kegiatan 1 : Membuat Roket Nama Sendiri (Kreativitas, Kemandirian) . Alat dan bahan: Kertas HVS/kertas konstruksi hitam, Kertas Origami, Lem, Gunting, Spidol, Crayon, Stik es krim . Cara Membuat:',
      'Kegiatan 2 : Melengkapi Huruf yang Hilang (Penalaran Kritis, Komunikasi) . Alat dan bahan: Print table huruf, kertas origami, lem. Cara bermain: Siapkan print table huruf dengan beberapa huruf dikosongkan secara acak. Buat bentuk persegi dari kertas origami lalu potong, kemudian tulis huruf-huruf. Selanjutnya ajak anak-anak untuk menemukan dan menempelkan huruf yang hilang sehingga huruf-huruf dapat diisi sesuai urutan yang benar. Kegiatan ini membantu pengembangan keterampilan bahasa, pengenalan huruf, dan pemahaman tentang urutan huruf dalam kata-kata',
      'Kegiatan 3 : Cerita Berantai (Komunikasi, Kolaborasi) . Alat dan bahan: Bola kecil atau boneka tangan. Cara bermain: Anak-anak duduk dalam lingkaran. Guru memulai cerita dengan satu kalimat, lalu memberikan bola atau boneka tangan kepada anak di sebelahnya. Anak tersebut harus melanjutkan cerita dengan satu kalimat, lalu memberikan bola ke anak berikutnya. Lanjutkan hingga semua anak mendapat giliran dan cerita selesai. Kegiatan ini mengembangkan kreativitas, kemampuan mendengarkan, dan keterampilan berbicara.',
      'Kegiatan 1 : STEAM Kamera Mainan (Kreativitas, Kemandirian) . Alat dan bahan: Tabung karton, Lem, Kotak kecil (dapat menggunakan kotak sereal mini), selotip (selotip bermotif / opsional ), Gunting, Pita . Cara Membuat:',
      'Kegiatan 2 : Bermain Peran "Sekolah-sekolahan" (Kewargaan, Komunikasi) . Alat dan bahan: Meja, kursi, papan tulis mini, alat tulis. Cara bermain: Atur ruangan menyerupai kelas. Biarkan anak-anak bergantian berperan sebagai guru dan murid. Guru dapat memberikan tema atau situasi sederhana, seperti "hari pertama sekolah" atau "belajar tentang hewan". Anak yang berperan sebagai guru harus memimpin kelas, memberikan instruksi sederhana, dan berinteraksi dengan "murid-muridnya". Anak-anak yang berperan sebagai murid harus mendengarkan, mengikuti instruksi, dan berpartisipasi dalam "pelajaran". Kegiatan ini mengembangkan keterampilan sosial, kemampuan berbicara di depan umum, dan pemahaman tentang peran dan tanggung jawab di lingkungan sekolah',
      'Kegiatan 3 : Mencocokkan Huruf dan Gambar (Penalaran Kritis, Komunikasi) . Alat dan bahan: Kartu huruf, kartu gambar benda/hewan yang namanya diawali huruf tersebut. Cara bermain: Letakkan kartu huruf dan kartu gambar secara acak di lantai. Minta anak-anak untuk mencocokkan kartu huruf dengan gambar yang sesuai, misalnya huruf A dengan gambar apel. Kegiatan ini membantu anak mengenal huruf dan mengasosiasikannya dengan kata, yang merupakan dasar literasi. Anak juga belajar mengkategorikan dan menghubungkan konsep.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Yel-yel kelas bersama dengan gerakan ceria "Aku anak pintar, aku anak hebat!"',
      'Parade karya keliling kelas sambil bertepuk tangan dan bernyanyi',
      'Permainan "Siapa yang paling hebat hari ini?" dengan saling memberikan pujian',
    ],
  },
  {
    weekNum: 9,
    title: 'PETUALANGAN DI KEBUN BINATANG',
    topic: 'BINATANG',
    subtopic: 'KEBUN BINATANG',
    modelPembelajaran: 'STEAM , PjBL, Kolaboratif',
    dpl: ['✅ DPL1 Keimanan dan Ketakwaan terhadap Tuhan YME'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : STEAM Membuat Kandang Binatang Mini dari Stik Es Krim (Kreativitas, Kemandirian) . Alat dan Bahan: Stik es krim, lem, cat warna, kardus atau biasa mengunakan s terofoam lembaran. Cara Membuat:',
      'Kegiatan 2 : Mengelompokkan Binatang (Penalaran Kritis) . Alat dan bahan main: Gambar binatang kebun binatang dengan ukuran berbeda, kartu bertuliskan "lebih besar dari" dan "lebih kecil dari" Cara bermain: Anak diminta untuk membandingkan ukuran dua binatang dan meletakkan kartu "lebih besar dari" atau "lebih kecil dari" di antara kedua gambar binatang tersebut.',
      'Kegiatan 3 : Membuat Topeng Hewan (Kreativitas, Komunikasi) . Alat dan bahan: Piring kertas, cat, karet gelang, gunting, lem, bahan dekorasi seperti bulu atau kertas krep. Cara bermain: Anak-anak dapat memilih hewan favorit mereka dan membuat topeng menggunakan piring kertas. Mereka bisa menggambar dan mewarnai wajah hewan, lalu menambahkan detail seperti telinga atau hidung menggunakan bahan tambahan. Setelah selesai, mereka bisa memakainya dan bermain peran sebagai hewan tersebut.',
      'Kegiatan 1 : Menghias Cangkang Telur (Kreativitas, Kemandirian) . Alat dan bahan: Cangkang telur, cat warna, kuas, pallet atau mangkuk atau lainnya untuk wadah cat. Cara Membuat:',
      'Kegiatan 2 : Permainan Memori Hewan (Penalaran Kritis) . Alat dan bahan: Kartu bergambar hewan kebun binatang (dua set identik). Cara bermain: Letakkan kartu secara terbalik di meja. Anak-anak bergantian membalik dua kartu untuk menemukan pasangannya. Jika cocok, mereka bisa mengambil kartu tersebut. Permainan ini melatih daya ingat dan konsentrasi anak.',
      'Kegiatan 3 : Permainan Peran Penjaga Kebun Binatang (Kolaborasi, Komunikasi) . Alat dan bahan: Kostum penjaga kebun binatang sederhana (topi, rompi), peralatan mainan (sekop, ember, sikat), boneka hewan. Cara bermain: Anak-anak dapat berperan sebagai penjaga kebun binatang. Mereka bisa "memberi makan" boneka hewan, membersihkan kandang imajiner, atau memberikan "perawatan medis" pada hewan yang sakit. Permainan ini mengembangkan imajinasi dan pemahaman tentang perawatan hewan.',
      'Kegiatan 1 : Membuat Harimau Lucu (Kreativitas, Kemandirian) . Alat dan Bahan : Kertas karton (warna oranye dan kuning), pensil, gunting, penggaris. Cara Membuat dan Memainkannya:',
      'Kegiatan 2 : Konsep Bilangan (Penalaran Kritis) . Alat dan bahan main: Kartu angka 1-10, miniatur binatang kebun binatang Cara bermain: Anak diminta untuk mengambil kartu angka secara acak, kemudian menghitung dan mengambil miniatur binatang sesuai dengan angka pada kartu.',
      'Kegiatan 3 : Menirukan Gerakan Binatang (Kesehatan, Komunikasi) . Alat dan bahan main: Area kosong untuk bergerak Cara bermain: Guru menyebutkan nama binatang dan anak diminta untuk menirukan gerakan binatang tersebut. Misalnya, "Gerakkan seperti gajah!", "Melompat seperti kanguru!", "Merayap seperti ular!".',
      'Kegiatan 1: STEAM Membuat Payung Bentuk K a tak Dari Kertas (Kreativitas, Kemandirian) . Alat dan bahan: Kertas hijau dan putih, pensil, selotip dua sisi, Gunting . Cara Membuat:',
      'Kegiatan 2 : Safari Alfabet (Komunikasi, Penalaran Kritis ) . Alat dan bahan: Kartu alfabet, gambar hewan kebun binatang. Cara bermain: Sebarkan kartu alfabet dan gambar hewan di lantai. Anak-anak harus mencocokkan hewan dengan huruf awal namanya (mis. G untuk Gajah, S untuk Singa). Mereka juga bisa menyusun nama hewan menggunakan kartu huruf.',
      'Kegiatan 3 : Hitung Kaki Hewan (Penalaran Kritis) . Alat dan bahan: Kartu bergambar hewan kebun binatang, papan tulis kecil, spidol. Cara bermain: Anak-anak mengambil kartu hewan, menghitung jumlah kaki hewan tersebut, dan menuliskan angkanya di papan tulis. Mereka bisa membandingkan jumlah kaki antar hewan dan menjumlahkannya.',
      'Kegiatan 1 : Sensory Pathway Dengan Tutup Botol (Kesehatan, Kemandirian) . Alat dan Bahan, Nampan atau kardus bekas, Tutup Botol, Gambar , Tepung, Lem, Kertas HVS, Pensil . Cara Membuat dan Memainkannya :',
      'Kegiatan 2 : Permainan Tebak Suara Hewan (Komunikasi, Penalaran Kritis) . Alat dan bahan: Rekaman suara hewan kebun binatang, pemutar audio. Cara bermain: Putar rekaman suara hewan dan minta anak-anak menebak hewan apa yang mengeluarkan suara tersebut. Mereka bisa mengangkat tangan atau menulis jawabannya. Kegiatan ini melatih pendengaran dan pengetahuan anak tentang berbagai jenis hewan.',
      'Kegiatan 3 : Sand Art Hewan Kebun Binatang (Kreativitas) : Alat: Lem, pasir berwarna, gambar hewan. Cara bermain: Anak-anak mengoleskan lem pada gambar hewan dan menaburkan pasir berwarna di atasnya, menciptakan desain berwarna. Ini melatih kreativitas dan koordinasi tangan-mata.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Parade Hewan Favorit: Anak mengenakan topeng hewan buatan mereka dan berbaris sambil menirukan suara hewan favoritnya dengan penuh kegembiraan',
      'Tarian Kebun Binatang: Menari bersama dengan gerakan berbagai hewan sambil menyanyikan lagu tentang kebun binatang atau lagu yang mereka ciptakan sendiri',
      'Show and Tell Karya Hebat: Setiap anak memamerkan hasil karya terbaiknya dengan bangga dan menerima tepuk tangan meriah dari teman-teman',
    ],
  },
  {
    weekNum: 10,
    title: 'MENGENAL KEHIDUPAN DI BAWAH LAUT',
    topic: 'BINATANG',
    subtopic: 'BINATANG AIR',
    modelPembelajaran: 'PjBL, STEAM, Kolaboratif',
    dpl: ['✅ DPL1 Keimanan dan Ketakwaan terhadap Tuhan YME'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Membuat Kolase Ikan dari Cup Cake (Kreativitas, Kemandirian) . Alat dan bahan: Kertas gambar, lem, Kertas cup cake), spidol. Cara membuat: Gambar outline ikan di kertas, cup cake kemudian beri warna. Atau bisa juga membuat ikan menggunakan piring kertas .',
      'Kegiatan 2 : Kolam Angka Ikan (Penalaran Kritis, Komunikasi) . Alat dan bahan: Kertas biru besar, gambar ikan dari kertas warna-warni, spidol , tali, magnetik . Cara bermain: Buat "kolam" dari kertas biru. Tulis angka 1-10 pada ikan kertas. Minta anak-anak "memancing" ikan menggunakan tali dan magnetik dan menyebutkan angkanya. Setelah itu, mereka bisa mengurutkan ikan dari angka terkecil ke terbesar. Kegiatan ini mengembangkan pengenalan angka dan konsep urutan',
      'Kegiatan 3 : Hitung Sisik Ikan (Penalaran Kritis, Kemandirian) . Alat dan bahan: Gambar ikan besar, kancing atau kerikil sebagai "sisik". Cara bermain: Sediakan gambar ikan besar. Minta anak-anak menempelkan "sisik" (kancing atau kerikil) pada ikan sambil menghitung. Beri mereka target jumlah tertentu, misalnya 15 sisik. Kegiatan ini melatih keterampilan berhitung dan korespondensi satu-satu.',
      'Kegiatan 1 : STEAM Membuat Kerajinan Hiu Piring Kertas Bergerak (Kreativitas, Penalaran Kritis) . Alat dan Bahan: Piring kertas, Printable ambar hiu atau binatang lainnya, kertas warna dengan berbagai warna, Mata Googly, stik es krim, LemSpidol, Pensil, Gunting . Cara Membuat:',
      'Kegiatan 2 : Ukur Ikan dengan Stik Eskrim (Penalaran Kritis, Komunikasi) . Alat dan bahan: Gambar ikan berbagai ukuran, stik eskrim. Cara bermain: Sediakan gambar ikan dalam berbagai ukuran. Minta anak-anak mengukur panjang ikan menggunakan stik eskrim sebagai unit pengukuran non-standar. Mereka bisa membandingkan ukuran ikan. Ini memperkenalkan konsep pengukuran dan perbandingan.',
      'Kegiatan 3 : Ikan Pola (Penalaran Kritis, Kreativitas) . Alat dan bahan: Stik eskrim warna-warni, lem, kertas. Cara bermain: Buat pola sederhana menggunakan stik eskrim warna (misalnya: merah-biru-merah-biru) membentuk "ikan". Minta anak-anak melanjutkan pola. Diskusikan pola yang terbentuk. Kegiatan ini mengembangkan pemahaman tentang pola dan urutan.',
      'Kegiatan 1 : Susun Puzzle Berdasarkan Angka (Penalaran Kritis, Kemandirian) . Alat dan bahan: Puzzle dan angka. Cara Bermain:',
      'Kegiatan 2 : Tangkap Ikan Sesuai Jumlah (Penalaran Kritis, Kolaborasi) . Alat dan bahan: Kertas berbentuk ikan dengan angka, jaring kecil atau sendok. Cara bermain: Sebar ikan kertas dengan angka di lantai. Sebutkan sebuah angka dan minta anak-anak "menangkap" sejumlah ikan yang sesuai dengan angka tersebut. Ini melatih pengenalan angka dan konsep kuantitas.',
      'Kegiatan 3 : Tebak Jumlah Ikan (Penalaran Kritis, Komunikasi) . Alat dan bahan: Stoples kaca, kancing atau manik-manik sebagai "ikan". Cara bermain: Isi stoples dengan sejumlah "ikan". Minta anak-anak menebak berapa jumlah ikan dalam stoples. Setelah semua menebak, hitung bersama-sama. Kegiatan ini mengembangkan estimasi dan keterampilan berhitung.',
      'Kegiatan 1 : Isi Sesuai Jumlah Yang Ada Di Dalam Lingkaran (Penalaran Kritis, Kemandirian) . Alat dan Bahan :Holahop.Printable angka',
      'Kegiatan 2 : Ikan Simetris (Kreativitas, Penalaran Kritis) . Alat dan bahan: Kertas, cat air, kuas. Cara bermain: Lipat kertas menjadi dua. Minta anak-anak melukis setengah ikan di satu sisi lipatan dengan cat air. Lipat kertas untuk membuat cetakan simetris di sisi lain. Diskusikan konsep simetri. Ini mengembangkan pemahaman tentang simetri dan kreativitas.',
      'Kegiatan 3 : Estafet Ikan Plastisin (Kesehatan, Kolaborasi) . Alat dan bahan: Plastisin untuk membuat ikan, sendok. Cara bermain: Anak-anak membuat ikan kecil dari plastisin. Kemudian, dalam bentuk lomba estafet, mereka memindahkan "ikan" dari satu tempat ke tempat lain menggunakan sendok. Ini melatih keseimbangan, koordinasi, dan kontrol motorik halus.',
      '3502025 144780 0 0 Kegiatan 1 : Menjatuhkan Bola Menggunakan Air (Kesehatan, Penalaran Kritis) . Alat dan bahan: Bola plastic, gelas kertas, Meja, botol spray (bisa diganti spuit besar), air. Cara Bermain:',
      'Kegiatan 2 : Ikan Keseimbangan (Kesehatan, Kemandirian) . Alat dan bahan: Bantal kecil atau kantong biji berbentuk ikan yang dibuat dari kain dan diisi biji-bijian. Cara bermain: Anak-anak mencoba menyeimbangkan "ikan" di atas kepala mereka sambil berjalan pada garis lurus yang dibuat dari ranting. Variasikan dengan meletakkan "ikan" di bagian tubuh lain. Ini melatih keseimbangan dan postur tubuh.',
      'Kegiatan 3 : Lompat Ikan Salmon (Kesehatan, Kreativitas) . Alat dan bahan: Ranting pohon sebagai rintangan, karet gelang. Cara bermain: Susun ranting di lantai sebagai "air terjun". Anak-anak melompati ranting sambil memegang karet gelang di antara jari kaki mereka, seolah-olah mereka adalah ikan salmon yang melompat. Tingkatkan kesulitan dengan menambah tinggi rintangan. Ini melatih kekuatan kaki dan koordinasi tubuh.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Parade hasil karya dengan musik ceria berkeliling kelas sambil menunjukkan bangga',
      'Tepuk tangan meriah untuk semua hasil karya teman-teman',
      'Bermain tebak-tebakan seru tentang binatang air dengan hadiah stiker',
    ],
  },
  {
    weekNum: 11,
    title: 'JELAJAH DUNIA : BINATANG DARAT SEKITAR KITA',
    topic: 'BINATANG',
    subtopic: 'BINATANG DARAT',
    modelPembelajaran: 'Inkuiri , Kolaboratif',
    dpl: ['✅ DPL1 Keimanan dan Ketakwaan terhadap Tuhan YME'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Ayam Bersuara (Kreativitas, Komunikasi) . Alat dan Bahan: Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting. Cara Membuat dan Memainkannya :',
      'Kegiatan 2 : Mengelompokkan Binatang (Penalaran Kritis, Kognitif) . Alat dan bahan: Kartu bergambar berbagai binatang darat, keranjang/wadah Cara bermain: Guru menyediakan kartu bergambar binatang darat dan 2 keranjang. Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki).',
      'Kegiatan 3 : Estafet "Beri Makan Binatang" (Kolaborasi, Kesehatan) . Alat dan bahan: Ember berisi "makanan" ( jagung, kacang-kacangan , daun ), sendok, gambar ayam dan kambing. Cara bermain: Anak berlomba memindahkan "makanan" ke piring yang benar di depan gambar binatang sesuai dengan makanannya .',
      'Kegiatan 1 : Balap Lari Kelinci dan Kura-Kura (Kemandirian, Kesehatan) . Alat dan Bahan: Printable gambar kelinci dan kura-kura, sedotan, gunting, lem, benang. Cara Membuat dan Memiankannya :',
      'Kegiatan 2 : Labirin Padang Rumput (Penalaran Kritis, Kemandirian) . Alat dan bahan: Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat. Cara bermain: Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu "sapi" mereka melalui labirin untuk mencapai padang rumput.',
      'Kegiatan 3 : Membuat Lonceng Sapi (Kreativitas, Kemandirian) . Alat dan bahan: Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering. Cara bermain: Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher "sapi" mereka saat bermain peran.',
      'Kegiatan 1 : Ayam Bersuara (Kolaborasi, Kesehatan) . Alat dan Bahan: Gelas Plastik, printable gambar ayam, senar, lidi, lem, gunting. Cara Membuat dan Memainkannya :',
      'Kegiatan 2 : Mengelompokkan Binatang (Penalaran Kritis, Komunikasi) . Alat dan bahan: Kartu bergambar berbagai binatang darat, keranjang/wadah Cara bermain: Guru menyediakan kartu bergambar binatang darat dan 2 keranjang (Penalaran Kritis, Komunikasi) . Anak-anak diminta mengelompokkan kartu binatang ke keranjang berdasarkan jumlah kakinya (2 kaki dan 4 kaki).',
      'Kegiatan 3 : Estafet "Beri Makan Binatang" (Kolaborasi, Kesehatan , Keimanan dan Ketakwaan ) . Alat dan bahan: Ember berisi "makanan" ( jagung, kacang-kacangan , daun ), sendok, gambar ayam dan kambing. Cara bermain: Anak berlomba memindahkan "makanan" ke piring yang benar di depan gambar binatang sesuai dengan makanannya .',
      '3095625 58420 0 0 Kegiatan 1 : Kolase Domba Berbulu Kapas (Kreativitas, Kemandirian, Kesehatan). Alat dan Bahan: Kertas gambar dengan sketsa domba, kapas secukupnya, lem cair, crayon atau pensil warna, gunting (untuk guru), dan tisu basah untuk membersihkan tangan. Cara Bermain:',
      'Kegiatan 2 : Labirin Padang Rumput (Kreativitas, Kesehatan) . Alat dan bahan: Ranting pohon, daun kering, batu kerikil, figur sapi kecil dari batu atau kerikil yang dicat. Cara bermain: Buat labirin di lantai atau di atas karton besar menggunakan ranting pohon sebagai dinding labirin. Tambahkan daun kering sebagai rumput. Ajak anak-anak untuk memandu "sapi" mereka melalui labirin untuk mencapai padang rumput.',
      'Kegiatan 3 : Membuat Lonceng Sapi (Kemandirian, Kesehatan) . Alat dan bahan: Cangkang kerang atau batok kelapa kecil, benang atau tali serat alami, biji-bijian kering. Cara bermain: Bantu anak-anak membuat lonceng sapi sederhana menggunakan cangkang kerang atau batok kelapa kecil. Masukkan biji-bijian kering ke dalamnya dan ikat dengan benang atau tali serat alami. Anak-anak dapat menggantungkan lonceng ini di leher "sapi" mereka saat bermain peran.',
      'Kegiatan 1 : Landak Dari Tanah Liat (Kreativitas, Kemandirian) . Alat dan bahan: tusuk gigi atau lidi, tanah liat. Cara Membuat:',
      'Kegiatan 2 : Lompat Kelinci (Kesehatan, Kemandirian , Keimanan dan Ketakwaan) . Alat dan bahan: Kertas warna atau kapur untuk membuat lingkaran di lantai. Cara bermain: Buat beberapa lingkaran di lantai menggunakan kertas warna atau kapur. Minta anak-anak untuk berpura-pura menjadi katak dan melompat dari satu lingkaran ke lingkaran lainnya. Variasikan jarak antar lingkaran untuk meningkatkan tantangan. Kegiatan ini membantu mengembangkan kekuatan otot kaki dan koordinasi',
      'Kegiatan 3 : Merayap Seperti Ular (Kesehatan, Kreativitas) . Alat dan bahan: Tali atau selotip untuk membuat jalur meliuk-liuk di lantai. Cara bermain: Buat jalur meliuk-liuk di lantai menggunakan tali atau selotip. Minta anak-anak untuk merayap seperti ular mengikuti jalur tersebut. Variasikan dengan membuat terowongan dari kardus bekas untuk dilalui. Kegiatan ini membantu melatih koordinasi tubuh dan kelenturan',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Bermain "Tebak Aku Siapa" sambil menirukan gerakan dan suara binatang favorit',
      'Parade kostum binatang menggunakan hasil karya hari ini sambil berteriak "Hore!"',
      'Menyanyi dan menari lagu "Kebun Binatang" dengan gerakan lucu binatang',
    ],
  },
  {
    weekNum: 12,
    title: 'SAYANG SEMUA MAKHLUK CIPTAAN TUHAN',
    topic: 'BINATANG',
    subtopic: 'SAYANG BINATANG',
    modelPembelajaran: 'P j BL , STEAM',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1: Membuat Kipas Berbentuk Merak (Kreativitas) . Alat dan Bahan , Kertas origami, Gunting, Lem, Cara Membuat :',
      'Kegiatan 2 : Membuat Kolase Hewan dari Daun Kering (Keimanan dan Ketakwaan) . Alat dan bahan: Daun kering berbagai bentuk dan warna, kertas karton, lem. Cara bermain: Ajak anak-anak mengumpulkan daun kering di halaman. Gambar sketsa hewan sederhana di kertas karton. Minta anak menempelkan daun-daun kering untuk mengisi sketsa, membentuk kolase hewan. Diskusikan tentang hewan yang dibuat, habitatnya, dan pentingnya menjaga lingkungan untuk melindungi hewan-hewan tersebut.',
      'Kegiatan 3 : Bermain Jejak Ayam (Penalaran Kritis) . Alat dan bahan: Tanah basah atau pasir, gambar jejak ayam . Cara bermain: Siapkan area dengan tanah basah atau pasir. Tunjukkan gambar jejak ayam kepada anak-anak. Minta mereka membuat jejak hewan tersebut di tanah atau pasir menggunakan tangan atau alat sederhana. Diskusikan tentang hewan yang meninggalkan jejak tersebut dan makanannya .',
      'Kegiatan 1 : STEM Membuat Kandang Binatang (Kreativitas) . Alat dan bahan: Piring kertas, Benang, Krayon atau cat warna, Pelubang buku, Gunting, Lem, Gambar atau mainan binatang kecil,',
      'Kegiatan 2 : Bermain Tebak Suara Hewan (Komunikasi) . Alat dan bahan: Rekaman suara hewan atau kemampuan menirukan suara hewan. Cara bermain: Di alam terbuka, mainkan atau tirukan suara hewan. Minta anak-anak menebak hewan apa yang bersuara tersebut. Diskusikan tentang hewan-hewan tersebut, habitatnya, dan pentingnya tidak mengganggu atau membuat hewan-hewan liar ketakutan.',
      'Kegiatan 3 : Membuat Boneka Jari Hewan dari Bahan Alam (Kolaborasi) . Alat dan bahan: Sarung tangan kain, biji-bijian, daun kering, lem. Cara bermain: Bantu anak-anak menempelkan biji-bijian dan daun kering pada sarung tangan untuk membuat boneka jari hewan. Gunakan boneka ini untuk bercerita tentang kehidupan hewan dan mengapa kita harus memperlakukan mereka dengan baik.',
      '3885648 102318 0 0 Kegiatan 1 : Bekerjasama Menuang Air Dari Panci Ke Dalam Gelas (Kolaborasi) . Alat dan bahan: Gelas plastik, Panci, Tambang, Air,',
      'Kegiatan 2 : Bermain "Tebak Binatang" dengan Bayangan (Kemandirian) . Alat dan bahan: Senter, kertas putih besar, dan loose parts untuk membuat bentuk binatang. Cara bermain: Dalam ruangan gelap, pasang kertas putih di dinding. Gunakan senter untuk menciptakan bayangan dari bentuk binatang yang dibuat dengan loose parts. Anak-anak lain harus menebak binatang apa yang dibentuk. Diskusikan tentang ciri-ciri khas setiap binatang yang membantu dalam identifikasi.',
      'Kegiatan 3 : Kandang Sapi Mini (Kesehatan) . Alat dan bahan: Balok kayu berbagai ukuran, figur sapi mainan, kertas hijau sebagai rumput. Cara bermain: Ajak anak-anak untuk membangun kandang sapi mini menggunakan balok kayu. Mereka dapat membuat pagar, tempat makan, dan area tidur untuk sapi. Letakkan figur sapi di dalam kandang dan beri alas kertas hijau sebagai rumput. Diskusikan tentang kebutuhan sapi dan cara merawatnya.',
      'Kegiatan 1 : Membalikan Posisi Yang Tepat Sesuai Angka (Penalaran Kritis) . Alat dan Bahan, Hula hop, Kartu angka, Bentuk geometri lingkaran atau yang lainnya, Cara Membuat dan Memainkannya :',
      'Kegiatan ini dapat membantu anak mengenal konsep dasar matematika, melatih koordinasi antara mata dan tangan, melatih konsentrasi, melatih percaya diri dan mandiri dalam menyelesaikan masalah.',
      'Kegiatan 2 : Peternakan Hewan (Kewargaan) . Alat dan bahan: Balok kayu, figur hewan ternak (sapi, ayam, domba dll ), kertas warna-warni. Cara bermain: Buat area peternakan menggunakan balok kayu. Bagi menjadi beberapa bagian untuk kandang hewan yang berbeda. Gunakan kertas warna-warni sebagai area rumput atau lumpur. Ajak anak-anak menempatkan hewan-hewan di kandang yang sesuai dan diskusikan karakteristik masing-masing hewan.',
      'Kegiatan 3 : Labirin Ayam (Kemandirian) . Alat dan bahan: Balok kayu berbagai ukuran, figur ayam mainan, kertas kuning dibentuk bulat kecil sebagai biji jagung. Cara bermain: Bangun labirin menggunakan balok kayu. Letakkan figur ayam di satu ujung dan potongan kertas kuning sebagai "jagung" di ujung lain. Minta anak-anak mengarahkan ayam melalui labirin untuk mencapai makanannya.',
      'Kegiatan 1 : Kerajinan Pop Up Kelinci (Kreativitas) . Alat dan Bahan: Kertas warna biru (dapat di sesuaikan), Spidol, Kertas HVS, Gunting, Lem, Kertas warna bermotif atau kertas origami atau lainnya.,',
      'Kegiatan 2 : Bermain Balap Keong (Kesehatan) . Alat dan bahan: Keong hidup (pastikan untuk mengembalikannya ke habitat asli setelah bermain), kapur untuk menggambar garis start dan finish. Cara bermain: Gambar garis start dan finish, lalu letakkan keong di garis start. Lihat keong mana yang mencapai garis finish lebih dulu. Kegiatan ini mengajarkan kesabaran dan observasi alam.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Parade karya binatang dengan musik ceria berkeliling kelas',
      'Permainan "Siapa Aku?" dengan gerakan dan suara binatang favorit',
      'Lomba menirukan suara binatang paling lucu dan unik',
    ],
  },
  {
    weekNum: 13,
    title: 'KUISI PIRINGKU DENGAN MAKANAN SEHAT',
    topic: 'KEBUTUHANKU',
    subtopic: 'MAKAN DAN MINUM',
    modelPembelajaran: 'PjBL, Kolaboratif',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1: Role Play Memasak Gado-Gado (Kreativitas, Komunikasi) . Alat dan Bahan: Kertas origami, Lem, Gunting, Piring kertas, Cara Membuat:',
      'Kegiatan 2: Membuat Menu Makanan Sehat (Penalaran Kritis, Kemandirian) . Alat dan Bahan: Kertas, pensil warna, majalah bekas, gunting, lem. Cara Bermain: Anak-anak membuat menu makanan sehat untuk satu hari dengan menggambar atau menempel potongan gambar dari majalah.',
      'Kegiatan 3: Membuat Piramida Makanan (Kesehatan, Kolaborasi) . Alat dan bahan: Kertas karton besar, gambar berbagai makanan, lem, gunting. Cara bermain: Anak-anak membuat piramida makanan dengan menempelkan gambar makanan sesuai kelompoknya (karbohidrat, protein, sayur, buah, dll). Manfaat: Mengenalkan kelompok makanan dan porsi yang dianjurkan.',
      'Kegiatan 1: Lompat Melewati Bola (Kesehatan, Kemandirian) . Alat dan Bahan: Bola. Cara Bermain',
      'Kegiatan 2: Bermain Peran "Restoran Sehat" (Komunikasi, Kolaborasi) . Alat dan Bahan: Peralatan makan mainan, bahan makanan mainan, kostum koki dan pelayan. Cara Bermain: Anak-anak bermain peran sebagai koki, pelayan, dan pengunjung restoran, memesan dan menyajikan makanan sehat.',
      'Kegiatan 3: Eksperimen Warna Makanan (Penalaran Kritis, Kreativitas) . Alat dan bahan: Berbagai jenis makanan berwarna alami (bit, kunyit, bayam), air, gelas transparan. Cara bermain: Anak-anak melakukan eksperimen mencampur warna dari bahan makanan alami dan mendiskusikan hasilnya. Manfaat: Mengenalkan sifat alami makanan dan mendorong kreativitas.',
      '3756660 215265 0 0 Kegiatan 1: Memindahkan Bola Dengan Satu Tangan (Kesehatan, Kemandirian) . Alat dan Bahan: Hula hop, 3 Buah piring (warna merah, hijau, biru atau warna dapat di sesuaikan), Bola plastik (warna yang sama dengan piring) . Cara Membuat dan Memainkannya :',
      'Kegiatan 2: Eksperimen Air dan Minyak (Penalaran Kritis, Kreativitas) . Alat dan Bahan: Gelas transparan, air, minyak sayur, pewarna makanan. Cara Bermain: Anak-anak melakukan eksperimen mencampur air dan minyak, mengamati bahwa keduanya tidak bisa bercampur, dan mendiskusikan pentingnya minum air untuk tubuh.',
      'Kegiatan 3: Membuat Menu Seimbang (Kesehatan, Komunikasi) . Alat dan bahan: Kertas, pensil warna, contoh menu seimbang. Cara bermain: Anak-anak diminta membuat menu makanan seimbang untuk satu hari dengan menggambar atau menulis. Manfaat: Mengenalkan konsep gizi seimbang dan melatih kreativitas.',
      'Kegiatan 1: Exercise Games Untuk Anak (Kesehatan, Kemandirian) . Alat dan Bahan : Ba n tal, Bola, Tongkat/bambu,',
      'Kegiatan 2: Ular Tangga Gizi (Kolaborasi, Penalaran Kritis) . Alat dan Bahan: Papan ular tangga besar dengan gambar makanan sehat dan tidak sehat, dadu besar. Cara Bermain: Anak-anak bermain ular tangga, naik jika mendarat di gambar makanan sehat dan turun jika di makanan tidak sehat.',
      'Kegiatan 3: Detektif Gula (Kreativitas, Komunikasi) . Alat dan bahan: Berbagai kemasan minuman, tabel kandungan gula. Cara bermain: Anak-anak menjadi "detektif" yang mencari informasi kandungan gula pada kemasan minuman dan membandingkannya. Manfaat: Meningkatkan kesadaran tentang kandungan gula dalam minuman.',
      'Kegiatan 1: Menggiring dan Lari Membawa Bola Dengan Zig-zag (Kesehatan, Kemandirian) . Alat dan Bahan, Ban roda Dapat ganti dengan hula hop atau meja atau benda lainnya), Bola ,',
      'Kegiatan 2: Membuat Boneka Wortel (Kreativitas, Keimanan dan Ketakwaan) . Alat dan Bahan: Kaus kaki oranye, bahan isian, kancing untuk mata, benang hijau untuk daun. Cara Bermain: Anak-anak membuat boneka wortel dari kaus kaki, sambil berdiskusi tentang manfaat wortel untuk kesehatan.',
      'Kegiatan 3: Membuat Kebun Mini (Kewargaan, Kolaborasi) . Alat dan bahan: Pot kecil, tanah, biji sayuran cepat tumbuh (bayam, kangkung), alat berkebun mini. Cara bermain: Anak-anak menanam sayuran di pot dan merawatnya hingga dapat dipanen dan dikonsumsi. Manfaat: Mengenalkan proses pertumbuhan makanan dan mendorong konsumsi sayuran.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Anak berteriak "HOREE!" sambil mengangkat hasil karya ke atas bersama-sama',
      'Bermain tepuk tangan "Tepuk Makanan Sehat" dengan tempo cepat dan riang',
      'Menari bersama lagu "Aku Anak Sehat" sambil menirukan gerakan makan sayur dan buah',
    ],
  },
  {
    weekNum: 14,
    title: 'AKU BISA BERPAKAIAN DAN BERSEPATU SENDIRI',
    topic: 'KEBUTUHANKU',
    subtopic: 'PAKAIAN',
    modelPembelajaran: 'Kolaboratif, STEAM',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      '4283075 38735 0 0 Kegiatan 1: Sciense, Air Selalu Mendatar (Penalaran Kritis) . Alat dan Bahan, 3 botol ( 2 botol dengan ukuran yang sama, dan 1 tutup botol dengan ukuran yang lebih kecil), Selang, Air, Lem, Gunting,',
      'Kegiatan 2: Fashion Show Budaya (Kewargaan, Komunikasi) . Alat dan Bahan: Pakaian adat dari berbagai daerah (bisa menggunakan replika atau gambar) Cara Bermain: Anak-anak memilih pakaian adat dan melakukan fashion show, sambil menjelaskan asal dan keunikan pakaian tersebut',
      'Kegiatan 3: Permainan Memori Pakaian (Penalaran Kritis) . Alat dan bahan: Kartu bergambar berbagai jenis pakaian (berpasangan). Cara bermain: Letakkan kartu tertutup, anak-anak bergantian membuka dua kartu untuk menemukan pasangannya. Manfaat: Melatih memori dan pengenalan jenis pakaian.',
      'Kegiatan 2: Desainer Cilik (Kreativitas, Komunikasi) . Alat dan Bahan: Kertas gambar, pensil warna, majalah fashion bekas Cara Bermain: Anak-anak mendesain pakaian impian mereka, lalu menjelaskan fungsi dan alasan pemilihan desain tersebut.',
      'Kegiatan 3: Puzzle Pakaian Tradisional (Kewargaan, Penalaran Kritis) . Alat dan bahan: Puzzle bergambar pakaian tradisional dari berbagai daerah. Cara bermain: Anak-anak menyusun puzzle dan berdiskusi tentang pakaian tradisional yang ditampilkan. Manfaat: Mengenalkan keberagaman budaya melalui pakaian tradisional.',
      'Kegiatan 1: Cocokan Dan Tempel (Kreativitas, Kemandirian) . Alat dan Bahan :, Krayon/spidol, Kerta HVS, Kertas Origami, Lem, Gunting,',
      'Kegiatan 2 : Puzzle Pakaian (Penalaran Kritis) . Alat dan Bahan: Puzzle bergambar berbagai jenis pakaian dan fungsinya Cara Bermain: Anak-anak menyusun puzzle dan menjelaskan fungsi pakaian yang tergambar.',
      'Kegiatan 3: Membuat Gantungan Baju Hias (Kreativitas, Kesehatan) . Alat dan bahan: Gantungan baju kayu, cat, kuas, hiasan (pita, kancing). Cara bermain: Anak-anak menghias gantungan baju sesuai kreativitas mereka. Manfaat: Mengembangkan kreativitas dan mengenalkan pentingnya menjaga kerapian pakaian.',
      'Kegiatan 2: Bermain Peran Toko Pakaian (Komunikasi, Kolaborasi) . Alat dan Bahan: Berbagai jenis pakaian, aksesori, uang mainan Cara Bermain: Anak-anak bermain peran sebagai penjual dan pembeli di toko pakaian, memilih pakaian sesuai kebutuhan.',
      'Kegiatan 3: Drama Sehari dalam Pakaianku (Kemandirian, Komunikasi) . A lat dan bahan: Berbagai jenis pakaian untuk situasi berbeda (piyama, seragam sekolah, baju bermain). Cara bermain: Anak-anak memerankan kegiatan sehari-hari, mengganti pakaian sesuai situasi. Manfaat: Melatih pemahaman tentang kesesuaian pakaian dengan aktivitas dan waktu.',
      '4298315 47625 0 0 Kegiatan 1: Pencarian Kata (Penalaran Kritis, Komunikasi) . Alat dan Bahan :, Kertas karton, Spidol, Selotip,',
      'Kegiatan 2: Lipat dan Rapikan (Kemandirian, Kesehatan) . Alat dan Bahan: Berbagai jenis pakaian sederhana Cara Bermain: Anak-anak belajar melipat berbagai jenis pakaian dengan rapi dan menyusunnya dalam lemari mainan.',
      'Kegiatan 3: Menjahit Palsu (Kreativitas, Kemandirian) . Alat dan Bahan: Potongan kain kecil, jarum jahit yang aman untuk anak-anak, dan benang tebal warna-warni. Cara Bermain: Anak-anak mencoba "menjahit" potongan kain sesuai dengan desain sederhana yang telah digambar guru atau orang tua. Manfaat: Melatih koordinasi tangan-mata, keterampilan motorik halus, dan ketelitian.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Anak berbaris melingkar dan bergiliran memperagakan cara memakai topi sambil berteriak "Aku hebat!"',
      'Bermain " Menjadi Patung " - anak bergerak bebas lalu berhenti seperti patung ketika musik berhenti',
      'Setiap anak maju ke depan dan berpose seperti model sambil teman-teman bertepuk tangan',
    ],
  },
  {
    weekNum: 15,
    title: 'AIR UNTUK KEHIDUPAN: MISI KECIL PENYELAMAT BUMI',
    topic: 'MITIGASI BENCANA',
    subtopic: 'AIR',
    modelPembelajaran: 'STEAM , Inkuiri, Kolaboratif',
    dpl: ['✅ DPL1 Keimanan dan Ketakwaan terhadap Tuhan YME'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Menghitung Dengan Manik-Manik (Penalaran Kritis, Kreativitas) . Alat dan Bahan :, Kertas HVS, Kertas origami, Kawat bulu, Manik-manik, Spidol, Lem,',
      'Kegiatan 2 : Penyaringan Air Sederhana (Keimanan dan Ketakwaan, Penalaran Kritis) . Alat dan Bahan: Botol plastik bekas, kerikil, pasir, kapas, air keruh Cara Bermain: Anak membuat alat penyaring air sederhana dengan menyusun kerikil, pasir, dan kapas dalam botol yang dipotong. Mereka menuangkan air keruh dan mengamati hasilnya.',
      'Kegiatan 3 : Mengurutkan Botol Air (Penalaran Kritis, Kemandirian) . Alat dan bahan: Botol plastik bekas berbagai ukuran, air, pewarna makanan. Cara bermain: Isi botol-botol dengan air berwarna dalam jumlah yang berbeda-beda. Minta anak mengurutkan botol dari yang paling sedikit airnya hingga yang paling banyak. Kegiatan ini melatih konsep urutan, perbandingan, dan estimasi volume.',
      'Kegiatan 2 : Eksperimen Densitas Air (Kewargaan, Kesehatan) . Alat dan bahan: Gelas tinggi, air, minyak sayur, sirup, pewarna makanan, berbagai benda kecil (koin, kelereng, potongan styrofoam). Cara bermain: Tuangkan air, minyak, dan sirup ke dalam gelas secara perlahan. Amati bagaimana cairan membentuk lapisan. Masukkan benda-benda kecil dan amati di lapisan mana mereka mengambang. Minta anak menjelaskan pengamatan mereka. Kegiatan ini mengajarkan konsep densitas dan melatih kemampuan observasi serta analisis.',
      'Kegiatan 3 : Eksperimen Pelarutan (Kolaborasi, Komunikasi) . Alat dan bahan: Gelas plastik, air, berbagai bahan (gula, garam, pasir, minyak), sendok. Cara bermain: Isi gelas dengan air. Minta anak memprediksi apakah bahan akan larut atau tidak dalam air. Uji prediksi dengan memasukkan bahan satu per satu ke dalam air dan aduk. Catat hasil pengamatan. Kegiatan ini mengajarkan konsep pelarutan dan melatih kemampuan prediksi serta observasi. Diskusi hasil eksperimen dan kesimpulan (Keimanan dan Ketakwaan, Kemandirian)',
      'Kegiatan 1 : 4152900 63500 0 0 Membuat Mikroskop Air (Kreativitas, Penalaran Kritis) . Alat dan Bahan: Gunting, gelas kertas, Pensil, plastik , Sendok, Air, Benda-benda kecil yang ingin di lihat dari dekat, seperti bagian-bagian bunga, sepotong buah, cangkang, atau daun .',
      'Kegiatan 2 : Eksperimen Tegangan Permukaan (Kesehatan, Kewargaan) . Alat dan bahan: Koin, pipet, air, sabun cair. Cara bermain: Letakkan koin di meja. Minta anak meneteskan air di atas koin menggunakan pipet, hitung berapa tetes yang bisa ditampung sebelum air tumpah. Ulangi eksperimen dengan menambahkan sedikit sabun cair ke air. Bandingkan hasilnya. Kegiatan ini mengajarkan tentang tegangan permukaan dan melatih kemampuan berhitung serta observasi.',
      'Kegiatan 3 : Bermain Huruf Terapung (Komunikasi, Kolaborasi) . Alat dan bahan: Tutup botol plastik, spidol permanen, baskom berisi air. Cara bermain: Tulis huruf-huruf pada tutup botol plastik. Letakkan tutup botol di air dan minta anak menyusun kata-kata dari huruf yang terapung. Tambahkan tantangan dengan membuat kata sesuai tema tertentu. Kegiatan ini melatih pembentukan kata dan pemahaman tema.',
      'Kegiatan 1 : Eksperimen Air Surut dan Masuk Ke Dalam Jar (Penalaran Kritis, Kreativitas) . Alat dan Bahan : M angkuk dangkal, Air, Lilin , Toples bening, playdough ( Opsional ). Cara Melakukan Eksperimen:',
      'Kegiatan 2 : Banjir Mini (Kewargaan, Kesehatan) . Alat dan Bahan: Nampan plastik, tanah, rumah-rumahan kecil, air Cara Bermain: Anak membuat miniatur lingkungan di nampan menggunakan tanah dan rumah-rumahan. Mereka lalu menuangkan air perlahan dan mengamati apa yang terjadi saat air berlebih.',
      'Kegiatan 3 : Bermain Penjumlahan dengan Tetesan Air (Kolaborasi, Komunikasi) . Alat dan bahan: Kertas dengan lingkaran-lingkaran kecil dan soal penjumlahan, pipet plastik, air. Cara bermain: Buat soal penjumlahan sederhana di kertas dengan lingkaran-lingkaran kecil di bawahnya. Minta anak menjawab soal dengan meneteskan air ke dalam lingkaran sesuai jumlah yang benar. Kegiatan ini melatih kemampuan penjumlahan dan kontrol motorik halus.',
      'Kegiatan 1 : Eksperimen Sains Pelangi Naik (Kreativitas, Penalaran Kritis) . Alat dan bahan: Tisu kertas, Spidol yang bisa dicuci, Air, Dua gelas identik, Cara Membuat:',
      'Kegiatan 2 : Membuat Hujan (Kesehatan, Kewargaan) . Alat dan Bahan: Toples kaca, air panas, es batu, piring kecil, shaving foam Cara Bermain: Anak menuangkan air panas ke dalam toples, lalu menambahkan shaving foam di atasnya sebagai "awan". Mereka meneteskan air berwarna di atas foam dan mengamati "hujan" yang terbentuk.',
      'Kegiatan 3 : Mengukur Curah Hujan (Komunikasi, Kolaborasi) . Alat dan Bahan: Botol plastik besar, gunting, penggaris, air Cara Bermain: Anak membuat alat pengukur curah hujan sederhana dari botol plastik. Mereka menempatkannya di luar ruangan dan mengukur jumlah air hujan yang tertampung setelah hujan.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Anak duduk melingkar dan menceritakan satu hal paling menarik dari eksperimen hari ini',
      'Bermain "Tepuk Air": Anak bertepuk sesuai jumlah suku kata nama-nama benda yang menggunakan air',
      'Anak menunjukkan gerakan sederhana seperti ombak, hujan, atau air mengalir',
    ],
  },
  {
    weekNum: 16,
    title: 'MENGAPA API TIDAK BOLEH DISENTUH?',
    topic: 'MITIGASI BENCANA',
    subtopic: 'API',
    modelPembelajaran: 'STEAM, Inkuiri, Kolaboratif',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      'Kegiatan 1 : Menggelindingkan Bola (Kemandirian, Kesehatan) . Alat dan Bahan: Bola. Cara Memainkannya:',
      'Kegiatan 2 : Eksperimen Lilin dan Gelas (Penalaran Kritis, Keimanan dan Ketakwaan) . Alat dan bahan: Lilin, gelas, korek api (digunakan oleh orang dewasa), stopwatch. Cara bermain: Nyalakan lilin dan tutup dengan gelas. Anak-anak mengamati dan mencatat berapa lama api bertahan, berdiskusi tentang mengapa api padam (konsep oksigen).',
      'Kegiatan 3 : Kolase Bahan Mudah Terbakar vs Tahan Api (Kreativitas, Kolaborasi) . Alat dan bahan: Berbagai bahan (kertas, aluminium foil, batu), lem, karton. Cara bermain: Anak-anak mengelompokkan dan menempelkan bahan berdasarkan sifat mudah terbakar atau tahan api, berdiskusi tentang alasannya.',
      'Kegiatan 1 : Kegiatan STEAM Membuat APE P encocokkan Huruf Awal Sesuai Gambar (Komunikasi, Kreativitas) . Alat dan Bahan : Kardus bekas, Kertas karton, Print table gambar Binatang, kendaraan, profesi, buah, atau lainnya, Tutup botol, Gelas atau benda yang berbentuk lingkaran, Gunting, Pensil, Lem . Cara Membuat dan Memainkannya:',
      'Kegiatan 2 : Eksperimen Warna Api (Penalaran Kritis, Keimanan dan Ketakwaan) . Alat dan bahan: Gambar api, garam dengan berbagai mineral (dilakukan oleh orang dewasa), air, pipet. Cara bermain: Demonstrasikan bagaimana mineral berbeda menghasilkan warna api berbeda. Anak-anak menggambar dan mewarnai api sesuai pengamatan.',
      'Kegiatan 3 : Melukis dengan Lilin dan Cat Air (Kreativitas, Kemandirian) . Alat dan bahan: Kertas, lilin putih, cat air, kuas. Cara bermain: Anak-anak menggambar dengan lilin (tidak terlihat), lalu mewarnai dengan cat air. Gambar lilin akan "muncul", mendemonstrasikan sifat air dan minyak.',
      'Kegiatan 1 : Belajar Mengan a l Jam (Penalaran Kritis, Kemandirian) . Alat dan Bahan: Hula hop, balok Kayu, kardus bekas, penggaris, lem, gunting. Cara Membuat dan Memainkannya:',
      'Kegiatan 2 : Eksperimen Pembakaran Kertas" (Penalaran Kritis, Kesehatan) . Alat dan bahan: Berbagai jenis kertas, pinset, wadah logam, air (dilakukan oleh orang dewasa dengan pengawasan ketat). Cara bermain: Demonstrasikan bagaimana kertas berbeda terbakar dengan kecepatan berbeda. Anak-anak mencatat observasi dan berhipotesis mengapa.',
      'Kegiatan 3 : Eksperimen Suhu dan Warna (Kreativitas, Komunikasi) . Alat dan bahan: Kertas thermochromic (berubah warna dengan suhu), es, air hangat. Cara bermain: Anak-anak mengamati perubahan warna kertas saat terkena suhu berbeda, membuat hubungan antara panas dan perubahan.',
      'Kegiatan 1 : Daur ulang Kerajinan Jamur 3D Menggunakan Kertas Dan Botol Plastik (Kewargaan, Kreativitas) . Alat dan Bahan: Kertas kerajinan (warna merah, hitam dan putih), Jangka (benda berbentuk lingkaran), Pensil , Penggaris, Lem, Botol plastik (ukuran sedang), Gunting, Kawat bulu (opsional dapat di ganti dengan benang) . Cara Membuat :',
      'Kegiatan 2 : Poster Infografis: Apa yang Terbakar?" (Komunikasi, Kolaborasi) . Alat dan bahan: Kertas poster, gambar berbagai benda, spidol. Cara bermain: Anak-anak membuat infografis sederhana mengelompokkan benda berdasarkan kemampuan terbakar, menambahkan keterangan singkat.',
      'Kegiatan 3 : Pengelompokan Sumber Api (Penalaran Kritis, Kemandirian) . Alat dan bahan: Kartu bergambar berbagai sumber api (korek api, kompor, lilin, api unggun). Cara bermain: Anak-anak mengelompokkan kartu berdasarkan ukuran api, menghitung jumlah dalam setiap kelompok.',
      'Kegiatan 1 : Senter Karakter (Kreativitas, Komunikasi) . Alat dan Bahan , Gelas kertas, Selotip, Spidol, Senter, Gunting/cutter,',
      'Kegiatan 2 : Bentuk Geometris Api (Penalaran Kritis, Kreativitas) . Alat dan bahan: Kertas berwarna (merah, oranye, kuning), gunting, lem. Cara bermain: Anak-anak memotong bentuk geometris (segitiga, lingkaran) untuk membuat kolase api, menghitung jumlah setiap bentuk yang digunakan.',
      'Kegiatan 3 : Berat Bahan Bakar (Penalaran Kritis, Kolaborasi) . Alat dan bahan: Timbangan mainan, berbagai benda yang mewakili bahan bakar (batu untuk batu bara, stik untuk kayu). Cara bermain: Anak-anak menimbang dan membandingkan berat berbagai "bahan bakar", mengurutkan dari yang teringan hingga terberat.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Recalling kegiatan hari ini dengan menanyakan perasaan anak',
      'Berdiskusi kegiatan yang dilakukan dan anak bangga menunjukkan hasil karya',
      'Penyimpulan bersama dan penguatan sikap-sikap yang dipelajari',
    ],
  },
  {
    weekNum: 17,
    title: 'MANUSIA MENGHIRUP UDARA',
    topic: 'MITIGASI BENCANA',
    subtopic: 'UDARA',
    modelPembelajaran: 'STEAM',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
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
          'Anak dapat memprediksi hasil eksperimen sebelum melakukan ("Menurut kamu apa yang akan terjadi?")',
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [
      '3797300 43180 0 0 Kegiatan 1 : Membuat Telepon dari Bahan Daur Ulang (Kreativitas, Komunikasi) . Alat dan bahan: gelas plastic , senar, lidi. Cara Membuat:',
      'Kegiatan 2 : Lomba Tiup Bulu (Kesehatan, Kemandirian) . Alat dan bahan: Bulu-bulu ringan atau kapas, meja panjang. Cara bermain: Letakkan bulu atau kapas di salah satu ujung meja. Minta anak-anak untuk meniup bulu atau kapas agar bergerak ke ujung meja lainnya. Buat garis finish dan adakan perlombaan siapa yang bisa membuat bulu atau kapas mencapai finish terlebih dahulu hanya dengan meniup. Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulut.',
      'Kegiatan 3 : Membuat dan Menerbangkan Pesawat Kertas (Penalaran Kritis, Kreativitas) . Alat dan bahan: Kertas bekas, spidol, area terbuka. Cara bermain: Ajarkan anak-anak cara melipat berbagai jenis pesawat kertas. Biarkan mereka menghias pesawat mereka. Buat kompetisi dengan berbagai kategori, seperti pesawat yang terbang paling jauh, pesawat yang bisa mendarat di target tertentu, atau pesawat dengan desain paling kreatif. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang aerodinamika sederhana.',
      'Kegiatan 1 : Memasukkan Bola Ke Dalam Gelas (Penalaran Kritis, Kemandirian) . Alat dan bahan: Baki atau nampan, gelas kertas, bola plastik, double tape. Cara Bermain:',
      'Kegiatan 2 : Gelembung Sabun Raksasa (Kolaborasi, Kreativitas) . Alat dan bahan: Campuran air sabun, kawat pembentuk gelembung besar (bisa dibuat dari gantungan baju), wadah lebar. Cara bermain: Buat campuran air sabun dalam wadah lebar. Bentuk kawat menjadi lingkaran besar. Ajak anak-anak mencelupkan kawat ke dalam campuran sabun dan mengangkatnya perlahan, lalu berlari atau bergerak perlahan untuk membuat gelembung raksasa. Kegiatan ini melatih koordinasi gerakan tubuh dan pemahaman tentang tekanan udara.',
      'Kegiatan 3 : Menerbangkan Parasut Mini (Kesehatan, Penalaran Kritis) . Alat dan bahan: Kain tipis atau plastik ringan berbentuk persegi, tali, batu kecil atau kerikil. Cara bermain: Buat parasut mini dengan mengikatkan tali pada keempat sudut kain atau plastik. Ikatkan batu kecil atau kerikil di ujung tali sebagai pemberat. Ajak anak-anak melemparkan parasut ke udara dan mengamati bagaimana udara menangkapnya. Mereka bisa berlari sambil memegang parasut untuk melihat efek angin. Kegiatan ini melatih koordinasi dan pemahaman tentang resistensi udara.',
      'Kegiatan 1 : Mencocokkan Gambar Yang Sama (Penalaran Kritis, Kemandirian) . Alat dan bahan :Gelas kertas, meja, spidol. Cara Membuat:',
      'Kegiatan 2 : Mobil Balon (Kreativitas, Penalaran Kritis) . Alat dan bahan: Kardus bekas, tutup botol untuk roda, sedotan, balon, lem, gunting. Cara bermain: Bantu anak-anak membuat mobil sederhana dari kardus bekas. Pasang tutup botol sebagai roda dan sedotan sebagai as. Pasang balon di bagian belakang mobil melalui sedotan. Tiup balon dan lepaskan mobil di lantai yang rata. Anak-anak dapat berlomba mobil balon mereka atau mencoba mengarahkan mobil ke target tertentu. Kegiatan ini melatih keterampilan motorik halus dan pemahaman tentang gaya dorong udara',
      'Kegiatan 3 : Lompat Tali Angin (Kesehatan, Kolaborasi) . Alat dan bahan: Tali panjang, pita atau kain ringan yang diikatkan pada tali. Cara bermain: Ikatkan beberapa pita atau potongan kain ringan pada tali panjang. Dua anak atau orang dewasa memegang ujung-ujung tali dan mengayunkannya. Anak-anak lain harus melompati tali sambil menghindari pita yang bergerak tertiup angin. Tingkatkan kesulitan dengan mengayunkan tali lebih cepat atau menambah pita. Kegiatan ini melatih koordinasi, keseimbangan, dan ketangkasan.',
      'Kegiatan 1 : Eksperimen Balon, Garam dan Merica (Penalaran Kritis, Keimanan dan Ketakwaan) . Alat dan Bahan :Balon (balon berwarna terang lebih disukai agar anak-anak dapat mengamati percobaan dengan jelas,), Garam, Lada Sendok Makan,Kain Wol Kering . Cara Membuat atau Memainkannya :',
      'Kegiatan 2 : Estafet Tiup Bola (Kolaborasi, Kesehatan) . Alat dan bahan: Bola pingpong atau bola plastik ringan, sedotan, meja panjang. Cara bermain: Bagi anak-anak menjadi beberapa tim. Setiap tim berbaris di salah satu ujung meja. Letakkan bola di depan anak pertama. Mereka harus meniup bola menggunakan sedotan untuk memindahkannya ke ujung meja lainnya, lalu berlari ke ujung tersebut untuk giliran berikutnya. Tim yang menyelesaikan estafet terlebih dahulu adalah pemenangnya. Kegiatan ini melatih kontrol pernapasan dan koordinasi',
      'Kegiatan 3 : Melukis dengan Tiupan (Kreativitas, Komunikasi) . Alat dan bahan: Kertas, cat air cair, sedotan, celemek. Cara bermain: Teteskan beberapa warna cat air di atas kertas. Minta anak-anak menggunakan sedotan untuk meniup cat, menciptakan pola dan bentuk unik. Mereka bisa mencoba mengarahkan tiupan untuk membuat bentuk tertentu atau hanya bereksperimen dengan warna dan pola. Kegiatan ini melatih kontrol pernapasan dan kreativitas',
      'Kegiatan 1 : STEAM Membuat Anemometer Dari Bahan Sederhana (Penalaran Kritis, Kreativitas) . Alat dan bahan: 4 gelas kertas kecil, Pelubang buku, 2 sedotan kertas, Tusuk sate bambu, Karet gelang, Manik-manik , Playdough , Stopwatch , Kipas (opsional) . Cara Membuat:',
      'Kegiatan 2 : Lomba Kapal Daun (Kolaborasi, Kewargaan) . Alat dan bahan: Daun besar (seperti daun pisang), ranting kecil untuk tiang, daun kecil untuk layar, wadah besar berisi air. Cara bermain: Bantu anak-anak membuat kapal sederhana dari daun besar dengan ranting sebagai tiang dan daun kecil sebagai layar. Isi wadah besar dengan air dan buat garis start dan finish . Anak-anak harus meniup kapal mereka dari start ke finish . Kegiatan ini melatih kontrol pernapasan dan koordinasi mata-mulut',
      'Kegiatan 3 : Tebak Benda dari Tiupan (Komunikasi, Penalaran Kritis) . Alat dan bahan: Berbagai benda ringan (bulu, kapas, kertas, daun kering), kotak atau tas. Cara bermain: Masukkan berbagai benda ringan ke dalam kotak atau tas. Satu anak mengambil benda tanpa melihat dan harus meniupnya di depan teman-temannya. Teman-teman lain harus menebak benda apa yang ditiup berdasarkan cara benda tersebut bergerak di udara. Kegiatan ini melatih observasi dan pemahaman tentang sifat benda.',
    ],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Pesta gelembung sabun bersama sambil berteriak "Hore, aku bisa!"',
      'Lomba cepat meniup balon dan melepaskannya terbang ke udara',
      'Tarian angin dengan gerakan berputar dan melompat riang',
    ],
  },
  {
    weekNum: 18,
    title: 'MERAWAT BUMI TEMPAT KITA TINGGAL',
    topic: 'MITIGASI BENCANA',
    subtopic: 'BUMI',
    modelPembelajaran: 'STEAM , C o ding',
    dpl: ['Keimanan dan Ketakwaan', 'Kewargaan', 'Kreativitas', 'Kolaborasi'],
    kbcValues: ['Cinta Alloh dan RosulNya', 'Cinta Tanah Air', 'Cinta Lingkungan'],
    iktpItems: [
      {
        no: 1,
        indicator:
          'Anak dapat menyebutkan minimal 3 ciptaan Tuhan di lingkungan sekitar saat circle time pembuka',
      },
      {
        no: 2,
        indicator:
          'Anak menunjukkan antusiasme dan partisipasi aktif saat menonton video "Aku Sayang Bumi"',
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
    openingQuestions: [],
    openingActivities: [],
    coreActivitiesText: [],
    closingActivities: [
      'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
      'Yel-yel "Aku Penjaga Bumi" dengan gerakan tangan yang energik',
      'Parade mini mengelilingi kelas sambil membawa hasil karya',
      'Permainan "Tebak Suara Alam" dengan efek suara yang menyenangkan',
    ],
  },
]

export default class RppmKbcSemester1Seeder extends BaseSeeder {
  async run() {
    console.log('Seeding RPPM KBC Semester 1 (18 Weeks)...')

    // 1. Seed CurriculumPresets with rich extracted DOCX data
    for (const item of RPPM_KBC_SEMESTER_1) {
      const code = `TEMA-${String(item.weekNum).padStart(2, '0')}-${item.topic.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`

      await CurriculumPreset.updateOrCreate(
        { weekNumber: item.weekNum, semester: 1, groupContext: 'b' },
        {
          educationLevel: 'tk',
          curriculumVersion: 'KBC RA',
          semester: 1,
          weekNumber: item.weekNum,
          code,
          themeTitle: item.topic,
          subthemeTitle: item.subtopic,
          phase: 'Fondasi',
          groupContext: 'b',
          data: {
            title: item.title,
            topic: item.topic,
            subtopic: item.subtopic,
            modelPembelajaran: item.modelPembelajaran,
            dpl: item.dpl,
            kbcValues: item.kbcValues,
            openingQuestions: item.openingQuestions,
            openingActivities: item.openingActivities,
            coreActivities: item.coreActivitiesText,
            closingActivities: item.closingActivities,
            iktpChecklist: item.iktpItems,
          },
          isActive: true,
          sortOrder: item.weekNum,
        }
      )
    }

    // 2. Seed IKTP Indicators for TK B Learning Objectives
    const objectives = await LearningObjective.query().limit(18)
    for (const [i, weekItem] of RPPM_KBC_SEMESTER_1.entries()) {
      const objective = objectives[i % objectives.length]
      if (objective && weekItem.iktpItems?.length > 0) {
        for (const iktp of weekItem.iktpItems) {
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
              achievementCriteria: `Ketercapaian Minggu ${weekItem.weekNum}: ${weekItem.subtopic}`,
            }
          )
        }
      }
    }

    // 3. Seed WeeklyLessonPlan for Default User & Class
    const user = await User.query().first()
    const schoolClass = await SchoolClass.query().first()

    if (user && schoolClass) {
      for (const item of RPPM_KBC_SEMESTER_1) {
        const weekStartDate = DateTime.fromISO('2025-07-14').plus({ weeks: item.weekNum - 1 })
        await WeeklyLessonPlan.updateOrCreate(
          {
            userId: user.id,
            classId: schoolClass.id,
            theme: `Minggu ${item.weekNum}: ${item.subtopic}`,
          },
          {
            userId: user.id,
            classId: schoolClass.id,
            theme: `Minggu ${item.weekNum}: ${item.subtopic}`,
            weekStartDate,
            status: 'published',
            content: {
              weekNumber: item.weekNum,
              semester: 1,
              title: item.title,
              topic: item.topic,
              subtopic: item.subtopic,
              modelPembelajaran: item.modelPembelajaran,
              dpl: item.dpl,
              kbcValues: item.kbcValues,
              openingQuestions: item.openingQuestions,
              openingActivities: item.openingActivities,
              coreActivities: item.coreActivitiesText,
              closingActivities: item.closingActivities,
              iktpChecklist: item.iktpItems,
            },
          }
        )
      }
    }

    console.log(
      'Successfully seeded 18 PPM KBC Modules into CurriculumPreset, IktpIndicator, and WeeklyLessonPlan!'
    )
  }
}
