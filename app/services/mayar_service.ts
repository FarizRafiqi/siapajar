import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import env from '#start/env'
import PaymentInvoice from '#models/payment_invoice'
import type User from '#models/user'
import { packageRepository } from '#repositories/package_repository'
import type { PackageRepository } from '#repositories/package_repository'
import { paymentInvoiceRepository } from '#repositories/payment_invoice_repository'
import type { PaymentInvoiceRepository } from '#repositories/payment_invoice_repository'
import type { PaymentGateway } from '#services/payment_gateway'

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

export class MayarService implements PaymentGateway {
  readonly name = 'mayar'
  constructor(
    private readonly packages: PackageRepository = packageRepository,
    private readonly invoices: PaymentInvoiceRepository = paymentInvoiceRepository
  ) {}

  private get apiKey(): string {
    return env.get('MAYAR_API_KEY') || ''
  }

  private get baseUrl(): string {
    if (env.get('MAYAR_BASE_URL')) return env.get('MAYAR_BASE_URL')!
    return env.get('MAYAR_ENVIRONMENT') === 'production'
      ? 'https://api.mayar.id/hl/v1'
      : 'https://api.mayar.io/hl/v1'
  }

  async createCheckout(
    user: User,
    input: { packageName?: unknown; packageId?: unknown; redirectUrl: string; mobile: string }
  ) {
    const packageId =
      typeof input.packageId === 'string' || typeof input.packageId === 'number'
        ? input.packageId
        : null
    const packageName = typeof input.packageName === 'string' ? input.packageName : null
    const pkg = await this.packages.findForCheckout(packageId, packageName)

    if (!pkg) {
      throw new Error('Paket langganan atau top-up tidak ditemukan di database.')
    }

    const creditsAmount = this.getCreditsAmount(pkg.name, pkg.features)
    return this.createInvoice({
      userId: user.id,
      userName: user.fullName || user.email.split('@')[0],
      userEmail: user.email,
      userMobile: input.mobile,
      packageName: pkg.displayName || pkg.name,
      creditsAmount,
      grossAmount: pkg.priceMonthly,
      redirectUrl: input.redirectUrl,
    })
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

    if (!this.apiKey && env.get('NODE_ENV') !== 'production') {
      // Jika API Key belum diset (misalnya mode demo lokal), generate mock link
      invoice.paymentUrl = `${params.redirectUrl}?mock_invoice=${invoice.invoiceNo}`
      invoice.gatewayTransactionId = `mock_trx_${invoiceNo}`
      invoice.gatewayInvoiceId = `mock_invoice_${invoiceNo}`
      await invoice.save()
      return invoice
    }
    if (!this.apiKey) throw new Error('PAYMENT_PROVIDER_NOT_CONFIGURED')

    try {
      const payload = {
        name: params.userName || 'Guru SiapAjar',
        email: params.userEmail,
        mobile: params.userMobile || '081234567890',
        expiredAt: DateTime.now().plus({ hours: 24 }).toISO(),
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
        invoice.gatewayInvoiceId = json.data.id || json.data.invoiceId || null
        invoice.gatewayTransactionId = json.data.transactionId || null
        invoice.metadata = json.data
        invoice.expiresAt = DateTime.now().plus({ hours: 24 })
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

  async findInvoiceForUser(invoiceNo: string, userId: number) {
    return this.invoices.findOwnedByInvoiceNo(invoiceNo, userId)
  }

  verifyWebhookPath(secret: string | undefined): boolean {
    const expected = env.get('MAYAR_WEBHOOK_PATH_SECRET') || env.get('MAYAR_WEBHOOK_TOKEN')
    if (!expected) return env.get('NODE_ENV') !== 'production'
    if (!secret) return false
    const provided = Buffer.from(secret)
    const expectedBuffer = Buffer.from(expected)
    return (
      provided.length === expectedBuffer.length && crypto.timingSafeEqual(provided, expectedBuffer)
    )
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

    const invoice = await this.invoices.findByWebhookReference(invoiceNo, gatewayTrxId)

    if (!invoice) {
      return null
    }

    // Webhook hanya pemicu. Status, jumlah, dan ID invoice selalu diverifikasi ke Mayar.
    if (invoice.status === 'paid') {
      return invoice
    }
    const verified = await this.verifyRemoteInvoice(invoice)
    if (!verified) throw new Error('MAYAR_INVOICE_NOT_PAID')
    return this.invoices.settleVerifiedInvoice({
      invoiceId: invoice.id,
      gatewayTransactionId: gatewayTrxId || invoice.gatewayTransactionId,
      paymentMethod: transactionData.paymentMethod || null,
      verifiedPayload: {
        webhookReceivedAt: DateTime.now().toISO(),
        gatewayStatus: verified.status,
        gatewayId: verified.id,
      },
    })
  }

  private async verifyRemoteInvoice(invoice: PaymentInvoice) {
    if (!this.apiKey) {
      return env.get('NODE_ENV') !== 'production' && invoice.gatewayInvoiceId?.startsWith('mock_')
        ? { status: 'paid', id: invoice.gatewayInvoiceId }
        : false
    }
    if (!invoice.gatewayInvoiceId) return false
    const response = await fetch(
      `${this.baseUrl}/invoice/${encodeURIComponent(invoice.gatewayInvoiceId)}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/json' },
      }
    )
    const json = (await response.json()) as { data?: Record<string, any> }
    const data = json.data
    if (!response.ok || !data) return false
    const amount = Number(data.amount ?? data.total ?? data.grossAmount)
    const isPaid = String(data.status || '').toLowerCase() === 'paid'
    return isPaid && Number.isFinite(amount) && amount === invoice.grossAmount ? data : false
  }

  async verifyPayment(invoice: PaymentInvoice): Promise<Record<string, unknown> | false> {
    return await this.verifyRemoteInvoice(invoice)
  }

  private getCreditsAmount(packageName: string, features: string[]) {
    if (packageName === 'guru_aktif' || packageName === 'topup_pemula') return 15
    if (packageName === 'guru_pro' || packageName === 'topup_sahabat') return 35
    if (packageName === 'paket_sekolah' || packageName === 'sekolah') return 120

    const creditFeature = (features || []).find((feature) => /kredit/i.test(feature))
    const match = creditFeature?.match(/(\d+)\s*kredit/i)
    return match ? Number.parseInt(match[1], 10) : 35
  }
}

export const mayarService = new MayarService()
