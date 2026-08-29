import { DateTime } from 'luxon'
import type User from '#models/user'
import { creditTransactionRepository } from '#repositories/credit_transaction_repository'
import type { CreditTransactionRepository } from '#repositories/credit_transaction_repository'
import { paymentInvoiceRepository } from '#repositories/payment_invoice_repository'
import type { PaymentInvoiceRepository } from '#repositories/payment_invoice_repository'
import { packageSubscriptionRepository } from '#repositories/package_subscription_repository'
import type { PackageSubscriptionRepository } from '#repositories/package_subscription_repository'
import { usageEventRepository } from '#repositories/usage_event_repository'
import type { UsageEventRepository } from '#repositories/usage_event_repository'
import { getFeatureLabel } from '#services/entitlement_service'

export type BillingPaginationInput = {
  invoicePage?: unknown
  invoicePerPage?: unknown
  subscriptionPage?: unknown
  subscriptionPerPage?: unknown
}

export class BillingService {
  constructor(
    private readonly invoices: PaymentInvoiceRepository = paymentInvoiceRepository,
    private readonly transactions: CreditTransactionRepository = creditTransactionRepository,
    private readonly subscriptions: PackageSubscriptionRepository = packageSubscriptionRepository,
    private readonly usageEvents: UsageEventRepository = usageEventRepository
  ) {}

  async getOverview(user: User) {
    const [invoices, transactions] = await Promise.all([
      this.invoices.listRecentForUser(user.id),
      this.transactions.listRecentForUser(user.id),
    ])

    return {
      creditsBalance: user.creditsBalance ?? 0,
      invoices: invoices.map((invoice) => invoice.toJSON()),
      transactions: transactions.map((transaction) => transaction.toJSON()),
    }
  }

  async getPackagePage(user: User, input: BillingPaginationInput = {}) {
    const invoicePage = this.normalizePage(input.invoicePage)
    const invoicePerPage = this.normalizePerPage(input.invoicePerPage)
    const subscriptionPage = this.normalizePage(input.subscriptionPage)
    const subscriptionPerPage = this.normalizePerPage(input.subscriptionPerPage)

    await user.load('package', (query) => query.preload('entitlements'))

    const [invoices, activeSubscription, subscriptions] = await Promise.all([
      this.invoices.paginateForUser(user.id, invoicePage, invoicePerPage),
      this.subscriptions.findActiveForUser(user.id, DateTime.now(), { preloadPackage: true }),
      this.subscriptions.paginateForUser(user.id, subscriptionPage, subscriptionPerPage),
    ])

    return {
      package: user.package?.toJSON() ?? null,
      activeSubscription: activeSubscription?.toJSON() ?? null,
      invoices: invoices.all().map((invoice) => invoice.toJSON()),
      invoiceMeta: invoices.getMeta(),
      subscriptions: subscriptions.all().map((subscription) => subscription.toJSON()),
      subscriptionMeta: subscriptions.getMeta(),
    }
  }

  async getUsagePage(user: User) {
    const periodStart = DateTime.now().startOf('month').toISODate()!
    await user.load('package', (query) => query.preload('entitlements'))

    const usage = await this.usageEvents.summarizeForUserPeriod(user.id, periodStart)
    const limits = new Map(
      (user.package?.entitlements ?? []).map((entitlement) => [
        entitlement.featureKey,
        entitlement.limitValue,
      ])
    )
    const usedByFeature = new Map(usage.map((item) => [item.event_key, Number(item.total ?? 0)]))
    const featureKeys = new Set([...limits.keys(), ...usedByFeature.keys()])

    return {
      periodLabel: DateTime.fromISO(periodStart).setLocale('id').toFormat('LLLL yyyy'),
      usage: [...featureKeys].sort().map((featureKey) => ({
        featureKey,
        label: getFeatureLabel(featureKey),
        used: usedByFeature.get(featureKey) ?? 0,
        limit: limits.get(featureKey) ?? null,
      })),
    }
  }

  async getSubscriptionsPage(user: User) {
    const subscriptions = await this.subscriptions.listForUser(user.id)

    return {
      subscriptions: subscriptions.map((subscription) => subscription.toJSON()),
    }
  }

  private normalizePage(value: unknown) {
    return Math.max(1, Number.parseInt(String(value ?? '1'), 10) || 1)
  }

  private normalizePerPage(value: unknown) {
    const parsed = Number.parseInt(String(value ?? '10'), 10)
    return [5, 10, 20, 50].includes(parsed) ? parsed : 10
  }
}

export const billingService = new BillingService()
