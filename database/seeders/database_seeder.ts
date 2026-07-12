import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Package from '#models/package'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Create packages
    const packages = [
      {
        name: 'free',
        displayName: 'Free',
        description: 'Coba-coba, 1 kelas',
        priceMonthly: 0,
        priceYearly: null,
        features: {
          prota: '1x gratis',
          promes: '1x gratis',
          modul_ajar: '3x gratis',
          soal: '2x gratis',
          bank_soal: false,
          export_docx: true,
          watermark: true,
          rapor_narasi: false,
          peringkat: false,
          kirim_wa: false,
          dashboard_kepsek: false,
          integrasi_rpt: false,
          jumlah_guru: 1,
        },
        sortOrder: 1,
      },
      {
        name: 'basic',
        displayName: 'Basic',
        description: 'Guru individu',
        priceMonthly: 25000,
        priceYearly: 250000,
        features: {
          prota: 'unlimited',
          promes: 'unlimited',
          modul_ajar: 'unlimited',
          soal: '20/bulan',
          bank_soal: 100,
          export_docx: true,
          watermark: false,
          rapor_narasi: false,
          peringkat: false,
          kirim_wa: false,
          dashboard_kepsek: false,
          integrasi_rpt: false,
          jumlah_guru: 1,
        },
        sortOrder: 2,
      },
      {
        name: 'pro',
        displayName: 'Pro',
        description: 'Guru power user',
        priceMonthly: 45000,
        priceYearly: 450000,
        features: {
          prota: 'unlimited',
          promes: 'unlimited',
          modul_ajar: 'unlimited',
          soal: 'unlimited',
          bank_soal: 'unlimited',
          export_docx: true,
          watermark: false,
          rapor_narasi: true,
          peringkat: true,
          kirim_wa: '50/bulan',
          dashboard_kepsek: false,
          integrasi_rpt: false,
          jumlah_guru: 1,
        },
        sortOrder: 3,
      },
      {
        name: 'sekolah',
        displayName: 'Sekolah',
        description: 'Multi-guru, 10-20 akun',
        priceMonthly: 300000,
        priceYearly: 3000000,
        features: {
          prota: 'unlimited',
          promes: 'unlimited',
          modul_ajar: 'unlimited',
          soal: 'unlimited',
          bank_soal: 'unlimited',
          export_docx: true,
          watermark: false,
          rapor_narasi: true,
          peringkat: true,
          kirim_wa: 'unlimited',
          dashboard_kepsek: true,
          integrasi_rpt: true,
          jumlah_guru: 20,
        },
        sortOrder: 4,
      },
    ]

    for (const pkg of packages) {
      await Package.updateOrCreate({ name: pkg.name }, pkg)
    }

    // Get package IDs
    const sekolahPkg = await Package.findByOrFail('name', 'sekolah')
    const proPkg = await Package.findByOrFail('name', 'pro')

    // Create admin user
    await User.updateOrCreate(
      { email: 'admin@siapajar.id' },
      {
        fullName: 'Admin SiapAjar',
        email: 'admin@siapajar.id',
        password: 'password123',
        role: 'admin',
        packageId: sekolahPkg.id,
      }
    )

    // Create test guru user
    await User.updateOrCreate(
      { email: 'guru@siapajar.id' },
      {
        fullName: 'Bu Rina',
        email: 'guru@siapajar.id',
        password: 'password123',
        role: 'guru',
        packageId: proPkg.id,
      }
    )
  }
}
