import type User from '#models/user'
import { dashboardRepository } from '#repositories/dashboard_repository'
import type { DashboardRepository } from '#repositories/dashboard_repository'
import type { DashboardStats } from '#repositories/dashboard_repository'

export class DashboardService {
  constructor(private readonly dashboards: DashboardRepository = dashboardRepository) {}

  async getPanelData(user: User) {
    return {
      educationLevel: user.educationLevel,
      stats: await this.dashboards.getTeacherStats(user.id),
    }
  }

  async getPageData(user: User) {
    const isAdmin = user.isAdmin
    const [dashboard, recent] = await Promise.all([
      isAdmin
        ? this.dashboards.getAdminStats()
        : this.dashboards.getTeacherStats(user.id).then((stats: DashboardStats) => ({
            stats,
            adminStats: null,
          })),
      this.dashboards.getRecentResources(user.id),
    ])

    return {
      role: user.role,
      educationLevel: user.educationLevel,
      stats: dashboard.stats,
      adminStats: dashboard.adminStats,
      recentTeachingModules:
        user.educationLevel === 'tk' ? [] : recent.teachingModules.map((item) => item.toJSON()),
      recentExams: user.educationLevel === 'tk' ? [] : recent.exams.map((item) => item.toJSON()),
      recentLkpds: user.educationLevel === 'tk' ? recent.lkpds.map((item) => item.toJSON()) : [],
      recentMediaModules:
        user.educationLevel === 'tk' ? recent.mediaModules.map((item) => item.toJSON()) : [],
    }
  }
}

export const dashboardService = new DashboardService()
