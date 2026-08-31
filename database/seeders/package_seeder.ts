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
      paket_pemula: { classes: 3, ai: 30, img: 15, svg: 50, docx: 1, atp: 1, iktp: 1 },
      paket_sahabat_guru: { classes: 10, ai: null, img: null, svg: null, docx: 1, atp: 1, iktp: 1 },
      paket_guru_teladan: { classes: 10, ai: null, img: null, svg: null, docx: 1, atp: 1, iktp: 1 },
      paket_sekolah: { classes: null, ai: null, img: null, svg: null, docx: 1, atp: 1, iktp: 1 },
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
    // Reset status paket terdahulu
    await Package.query().update({ isActive: false })

    const packages: PackageSeedData[] = [
      {
        name: 'paket_pemula',
        displayName: 'Paket Pemula',
        description: 'Cocok untuk coba-coba atau kebutuhan mendesak beberapa dokumen.',
        priceMonthly: 20000,
        priceYearly: null,
        features: [
          '15 Kredit SiapAjar',
          'Rp 1.333 / kredit',
          '~ 8-10 Modul Ajar',
          'Kredit tidak pernah hangus',
          'Akses Semua Generator AI Express',
          'Download Word (.docx) & PDF',
          'Format Standar Kemendikbudristek',
        ],
        isHighlighted: false,
        isActive: true,
        ctaLabel: 'Pilih Paket Ini',
        sortOrder: 1,
      },
      {
        name: 'paket_sahabat_guru',
        displayName: 'Paket Sahabat Guru',
        description: 'Paling favorit untuk persiapan administrasi 1 semester.',
        priceMonthly: 45000,
        priceYearly: null,
        features: [
          '45 Kredit SiapAjar (Terlaris)',
          'Hemat 25% (Rp 1.000 / kredit)',
          '~ 25-30 Modul Ajar',
          'Kredit tidak pernah hangus',
          'Akses Semua Generator AI Express',
          'Download Word (.docx) & PDF',
          'Supervisi & Format Rapor Lengkap',
        ],
        isHighlighted: true,
        isActive: true,
        ctaLabel: 'Pilih Paket Ini',
        sortOrder: 2,
      },
      {
        name: 'paket_guru_teladan',
        displayName: 'Paket Guru Teladan',
        description: 'Paket super hemat 100 kredit untuk guru produktif.',
        priceMonthly: 85000,
        priceYearly: null,
        features: [
          '100 Kredit SiapAjar',
          'Hemat 36% (Rp 850 / kredit)',
          '~ 60-70 Modul Ajar',
          'Kredit tidak pernah hangus',
          'Akses Semua Generator AI Express',
          'Prioritas Jalur Cepat AI',
          'Bonus Template Soal & LKPD Eksklusif',
        ],
        isHighlighted: false,
        isActive: true,
        ctaLabel: 'Pilih Paket Ini',
        sortOrder: 3,
      },
      {
        name: 'paket_sekolah',
        displayName: 'Paket Sekolah',
        description: 'Multi-guru & akreditasi lengkap untuk 1 institusi.',
        priceMonthly: 249000,
        priceYearly: null,
        features: [
          '350 Kredit SiapAjar / Multi-User',
          'Rp 711 / kredit (Hemat 47%)',
          '~ 200+ Modul Ajar',
          'Kredit tidak pernah hangus',
          'Dashboard Kepala Sekolah & Supervisi',
          'Export Dokumen Format Akreditasi',
          'Dedicated WhatsApp Support',
        ],
        isHighlighted: false,
        isActive: true,
        ctaLabel: 'Pilih Paket Ini',
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
