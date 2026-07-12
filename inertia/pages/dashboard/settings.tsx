import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, useForm, usePage } from '@inertiajs/react'
import React from 'react'
import { motion } from 'framer-motion'
import { Save, User, School, GraduationCap, Check, Compass } from 'lucide-react'
import { cn } from '~/lib/utils'

interface UserProps {
  id: number
  fullName: string
  email: string
  schoolName: string
  educationLevel: 'tk' | 'sd'
}

interface SettingsProps {
  readonly user: UserProps
}

export default function Settings({ user }: SettingsProps) {
  const { flash } = usePage().props as any
  const { data, setData, put, processing, errors } = useForm({
    fullName: user.fullName || '',
    email: user.email || '',
    schoolName: user.schoolName || '',
    educationLevel: user.educationLevel || 'sd',
  })

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    put('/settings')
  }

  return (
    <DashboardWrapper title="Pengaturan">
      <Head title="Pengaturan — SiapAjar" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner Alert */}
        {flash?.success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-400 text-sm font-medium flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            {flash.success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Profile Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <User className="h-5 w-5 text-neutral-500" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Profil Pengguna
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
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
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* School details & level Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <School className="h-5 w-5 text-neutral-500" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Instansi / Sekolah
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
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
                    {/* TK Card */}
                    <button
                      type="button"
                      onClick={() => setData('educationLevel', 'tk')}
                      className={cn(
                        "relative flex flex-col items-center p-4 rounded-lg border text-center transition-all duration-300",
                        data.educationLevel === 'tk'
                          ? "border-emerald-600 bg-emerald-50/20 dark:border-emerald-500 dark:bg-emerald-950/10 ring-2 ring-emerald-500/20"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent"
                      )}
                    >
                      <Compass className={cn("h-5 w-5 mb-2", data.educationLevel === 'tk' ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400")} />
                      <span className="text-sm font-medium text-neutral-950 dark:text-white">TK / PAUD</span>
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
                        "relative flex flex-col items-center p-4 rounded-lg border text-center transition-all duration-300",
                        data.educationLevel === 'sd'
                          ? "border-emerald-600 bg-emerald-50/20 dark:border-emerald-500 dark:bg-emerald-950/10 ring-2 ring-emerald-500/20"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-transparent"
                      )}
                    >
                      <GraduationCap className={cn("h-5 w-5 mb-2", data.educationLevel === 'sd' ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400")} />
                      <span className="text-sm font-medium text-neutral-950 dark:text-white">SD</span>
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
      </div>
    </DashboardWrapper>
  )
}
