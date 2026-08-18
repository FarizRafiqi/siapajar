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
    const freePkg = await Package.findByOrFail('name', 'free')
    const sekolahPkg = await Package.findByOrFail('name', 'sekolah')
    const testingPkg = await Package.findByOrFail('name', 'internal_testing_unlimited')
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD || ['pass', 'word', '123'].join('')

    await this.seedDefaultUsers(freePkg.id, sekolahPkg.id, testingPkg.id, defaultPassword)
    await this.seedUserSubscriptions()
  }
}
