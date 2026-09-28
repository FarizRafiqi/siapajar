# SiapAjar — Audit MVP & Rencana Go-to-Market

Dokumen ini adalah baseline operasional untuk MVP SiapAjar yang menyasar guru
PAUD/TK/RA. Brand perusahaan yang dipilih: **Naka Tech (Nalar Karya Teknologi)**.
SiapAjar tetap menjadi nama produk.

## Status audit lokal

Smoke test sebelumnya sempat membuka landing, login seeded, dan dashboard pada
`127.0.0.1:3333` menggunakan akun dari `database/seeders/user_seeder.ts`.
Pada pemeriksaan terakhir server pengguna tidak merespons (connection refused),
sehingga hasil runtime terbaru belum boleh dianggap terverifikasi; audit ini
tidak menyalakan server lain dan tidak mengklaim status production.

Katalog sellable setelah purge lokal berisi:

| Paket              |     Harga |               Kredit | Harga/kredit |
| ------------------ | --------: | -------------------: | -----------: |
| Paket Gratis       |       Rp0 | benefit paket gratis |            — |
| Paket Pemula       |  Rp20.000 |                   15 |      Rp1.333 |
| Paket Sahabat Guru |  Rp45.000 |                   45 |      Rp1.000 |
| Paket Guru Teladan |  Rp85.000 |                  100 |        Rp850 |
| Paket Sekolah      | Rp249.000 |                  350 |        Rp711 |

Paket legacy, entitlements, subscription lokal, dan akun fixture yang menunjuk
ke package lama sudah dihapus melalui `PURGE_LEGACY_PACKAGES=true`. Fixture
`internal_testing_unlimited` sengaja dipertahankan sebagai paket internal
nonaktif. Enam invoice lokal yang masih pending/non-paid juga dihapus; histori
paid tidak disentuh. Seeder tidak menghapus billing history secara default.

## Keputusan produk dan UI/UX

### Yang sudah diperbaiki

- Shadow hitam pada navbar saat scroll dihapus; garis bawah tetap dipertahankan
  sebagai pemisah visual yang lebih ringan.
- Tur dashboard tidak lagi muncul otomatis dan menutupi konten. Tur tetap dapat
  dibuka melalui tombol Help/Tutorial.
- Landing menampilkan enam alat praktis utama agar tetap mudah dipindai; katalog
  lengkap diarahkan melalui tombol **Lihat Semua Alat** ke dashboard (atau signup
  untuk pengunjung yang belum masuk).
- Dashboard guru memakai konteks jenjang. Untuk TK/PAUD/RA, kartu Katrol Nilai
  diganti menjadi Asesmen Perkembangan PAUD; untuk SD Katrol Nilai tetap tampil.
- Ikon emoji mentah pada login, signup, dan Media Ajar diganti ikon SVG.
- Input Katrol dan prompt RPM tidak lagi mengisi nama/nilai fixture; state awal
  kosong agar data contoh tidak pernah terbawa ke dokumen guru.
- Popover tur memiliki batas tinggi/scroll agar tidak keluar viewport mobile.
- Profil jenjang memakai `educationLevel` sebagai sumber kebenaran. Metadata
  `institutionType` lama dibersihkan saat onboarding/pengaturan agar akun SD
  tidak mendapat menu/header PAUD secara keliru.
- Konteks semester rapor sekarang harus berasal dari tahun ajaran kelas yang
  dimiliki guru; request lintas tahun ajaran ditolak sebelum enqueue.
- Webhook Mayar menerima kombinasi status resmi seperti `transactionStatus:
created` + `status: SUCCESS`, mencari invoice melalui invoice/transaction ID,
  lalu tetap melakukan remote verification nominal dan status sebelum settlement.
- Cache result AI memasukkan provider, gateway, model, operasi, versi prompt,
  parameter, dan user scope. `routingCombo` hanya valid untuk 9router.

### Arah polish landing page

