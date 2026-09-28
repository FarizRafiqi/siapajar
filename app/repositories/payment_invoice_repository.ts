import PaymentInvoice from '#models/payment_invoice'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import CreditTransaction from '#models/credit_transaction'
import Package from '#models/package'
import PackageSubscription from '#models/package_subscription'
import { DateTime } from 'luxon'
import { auditLogRepository } from '#repositories/audit_log_repository'

export class PaymentInvoiceRepository {
  async listRecentForUser(userId: number, limit = 20) {
    return PaymentInvoice.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
  }

  async paginateForUser(userId: number, page: number, perPage: number) {
    return PaymentInvoice.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
  }

  async listPendingMayarForReconciliation(limit: number, excludedIds: number[] = []) {
    const query = PaymentInvoice.query()
      .where('paymentGateway', 'mayar')
      .where('status', 'pending')
      .where('createdAt', '<', DateTime.now().minus({ minutes: 10 }).toSQL())
      .orderByRaw("COALESCE(metadata->>'reconciliationCheckedAt', created_at::text) ASC")
      .orderBy('id', 'asc')
      .limit(limit)
    if (excludedIds.length) query.whereNotIn('id', excludedIds)
    return query
  }

  async markMayarReconciliationChecked(invoiceId: number) {
    const invoice = await PaymentInvoice.find(invoiceId)
    if (!invoice || invoice.status !== 'pending') return
    invoice.metadata = {
      ...(invoice.metadata ?? {}),
      reconciliationCheckedAt: DateTime.now().toISO(),
    }
    await invoice.save()
  }

  async hasPendingMayarForReconciliation(excludedIds: number[]) {
    const query = PaymentInvoice.query()
      .where('paymentGateway', 'mayar')
      .where('status', 'pending')
      .where('createdAt', '<', DateTime.now().minus({ minutes: 10 }).toSQL())
      .select('id')
      .limit(1)
    if (excludedIds.length) query.whereNotIn('id', excludedIds)
    return Boolean(await query.first())
  }

  async findOwnedByInvoiceNo(invoiceNo: string, userId: number) {
    return PaymentInvoice.query().where('invoiceNo', invoiceNo).where('userId', userId).first()
  }

  async findByWebhookReference(
    invoiceNo?: string,
    gatewayTransactionId?: string,
    gatewayInvoiceId?: string
  ) {
    if (invoiceNo) {
      const invoice = await PaymentInvoice.query()
        .where('payment_gateway', 'mayar')
        .where('invoiceNo', invoiceNo)
        .first()
      if (invoice) return invoice
    }

    if (gatewayTransactionId) {
      const invoice = await PaymentInvoice.query()
        .where('payment_gateway', 'mayar')
        .where('gatewayTransactionId', gatewayTransactionId)
        .first()
      if (invoice) return invoice
    }

    if (gatewayInvoiceId) {
      return PaymentInvoice.query()
        .where('payment_gateway', 'mayar')
        .where('gatewayInvoiceId', gatewayInvoiceId)
        .first()
    }

    return null
  }

  async settleVerifiedInvoice(input: {
    invoiceId: number
    gatewayTransactionId?: string | null
    paymentMethod?: string | null
    verifiedPayload: Record<string, unknown>
  }) {
    return db.transaction(async (trx) => {
      const invoice = await PaymentInvoice.query({ client: trx })
        .where('id', input.invoiceId)
        .forUpdate()
        .firstOrFail()
      if (invoice.status === 'paid') return invoice
      if (invoice.status !== 'pending') throw new Error('INVOICE_NOT_SETTLEABLE')
      if (!Number.isInteger(invoice.creditsAmount) || invoice.creditsAmount <= 0) {
        throw new Error('INVALID_INVOICE_CREDITS')
      }
      if (!Number.isInteger(invoice.grossAmount) || invoice.grossAmount <= 0) {
        throw new Error('INVALID_INVOICE_AMOUNT')
      }

      const user = await User.query({ client: trx })
        .where('id', invoice.userId)
        .forUpdate()
        .firstOrFail()
      const purchasedPackage = invoice.packageId
        ? await Package.query({ client: trx }).where('id', invoice.packageId).first()
        : null
      if (invoice.packageId && !purchasedPackage) throw new Error('PACKAGE_NOT_FOUND')

      invoice.status = 'paid'
      invoice.paidAt = DateTime.now()
      invoice.gatewayTransactionId = input.gatewayTransactionId || invoice.gatewayTransactionId
      invoice.paymentMethod = input.paymentMethod || invoice.paymentMethod
      invoice.metadata = { ...(invoice.metadata ?? {}), mayarVerification: input.verifiedPayload }
      invoice.useTransaction(trx)
      await invoice.save()

      user.creditsBalance = (user.creditsBalance ?? 0) + invoice.creditsAmount
      if (purchasedPackage) {
        const now = DateTime.now()
        user.packageId = purchasedPackage.id
        await PackageSubscription.query({ client: trx })
          .where('user_id', user.id)
          .where('status', 'active')
          .update({
            status: 'canceled',
            canceled_at: now.toSQL(),
            updated_at: now.toSQL(),
          })

        const subscription = new PackageSubscription()
        subscription.useTransaction(trx)
        subscription.fill({
          userId: user.id,
          packageId: purchasedPackage.id,
          status: 'active',
          billingCycle: 'manual',
          startsAt: now,
          endsAt: null,
          canceledAt: null,
          metadata: { source: 'mayar_topup', invoiceNo: invoice.invoiceNo },
        })
        await subscription.save()
      }
      user.useTransaction(trx)
      await user.save()
      const credit = new CreditTransaction()
      credit.useTransaction(trx)
      credit.fill({
        userId: user.id,
        amount: invoice.creditsAmount,
        balanceAfter: user.creditsBalance,
        type: 'topup',
        description: `Top-up ${invoice.packageName} (${invoice.creditsAmount} Kredit) - ${invoice.invoiceNo}`,
        metadata: {
          invoiceNo: invoice.invoiceNo,
          gateway: 'mayar',
          gatewayTransactionId: invoice.gatewayTransactionId,
        },
      })
      await credit.save()
      await auditLogRepository.create(
        {
          actorId: null,
          action: 'payment.invoice.settled',
          entityType: 'payment_invoice',
          entityId: invoice.id,
          metadata: {
            gateway: invoice.paymentGateway,
            grossAmount: invoice.grossAmount,
            creditsAmount: invoice.creditsAmount,
            packageId: invoice.packageId,
            paymentMethod: invoice.paymentMethod,
          },
        },
        trx
      )
      return invoice
    })
  }

  async settleVerifiedMayarInvoice(input: {
    invoiceId: number
    gatewayTransactionId?: string | null
    paymentMethod?: string | null
    verifiedPayload: Record<string, unknown>
  }) {
    return this.settleVerifiedInvoice(input)
  }
}

export const paymentInvoiceRepository = new PaymentInvoiceRepository()
