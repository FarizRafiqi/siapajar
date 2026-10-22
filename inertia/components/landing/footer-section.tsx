import { Link } from '@inertiajs/react'
import { Heart, Camera, MessageCircle, Music2 } from 'lucide-react'

export function FooterSection() {
  return (
    <footer className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="SiapAjar Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-black tracking-tight text-white">SiapAjar</span>
          </div>
          <p className="text-xs text-neutral-400 font-medium max-w-sm leading-relaxed">
            Platform generator dokumen pembelajaran dan administrasi guru otomatis berbasis
            Kurikulum Merdeka. Dibuat dengan dedikasi untuk memajukan pendidikan Indonesia.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" aria-hidden="true" />
            <span>Made with love for Guru Indonesia</span>
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">
            Generator AI
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400 font-medium">
            <li>
              <Link href="/modul-ajar" className="hover:text-white transition-colors">
                Modul Ajar & RPP
              </Link>
            </li>
            <li>
              <Link href="/soal" className="hover:text-white transition-colors">
                Soal & Evaluasi HOTS
              </Link>
            </li>
            <li>
              <Link href="/lkpd" className="hover:text-white transition-colors">
                Lembar LKPD Tematik
              </Link>
            </li>
            <li>
              <Link href="/katrol" className="hover:text-white transition-colors">
                Katrol Nilai Smart
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">Navigasi</h4>
          <ul className="space-y-2 text-xs text-neutral-400 font-medium">
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Masuk ke Akun
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white transition-colors">
                Daftar Akun Baru
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">
            Ikuti Kami
          </h4>
          <div className="flex flex-col gap-3 text-xs text-neutral-400 font-medium">
            <a
              href="/coming-soon"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 transition-colors group-hover:bg-emerald-900/40">
                <Camera className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>Instagram</span>
            </a>
            <a
              href="/coming-soon"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 transition-colors group-hover:bg-emerald-900/40">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>WhatsApp</span>
            </a>
            <a
              href="/coming-soon"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 transition-colors group-hover:bg-emerald-900/40">
                <Music2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-medium">
        <p>© {new Date().getFullYear()} SiapAjar. Hak Cipta Dilindungi.</p>
        <p>Membantu guru Indonesia lebih siap mengajar dan siap administrasi 🇮🇩</p>
      </div>
    </footer>
  )
}
