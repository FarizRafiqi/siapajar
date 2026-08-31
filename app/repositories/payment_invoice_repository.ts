import PaymentInvoice from '#models/payment_invoice'

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
}

export const paymentInvoiceRepository = new PaymentInvoiceRepository()
