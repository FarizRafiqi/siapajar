# PRD — Platform All-in-One Administrasi Guru Kurikulum Merdeka

**Versi:** 1.5  
**Status:** Draft  
**Tanggal:** 11 Juli 2026

---

## DAFTAR ISI

1. Ringkasan Eksekutif
2. Nama & Branding
3. Latar Belakang & Analisis Pasar
4. Visi, Misi, & Value Proposition
5. Target Pengguna & Persona
6. Fitur Detail
7. User Flow & Arsitektur
8. Spesifikasi Teknis
9. Model Harga & Monetisasi
10. Roadmap Pengembangan
11. Metrik Kesuksesan
12. Risiko & Mitigasi

---

## 1. RINGKASAN EKSEKUTIF

### 1.1 Masalah

Guru Indonesia — khususnya jenjang TK dan SD — menghadapi beban administrasi Kurikulum Merdeka yang berat dan berulang setiap semester:

- **Fragmentasi tools**: Modul ajar di platform A, soal di platform B, rapor di aplikasi desktop C, peringkat manual Excel, kirim nilai ke RPT Digital harus input ulang.
- **Waktu habis untuk administrasi**: Guru menghabiskan 40-60% waktu pada dokumen, bukan mengajar.
- **Kurva belajar Kurikulum Merdeka**: Istilah CP, ATP, TP, KKTP, modul ajar, pembelajaran mendalam — banyak guru masih adaptasi.
- **Tidak ada otomatisasi**: Prota, Promes, ATP, silabus disusun manual dari nol setiap tahun.

### 1.2 Solusi

Platform **all-in-one berbasis AI** yang mengotomatiskan seluruh siklus administrasi guru:

```
PERENCANAAN → PELAKSANAAN → PENILAIAN → RAPOR → PERINGKAT → INTEGRASI RPT
```

Satu ekosistem, satu data kelas, semua dokumen saling sinkron — dari Prota hingga rapor narasi.

### 1.3 Keunikan

| Platform | Modul Ajar | Soal | Rapor Narasi | Peringkat | RPT Integration | All-in-One |
|---|---|---|---|---|---|---|
| Modulajar.app | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| APMA | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| BahanAjar.com | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edikasi | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| e-Rapor.id | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Platform Ini** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 2. NAMA & BRANDING

### 2.1 Rekomendasi Nama

#### 🥇 **SiapAjar** — *Siap Ajar*

| Aspek | Nilai |
|---|---|
| **Makna langsung** | "Siap Ajar" — guru *siap* mengajar, platform *siap* membantu |
| **Makna kedua** | Kompositen modern: "Siap" (prepared) + "Ajar" (teach) — teknologi mempersiapkan guru |
| **Domain** | `siapajar.id` / `siapajar.app` — deskriptif, mudah diingat |
| **Brandability** | Unik, belum ada kompetitor dengan nama ini |
| **Logo potensial** | Buku terbuka + centang/cek (siap) |
| **Tagline** | "Siap Mengajar, Siap Administrasi" |

#### 🥈 **PENA** — *Perangkat Pembelajaran Nasional*

| Aspek | Nilai |
|---|---|
| **Makna langsung** | "Perangkat Pembelajaran Nasional" — terdengar resmi, credible |
| **Makna kedua** | "Pena" = alat tulis — esensial bagi guru |
| **Domain** | `pena.id` / `pena.app` — kemungkinan besar `pena.id` tersedia |
| **Brandability** | Universal, semua orang kenal pena |
| **Tagline** | "Tulis Masa Depan Pendidikan" |

#### 🥉 **AJARI**

| Aspek | Nilai |
|---|---|
| **Makna** | "Ajar" (teach) + akhiran "-i" = "teach me" — aksi, personal |
| **Domain** | `ajari.id` / `ajari.app` — modern, app-like |
| **Brandability** | Kata kerja → pengguna merasa diajak bertindak |
| **Tagline** | "Mengajar Lebih Mudah" |

### 2.2 Nama Alternatif

- **GURUKU** — Personal, hangat ("my teacher"), domain `guruku.id` mungkin tersedia
- **NGAJAR** — Casual, gaul, mudah diingat, domain `ngajar.id`
- **KELASKU** — "My classroom", fokus ruang kelas digital
- **CERDASIN** — "Make it smart" — kekinian, tech-vibe

### 2.3 Rekomendasi Final

> **SiapAjar** dipilih karena deskriptif langsung: guru *siap* mengajar, platform *siap* membantu. Kompositen modern, mudah diingat, domain available, dan terdengar profesional.

---

## 3. LATAR BELAKANG & ANALISIS PASAR

### 3.1 Data Pasar

| Parameter | Data |
|---|---|
| **Jumlah guru di Indonesia** | ~3,3 juta (TK-SMA/SMK) |
| **Guru TK/SD** | ~2 juta (60% dari total) |
| **Adopsi Kurikulum Merdeka** | >90% sekolah sudah implementasi per 2026 |
| **Guru melek teknologi** | >70% punya smartphone, >50% punya laptop |
| **Masalah utama** | Administrasi, kurang waktu, adaptasi kurikulum baru |

### 3.2 Analisis Pesaing

| Platform | Kekuatan | Kelemahan |
|---|---|---|
| **Modulajar.app** | UI bersih, AI modul ajar cepat | Hanya modul ajar; Rp99k/bulan tergolong mahal |
| **APMA** | Modul ajar + soal, PWA | Tidak ada rapor/perangkat tahunan |
| **Edikasi** | Koin system (bayar per dokumen) | Tidak ada langganan, mahal jika banyak dokumen |
| **Genspark** | AI kuat, multi kurikulum | Platform umum (bukan spesifik guru Indonesia) |
| **e-Rapor.id** | Rapor digital matang, 5000+ sekolah | Tidak ada perangkat ajar; WA-based sales |

### 3.3 Celah Pasar (Gap Analysis)

1. **Tidak ada platform all-in-one** — semua pesaing hanya cover 1-2 aspek.
2. **Rapor narasi TK/SD masih manual** — guru menulis 1-2 paragraf per siswa secara manual.
3. **Integrasi RPT Digital belum ada** — sekolah harus input data dua kali.
4. **Harga kompetitor Rp50-100k/fitur** — dengan Rp45k (Pro) bisa dapet semua.
5. **Peringkat + penghargaan otomatis** — semua sekolah butuh tapi belum ada yang bikin digital.

### 3.4 TAM, SAM, SOM

- **TAM** (Total Addressable Market): 3,3 juta guru × Rp45k/bulan × 12 = Rp1,78 triliun/tahun
- **SAM** (Serviceable Addressable Market): Guru TK/SD aktif internet = ~1,5 juta × Rp45k × 12 = Rp810 miliar/tahun
- **SOM** (Serviceable Obtainable Market): 50.000 guru di tahun 1 (0,1% dari SAM) = Rp27 miliar/tahun

---

## 4. VISI, MISI, & VALUE PROPOSITION

### 4.1 Visi

> Menjadi **satu platform administrasi** untuk setiap guru Indonesia — dari TK hingga SMA/SMK.

### 4.2 Misi

1. Mengotomatiskan seluruh dokumen administrasi Kurikulum Merdeka dengan AI.
2. Mengurangi beban administrasi guru hingga 80%.
3. Menyediakan data real-time perkembangan siswa untuk guru, kepala sekolah, dan orang tua.
4. Menjadi jembatan integrasi antara sekolah dengan platform pemerintah (RPT Digital, Dapodik).

### 4.3 Value Proposition

**Untuk Guru:**
- "Buat Prota, Promes, ATP, RPP, Soal, Rapor, & Peringkat — semua otomatis dari satu tempat"
- "Tinggal input kelas & mapel, dokumen jadi dalam 2 menit"
- "Kirim rapor ke WA orang tua langsung dari platform"

**Untuk Kepala Sekolah:**
- "Pantau kelengkapan administrasi semua guru di dashboard"
- "Integrasi RPT Digital tanpa input ulang"

**Untuk Orang Tua:**
- "Terima rapor PDF via WhatsApp"
- "Lihat narasi perkembangan anak"

---

## 5. TARGET PENGGUNA & PERSONA

