# Rincian Commit PR-0 sampai PR-10

Branch implementasi: `feat/pr-roadmap-0-10`

Dokumen ini menjelaskan isi setiap commit secara bertahap. Commit tetap dipisah agar perubahan roadmap dapat ditinjau atau diambil secara selektif.

## PR-0 — Kontrak kurikulum RA/TK

Commit: `1445635 feat(pr-0): define RA TK curriculum profile contract`

Menetapkan profil lembaga `TK` atau `RA`, tahun ajaran, kelompok A/B, serta struktur kurikulum `CP → TP → ATP → IKTP/evidence`. CP Fase Fondasi diperlakukan sebagai referensi terkontrol, sementara konteks keislaman RA disimpan sebagai metadata profil, bukan CP terpisah.

Perubahan utama mencakup model dan migration profil kurikulum, pilihan profil pada onboarding, validasi data, serta seed referensi CP/elemen PAUD.

## PR-1 — Hardening MVP dan ownership resource

Commit: `b4a853e feat(pr-1): harden onboarding and resource ownership`

Memperketat alur onboarding sampai guru memiliki profil, sekolah, tahun ajaran, kelas, dan siswa. Controller serta validator untuk kelas, siswa, dokumen, dan rapor diberi pemeriksaan ownership agar resource pengguna lain tidak dapat diakses.

Empty state, error state, retry, validasi semester, dan validasi konteks sekolah juga diperbaiki pada alur utama.

## PR-2 — Landing page dan legal content

Commit: `047b77f feat(pr-2): harden landing page and legal content`

Memfokuskan landing page pada guru RA/TK, menghapus klaim yang belum didukung, dan menambahkan status fitur yang belum tersedia. Halaman `/privacy` dan `/terms` menggunakan ordered list semantik sehingga nomor tampil sebagai numbered list.

Metadata SEO, nomenklatur produk, serta struktur legal content dirapikan.

## PR-3 — CP, TP, ATP, dan IKTP

Commit: `9776382 feat(pr-3): add PAUD CP TP ATP curriculum builder`

Menambahkan master CP Fase Fondasi dengan tiga elemen resmi, library TP, penyusunan ATP, dan indikator perilaku teramati/IKTP. Guru dapat memilih, mengedit, membuat, menyusun ulang, dan menyimpan komponen kurikulum.

Migration `1783900000026` menambahkan struktur persistence untuk curriculum plans, tujuan, ATP, dan indikator. UI builder serta seed data referensi ikut ditambahkan.

## PR-4 — Integrasi kurikulum ke dokumen pembelajaran

Commit: `06821ec feat(pr-4): connect curriculum context to learning documents`

Dokumen Modul Ajar, RPP, RPPM/RPPH, Prota/Promes, LKPD, dan Media Ajar dapat membawa konteks CP, TP, ATP, dan IKTP. Konteks tersebut juga diteruskan ke preview serta layanan export agar dokumen konsisten dengan perencanaan.

## PR-5 — Asesmen berbasis IKTP

Commit: `cf56064 feat(pr-5): add IKTP evidence-based PAUD assessment`

Menambahkan pencatatan evidence asesmen per anak: tanggal, kegiatan, perilaku yang diamati, catatan guru, bukti, instrumen, dan status ketercapaian. Instrumen observasi, ceklis, catatan anekdot, hasil karya, portofolio, serta dokumentasi didukung tanpa menjadikan angka sebagai default.

Migration `1783900000027` menambahkan tabel evidence dan relasinya dengan TP/IKTP serta siswa.

## PR-6 — Rapor perkembangan naratif

Commit: `dcb70f8 feat(pr-6): add narrative PAUD report workflow`

Menambahkan ringkasan perkembangan berdasarkan tiga elemen CP, penyusunan draft narasi dari evidence asesmen, pengeditan dan persetujuan oleh guru, serta alur batch untuk satu kelas. Nilai angka dan ranking tidak menjadi pusat laporan PAUD.

Layanan narasi, controller, model, UI, serta relasi report card diperbarui.

## PR-7 — Package dan entitlement

Commit: `a0a3bcd feat(pr-7): add package entitlements and AI usage limits`

Menyiapkan package, entitlement, periode akses, usage event, generation usage, dan batas penggunaan. Limit dapat diterapkan pada kelas, siswa, dokumen, generate AI, export, ATP/IKTP custom, batch rapor, riwayat, dan kolaborasi.

Migration `1783900000028` menambahkan persistence entitlement dan usage. Aktivasi package masih dapat dilakukan manual; payment gateway belum termasuk scope.

## PR-8 — Queue AI berbasis native Adonis Redis

Commit: `7d73984 feat(pr-8): add native Adonis Redis queue worker`

Menambahkan konfigurasi Redis native, queue persistence, status job, retry, timeout, concurrency limit, dan worker/scheduler AdonisJS. Setup ditujukan untuk PostgreSQL dan Redis native/DBNGIN, tanpa Docker Compose.

Migration `1783900000029` menambahkan tabel job queue. Job interaktif yang belum dipindahkan penuh ke worker tetap dicatat sebagai pekerjaan lanjutan.

## PR-9 — Testing dan quality gate

Commit: `e9de1cb test(pr-9): add quality gate and ownership coverage`

Menambahkan workflow CI untuk lint, typecheck, test, dan build, serta test contract untuk kurikulum dan ownership. Coverage diprioritaskan pada onboarding, akses antar-user, CP/TP/ATP, IKTP, rapor, quota, dan export.

## PR-10 — Setup development dan deployment

Commit: `465a12e chore(pr-10): document native PostgreSQL Redis setup`

Memperbarui README, `.env.example`, lockfile, dokumentasi migration/seed, health check, serta panduan menjalankan PostgreSQL dan Redis native melalui AdonisJS. Tidak ada Docker Compose yang ditambahkan.

## Perbaikan di luar roadmap

Commit: `dc520ab fix: add direct provider OAuth and dashboard onboarding`

Menambahkan tutorial Driver.js pada dashboard guru dan konfigurasi metode autentikasi AI. OpenAI menggunakan OAuth Codex CLI/app-server secara langsung, Gemini menggunakan Google OAuth secara langsung, sedangkan 9router tetap terisolasi sebagai provider tersendiri.

Untuk OpenAI OAuth, daftar model diambil melalui endpoint resmi Codex app-server `model/list`. Untuk Gemini OAuth, daftar model diambil melalui Google Generative Language API dengan bearer token dan project context. Fallback daftar model tetap tersedia ketika endpoint tidak dapat diakses.

Migration `1783900000030` dan `1783900000031` menambahkan mode autentikasi serta penyimpanan credential OAuth provider. Credential sensitif tidak ditampilkan kembali secara utuh pada UI.

## Verifikasi

- `bun run typecheck` berhasil.
- `bun run build` berhasil.
- `git diff --check` berhasil.
- Seluruh migration berhasil diterapkan pada PostgreSQL native.
- Smoke test Codex OAuth berhasil mendeteksi akun ChatGPT dan tipe paket.

File lokal yang tidak ikut commit karena merupakan data/cache pengguna:

- `public/uploads/`
- `tsconfig.inertia.tsbuildinfo`
