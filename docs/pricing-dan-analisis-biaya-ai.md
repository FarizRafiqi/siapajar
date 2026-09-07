# 💰 Analisis Biaya AI & Strategi Penetapan Harga (Pricing) SiapAjar

Dokumen ini memuat formulasi perhitungan biaya operasional kecerdasan buatan (AI Unit Economics) untuk teks dan **generasi gambar/visual**, perbandingan model resmi terkini (Google Gemini, OpenAI GPT-5.6, Google Imagen 4, OpenAI GPT Image 2), perbandingan kompetitif dengan platform `bahanajar.com`, batas ambang keamanan margin (safety margin), serta struktur paket langganan dan top-up kredit di **SiapAjar**.

---

## 1. Unit Economics & Karakteristik Token AI

Setiap dokumen kurikulum (Modul Ajar / RPPM, LKPD, Bank Soal, Rapor Narasi) yang di-generate melalui SiapAjar diproses melalui API model bahasa besar (LLM), dan untuk dokumen bergambar (LKPD Bergambar, Bank Soal Anak PAUD, Media Ajar Slide) diproses melalui model generasi visual.

### A. Komposisi Token Teks per Dokumen Rata-Rata
- **Input Tokens**: ~1.500 token (System instructions, parameter kurikulum, Capaian Pembelajaran, TP/ATP referensi).
- **Output Tokens**: ~2.000 token (Hasil struktur Modul Ajar / RPPM lengkap berformat JSON/Markdown).
- **Total per Generate**: ~3.500 token.
- **Asumsi Kurs**: USD 1 = Rp 16.000.

### B. Komposisi Biaya Gambar / Visual per Dokumen
- Dokumen non-gambar (Modul Ajar standar, Prota, Promes, Rapor): **0 gambar** (hanya biaya LLM teks).
- Dokumen bergambar (LKPD PAUD, Soal Bergambar): rata-rata **1 s.d. 3 ilustrasi per dokumen**.
- **Tarif Model Generasi Gambar Resmi (Agustus 2026)**:
  - **Google Imagen 4 Fast**: ~$0.02 / gambar (**≈ Rp 320 / gambar**)
  - **OpenAI GPT Image 2 (Standard Tier)**: ~$0.015 - $0.025 / gambar (**≈ Rp 240 - Rp 400 / gambar**)
  - **Vector / SVG Line-Art Generation (via LLM Token)**: **≈ Rp 35 - Rp 50 / asset visual**

---

## 2. Tabel Biaya AI Provider Terkini (Agustus 2026)

### 📝 Model Teks / LLM (Per 1 Juta Token)

| Provider | Model | Input ($/1M) | Output ($/1M) | Input (Rp/1M) | Output (Rp/1M) | Estimasi Biaya/Dokumen | Karakteristik & Peran |
|---|---|---|---|---|---|---|---|
| **Google Gemini** ⭐ | **Gemini 3.7 Flash** | $0.75 | $3.75 | Rp 12.000 | Rp 60.000 | **Rp 138** | **Primary / Default**: Kualitas PAUD & SD optimal |
| Google Gemini | Gemini 3.6 Flash | $0.75 | $3.75 | Rp 12.000 | Rp 60.000 | **Rp 138** | High-speed Flash model |
| Google Gemini | Gemini 3.5 Flash | $1.50 | $9.00 | Rp 24.000 | Rp 144.000 | **Rp 260** | General Available Stable Tier |
| **OpenAI** 🟢 | **GPT-5.6 Luna** | $0.20 | $1.20 | Rp 3.200 | Rp 19.200 | **Rp 43** | **Budget Saver**: Super hemat, volume tinggi |
| OpenAI | **GPT-5.6 Terra** | $2.00 | $12.00 | Rp 32.000 | Rp 192.000 | **Rp 432** | Balanced tier untuk task kompleks |
| OpenAI | **GPT-5.6 Sol** | $4.00 | $20.00 | Rp 64.000 | Rp 320.000 | **Rp 736** | Flagship deep reasoning & sains |

### 🎨 Model Generasi Gambar / Ilustrasi (Per Gambar)

| Provider | Model | Harga ($ / Gambar) | Harga (Rp / Gambar) | Penggunaan di SiapAjar |
|---|---|---|---|---|
| **Google Vertex** | **Imagen 4 Fast** ⭐ | $0.020 | **Rp 320** | Ilustrasi soal anak, gambar tematik LKPD |
| **OpenAI** | **GPT Image 2** | $0.020 | **Rp 320** | Alternatif gambar realistis & detail |
| **LLM Inline SVG** | **Gemini / GPT-5.6** | ~$0.002 | **Rp 35** | Icon visual, garis bentuk, tracing angka |

