import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import SchoolClass from '#models/school_class'

export default class PrincipalDashboardController {
  async index({ inertia, auth }: HttpContext) {
    const principal = auth.user!

    if (!principal.schoolId) {
      return inertia.render('dashboard/principal/index', { school: null, teachers: [] })
    }

    const teachers = await User.query()
      .where('school_id', principal.schoolId)
      .where('role', 'guru')
      .orderBy('full_name')

    const teacherIds = teachers.map((t) => t.id)

    const classCounts = teacherIds.length
      ? await db
          .from('classes')
          .select('user_id')
          .count('* as count')
          .whereIn('user_id', teacherIds)
          .groupBy('user_id')
      : []

    const studentCounts = teacherIds.length
      ? await db
          .from('students')
          .join('classes', 'classes.id', 'students.class_id')
          .select('classes.user_id')
          .count('students.id as count')
          .whereIn('classes.user_id', teacherIds)
          .groupBy('classes.user_id')
      : []

    const classCountMap = new Map(classCounts.map((row) => [row.user_id, Number(row.count)]))
    const studentCountMap = new Map(studentCounts.map((row) => [row.user_id, Number(row.count)]))

    return inertia.render('dashboard/principal/index', {
      school: { id: principal.schoolId, name: principal.schoolName },
      teachers: teachers.map((teacher) => ({
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        educationLevel: teacher.educationLevel,
        classCount: classCountMap.get(teacher.id) ?? 0,
        studentCount: studentCountMap.get(teacher.id) ?? 0,
      })),
    })
  }

  async teacher({ params, inertia, auth, response }: HttpContext) {
    const principal = auth.user!

    const teacher = await User.query()
      .where('id', params.userId)
      .where('school_id', principal.schoolId ?? -1)
      .where('role', 'guru')
      .first()

    if (!teacher) {
      return response.redirect('/principal')
    }

    const classes = await SchoolClass.query()
      .where('user_id', teacher.id)
      .preload('academicYear')
      .preload('students')
      .orderBy('name')

    return inertia.render('dashboard/principal/teacher', {
      teacher: {
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        educationLevel: teacher.educationLevel,
      },
      classes: classes.map((c) => c.toJSON()),
    })
  }
}
