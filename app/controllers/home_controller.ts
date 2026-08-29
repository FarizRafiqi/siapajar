import type { HttpContext } from '@adonisjs/core/http'
import Package from '#models/package'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const packages = await Package.query().where('is_active', true).orderBy('sort_order', 'asc')

    return inertia.render('home', {
      packages: packages.map((p) => p.toJSON()),
    })
  }

  async packages({ response }: HttpContext) {
    const packages = await Package.query().where('is_active', true).orderBy('sort_order', 'asc')
    return response.ok(packages.map((p) => p.toJSON()))
  }
}
