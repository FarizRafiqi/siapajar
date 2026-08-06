import { Head, Link } from '@inertiajs/react'
import { Construction } from 'lucide-react'

export default function ComingSoon() {
  return (
    <>
      <Head title="Segera Hadir — SiapAjar" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-4 text-center dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        <Construction className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Halaman Ini Segera Hadir
        </h1>
        <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
          Kami masih menyiapkan halaman ini. Sementara itu, kembali ke beranda dulu ya.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </>
  )
}