### 5.1 Segmen Utama (MVP)

| Segmen | Prioritas | Jumlah Potensial | Kebutuhan Utama |
|---|---|---|---|
| Guru TK | **#1** | ~500.000 | Rapor narasi, aspek perkembangan PAUD |
| Guru SD kelas 1-6 | **#2** | ~1.500.000 | Prota, Promes, ATP, Modul Ajar, Soal, Rapor |
| Guru SMP/SMA/SMK | #3 | ~1.300.000 | Sama + penyesuaian mapel |

### 5.2 Persona

**Persona 1 — Bu Rina (Guru TK, 34 tahun)**
- Mengajar TK B, 15 siswa
- Pusing dengan rapor narasi: harus nulis 1 paragraf per anak per aspek
- Punya HP Android dan laptop, tapi ga terlalu teknis
- Butuh: rapor narasi otomatis + kirim WA ke orang tua

**Persona 2 — Pak Budi (Guru SD, 41 tahun)**
- Wali kelas 3 SD, 28 siswa
- Setiap semester harus bikin Prota, Promes, ATP, RPP, SOAL PTS/PAS, rapor, peringkat
- Pakai Excel untuk nilai, repot kalau ada perubahan
- Butuh: satu tempat untuk semua dokumen, export DOCX untuk diserahkan ke pengawas

**Persona 3 — Pak Hendra (Kepala Sekolah SD, 50 tahun)**
- Memimpin 15 guru
- Harus memeriksa administrasi semua guru setiap bulan
- Sekolah pakai RPT Digital untuk rapor
- Butuh: dashboard supervisi + integrasi RPT Digital

---

## 6. FITUR DETAIL

### 6.0 Arsitektur Fitur (Tree)

```
SiapAjar — All-in-One Guru
├── 📋 PERENCANAAN PEMBELAJARAN
│   ├── Prota (Program Tahunan)
│   ├── Promes (Program Semester)
│   ├── ATP (Alur Tujuan Pembelajaran)
│   ├── CP & TP
│   ├── Analisis CP
│   └── Pemetaan Materi
│
├── 🎯 PELAKSANAAN PEMBELAJARAN
│   ├── Modul Ajar / RPP Deep Learning → export DOCX
│   ├── LKPD (Lembar Kerja Peserta Didik)
│   ├── Media Ajar (deskripsi + PPT outline)
│   └── Jurnal Refleksi Harian
│
├── 📝 PENILAIAN & EVALUASI
│   ├── Soal PTS/PAS/PAT Generator → export DOCX/PDF
│   ├── Rubrik Penilaian
│   ├── KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
│   └── Bank Soal Pribadi (tag, filter, HOTS/LOTS)
│
├── 📊 RAPOR NARASI (TK/SD)
│   ├── Input capaian per aspek
│   ├── Generate narasi AI (1-2 paragraf)
│   ├── Rekomendasi untuk orang tua
│   └── Export PDF rapor
│
├── 🏆 PERINGKAT & PENGHARGAAN
│   ├── Peringkat kelas per semester & tahunan
│   ├── Juara Umum 1-3, Harapan 1-3, Juara per Aspek
│   ├── Predikat TK (BSB, BSH, MB, BB)
│   ├── Custom kategori peringkat
│   └── Export PDF peringkat
│
├── 🔗 INTEGRASI RPT DIGITAL
│   ├── Endpoint API per sekolah (custom)
│   ├── Sinkronisasi data rapor
│   └── Pengaturan di dashboard admin sekolah
│
└── ⚙️ PENGATURAN
    ├── Multi tahun ajaran
    ├── Multi semester (ganjil/genap)
    ├── Data sekolah & kelas
    ├── Mode offline
    └── Export semua dokumen DOCX/PDF
```

### 6.1 Fitur Detail — Perencanaan Pembelajaran

#### F-01: Prota (Program Tahunan)

| Aspek | Detail |
|---|---|
| **Input** | Kelas, mata pelajaran, tahun ajaran |
| **Proses AI** | Generate alokasi waktu per bulan, distribusi materi per semester berdasarkan CP dan kalender akademik |
| **Output** | Tabel Prota: bulan, materi pokok, alokasi JP, keterangan |
| **Export** | DOCX, PDF |
| **TK vs SD** | TK: aspek perkembangan; SD: mapel sesuai struktur Kurikulum Merdeka |
| **Akurasi** | Waktu libur nasional, UTS/PTS, PAS otomatis disesuaikan |

#### F-02: Promes (Program Semester)

| Aspek | Detail |
|---|---|
| **Input** | Prota yang sudah digenerate, pilih semester (ganjil/genap) |
| **Proses AI** | Breakdown Prota ke mingguan per semester |
| **Output** | Tabel Promes: minggu ke-, materi, indikator, JP |
| **Export** | DOCX, PDF |

#### F-03: ATP (Alur Tujuan Pembelajaran)

| Aspek | Detail |
|---|---|
| **Input** | Fase (A/B/C/D/E/F), kelas, mapel |
| **Proses AI** | Generate urutan TP logis dari awal hingga akhir fase berdasarkan CP |
| **Output** | Tabel ATP: elemen, capaian, TP, alokasi waktu |
| **Export** | DOCX, PDF |

#### F-04: CP & TP

| Aspek | Detail |
|---|---|
| **Input** | Jenjang, kelas, mapel |
| **Proses AI** | Generate CP sesuai fase + TP turunan yang terukur |
| **Database CP** | Pre-loaded CP resmi Kemendikdasmen untuk semua jenjang dan mapel |
| **Export** | DOCX, PDF |

#### F-05: Analisis CP

| Aspek | Detail |
|---|---|
| **Input** | CP yang dipilih |
| **Proses AI** | Analisis kompetensi, konten, dan konteks; breakdown ke indikator pencapaian |
| **Output** | Dokumen analisis CP lengkap |

#### F-06: Pemetaan Materi

| Aspek | Detail |
|---|---|
| **Input** | Kelas, semester, mapel |
| **Proses AI** | Distribusi materi per minggu per semester |
| **Output** | Tabel pemetaan: minggu, materi, TP terkait |

### 6.2 Fitur Detail — Pelaksanaan Pembelajaran

#### F-07: Modul Ajar / RPP Deep Learning

| Aspek | Detail |
|---|---|
| **Input** | Mapel, kelas, tema/materi, durasi, model pembelajaran (PBL/PjBL/Discovery/dll) |
| **Proses AI** | Generate modul ajar lengkap sesuai format Kurikulum Merdeka + Pendekatan Deep Learning (Pembelajaran Mendalam) |
| **Output** | Identitas, CP, TP, ATP, pemahaman bermakna, pertanyaan pemantik, kegiatan pendahuluan-inti-penutup, asesmen, remidial/pengayaan, refleksi |
| **Export** | DOCX (format Word siap serah), PDF |
| **Template** | Bisa pilih template: Deep Learning, Kurikulum Merdeka standar, K13 |
| **Catatan** | Untuk TK: format RPPH (Rencana Pelaksanaan Pembelajaran Harian) dengan pendekatan bermain |

#### F-08: LKPD

| Aspek | Detail |
|---|---|
| **Input** | Mapel, kelas, topik, tujuan, jumlah halaman |
| **Proses AI** | Generate lembar aktivitas siswa: instruksi, soal/langkah kerja, kolom jawaban |
| **Output** | LKPD siap cetak 1-4 halaman |
| **Export** | DOCX, PDF |

#### F-09: Media Ajar

| Aspek | Detail |
|---|---|
| **Input** | Mapel, kelas, topik, jenis media (video/gambar/PPT/infografis) |
| **Proses AI** | Generate deskripsi media ajar + outline PPT (slide-by-slide) |
| **Output** | Deskripsi media + outline presentasi |

#### F-10: Jurnal Refleksi Harian

| Aspek | Detail |
|---|---|
| **Input** | Tanggal, kelas, mapel, materi, catatan guru |
| **Proses AI** | Opsional: bantu tulis refleksi berdasarkan kegiatan yang sudah diisi |
| **Output** | Catatan jurnal harian, bisa direkap per bulan |

### 6.3 Fitur Detail — Penilaian & Evaluasi

#### F-11: Soal PTS/PAS/PAT Generator

