import { Head, Link } from '@inertiajs/react'
import { CircleAlert } from 'lucide-react'

export default function FreeBenefitRestricted() {
  return (
    <>
      <Head title="Benefit Gratis Ditinjau — SiapAjar" />
      <main className="flex min-h-screen items-center justify-center bg-[#fbfbee] p-4">
        <section className="w-full max-w-lg rounded-3xl border-2 border-black bg-white p-8 text-center shadow-[6px_6px_0px_#000000]">
          <CircleAlert className="mx-auto h-12 w-12 text-amber-600" />
          <h1 className="mt-4 text-2xl font-bold text-neutral-950">
            Benefit gratis perlu ditinjau
          </h1>
          <p className="mt-2 text-sm text-neutral-800">
            Sistem mendeteksi benefit gratis pernah digunakan dari perangkat atau jaringan ini. Akun
            tetap dapat menggunakan paket berbayar; hubungi dukungan jika Anda perlu pemeriksaan
            manual.
          </p>
          <Link href="/my-package" className="btn-kawaii-primary mt-6 inline-flex">
            Lihat Paket Saya
          </Link>
        </section>
      </main>
    </>
  )
}
