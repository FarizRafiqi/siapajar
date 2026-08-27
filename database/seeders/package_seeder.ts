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
    // Deactivate legacy packages if they exist
    await Package.query().whereIn('name', ['free', 'basic', 'pro']).update({ isActive: false })

    const packages: PackageSeedData[] = [
      {
        name: 'topup_pemula',
        displayName: 'Paket Pemula',
        description: 'Cocok untuk coba-coba atau kebutuhan mendesak beberapa dokumen.',
        priceMonthly: 15000,
        priceYearly: null,
        features: [
          '15 Kredit SiapAjar',
          'Rp1.000 / dokumen',
          'Kredit tidak pernah hangus',
          'Akses Semua Generator AI Express',
          'Download Word (.docx) & PDF',
          'Format Standar Kemendikbudristek',
        ],
        isHighlighted: false,
        isActive: true,
        ctaLabel: 'Pilih Pemula',
        sortOrder: 1,
      },
      {
        name: 'topup_sahabat',
        displayName: 'Paket Sahabat Guru',
        description: 'Pilihan paling favorit untuk persiapan administrasi 1 semester penuh.',
        priceMonthly: 35000,
        priceYearly: null,
        features: [
          '45 Kredit SiapAjar (Hemat 22%)',
          'Rp777 / dokumen',
          'Kredit tidak pernah hangus',
          'Akses Modul Ajar, RPPM, LKPD & Soal',
          'Export Lengkap Word (.docx) & PDF',
          'Format Supervisi Kepala Sekolah',
        ],
        isHighlighted: true,
        isActive: true,
        ctaLabel: 'Pilih Sahabat Guru',
        sortOrder: 2,
      },
      {
        name: 'topup_teladan',
        displayName: 'Paket Guru Teladan',
        description: 'Paket super hemat untuk guru aktif yang menyusun bank soal dan modul rutin.',
        priceMonthly: 65000,
        priceYearly: null,
        features: [
          '100 Kredit SiapAjar (Hemat 35%)',
          'Rp650 / dokumen (Termurah)',
          'Kredit tidak pernah hangus',
          'Prioritas Jalur Cepat AI Generator',
          'Download Word (.docx) & PDF tanpa batas',
          'Akses Template Rapor & Katrol Nilai',
        ],
        isHighlighted: false,
        isActive: true,
        ctaLabel: 'Pilih Guru Teladan',
        sortOrder: 3,
      },
      {
        name: 'sekolah',
        displayName: 'Paket Sekolah / Komunitas',
        description: 'Kuota besar untuk 1 sekolah, KKG, atau gugus PAUD/SD.',
        priceMonthly: 250000,
        priceYearly: null,
        features: [
          '500 Kredit SiapAjar (Hemat 50%)',
          'Rp500 / dokumen',
          'Bisa dipakai bersama rekan guru',
          'Kredit tidak pernah hangus',
          'Dashboard & Supervisi Kepala Sekolah',
          'Layanan Bantuan Khusus WhatsApp',
        ],
        isHighlighted: false,
        isActive: true,
        ctaLabel: 'Pilih Paket Sekolah',
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