| Aspek | Detail |
|---|---|
| **Input** | Mapel, kelas, materi, jumlah soal PG, jumlah soal Essay, level kognitif (LOTS/MOTS/HOTS) |
| **Proses AI** | Generate soal + kunci jawaban + kisi-kisi (kartu soal) |
| **Output** | Paket soal lengkap: soal PG, soal essay, kunci jawaban, kisi-kisi |
| **Export** | DOCX, PDF (format rapi siap cetak) |
| **Variasi soal** | Acak pilihan ganda A/B/C/D, variasi redaksi tiap generate |

#### F-12: Rubrik Penilaian

| Aspek | Detail |
|---|---|
| **Input** | Indikator penilaian, rentang nilai (1-4 / 1-100) |
| **Proses AI** | Generate rubrik deskriptif per level pencapaian |
| **Output** | Tabel rubrik penilaian |

#### F-13: KKTP

| Aspek | Detail |
|---|---|
| **Input** | Tujuan Pembelajaran, interval nilai |
| **Proses AI** | Generate kriteria ketercapaian: belum tercapai, cukup, baik, sangat baik |
| **Output** | Dokumen KKTP per TP |

#### F-14: Bank Soal Pribadi

| Aspek | Detail |
|---|---|
| **Input** | Soal (manual atau dari hasil generate), tag: kelas/mapel/topic/level HOTS-LOTS |
| **Proses** | Simpan, tag, filter, cari soal |
| **Fitur kunci** | Filter kombinasi (kelas 3 + Matematika + Pecahan + HOTS) |

### 6.4 Fitur Detail — Rapor Narasi Generator

#### F-15: Rapor Narasi TK/SD

| Aspek | Detail |
|---|---|
| **Input** | Nama siswa, kelas, semester, capaian per aspek: |
| | **TK:** Nilai Agama & Budi Pekerti, Sosial Emosi, Kognitif, Bahasa, Fisik Motorik, Seni |
| | **SD:** Semua mapel + Projek P5 |
| **Proses AI** | Generate narasi personal 1-2 paragraf per siswa, sesuai capaian, natural & manusiawi (bukan template kaku) |
| **Output** | Narasi rapor personal + rekomendasi orang tua |
| **Export** | PDF rapor format Kurikulum Merdeka |
| **Kecepatan** | 30 siswa → generate semua narasi dalam <3 menit |

**Contoh Output Narasi:**

> *"Ananda Rara menunjukkan perkembangan yang menggembirakan di semester ini. Kemampuan kognitifnya terlihat dari ketertarikannya pada kegiatan berhitung dan mengenal pola. Ia aktif bertanya saat kegiatan sains sederhana. Di aspek sosial-emosi, Rara mulai mau berbagi mainan dengan teman dan mampu mengungkapkan perasaannya dengan kata-kata. Saran untuk orang tua: ajak Rara bermain peran di rumah untuk mengembangkan kemampuan sosialnya lebih lanjut."*

### 6.5 Fitur Detail — Peringkat & Penghargaan

#### F-16: Peringkat Kelas

| Aspek | Detail |
|---|---|
| **Input** | Nilai per aspek/mapel per siswa, pilih semester/tahun |
| **Proses** | Hitung otomatis total nilai → ranking |
| **Output Kategori** | Juara Umum 1, 2, 3; Juara Harapan 1, 2, 3; Juara per Aspek |
| **TK** | Predikat (BSB, BSH, MB, BB) — TIDAK ada ranking kompetitif |
| **Kustom** | Sekolah bisa ubah nama kategori, tambah/hapus aspek |
| **Export** | PDF siap bagikan ke orang tua |

#### F-17: Predikat TK (Non-Kompetitif)

| Predikat | Deskripsi |
|---|---|
| **BSB** (Berkembang Sangat Baik) | Anak konsisten mandiri tanpa dibantu |
| **BSH** (Berkembang Sesuai Harapan) | Anak mulai mandiri, masih perlu pengingat |
| **MB** (Mulai Berkembang) | Anak mulai menunjukkan kemampuan dengan bantuan |
| **BB** (Belum Berkembang) | Anak belum menunjukkan kemampuan, perlu bimbingan intensif |

### 6.6 Fitur Detail — Integrasi RPT Digital

#### F-18: API Integration — RPT Digital

| Aspek | Detail |
|---|---|
| **Tujuan** | Sinkronisasi data rapor dari SiapAjar ke RPT Digital sekolah |
| **Arsitektur** | Webhook + API endpoint yang bisa dikustom per sekolah |
| **Data yang dikirim** | Nilai akhir, deskripsi/narasi, kenaikan kelas |
| **Frekuensi** | Manual trigger (sebelum cetak rapor) atau otomatis sesuai jadwal |
| **Endpoint** | Dikonfigurasi di dashboard admin sekolah (URL + API key) |
| **Error handling** | Log gagal kirim, retry otomatis, notifikasi admin |
| **Keamanan** | HTTPS, API key tersimpan encrypted |
| **Catatan** | RPT Digital yang dimaksud adalah **Rapor Digital Madrasah** — platform rapor digital resmi Kemag yang banyak dipakai madrasah/sekolah untuk mengelola, merekap, dan mempublikasikan hasil belajar siswa secara online dan transparan. Perlu mapping field data antara SiapAjar dan format Rapor Digital Madrasah. |

### 6.7 Fitur Lintas (Cross-Cutting)

| Fitur | Detail |
|---|---|
| **Cetak DOCX/PDF** | Semua dokumen bisa export ke DOCX (format Word rapi, font Times New Roman/Arial, margin standar) dan PDF (siap cetak/tanda tangan) |
| **Sinkronasi Data** | Data kelas diisi sekali — semua perangkat ajar otomatis sinkron |
| **Kirim WA** | Rapor PDF langsung ke nomor WA orang tua via API |
| **Mode Offline** | Edit RPP/Soal tanpa internet, sync saat online |
| **Multi Tahun Ajaran** | Pilih tahun ajaran aktif, histori tersimpan |
| **Multi Semester** | Semester 1 (ganjil) dan Semester 2 (genap) |

---

## 7. USER FLOW & ARSITEKTUR

### 7.1 User Flow — Guru (User Journey)

```
ONBOARDING
  ├── Daftar (email/Google)
  ├── Isi data sekolah & kelas
  └── Pilih jenjang (TK/SD/SMP/SMA/SMK)

DASHBOARD GURU
  ├── [Perencanaan]
  │   ├── Klik "Buat Prota" → pilih kelas, mapel → generate → export
  │   ├── Klik "Buat Promes" → pilih semester → generate → export
  │   ├── Klik "ATP" → pilih fase/mapel → generate → export
  │   └── Klik "CP & TP" → pilih jenjang → generate → export
  │
  ├── [Pelaksanaan]
  │   ├── Klik "Modul Ajar" → input mapel/tema/kelas → generate → edit → export DOCX
  │   ├── Klik "LKPD" → input topik → generate → export
  │   └── Klik "Jurnal" → isi harian → simpan
  │
  ├── [Penilaian]
  │   ├── Klik "Buat Soal" → input mapel/materi/jumlah → generate → export
  │   ├── Klik "Bank Soal" → lihat/cari/kelola soal
  │   └── Klik "KKTP" → pilih TP → generate
  │
  ├── [Rapor]
  │   ├── Input nilai per aspek per siswa
  │   ├── Klik "Generate Narasi" → semua narasi terisi
  │   ├── Review & edit narasi per siswa
  │   └── Export PDF + Kirim WA
  │
  └── [Peringkat]
      ├── Pilih semester → otomatis hitung ranking
      ├── Kustom kategori jika perlu
      └── Export PDF
```

