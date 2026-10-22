import type { HttpContext } from '@adonisjs/core/http'
import { packageService } from '#services/package_service'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    return inertia.render('home', { packages: await packageService.listForLandingPricing() })
  }

  async packages({ response }: HttpContext) {
    return response.ok(await packageService.listActiveForPublic())
  }
}
