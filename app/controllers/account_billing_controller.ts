import type { HttpContext } from '@adonisjs/core/http'
import { billingService } from '#services/billing_service'

export default class AccountBillingController {
  async index({ inertia, auth }: HttpContext) {
    return inertia.render('dashboard/billing/index', await billingService.getOverview(auth.user!))
  }

  async package({ inertia, auth, request }: HttpContext) {
    return inertia.render(
      'dashboard/billing/package',
      await billingService.getPackagePage(auth.user!, {
        invoicePage: request.input('invoicePage', '1'),
        invoicePerPage: request.input('invoicePerPage', '10'),
        subscriptionPage: request.input('subscriptionPage', '1'),
        subscriptionPerPage: request.input('subscriptionPerPage', '10'),
      })
    )
  }

  async usage({ inertia, auth }: HttpContext) {
    return inertia.render('dashboard/billing/usage', await billingService.getUsagePage(auth.user!))
  }

  async subscriptions({ inertia, auth }: HttpContext) {
    return inertia.render(
      'dashboard/billing/subscriptions',
      await billingService.getSubscriptionsPage(auth.user!)
    )
  }
}
