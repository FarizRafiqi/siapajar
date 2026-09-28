import { Head, Link } from '@inertiajs/react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  Users,
  BookOpen,
  FileQuestion,
  CalendarDays,
  ArrowRight,
  FileSpreadsheet,
  Presentation,
  TrendingUp,
  ClipboardList,
  ClipboardCheck,
  Compass,
  Award,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Building2,
  PackageCheck,
  BrainCircuit,
  CreditCard,
  Rocket,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { isPaudProfile } from '~/lib/education'

interface Stats {
  classes: number
  students: number
  teachingModules: number
  exams: number
  annualPlans: number
  semesterPlans: number
  weeklyLessonPlans: number
  dailyLessonPlans: number
  paudAssessments: number
  lkpds: number
  mediaModules: number
}

interface RecentItem {
  id: number
  title: string
  subject?: string
  theme?: string
  type?: string
  status: string
  created_at?: string
}

interface AdminStats {
  users: number
  guru: number
  admin: number
  lkpds: number
  mediaModules: number
  schools: number
  activePackages: number
  activeSubscriptions: number
  openFraudCases: number
}

interface DashboardProps {
  readonly role: string
  readonly educationLevel: string | null
  readonly institutionType?: string | null
  readonly stats: Stats
  readonly adminStats: AdminStats | null
  readonly recentTeachingModules: RecentItem[]
  readonly recentExams: RecentItem[]
  readonly recentLkpds?: RecentItem[]
  readonly recentMediaModules?: RecentItem[]
}

interface ExpressTool {
  title: string
  desc: string
  icon: LucideIcon
  href: string
  badge?: string
  accentColor: string
  iconColor: string
}