### 7.2 Arsitektur Sistem (High-Level)

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose                            │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              AdonisJS 7 (Monolith)                     │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌─────────────────────────────┐    │ │
│  │  │  Vue 3 SPA   │  │     AdonisJS Backend        │    │ │
│  │  │  (InertiaJS) │◄─┤  ├─ Controllers             │    │ │
│  │  │  ├─ Pages    │  │  ├─ Services (Business)      │    │ │
│  │  │  ├─ Comps    │  │  ├─ Auth (Google + Email)    │    │ │
│  │  │  └─ Pinia    │  │  ├─ Validators               │    │ │
│  │  └──────────────┘  │  └─ Queue Workers (BullMQ)   │    │ │
│  │                     └──────────┬──────────────────┘    │ │
│  └────────────────────────────────┼────────────────────────┘ │
│                                   │                          │
│  ┌───────────────┐  ┌─────────────┼──────────┐              │
│  │  PostgreSQL 16 │  │   Redis     │          │              │
│  │  (Database)    │  │  (Queue +   │          │              │
│  └───────────────┘  │   Cache)    │          │              │
│                      └─────────────┘          │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                    ┌──────────────────────────┼──────────────┐
                    │     External Services                     │
                    │  ├─ 9router (AI Model Router)            │
                    │  │   ├─ Combo: siapajar-docgen               │
                    │  │   ├─ Combo: siapajar-soal                 │
                    │  │   ├─ Combo: siapajar-narasi               │
                    │  │   └─ Auto-failover per combo           │
                    │  ├─ Xendit (Payment)                     │
                    │  ├─ Rapor Digital Madrasah (RPT API)     │
                    │  ├─ Baileys (WhatsApp)                   │
                    │  └─ Cloudflare R2 (Storage)              │
                    └─────────────────────────────────────────┘
```

### 7.3 Struktur Database (Core Tables — PostgreSQL 16 via Docker)

```
users (id, name, email, role, school_id, package, created_at)
schools (id, name, address, phone, npsn, rpt_endpoint, rpt_api_key)
classes (id, school_id, name, level, grade, year_id)
subjects (id, name, type) — pre-seeded
teacher_classes (id, user_id, class_id, subject_id, is_homeroom)
year_terms (id, school_id, year, term, is_active)

documents (id, type, class_id, subject_id, content_json, status, created_at)
  — type: prota, promes, atp, cp, modul_ajar, lkpd, soal, rapor, peringkat

questions (id, user_id, subject_id, class_id, type, content, level, tags)
assessments (id, student_name, class_id, aspect, score, semester, year)
narratives (id, student_name, class_id, aspect, content, generated_by_ai, edited)

rankings (id, class_id, semester, year, data_json, config_json)
  — data_json: [{student, total, rank, categories}]
  — config_json: {categories: ["Juara Umum 1", ...], aspects: [...]}

transactions (id, user_id, school_id, amount, package, status, xendit_id)
sync_logs (id, school_id, type, status, payload, response, error)

ai_queue (id, user_id, type, priority, status, payload, result, created_at, started_at, completed_at)
  — type: prota, promes, atp, modul_ajar, soal, rapor_narasi
  — status: pending, processing, done, failed, throttled

rate_limits (id, user_id, ip, action, count, window_start)
  — action: register, ai_generate, wa_send
  — window: rolling 24h

abuse_flags (id, user_id, ip, device_fingerprint, reason, auto_banned, created_at)
```

### 7.4 Landing Page (Public)

**URL:** `siapajar.id` (halaman utama, belum login)

**Struktur Halaman:**

```
LANDING PAGE
├── Hero Section
│   ├── Headline: "Fajar Baru Administrasi Guru"
│   ├── Subheadline: "Buat Prota, Modul Ajar, Soal, Rapor — semua otomatis dari satu tempat"
│   ├── CTA: "Mulai Gratis" → /register
│   └── Mockup screenshot app (3 slide carousel)
│
├── Problem Section
│   ├── "Guru menghabiskan 40-60% waktu untuk administrasi"
│   ├── 3 kartu masalah: Fragmentasi tools | Kurva belajar KM | Tidak ada otomatisasi
│   └── "SiapAjar selesaikan semua dalam satu platform"
│
├── Feature Showcase
│   ├── 6 kartu fitur utama (icon + judul + deskripsi singkat):
│   │   ├── 📋 Perencanaan — Prota, Promes, ATP otomatis
│   │   ├── 🎯 Modul Ajar — Generate RPP/Modul Ajar AI dalam 2 menit
│   │   ├── 📝 Soal — Buat soal PTS/PAS/PAT + kunci jawaban
│   │   ├── 📊 Rapor — Narasi rapor personal per siswa
│   │   ├── 🏆 Peringkat — Ranking otomatis + sertifikat
│   │   └── 🔗 Integrasi — Sinkron RPT Digital & Dapodik
│   └── CTA: "Lihat Semua Fitur" → scroll ke pricing
│
├── How It Works
│   ├── 3 langkah:
│   │   1. Daftar & Isi Data Kelas
│   │   2. Pilih Dokumen → Generate dengan AI
│   │   3. Edit, Export, Kirim — selesai!
│   └── Animasi/icon per langkah
│
├── Testimoni (Placeholder)
│   ├── 3 kartu testimoni guru (isi nanti setelah ada user)
│   └── "Digunakan oleh X guru di Y sekolah"
│
├── Pricing Section
│   ├── 4 kartu pricing (Free / Basic / Pro / Sekolah)
│   ├── Highlight: Pro (Rp45k) sebagai recommended
│   └── FAQ accordion (5-8 pertanyaan umum)
│
├── CTA Final
│   ├── "Mulai Gratis Sekarang — Tidak Perlu Kartu Kredit"
│   └── CTA button → /register
│
└── Footer
    ├── Logo + tagline
    ├── Links: Tentang, Fitur, Harga, Kontak, Kebijakan Privasi
    ├── Social media (WA, IG, TikTok)
    └── © 2026 SiapAjar
