# Pricing & Analisis Biaya AI SiapAjar

Dokumen ini adalah acuan MVP untuk top-up kredit satu kali. Angka biaya AI
provider berubah, jadi angka pada bagian simulasi adalah asumsi pengendalian
risiko, bukan janji harga provider. Harga katalog yang menjadi source of truth
berada di `database/seeders/package_seeder.ts`; nominal yang ditagihkan ke
pelanggan dibaca ulang dari database sebelum invoice Mayar dibuat.

## Katalog yang dijual

Landing page menampilkan empat paket berbayar. Paket gratis tidak dimasukkan ke
grid harga agar pilihan utama tetap ringkas; benefit gratis diaktifkan dari alur
verifikasi/anti-abuse, bukan dari checkout.

| Paket              |     Harga | Kredit | Harga/kredit | Posisi                  |
| ------------------ | --------: | -----: | -----------: | ----------------------- |
| Paket Pemula       |  Rp20.000 |     15 |      Rp1.333 | Coba beberapa dokumen   |
| Paket Sahabat Guru |  Rp45.000 |     45 |      Rp1.000 | Persiapan satu semester |
| Paket Guru Teladan |  Rp85.000 |    100 |        Rp850 | Guru produktif          |
| Paket Sekolah      | Rp249.000 |    350 |        Rp711 | Multi-guru/institusi    |

Paket gratis tetap ada untuk onboarding (10 kredit setelah verifikasi dan
pemeriksaan keamanan). Semua biaya kredit adalah bilangan bulat karena ledger
database bertipe integer. Jangan menjual 0,5 atau 1,5 kredit sebelum seluruh
ledger, refund, UI, dan rekonsiliasi mendukung pecahan secara atomik.

## Biaya per operasi

Biaya produk yang ditampilkan ke guru harus mengikuti matriks ini, bukan asumsi
lama yang mencampur kredit dengan kuota ekspor:

| Operasi                             | Debit kredit | Kuota/biaya lain                                                  |
| ----------------------------------- | -----------: | ----------------------------------------------------------------- |
| Modul Ajar, RPPM/RPPH, Prota/Promes |            1 | —                                                                 |
| LKPD atau Bank Soal teks            |            1 | —                                                                 |
| Media Ajar                          |            1 | Kuota visual jika memakai gambar                                  |
| LKPD/Soal bergambar                 |            1 | Kuota visual per asset                                            |
| Draft AI Asesmen PAUD               |            1 | —                                                                 |
| Kokurikuler/P5                      |            2 | —                                                                 |
| PDF/DOCX                            |            0 | Entitlement export; reserve harus di-commit setelah render sukses |

Rumus pengendalian margin:

```text
COGS = biaya AI sukses + biaya retry/gagal + fee Mayar
       + storage/egress + support + cadangan refund/fraud
gross profit = harga - COGS
margin = gross profit / harga
```

Ukur biaya berdasarkan `provider`, `model`, `operation`, token input/output,
`cached_tokens`/cache-read, cache-write, latency, dan jumlah retry. Jangan
menganggap seluruh kredit pasti menjadi biaya maksimum: cache result aplikasi,
prompt cache provider, dan penggunaan SVG internal dapat menurunkan COGS.

## Simulasi konservatif untuk keputusan harga

Gunakan simulasi berikut sebagai guardrail internal, bukan copy marketing.
Contoh asumsi bauran normal: AI rata-rata Rp180/kredit, fee pembayaran 4%,
cadangan retry/refund 10%, dan alokasi infra/support 5% dari revenue.

| Paket        | Pendapatan | AI (seluruh kredit) | Fee+cadangan+ops | Gross profit simulasi | Margin |
| ------------ | ---------: | ------------------: | ---------------: | --------------------: | -----: |
| Pemula       |   Rp20.000 |             Rp2.700 |          Rp3.800 |              Rp13.500 |  67,5% |
| Sahabat Guru |   Rp45.000 |             Rp8.100 |          Rp8.550 |              Rp28.350 |  63,0% |
| Guru Teladan |   Rp85.000 |            Rp18.000 |         Rp16.150 |              Rp50.850 |  59,8% |
| Sekolah      |  Rp249.000 |            Rp63.000 |         Rp47.310 |             Rp138.690 |  55,7% |