1. **Hero harus menjawab tiga hal dalam satu viewport:** siapa pengguna (guru
   PAUD/TK/RA), hasil utama (administrasi siap tinjau/cetak), dan aksi pertama
   (Coba gratis). Judul yang ada tetap dipertahankan; fokus benefit dapat
   ditempatkan sebagai eyebrow kecil di atas judul atau satu kalimat pendukung
   tepat di bawah judul, bukan mengganti headline.
2. **Motion:** gunakan satu pola reveal konsisten (opacity + translate 12–16px,
   350–500ms, ease-out), stagger 60–90ms per kelompok, dan hormati
   `prefers-reduced-motion`. Hindari animasi yang terus bergerak pada seluruh
   halaman karena mengurangi rasa selesai/premium.
3. **Kawaii-pop yang matang:** pertahankan warna emerald/amber dan ilustrasi
   ramah, tetapi batasi border/shadow tebal pada hero, CTA utama, dan kartu
   tingkat atas. Baris/kartu di dalam kartu induk cukup memakai border/divider.
4. **Trust sebelum pricing:** tampilkan contoh keluaran (potongan RPPM/LKPD,
   metadata sekolah, format Word/PDF), proses 3 langkah, dan FAQ privasi. Klaim
   “detik” harus konsisten dengan p95 latency nyata.
   Di dekat pricing tampilkan trust strip pembayaran yang ringkas: **QRIS**,
   **e-wallet**, dan **Pembayaran terverifikasi**. Hindari mengunci copy publik
   ke nama gateway tertentu; tulis bahwa kanal yang muncul mengikuti konfigurasi
   merchant dan tersedia saat checkout. Detail metode dan status invoice tetap
   diverifikasi di backend.
5. **Pricing:** tampilkan kredit yang diterima, contoh pemakaian, dan kebijakan
   kredit tidak hangus secara eksplisit. Jangan menyebut “subscription” bila
   produk sebenarnya top-up kredit satu kali.
6. **Responsive:** di mobile CTA utama full-width, navigasi tidak menutupi hero,
   tabel operasional memakai `overflow-x-auto`, dan modal selalu memiliki area
   konten yang dapat di-scroll.
7. **Aksesibilitas:** kontras teks utama minimal WCAG AA, focus-visible jelas,
   target sentuh minimal 44px, label input eksplisit, dan status AI dapat dibaca
   screen reader.

### Hirarki dashboard

Gunakan urutan tetap: saldo kredit + top-up, “lanjutkan pekerjaan terakhir”,
tool sesuai jenjang, checklist kesiapan, lalu data terbaru. Delapan kartu landing
boleh tetap lengkap; dashboard tidak perlu memaksa semua tool lintas jenjang.
Untuk PAUD/RA gunakan istilah RPPM/RPPH, kelompok, asesmen perkembangan, narasi
rapor, dan P2RA/P5. Untuk SD gunakan modul ajar, kelas, bank soal, dan katrol.

### Kontrak generik Express tools

Express tools sekarang memakai satu kontrak konteks yang menerima
`educationLevel`, `institutionType`, `curriculumVersion`, dan (bila relevan)
`phase`. `education_profile` menerjemahkan konteks itu menjadi label audiens,
fase, dan kerangka kurikulum sehingga prompt tidak mengunci PAUD/TK. PAUD/TK/RA
tetap menjadi jalur pertama dengan RPPM/RPPH dan asesmen perkembangannya;
planner, LKPD, jurnal, kokurikuler, katrol, soal, dan rapor dapat memakai profil
jenjang lain ketika katalog datanya tersedia.

SMP/MTs/SMA/SMK belum boleh diaktifkan hanya karena prompt sudah generik. Sebelum
menampilkan pilihan itu di produksi, siapkan migrasi kolom jenjang yang masih
berupa enum TK/SD (subjects, learning sequences, institution settings),
validator/onboarding, pemetaan kelas/fase, katalog curriculum preset, serta QA
output per jenjang. Dengan batas ini, arsitektur siap diperluas sekarang tanpa
mengklaim dukungan persistence yang belum ada.