```

**Teknis Landing Page:**
- AdonisJS route: `/` → InertiaJS render `pages/landing.tsx`
- SSR (server-side render) untuk SEO
- Tailwind CSS, responsive mobile-first
- Lazy load section di bawah fold
- Meta tags: title, description, OG image untuk social sharing
- Google Analytics / Plausible untuk tracking

---

### 7.5 Halaman App Guru (Setelah Login)

**URL:** `app.siapajar.id` (atau `siapajar.id/app`)

**Layout Utama:**
```
┌─────────────────────────────────────────────────────┐
│  Sidebar (fixed)           │  Main Content          │
│  ┌──────────────────┐      │                        │
│  │ Logo SiapAjar     │      │  ┌──────────────────┐ │
│  │                   │      │  │  Header/Breadcrumb│ │
│  │ 📊 Dashboard      │      │  ├──────────────────┤ │
│  │                   │      │  │                  │ │
│  │ 📋 Perencanaan    │      │  │  Content Area    │ │
│  │  ├─ Prota         │      │  │                  │ │
│  │  ├─ Promes        │      │  │                  │ │
│  │  ├─ ATP           │      │  │                  │ │
│  │  └─ CP & TP       │      │  │                  │ │
│  │                   │      │  │                  │ │
│  │ 🎯 Pelaksanaan    │      │  │                  │ │
│  │  ├─ Modul Ajar    │      │  │                  │ │
│  │  ├─ LKPD          │      │  │                  │ │
│  │  └─ Jurnal        │      │  │                  │ │
│  │                   │      │  └──────────────────┘ │
│  │ 📝 Penilaian      │      │                        │
│  │  ├─ Buat Soal     │      │                        │
│  │  ├─ Bank Soal     │      │                        │
│  │  └─ KKTP          │      │                        │
│  │                   │      │                        │
│  │ 📊 Rapor          │      │                        │
│  │ 🏆 Peringkat      │      │                        │
│  │                   │      │                        │
│  │ ⚙️ Pengaturan     │      │                        │
│  │                   │      │                        │
│  │ ─────────────     │      │                        │
│  │ 👤 Profil | Logout│      │                        │
│  └──────────────────┘      │                        │
└─────────────────────────────────────────────────────┘
```

**Halaman per Menu:**

| Menu | URL | Deskripsi |
|---|---|---|
| **Dashboard** | `/dashboard` | Ringkasan: jumlah dokumen, kelas aktif, quota tersisa, generate terakhir, quick actions (Buat Modul Ajar / Buat Soal / Buat Rapor) |
| **Prota** | `/perencanaan/prota` | List Prota per kelas/mapel. Button "Buat Prota Baru" → form input → generate → preview → edit → export DOCX/PDF |
| **Promes** | `/perencanaan/promes` | List Promes. Ambil data dari Prota. Generate per semester |
| **ATP** | `/perencanaan/atp` | List ATP per fase/mapel. Generate dari CP |
| **CP & TP** | `/perencanaan/cp-tp` | Browse CP database + generate TP turunan |
| **Modul Ajar** | `/pelaksanaan/modul-ajar` | List modul ajar. "Buat Baru" → form (mapel, kelas, tema, model pembelajaran) → generate → rich editor → export DOCX/PDF |
| **LKPD** | `/pelaksanaan/lkpd` | List LKPD. Generate dari topik |
| **Jurnal** | `/pelaksanaan/jurnal` | Kalender harian. Klik tanggal → isi refleksi → simpan |
| **Buat Soal** | `/penilaian/soal` | Form generate: mapel, kelas, materi, jumlah PG/essay, level HOTS/LOTS → generate → preview → export DOCX |
| **Bank Soal** | `/penilaian/bank-soal` | Tabel soal tersimpan. Filter: kelas, mapel, topik, level. CRUD |
| **KKTP** | `/penilaian/kktp` | Generate KKTP per TP |
| **Rapor** | `/rapor` | Step wizard: (1) Pilih kelas/semester (2) Input nilai per siswa per aspek (3) Generate narasi AI semua siswa (4) Review & edit per siswa (5) Export PDF / Kirim WA |
| **Peringkat** | `/peringkat` | Pilih kelas/semester → auto ranking → kustom kategori → export PDF |
| **Pengaturan** | `/pengaturan` | Sub-menu: Profil, Sekolah & Kelas, Tahun Ajaran, Langganan & Pembayaran, Integrasi RPT Digital |

**Halaman Khusus:**

| Halaman | URL | Deskripsi |
|---|---|---|
| **Onboarding** | `/onboarding` | Wizard setelah register pertama: (1) Isi nama sekolah (2) Pilih jenjang (TK/SD/SMP) (3) Tambah kelas (4) Tambah siswa (import Dapodik CSV atau manual) (5) Selesai → redirect dashboard |
| **Profil** | `/pengaturan/profil` | Edit nama, email, foto, password |
| **Langganan** | `/pengaturan/langganan` | Paket aktif, riwayat pembayaran, upgrade/downgrade, invoice |
| **Kelas & Siswa** | `/pengaturan/kelas` | CRUD kelas, tambah siswa per kelas, import CSV Dapodik |
| **Tahun Ajaran** | `/pengaturan/tahun-ajaran` | Switch tahun ajaran & semester aktif |

**Teknis Halaman App:**
- AdonisJS route group: `/app/*` dengan middleware auth
- InertiaJS: setiap halaman = Vue 3 component di `pages/`
- Sidebar: shared layout component, responsive (collapse di mobile)
- Data fetching: AdonisJS controller → InertiaJS `render()` dengan props
- Form: AdonisJS validator + InertiaJS form helper
- AI generate: async request → loading state → result render
- Export: server-side (AdonisJS controller → file → download)

---

## 8. SPESIFIKASI TEKNIS

### 8.1 Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| **Backend** | AdonisJS 7 (Node.js) | Full-stack framework, TypeScript native, batteries-included (auth, ORM, validation, queue, mail) — cocok untuk monolith yang rapi |
| **Frontend** | InertiaJS + Vue 3 | SPA feel tanpa complexity API terpisah; SSR-ready; seamless integration dengan AdonisJS |
| **UI Framework** | Tailwind CSS + shadcn-vue (atau PrimeVue) | Komponen siap pakai, mobile-first, customizable |
| **State Management** | Vue 3 Composition API + Pinia | Ringan, cocok untuk fetching-heavy app |
| **Database** | PostgreSQL 16 (self-hosted Docker) | Relational, performa tinggi, full control tanpa vendor lock-in |
| **ORM** | Lucid (built-in AdonisJS) | Type-safe, migration, seeder, factory — sudah terintegrasi |
| **Auth** | AdonisJS Auth (built-in) | Google OAuth + email/password; session & JWT support |
| **AI Router** | 9router (9router.com) | Unified AI model router; pakai **combo** (kumpulan model jadi satu nama); fallback otomatis antar model dalam combo |
| | Combo: `siapajar-docgen` | Generate dokumen (modul ajar, prota, promes, ATP) |
| | Combo: `siapajar-soal` | Generate soal PTS/PAS/PAT |
| | Combo: `siapajar-narasi` | Generate narasi rapor |
| | Combo: `siapajar-rubrik` | Generate rubrik, KKTP |

> **Catatan 9router Combo:** Combo dikonfigurasi manual di dashboard 9router sebelum development. Setiap combo berisi kumpulan model (termasuk free model dari OpenCode/Mimo Code) dengan prioritas & fallback. Nama combo di PRD bersifat sementara — sesuaikan dengan naming di 9router.
| **Export DOCX** | `docx` (npm) + `html-to-docx` | Generate DOCX format rapi, tabel, font |
| **Export PDF** | Puppeteer (headless Chrome) | PDF rapor dengan layout kompleks, support CSS penuh |
| **Payment** | Xendit API | QRIS, transfer bank, kartu — otomatis tanpa admin |
| **Hosting** | Docker (Coolify self-hosted) | Full control, biaya rendah, deploy via git push |
| **Storage** | Cloudflare R2 | Dokumen export, user uploads; S3-compatible, murah |
| **WhatsApp** | Baileys (open-source WA library) | Kirim PDF rapor ke nomor orang tua; self-hosted, perlu reconnect & anti-ban (delay acak, rate limit per nomor) |
| **PWA** | AdonisJS + Service Worker | Mode offline (custom implementation) |
| **Queue** | BullMQ + Redis (Docker) | AI job queue, rate limiting, priority |
| **CI/CD** | GitHub Actions | Deploy otomatis ke Coolify via Docker build |

### 8.2 Estimasi Biaya Operasional

| Komponen | Estimasi per Bulan (1000 user aktif) |
|---|---|
| **9router (AI API)** | ~$30-80 (routing ke model termurah; 10k generate/bulan; fallback otomatis) |
| **PostgreSQL** | $0 (self-hosted Docker di VPS yang sama) |
| **Redis** | $0 (self-hosted Docker di VPS yang sama) |
| **Storage (Cloudflare R2)** | ~$5 (10GB dokumen; free tier 10GB) |
| **Hosting (Coolify VPS)** | ~$15-25 (1 VPS 4-8GB RAM; cukup untuk DB + app + Redis) |
| **Xendit Fee** | ~3-4% per transaksi |
| **Total** | **~$50-110/bulan** |

**Penghematan vs stack sebelumnya:**
- Supabase $25/bulan → self-hosted $0 (PostgreSQL + Redis di Docker)
- Gemini langsung $50-100 → 9router $30-80 (routing hemat, auto-fallback)
- Total hemat ~$40-55/bulan

### 8.3 Komponen AI yang Digunakan (via 9router Combo)

Semua AI request melewati **9router** (9router.com) — unified AI model router. Sistem menggunakan **combo**: kumpulan model (termasuk free model dari OpenCode/Mimo Code) yang dikelompokkan jadi satu nama combo di dashboard 9router. App cukup panggil nama combo, 9router handle routing & fallback otomatis.

**Proses Setup Combo (di dashboard 9router sebelum development):**
1. Buat combo per task type (docgen, soal, narasi, rubrik)
2. Tambah model ke combo: primary (bayar) + fallback (free dari OpenCode/Mimo Code)
3. Set prioritas & failover rules di 9router
4. App panggil combo name, bukan model name langsung

| Fitur | 9router Combo | Prompt Strategy | Max Tokens | Contoh Model dalam Combo |
|---|---|---|---|---|
| Generate Prota | `siapajar-docgen` | Structured output → JSON | ~2000 | Primary: gemini-2.5-flash; Free fallback: model OpenCode/Mimo |
| Generate Promes | `siapajar-docgen` | Context: Prota JSON | ~2000 | Sama |
| Generate ATP | `siapajar-docgen` | Context: CP database | ~3000 | Sama |
| Generate Modul Ajar | `siapajar-docgen` | Full context (mapel, kelas, tema) | ~4000 | Sama |
| Generate Soal | `siapajar-soal` | JSON: soal PG + essay + kunci | ~3000 | Primary + free fallback |
| Generate Narasi Rapor | `siapajar-narasi` | Per-student: nilai per aspek | ~500/siswa | Primary + free fallback |
| Rubrik & KKTP | `siapajar-rubrik` | Template-based + AI refinement | ~1000 | Primary + free fallback |

**Setup 9router API:**
```
Endpoint: https://9router.com/v1/chat/completions
Header: Authorization: Bearer <9router-api-key>

// Contoh request — panggil combo name, bukan model name
{
  "model": "siapajar-docgen",  // ← combo name, bukan model langsung
  "messages": [...],
  "max_tokens": 4000,
  "temperature": 0.3
}

// 9router otomatis:
// 1. Coba model primary dalam combo
// 2. Jika gagal/rate-limited → fallback ke model berikutnya
// 3. Jika semua gagal → return error
```

> **Penting:** Nama combo (`siapajar-docgen`, `siapajar-soal`, dll) bersifat sementara. Sesuaikan dengan nama combo yang dikonfigurasi di dashboard 9router. Combo berisi model-model yang dipilih developer — termasuk free model dari OpenCode dan Mimo Code.

**Optimasi Biaya AI (via 9router):**
- 9router otomatis routing ke model termurah yang tersedia
- Cache template prompt untuk setiap jenis dokumen (kurangi token重复)
- Batch processing untuk narasi rapor (30 siswa dalam 1 call)
- Tingkatkan suhu (temperature) hanya untuk variasi soal, rendah untuk dokumen formal
- Config 9router: set budget cap per hari, alert jika anomali

**Mekanisme AI Rate Limiting & Backpressure (Anti-Spike):**

Masalah: Akhir semester semua guru generate rapor sekaligus → spike request ke Gemini API → rate limit terkena + biaya meledak.

| Mekanisme | Detail |
|---|---|
| **Queue System** | Semua AI request masuk ke queue (BullMQ / Redis-backed). Tidak ada request langsung ke Gemini API. |
| **Concurrency Limiter** | Max 10 concurrent Gemini request per instance. Sisanya antri otomatis. |
| **Priority Queue** | User Pro/Sekolah > Basic > Free saat spike. Paid user lebih cepat dapat hasil. |
| **Budget Guard** | Monitor harian: jika cost > 80% budget harian, throttle Free tier (delay 60s per request), Basic (delay 15s). Pro/Sekolah tetap lancar. |
| **Daily/Monthly Cap** | Free: max 10 AI generate/hari. Basic: max 100/bulan. Pro: max 500/bulan (soft limit, bisa override). Sekolah: unlimited (tapi queue delay saat spike). |
| **Exponential Backoff** | Jika Gemini API return 429 (rate limit), backoff exponential: 2s → 4s → 8s → 16s. Auto-retry max 3x. |
| **Fallback Model** | 9router handle otomatis via combo: jika model primary gagal, fallback ke model berikutnya dalam combo (termasuk free model). Config di dashboard 9router. |
| **Batch Rapor** | Narasi rapor: generate per batch 5 siswa (bukan 1 per 1). Kurangi total API call 6x. |
| **Real-time Dashboard** | Admin panel: monitor queue depth, avg wait time, error rate, cost/day. Alert jika anomali. |

```
User Request → Queue (Redis) → Priority Sort → Concurrency Limiter → Gemini API
                                    ↓ (if 429)
                              Exponential Backoff → Retry / Fallback to Groq
                                    ↓ (if budget > 80%)
                              Throttle Free/Basic users
```

### 8.4 Free Tier Abuse Protection

| Mekanisme | Detail |
|---|---|
| **reCAPTCHA v3** | Invisible CAPTCHA saat register & saat generate dokumen pertama. Score threshold < 0.5 = block. |
| **Rate Limit per IP** | Max 3 register/hari per IP. Max 20 AI generate/hari per IP (meski beda akun). |
| **Device Fingerprinting** | Fingerprint browser + device saat register. Jika > 3 akun dari device sama = flag manual review. |
| **Email Domain Filter** | Block disposable email (tempmail, guerrillamail, dll). Whitelist: gmail, yahoo, outlook, domain sekolah. |
| **Phone Verification** | Untuk upgrade ke paid: WA verification (kirim OTP via Baileys). Opsional untuk free tier. |
| **Usage Pattern Detection** | Flag akun yang: generate max free quota lalu hapus akun, bikin baru. Auto-ban jika pattern terulang 3x. |
| **Cooldown Period** | Free tier: setelah habiskan quota, cooldown 24 jam sebelum generate lagi. Tidak reset per akun baru (berdasarkan device + IP). |

---

## 9. MODEL HARGA & MONETISASI

### 9.1 Tier Pricing

| Fitur | 🆓 Free | ⭐ Basic | 💎 Pro | 🏫 Sekolah |
|---|---|---|---|---|
| **Harga** | Gratis | Rp25.000/bulan | Rp45.000/bulan | Rp300.000/bulan |
| **Target** | Coba-coba | Guru individu | Guru power | Sekolah (10-20 guru) |
| | | | | |
| **Generate Prota** | 1× gratis | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| **Generate Promes** | 1× gratis | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| **Generate Modul Ajar** | 3× gratis | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| **Generate Soal** | 2× gratis | 20×/bulan | ✅ Unlimited | ✅ Unlimited |
| **Bank Soal** | ❌ | ✅ 100 soal | ✅ Unlimited | ✅ Unlimited |
| **Export DOCX/PDF** | ✅ (watermark) | ✅ (no watermark) | ✅ (no watermark) | ✅ (no watermark) |
| **Rapor Narasi AI** | ❌ | ❌ | ✅ Unlimited | ✅ Unlimited |
| **Peringkat Otomatis** | ❌ | ❌ | ✅ Unlimited | ✅ Unlimited |
| **Kirim WA Rapor** | ❌ | ❌ | ✅ 50×/bulan | ✅ Unlimited |
| **Dashboard Kepsek** | ❌ | ❌ | ❌ | ✅ |
| **Integrasi RPT Digital** | ❌ | ❌ | ❌ | ✅ |
| **Jumlah Guru** | 1 | 1 | 1 | 10-20 |
| **Support** | Email | Email + WA | Prioritas | Dedikasi |

### 9.2 Metode Pembayaran

| Metode | Via Xendit | Otomatis? |
|---|---|---|
| **QRIS** | ✅ | ✅ — Instant activation |
| **Transfer Bank** (BCA, Mandiri, BRI, BNI) | ✅ Virtual Account | ✅ — Otomatis detected |
| **Kartu Kredit/Debit** | ✅ | ✅ |
| **Invoice BOS** | Manual untuk paket Sekolah | Perlu konfirmasi |

**Catatan Penting:**
- Tidak perlu admin untuk verifikasi pembayaran — Xendit handle semuanya
- Aktivasi akun otomatis setelah pembayaran terverifikasi
- Reminder tagihan: H-3, H-1, H+1 via email

### 9.3 Revenue Projection

| Month | Free | Basic (Rp25k) | Pro (Rp45k) | School (Rp300k) | Revenue |
|---|---|---|---|---|---|
| M1 | 500 | 20 | 10 | 2 | Rp1.550.000 |
| M3 | 2000 | 100 | 50 | 10 | Rp8.500.000 |
| M6 | 5000 | 400 | 200 | 30 | Rp29.000.000 |
| M12 | 15000 | 1500 | 750 | 100 | Rp98.250.000 |

*Asumsi konversi: Free → Paid ~5-8% per bulan*

### 9.4 Break-Even Analysis

**Asumsi Biaya Operasional per Bulan:**

| Komponen | M1-M3 | M4-M6 | M7-M12 |
|---|---|---|---|
| 9router (AI API) | $30 | $60 | $200 |
| PostgreSQL (Docker) | $0 | $0 | $0 |
| Redis (Docker) | $0 | $0 | $0 |
| Storage (R2) | $0 | $5 | $15 |
| Hosting (Coolify VPS) | $15 | $15 | $30 (scale up) |
| Domain + SSL | $2 | $2 | $2 |
| Xendit fee (3.5%) | ~Rp54k | ~Rp1jt | ~Rp3.4jt |
| **Total (Rp)** | **~Rp1.2jt** | **~Rp2jt** | **~Rp5.5jt** |

**Break-Even Calculation:**

| Metrik | Nilai |
|---|---|
| Rata-rata revenue per paid user | ~Rp38.000/blan (weighted: Basic 60%, Pro 30%, School 10%) |
| Biaya operasional M6 | ~Rp2.000.000/blan |
| **Break-even paid users (M6)** | **~53 paid users** |
| Biaya operasional M12 | ~Rp5.500.000/blan |
| **Break-even paid users (M12)** | **~145 paid users** |

**Projection Path to Profitability:**

```
M1:  32 paid  →  Revenue Rp1.5jt  vs  Cost Rp1.2jt  →  +Rp300k ✅ PROFIT SEJAK AWAL
M3:  160 paid →  Revenue Rp8.5jt  vs  Cost Rp1.2jt  →  +Rp7.3jt ✅
M6:  630 paid →  Revenue Rp29jt   vs  Cost Rp2jt    →  +Rp27jt ✅
M12: 2350 paid → Revenue Rp98jt   vs  Cost Rp5.5jt  →  +Rp92.5jt ✅
```

**Kesimpulan:** Break-even tercapai di **M2-M3** (sekitar 66-100 paid users). Dengan asumsi konservatif 5% conversion rate dari 500 free user di M1, target ini reachable. Bisnis unit economics sehat — LTV/CAC ratio > 10x (LTV Rp360k / CAC Rp15k = 24x).

**Risiko Biaya Terbesar:**
1. **AI API spike** di akhir semester → mitigasi: backpressure + fallback (lihat 8.3)
2. **WhatsApp Baileys** kena ban → mitigasi: multi-number pool, delay acak
3. **Storage bengkak** jika user banyak upload → mitigasi: retention policy, compress PDF

---

## 10. ROADMAP PENGEMBANGAN

### Fase 1 — MVP (2-3 bulan)

**Goal:** Rilis ke 100 guru early adopter, validasi product-market fit

| Prioritas | Fitur | Estimasi |
|---|---|---|
| P0 | Auth (email + Google login) | 1 minggu |
| P0 | Manajemen kelas & tahun ajaran | 1 minggu |
| P0 | **Generate Modul Ajar / RPP** (AI) | 2 minggu |
| P0 | **Generate Soal PTS/PAS** (AI) | 2 minggu |
| P0 | Export DOCX/PDF | 1 minggu |
| P1 | Prota & Promes (AI) | 1 minggu |
| P1 | Bank Soal dasar (simpan & filter) | 1 minggu |
| P1 | Payment integration (Xendit) | 1 minggu |
| P1 | **Import Dapodik (CSV/Excel)** — data siswa, guru, sekolah dari file Dapodik | 1 minggu |
| P2 | UI Dashboard + landing page | 2 minggu |

**Deliverable MVP:**
- Guru bisa: daftar → buat kelas → import data siswa dari Dapodik (CSV/Excel) → generate modul ajar → generate soal → export DOCX
- Monetisasi: Free (3 RPP) + Basic (Rp25k)

### Fase 2 — Core Expansion (2 bulan)

| Prioritas | Fitur | Estimasi |
|---|---|---|
| P0 | ATP + CP & TP Generator | 2 minggu |
| P0 | **Rapor Narasi Generator** (TK/SD) | 3 minggu |
| P0 | KKTP Generator | 1 minggu |
| P1 | Rubrik Penilaian | 1 minggu |
| P1 | Peringkat & Penghargaan | 2 minggu |
| P1 | Kirim WA Rapor | 1 minggu |

**Deliverable Fase 2:**
- Peluncuran tier Pro (Rp45k) dengan rapor narasi + peringkat
- Target: 500 user terdaftar, 50 paid

### Fase 3 — Scale & Integrasi (2 bulan)

| Prioritas | Fitur | Estimasi |
|---|---|---|
| P0 | Dashboard Kepala Sekolah | 2 minggu |
| P0 | Integrasi RPT Digital (API) | 3 minggu |
| P0 | **Integrasi Dapodik (API)** — sinkron data siswa/guru otomatis via API Dapodik | 2 minggu |
| P1 | Mode offline (PWA) | 2 minggu |
| P1 | LKPD & Media Ajar | 1 minggu |
| P1 | Jurnal Refleksi Harian | 1 minggu |

**Deliverable Fase 3:**
- Peluncuran tier Sekolah (Rp300k)
- Integrasi dengan Rapor Digital Madrasah
- Sinkron data siswa/guru otomatis via Dapodik API
- Target: 2000 user, 200 paid

### Fase 4 — Maturity (Bulan 7+)

| Fitur | Timeline |
|---|---|
| Analisis CP otomatis | Bulan 7 |
| Pemetaan Materi | Bulan 7 |
| Dashboard analitik untuk guru (lihat progress kelas) | Bulan 8 |
| Multi-bahasa (Inggris untuk sekolah internasional) | Bulan 9 |
| Marketplace template (sharing antar guru) | Bulan 10 |
| Aplikasi Android/iOS (React Native) | Bulan 11-12 |

---

## 11. METRIK KESUKSESAN

### 11.1 Metrik Produk (OKRs)

| Kategori | Metrik | Target M6 | Target M12 |
|---|---|---|---|
| **Akuisisi** | Total registered users | 5.000 | 15.000 |
| **Aktivasi** | Users who create ≥1 document | 60% | 70% |
| **Retensi** | Monthly active users (MAU) | 40% | 50% |
| **Revenue** | Monthly Recurring Revenue (MRR) | Rp29 jt | Rp98 jt |
| **Kepuasan** | NPS (Net Promoter Score) | >40 | >50 |
| **Dokumen** | Total dokumen tergenerate | 25.000 | 100.000 |

### 11.2 Metrik Kualitas AI

| Metrik | Target |
|---|---|
| **Modul Ajar acceptable rate** (tanpa edit) | >80% |
| **Soal acceptable rate** | >85% |
| **Narasi rapor acceptable rate** | >75% (perlu human touch) |
| **Kecepatan generate** (rata-rata) | <30 detik |
| **User mengedit sebelum export** | <30% (edit minor signifikan) |

### 11.3 Metrik Bisnis

| Metrik | Target |
|---|---|
| **CAC (Customer Acquisition Cost)** | <Rp 15.000 |
| **LTV (Basic)** | Rp25k × 6 bulan = Rp150k |
| **LTV (Pro)** | Rp45k × 8 bulan = Rp360k |
| **LTV (School)** | Rp300k × 12 bulan = Rp3.6 jt |
| **Payback period** | <3 bulan |
| **Churn rate** (monthly) | <15% |

---

## 12. RISIKO & MITIGASI

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Kualitas AI kurang akurat** (format tidak sesuai standar) | Tinggi | Human-in-the-loop: semua output AI bisa diedit; update prompt secara iteratif; user feedback rating |
| **Biaya API AI membengkak** | Tinggi | 9router auto-routing ke model termurah; cache prompt template; batch processing; budget guard harian; pantau token usage daily |
| **Kompetitor meniru fitur all-in-one** | Sedang | Fokus ke eksekusi & kecepatan; bangun komunitas guru; integrasi RPT sebagai moat |
| **Perubahan kurikulum pemerintah** | Tinggi | Arsitektur template-based (bukan hardcode); update CP database via config |
| **Guru tidak mau bayar** | Sedang | Free tier cukup murah hati; pricing rendah (Rp25k = harga 1 kopi/minggu); value jelas |
| **Koneksi internet guru tidak stabil** | Sedang | Mode offline (PWA + service worker); dokumen tetap bisa diedit tanpa internet |
| **Data keamanan & privasi** | Tinggi | Self-hosted PostgreSQL (data di server sendiri, bukan pihak ketiga); enkripsi data sensitif; tidak menyimpan data siswa lebih dari diperlukan; compliance UU PDP |
| **Integrasi RPT Digital fragile** | Sedang | Perjanjian kontrak/REST API documented; fallback: export manual + panduan import |
| **Baileys WA kena ban** | Sedang | Multi-number pool (2-3 nomor cadangan); delay acak 3-8 detik per kirim; rate max 100 pesan/jam/nomor; monitoring status nomor harian |
| **Free tier abuse** | Sedang | reCAPTCHA v3 + device fingerprint + IP rate limit + disposable email block (lihat 8.4) |
| **AI spike akhir semester** | Tinggi | Queue system + concurrency limiter + budget guard + fallback model (lihat 8.3) |
| **9router down / API berubah** | Sedang | Abstract AI service layer → bisa switch ke direct Gemini/OpenRouter tanpa ubah banyak kode; cache response untuk request identik |

---

## 13. APENDIX

### 13.1 Glossary

| Istilah | Arti |
|---|---|
| **CP** | Capaian Pembelajaran — kompetensi yang harus dicapai siswa per fase |
| **TP** | Tujuan Pembelajaran — jabaran operasional dari CP |
| **ATP** | Alur Tujuan Pembelajaran — urutan TP logis dalam satu fase |
| **Prota** | Program Tahunan — rencana pembelajaran setahun |
| **Promes** | Program Semester — breakdown Prota per semester |
| **KKTP** | Kriteria Ketercapaian Tujuan Pembelajaran |
| **Modul Ajar** | Dokumen perencanaan pembelajaran lengkap (pengganti RPP di Kurikulum Merdeka) |
| **LKPD** | Lembar Kerja Peserta Didik |
| **PTS/PAS/PAT** | Penilaian Tengah Semester / Akhir Semester / Akhir Tahun |
| **HOTS/LOTS** | Higher Order Thinking Skills / Lower Order Thinking Skills |
| **P5** | Projek Penguatan Profil Pelajar Pancasila |
| **RPT Digital** | Rapor Pesantren Terpadu / Rapor Digital Madrasah — platform rapor digital resmi Kemag untuk mengelola, merekap, dan mempublikasikan hasil belajar siswa secara online |
| **Fase A/B/C/D/E/F** | Pembagian fase di Kurikulum Merdeka: A=SD kelas 1-2, B=SD kelas 3-4, C=SD kelas 5-6, D=SMP kelas 7-9, E=SMA kelas 10, F=SMA kelas 11-12 |

### 13.2 Contoh Alur Generate Modul Ajar

```
1. User pilih: Mapel = Matematika, Kelas = 1 SD, Tema = Penjumlahan 1-10
2. AdonisJS Controller → AIService.generateModulAjar(input)
3. System:
   a. Load CP Matematika Fase A dari PostgreSQL (Lucid ORM)
   b. Build prompt dari template + CP + user input
   c. Kirim ke 9router API dengan combo `siapajar-docgen`: [System Prompt + CP + User Input]
   d. 9router route ke model primary dalam combo (fallback otomatis ke model lain)
4. AI return: JSON terstruktur
5. Simpan ke DB (documents table) + render ke InertiaJS page
6. User edit di browser (Vue 3 rich editor)
7. Export: AdonisJS controller → docx library → DOCX + Puppeteer → PDF
```

### 13.5 Docker Compose (Deployment)

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=siapajar
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_DATABASE=siapajar
      - REDIS_HOST=redis
      - ROUTER_API_KEY=${NINEROUTER_API_KEY}
      - XENDIT_KEY=${XENDIT_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=siapajar
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=siapajar
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    restart: unless-stopped

  # Optional: queue worker (bisa di container terpisah untuk scaling)
  worker:
    build: .
    command: node ace queue:work
    environment:
      - REDIS_HOST=redis
      - ROUTER_API_KEY=${NINEROUTER_API_KEY}
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

volumes:
  pgdata:
  redisdata:
```

### 13.3 Desain Prompt AI (Contoh untuk Modul Ajar via 9router Combo)

```
// Service: app/services/ai_service.ts
// Request ke 9router menggunakan combo name (bukan model name langsung)

POST https://9router.com/v1/chat/completions
Headers:
  Authorization: Bearer <9router-api-key>
  Content-Type: application/json

Body:
{
  "model": "siapajar-docgen",  // ← combo name di 9router
  "response_format": { "type": "json_object" },
  "messages": [
    {
      "role": "system",
      "content": "Anda adalah asisten AI untuk guru Indonesia yang membuat modul ajar Kurikulum Merdeka. Output harus dalam format JSON terstruktur. Gunakan bahasa Indonesia yang formal namun mudah dipahami. Ikuti format modul ajar yang sesuai dengan Panduan Pembelajaran dan Asesmen Kemendikdasmen."
    },
    {
      "role": "user",
      "content": "Buatkan modul ajar dengan konteks:\n- Mapel: {mapel}\n- Kelas: {kelas} (Fase {fase})\n- Tema: {tema}\n- Durasi: {durasi} menit\n- Model Pembelajaran: {model}\n- CP: {cp_text}"
    }
  ],
  "max_tokens": 4000,
  "temperature": 0.3
}

// 9router otomatis pilih model terbaik dari combo siapajar-docgen
// Combo berisi: primary (bayar) + free fallback (OpenCode/Mimo Code)
// Fallback otomatis jika primary gagal

// Response JSON structure:
{
  "identitas": { ... },
  "kompetensi_awal": "...",
  "profil_pelajar_pancasila": [...],
  "sarana_prasarana": "...",
  "target_peserta_didik": "...",
  "model_pembelajaran": "...",
  "tujuan_pembelajaran": [...],
  "pemahaman_bermakna": "...",
  "pertanyaan_pemantik": [...],
  "kegiatan_pembelajaran": {
    "pendahuluan": [
      {"langkah": 1, "deskripsi": "...", "waktu": 5}
    ],
    "inti": [
      {"langkah": 1, "deskripsi": "...", "waktu": 20}
    ],
    "penutup": [...]
  },
  "asesmen": { "diagnostik": "...", "formatif": "...", "sumatif": "..." },
  "pengayaan_dan_remedial": "...",
  "refleksi_guru": "...",
  "refleksi_siswa": "...",
  "glosarium": "...",
  "daftar_pustaka": "..."
}
```

### 13.6 Daftar Combo 9router (Template — Konfigurasi Manual)

Combo dikonfigurasi di dashboard 9router sebelum development. Nama combo di bawah bersifat sementara.

| Combo Name | Untuk | Contoh Isi Combo |
|---|---|---|
| `siapajar-docgen` | Prota, Promes, ATP, Modul Ajar, CP | Primary: gemini-2.5-flash; Free: model dari OpenCode/Mimo |
| `siapajar-soal` | Generate soal PTS/PAS/PAT | Primary + free fallback |
| `siapajar-narasi` | Narasi rapor TK/SD | Primary + free fallback |
| `siapajar-rubrik` | Rubrik, KKTP | Primary + free fallback |
| `siapajar-kecil` | Task ringan (refleksi, rekomendasi) | Free model saja |

> Developer konfigurasi combo di 9router dulu, sesuaikan nama combo di codebase.

### 13.4 Referensi & Sumber

- **Panduan Pembelajaran dan Asesmen (PPA)** — Kemendikdasmen
- **CP Terbaru 2024-2026** — Kemendikdasmen (database pre-loaded)
- **Permendikdasmen No 1 Tahun 2026** — Standar Proses PAUD, Dikdas, Dikmen (Pembelajaran Mendalam)
- **Buku Sumber Capaian Pembelajaran (BS KAP)** — Referensi format modul ajar
- **Xendit API Documentation** — Pembayaran
- **Gemini API Documentation** — AI text generation
- **9router** — AI model router (9router.com); unified API, auto-failover, cost routing
- **AdonisJS 7** — Node.js full-stack framework (adonisjs.com)
- **InertiaJS** — SPA without API (inertiajs.com); integrasi AdonisJS + Vue 3
- **Baileys** — Unofficial WhatsApp Web API (open-source)
- **Dapodik** — Data Pokok Pendidikan Kemendikbud (import CSV/API)
- **Rapor Digital Madrasah** — Platform rapor digital Kemag

---

> **Dokumen ini adalah PRD versi 1.5. Siap untuk direview, didiskusikan, dan dikembangkan lebih lanjut.**
>
> *"Siap Mengajar, Siap Administrasi"* — SiapAjar
