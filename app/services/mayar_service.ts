import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import env from '#start/env'
import PaymentInvoice from '#models/payment_invoice'
import { creditService } from '#services/credit_service'

export interface CreateInvoiceParams {
  userId: number
  userName: string
  userEmail: string
  userMobile?: string
  packageName: string
  creditsAmount: number
  grossAmount: number
  redirectUrl: string
}

export class MayarService {
  private get apiKey(): string {
    return env.get('MAYAR_API_KEY') || ''
  }

  private get baseUrl(): string {
    return env.get('MAYAR_BASE_URL') || 'https://api.mayar.club/hl/v1'
  }

  private get webhookToken(): string {
    return env.get('MAYAR_WEBHOOK_TOKEN') || ''
  }

  /**
   * Membuat transaksi / Invoice Mayar
   */
  async createInvoice(params: CreateInvoiceParams): Promise<PaymentInvoice> {
    const randomSuffix = crypto.randomInt(1000, 9999)
    const invoiceNo = `INV-${Date.now()}-${randomSuffix}`

    // Buat record pending invoice di database lokal
    const invoice = new PaymentInvoice()
    invoice.fill({
      userId: params.userId,
      invoiceNo,
      packageName: params.packageName,
      creditsAmount: params.creditsAmount,
      grossAmount: params.grossAmount,
      paymentGateway: 'mayar',
      status: 'pending',
    })
    await invoice.save()

    if (!this.apiKey) {
      // Jika API Key belum diset (misalnya mode demo lokal), generate mock link
      invoice.paymentUrl = `${params.redirectUrl}?mock_invoice=${invoice.invoiceNo}`
      invoice.gatewayTransactionId = `mock_trx_${invoiceNo}`
      await invoice.save()
      return invoice
    }

    try {
      const payload = {
        name: params.userName || 'Guru SiapAjar',
        email: params.userEmail,
        mobile: params.userMobile || '081234567890',
        redirectUrl: params.redirectUrl,
        description: `Top-up ${params.creditsAmount} Kredit SiapAjar - ${params.packageName}`,
        items: [
          {
            quantity: 1,
            rate: params.grossAmount,
            description: `Paket ${params.packageName} (${params.creditsAmount} Kredit)`,
          },
        ],
        extraData: {
          invoiceNo,
          userId: String(params.userId),
          creditsAmount: String(params.creditsAmount),
        },
      }

      const response = await fetch(`${this.baseUrl}/invoice/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const json = (await response.json()) as { statusCode?: number; data?: any; message?: string }
      if (response.ok && json.data) {
        invoice.paymentUrl = json.data.link || json.data.paymentUrl || json.data.url
        invoice.gatewayTransactionId = json.data.id || json.data.transactionId
        invoice.metadata = json.data
        await invoice.save()
      } else {
        invoice.status = 'failed'
        invoice.metadata = json as Record<string, any>
        await invoice.save()
        throw new Error(json.message || 'Gagal membuat tagihan pembayaran Mayar')
      }
    } catch (error: any) {
      invoice.status = 'failed'
      invoice.metadata = { error: error.message }
      await invoice.save()
      throw error
    }

    return invoice
  }

  /**
   * Memvalidasi Webhook Secret / Token dari Mayar
   */
  verifyWebhook(tokenFromRequest: string | undefined): boolean {
    if (!this.webhookToken) return true
    return tokenFromRequest === this.webhookToken
  }

  /**
   * Menangani Callback Webhook Sukses dari Mayar
   */
  async handleWebhookPaid(payload: Record<string, any>): Promise<PaymentInvoice | null> {
    const transactionData = payload.data || payload
    const extraData = transactionData.extraData || {}

    // Cari invoice berdasarkan invoice_no di extraData atau gateway transaction ID
    const invoiceNo = extraData.invoiceNo
    const gatewayTrxId = transactionData.id || transactionData.transactionId

    let invoice: PaymentInvoice | null = null
    if (invoiceNo) {
      invoice = await PaymentInvoice.query().where('invoiceNo', invoiceNo).first()
    }
    if (!invoice && gatewayTrxId) {
      invoice = await PaymentInvoice.query().where('gatewayTransactionId', gatewayTrxId).first()
    }

    if (!invoice) {
      return null
    }

    // Jika sudah pernah diproses, kembalikan invoice yang ada (idempotent)
    if (invoice.status === 'paid') {
      return invoice
    }

    invoice.status = 'paid'
    invoice.paidAt = DateTime.now()
    if (transactionData.paymentMethod) {
      invoice.paymentMethod = transactionData.paymentMethod
    }
    const currentMeta = invoice.metadata ?? {}
    invoice.metadata = { ...currentMeta, webhookReceived: payload }
    await invoice.save()

    // Tambahkan kredit ke saldo user
    await creditService.addCredits(
      invoice.userId,
      invoice.creditsAmount,
      'topup',
      `Top-up ${invoice.packageName} (${invoice.creditsAmount} Kredit) - ${invoice.invoiceNo}`,
      { invoiceNo: invoice.invoiceNo, gatewayTransactionId: gatewayTrxId, gateway: 'mayar' }
    )

    return invoice
  }
}

export const mayarService = new MayarService()
