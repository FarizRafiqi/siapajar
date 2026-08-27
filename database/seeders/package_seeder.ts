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
        displayName: 'Trial Guru (10 Kredit)',
        description: 'Bonus 10 kredit instan untuk coba semua tool tanpa langganan.',
        priceMonthly: 0,
        priceYearly: null,
        features: [
          '10 Kredit Gratis',
          'Akses Semua Tool Express',
          'Export PDF & DOCX',
          'Simpan di Cloud',
        ],
        isHighlighted: false,
        ctaLabel: 'Mulai Sekarang',
        sortOrder: 1,
      },
      {
        name: 'topup_pemula',
        displayName: 'Paket Pemula',
        description: 'Top-up santai 15 kredit (Masa aktif selamanya, tanpa expired).',
        priceMonthly: 15000,
        priceYearly: null,
        features: [
          '15 Kredit SiapAjar',
          'Kredit tidak pernah hangus',
          'Akses Semua Generator AI',
          'Download Word (DOCX) & PDF',
          'Format Standar Kemendikbudristek',
        ],
        isHighlighted: false,
        ctaLabel: 'Top-up Rp15.000',
        sortOrder: 2,
      },
      {
        name: 'topup_sahabat',
        displayName: 'Paket Sahabat Guru',
        description: 'Paling favorit untuk persiapan administrasi 1 semester.',
        priceMonthly: 35000,
        priceYearly: null,
        features: [
          '45 Kredit SiapAjar',
          'Hemat 22% (Rp777 / dokumen)',
          'Kredit tidak pernah hangus',
          'Akses Semua Generator AI',
          'Download Word (DOCX) & PDF',
          'Supervisi & Format Rapor Lengkap',
        ],
        isHighlighted: true,
        ctaLabel: 'Top-up Rp35.000',
        sortOrder: 3,
      },
      {
        name: 'topup_teladan',
        displayName: 'Paket Guru Teladan',
        description: 'Paket super hemat 100 kredit untuk guru produktif.',
        priceMonthly: 65000,
        priceYearly: null,
        features: [
          '100 Kredit SiapAjar',
          'Hemat 35% (Rp650 / dokumen)',
          'Kredit tidak pernah hangus',
          'Akses Semua Generator AI',
          'Download Word (DOCX) & PDF',
          'Prioritas Jalur Cepat AI',
          'Bonus Template Soal & LKPD Eksklusif',
        ],
        isHighlighted: false,
        ctaLabel: 'Top-up Rp65.000',
        sortOrder: 4,
      },
      {
        name: 'sekolah',
        displayName: 'Paket Sekolah',
        description: 'Multi-guru & akreditasi lengkap untuk 1 institusi.',
        priceMonthly: 250000,
        priceYearly: 2500000,
        features: [
          '500 Kredit SiapAjar / Multi-User',
          'Dashboard Kepala Sekolah & Supervisi',
          'Akses Manajemen CP, TP, ATP Terstruktur',
          'Export Dokumen Format Akreditasi',
          'Dedicated WhatsApp Support',
        ],
        isHighlighted: false,
        ctaLabel: 'Hubungi Kami',
        sortOrder: 5,
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
