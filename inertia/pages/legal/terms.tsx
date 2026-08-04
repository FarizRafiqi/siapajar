import { Head, Link } from '@inertiajs/react'

export default function Terms() {
  return (
    <>
      <Head title="Syarat dan Ketentuan — SiapAjar">
        <meta name="description" content="Syarat dan ketentuan penggunaan layanan SiapAjar." />
      </Head>
      <main className="min-h-screen bg-neutral-50 px-4 py-16 dark:bg-neutral-950">
        <article className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
          <Link href="/" className="text-sm text-emerald-600">
            ← Kembali ke SiapAjar
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">
            Syarat dan Ketentuan
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Terakhir diperbarui: 4 Agustus 2026</p>

          <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            <ol className="list-decimal space-y-6 pl-6 marker:font-semibold marker:text-emerald-600">
              <li>
                <h2>Penggunaan layanan</h2>
                <p>
                  SiapAjar membantu guru menyusun administrasi pembelajaran. Anda bertanggung jawab
                  atas kebenaran data, peninjauan isi dokumen, serta kesesuaian dokumen dengan
                  kebijakan sekolah dan regulasi yang berlaku.
                </p>
              </li>
              <li>
                <h2>Konten AI</h2>
                <p>
                  Hasil AI adalah draft dan dapat mengandung kesalahan. Guru wajib meninjau,
                  mengedit, dan menyetujui dokumen sebelum digunakan atau dibagikan.
                </p>
              </li>
              <li>
                <h2>Akun dan data siswa</h2>
                <p>
                  Jaga kerahasiaan kredensial. Masukkan data siswa hanya jika Anda memiliki
                  kewenangan yang sesuai dari sekolah atau lembaga.
                </p>
              </li>
              <li>
                <h2>Batasan layanan</h2>
                <p>
                  Fitur, kuota, export, dan riwayat dapat berbeda sesuai paket. Integrasi yang belum
                  tersedia tidak boleh dianggap sebagai layanan aktif.
                </p>
              </li>
              <li>
                <h2>Perubahan layanan</h2>
                <p>
                  Kami dapat memperbarui fitur dan ketentuan dengan memberikan tanggal pembaruan
                  yang jelas.
                </p>
              </li>
            </ol>
          </div>
        </article>
      </main>
    </>
  )
}
