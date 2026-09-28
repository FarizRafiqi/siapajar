import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Package from '#models/package'
import PackageSubscription from '#models/package_subscription'

export default class UserSeeder extends BaseSeeder {
  private async seedDefaultUsers(
    freePkgId: number,
    sekolahPkgId: number,
    testingPkgId: number,
    password: string
  ) {
    await User.updateOrCreate(
      { email: 'admin@siapajar.id' },
      {
        fullName: 'Admin SiapAjar',
        email: 'admin@siapajar.id',
        password,
        role: 'admin',
        packageId: sekolahPkgId,
      }
    )

    await User.updateOrCreate(
      { email: 'guru@siapajar.id' },
      {
        fullName: 'Bu Rina',
        email: 'guru@siapajar.id',
        password,
        role: 'guru',
        packageId: testingPkgId,
        schoolName: 'SD Negeri 1 Contoh',
        educationLevel: 'sd',
        curriculumVersion: 'Kurikulum Merdeka',
      }
    )

    await User.updateOrCreate(
      { email: 'gurutk@siapajar.id' },
      {
        fullName: 'Bu Sari',
        email: 'gurutk@siapajar.id',
        password,
        role: 'guru',
        packageId: testingPkgId,
        schoolName: 'TK Tunas Bangsa',
        educationLevel: 'tk',
        institutionType: 'tk',
        curriculumVersion: 'Kurikulum Merdeka',
        defaultGroupContext: 'b',
      }
    )

    await User.updateOrCreate(
      { email: 'guru-normal@siapajar.id' },
      {
        fullName: 'Bu Dita',
        email: 'guru-normal@siapajar.id',
        password,
        role: 'guru',
        packageId: freePkgId,
        schoolName: 'TK Contoh Terbatas',
        educationLevel: 'tk',
        institutionType: 'tk',
        curriculumVersion: 'Kurikulum Merdeka',
        defaultGroupContext: 'a',
      }
    )
  }

  private async seedUserSubscriptions() {
    const usersWithPackages = await User.query().whereNotNull('package_id')
    for (const user of usersWithPackages) {
      await PackageSubscription.updateOrCreate(
        { userId: user.id, packageId: user.packageId!, status: 'active' },
        {
          userId: user.id,
          packageId: user.packageId!,
          status: 'active',
          billingCycle: 'manual',
          startsAt: user.createdAt,
          endsAt: null,
          canceledAt: null,
          metadata: { source: 'user_seeder' },
        }
      )
    }
  }

  async run() {
    // Demo credentials are useful for local smoke tests, but running this
    // seeder from a production container must never create a predictable
    // account. Production deployments should create their first admin via a
    // controlled release task instead.
    if (process.env.NODE_ENV === 'production' && process.env.SEED_DEMO_USERS !== 'true') {
      return
    }

    const freePkg = await Package.findByOrFail('name', 'free')
    const sekolahPkg = await Package.findByOrFail('name', 'sekolah')
    const testingPkg = await Package.findByOrFail('name', 'internal_testing_unlimited')
    const defaultPassword =
      process.env.DEFAULT_USER_PASSWORD ||
      (process.env.NODE_ENV === 'production' ? '' : 'password123')
    if (!defaultPassword) {
      throw new Error('DEFAULT_USER_PASSWORD wajib diisi saat men-seed akun demo.')
    }

    await this.seedDefaultUsers(freePkg.id, sekolahPkg.id, testingPkg.id, defaultPassword)
    await this.seedUserSubscriptions()
  }
}