export default function Dashboard({
  role,
  educationLevel,
  institutionType = null,
  stats,
  adminStats,
  recentTeachingModules = [],
  recentExams = [],
  recentLkpds = [],
  recentMediaModules = [],
}: Readonly<DashboardProps>) {
  const isAdmin = role === 'admin'
  const isPaud = isPaudProfile(educationLevel, institutionType)

  if (isAdmin) {
    const adminMetrics = [
      {
        label: 'Total Pengguna',
        value: adminStats?.users ?? 0,
        href: '/admin/users',
        icon: Users,
        color: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200',
      },
      {
        label: 'Sekolah Terdaftar',
        value: adminStats?.schools ?? 0,
        href: '/admin/schools',
        icon: Building2,
        color: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200',
      },
      {
        label: 'Kasus Perlu Ditinjau',
        value: adminStats?.openFraudCases ?? 0,
        href: '/admin/fraud-cases',
        icon: ShieldAlert,
        color: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200',
      },
      {
        label: 'Subscription Aktif',
        value: adminStats?.activeSubscriptions ?? 0,
        href: '/admin/packages',
        icon: CreditCard,
        color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200',
      },
    ]
    const adminLinks = [
      {
        label: 'Kelola Pengguna',
        description: 'Atur role, sekolah, dan paket akun.',
        href: '/admin/users',
        icon: Users,
      },
      {
        label: 'Kelola Sekolah',
        description: 'Pantau sekolah dan anggota tertaut.',
        href: '/admin/schools',
        icon: Building2,
      },
      {
        label: 'Review Anti-Fraud',
        description: 'Tinjau sinyal penyalahgunaan benefit.',
        href: '/admin/fraud-cases',
        icon: ShieldAlert,
      },
      {
        label: 'Kelola Paket',
        description: 'Atur paket aktif dan arsip paket lama.',
        href: '/admin/packages',
        icon: PackageCheck,
      },
      {
        label: 'Konfigurasi AI',
        description: 'Atur provider, model, dan koneksi AI.',
        href: '/admin/ai-settings',
        icon: BrainCircuit,
      },
      {
        label: 'Preset Kurikulum',
        description: 'Kelola master referensi untuk guru.',
        href: '/admin/curriculum-presets',
        icon: BookOpen,
      },
    ]

    return (
      <DashboardWrapper title="Dashboard Admin SiapAjar">
        <Head title="Dashboard Admin - SiapAjar" />
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="relative overflow-hidden rounded-3xl border-2 border-black bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 p-6 text-white shadow-[4px_4px_0px_#000000] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-10 hidden rotate-12 text-white/10 sm:block"
            >
              <ShieldCheck className="h-56 w-56" strokeWidth={1.25} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-amber-300 px-3 py-1 text-xs font-bold text-neutral-950 shadow-[2px_2px_0px_#000000]">
                <ShieldCheck className="h-3.5 w-3.5" /> Pusat Operasional
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Dashboard Admin SiapAjar
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Pantau pengguna, sekolah, paket, keamanan akun, dan layanan AI dari satu tempat.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {adminMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <Link
                  key={metric.href}
                  href={metric.href}
                  className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                    <div className={`rounded-2xl p-3 ${metric.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="mt-4 inline-flex text-sm font-semibold text-emerald-700 group-hover:translate-x-0.5 dark:text-emerald-300">
                    Buka data <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              )
            })}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
                Akses Operasional
              </h2>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                Aksi utama yang relevan untuk pengelolaan platform.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {adminLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-500 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-emerald-950/20"
                  >
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-500 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
                  Ringkasan Aktivitas Platform
                </h2>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  Jumlah data lintas pengguna untuk pemantauan kapasitas platform.
                </p>
              </div>
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {adminStats?.activePackages ?? 0} paket aktif
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">Kelas</p>
                <p className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                  {stats?.classes ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">Siswa</p>
                <p className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                  {stats?.students ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">LKPD</p>
                <p className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                  {stats?.lkpds ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">Media Ajar</p>
                <p className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                  {stats?.mediaModules ?? 0}
                </p>
              </div>
            </div>
          </section>
        </div>
      </DashboardWrapper>
    )
  }

  // Supervision Checklist State calculation
  const hasModules = (stats?.teachingModules ?? 0) > 0 || (stats?.weeklyLessonPlans ?? 0) > 0
  const hasPlans = (stats?.annualPlans ?? 0) > 0 || (stats?.semesterPlans ?? 0) > 0
  const hasAssessments = (stats?.exams ?? 0) > 0 || (stats?.paudAssessments ?? 0) > 0
  const hasLkpds = (stats?.lkpds ?? 0) > 0

  const checklistItems = [
    {
      title: isPaud ? 'Modul Ajar / RPPM Mingguan' : 'Modul Ajar Pembelajaran',
      desc: isPaud
        ? 'Rencana kegiatan mingguan terstandar'
        : 'Perangkat ajar lengkap komponen inti',
      done: hasModules,
      href: '/modul-ajar',
    },
    {
      title: 'Distribusi Waktu Prota & Promes',
      desc: 'Alokasi pekan efektif & kalender akademik',
      done: hasPlans,
      href: '/prota-promes',
    },
    {
      title: isPaud ? 'Asesmen Perkembangan PAUD' : 'Bank Soal & Asesmen Sumatif / Formatif',
      desc: isPaud
        ? 'Ceklis, catatan anekdot, hasil karya, dan foto berseri'
        : 'Kisi-kisi, instrumen evaluasi & rubrik penilaian',
      done: isPaud ? (stats?.paudAssessments ?? 0) > 0 : hasAssessments,
      href: isPaud ? '/paud-assessments' : '/soal',
    },
    {
      title: isPaud ? 'Lembar Kerja Anak (LKPD)' : 'Lembar Kerja Peserta Didik (LKPD)',
      desc: 'Aktivitas pengayaan & stimulus bernalar',
      done: hasLkpds,
      href: '/lkpd',
    },
    {
      title: 'Jurnal Harian Mengajar & Refleksi Guru',
      desc: 'Notula dinamika kelas & tindak lanjut',
      done: true,
      href: '/jurnal',
    },
    {
      title: 'Modul Projek Kokurikuler (P5 / P2RA)',
      desc: 'Alur aksi kontekstual & pameran karya',
      done: true,
      href: '/kokurikuler',
    },
  ]

  const completedCount = checklistItems.filter((i) => i.done).length
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100)

  // 8 Tool-First Express Tools
  const expressTools: ExpressTool[] = [
    {
      title: isPaud ? 'Modul Ajar RPPM' : 'Modul Ajar AI',
      desc: 'Perangkat ajar lengkap 1-klik jadi',
      icon: BookOpen,
      href: '/modul-ajar',
      badge: 'Paling Populer',
      accentColor: 'from-emerald-500/15 to-emerald-500/5 hover:border-emerald-500/60',
      iconColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
    },
    {
      title: 'LKPD & Lembar Aktivitas',
      desc: 'Menebalkan, mewarnai & kognitif siap cetak',
      icon: FileSpreadsheet,
      href: '/lkpd',
      accentColor: 'from-purple-500/15 to-purple-500/5 hover:border-purple-500/60',
      iconColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300',
    },
    {
      title: 'Bank Soal & Kisi-Kisi',
      desc: 'PG, isian, uraian HOTS & rubrik penilaian',
      icon: FileQuestion,
      href: '/soal',
      accentColor: 'from-amber-500/15 to-amber-500/5 hover:border-amber-500/60',
      iconColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300',
    },
    {
      title: 'Prota & Promes',
      desc: 'Distribusi pekan efektif & alokasi JP',
      icon: CalendarDays,
      href: '/prota-promes',
      accentColor: 'from-blue-500/15 to-blue-500/5 hover:border-blue-500/60',
      iconColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Narasi Deskripsi Rapor',
      desc: 'Deskripsi capaian TP otomatis & apresiatif',
      icon: Award,
      href: '/rapor',
      accentColor: 'from-rose-500/15 to-rose-500/5 hover:border-rose-500/60',
      iconColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
    },
    isPaud
      ? {
          title: 'Asesmen Perkembangan PAUD',
          desc: 'Catat bukti perkembangan anak dan narasi observasi',
          icon: ClipboardCheck,
          href: '/paud-assessments',
          accentColor: 'from-cyan-500/15 to-cyan-500/5 hover:border-cyan-500/60',
          iconColor: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300',
        }
      : {
          title: 'Katrol Nilai Transparan',
          desc: 'Kalkulator normalisasi adil + justifikasi supervisi',
          icon: TrendingUp,
          href: '/katrol',
          accentColor: 'from-cyan-500/15 to-cyan-500/5 hover:border-cyan-500/60',
          iconColor: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300',
        },
    {
      title: 'Jurnal Harian Mengajar',
      desc: 'Dokumentasi kelas & catatan refleksi guru',
      icon: ClipboardList,
      href: '/jurnal',
      accentColor: 'from-indigo-500/15 to-indigo-500/5 hover:border-indigo-500/60',
      iconColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300',
    },
    {
      title: 'Modul Kokurikuler (P5)',
      desc: 'Alur tahapan projek, dimensi profil & rubrik',
      icon: Compass,
      href: '/kokurikuler',
      accentColor: 'from-teal-500/15 to-teal-500/5 hover:border-teal-500/60',
      iconColor: 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300',
    },
  ]

  return (
    <DashboardWrapper title="Dashboard SiapAjar">
      <Head title="Dashboard - SiapAjar" />

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome & Launchpad Hero */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-black bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 sm:p-10 text-white shadow-[4px_4px_0px_#000000]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-10 hidden rotate-12 text-white/15 sm:block"
          >
            <Rocket className="h-56 w-56" strokeWidth={1.25} />
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-300 text-neutral-950 border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000000]">
                <Zap className="w-3.5 h-3.5" /> Platform Administrasi Guru
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                {isAdmin ? 'Panel Kontrol Admin SiapAjar' : 'Mau Bikin Dokumen Apa Hari Ini?'}
              </h1>
              <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed font-medium">
                {isPaud
                  ? 'Pilih tool kilat di bawah untuk menyusun modul ajar, LKPD, asesmen perkembangan, atau jurnal hanya dalam hitungan detik.'
                  : 'Pilih tool kilat di bawah untuk menyusun modul ajar, LKPD, bank soal, atau katrol nilai hanya dalam hitungan detik.'}
              </p>
            </div>
          </div>
        </div>

        {/* Express Tools Launchpad Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Launchpad Tool Kilat (1-Klik Jadi)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Akses langsung ke seluruh generator cerdas tanpa konfigurasi rumit
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expressTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative p-5 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-black shadow-[4px_4px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000] transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] transition-transform group-hover:scale-105 duration-200',
                          tool.iconColor
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {tool.badge && (
                        <span className="badge-kawaii-emerald text-[10px]">{tool.badge}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 font-medium">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 flex items-center text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Buka Generator <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Supervision & Accreditation Readiness Checklist */}
        {!isAdmin && (
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000000] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-emerald-200 text-neutral-950 border-2 border-black shadow-[2px_2px_0px_#000000] rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white">
                    Checklist Kesiapan Supervisi & Akreditasi
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Pantau kelengkapan berkas administrasi ajar Anda untuk evaluasi berkala
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {progressPercent}% Lengkap
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold block">
                    {completedCount} dari {checklistItems.length} Komponen
                  </span>
                </div>
                <div className="w-24 h-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-black rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {checklistItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-white dark:hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000000] transition-all flex items-start gap-3 group"
                >
                  <div className="pt-0.5">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1 font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all mt-1" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
