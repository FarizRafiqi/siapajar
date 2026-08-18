import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import AcademicYear from '#models/academic_year'
import { createClassValidator, updateClassValidator } from '#validators/class'
import { createStudentValidator, updateStudentValidator } from '#validators/student'
import { parseStudentImportFile } from '#services/student_import_service'
import { assertEntitled, recordUsage } from '#services/entitlement_service'

function resolveGroupContext(
  isTk: boolean,
  gradeLevel?: number,
  explicitGroup?: 'a' | 'b'
): 'a' | 'b' | null {
  if (explicitGroup) return explicitGroup
  if (!isTk || gradeLevel === undefined) return null
  return gradeLevel === 0 ? 'a' : 'b'
}

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
      classes: classes.map((c) => c.toJSON()),
      academicYears: academicYears.map((y) => y.toJSON()),
      educationLevel: user.educationLevel,
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

    await SchoolClass.create({
      ...data,
      userId: user.id,
      groupContext: groupCtx,
      rombelNumber: data.rombelNumber || null,
    })
    await recordUsage(user.id, 'classes')

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
      schoolClass: schoolClass.toJSON(),
      educationLevel: user.educationLevel,
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
    const groupCtx =
      data.gradeLevel !== undefined
        ? resolveGroupContext(Boolean(user.isTk), data.gradeLevel, data.groupContext)
        : schoolClass.groupContext

    await schoolClass
      .merge({
        ...data,
        groupContext: groupCtx,
        rombelNumber:
          data.rombelNumber !== undefined ? data.rombelNumber || null : schoolClass.rombelNumber,
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

    const duplicate = await Student.query()
      .where('class_id', schoolClass.id)
      .where('nis', data.nis)
      .first()

    if (duplicate) {
      session.flash('error', `NIS ${data.nis} sudah terdaftar di kelas ini`)
      return response.redirect().back()
    }

    await Student.create({
      ...data,
      classId: schoolClass.id,
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

    const file = request.file('file', { extnames: ['csv', 'xlsx'], size: '5mb' })

    if (!file?.tmpPath) {
      session.flash('error', 'Pilih file CSV atau Excel (.xlsx) untuk diimpor')
      return response.redirect().back()
    }

    if (!file.isValid) {
      session.flash('error', file.errors.map((e) => e.message).join(', ') || 'File tidak valid')
      return response.redirect().back()
    }

    const { rows, errors: parseErrors } = await parseStudentImportFile(
      file.tmpPath,
      file.extname ?? 'xlsx'
    )

    if (rows.length === 0) {
      session.flash(
        'error',
        parseErrors[0] ?? 'Tidak ada data siswa yang valid ditemukan dalam file'
      )
      return response.redirect().back()
    }

    // Satu query di awal (bukan satu query per baris) — existingByNis diperbarui
    // di setiap iterasi supaya NIS duplikat di dalam file yang sama diperlakukan
    // sebagai update berurutan, bukan dua insert yang melanggar unique constraint.
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