Route Express yang menjadi kontrak MVP: `/soal/generate`,
`/prota-promes/generate`, dan `/rapor/generate`. Controller hanya memvalidasi
request, mengambil konteks auth, memanggil satu service, lalu memilih response;
normalisasi AI, kredit, ownership, dan transaksi tetap berada di service atau
repository.

## Audit backend dan payment

### Temuan yang sudah ditangani

- `PackageRepository.findForCheckout` sekarang hanya mengembalikan paket aktif
  yang diminta secara eksplisit. Tidak ada fallback diam-diam ke paket highlighted
  atau paket pertama.
- Mayar mengambil jumlah kredit dari feature integer pada paket aktif (Sahabat
  45, Sekolah 350); paket gratis atau paket tanpa entitlement kredit ditolak,
  tanpa fallback nama paket lama.
- Token API mobile sebelumnya hanya base64 `userId:timestamp` sehingga dapat
  dipalsukan. Sekarang token ditandatangani HMAC-SHA256 memakai `APP_KEY`,
  memiliki masa berlaku 30 hari, diverifikasi constant-time, dan middleware
  menolak token invalid/expired.
- Timeline PAUD, konteks siswa/kelas AI, dan quick-capture dibatasi ke pemilik
  kelas. Attachment API menggunakan endpoint terautentikasi, bukan path storage
  publik.
- Bonus signup menggunakan row lock dan pemeriksaan atomik agar tidak terbit dua
  kali pada request bersamaan.
- Entitlement sekarang fail-closed: akun tanpa paket atau paket tanpa baris
  fitur tidak otomatis dianggap unlimited setelah migrasi katalog.
- Seluruh jalur export PDF/DOCX (termasuk report, curriculum, dan assessment)
  sekarang reserve kuota sebelum render, commit hanya setelah buffer berhasil
  dibuat, dan release reservation ketika render gagal. Export ujian Chromium
  mempertahankan pola yang sama.
- Seluruh generator dokumen utama (Modul Ajar, Prota/Promes, RPPM/RPPH, LKPD,
  Media Ajar, Express, dan draft AI Asesmen PAUD) kini memakai debit sebelum
  pekerjaan mahal dan refund idempotent berbasis reservation key ketika AI atau
  persistence gagal. Job Bank Soal dan queue visual memakai claim atomik agar
  cache miss identik tidak memanggil provider dua kali.
- Worker produksi sekarang ikut mendengarkan queue `exam-generation`; entrypoint
  gagal cepat jika migrasi gagal dan seeding hanya berjalan bila
  `SEED_ON_STARTUP=true`, sehingga restart tidak menulis ulang katalog produksi.

### P0 yang masih wajib sebelum uang nyata

1. `ExamGenerationService` sudah debit sebelum kerja dan refund idempotent.
   Reservation key yang sama hanya boleh dipakai ulang setelah reversal eksplisit
   (sehingga retry tidak gratis dan crash sebelum refund tidak menggandakan debit).
   Persistence dokumen parsial tetap perlu diuji sebelum pilot berbayar.
2. Timeout request queue perlu dibuat eksplisit. Worker AI dapat berjalan hingga
   2–5 menit, sementara pemanggil HTTP menunggu 120 detik; jika pemanggil refund
   karena timeout lalu worker menyelesaikan job, provider bisa bekerja tanpa debit
   produk. Simpan status billing/reservation yang durable dan selesaikan refund
   hanya setelah worker benar-benar terminal.
3. Quick-submit attendance sekarang mengembalikan status `not_implemented`,
   bukan sukses palsu. Implementasikan tabel/service + ownership check jika
   presensi termasuk janji MVP, atau sembunyikan CTA sampai tersedia.
4. Mayar sudah memakai endpoint sandbox/production yang benar, payload create
   invoice terdokumentasi, timeout, remote verification, filter gateway, dan
   unique idempotency constraint. Sebelum uang nyata tetap wajib mengisi secret
   webhook di staging/production, menguji payload nyata, rate limit/body limit,
   audit log tersanitasi, dan rekonsiliasi harian.
