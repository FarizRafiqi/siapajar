import { Head, Link } from '@inertiajs/react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  FileQuestion,
  Calendar,
  CalendarDays,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { cn } from '~/lib/utils'

interface Stats {
  classes: number
  students: number
  teachingModules: number
  exams: number
  annualPlans: number
  semesterPlans: number
}

interface RecentItem {
  id: number
  title: string
  subject?: string
  type?: string
  status: string
  created_at: string
}

interface AdminStats {
  users: number
  guru: number
  admin: number
}

interface DashboardProps {
  readonly role: string
  readonly stats: Stats
  readonly adminStats: AdminStats | null
  readonly recentTeachingModules: RecentItem[]
  readonly recentExams: RecentItem[]
}

const statCards = [
  { key: 'classes', label: 'Kelas', icon: Users, color: 'emerald', href: '/classes' },
  { key: 'students', label: 'Siswa', icon: Users, color: 'blue', href: '/classes' },
  { key: 'teachingModules', label: 'Modul Ajar', icon: BookOpen, color: 'purple', href: '/teaching-modules' },
  { key: 'exams', label: 'Bank Soal', icon: FileQuestion, color: 'orange', href: '/exams' },
  { key: 'annualPlans', label: 'Protah', icon: Calendar, color: 'pink', href: '/annual-plans' },
  { key: 'semesterPlans', label: 'Promes', icon: CalendarDays, color: 'cyan', href: '/semester-plans' },
]

const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400', text: 'text-blue-600 dark:text-blue-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400', text: 'text-purple-600 dark:text-purple-400' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', icon: 'text-orange-600 dark:text-orange-400', text: 'text-orange-600 dark:text-orange-400' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', icon: 'text-pink-600 dark:text-pink-400', text: 'text-pink-600 dark:text-pink-400' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', icon: 'text-cyan-600 dark:text-cyan-400', text: 'text-cyan-600 dark:text-cyan-400' },
}

export default function Dashboard({ role, stats, adminStats, recentTeachingModules, recentExams }: DashboardProps) {
  const isAdmin = role === 'admin'

  return (
    <DashboardWrapper title="Dashboard">
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isAdmin ? 'Admin Dashboard' : 'Selamat Datang!'}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {isAdmin ? 'Kelola sistem SiapAjar' : 'Kelola administrasi sekolah Anda dengan mudah'}
          </p>
        </div>

        {/* Admin Stats */}
        {isAdmin && adminStats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Users</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{adminStats.users}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/30">
                    <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Guru</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{adminStats.guru}</p>
                  </div>
                  <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Admin</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{adminStats.admin}</p>
                  </div>
                  <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/30">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stat Cards - Guru only */}
        {!isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, index) => {
            const colors = colorMap[card.color]
            const value = stats[card.key as keyof Stats]
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={card.href}
                  className="block rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {card.label}
                      </p>
                      <p className={cn('text-3xl font-bold', colors.text)}>
                        {value}
                      </p>
                    </div>
                    <div className={cn('rounded-xl p-3', colors.bg)}>
                      <card.icon className={cn('h-6 w-6', colors.icon)} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
        )}

        {/* Quick Actions - Guru only */}
        {!isAdmin && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/classes"
              className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-neutral-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20"
            >
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Buat Kelas</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Tambah kelas baru</p>
              </div>
            </Link>

            <Link
              href="/teaching-modules"
              className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-all hover:border-purple-300 hover:bg-purple-50 dark:border-neutral-700 dark:hover:border-purple-600 dark:hover:bg-purple-900/20"
            >
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Modul Ajar</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Generate dengan AI</p>
              </div>
            </Link>

            <Link
              href="/exams"
              className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-all hover:border-orange-300 hover:bg-orange-50 dark:border-neutral-700 dark:hover:border-orange-600 dark:hover:bg-orange-900/20"
            >
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                <FileQuestion className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Buat Soal</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">PTS/PAS dengan AI</p>
              </div>
            </Link>

            <Link
              href="/annual-plans"
              className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-all hover:border-pink-300 hover:bg-pink-50 dark:border-neutral-700 dark:hover:border-pink-600 dark:hover:bg-pink-900/20"
            >
              <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-900/30">
                <Calendar className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Program Tahunan</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Rencana setahun</p>
              </div>
            </Link>
          </div>
        </div>
        )}

        {/* Recent Items - Guru only */}
        {!isAdmin && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Teaching Modules */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Modul Ajar Terbaru
              </h3>
              <Link
                href="/teaching-modules"
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentTeachingModules.length === 0 ? (
              <p className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                Belum ada modul ajar
              </p>
            ) : (
              <div className="space-y-3">
                {recentTeachingModules.map((item) => (
                  <Link
                    key={item.id}
                    href={`/teaching-modules/${item.id}`}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                  >
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.subject}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      )}
                    >
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Exams */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Soal Terbaru
              </h3>
              <Link
                href="/exams"
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentExams.length === 0 ? (
              <p className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                Belum ada soal
              </p>
            ) : (
              <div className="space-y-3">
                {recentExams.map((item) => (
                  <Link
                    key={item.id}
                    href={`/exams/${item.id}`}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                  >
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.type}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      )}
                    >
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </DashboardWrapper>
  )
}
