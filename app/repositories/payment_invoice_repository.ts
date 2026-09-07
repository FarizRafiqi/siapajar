import PaymentInvoice from '#models/payment_invoice'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import CreditTransaction from '#models/credit_transaction'
import { DateTime } from 'luxon'

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

  async findOwnedByInvoiceNo(invoiceNo: string, userId: number) {
    return PaymentInvoice.query().where('invoiceNo', invoiceNo).where('userId', userId).first()
  }

  async findByWebhookReference(invoiceNo?: string, gatewayTransactionId?: string) {
    if (invoiceNo) {
      const invoice = await PaymentInvoice.query().where('invoiceNo', invoiceNo).first()
      if (invoice) return invoice
    }

    if (gatewayTransactionId) {
      return PaymentInvoice.query().where('gatewayTransactionId', gatewayTransactionId).first()
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

      const user = await User.query({ client: trx })
        .where('id', invoice.userId)
        .forUpdate()
        .firstOrFail()
      invoice.status = 'paid'
      invoice.paidAt = DateTime.now()
      invoice.gatewayTransactionId = input.gatewayTransactionId || invoice.gatewayTransactionId
      invoice.paymentMethod = input.paymentMethod || invoice.paymentMethod
      invoice.metadata = { ...(invoice.metadata ?? {}), mayarVerification: input.verifiedPayload }
      invoice.useTransaction(trx)
      await invoice.save()

      user.creditsBalance = (user.creditsBalance ?? 0) + invoice.creditsAmount
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
