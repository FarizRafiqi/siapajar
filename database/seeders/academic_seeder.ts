import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AcademicYear from '#models/academic_year'
import Semester from '#models/semester'

export default class extends BaseSeeder {
  async run() {
    // Create academic years
    const ay2024 = await AcademicYear.firstOrCreate(
      { name: '2024/2025' },
      { name: '2024/2025', isActive: true }
    )

    const ay2025 = await AcademicYear.firstOrCreate(
      { name: '2025/2026' },
      { name: '2025/2026', isActive: false }
    )

    // Create semesters for 2024/2025
    await Semester.firstOrCreate(
      { academicYearId: ay2024.id, name: 'Ganjil' },
      { academicYearId: ay2024.id, name: 'Ganjil', isActive: true }
    )

    await Semester.firstOrCreate(
      { academicYearId: ay2024.id, name: 'Genap' },
      { academicYearId: ay2024.id, name: 'Genap', isActive: false }
    )

    // Create semesters for 2025/2026
    await Semester.firstOrCreate(
      { academicYearId: ay2025.id, name: 'Ganjil' },
      { academicYearId: ay2025.id, name: 'Ganjil', isActive: false }
    )

    await Semester.firstOrCreate(
      { academicYearId: ay2025.id, name: 'Genap' },
      { academicYearId: ay2025.id, name: 'Genap', isActive: false }
    )

    console.log('Academic data seeded successfully')
  }
}
