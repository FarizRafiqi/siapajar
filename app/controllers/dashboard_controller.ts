import type { HttpContext } from '@adonisjs/core/http'
import { dashboardService } from '#services/dashboard_service'

export default class DashboardController {
  async panel({ inertia, auth, response }: HttpContext) {
    const user = auth.user!

    if (user.isAdmin) {
      return response.redirect().toRoute('dashboard')
    }

    if (user.isKepalaSekolah) {
      return response.redirect().toRoute('principal.index')
    }

    return inertia.render('dashboard/panel/index', {
      ...(await dashboardService.getPanelData(user)),
    })
  }

  async index({ inertia, auth, response }: HttpContext) {
    const user = auth.user!

    if (user.isKepalaSekolah) {
      return response.redirect().toRoute('principal.index')
    }

    return inertia.render('dashboard/index', await dashboardService.getPageData(user))
  }
}
