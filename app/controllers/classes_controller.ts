import type { HttpContext } from '@adonisjs/core/http'
import { createClassValidator, updateClassValidator } from '#validators/class'
import { createStudentValidator, updateStudentValidator } from '#validators/student'
import { classesService } from '#services/classes_service'

function isApi(ctx: HttpContext): boolean {
  return (
    ctx.request.url().startsWith('/api/') ||
    (ctx.request.accepts(['json', 'html']) === 'json' && !ctx.request.header('x-inertia'))
  )
}

export default class ClassesController {
  async index(ctx: HttpContext) {
    const user = await classesService.resolveUser(
      ctx.auth?.user,
      ctx.request.header('authorization')
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const data = await classesService.getIndexData(user)
    if (isApi(ctx)) {
      return ctx.response.ok({ status: 'success', data: data.mobileClasses })
    }

    return ctx.inertia.render('dashboard/classes/index', {
      classes: data.classes,
      academicYears: data.academicYears,
      educationLevel: data.educationLevel,
    })
  }

  async show(ctx: HttpContext) {
    const user = await classesService.resolveUser(
      ctx.auth?.user,
      ctx.request.header('authorization')
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const data = await classesService.getShowData(user, ctx.params.id)
    if (!data) {
      if (isApi(ctx)) return ctx.response.notFound({ message: 'Kelas tidak ditemukan' })
      return ctx.response.redirect().toRoute('classes.index')
    }

    if (isApi(ctx)) {
      return ctx.response.ok({ status: 'success', data: data.mobileClass })
    }

    return ctx.inertia.render('dashboard/classes/show', {
      schoolClass: data.schoolClass,
      educationLevel: data.educationLevel,
    })
  }

  /**
   * Mobile API: GET /api/v1/classes/:id/students
   */
  async getStudents(ctx: HttpContext) {
    const user = await classesService.resolveUser(
      ctx.auth?.user,
      ctx.request.header('authorization')
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    return ctx.response.ok({
      status: 'success',
      data: await classesService.getStudentsData(user, ctx.params.id),
    })
  }

  /**
   * Mobile API: GET /api/v1/classes/:id/today-agenda
   */
  async getTodayAgenda(ctx: HttpContext) {
    const user = await classesService.resolveUser(
      ctx.auth?.user,
      ctx.request.header('authorization')
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    return ctx.response.ok({
      status: 'success',
      data: await classesService.getTodayAgenda(user.id, ctx.params.id),
    })
  }

  /**
   * Mobile API: POST /api/v1/attendances/quick-submit
   */
  async quickSubmitAttendance(ctx: HttpContext) {
    const user = await classesService.resolveUser(
      ctx.auth?.user,
      ctx.request.header('authorization')
    )
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const { classId, date, items } = ctx.request.all()
    const result = classesService.quickSubmitAttendance(classId, date, items)

    return ctx.response.ok({ status: 'success', ...result })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createClassValidator)
    try {
      await classesService.assertCanCreateClass(user)
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Batas paket tercapai')
      return response.redirect().back()
    }

    const result = await classesService.createClass(user, data)
    if (result.duplicate) {
      session.flash('error', `Kelas "${data.name}" sudah ada di tahun ajaran ini`)
      return response.redirect().back()
    }

    session.flash('success', 'Kelas berhasil ditambahkan')
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    if (!(await classesService.hasOwnedClass(user.id, params.id))) {
      return response.redirect('/classes')
    }

    const data = await request.validateUsing(updateClassValidator)
    const result = await classesService.updateClass(user, params.id, data)
    if (result.status === 'missing') return response.redirect('/classes')
    if (result.status === 'duplicate') {
      session.flash('error', 'Nama kelas sudah digunakan di tahun ajaran ini')
      return response.redirect().back()
    }

    session.flash('success', 'Kelas berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const deleted = await classesService.deleteClass(auth.user!.id, params.id)
    if (!deleted) return response.redirect('/classes')

    session.flash('success', 'Kelas berhasil dihapus')
    return response.redirect().back()
  }

  async addStudent({ params, request, response, session, auth }: HttpContext) {
    if (!(await classesService.hasOwnedClass(auth.user!.id, params.id))) {
      return response.redirect('/classes')
    }

    const data = await request.validateUsing(createStudentValidator)
    const result = await classesService.addStudent(auth.user!.id, params.id, data)
    if (result.status === 'missing') return response.redirect('/classes')
    if (result.status === 'duplicate') {
      session.flash('error', `NIS ${data.nis} sudah terdaftar di kelas ini`)
      return response.redirect().back()
    }

    session.flash('success', 'Siswa berhasil ditambahkan')
    return response.redirect().back()
  }

  async importStudents({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    if (!(await classesService.hasOwnedClass(user.id, params.id))) {
      return response.redirect('/classes')
    }

    const file = request.file('file', {
      size: '5mb',
      extnames: ['xlsx', 'xls', 'csv'],
    })
    if (!file || !file.isValid || !file.tmpPath || !file.extname) {
      session.flash('error', 'File tidak valid atau melebihi 5MB')
      return response.redirect().back()
    }

    const { rows, errors: parseErrors } = await classesService.parseStudentImport(
      file.tmpPath,
      file.extname
    )
    if (rows.length === 0) {
      session.flash(
        'error',
        parseErrors[0] ?? 'Tidak ada data siswa yang valid ditemukan dalam file'
      )
      return response.redirect().back()
    }

    const result = await classesService.importStudents(user.id, params.id, rows)
    if (!result) return response.redirect('/classes')

    const summary = [`${result.created} siswa baru`, `${result.updated} siswa diupdate`]
    if (parseErrors.length > 0) summary.push(`${parseErrors.length} baris dilewati`)
    session.flash('success', `Import selesai: ${summary.join(', ')}`)
    return response.redirect().back()
  }

  async updateStudent({ params, request, response, session, auth }: HttpContext) {
    if (!(await classesService.hasOwnedStudent(auth.user!.id, params.studentId))) {
      return response.redirect('/classes')
    }

    const data = await request.validateUsing(updateStudentValidator)
    const result = await classesService.updateStudent(auth.user!.id, params.studentId, data)
    if (result.status === 'missing') return response.redirect('/classes')
    if (result.status === 'duplicate') {
      session.flash('error', `NIS ${data.nis} sudah terdaftar di kelas ini`)
      return response.redirect().back()
    }

    session.flash('success', 'Data siswa berhasil diupdate')
    return response.redirect().back()
  }

  async removeStudent({ params, response, session, auth }: HttpContext) {
    const deleted = await classesService.removeStudent(auth.user!.id, params.studentId)
    if (!deleted) return response.redirect('/classes')

    session.flash('success', 'Data siswa berhasil dihapus')
    return response.redirect().back()
  }
}
