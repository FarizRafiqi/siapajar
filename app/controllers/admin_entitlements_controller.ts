import type { HttpContext } from '@adonisjs/core/http'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminEntitlementsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('dashboard/admin/entitlements/index', {
      packages: await adminCatalogService.listEntitlements(),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = request.only(['featureKey', 'isEnabled', 'limitValue'])
    const updated = await adminCatalogService.updateEntitlement(params.id, payload)
    if (!updated) return response.redirect('/admin/entitlements')
    session.flash('success', 'Hak fitur paket berhasil diperbarui')
    return response.redirect().back()
  }
}
