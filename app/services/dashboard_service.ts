import type User from '#models/user'
import { dashboardRepository } from '#repositories/dashboard_repository'
import type { DashboardRepository } from '#repositories/dashboard_repository'
import type { DashboardStats } from '#repositories/dashboard_repository'
import { resolveEducationProfile } from '#services/education_profile'

export class DashboardService {
  constructor(private readonly dashboards: DashboardRepository = dashboardRepository) {}

  async getPanelData(user: User) {
    return {
      educationLevel: user.educationLevel,
      institutionType: user.institutionType,
      stats: await this.dashboards.getTeacherStats(user.id),
    }
  }

  async getPageData(user: User) {
    const isPaud = resolveEducationProfile(
      user.educationLevel,
      user.institutionType
    ).isEarlyChildhood
    const isAdmin = user.isAdmin
    const [dashboard, recent] = await Promise.all([
      isAdmin
        ? this.dashboards.getAdminStats()
        : this.dashboards.getTeacherStats(user.id).then((stats: DashboardStats) => ({
            stats,
            adminStats: null,
          })),
      isAdmin ? Promise.resolve(null) : this.dashboards.getRecentResources(user.id),
    ])

    return {
      role: user.role,
      educationLevel: user.educationLevel,
      institutionType: user.institutionType,
      stats: dashboard.stats,
      adminStats: dashboard.adminStats,
      recentTeachingModules:
        isPaud || !recent ? [] : recent.teachingModules.map((item) => item.toJSON()),
      recentExams: isPaud || !recent ? [] : recent.exams.map((item) => item.toJSON()),
      recentLkpds: isPaud || !recent ? [] : recent.lkpds.map((item) => item.toJSON()),
      recentMediaModules: isPaud || !recent ? [] : recent.mediaModules.map((item) => item.toJSON()),
    }
  }
}

export const dashboardService = new DashboardService()
