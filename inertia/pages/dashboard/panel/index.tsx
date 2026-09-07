import { Head, Link } from '@inertiajs/react'
import {
  ArrowRight,
  Award,
  Calendar,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileQuestion,
  FileSpreadsheet,
  LayoutDashboard,
  Presentation,
  Route,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { cn } from '~/lib/utils'

interface PanelStats {
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

interface PanelProps {
  readonly educationLevel: 'tk' | 'sd' | null
  readonly stats: PanelStats
}

interface PanelItem {
  label: string
  description: string
  href: string
  icon: LucideIcon
  count?: number
}

interface PanelSection {
  title: string
  description: string
  icon: LucideIcon
  accent: string
  iconStyle: string
  items: PanelItem[]
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  className,
}: {
  label: string
  value: number
  description: string
  icon: LucideIcon
  className: string
}) {
  return (
    <div className="card-kawaii flex items-center gap-4 p-4">
      <div
        className={cn(
          'rounded-2xl border-2 border-black p-3 shadow-[2px_2px_0px_#000000]',
          className
        )}
      >
        <Icon className="h-5 w-5 text-neutral-950" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{label}</p>
        <p className="text-2xl font-black text-neutral-950 dark:text-white">{value}</p>
        <p className="truncate text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </div>
  )
}

function PanelSectionCard({ section }: { section: PanelSection }) {
  const SectionIcon = section.icon

  return (
    <section className="card-kawaii overflow-hidden p-0">
      <div className={cn('border-b-2 border-black/10 p-5 dark:border-white/10', section.accent)}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'rounded-2xl border-2 border-black p-3 shadow-[2px_2px_0px_#000000]',
              section.iconStyle
            )}
          >
            <SectionIcon className="h-5 w-5 text-neutral-950" />
          </div>
          <div>
            <h2 className="text-base font-black text-neutral-950 dark:text-white">
              {section.title}
            </h2>
            <p className="mt-1 text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-200">
              {section.description}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {section.items.map((item) => {
          const ItemIcon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            >
              <ItemIcon className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-900 dark:text-white">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {item.description}
                </span>
              </span>
              {item.count !== undefined && (
                <span className="shrink-0 whitespace-nowrap rounded-full border border-neutral-300 bg-white px-2 py-1 text-[11px] font-bold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  {item.count} data
                </span>
              )}
              <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-300" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function StructuredPanel({ educationLevel, stats }: PanelProps) {
  const isTk = educationLevel === 'tk'
  const documentCount = isTk
    ? stats.weeklyLessonPlans +
      stats.dailyLessonPlans +
      stats.annualPlans +
      stats.semesterPlans +
      stats.lkpds +
      stats.mediaModules
    : stats.teachingModules +
      stats.annualPlans +
      stats.semesterPlans +
      stats.lkpds +
      stats.mediaModules
  const assessmentCount = isTk ? stats.paudAssessments + stats.exams : stats.exams

  const sections: PanelSection[] = isTk
    ? [
        {
          title: 'Kurikulum & Data',
          description: 'Susun acuan pembelajaran dan kelola data kelompok secara rapi.',
          icon: Route,
          accent: 'bg-emerald-100 dark:bg-emerald-950/50',
          iconStyle: 'bg-emerald-300',
          items: [
            {
              label: 'CP, TP & ATP Fase Fondasi',
              description: 'Acuan capaian, tujuan, alur, dan indikator pembelajaran.',
              href: '/panel/curriculum',
              icon: Route,
            },
            {
              label: 'Kelompok & Siswa',
              description: 'Kelola kelompok, data anak, dan detail peserta didik.',
              href: '/panel/classes',
              icon: Users,
              count: stats.classes,
            },
            {
              label: 'Glosarium Kurikulum',
              description: 'Cari istilah PAUD dan panduan penerapannya.',
              href: '/panel/glossary',
              icon: BookOpen,
            },
          ],
        },
        {
          title: 'Perencanaan',
          description: 'Bangun rencana mingguan, harian, tahunan, dan semester.',
          icon: CalendarRange,
          accent: 'bg-sky-100 dark:bg-sky-950/50',
          iconStyle: 'bg-sky-300',
          items: [
            {
              label: 'Modul Ajar (RPPM/RPM)',
              description: 'Rencana mingguan berbasis bermain dan konteks anak.',
              href: '/panel/rppm',
              icon: CalendarRange,
              count: stats.weeklyLessonPlans,
            },
            {
              label: 'RPPH',
              description: 'Rencana kegiatan harian yang siap disesuaikan.',
              href: '/panel/rpph',
              icon: CalendarRange,
              count: stats.dailyLessonPlans,
            },
            {
              label: 'Program Tahunan',
              description: 'Atur distribusi tema dan kegiatan sepanjang tahun.',
              href: '/panel/annual-plans',
              icon: Calendar,
              count: stats.annualPlans,
            },
            {
              label: 'Program Semester',
              description: 'Turunkan rencana tahunan menjadi target per semester.',
              href: '/panel/semester-plans',
              icon: CalendarRange,
              count: stats.semesterPlans,
            },
          ],
        },
        {
          title: 'Bahan Ajar',
          description: 'Siapkan aktivitas anak, media visual, dan loose parts.',
          icon: FileSpreadsheet,
          accent: 'bg-violet-100 dark:bg-violet-950/50',
          iconStyle: 'bg-violet-300',
          items: [
            {
              label: 'LKPD Anak',
              description: 'Lembar aktivitas menebalkan, mencocokkan, dan mewarnai.',
              href: '/panel/lkpd',
              icon: FileSpreadsheet,
              count: stats.lkpds,
            },
            {
              label: 'Media Ajar & Loose Parts',
              description: 'Outline slide dan ide media pembelajaran kontekstual.',
              href: '/panel/media-modules',
              icon: Presentation,
              count: stats.mediaModules,
            },
          ],
        },
        {
          title: 'Asesmen & Laporan',
          description: 'Dokumentasikan perkembangan anak dan hasil belajar.',
          icon: ClipboardCheck,
          accent: 'bg-amber-100 dark:bg-amber-950/50',
          iconStyle: 'bg-amber-300',
          items: [
            {
              label: 'Soal Bergambar',
              description: 'Aktivitas evaluasi visual yang ramah anak.',
              href: '/panel/exams',
              icon: FileQuestion,
              count: stats.exams,
            },
            {
              label: 'Asesmen Harian PAUD',
              description: 'Ceklis, catatan anekdot, hasil karya, dan foto berseri.',
              href: '/panel/paud-assessments',
              icon: ClipboardList,
              count: stats.paudAssessments,
            },
            {
              label: 'Rapor Perkembangan',
              description: 'Susun narasi perkembangan yang personal dan apresiatif.',
              href: '/panel/report-cards',
              icon: Award,
            },
          ],
        },
        {
          title: 'Refleksi & Projek',
          description: 'Catat praktik guru dan rancang projek kokurikuler.',
          icon: ClipboardList,
          accent: 'bg-rose-100 dark:bg-rose-950/50',
          iconStyle: 'bg-rose-300',
          items: [
            {
              label: 'Jurnal Harian PAUD',
              description: 'Refleksi pembelajaran dan tindak lanjut kelas.',
              href: '/panel/jurnal',
              icon: ClipboardList,
            },
            {
              label: 'Kokurikuler / P5',
              description: 'Rancang projek kontekstual sesuai profil lulusan.',
              href: '/panel/kokurikuler',
              icon: Presentation,
            },
            {
              label: 'Katrol Nilai Transparan',
              description: 'Analisis nilai dan rencana pendampingan yang transparan.',
              href: '/panel/katrol',
              icon: ClipboardCheck,
            },
          ],
        },
      ]
    : [
        {
          title: 'Kurikulum & Data',
          description: 'Hubungkan acuan kurikulum dengan data kelas dan mapel.',
          icon: Route,
          accent: 'bg-emerald-100 dark:bg-emerald-950/50',
          iconStyle: 'bg-emerald-300',
          items: [
            {
              label: 'CP, TP & ATP',
              description: 'Kelola capaian, tujuan, alur, dan indikator pembelajaran.',
              href: '/panel/curriculum',
              icon: Route,
            },
            {
              label: 'Kelas & Siswa',
              description: 'Kelola rombel, siswa, dan data peserta didik.',
              href: '/panel/classes',
              icon: Users,
              count: stats.classes,
            },
            {
              label: 'Mata Pelajaran',
              description: 'Atur mata pelajaran yang digunakan dalam dokumen.',
              href: '/panel/subjects',
              icon: BookOpen,
            },
            {
              label: 'Glosarium Kurikulum',
              description: 'Cari istilah dan panduan Kurikulum Merdeka.',
              href: '/panel/glossary',
              icon: BookOpen,
            },
          ],
        },
        {
          title: 'Perencanaan',
          description: 'Kelola dokumen perencanaan secara detail dan berurutan.',
          icon: CalendarRange,
          accent: 'bg-sky-100 dark:bg-sky-950/50',
          iconStyle: 'bg-sky-300',
          items: [
            {
              label: 'Modul Ajar Terstruktur',
              description: 'Edit komponen modul, kegiatan, asesmen, dan sumber belajar.',
              href: '/panel/teaching-modules',
              icon: BookOpen,
              count: stats.teachingModules,
            },
            {
              label: 'Program Tahunan',
              description: 'Rancang distribusi pembelajaran selama satu tahun.',
              href: '/panel/annual-plans',
              icon: CalendarRange,
              count: stats.annualPlans,
            },
            {
              label: 'Program Semester',
              description: 'Atur target dan kegiatan per semester.',
              href: '/panel/semester-plans',
              icon: CalendarRange,
              count: stats.semesterPlans,
            },
          ],
        },
        {
          title: 'Bahan Ajar',
          description: 'Kembangkan bahan pendukung yang siap digunakan di kelas.',
          icon: FileSpreadsheet,
          accent: 'bg-violet-100 dark:bg-violet-950/50',
          iconStyle: 'bg-violet-300',
          items: [
            {
              label: 'LKPD & Lembar Aktivitas',
              description: 'Buat aktivitas siswa berdasarkan topik dan kelas.',
              href: '/panel/lkpd',
              icon: FileSpreadsheet,
              count: stats.lkpds,
            },
            {
              label: 'Media Ajar',
              description: 'Kelola outline slide dan media pembelajaran visual.',
              href: '/panel/media-modules',
              icon: Presentation,
              count: stats.mediaModules,
            },
          ],
        },
        {
          title: 'Asesmen & Laporan',
          description: 'Buat instrumen, kelola nilai, dan siapkan laporan.',
          icon: ClipboardCheck,
          accent: 'bg-amber-100 dark:bg-amber-950/50',
          iconStyle: 'bg-amber-300',
          items: [
            {
              label: 'Bank Soal',
              description: 'Kelola soal, kisi-kisi, rubrik, dan hasil evaluasi.',
              href: '/panel/exams',
              icon: FileQuestion,
              count: stats.exams,
            },
            {
              label: 'Penilaian',
              description: 'Catat nilai dan pantau ketercapaian belajar.',
              href: '/panel/assessments',
              icon: ClipboardCheck,
            },
            {
              label: 'Rapor Perkembangan',
              description: 'Susun narasi capaian yang personal dan apresiatif.',
              href: '/panel/report-cards',
              icon: Award,
            },
          ],
        },
        {
          title: 'Refleksi & Projek',
          description: 'Lengkapi siklus pembelajaran dengan refleksi dan projek.',
          icon: ClipboardList,
          accent: 'bg-rose-100 dark:bg-rose-950/50',
          iconStyle: 'bg-rose-300',
          items: [
            {
              label: 'Jurnal Mengajar',
              description: 'Catat dinamika kelas, refleksi, dan tindak lanjut.',
              href: '/panel/jurnal',
              icon: ClipboardList,
            },
            {
              label: 'Kokurikuler (P5)',
              description: 'Rancang projek kontekstual dan rubriknya.',
              href: '/panel/kokurikuler',
              icon: Presentation,
            },
            {
              label: 'Katrol Nilai Transparan',
              description: 'Analisis nilai dan rencana remedial secara transparan.',
              href: '/panel/katrol',
              icon: ClipboardCheck,
            },
          ],
        },
      ]

  return (
    <DashboardWrapper
      title="Panel Lengkap"
      breadcrumbs={[{ label: 'Dashboard', href: '/panel/dashboard' }, { label: 'Panel Lengkap' }]}
    >
      <Head title="Panel Lengkap - SiapAjar" />

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border-2 border-black bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-700 p-6 text-white shadow-[4px_4px_0px_#000000] sm:p-8">
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-3xl space-y-3">
              <span className="badge-kawaii-emerald !border-black !bg-emerald-300 !text-neutral-950">
                <LayoutDashboard className="h-3.5 w-3.5" /> Workspace terstruktur
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Kelola pembelajaran dari acuan sampai laporan
              </h1>
              <p className="text-sm font-medium leading-relaxed text-emerald-50">
                Gunakan Panel Lengkap ketika Anda ingin meninjau, mengedit, dan menghubungkan
                dokumen pembelajaran secara lebih leluasa.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="btn-kawaii-secondary shrink-0 !border-black !bg-white !text-emerald-900"
            >
              <BookOpen className="h-4 w-4" />
              Kembali ke Tool Instan
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label={isTk ? 'Kelompok' : 'Kelas'}
            value={stats.classes}
            description="Data rombel aktif"
            icon={Users}
            className="bg-emerald-300"
          />
          <SummaryCard
            label={isTk ? 'Anak Didik' : 'Siswa'}
            value={stats.students}
            description="Peserta didik terdaftar"
            icon={Users}
            className="bg-sky-300"
          />
          <SummaryCard
            label="Dokumen Ajar"
            value={documentCount}
            description="Modul, rencana, dan bahan ajar"
            icon={FileSpreadsheet}
            className="bg-violet-300"
          />
          <SummaryCard
            label="Asesmen"
            value={assessmentCount}
            description="Instrumen dan catatan penilaian"
            icon={ClipboardCheck}
            className="bg-amber-300"
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-neutral-950 dark:text-white">
              Semua ruang kerja
            </h2>
            <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Pilih area yang ingin Anda rapikan atau lanjutkan hari ini.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 sm:flex">
            <CheckCircle2 className="h-4 w-4" /> Data tersimpan per akun
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sections.map((section) => (
            <PanelSectionCard key={section.title} section={section} />
          ))}
        </div>

        <section className="card-kawaii flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border-2 border-black bg-emerald-200 p-3 shadow-[2px_2px_0px_#000000]">
              <Settings className="h-5 w-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950 dark:text-white">
                Butuh mulai cepat?
              </h2>
              <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Kembali ke Tool Instan untuk membuat dokumen tanpa membuka seluruh pengaturan.
              </p>
            </div>
          </div>
          <Link href="/dashboard" className="btn-kawaii-primary shrink-0">
            <BookOpen className="h-4 w-4" />
            Buka Tool Instan
          </Link>
        </section>
      </div>
    </DashboardWrapper>
  )
}
