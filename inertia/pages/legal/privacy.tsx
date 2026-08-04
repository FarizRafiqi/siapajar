import { Head, Link } from '@inertiajs/react'

export default function Privacy() {
  return (
    <>
      <Head title="Kebijakan Privasi — SiapAjar">
        <meta
          name="description"
          content="Kebijakan privasi SiapAjar untuk data akun, sekolah, siswa, dokumen, dan asesmen."
        />
      </Head>
      <main className="min-h-screen bg-neutral-50 px-4 py-16 dark:bg-neutral-950">
        <article className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
          <Link href="/" className="text-sm text-emerald-600">
            ← Kembali ke SiapAjar
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">
            Kebijakan Privasi
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Terakhir diperbarui: 4 Agustus 2026</p>

          <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            <ol className="list-decimal space-y-6 pl-6 marker:font-semibold marker:text-emerald-600">
              <li>
                <h2>Data yang kami simpan</h2>
                <p>
                  SiapAjar menyimpan data akun, profil sekolah, kelas, siswa, dokumen pembelajaran,
                  asesmen, dan narasi rapor yang Anda masukkan untuk menyediakan layanan.
                </p>
              </li>
              <li>
                <h2>Penggunaan data</h2>
                <p>
                  Data digunakan untuk menampilkan, menyimpan, mengekspor, dan memproses fitur yang
                  Anda minta. Draft AI tidak menggantikan keputusan guru dan tidak dipublikasikan
                  sebagai data pengguna lain.
                </p>
              </li>
              <li>
                <h2>Keamanan dan akses</h2>
                <p>
                  Akses data dibatasi berdasarkan kepemilikan akun, sekolah, dan peran. Jangan
                  memasukkan data sensitif yang tidak diperlukan. Anda dapat meminta koreksi atau
                  penghapusan data melalui pengelola layanan.
                </p>
              </li>
              <li>
                <h2>Pihak ketiga</h2>
                <p>
                  Fitur AI dapat meneruskan input yang diperlukan ke penyedia AI yang dikonfigurasi
                  oleh layanan. Integrasi API pemerintah dan WhatsApp belum aktif dalam beta.
                </p>
              </li>
              <li>
                <h2>Kontak</h2>
                <p>
                  Untuk pertanyaan privasi, hubungi pengelola SiapAjar melalui kanal dukungan resmi.
                </p>
              </li>
            </ol>
          </div>
        </article>
      </main>
    </>
  )
}