Angka ini turun bila semua request memakai model gambar mahal atau retry tinggi.
Untuk menjaga margin moderat 55–70%:

1. jadikan SVG/icon library sebagai default dan gambar model sebagai pilihan;
2. batasi kuota gambar per paket dan tampilkan konsekuensinya sebelum generate;
3. batasi output token, timeout, dan retry maksimal satu kali;
4. pasang budget cap provider dan hentikan/ubah routing ketika biaya per dokumen
   melewati ambang;
5. audit p50/p95 biaya per operasi setiap bulan, termasuk fee Mayar dan refund.

Harga/token dan model berubah. Verifikasi angka langsung dari [Gemini API
pricing](https://ai.google.dev/gemini-api/docs/pricing) atau [OpenAI API
pricing](https://openai.com/api/pricing/) ketika membuat forecast baru. Paket
Google AI konsumen bukan saldo API server; billing API harus memakai project dan
budget cap operasional yang terpisah.

## Strategi model murah

- **Default teks:** model Flash/Lite dengan harga rendah dan JSON schema ketat
  (misalnya lini Gemini Flash-Lite yang tersedia di project API saat launch).
- **Fallback:** model Flash yang lebih mampu hanya ketika validasi struktur atau
  kualitas minimum gagal.
- **Visual:** registry Lucide/SVG composer terlebih dahulu; image model hanya
  saat guru memilih ilustrasi. Simpan asset berdasarkan hash prompt, style,
  ukuran, dan versi renderer.
- **9router:** `operation` menyatakan pekerjaan bisnis, misalnya
  `teaching_module.generate`. `routingCombo` hanya boleh diisi ketika provider
  yang dipilih adalah 9router dan admin memang memilih bundle model. Provider
  lain tidak perlu menerima payload tersebut.

Pisahkan dua cache. Result cache SiapAjar mencegah request identik memanggil
provider lagi dan tetap scope per user. Prompt cache provider hanya menghemat
input token ketika prefix stabil cocok; ia dapat di-evict dan tidak boleh
dijanjikan 100% hit. Letakkan instruksi/schema/kurikulum stabil di prefix dan
data kelas/tanggal di suffix; jangan menambahkan nonce atau timestamp ke prefix.
Referensi: [OpenAI prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
dan [Gemini context caching](https://ai.google.dev/gemini-api/docs/caching).

## Payment dan rekonsiliasi

Mayar harus menerima nominal dan paket yang sudah diverifikasi dari database.
Webhook hanya pemicu: server memeriksa invoice remote, status paid, nominal
persis, gateway, lalu settlement dalam transaksi dengan unique/idempotency
constraint. Gunakan endpoint `POST /api/webhooks/mayar/<secret>` melalui HTTPS,
set secret khusus di staging/production, dan uji alur invoice → webhook →
remote verify → ledger sebelum menerima uang nyata. Rujukan payload ada di
[Mayar create invoice](https://docs.mayar.id/api-reference/invoice/create) dan
[Mayar webhook](https://docs.mayar.id/integration/webhook).

## Checklist operasi bulanan

- Rekonsiliasi invoice Mayar paid dengan ledger top-up.
- Tinjau duplicate webhook, negative-balance attempt, refund, dan chargeback.
- Bandingkan biaya AI provider dengan `cached_tokens`/cache-write aktual.
- Cocokkan job yang timeout di HTTP dengan status worker; jangan menganggap
  timeout berarti provider gagal sebelum refund dikreditkan.
- Pastikan paket aktif, harga, dan kredit di landing, modal top-up, dan backend
  berasal dari katalog yang sama.
- Uji restore backup dan export PDF/DOCX; quota export tidak boleh hilang saat
  render gagal (reservation dilepas ketika render gagal).
