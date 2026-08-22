import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Package from '#models/package'

export interface PackageSeedData {
  name: string
  displayName: string
  description: string
  priceMonthly: number
  priceYearly: number | null
  features: string[]
  isHighlighted: boolean
  ctaLabel: string | null
  sortOrder: number
  isActive?: boolean
}

export default class PackageSeeder extends BaseSeeder {
  private getEntitlementsForPackage(pkgName: string): Record<string, number | null> {
    const limits: Record<
      string,
      {
        classes: number | null
        ai: number | null
        img: number | null
        svg: number | null
        docx: number
        atp: number
        iktp: number
      }
    > = {
      free: { classes: 1, ai: 5, img: 3, svg: 10, docx: 0, atp: 0, iktp: 0 },
      basic: { classes: 3, ai: 30, img: 15, svg: 50, docx: 1, atp: 1, iktp: 1 },
      pro: { classes: 10, ai: null, img: null, svg: null, docx: 1, atp: 1, iktp: 1 },
      sekolah: { classes: null, ai: null, img: null, svg: null, docx: 1, atp: 1, iktp: 1 },
    }

    const current = limits[pkgName] || limits.free
    return {
      classes: current.classes,
      ai_generation_monthly: current.ai,
      ai_image_generation_monthly: current.img,
      ai_svg_generation_monthly: current.svg,
      export_pdf: 1,
      export_docx: current.docx,
      custom_atp: current.atp,
      custom_iktp: current.iktp,
    }
  }

  private async seedStandardPackages() {
    const packages: PackageSeedData[] = [
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
      const entitlementMap = this.getEntitlementsForPackage(pkg.name)

      for (const [featureKey, limitValue] of Object.entries(entitlementMap)) {
        await saved
          .related('entitlements')
          .updateOrCreate({ featureKey }, { featureKey, limitValue, isEnabled: limitValue !== 0 })
      }
    }
  }

  private async seedTestingPackage() {
    const testingPackage = await Package.updateOrCreate(
      { name: 'internal_testing_unlimited' },
      {
        name: 'internal_testing_unlimited',
        displayName: 'Internal Testing Unlimited',
        description: 'Akun internal untuk pengujian fitur tanpa batas kuota',
        priceMonthly: 0,
        priceYearly: null,
        features: ['Semua fitur tanpa batas kuota'],
        isActive: false,
        isHighlighted: false,
        ctaLabel: null,
        sortOrder: 999,
      }
    )

    const unlimitedFeatureKeys = [
      'classes',
      'students',
      'ai_generation_monthly',
      'ai_image_generation_monthly',
      'ai_svg_generation_monthly',
      'export_pdf',
      'export_docx',
      'export_pptx',
      'export_xlsx',
      'custom_atp',
      'custom_iktp',
    ]

    for (const featureKey of unlimitedFeatureKeys) {
      await testingPackage
        .related('entitlements')
        .updateOrCreate({ featureKey }, { featureKey, limitValue: null, isEnabled: true })
    }
  }

  async run() {
    await this.seedStandardPackages()
    await this.seedTestingPackage()
  }
}
