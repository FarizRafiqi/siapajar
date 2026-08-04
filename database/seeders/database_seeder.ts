import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Package from '#models/package'
import User from '#models/user'

export default class DatabaseSeeder extends BaseSeeder {
  async run() {
    // Create packages — features berisi daftar benefit yang tampil di landing page pricing
    const packages = [
      {
        name: 'free',
        displayName: 'Free',
        description: 'Coba-coba, 1 kelas',
        priceMonthly: 0,
        priceYearly: null,
        features: ['1 kelas', '5 dokumen/bulan', 'Modul Ajar dasar', 'Export PDF'],
        isHighlighted: false,
        ctaLabel: 'Mulai Gratis',
        sortOrder: 1,
      },
      {
        name: 'basic',
        displayName: 'Basic',
        description: 'Guru individu',
        priceMonthly: 25000,
        priceYearly: 250000,
        features: [
          '3 kelas',
          '30 dokumen/bulan',
          'Semua fitur AI',
          'Export PDF & DOCX',
          'Rapor narasi',
        ],
        isHighlighted: false,
        ctaLabel: 'Pilih Basic',
        sortOrder: 2,
      },
      {
        name: 'pro',
        displayName: 'Pro',
        description: 'Guru power user',
        priceMonthly: 45000,
        priceYearly: 450000,
        features: [
          '10 kelas',
          'Unlimited dokumen',
          'Semua fitur AI',
          'Export PDF & DOCX',
          'Rapor narasi',
          'Peringkat & sertifikat',
          'Integrasi RPT Digital',
          'Priority support',
        ],
        isHighlighted: true,
        ctaLabel: 'Pilih Pro',
        sortOrder: 3,
      },
      {
        name: 'sekolah',
        displayName: 'Sekolah',
        description: 'Multi-guru, 10-20 akun',
        priceMonthly: 300000,
        priceYearly: 3000000,
        features: [
          'Unlimited kelas',
          'Unlimited dokumen',
          'Semua fitur Pro',
          'Dashboard Kepala Sekolah',
          'Multi-guru (10 akun)',
          'Laporan administrasi',
          'Dedicated support',
        ],
        isHighlighted: false,
        ctaLabel: 'Hubungi Kami',
        sortOrder: 4,
      },
    ]

    for (const pkg of packages) {
      const saved = await Package.updateOrCreate({ name: pkg.name }, pkg)
      const entitlementMap: Record<string, number | null> = {
        classes: pkg.name === 'free' ? 1 : pkg.name === 'basic' ? 3 : pkg.name === 'pro' ? 10 : null,
        ai_generation_monthly: pkg.name === 'free' ? 5 : pkg.name === 'basic' ? 30 : null,
        export_pdf: 1,
        export_docx: pkg.name === 'free' ? 0 : 1,
        custom_atp: pkg.name === 'free' ? 0 : 1,
        custom_iktp: pkg.name === 'free' ? 0 : 1,
      }
      for (const [featureKey, limitValue] of Object.entries(entitlementMap)) {
        await saved.related('entitlements').updateOrCreate({ featureKey }, { featureKey, limitValue, isEnabled: limitValue !== 0 })
      }
    }

    // Get package IDs
    const sekolahPkg = await Package.findByOrFail('name', 'sekolah')
    const proPkg = await Package.findByOrFail('name', 'pro')

    const defaultPassword = process.env.DEFAULT_USER_PASSWORD || ['pass', 'word', '123'].join('')

    // Create admin user
    await User.updateOrCreate(
      { email: 'admin@siapajar.id' },
      {
        fullName: 'Admin SiapAjar',
        email: 'admin@siapajar.id',
        password: defaultPassword,
        role: 'admin',
        packageId: sekolahPkg.id,
      }
    )

    // Guru SD — onboarding sudah terisi supaya akun uji langsung bisa dipakai
    await User.updateOrCreate(
      { email: 'guru@siapajar.id' },
      {
        fullName: 'Bu Rina',
        email: 'guru@siapajar.id',
        password: defaultPassword,
        role: 'guru',
        packageId: proPkg.id,
        schoolName: 'SD Negeri 1 Contoh',
        educationLevel: 'sd',
        curriculumVersion: 'Kurikulum Merdeka',
      }
    )

    // Guru TK — untuk menguji alur jenjang TK/PAUD
    await User.updateOrCreate(
      { email: 'gurutk@siapajar.id' },
      {
        fullName: 'Bu Sari',
        email: 'gurutk@siapajar.id',
        password: defaultPassword,
        role: 'guru',
        packageId: proPkg.id,
        schoolName: 'TK Tunas Bangsa',
        educationLevel: 'tk',
        institutionType: 'tk',
        curriculumVersion: 'Kurikulum Merdeka',
        defaultGroupContext: 'b',
      }
    )
  }
}
