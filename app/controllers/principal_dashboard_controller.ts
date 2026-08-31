import type { HttpContext } from '@adonisjs/core/http'
import { principalDashboardService } from '#services/principal_dashboard_service'

export default class PrincipalDashboardController {
  async index({ inertia, auth }: HttpContext) {
    const principal = auth.user!

    return inertia.render(
      'dashboard/principal/index',
      await principalDashboardService.getPageData(principal)
    )
  }

  async teacher({ params, inertia, auth, response }: HttpContext) {
    const principal = auth.user!

    const data = await principalDashboardService.getTeacherPageData(principal, params.userId)
    if (!data) {
      return response.redirect('/principal')
    }

    return inertia.render('dashboard/principal/teacher', data)
  }
}
