import type PaymentInvoice from '#models/payment_invoice'
import type User from '#models/user'

/**
 * Gateway adapters may create a checkout, verify the provider's immutable
 * payment record, then pass it to PaymentInvoiceRepository for one atomic settlement.
 */
export interface PaymentGateway {
  readonly name: string
  createCheckout(
    user: User,
    input: { packageName?: unknown; packageId?: unknown; redirectUrl: string; mobile: string }
  ): Promise<PaymentInvoice>
  verifyPayment(invoice: PaymentInvoice): Promise<Record<string, unknown> | false>
}
