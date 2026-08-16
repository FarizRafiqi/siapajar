import type { HttpContext } from '@adonisjs/core/http'
import Package from '#models/package'
import PackageEntitlement from '#models/package_entitlement'
import { getFeatureLabel } from '#services/entitlement_service'

const DEFAULT_FEATURES = [
  'classes',
  'ai_generation_monthly',
  'ai_image_generation_monthly',
  'ai_svg_generation_monthly',
  'export_pdf',
  'export_docx',
  'export_pptx',
  'export_xlsx',
  'custom_atp',
  'custom_iktp',
]

export default class AdminEntitlementsController {
  async index({ inertia }: HttpContext) {
    const packages = await Package.query().preload('entitlements').orderBy('sort_order', 'asc')
    return inertia.render('dashboard/admin/entitlements/index', {
      packages: packages.map((pkg) => ({
        ...pkg.toJSON(),
        entitlements: DEFAULT_FEATURES.map((featureKey) => {
          const entitlement = pkg.entitlements.find((item) => item.featureKey === featureKey)
          return {
            featureKey,
            label: getFeatureLabel(featureKey),
            isEnabled: entitlement?.isEnabled ?? false,
            limitValue: entitlement?.limitValue ?? null,
          }
        }),
      })),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const pkg = await Package.find(params.id)
    if (!pkg) return response.redirect('/admin/entitlements')

    const payload = request.only(['featureKey', 'isEnabled', 'limitValue'])
    await PackageEntitlement.updateOrCreate(
      { packageId: pkg.id, featureKey: payload.featureKey },
      {
        isEnabled: payload.isEnabled === true || payload.isEnabled === 'true',
        limitValue:
          payload.limitValue === '' || payload.limitValue === null
            ? null
            : Number(payload.limitValue),
      }
    )
    session.flash('success', 'Hak fitur paket berhasil diperbarui')
    return response.redirect().back()
  }
}