5. Tambahkan audit log untuk perubahan harga/paket, refund manual, perubahan
   saldo admin, dan semua webhook (payload disanitasi; jangan simpan API key).
6. Seeder development sudah tidak berjalan otomatis kecuali
   `SEED_ON_STARTUP=true`; release job harus menjalankan migration/catalog seed
   secara eksplisit dan sekali saja.

### URL webhook Mayar

Route aplikasi saat ini adalah:

```text
POST /api/webhooks/mayar/:secret
```

Dengan domain produksi `siapajar.farizrafiqi.dev`, URL yang diisikan ke Mayar:

```text
https://siapajar.farizrafiqi.dev/api/webhooks/mayar/<MAYAR_WEBHOOK_PATH_SECRET>
```

`<MAYAR_WEBHOOK_PATH_SECRET>` harus berupa random URL-safe string yang hanya
disimpan di environment server. Gunakan secret khusus webhook, jangan API key;
set nilainya sama dengan `MAYAR_WEBHOOK_PATH_SECRET` (fallback lama adalah
`MAYAR_WEBHOOK_TOKEN`). Cloudflare proxy tidak membuat URL kedua: jika DNS
Cloudflare meneruskan hostname tersebut ke origin, hostname yang sama dipakai.
Pastikan HTTPS, POST diteruskan ke Adonis port 3333, dan jangan memakai
`localhost` untuk webhook.

