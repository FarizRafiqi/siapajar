import db from '@adonisjs/lucid/services/db'
import type { DateTime } from 'luxon'
import AssessmentAttachment from '#models/assessment_attachment'
import LearningObjective from '#models/learning_objective'
import PaudAssessment from '#models/paud_assessment'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import Student from '#models/student'

export type PaudAssessmentType = 'checklist' | 'anecdotal_note' | 'work_sample' | 'photo_series'

export type PaudAssessmentCreateData = {
  userId: number
  classId: number
  semesterId: number | null
  studentId: number
  type: PaudAssessmentType
  date: DateTime
  content: Record<string, any>
  learningObjectiveId: number | null
  iktpIndicatorId: number | null
  achievementStatus: string | null
  activity: string | null
  teacherNote: string | null
  evidenceUrl: string | null
  evidenceType: string | null
}

export type PersistedPaudAttachment = {
  originalName: string
  storedName: string
  mimeType: string
  size: number
  displayOrder: number
}

export type PaudAssessmentBundleFilters = {
  classId?: number
  studentId?: number
  type?: PaudAssessmentType | 'all'
  theme?: string
  week?: string
}

export type PaudAttachmentFactory = (
  assessment: PaudAssessment
) => Promise<PersistedPaudAttachment[]>

export class PaudAssessmentRepository {
  async getIndexData(userId: number, includeReferenceData = true) {
    const assessments = await PaudAssessment.query()
      .where('user_id', userId)
      .preload('schoolClass')
      .preload('student')
      .preload('attachments', (query) => query.orderBy('display_order'))
      .orderBy('date', 'desc')

    if (!includeReferenceData) {
      return { assessments, classes: [], curriculumObjectives: [] }
    }

    const [classes, curriculumObjectives] = await Promise.all([
      SchoolClass.query().where('user_id', userId).preload('students').orderBy('name'),
      LearningObjective.query()
        .where((query) => query.whereNull('user_id').orWhere('user_id', userId))
        .preload('indicators')
        .orderBy('code'),
    ])

    return { assessments, classes, curriculumObjectives }
  }

  async findTimeline(studentId: string | number) {
    return PaudAssessment.query()
      .where('student_id', studentId)
      .preload('learningObjective')
      .preload('attachments', (query) => query.orderBy('display_order'))
      .orderBy('date', 'desc')
  }

  async findOwnedAssessment(assessmentId: string | number, userId: number, withRelations = false) {
    const query = PaudAssessment.query().where('id', assessmentId).where('user_id', userId)
    if (withRelations) {
      query
        .preload('schoolClass')
        .preload('student')
        .preload('attachments', (attachmentQuery) => attachmentQuery.orderBy('display_order'))
    }

    return query.first()
  }

  async findBundle(userId: number, filters: PaudAssessmentBundleFilters) {
    const query = PaudAssessment.query()
      .where('user_id', userId)
      .preload('schoolClass')
      .preload('student')
      .preload('attachments', (attachmentQuery) => attachmentQuery.orderBy('display_order'))
      .orderBy('date', 'desc')

    if (filters.classId) query.where('class_id', filters.classId)
    if (filters.studentId) query.where('student_id', filters.studentId)
    if (filters.type && filters.type !== 'all') query.where('type', filters.type)

    return query
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }

  async findStudentInClass(studentId: string | number, classId: string | number) {
    return Student.query().where('id', studentId).where('class_id', classId).first()
  }

  async findAvailableLearningObjective(objectiveId: string | number, userId: number) {
    return LearningObjective.query()
      .where('id', objectiveId)
      .where((query) => query.whereNull('user_id').orWhere('user_id', userId))
      .first()
  }

  async findActiveSemester(academicYearId: number) {
    return Semester.query()
      .where('academic_year_id', academicYearId)
      .where('is_active', true)
      .first()
  }

  async createWithAttachments(
    data: PaudAssessmentCreateData,
    createAttachments: PaudAttachmentFactory
  ) {
    return db.transaction(async (trx) => {
      const assessment = await PaudAssessment.create(data, { client: trx })
      const attachments = await createAttachments(assessment)

      for (const attachmentData of attachments) {
        const attachment = await AssessmentAttachment.create(
          {
            assessmentId: assessment.id,
            userId: data.userId,
            originalName: attachmentData.originalName,
            storedName: attachmentData.storedName,
            url: '',
            mimeType: attachmentData.mimeType,
            size: attachmentData.size,
            displayOrder: attachmentData.displayOrder,
          },
          { client: trx }
        )
        attachment.url = `/paud-assessments/${assessment.id}/attachments/${attachment.id}`
        await attachment.save()
      }

      return assessment
    })
  }

  async createQuickCapture(data: {
    userId: number
    classId: number
    studentIds: number[]
    type: PaudAssessmentType
    activity: string
    teacherNote: string
    date: DateTime
    attachment?: {
      originalName: string
      storedName: string
      size: number
      mimeType: string
    }
  }) {
    const assessments: PaudAssessment[] = []

    for (const studentId of data.studentIds) {
      const assessment = await PaudAssessment.create({
        userId: data.userId,
        classId: data.classId,
        studentId,
        type: data.type,
        activity: data.activity,
        teacherNote: data.teacherNote,
        date: data.date,
      })

      if (data.attachment) {
        await AssessmentAttachment.create({
          assessmentId: assessment.id,
          userId: data.userId,
          originalName: data.attachment.originalName,
          storedName: data.attachment.storedName,
          url: `/storage/assessments/${data.attachment.storedName}`,
          size: data.attachment.size,
          mimeType: data.attachment.mimeType,
          displayOrder: 1,
        })
      }

      assessments.push(assessment)
    }

    return assessments
  }

  async deleteWithAttachments(assessmentId: string | number, userId: number) {
    const assessment = await this.findOwnedAssessment(assessmentId, userId)
    if (!assessment) return null

    const attachments = await AssessmentAttachment.query().where('assessment_id', assessment.id)
    const storedNames = attachments.map((attachment) => attachment.storedName)

    await db.transaction(async (trx) => {
      await AssessmentAttachment.query({ client: trx })
        .where('assessment_id', assessment.id)
        .delete()
      await PaudAssessment.query({ client: trx }).where('id', assessment.id).delete()
    })

    return { assessmentId: assessment.id, storedNames }
  }
}

export const paudAssessmentRepository = new PaudAssessmentRepository()
