import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import AcademicYear from '#models/academic_year'
import { createClassValidator, updateClassValidator } from '#validators/class'
import { createStudentValidator } from '#validators/student'

export default class ClassesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .preload('academicYear')
      .preload('students')
      .orderBy('created_at', 'desc')

    const academicYears = await AcademicYear.query().orderBy('name', 'desc')

    return inertia.render('dashboard/classes/index', {
      kelas: classes,
      tahunAjaran: academicYears,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createClassValidator)

    await SchoolClass.create({
      ...data,
      userId: user.id,
    })

    session.flash('success', 'Kelas berhasil dibuat')
    return response.redirect().back()
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const schoolClass = await SchoolClass.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('academicYear')
      .preload('students')
      .first()

    if (!schoolClass) {
      return response.redirect('/classes')
    }

    return inertia.render('dashboard/classes/show', {
      kelas: schoolClass,
    })
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const schoolClass = await SchoolClass.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      return response.redirect('/classes')
    }

    const data = await request.validateUsing(updateClassValidator)
    await schoolClass.merge(data).save()

    session.flash('success', 'Kelas berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const schoolClass = await SchoolClass.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      return response.redirect('/classes')
    }

    await Student.query().where('class_id', schoolClass.id).delete()
    await schoolClass.delete()

    session.flash('success', 'Kelas berhasil dihapus')
    return response.redirect().back()
  }

  async addStudent({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const schoolClass = await SchoolClass.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      return response.redirect('/classes')
    }

    const data = await request.validateUsing(createStudentValidator)

    await Student.create({
      ...data,
      classId: schoolClass.id,
    })

    session.flash('success', 'Siswa berhasil ditambahkan')
    return response.redirect().back()
  }

  async removeStudent({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const student = await Student.query()
      .where('id', params.studentId)
      .whereHas('schoolClass', (q) => q.where('user_id', user.id))
      .first()

    if (!student) {
      return response.redirect('/classes')
    }

    await student.delete()

    session.flash('success', 'Siswa berhasil dihapus')
    return response.redirect().back()
  }
}
