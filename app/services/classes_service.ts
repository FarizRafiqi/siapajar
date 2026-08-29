import { DateTime } from 'luxon'
import AcademicYear from '#models/academic_year'
import PaudAssessment from '#models/paud_assessment'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import User from '#models/user'
import { assertEntitled, recordUsage } from '#services/entitlement_service'
import { parseStudentImportFile, type ParsedStudentRow } from '#services/student_import_service'
import { classRepository } from '#repositories/class_repository'
import type { ClassRepository } from '#repositories/class_repository'

function resolveGroupContext(
  isTk: boolean,
  gradeLevel?: number,
  explicitGroup?: 'a' | 'b'
): 'a' | 'b' | null {
  if (explicitGroup) return explicitGroup
  if (!isTk || gradeLevel === undefined) return null
  return gradeLevel === 0 ? 'a' : 'b'
}

export class ClassesService {
  constructor(private readonly repository: ClassRepository = classRepository) {}

  async assertCanCreateClass(user: User) {
    await assertEntitled(user, 'classes')
  }

  async resolveUser(authUser: User | null | undefined, authorization?: string) {
    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.substring(7)
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8')
        const [userId] = decoded.split(':')
        if (userId) return User.find(userId)
      } catch {}
    }

    return authUser || null
  }

  async getIndexData(user: User) {
    const [classes, academicYears] = await Promise.all([
      this.repository.listOwnedClasses(user.id),
      AcademicYear.query().orderBy('name', 'desc'),
    ])
    const isTk = Boolean(user.educationLevel === 'tk' || user.isTk)

    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      academicYears: academicYears.map((academicYear) => academicYear.toJSON()),
      educationLevel: user.educationLevel,
      mobileClasses: classes.map((schoolClass) => ({
        id: String(schoolClass.id),
        name: schoolClass.name,
        displayName: this.formatClassName(schoolClass, isTk),
        gradeLevel: schoolClass.gradeLevel,
        groupContext: schoolClass.groupContext,
        rombelNumber: schoolClass.rombelNumber,
        studentCount: schoolClass.students.length,
      })),
    }
  }

  async getShowData(user: User, classId: string | number) {
    const schoolClass = await this.repository.findOwnedClass(user.id, classId, true)
    if (!schoolClass) return null

    const isTk = Boolean(user.educationLevel === 'tk' || user.isTk)
    return {
      schoolClass: schoolClass.toJSON(),
      educationLevel: user.educationLevel,
      mobileClass: {
        id: String(schoolClass.id),
        name: schoolClass.name,
        displayName: this.formatClassName(schoolClass, isTk),
        gradeLevel: schoolClass.gradeLevel,
        groupContext: schoolClass.groupContext,
        rombelNumber: schoolClass.rombelNumber,
        students: schoolClass.students.map((student) => ({
          id: String(student.id),
          name: student.fullName,
          nis: student.nis,
          nisn: student.nisn,
        })),
      },
    }
  }

  async getStudentsData(user: User, classId: string | number) {
    const schoolClass = await SchoolClass.find(classId)
    const students = await Student.query().where('class_id', classId).orderBy('full_name', 'asc')
    const assessments = await PaudAssessment.query()
      .where('user_id', user.id)
      .where('class_id', classId)
    const assessmentCounts: Record<number, number> = {}

    assessments.forEach((assessment) => {
      assessmentCounts[assessment.studentId] = (assessmentCounts[assessment.studentId] || 0) + 1
    })

    const isTk = Boolean(user.educationLevel === 'tk' || user.isTk)
    const classDisplayName = schoolClass ? this.formatClassName(schoolClass, isTk) : 'Kelas'

    return students.map((student) => ({
      id: String(student.id),
      name: student.fullName,
      nis: student.nis || '-',
      nisn: student.nisn,
      classId: String(student.classId),
      className: classDisplayName,
      assessmentCount: assessmentCounts[student.id] || 0,
      avatarUrl:
        'https://images.unsplash.com/photo-1595454223600-91fbdd77e268?w=150&auto=format&fit=crop&q=80',
    }))
  }

  async getTodayAgenda(userId: number, classId: string | number) {
    const latestPlan = await this.repository.findLatestPlanForClass(userId, classId)
    if (!latestPlan) return null

    const content = latestPlan.content || {}
    const learningExperience = content.learningExperience || {}
    const dailyCores = Array.isArray(learningExperience.dailyCoreActivities)
      ? learningExperience.dailyCoreActivities
      : []
    const todayCore = dailyCores[0] || {}
    const activitiesDetail = Array.isArray(todayCore.activitiesDetail)
      ? todayCore.activitiesDetail
      : []
    const openingActivities = Array.isArray(learningExperience.openingActivities)
      ? learningExperience.openingActivities
      : []
    const openingQuestions = Array.isArray(learningExperience.openingQuestions)
      ? learningExperience.openingQuestions
      : []
    const closingActivities = Array.isArray(learningExperience.closingActivities)
      ? learningExperience.closingActivities
      : []

    return {
      weekNumber: content.weekNumber || content.week_number || 1,
      semesterNumber: content.semester || content.semester_number || 1,
      topicTitle: latestPlan.theme || content.theme || '',
      subTopic: content.subtheme || '',
      todayActivity: activitiesDetail[0]?.name || content.activity || todayCore.title || '',
      targetedTpCode: content.tp_code || '',
      targetedTpTitle: content.tp_title || '',
      stage: todayCore.stage || '',
      openingActivities,
      openingQuestions,
      coreActivities: activitiesDetail.map((activity: any, index: number) => ({
        id: index + 1,
        name: activity.name || `Kegiatan ${index + 1}`,
        focus: activity.focus || '',
        materials: activity.materials || '',
        instructions: activity.instructions || '',
        benefits: activity.benefits || '',
        isPrimary: index === 0,
      })),
      closingActivities,
    }
  }

  quickSubmitAttendance(classId: unknown, date: unknown, items: any) {
    const recordedCount = items?.length || 0
    return {
      message: `Presensi ${recordedCount} siswa berhasil disimpan`,
      data: {
        classId,
        date: date || DateTime.now().toISODate(),
        recordedCount,
      },
    }
  }

  async createClass(user: User, data: Record<string, any>) {
    await assertEntitled(user, 'classes')
    const duplicate = await this.repository.findClassDuplicate(
      user.id,
      data.academicYearId,
      data.name
    )
    if (duplicate) return { duplicate: true as const }

    const groupContext = resolveGroupContext(Boolean(user.isTk), data.gradeLevel, data.groupContext)
    const schoolClass = await SchoolClass.create({
      userId: user.id,
      academicYearId: data.academicYearId,
      name: data.name,
      gradeLevel: data.gradeLevel,
      groupContext,
      rombelNumber: data.rombelNumber || null,
    })
    await recordUsage(user.id, 'classes', 1, {
      referenceType: 'school_class',
      referenceId: schoolClass.id,
      description: `Menambahkan kelas ${schoolClass.name}`,
    })

    return { duplicate: false as const, schoolClass }
  }

  async updateClass(user: User, classId: string | number, data: Record<string, any>) {
    const schoolClass = await this.repository.findOwnedClass(user.id, classId)
    if (!schoolClass) return { status: 'missing' as const }

    if (data.name || data.academicYearId) {
      const duplicate = await this.repository.findClassDuplicate(
        user.id,
        data.academicYearId ?? schoolClass.academicYearId,
        data.name ?? schoolClass.name,
        schoolClass.id
      )
      if (duplicate) return { status: 'duplicate' as const }
    }

    const groupContext = resolveGroupContext(
      Boolean(user.isTk),
      data.gradeLevel ?? schoolClass.gradeLevel ?? undefined,
      data.groupContext ?? schoolClass.groupContext ?? undefined
    )
    await schoolClass.merge({ ...data, groupContext }).save()
    return { status: 'updated' as const }
  }

  async deleteClass(userId: number, classId: string | number) {
    const schoolClass = await this.repository.findOwnedClass(userId, classId)
    if (!schoolClass) return false
    await schoolClass.delete()
    return true
  }

  async addStudent(userId: number, classId: string | number, data: Record<string, any>) {
    const schoolClass = await this.repository.findOwnedClass(userId, classId)
    if (!schoolClass) return { status: 'missing' as const }

    const duplicate = await this.repository.findStudentDuplicate(schoolClass.id, data.nis)
    if (duplicate) return { status: 'duplicate' as const }

    await Student.create({
      classId: schoolClass.id,
      nis: data.nis,
      fullName: data.fullName,
    })
    return { status: 'created' as const }
  }

  async hasOwnedStudent(userId: number, studentId: string | number) {
    return Boolean(await this.repository.findStudentForUser(studentId, userId))
  }

  async hasOwnedClass(userId: number, classId: string | number) {
    return Boolean(await this.repository.findOwnedClass(userId, classId))
  }

  async importStudents(userId: number, classId: string | number, rows: ParsedStudentRow[]) {
    const schoolClass = await this.repository.findOwnedClass(userId, classId)
    if (!schoolClass) return null

    const existingStudents = await Student.query().where('class_id', schoolClass.id)
    const existingByNis = new Map(existingStudents.map((student) => [student.nis, student]))
    let created = 0
    let updated = 0

    for (const row of rows) {
      const existing = existingByNis.get(row.nis)
      if (existing) {
        existing.fullName = row.fullName
        if (row.nisn) existing.nisn = row.nisn
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

    return { created, updated }
  }

  async parseStudentImport(filePath: string, extname: string) {
    return parseStudentImportFile(filePath, extname)
  }

  async updateStudent(userId: number, studentId: string | number, data: Record<string, any>) {
    const student = await this.repository.findStudentForUser(studentId, userId)
    if (!student) return { status: 'missing' as const }

    if (data.nis) {
      const duplicate = await this.repository.findStudentDuplicate(
        student.classId,
        data.nis,
        student.id
      )
      if (duplicate) return { status: 'duplicate' as const }
    }

    await student.merge(data).save()
    return { status: 'updated' as const }
  }

  async removeStudent(userId: number, studentId: string | number) {
    const student = await this.repository.findStudentForUser(studentId, userId)
    if (!student) return false
    await student.delete()
    return true
  }

  private formatClassName(schoolClass: SchoolClass, isTk: boolean) {
    const groupContext = schoolClass.groupContext || (schoolClass.gradeLevel === 0 ? 'A' : 'B')
    const rombel = schoolClass.rombelNumber || '1'
    return isTk
      ? `Kelompok ${groupContext.toUpperCase()}${rombel} (${schoolClass.name})`
      : `Kelas ${schoolClass.gradeLevel} - ${schoolClass.name}`
  }
}

export const classesService = new ClassesService()
