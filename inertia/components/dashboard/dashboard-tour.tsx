import { useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const TOUR_STORAGE_KEY = 'siapajar:dashboard-tour:v1'

interface DashboardTourProps {
  readonly active: boolean
  readonly autoStart?: boolean
  readonly educationLevel: 'tk' | 'sd' | null
  readonly onAutoStart?: () => void
  readonly onFinish?: () => void
}

export default function DashboardTour({
  active,
  autoStart = false,
  educationLevel,
  onAutoStart,
  onFinish,
}: DashboardTourProps) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (!active || hasStartedRef.current) return

    const availableSteps = [
      {
        element: '[data-tour="welcome"]',
        popover: {
          title: 'Selamat datang di SiapAjar',
          description: 'Tur singkat ini membantu Anda menemukan fitur utama untuk menyiapkan pembelajaran.',
        },
      },
      {
        element: '[data-tour="sidebar"]',
        popover: {
          title: 'Menu pembelajaran',
          description: educationLevel === 'tk'
            ? 'Gunakan menu ini untuk mengelola kelompok, RPPM, RPPH, LKPD, media ajar, asesmen, dan rapor PAUD.'
            : 'Gunakan menu ini untuk mengelola kelas, modul ajar, penilaian, bank soal, dan rapor.',
          side: 'right' as const,
        },
      },
      {
        element: '[data-tour="stat-cards"]',
        popover: {
          title: 'Ringkasan aktivitas',
          description: 'Kartu ini menampilkan jumlah data yang sudah Anda buat. Klik kartu untuk langsung membuka fiturnya.',
          side: 'bottom' as const,
        },
      },
      {
        element: '[data-tour="quick-actions"]',
        popover: {
          title: 'Aksi cepat',
          description: 'Mulai pekerjaan yang paling sering digunakan dari sini, seperti membuat kelas atau dokumen pembelajaran.',
          side: 'top' as const,
        },
      },
      {
        element: '[data-tour="profile-menu"]',
        popover: {
          title: 'Profil dan pengaturan',
          description: 'Klik nama Anda untuk membuka pengaturan akun atau keluar dari SiapAjar.',
          side: 'top' as const,
        },
      },
    ].filter((step) => document.querySelector(step.element))

    if (availableSteps.length === 0) return

    hasStartedRef.current = true
    const tour = driver({
      showProgress: true,
      nextBtnText: 'Berikutnya',
      prevBtnText: 'Sebelumnya',
      doneBtnText: 'Selesai',
      allowClose: true,
      steps: availableSteps,
      onDestroyed: () => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'completed')
        onFinish?.()
      },
    })

    driverRef.current = tour
    tour.drive()

    return () => {
      tour.destroy()
      driverRef.current = null
    }
  }, [active, educationLevel, onFinish])

  useEffect(() => {
    if (!autoStart || localStorage.getItem(TOUR_STORAGE_KEY)) return
    const timer = window.setTimeout(() => onAutoStart?.(), 450)
    return () => window.clearTimeout(timer)
  }, [autoStart, onAutoStart])

  return null
}