Mayar mengatur metode pembayaran aktif dari dashboard merchant. Untuk MVP,
aktifkan QRIS dan e-wallet yang diperlukan, lalu nonaktifkan VA/kartu/retail
yang belum ingin ditanggung support-nya. Payload create-invoice tidak seharusnya
dipakai sebagai whitelist metode; sumber kebenarannya adalah konfigurasi Mayar.
Landing boleh menampilkan trust strip, tetapi tulis kanal sebagai "tersedia saat
checkout" dan jangan menampilkan logo/nama kanal yang belum diaktifkan. Mayar
mendokumentasikan QRIS, e-wallet, virtual account, kartu, dan retail outlet;
biaya serta settlement berbeda per kanal, jadi verifikasi di [daftar metode
Mayar](https://docs.mayar.id/onlinepaymentmethod) dan [tabel biaya
Mayar](https://docs.mayar.id/mor/fees) sebelum menetapkan copy atau margin.

## Pricing dan unit economics

Harga sekarang masuk akal untuk margin moderat, tetapi margin pada dokumen lama
terlalu optimistis karena mencampur asumsi model yang belum tentu tersedia dan
belum memasukkan fee payment, storage, support, retry AI, pajak, dan refund.
Gunakan rumus konservatif:

```text
gross profit = harga - fee Mayar - biaya AI berhasil - biaya AI gagal/retry
              - storage/egress - biaya support - cadangan refund/fraud
margin       = gross profit / harga
```

Target MVP: margin kotor 55–70% pada bauran penggunaan normal, bukan 80–90%.
Tetapkan reserve 10–15% dari revenue untuk retry, abuse, refund, dan biaya yang
belum terukur. Audit harga setiap bulan berdasarkan pemakaian p50/p95, bukan
hanya jumlah kredit terjual.

Kebijakan kredit yang konsisten untuk MVP:

| Aksi                              |                                                                       Biaya |
| --------------------------------- | --------------------------------------------------------------------------: |
| Modul Ajar/RPPM/RPPH/Prota/Promes |                                                                    1 kredit |
| LKPD                              |                                 1 kredit + kuota visual bila memakai gambar |
| Bank Soal                         |                                 1 kredit + kuota visual bila memakai gambar |
| Media Ajar                        |                                                     1 kredit + kuota visual |
| Draft AI Asesmen PAUD             |                                                                    1 kredit |
| Kokurikuler/P5                    |                                                                    2 kredit |
| Export                            | entitlement/kuota export; jangan debit kredit kedua tanpa copywriting jelas |

Kredit harus integer selama kolom database masih `integer`; jangan menjual biaya
0,5 atau 1,5 kredit sebelum ledger dan UI mendukung pecahan secara atomik.

## Strategi AI murah

Gemini AI Pro konsumen membantu akses aplikasi Gemini/fitur Google tertentu,
tetapi jangan dianggap sebagai saldo API produksi. Untuk server, buat project API
terpisah, aktifkan billing/prepay dengan budget cap, dan pantau usage. Rekomendasi:

- **Default:** Gemini 2.5 Flash-Lite untuk draft/TOON/normalisasi sederhana.
- **Fallback kualitas:** Gemini 2.5 Flash untuk RPPM kompleks atau output yang
  gagal validasi.
- **Gambar:** SVG library/internal composer untuk tracing sederhana; model image
  hanya bila guru memilih ilustrasi. Cache berdasarkan prompt + style + ukuran.
- **Routing:** batasi token output, schema JSON ketat, timeout 45–90 detik,
  retry maksimal satu kali, dan dead-letter queue.
- **Budget awal:** tetapkan cap internal Rp300.000–Rp1.000.000/bulan. Mulai
  dengan 100–300 pengguna terdaftar, ukur biaya per dokumen, lalu naikkan cap
  hanya jika gross margin terjaga.

### Kontrak cache generate (goal aktif)

Terminologi AI juga dipisahkan: `operation` adalah pekerjaan bisnis yang sedang
dibuat (misalnya `teaching_module.generate`), sedangkan `routingCombo` hanya
nama bundle model 9router. Kolom lama `ai_jobs.combo` sudah di-rename menjadi
`ai_jobs.operation` pada migration lokal; tidak ada lagi nama generator seperti
`siapajar-docgen` yang dipakai sebagai combo.

Ada dua lapisan yang sengaja dibedakan. **Result cache aplikasi** (durable di
`ai_jobs`/`visual_assets`) mencegah request identik memanggil provider lagi.
**Prompt cache provider** menurunkan biaya input-token ketika prefix prompt yang
sama dipakai berulang (OpenAI otomatis, Gemini 2.5+ implicit, Anthropic memakai
`cache_control` untuk konteks panjang). Keduanya harus dijaga:

- result-cache key harus deterministik dan memasukkan versi prompt, operasi,
  serta routing combo hanya bila provider 9router memang memakainya,
  parameter, serta user scope; hasil yang memuat data sekolah/siswa tidak boleh
  dibagikan lintas akun;
- baca result cache completed sebelum reserve/debit atau dispatch provider
  (result-cache hit tidak memanggil AI; debit dokumen tetap mengikuti kebijakan
  produk yang ditampilkan ke guru);
- tulis hasil sukses ke cache setelah validasi/sanitasi, lalu reuse untuk request
  identik; request concurrent dengan key sama hanya boleh memiliki satu worker
  provider;
- untuk prompt cache, letakkan instruksi/schema/korpus kurikulum yang stabil di
  prefix dan semua data user/kelas/tanggal di suffix. Jangan menambahkan nonce,
  timestamp, atau whitespace acak di prefix. Kirim `prompt_cache_key` yang stabil
  hanya ke provider yang mendukungnya; jangan meneruskan field itu secara buta ke
  gateway OpenAI-compatible;
- cache failure tidak boleh dianggap hit; reservation yang gagal harus dilepas,
  dan hasil/asset yang stale di-invalidasi saat versi prompt/model berubah;
- ukur terpisah `result_cache_hit`, `prompt_cache_hit`/`cached_tokens`,
  `cache_write`, provider call, token, latency, dan biaya per generator agar
  TTL/version dapat dituning berdasarkan telemetry. Prompt caching provider tidak
  pernah dijanjikan 100% hit; verifikasi dari usage response/provider dashboard.

Referensi perilaku provider yang dipakai saat merancang kontrak ini: [OpenAI Prompt
Caching](https://openai.com/index/api-prompt-caching/) mencocokkan prefix dan
mengembalikan `cached_tokens`; [Gemini Context Caching](https://ai.google.dev/gemini-api/docs/caching)
menyediakan implicit caching untuk model 2.5+ serta explicit cache bila konteks
panjang berulang; Anthropic menggunakan breakpoint `cache_control` untuk cache
ephemeral. Cache provider dapat berubah/evict, jadi angka penghematan hanya boleh
diambil dari usage aktual, bukan diasumsikan dari jumlah request.

## Target pelanggan dan infra bertahap

| Tahap    |       Target | Fokus validasi                              | Infra minimum                                               | Modal operasional indikatif |
| -------- | -----------: | ------------------------------------------- | ----------------------------------------------------------- | --------------------------: |
| Pilot    |      10 guru | 5 dokumen/guru, feedback manual             | 1 app + Postgres + Redis, backup harian                     |                Rp0,5–1,5 jt |
| Beta     |     100 guru | aktivasi minggu pertama ≥40%, bayar pertama | VPS 2 vCPU/4 GB, object storage, Sentry/log alert           |                  Rp1,5–4 jt |
| PMF awal |   1.000 guru | repeat purchase, p95 generate, abuse rate   | app/worker dipisah, Postgres managed + Redis, CDN           |                   Rp5–15 jt |
| Scale 1  |   5.000 guru | retention 30 hari, support cost             | autoscale worker, read replica/backup PITR, queue metrics   |                  Rp15–40 jt |
| Scale 2  | 10.000+ guru | SLA, sekolah multi-user                     | multi-instance app, WAF, observability penuh, incident rota |                  Rp35–80 jt |

Angka modal adalah rentang perencanaan, bukan quotation vendor. Pisahkan budget
AI, infra, payment fee, support, dan akuisisi; jangan memakai saldo Gemini Pro
pribadi sebagai asumsi COGS yang bisa dijanjikan ke pelanggan.

## KPI go-to-market

- Aktivasi: akun membuat kelas dan satu dokumen dalam 24 jam.
- Aha moment: dokumen pertama berhasil diunduh dan diedit.
- Konversi: free → top-up pertama; ukur per jenjang PAUD/TK/RA vs SD.
- Retensi: guru aktif minggu ke-4 dan pembelian ulang 30/60 hari.
- Kualitas: p95 waktu generate, valid JSON rate, retry rate, export success rate.
- Keamanan: failed webhook, duplicate settlement, negative-balance attempt,
  identity reuse, dan manual adjustment count.

## Urutan eksekusi sebelum launch

1. Verifikasi staging Mayar end-to-end (invoice → webhook → remote verify →
   satu ledger top-up) dengan nominal kecil.
2. Uji seeded account PAUD/TK/RA dan SD di desktop/mobile, termasuk empty state,
   modal top-up, error provider, dan export PDF/DOCX.
3. Pasang observability: error tracking, latency dashboard, queue depth,
   payment reconciliation harian, backup restore drill.
4. Pilot 10 guru, jangan scale acquisition sebelum biaya per dokumen dan
   retention terukur.

## Status tindak lanjut queue, audit, dan observability

- Timeout waiter AI kini berbeda dari timeout provider. Reservasi kredit
  `refund_pending` menunggu seluruh child job terkait terminal; job pending atau
  processing yang stale dicoba pulihkan oleh maintenance queue.
- Audit tersanitasi mencakup lifecycle webhook/payment, settlement atomik dengan
  ledger top-up, perubahan katalog/entitlement dan tindakan admin yang tersedia.
  Endpoint refund manual dan penyesuaian saldo admin belum ada, sehingga belum
  ada mutasi tersebut untuk diaudit.
- `/admin/operations` menampilkan health database/Redis, state queue AI, stale
  jobs, p50/p95 generator, pending invoice, dan hasil rekonsiliasi. Request dan
  worker menulis structured logs dengan correlation ID.
- Rekonsiliasi Mayar berjalan harian pukul 03:45 Asia/Jakarta; verifikasi
  staging, konfigurasi collector/error tracking eksternal, provider backup,
  serta restore drill tetap menjadi pekerjaan deployment/operator. Repository
  belum mengonfigurasi Sentry atau backup database.
