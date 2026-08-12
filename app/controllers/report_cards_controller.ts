import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import { computeClassReportCard, compileNarrativeReport } from '#services/report_card_service'
import { exportReportCardPdf, exportNarrativeReportPdf } from '#services/pdf_export_service'
import { exportStudentReport, exportNarrativeReport } from '#services/export_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'
import ReportNarrative from '#models/report_narrative'
import ParentReflection from '#models/parent_reflection'
import Student from '#models/student'
import { DateTime } from 'luxon'
import GenerateNarratives from '#jobs/generate_narratives'
import { getStatus, sendDocument } from '#services/whatsapp_service'

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
      const waStatus = getStatus(user.id)
      return inertia.render('dashboard/report-cards/show', {
        mode: 'narrative' as const,
        schoolClass: schoolClass.toJSON(),
        semester: semester.toJSON(),
        narrative,
        waPaired: waStatus.paired,
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

  async exportPdf({ params, request, response, auth }: HttpContext) {
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

      const buffer = await exportNarrativeReportPdf(
        studentNarrative,
        user,
        {
          className: schoolClass.name,
          semesterLabel,
          totalStudents: narrative.length,
        },
        !wantsInlinePreview(request)
      )
      return sendExport(
        response,
        buffer,
        EXPORT_CONTENT_TYPES.pdf,
        exportFilename(['Rapor Perkembangan', studentNarrative.fullName, semesterLabel], 'pdf'),
        { inline: wantsInlinePreview(request) }
      )
    }

    const { students } = await computeClassReportCard(classId, semesterId, user.id)
    const studentReport = students.find((s) => s.studentId === studentId)

    if (!studentReport) {
      return response.redirect(`/report-cards/${classId}/${semesterId}`)
    }

    const buffer = await exportReportCardPdf(
      studentReport,
      user,
      {
        className: schoolClass.name,
        semesterLabel,
        totalStudents: students.length,
      },
      !wantsInlinePreview(request)
    )
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Rapor', studentReport.fullName, semesterLabel], 'pdf'),
      { inline: wantsInlinePreview(request) }
    )
  }

  async exportDocx({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const studentId = Number(params.studentId)
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()
    const semester = await Semester.query().where('id', semesterId).preload('academicYear').first()
    if (!schoolClass || !semester) return response.redirect('/report-cards')
    const semesterLabel = `${semester.name} ${semester.academicYear.name}`

    if (user.isTk) {
      const narrative = await compileNarrativeReport(classId, semesterId, user.id)
      const studentNarrative = narrative.find((item) => item.studentId === studentId)
      if (!studentNarrative) return response.redirect(`/report-cards/${classId}/${semesterId}`)
      const buffer = await exportNarrativeReport(studentNarrative, user, {
        className: schoolClass.name,
        semesterLabel,
      })
      return sendExport(
        response,
        buffer,
        EXPORT_CONTENT_TYPES.docx,
        exportFilename(['Rapor Perkembangan', studentNarrative.fullName, semesterLabel], 'docx')
      )
    }

    const { students } = await computeClassReportCard(classId, semesterId, user.id)
    const studentReport = students.find((item) => item.studentId === studentId)
    if (!studentReport) return response.redirect(`/report-cards/${classId}/${semesterId}`)
    const buffer = await exportStudentReport(studentReport, user, {
      className: schoolClass.name,
      semesterLabel,
      totalStudents: students.length,
    })
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Rapor', studentReport.fullName, semesterLabel], 'docx')
    )
  }

  async saveNarrative({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const studentId = Number(params.studentId)
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()
    const student = await Student.query().where('id', studentId).where('class_id', classId).first()
    if (!schoolClass || !student) return response.redirect('/report-cards')
    const payload = request.only(['element', 'content'])
    if (
      typeof payload.element !== 'string' ||
      typeof payload.content !== 'string' ||
      payload.content.trim().length === 0
    ) {
      session.flash('error', 'Isi narasi dan elemen terlebih dahulu')
      return response.redirect().back()
    }
    await ReportNarrative.updateOrCreate(
      { studentId, semesterId, element: payload.element },
      {
        userId: user.id,
        classId,
        studentId,
        semesterId,
        element: payload.element,
        content: payload.content.trim(),
        status: 'draft',
      }
    )
    session.flash('success', 'Narasi berhasil disimpan sebagai draft')
    return response.redirect().back()
  }

  async generateNarratives({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()
    if (!schoolClass) return response.redirect('/report-cards')
    const { jobId } = await GenerateNarratives.dispatch({
      userId: user.id,
      classId,
      semesterId,
    }).dedup({ id: `narratives:${user.id}:${classId}:${semesterId}`, ttl: '5m' })
    session.flash(
      'success',
      `Pembuatan draft narasi dimulai (job ${jobId}). Tinjau dan edit sebelum menyetujui.`
    )
    return response.redirect().back()
  }

  async approveNarrative({ params, response, session, auth }: HttpContext) {
    const narrative = await ReportNarrative.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .first()
    if (!narrative) return response.redirect('/report-cards')
    narrative.status = 'approved'
    narrative.approvedAt = DateTime.now()
    await narrative.save()
    session.flash('success', 'Narasi disetujui')
    return response.redirect().back()
  }

  async saveReflection({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const classId = Number(params.classId)
    const semesterId = Number(params.semesterId)
    const studentId = Number(params.studentId)

    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()
    const student = await Student.query().where('id', studentId).where('class_id', classId).first()
    if (!schoolClass || !student) return response.redirect('/report-cards')

    const payload = request.only(['content'])
    const content = typeof payload.content === 'string' ? payload.content.trim() : ''
    if (content.length > 2000) {
      session.flash('error', 'Refleksi orang tua maksimal 2000 karakter')
      return response.redirect().back()
    }

    await ParentReflection.updateOrCreate(
      { userId: user.id, studentId, semesterId },
      {
        userId: user.id,
        classId,
        studentId,
        semesterId,
        content,
      }
    )

    session.flash('success', 'Refleksi orang tua berhasil disimpan')
    return response.redirect().back()
  }

  async sendWhatsApp({ params, response, session, auth }: HttpContext) {
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

    const student = await Student.query().where('id', studentId).where('class_id', classId).first()
    if (!student) {
      return response.redirect(`/report-cards/${classId}/${semesterId}`)
    }

    if (!student.parentPhone || student.parentPhone.trim() === '') {
      session.flash('error', 'Lengkapi no. HP orang tua di data siswa dulu')
      return response.redirect().back()
    }

    const waStatus = getStatus(user.id)
    if (!waStatus.paired) {
      session.flash(
        'error',
        'WhatsApp belum terhubung. Silakan hubungkan WhatsApp terlebih dahulu.'
      )
      return response.redirect('/whatsapp')
    }

    const narrative = await compileNarrativeReport(classId, semesterId, user.id)
    const studentNarrative = narrative.find((n) => n.studentId === studentId)

    if (!studentNarrative) {
      return response.redirect(`/report-cards/${classId}/${semesterId}`)
    }

    const semesterLabel = `${semester.name} ${semester.academicYear.name}`

    try {
      const pdfBuffer = await exportNarrativeReportPdf(
        studentNarrative,
        user,
        {
          className: schoolClass.name,
          semesterLabel,
          totalStudents: narrative.length,
        },
        false
      )

      await sendDocument(
        user.id,
        student.parentPhone,
        pdfBuffer,
        `Rapor ${student.fullName} ${semester.name}.pdf`,
        `Rapor perkembangan ${student.fullName} - ${semesterLabel}. Terima kasih.`
      )

      session.flash(
        'success',
        `Rapor PDF berhasil dikirim ke WhatsApp orang tua ${student.fullName}`
      )
    } catch (error) {
      session.flash('error', (error as Error).message || 'Gagal mengirim rapor via WhatsApp')
    }

    return response.redirect().back()
  }
}
