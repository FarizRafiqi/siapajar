import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Subject from '#models/subject'

export default class extends BaseSeeder {
  async run() {
    // Find all users with educationLevel set
    const users = await User.query().whereNotNull('education_level')

    for (const user of users) {
      const existing = await Subject.query().where('user_id', user.id).count('* as total')
      if (Number(existing[0].$extras.total) > 0) continue

      const isTk = user.educationLevel === 'tk'

      const tkSubjects = [
        'Motorik Kasar',
        'Motorik Halus',
        'Kognitif',
        'Bahasa & Literasi',
        'Seni & Kreativitas',
        'Sosial-Emosional',
        'Agama & Moral',
        'Bermain di Luar',
        'Musik & Gerak',
      ]

      const sdSubjects = [
        'Bahasa Indonesia',
        'Matematika',
        'IPAS',
        'PPKn',
        'Bahasa Inggris',
        'Seni Budaya',
        'PJOK',
        'Muatan Lokal',
      ]

      const subjects = isTk ? tkSubjects : sdSubjects

      for (const name of subjects) {
        await Subject.create({
          userId: user.id,
          name,
          educationLevel: user.educationLevel!,
          gradeLevel: null,
          isActive: true,
        })
      }
    }

    console.log('Subject seeder completed')
  }
}
