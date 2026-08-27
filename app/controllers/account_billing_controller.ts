import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import PackageSubscription from '#models/package_subscription'
import PaymentInvoice from '#models/payment_invoice'
import CreditTransaction from '#models/credit_transaction'
import { getFeatureLabel } from '#services/entitlement_service'

export default class AccountBillingController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const invoices = await PaymentInvoice.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(20)

    const transactions = await CreditTransaction.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(20)

    return inertia.render('dashboard/billing/index', {
      creditsBalance: user.creditsBalance ?? 0,
      invoices: invoices.map((inv) => inv.toJSON()),
      transactions: transactions.map((trx) => trx.toJSON()),
    })
  }
  async package({ inertia, auth }: HttpContext) {
    const user = auth.user!
    await user.load('package', (query) => query.preload('entitlements'))
    const activeSubscription = await PackageSubscription.query()
      .where('user_id', user.id)
      .where('status', 'active')
      .where((query) => query.whereNull('ends_at').orWhere('ends_at', '>', DateTime.now().toSQL()))
      .preload('package')
      .orderBy('starts_at', 'desc')
      .first()

    return inertia.render('dashboard/billing/package', {
      package: user.package?.toJSON() ?? null,
      activeSubscription: activeSubscription?.toJSON() ?? null,
    })
  }

  async usage({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const periodStart = DateTime.now().startOf('month').toISODate()!
    await user.load('package', (query) => query.preload('entitlements'))
    const usage = await db
      .from('usage_events')
      .where('user_id', user.id)
      .where('period_start', periodStart)
      .select('event_key')
      .sum('quantity as total')
      .groupBy('event_key')
      .orderBy('event_key')

    const limits = new Map(
      (user.package?.entitlements ?? []).map((entitlement) => [
        entitlement.featureKey,
        entitlement.limitValue,
      ])
    )

    const usedByFeature = new Map(usage.map((item) => [item.event_key, Number(item.total ?? 0)]))
    const featureKeys = new Set([...limits.keys(), ...usedByFeature.keys()])

    return inertia.render('dashboard/billing/usage', {
      periodLabel: DateTime.fromISO(periodStart).setLocale('id').toFormat('LLLL yyyy'),
      usage: [...featureKeys].sort().map((featureKey) => ({
        featureKey,
        label: getFeatureLabel(featureKey),
        used: usedByFeature.get(featureKey) ?? 0,
        limit: limits.get(featureKey) ?? null,
      })),
    })
  }

  async subscriptions({ inertia, auth }: HttpContext) {
    const subscriptions = await PackageSubscription.query()
      .where('user_id', auth.user!.id)
      .preload('package')
      .orderBy('starts_at', 'desc')

    return inertia.render('dashboard/billing/subscriptions', {
      subscriptions: subscriptions.map((subscription) => subscription.toJSON()),
    })
  }
}
