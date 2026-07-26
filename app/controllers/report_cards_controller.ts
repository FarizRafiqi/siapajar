import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import { computeClassReportCard, compileNarrativeReport } from '#services/report_card_service'
import { exportReportCardPdf, exportNarrativeReportPdf } from '#services/pdf_export_service'

export default class ReportCardsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .preload('academicYear')
      .orderBy('name')

    const semesters = await Semester.query()
      .preload('academicYear')
      .orderBy('academic_year_id', 'desc')
      .orderBy('name')

    return inertia.render('dashboard/report-cards/index', {
      classes: classes.map((c) => c.toJSON()),
      semesters: semesters.map((s) => s.toJSON()),
      isTk: user.isTk,
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)

    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .preload('academicYear')
      .first()

    if (!schoolClass) {
      return response.redirect('/report-cards')
    }

    const semester = await Semester.query().where('id', semesterId).preload('academicYear').first()

    if (!semester) {
      return response.redirect('/report-cards')
    }

    if (user.isTk) {
      const narrative = await compileNarrativeReport(classId, semesterId, user.id)
      return inertia.render('dashboard/report-cards/show', {
        mode: 'narrative' as const,
        schoolClass: schoolClass.toJSON(),
        semester: semester.toJSON(),
        narrative,
      })
    }

    const report = await computeClassReportCard(classId, semesterId, user.id)
    return inertia.render('dashboard/report-cards/show', {
      mode: 'numeric' as const,
      schoolClass: schoolClass.toJSON(),
      semester: semester.toJSON(),
      report,
    })
  }

  async exportPdf({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const studentId = Number(params.studentId)

    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      return response.redirect('/report-cards')
    }

    const semester = await Semester.query().where('id', semesterId).preload('academicYear').first()

    if (!semester) {
      return response.redirect('/report-cards')
    }

    const semesterLabel = `${semester.name} ${semester.academicYear.name}`

    if (user.isTk) {
      const narrative = await compileNarrativeReport(classId, semesterId, user.id)
      const studentNarrative = narrative.find((n) => n.studentId === studentId)

      if (!studentNarrative) {
        return response.redirect(`/report-cards/${classId}/${semesterId}`)
      }

      const buffer = await exportNarrativeReportPdf(studentNarrative, user, {
        className: schoolClass.name,
        semesterLabel,
        totalStudents: narrative.length,
      })
      response.header('Content-Type', 'application/pdf')
      response.header(
        'Content-Disposition',
        `attachment; filename="Rapor ${studentNarrative.fullName}.pdf"`
      )
      return response.send(buffer)
    }

    const { students } = await computeClassReportCard(classId, semesterId, user.id)
    const studentReport = students.find((s) => s.studentId === studentId)

    if (!studentReport) {
      return response.redirect(`/report-cards/${classId}/${semesterId}`)
    }

    const buffer = await exportReportCardPdf(studentReport, user, {
      className: schoolClass.name,
      semesterLabel,
      totalStudents: students.length,
    })
    response.header('Content-Type', 'application/pdf')
    response.header(
      'Content-Disposition',
      `attachment; filename="Rapor ${studentReport.fullName}.pdf"`
    )
    return response.send(buffer)
  }
}
