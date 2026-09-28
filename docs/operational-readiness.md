# Operasional dan Observability

Dokumen ini mencatat apa yang disediakan aplikasi dan langkah yang tetap harus
dilakukan operator sebelum menerima pembayaran produksi. Aplikasi tidak
menganggap integrasi vendor eksternal telah aktif hanya karena log sudah
terstruktur.

## Dashboard operasional

Admin dapat membuka `/admin/operations` melalui menu **Operasional**. Halaman
menampilkan ping database/Redis, jumlah job AI pending dan processing, job
processing yang tidak berubah lebih dari 20 menit, kegagalan 24 jam, dan p50/p95
durasi job AI completed dalam 24 jam terakhir. Perhitungan latensi memakai
maksimal 5.000 job terbaru.

Jumlah antrean di halaman ini berasal dari state durable `ai_jobs`, bukan jumlah
item aktual di broker Redis. Redis ditampilkan terpisah sebagai pemeriksaan
konektivitas. Request HTTP dan worker menulis event terstruktur ke stdout/stderr;
request menerima `x-request-id` dan log hanya memakai nama route, bukan URL,
query string, body, atau token webhook.

Belum ada SDK Sentry/error-tracking vendor yang dikonfigurasi di repository.
Deployment perlu mengirim log JSON aplikasi ke platform log/error tracking yang
dipilih dan memasang alert untuk `http.request.failed`, `ai.job.failed`,
`ai.job.recovery_failed`, `payment.webhook.processing_failed`, dan
`payment.reconciliation.partial_failure`.

## Timeout dan pemulihan queue AI

- `AI_QUEUE_RESULT_WAIT_TIMEOUT_MS` mengatur batas pemanggil JSON AI (contoh di
  `.env.example`: 22 menit). Nilai ini berbeda dari timeout tiap percobaan
  provider/job.
- Jika pemanggil berhenti menunggu sementara job masih pending/processing,
  transaksi kredit masuk status `refund_pending`; saldo baru direfund setelah
  seluruh child AI job yang terhubung berstatus terminal.
- Worker recovery terjadwal setiap 10 menit. Job AI pending/processing yang
  tidak diperbarui lebih dari 20 menit akan dicoba dispatch ulang. Klaim row
  atomik mencegah dua worker menjalankan cache miss yang sama bersamaan.
- Pantau counter stale dan recovery di `/admin/operations` dan event worker.
  Pastikan worker menjalankan antrean `ai,exam-generation,reports,audit,maintenance`.

## Audit payment dan tindakan admin

`audit_logs` menerima event penting secara sinkron melalui `recordCritical`;
metadata dibatasi dan key sensitif seperti token, API key, payload/body, email,
nomor telepon, URL pembayaran, IP, dan user-agent dihilangkan. Settlement
Mayar dan penambahan kredit top-up menulis audit dalam transaksi database yang
sama.

Event yang dicatat mencakup penerimaan/hasil webhook, invoice settlement,
rekonsiliasi, serta create/update/delete paket, perubahan harga dan entitlement,
perubahan/hapus pengguna, konfigurasi AI/OAuth, sekolah, tahun ajaran, preset
kurikulum, dan review fraud. Webhook tidak menyimpan body provider mentah.

Saat ini belum ada endpoint admin untuk refund manual atau penyesuaian saldo.
Jika alur tersebut ditambahkan, audit harus ditulis dalam transaksi yang sama
dengan mutasi ledger; jangan menambah operasi saldo langsung tanpa pembatasan
otorisasi dan idempotensi.

## Rekonsiliasi pembayaran

Job `maintenance-reconcile-mayar-payments` berjalan setiap hari pukul 03:45
Asia/Jakarta pada scheduler Redis. Setiap run memeriksa maksimal 100 invoice
Mayar pending yang lebih lama dari 10 menit. Settlement tetap mensyaratkan
verifikasi status dan nominal ke Mayar; run dan setiap settlement dicatat tanpa
menyimpan payload webhook. Bila indikator batas batch tercapai, sisa invoice
akan mendapat giliran pada run berikutnya. Halaman operasional menunjukkan hasil
run terakhir dan jumlah invoice yang masih pending/gagal.

Sebelum produksi, isi secret webhook di deployment dan lakukan verifikasi
end-to-end di staging dengan invoice nominal kecil. Pantau callback, audit
`payment.webhook.*`, satu ledger top-up, dan hasil run rekonsiliasi.

## Backup dan restore drill

Repository ini belum mengonfigurasi penyedia backup database atau menjalankan
restore drill otomatis. Sebelum pilot berbayar, operator harus mengaktifkan
backup terenkripsi di provider Postgres dan menguji restore berkala ke database
isolasi baru (jangan pernah memakai target produksi):

1. Pilih backup terbaru dan catat waktu backup serta target RPO/RTO.
2. Restore ke instance/database staging kosong dengan kredensial terpisah.
3. Jalankan pemeriksaan status migrasi dan health check pada deployment staging
   yang menunjuk hanya ke database hasil restore.
4. Cocokkan jumlah row agregat untuk pengguna, paket, invoice, ledger kredit,
   dan audit log; jangan mengekspor PII ke laporan drill.
5. Catat durasi, hasil pemeriksaan, selisih terhadap RPO/RTO, dan penanggung
   jawab yang menyetujui hasilnya.

Jadwalkan drill minimal per kuartal dan setelah perubahan besar pada skema atau
provider backup. Backup/restore provider, retensi, alert kegagalan backup, dan
sign-off tetap merupakan konfigurasi operasional di luar aplikasi.
