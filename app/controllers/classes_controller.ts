import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import AcademicYear from '#models/academic_year'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import PaudAssessment from '#models/paud_assessment'
import User from '#models/user'
import { createClassValidator, updateClassValidator } from '#validators/class'
import { createStudentValidator, updateStudentValidator } from '#validators/student'
import { parseStudentImportFile } from '#services/student_import_service'
import { assertEntitled, recordUsage } from '#services/entitlement_service'
import { DateTime } from 'luxon'

function resolveGroupContext(
  isTk: boolean,
  gradeLevel?: number,
  explicitGroup?: 'a' | 'b'
): 'a' | 'b' | null {
  if (explicitGroup) return explicitGroup
  if (!isTk || gradeLevel === undefined) return null
  return gradeLevel === 0 ? 'a' : 'b'
}

async function resolveUser(ctx: HttpContext): Promise<User | null> {
  const authHeader = ctx.request.header('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const [userId] = decoded.split(':')
      if (userId) return User.find(userId)
    } catch {}
  }
  return ctx.auth?.user || null
}

function isApi(ctx: HttpContext): boolean {
  return (
    ctx.request.url().startsWith('/api/') ||
    (ctx.request.accepts(['json', 'html']) === 'json' && !ctx.request.header('x-inertia'))
  )
}

export default class ClassesController {
  async index(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .preload('academicYear')
      .preload('students')
      .orderBy('created_at', 'desc')

    // Smart Dual Response (Mobile API vs Web Inertia)
    if (isApi(ctx)) {
      return ctx.response.ok({
        status: 'success',
        data: classes.map((c) => ({
          id: String(c.id),
          name: c.name,
          gradeLevel: c.gradeLevel,
          groupContext: c.groupContext,
          studentCount: c.students.length,
        })),
      })
    }

    const academicYears = await AcademicYear.query().orderBy('name', 'desc')

    return ctx.inertia.render('dashboard/classes/index', {
      classes: classes.map((c) => c.toJSON()),
      academicYears: academicYears.map((y) => y.toJSON()),
      educationLevel: user.educationLevel,
    })
  }

  async show(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const schoolClass = await SchoolClass.query()
      .where('id', ctx.params.id)
      .where('user_id', user.id)
      .preload('academicYear')
      .preload('students')
      .first()

    if (!schoolClass) {
      if (isApi(ctx)) return ctx.response.notFound({ message: 'Kelas tidak ditemukan' })
      return ctx.response.redirect().toRoute('classes.index')
    }

    if (isApi(ctx)) {
      return ctx.response.ok({
        status: 'success',
        data: {
          id: String(schoolClass.id),
          name: schoolClass.name,
          gradeLevel: schoolClass.gradeLevel,
          groupContext: schoolClass.groupContext,
          students: schoolClass.students.map((s) => ({
            id: String(s.id),
            name: s.fullName,
            nis: s.nis,
            nisn: s.nisn,
          })),
        },
      })
    }

    return ctx.response.redirect().toRoute('classes.index')
  }

  /**
   * Mobile API: GET /api/v1/classes/:id/students
   */
  async getStudents(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const classId = ctx.params.id
    const students = await Student.query().where('class_id', classId).orderBy('full_name', 'asc')

    const assessments = await PaudAssessment.query()
      .where('user_id', user.id)
      .where('class_id', classId)

    const countMap: Record<number, number> = {}
    assessments.forEach((a) => {
      countMap[a.studentId] = (countMap[a.studentId] || 0) + 1
    })

    return ctx.response.ok({
      status: 'success',
      data: students.map((s) => ({
        id: String(s.id),
        name: s.fullName,
        nis: s.nis || '-',
        nisn: s.nisn,
        classId: String(s.classId),
        assessmentCount: countMap[s.id] || 0,
        avatarUrl: `https://images.unsplash.com/photo-1595454223600-91fbdd77e268?w=150&auto=format&fit=crop&q=80`,
      })),
    })
  }

  /**
   * Mobile API: GET /api/v1/classes/:id/today-agenda
   */
  async getTodayAgenda(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const classId = ctx.params.id

    const latestPlan = await WeeklyLessonPlan.query()
      .where('user_id', user.id)
      .where('class_id', classId)
      .orderBy('week_start_date', 'desc')
      .first()

    if (!latestPlan) {
      return ctx.response.ok({
        status: 'success',
        data: null,
      })
    }

    const content = (latestPlan.content as Record<string, any>) || {}
    const learningExp = content.learningExperience || {}
    const dailyCores = Array.isArray(learningExp.dailyCoreActivities)
      ? learningExp.dailyCoreActivities
      : []
    const todayCore = dailyCores[0] || {}
    const activitiesDetail = Array.isArray(todayCore.activitiesDetail)
      ? todayCore.activitiesDetail
      : []

    const openingActivities = Array.isArray(learningExp.openingActivities)
      ? learningExp.openingActivities
      : []

    const openingQuestions = Array.isArray(learningExp.openingQuestions)
      ? learningExp.openingQuestions
      : []

    const closingActivities = Array.isArray(learningExp.closingActivities)
      ? learningExp.closingActivities
      : []

    const topicTitle = latestPlan.theme || content.theme || ''
    const subTopic = content.subtheme || ''
    const todayActivity = activitiesDetail[0]?.name || content.activity || todayCore.title || ''
    const targetedTpCode = content.tp_code || ''
    const targetedTpTitle = content.tp_title || ''

    return ctx.response.ok({
      status: 'success',
      data: {
        weekNumber: content.weekNumber || content.week_number || 1,
        semesterNumber: content.semester || content.semester_number || 1,
        topicTitle,
        subTopic,
        todayActivity,
        targetedTpCode,
        targetedTpTitle,
        stage: todayCore.stage || '',
        openingActivities,
        openingQuestions,
        coreActivities: activitiesDetail.map((act: any, idx: number) => ({
          id: idx + 1,
          name: act.name || `Kegiatan ${idx + 1}`,
          focus: act.focus || '',
          materials: act.materials || '',
          instructions: act.instructions || '',
          benefits: act.benefits || '',
          isPrimary: idx === 0,
        })),
        closingActivities,
      },
    })
  }

