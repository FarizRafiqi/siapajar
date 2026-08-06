import { useEffect, useRef } from 'react'
import { driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'

export type DashboardTourName = 'dashboard' | 'curriculum' | 'paud-assessment'

interface DashboardTourProps {
  readonly active: boolean
  readonly autoStart?: boolean
  readonly educationLevel: 'tk' | 'sd' | null
  readonly tourName?: DashboardTourName
  readonly onAutoStart?: () => void
  readonly onFinish?: () => void
}

const TOUR_VERSION = 'v2'

function storageKey(tourName: DashboardTourName) {
  return `siapajar:${tourName}-tour:${TOUR_VERSION}`
}

function isTourCompleted(tourName: DashboardTourName) {
  try {
    return window.localStorage.getItem(storageKey(tourName)) === 'completed'
  } catch {
    return false
  }
}

function markTourCompleted(tourName: DashboardTourName) {
  try {
    window.localStorage.setItem(storageKey(tourName), 'completed')
  } catch {
    // Private browsing or disabled storage must not block onboarding.
  }
}

function getSteps(tourName: DashboardTourName, educationLevel: 'tk' | 'sd' | null): DriveStep[] {
  if (tourName === 'curriculum') {
    return [
      {
        element: '[data-tour="curriculum-intro"]',
        popover: {
          title: 'Mulai dari struktur kurikulum',
          description:
            'Halaman ini menyusun tujuan pembelajaran secara bertahap. CP menjadi acuan, TP merumuskan tujuan yang lebih spesifik, ATP menyusun urutannya, dan IKTP membantu mengamati ketercapaiannya.',
        },
      },
      {
        element: '[data-tour="curriculum-flow"]',
        popover: {
          title: 'Alur yang saling terhubung',
          description:
            'Gunakan alur CP, TP, ATP, dan IKTP sebagai peta. Anda tidak perlu membuat CP baru untuk Kelompok A dan B; pilih konteks kelompok saat menyusun TP atau ATP.',
        },
      },
      {
        element: '[data-tour="curriculum-cp"]',
        popover: {
          title: 'Pilih elemen CP',
          description:
            'Pilih salah satu elemen CP untuk melihat tujuan pembelajaran yang tersedia. CP Fase Fondasi PAUD terdiri dari Nilai Agama dan Budi Pekerti, Jati Diri, serta dasar-dasar literasi, matematika, sains, teknologi, rekayasa, dan seni.',
          side: 'right',
        },
      },
      {
        element: '[data-tour="curriculum-tp"]',
        popover: {
          title: 'Pilih atau buat TP',
          description:
            'Pilih TP yang ingin dimasukkan ke ATP. Jika belum sesuai kebutuhan kelas, gunakan Tambah TP Custom untuk menulis rumusan sendiri.',
        },
      },
      {
        element: '[data-tour="curriculum-atp"]',
        popover: {
          title: 'Susun ATP',
          description:
            'ATP adalah urutan tujuan pembelajaran. Pilih beberapa TP, lalu buat ATP dari tombol ini. Urutan pilihan akan menjadi urutan awal yang bisa Anda simpan.',
        },
      },
      {
        element: '[data-tour="curriculum-iktp"]',
        popover: {
          title: 'Catat IKTP dan bukti',
          description:
            'IKTP adalah indikator perilaku yang dapat diamati. Tambahkan kriteria ketercapaian agar catatan asesmen memiliki bukti yang jelas.',
        },
      },
      {
        element: '[data-tour="curriculum-glossary"]',
        popover: {
          title: 'Buka glossary kapan saja',
          description:
            'Gunakan glossary di halaman ini untuk memahami CP, TP, ATP, IKTP, RPM, RPPM, RPPH, Modul Ajar, dan PPM.',
        },
      },
    ]
  }

  if (tourName === 'paud-assessment') {
    return [
      {
        element: '[data-tour="assessment-intro"]',
        popover: {
          title: 'Asesmen berbasis bukti',
          description:
            'Gunakan asesmen untuk mencatat perkembangan anak melalui observasi, catatan anekdot, hasil karya, atau foto berseri. Hubungkan catatan dengan TP dan IKTP jika tersedia.',
        },
      },
      {
        element: '[data-tour="assessment-create"]',
        popover: {
          title: 'Catat asesmen baru',
          description:
            'Pilih anak, jenis asesmen, tanggal, tujuan pembelajaran, lalu tambahkan catatan dan bukti yang relevan.',
        },
      },
      {
        element: '[data-tour="assessment-filters"]',
        popover: {
          title: 'Saring catatan',
          description:
            'Gunakan filter jenis asesmen untuk menemukan catatan observasi atau bukti tertentu dengan cepat.',
        },
      },
      {
        element: '[data-tour="assessment-list"]',
        popover: {
          title: 'Baca perkembangan anak',
          description:
            'Setiap kartu berisi konteks, jenis bukti, status ketercapaian, dan catatan yang dapat digunakan untuk menyusun narasi perkembangan.',
        },
      },
    ]
  }

  return [
    {
      element: '[data-tour="welcome"]',
      popover: {
        title: 'Selamat datang di SiapAjar',
        description:
          'Tur singkat ini membantu Anda menemukan fitur utama untuk menyiapkan pembelajaran.',
      },
    },
    {
      element: '[data-tour="sidebar"]',
      popover: {
        title: 'Menu pembelajaran',
        description:
          educationLevel === 'tk'
            ? 'Gunakan menu ini untuk mengelola kurikulum, kelompok, RPPM, RPPH, media ajar, asesmen, dan rapor PAUD.'
            : 'Gunakan menu ini untuk mengelola kurikulum, kelas, modul ajar, penilaian, bank soal, dan rapor.',
        side: 'right',
      },
    },
    {
      element: '[data-tour="stat-cards"]',
      popover: {
        title: 'Ringkasan aktivitas',
        description: 'Klik kartu untuk langsung membuka fitur dan melihat data yang diringkas.',
        side: 'bottom',
      },
    },
    {
      element: '[data-tour="quick-actions"]',
      popover: {
        title: 'Aksi cepat',
        description: 'Mulai pekerjaan yang paling sering digunakan dari sini.',
        side: 'top',
      },
    },
    {
      element: '[data-tour="profile-menu"]',
      popover: {
        title: 'Profil dan pengaturan',
        description: 'Kelola akun, buka pengaturan, atau keluar dari SiapAjar.',
        side: 'top',
      },
    },
  ]
}

export default function DashboardTour({
  active,
  autoStart = false,
  educationLevel,
  tourName = 'dashboard',
  onAutoStart,
  onFinish,
}: DashboardTourProps) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (!active || hasStartedRef.current) return

    const steps = getSteps(tourName, educationLevel).filter((step) => {
      return typeof step.element === 'string' && document.querySelector(step.element)
    })

    if (steps.length === 0) return

    hasStartedRef.current = true
    const tour = driver({
      showProgress: true,
      nextBtnText: 'Berikutnya',
      prevBtnText: 'Sebelumnya',
      doneBtnText: 'Selesai',
      allowClose: true,
      steps,
      onDestroyed: () => {
        markTourCompleted(tourName)
        onFinish?.()
      },
    })

    driverRef.current = tour
    tour.drive()

    return () => {
      tour.destroy()
      driverRef.current = null
    }
  }, [active, educationLevel, onFinish, tourName])

  useEffect(() => {
    if (!active) hasStartedRef.current = false
  }, [active, tourName])

  useEffect(() => {
    if (!autoStart || isTourCompleted(tourName)) return
    const timer = window.setTimeout(() => onAutoStart?.(), 450)
    return () => window.clearTimeout(timer)
  }, [autoStart, onAutoStart, tourName])

  return null
}
