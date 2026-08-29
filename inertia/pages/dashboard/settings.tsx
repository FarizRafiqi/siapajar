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
  Sparkles,
  Zap,
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
    <DashboardWrapper title="Pengaturan Akun & Profil">
      <Head title="Pengaturan — SiapAjar" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span>Pengaturan Profil & Sekolah</span>
              <span className="p-1 rounded-lg bg-amber-300 text-neutral-950 border border-black text-xs shadow-[1px_1px_0px_#000000]">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
              Sesuaikan data pribadi, informasi instansi, dan preferensi jenjang kurikulum Anda.
            </p>
          </div>
        </div>

        {/* Active Package Banner */}
        {!isAdmin && packageData && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-black bg-[#047857] dark:bg-[#064e3b] p-5 sm:p-6 text-white shadow-[4px_4px_0px_#000000] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-300 text-neutral-950 border border-black text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_#000000]">
                <Zap className="w-3 h-3 fill-current" />
                <span>Paket Langganan Aktif</span>
              </div>
              <h3 className="text-xl font-black text-white">{packageData.displayName}</h3>
              <p className="text-xs text-emerald-200/90 font-medium">
                Masa berlaku:{' '}
                <strong className="text-white font-bold">
                  {subscription?.endsAt
                    ? new Date(subscription.endsAt).toLocaleDateString('id-ID', {
                        dateStyle: 'long',
                      })
                    : 'Tidak Dibatasi / Selamanya'}
                </strong>
              </p>
            </div>
            <a
              href="/my-package"
              className="relative z-10 rounded-2xl bg-amber-300 hover:bg-amber-400 text-neutral-950 border-2 border-black px-4 py-2.5 text-xs font-black transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            >
              Kelola Paket Saya
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={cn('grid gap-6', !isAdmin && 'md:grid-cols-2')}>
            {/* User Profile Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 space-y-5 shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center gap-3 border-b-2 border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-black text-emerald-800 dark:text-emerald-300">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-neutral-950 dark:text-white text-base">
                    Profil Pengguna
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">Identitas akun guru Anda</p>
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                <div className="relative">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-black bg-white dark:bg-neutral-800 shadow-[2px_2px_0px_#000000]">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950">
                        {user.initials}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-amber-300 text-neutral-950 shadow-[1px_1px_0px_#000000] hover:bg-amber-400 active:translate-y-0.5 cursor-pointer"
                    title="Ubah foto profil"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="text-xs font-black text-neutral-900 dark:text-white">
                    Foto Profil Guru
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                    Format PNG, JPG, WebP. Maksimal 2MB.
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
                    className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                  >
                    Nama Lengkap & Gelar
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={data.fullName}
                    onChange={(e) => setData('fullName', e.target.value)}
                    className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 font-bold shadow-xs transition-colors"
                  />
                  {errors.fullName && (
                    <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                  >
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 font-bold shadow-xs transition-colors"
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* School & Education Level Card */}
            {!isAdmin && (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 space-y-5 shadow-[4px_4px_0px_#000000]">
                <div className="flex items-center gap-3 border-b-2 border-neutral-100 dark:border-neutral-800 pb-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-black text-amber-800 dark:text-amber-300">
                    <School className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-neutral-950 dark:text-white text-base">
                      Instansi & Jenjang
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      Pengaturan kop & target modul ajar
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="schoolName"
                      className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5"
                    >
                      Nama Sekolah / Satuan PAUD
                    </label>
                    <input
                      id="schoolName"
                      type="text"
                      placeholder="contoh: TK Negeri Pembina 1"
                      value={data.schoolName}
                      onChange={(e) => setData('schoolName', e.target.value)}
                      className="w-full rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 font-bold shadow-xs transition-colors"
                    />
                    {errors.schoolName && (
                      <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.schoolName}</p>
                    )}
                  </div>

                  <div>
                    <span className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2">
                      Target Jenjang Utama
                    </span>
                    <div className="grid gap-3 grid-cols-2">
                      {/* TK/RA Card */}
                      <button
                        type="button"
                        onClick={() => setData('educationLevel', 'tk')}
                        className={cn(
                          'relative flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all cursor-pointer',
                          data.educationLevel === 'tk'
                            ? 'border-black bg-emerald-100 dark:bg-emerald-950/80 shadow-[3px_3px_0px_#000000]'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-black bg-neutral-50 dark:bg-neutral-800/40'
                        )}
                      >
                        <Compass
                          className={cn(
                            'h-6 w-6 mb-2',
                            data.educationLevel === 'tk'
                              ? 'text-emerald-800 dark:text-emerald-300'
                              : 'text-neutral-400'
                          )}
                        />
                        <span className="text-xs font-black text-neutral-950 dark:text-white">
                          RA & TK / PAUD
                        </span>
                        <span className="mt-1 text-[10px] text-neutral-600 dark:text-neutral-400 font-medium">
                          Fase Fondasi
                        </span>
                        {data.educationLevel === 'tk' && (
                          <div className="absolute top-2 right-2 rounded-full bg-emerald-700 text-white p-0.5 border border-black">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>

                      {/* SD Card */}
                      <button
                        type="button"
                        onClick={() => setData('educationLevel', 'sd')}
                        className={cn(
                          'relative flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all cursor-pointer',
                          data.educationLevel === 'sd'
                            ? 'border-black bg-emerald-100 dark:bg-emerald-950/80 shadow-[3px_3px_0px_#000000]'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-black bg-neutral-50 dark:bg-neutral-800/40'
                        )}
                      >
                        <GraduationCap
                          className={cn(
                            'h-6 w-6 mb-2',
                            data.educationLevel === 'sd'
                              ? 'text-emerald-800 dark:text-emerald-300'
                              : 'text-neutral-400'
                          )}
                        />
                        <span className="text-xs font-black text-neutral-950 dark:text-white">
                          SD / MI
                        </span>
                        <span className="mt-1 text-[10px] text-neutral-600 dark:text-neutral-400 font-medium">
                          Fase A, B, C
                        </span>
                        {data.educationLevel === 'sd' && (
                          <div className="absolute top-2 right-2 rounded-full bg-emerald-700 text-white p-0.5 border border-black">
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
              className="btn-kawaii-primary px-6 py-3 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setShowConfirmModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-3xl border-2 border-black bg-white p-6 sm:p-7 shadow-[8px_8px_0px_#000000] dark:bg-neutral-900 z-10 text-neutral-900 dark:text-white space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-300 border-2 border-black shadow-[2px_2px_0px_#000000] text-neutral-950">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-black text-neutral-950 dark:text-white">
                        Ubah Jenjang Sekolah?
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(false)}
                        className="rounded-xl p-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                      {`Anda akan mengubah jenjang dari `}
                      <strong className="font-bold text-neutral-900 dark:text-white">
                        {currentLevelLabel}
                      </strong>
                      {` ke `}
                      <strong className="font-bold text-emerald-600 dark:text-emerald-400">
                        {targetLevelLabel}
                      </strong>
                      .
                    </p>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 p-4 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                  <p>
                    <strong className="font-bold text-neutral-900 dark:text-white">
                      Yang berubah:
                    </strong>{' '}
                    Menu navigasi generator akan menyesuaikan jenjang baru.
                  </p>
                  <p>
                    <strong className="font-bold text-neutral-900 dark:text-white">
                      Yang tetap:
                    </strong>{' '}
                    Semua dokumen (RPPM, LKPD, Modul Ajar) yang sudah dibuat tetap aman tersimpan.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="btn-kawaii-secondary px-4 py-2.5 text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmChange}
                    className="btn-kawaii-primary px-5 py-2.5 text-xs font-black"
                  >
                    Ya, Simpan Perubahan
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWrapper>
  )
}