---

## 3. Rumus & Formulasi Perhitungan Biaya

### A. Rumus Biaya Modal Dokumen Lengkap (COGS Teks + Gambar)
$$\text{COGS}_{\text{dokumen}} = (\text{Input Token} \times \text{Tarif Input}) + (\text{Output Token} \times \text{Tarif Output}) + (N_{\text{gambar}} \times \text{Tarif Gambar}) + \text{Biaya Server}$$

#### 1. Dokumen Teks Murni (Modul Ajar / RPPM / Rapor) dengan Gemini 3.7 Flash:
$$\text{COGS} = \text{Rp } 18 + \text{Rp } 120 + \text{Rp } 0 + \text{Rp } 10 = \mathbf{\text{Rp } 148}$$
*(Pengurangan kredit: 1 - 2 kredit = nilai jual Rp 1.422 - Rp 2.666 → **Margin 89% - 94%**)*

#### 2. Dokumen Bergambar (LKPD / Soal PAUD dengan 2 Ilustrasi Imagen 4 Fast):
$$\text{COGS} = \text{Rp } 18 + \text{Rp } 120 + (2 \times \text{Rp } 320) + \text{Rp } 10 = \text{Rp } 148 + \text{Rp } 640 = \mathbf{\text{Rp } 788}$$
*(Pengurangan kredit: 1.5 - 2 kredit = nilai jual Rp 1.422 - Rp 2.666 → **Margin 45% - 70%**, tetap sangat aman & untung).*

---

## 4. Benchmark Pasar (vs Bahanajar.com)

| Indikator | Bahanajar.com | SiapAjar (Paket Baru) | Analisis Keunggulan SiapAjar |
|---|---|---|---|
| **Harga Rata-rata per Kredit** | Rp 1.500 – Rp 2.000 | **Rp 711 – Rp 1.333** | Lebih terjangkau **40% – 52%** |
| **Masa Aktif Kredit** | Berbatas waktu / hangus bulanan | **Kredit Selamanya (Lifetime)** | Guru merasa lebih aman & fleksibel |
| **Format Ekspor** | Terbatas | **Word (.docx) & PDF Siap Cetak** | Edit instan tanpa ribet copy-paste |
| **Kesesuaian Regulasi** | Template standar | **PAUD/TK, RA Kemenag, & SD Kurikulum Merdeka** | Format resmi supervisi kepala sekolah & akreditasi |

---

## 5. Simulasi Keuntungan Bersih per Paket (Bauran Teks & Gambar)

Dengan rasio penggunaan normal pengguna (80% dokumen teks + 20% dokumen bergambar, rata-rata COGS campuran = **Rp 276 / kredit**):

| Nama Paket | Harga Jual | Total Kredit | Harga / Kredit | Estimasi Biaya AI Total (Campuran) | Estimasi Keuntungan Bersih (Gross Profit) | Margin Keuntungan Rata-rata |
|---|---|---|---|---|---|---|
| **Paket Pemula** | **Rp 20.000** | 15 | Rp 1.333 | Rp 4.140 | **Rp 15.860** | **79.3%** |
| **Paket Sahabat Guru** *(Terlaris)* | **Rp 45.000** | 45 | Rp 1.000 | Rp 12.420 | **Rp 32.580** | **72.4%** |
| **Paket Guru Teladan** | **Rp 85.000** | 100 | Rp 850 | Rp 27.600 | **Rp 57.400** | **67.5%** |
| **Paket Sekolah / Institusi** | **Rp 249.000** | 350 | Rp 711 | Rp 96.600 | **Rp 152.400** | **61.2%** |

*(Jika pengguna hanya membuat modul ajar teks biasa, margin melonjak menjadi **79.2% – 89.7%**).*

---

## 6. Kesimpulan & Kebijakan Kuota Gambar

1. **Skema Konsumsi Kredit Terpadu**:
   - Modul Ajar / RPPM (Teks): **1 - 2 Kredit**
   - Bank Soal / LKPD Bergambar: **1.5 - 2 Kredit**
   - Request Generate Gambar Tunggal / Media Slide: **1 Kredit per gambar**
2. **Margin Aman (Zero Boncos)**: Bahkan jika pengguna menggunakan 100% kuota kreditnya untuk generate gambar via Imagen 4 Fast (~Rp 320/gambar), harga jual terendah per kredit di SiapAjar adalah **Rp 711/kredit**, sehingga margin kotor terendah tetap di atas **55%**.
