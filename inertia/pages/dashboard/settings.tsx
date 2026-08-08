import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, useForm } from '@inertiajs/react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save,
  User,
  School,
  GraduationCap,
  Check,
  Compass,
  AlertTriangle,
  X,
  Camera,
} from 'lucide-react'
import { cn } from '~/lib/utils'

function getLevelLabel(level: string | null): string {
  if (level === 'tk') return 'TK / PAUD'
  if (level === 'sd') return 'SD'
  return '-'
}

interface UserProps {
  id: number
  fullName: string
  email: string
  initials: string
  schoolName: string | null
  educationLevel: 'tk' | 'sd' | null
  role: string
  avatarUrl: string | null
}

interface SettingsProps {
  readonly user: UserProps
  readonly package: { displayName: string; priceMonthly: number } | null
  readonly subscription: { startsAt: string; endsAt: string | null } | null
}

export default function Settings({ user, package: packageData, subscription }: SettingsProps) {
  const isAdmin = user.role === 'admin'
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { data, setData, put, processing, errors } = useForm({
    fullName: user.fullName || '',
    email: user.email || '',
    schoolName: user.schoolName || '',
    educationLevel: user.educationLevel || 'sd',
    avatar: null as File | null,
  })

  const educationLevelChanged = data.educationLevel !== user.educationLevel

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setData('avatar', file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (educationLevelChanged) {
      setShowConfirmModal(true)
    } else {
      put('/settings', {
        forceFormData: true,
      })
    }
  }

  const handleConfirmChange = () => {
    setShowConfirmModal(false)
    put('/settings', {
      forceFormData: true,
    })
  }

  const targetLevelLabel = getLevelLabel(data.educationLevel)
  const currentLevelLabel = getLevelLabel(user.educationLevel)
  const displayAvatar = avatarPreview ?? user.avatarUrl

  return (
    <DashboardWrapper title="Pengaturan">
      <Head title="Pengaturan — SiapAjar" />

      <div className="max-w-4xl mx-auto space-y-6">
        {!isAdmin && packageData && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Paket aktif
              </p>
              <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
                {packageData.displayName}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Berlaku sampai{' '}
                {subscription?.endsAt
                  ? new Date(subscription.endsAt).toLocaleDateString('id-ID', { dateStyle: 'long' })
                  : 'tidak dibatasi'}
              </p>
            </div>
            <a
              href="/my-package"
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Lihat Paket Saya
            </a>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={cn('grid gap-6', !isAdmin && 'md:grid-cols-2')}>
            {/* User Profile Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <User className="h-5 w-5 text-neutral-500" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">Profil Pengguna</h3>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-neutral-500">
                        {user.initials}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:border-neutral-900"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Foto Profil
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    PNG, JPG, WebP. Maks 2MB.
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={data.fullName}
                    onChange={(e) => setData('fullName', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Kartu Sekolah & Jenjang — tidak relevan untuk admin */}
            {!isAdmin && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <School className="h-5 w-5 text-neutral-500" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    Instansi / Sekolah
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="schoolName"
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                    >
                      Nama Sekolah
                    </label>
                    <input
                      id="schoolName"
                      type="text"
                      value={data.schoolName}
                      onChange={(e) => setData('schoolName', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    />
                    {errors.schoolName && (
                      <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
                    )}
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Jenjang Sekolah
                    </span>
                    <div className="grid gap-3 grid-cols-2">
                      {/* TK/RA Card */}
                      <button
                        type="button"
                        onClick={() => setData('educationLevel', 'tk')}
                        className={cn(
                          'relative flex flex-col items-center p-4 rounded-lg border text-center transition-all duration-300',
                          data.educationLevel === 'tk'
                            ? 'border-emerald-600 bg-emerald-50/20 dark:border-emerald-500 dark:bg-emerald-950/10 ring-2 ring-emerald-500/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent'
                        )}
                      >
                        <Compass
                          className={cn(
                            'h-5 w-5 mb-1.5',
                            data.educationLevel === 'tk'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-neutral-400'
                          )}
                        />
                        <span className="text-sm font-medium text-neutral-950 dark:text-white">
                          RA & TK / PAUD
                        </span>
                        <span className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                          KMA 450/2024 & Kemendikdasmen
                        </span>
                        {data.educationLevel === 'tk' && (
                          <div className="absolute top-2 right-2 rounded-full bg-emerald-600 text-white p-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>

                      {/* SD Card */}
                      <button
                        type="button"
                        onClick={() => setData('educationLevel', 'sd')}
                        className={cn(
                          'relative flex flex-col items-center p-4 rounded-lg border text-center transition-all duration-300',
                          data.educationLevel === 'sd'
                            ? 'border-emerald-600 bg-emerald-50/20 dark:border-emerald-500 dark:bg-emerald-950/10 ring-2 ring-emerald-500/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent'
                        )}
                      >
                        <GraduationCap
                          className={cn(
                            'h-5 w-5 mb-1.5',
                            data.educationLevel === 'sd'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-neutral-400'
                          )}
                        />
                        <span className="text-sm font-medium text-neutral-950 dark:text-white">
                          SD / MI
                        </span>
                        <span className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                          Sekolah Dasar / Madrasah Ibtidaiyah
                        </span>
                        {data.educationLevel === 'sd' && (
                          <div className="absolute top-2 right-2 rounded-full bg-emerald-600 text-white p-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <Save className="h-4 w-4" />
              {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>

        {/* Konfirmasi ganti jenjang */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowConfirmModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Ubah Jenjang Sekolah?
                      </h3>
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                      Anda akan mengubah jenjang dari{' '}
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {currentLevelLabel}
                      </span>{' '}
                      ke{' '}
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {targetLevelLabel}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-2 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Yang berubah:</span> Menu navigasi akan
                    menyesuaikan dengan jenjang baru.
                  </p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Yang tetap:</span> Semua dokumen yang sudah dibuat
                    (Protah, Promes, RPPM, RPPH, Modul Ajar, dll.) tetap tersimpan dan bisa diakses.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmChange}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Ya, Ubah
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWrapper>
  )
}
