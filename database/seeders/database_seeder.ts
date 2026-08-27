import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CurriculumSeeder from './curriculum_seeder.js'
import CurriculumPresetSeeder from './curriculum_preset_seeder.js'
import AcademicSeeder from './academic_seeder.js'
import PackageSeeder from './package_seeder.js'
import UserSeeder from './user_seeder.js'
import RppmKbcSemester1Seeder from './rppm_kbc_semester1_seeder.js'

export default class DatabaseSeeder extends BaseSeeder {
  private async seed(Seeder: new (client: any) => BaseSeeder) {
    await new Seeder(this.client).run()
  }

  async run() {
    await this.seed(CurriculumSeeder)
    await this.seed(CurriculumPresetSeeder)
    await this.seed(AcademicSeeder)
    await this.seed(PackageSeeder)
    await this.seed(UserSeeder)
    await this.seed(RppmKbcSemester1Seeder)
  }
}
