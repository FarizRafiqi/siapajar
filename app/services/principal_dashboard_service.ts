import type User from '#models/user'
import { principalDashboardRepository } from '#repositories/principal_dashboard_repository'
import type { PrincipalDashboardRepository } from '#repositories/principal_dashboard_repository'

export class PrincipalDashboardService {
  constructor(
    private readonly dashboards: PrincipalDashboardRepository = principalDashboardRepository
  ) {}

  async getPageData(principal: User) {
    if (!principal.schoolId) {
      return { school: null, teachers: [] }
    }

    const teachers = await this.dashboards.getTeachersWithCounts(principal.schoolId)
    return {
      school: { id: principal.schoolId, name: principal.schoolName },
      teachers: teachers.map(({ teacher, classCount, studentCount }) => ({
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        educationLevel: teacher.educationLevel,
        classCount,
        studentCount,
      })),
    }
  }

  async getTeacherPageData(principal: User, teacherId: string | number) {
    const data = await this.dashboards.findTeacherDetail(principal.schoolId ?? -1, teacherId)
    if (!data) return null

    return {
      teacher: {
        id: data.teacher.id,
        fullName: data.teacher.fullName,
        email: data.teacher.email,
        educationLevel: data.teacher.educationLevel,
      },
      classes: data.classes.map((schoolClass) => schoolClass.toJSON()),
    }
  }
}

export const principalDashboardService = new PrincipalDashboardService()
