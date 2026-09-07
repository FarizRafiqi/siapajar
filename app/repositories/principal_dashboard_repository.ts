import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import SchoolClass from '#models/school_class'

export class PrincipalDashboardRepository {
  async getTeachersWithCounts(schoolId: number) {
    const teachers = await User.query()
      .where('school_id', schoolId)
      .where('role', 'guru')
      .orderBy('full_name')

    const teacherIds = teachers.map((teacher) => teacher.id)
    const [classCounts, studentCounts] = teacherIds.length
      ? await Promise.all([
          db
            .from('classes')
            .select('user_id')
            .count('* as count')
            .whereIn('user_id', teacherIds)
            .groupBy('user_id'),
          db
            .from('students')
            .join('classes', 'classes.id', 'students.class_id')
            .select('classes.user_id')
            .count('students.id as count')
            .whereIn('classes.user_id', teacherIds)
            .groupBy('classes.user_id'),
        ])
      : [[], []]

    const classCountMap = new Map(classCounts.map((row) => [row.user_id, Number(row.count)]))
    const studentCountMap = new Map(studentCounts.map((row) => [row.user_id, Number(row.count)]))

    return teachers.map((teacher) => ({
      teacher,
      classCount: classCountMap.get(teacher.id) ?? 0,
      studentCount: studentCountMap.get(teacher.id) ?? 0,
    }))
  }

  async findTeacherDetail(schoolId: number, teacherId: string | number) {
    const teacher = await User.query()
      .where('id', teacherId)
      .where('school_id', schoolId)
      .where('role', 'guru')
      .first()

    if (!teacher) return null

    const classes = await SchoolClass.query()
      .where('user_id', teacher.id)
      .preload('academicYear')
      .preload('students')
      .orderBy('name')

    return { teacher, classes }
  }
}

export const principalDashboardRepository = new PrincipalDashboardRepository()
