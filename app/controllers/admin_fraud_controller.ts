import type { HttpContext } from '@adonisjs/core/http'
import { adminFraudService } from '#services/admin_fraud_service'

export default class AdminFraudController {
  async index({ inertia, request }: HttpContext) {
    const page = Math.max(Number(request.input('page', 1)) || 1, 1)
    const perPage = Math.min(Math.max(Number(request.input('perPage', 15)) || 15, 5), 50)
    return inertia.render(
      'dashboard/admin/fraud/index' as any,
      (await adminFraudService.list(page, perPage, request.input('status'))) as any
    )
  }

  async review({ auth, params, request, response, session }: HttpContext) {
    const status =
      request.input('status') === 'approved'
        ? 'approved'
        : request.input('status') === 'rejected'
          ? 'rejected'
          : null
    if (!status) return response.badRequest({ message: 'Status review tidak valid.' })
    const fraudCase = await adminFraudService.review(Number(params.id), auth.user!.id, status)
    if (!fraudCase) return response.notFound({ message: 'Kasus tidak ditemukan.' })
    session.flash('success', 'Status review kasus diperbarui. Entitlement tidak diubah otomatis.')
    return response.redirect().back()
  }
}