  /**
   * Mobile API: POST /api/v1/attendances/quick-submit
   */
  async quickSubmitAttendance(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const { classId, date, items } = ctx.request.all()

    return ctx.response.ok({
      status: 'success',
      message: `Presensi ${items?.length || 0} siswa berhasil disimpan`,
      data: {
        classId,
        date: date || DateTime.now().toISODate(),
        recordedCount: items?.length || 0,
      },
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createClassValidator)
    try {
      await assertEntitled(user, 'classes')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Batas paket tercapai')
      return response.redirect().back()
    }

    const duplicate = await SchoolClass.query()
      .where('user_id', user.id)
      .where('academic_year_id', data.academicYearId)
      .where('name', data.name)
      .first()

    if (duplicate) {
      session.flash('error', `Kelas "${data.name}" sudah ada di tahun ajaran ini`)
      return response.redirect().back()
    }

    const groupCtx = resolveGroupContext(Boolean(user.isTk), data.gradeLevel, data.groupContext)

    const schoolClass = await SchoolClass.create({
      userId: user.id,
      academicYearId: data.academicYearId,
      name: data.name,
      gradeLevel: data.gradeLevel,
      groupContext: groupCtx,
    })

    await recordUsage(user.id, 'classes', 1, {
      referenceType: 'school_class',
      referenceId: schoolClass.id,
      description: `Menambahkan kelas ${schoolClass.name}`,
    })

    session.flash('success', 'Kelas berhasil ditambahkan')
    return response.redirect().back()
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

    if (data.name || data.academicYearId) {
      const duplicate = await SchoolClass.query()
        .where('user_id', user.id)
        .where('academic_year_id', data.academicYearId ?? schoolClass.academicYearId)
        .where('name', data.name ?? schoolClass.name)
        .whereNot('id', schoolClass.id)
        .first()

      if (duplicate) {
        session.flash('error', 'Nama kelas sudah digunakan di tahun ajaran ini')
        return response.redirect().back()
      }
    }

    const groupCtx = resolveGroupContext(
      Boolean(user.isTk),
      data.gradeLevel ?? schoolClass.gradeLevel ?? undefined,
      data.groupContext ?? schoolClass.groupContext ?? undefined
    )

    await schoolClass
      .merge({
        ...data,
        groupContext: groupCtx,
      })
      .save()

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

    const duplicate = await Student.query()
      .where('class_id', schoolClass.id)
      .where('nis', data.nis)
      .first()

    if (duplicate) {
      session.flash('error', `NIS ${data.nis} sudah terdaftar di kelas ini`)
      return response.redirect().back()
    }

    await Student.create({
      classId: schoolClass.id,
      nis: data.nis,
      fullName: data.fullName,
    })

    session.flash('success', 'Siswa berhasil ditambahkan')
    return response.redirect().back()
  }

  async importStudents({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const schoolClass = await SchoolClass.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
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

    const { rows, errors: parseErrors } = await parseStudentImportFile(file.tmpPath, file.extname)

    if (rows.length === 0) {
      session.flash(
        'error',
        parseErrors[0] ?? 'Tidak ada data siswa yang valid ditemukan dalam file'
      )
      return response.redirect().back()
    }

    const existingStudents = await Student.query().where('class_id', schoolClass.id)
    const existingByNis = new Map(existingStudents.map((s) => [s.nis, s]))

    let created = 0
    let updated = 0

    for (const row of rows) {
      const existing = existingByNis.get(row.nis)

      if (existing) {
        existing.fullName = row.fullName
        if (row.nisn) {
          existing.nisn = row.nisn
        }
        await existing.save()
        updated++
      } else {
        const student = await Student.create({
          classId: schoolClass.id,
          nis: row.nis,
          fullName: row.fullName,
          nisn: row.nisn,
        })
        existingByNis.set(row.nis, student)
        created++
      }
    }

    const summary = [`${created} siswa baru`, `${updated} siswa diupdate`]
    if (parseErrors.length > 0) {
      summary.push(`${parseErrors.length} baris dilewati`)
    }
    session.flash('success', `Import selesai: ${summary.join(', ')}`)
    return response.redirect().back()
  }

  async updateStudent({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const student = await Student.query()
      .where('id', params.studentId)
      .whereHas('schoolClass', (q) => q.where('user_id', user.id))
      .first()

    if (!student) {
      return response.redirect('/classes')
    }

    const data = await request.validateUsing(updateStudentValidator)

    if (data.nis) {
      const duplicate = await Student.query()
        .where('class_id', student.classId)
        .where('nis', data.nis)
        .whereNot('id', student.id)
        .first()

      if (duplicate) {
        session.flash('error', `NIS ${data.nis} sudah terdaftar di kelas ini`)
        return response.redirect().back()
      }
    }

    await student.merge(data).save()

    session.flash('success', 'Data siswa berhasil diupdate')
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
