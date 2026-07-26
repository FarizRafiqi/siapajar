import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Subject from '#models/subject'
import { DEFAULT_SUBJECTS } from '#controllers/subjects_controller'

export default class SubjectSeeder extends BaseSeeder {
  async run() {
    const users = await User.query().whereNotNull('education_level')

    for (const user of users) {
      const educationLevel = user.educationLevel as 'tk' | 'sd'

      for (const name of DEFAULT_SUBJECTS[educationLevel]) {
        await Subject.updateOrCreate(
          { userId: user.id, name, educationLevel },
          { userId: user.id, name, educationLevel, gradeLevel: null, isActive: true }
        )
      }
    }

    console.log('Subject seeder completed')
  }
}
