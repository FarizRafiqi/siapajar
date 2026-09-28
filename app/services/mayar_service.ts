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
import { auditService } from '#services/audit_service'
import logger from '@adonisjs/core/services/logger'

async function fetchMayar(url: string, init: RequestInit, timeoutMs = 20_000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Layanan pembayaran Mayar tidak merespons. Coba lagi.')
    }
    throw new Error('Gagal terhubung ke layanan pembayaran Mayar. Coba lagi.')
  } finally {
    clearTimeout(timeout)
  }
}

export interface CreateInvoiceParams {
  userId: number
  packageId: number
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

    const creditsAmount = this.getCreditsAmount(pkg.features)
    return this.createInvoice({
      userId: user.id,
      packageId: pkg.id,
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
    const mobile = params.userMobile?.trim()
    if (!mobile) throw new Error('Nomor WhatsApp wajib diisi untuk pembayaran.')
    if (!this.apiKey && env.get('NODE_ENV') === 'production') {
      throw new Error('PAYMENT_PROVIDER_NOT_CONFIGURED')
    }

    const randomSuffix = crypto.randomInt(1000, 9999)
    const invoiceNo = `INV-${Date.now()}-${randomSuffix}`

    // Buat record pending invoice di database lokal
    const invoice = new PaymentInvoice()
    invoice.fill({
      userId: params.userId,
      packageId: params.packageId,
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
      await this.recordInvoiceCreated(invoice, params.userId)
      return invoice
    }

    try {
      const payload = {
        name: params.userName || 'Guru SiapAjar',
        email: params.userEmail,
        mobile,
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
          // Mayar requires these two keys. Keep our invoice number in the
          // customer reference so the webhook can correlate the payment even
          // when the provider omits arbitrary custom fields.
          noCustomer: invoiceNo,
          idProd: params.packageName,
        },
      }

      const response = await fetchMayar(`${this.baseUrl}/invoice/create`, {
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
      await auditService.record({
        actorId: params.userId,
        action: 'payment.invoice.creation_failed',
        entityType: 'payment_invoice',
        entityId: invoice.id,
        metadata: {
          gateway: invoice.paymentGateway,
          errorName: error instanceof Error ? error.name : 'UnknownError',
        },
      })
      throw error
    }

    await this.recordInvoiceCreated(invoice, params.userId)
    return invoice
  }

  async findInvoiceForUser(invoiceNo: string, userId: number) {
    return this.invoices.findOwnedByInvoiceNo(invoiceNo, userId)
  }

  private async recordInvoiceCreated(invoice: PaymentInvoice, actorId: number) {
    await auditService.record({
      actorId,
      action: 'payment.invoice.created',
      entityType: 'payment_invoice',
      entityId: invoice.id,
      metadata: {
        gateway: invoice.paymentGateway,
        packageId: invoice.packageId,
        grossAmount: invoice.grossAmount,
        creditsAmount: invoice.creditsAmount,
      },
    })
  }

  verifyWebhookPath(secret: string | undefined): boolean {
    const expected = env.get('MAYAR_WEBHOOK_PATH_SECRET') || env.get('MAYAR_WEBHOOK_TOKEN')
    // Missing webhook credentials are tolerated only by an explicitly local
    // development/test process. A staging process must fail closed as well.
    if (!expected) return ['development', 'test'].includes(env.get('NODE_ENV'))
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
    const envelope = payload && typeof payload === 'object' ? payload : {}
    const transactionData =
      envelope.data && typeof envelope.data === 'object' ? envelope.data : envelope
    const extraData =
      transactionData.extraData && typeof transactionData.extraData === 'object'
        ? transactionData.extraData
        : {}
    const eventName = normalizeWebhookEvent(envelope.event)
    const webhookStatuses = [transactionData.transactionStatus, transactionData.status]
      .map(normalizeWebhookStatus)
      .filter((value): value is string => Boolean(value))
    await auditService.recordCritical({
      action: 'payment.webhook.received',
      entityType: 'payment_gateway',
      entityId: 'mayar',
      metadata: {
        gateway: 'mayar',
        event: eventName || 'unspecified',
        statuses: webhookStatuses,
      },
    })
    if (eventName && eventName !== 'payment.received') {
      await auditService.recordCritical({
        action: 'payment.webhook.ignored',
        entityType: 'payment_gateway',
        entityId: 'mayar',
        metadata: { gateway: 'mayar', reason: 'unsupported_event', event: eventName },
      })
      return null
    }
    const paidStatuses = new Set(['paid', 'success', 'completed', 'true'])
    // Mayar's payment.received payloads can contain transactionStatus=created
    // alongside status=SUCCESS. Accept the event when any provider status is a
    // known paid state; the remote invoice verification below remains the
    // source of truth for amount and settlement.
    if (webhookStatuses.length > 0 && !webhookStatuses.some((status) => paidStatuses.has(status))) {
      await auditService.recordCritical({
        action: 'payment.webhook.ignored',
        entityType: 'payment_gateway',
        entityId: 'mayar',
        metadata: { gateway: 'mayar', reason: 'non_paid_status', statuses: webhookStatuses },
      })
      return null
    }

    // Cari invoice berdasarkan invoice_no di extraData atau gateway transaction ID
    const invoiceNo =
      normalizeWebhookReference(extraData.invoiceNo) ||
      normalizeWebhookReference(extraData.noCustomer) ||
      normalizeWebhookReference(transactionData.invoiceNo)
    const gatewayTrxId =
      normalizeWebhookReference(transactionData.transactionId) ||
      normalizeWebhookReference(transactionData.id)
    const gatewayInvoiceId =
      normalizeWebhookReference(transactionData.invoiceId) ||
      normalizeWebhookReference(transactionData.id)

    const invoice = await this.invoices.findByWebhookReference(
      invoiceNo || undefined,
      gatewayTrxId || undefined,
      gatewayInvoiceId || undefined
    )

    if (!invoice) {
      await auditService.recordCritical({
        action: 'payment.webhook.unmatched',
        entityType: 'payment_gateway',
        entityId: 'mayar',
        metadata: {
          gateway: 'mayar',
          reason: 'invoice_not_found',
          hasInvoiceReference: Boolean(invoiceNo),
          hasTransactionReference: Boolean(gatewayTrxId || gatewayInvoiceId),
        },
      })
      return null
    }

    // Webhook hanya pemicu. Status, jumlah, dan ID invoice selalu diverifikasi ke Mayar.
    try {
      const settled = await this.reconcileInvoice(invoice, {
        gatewayTransactionId: gatewayTrxId,
        paymentMethod: normalizeWebhookPaymentMethod(transactionData.paymentMethod),
        verifiedPayload: {
          webhookReceivedAt: DateTime.now().toISO(),
          webhookStatus: webhookStatuses,
        },
      })
      if (settled.status !== 'paid') {
        await auditService.recordCritical({
          action: 'payment.webhook.verification_pending',
          entityType: 'payment_invoice',
          entityId: invoice.id,
          metadata: { gateway: 'mayar', invoiceStatus: settled.status },
        })
        throw new Error('MAYAR_INVOICE_NOT_PAID')
      }
      await auditService.recordCritical({
        action: 'payment.webhook.processed',
        entityType: 'payment_invoice',
        entityId: invoice.id,
        metadata: { gateway: 'mayar', outcome: 'verified_paid' },
      })
      return settled
    } catch (error) {
      logger.error(
        {
          event: 'payment.webhook.processing_failed',
          gateway: 'mayar',
          invoiceId: invoice.id,
          errorName: error instanceof Error ? error.name : 'UnknownError',
        },
        'Mayar webhook processing failed'
      )
      throw error
    }
  }

  /**
   * Reconcile a pending invoice from an authenticated status check. This is a
   * recovery path when Mayar's webhook is delayed or lost; it still performs
   * the same remote status and exact-amount verification before settlement.
   */
  async reconcileInvoice(
    invoice: PaymentInvoice,
    options: {
      gatewayTransactionId?: string | null
      paymentMethod?: string | null
      verifiedPayload?: Record<string, unknown>
    } = {}
  ) {
    if (invoice.status === 'paid') return invoice
    if (invoice.status !== 'pending') return invoice

    const verified = await this.verifyRemoteInvoice(invoice)
    if (!verified) return invoice
    const verifiedTransactionId =
      verified.transactionId ||
      verified.transaction_id ||
      verified.id ||
      options.gatewayTransactionId

    return this.invoices.settleVerifiedInvoice({
      invoiceId: invoice.id,
      gatewayTransactionId: verifiedTransactionId || invoice.gatewayTransactionId,
      paymentMethod: options.paymentMethod || null,
      verifiedPayload: {
        reconciledAt: DateTime.now().toISO(),
        gatewayStatus: verified.status,
        gatewayId: verified.id,
        ...(options.verifiedPayload || {}),
      },
    })
  }

  async reconcilePendingInvoices(maxInvoices = 100) {
    const limit = Math.max(1, Math.min(Math.trunc(maxInvoices), 100))
    const checkedIds: number[] = []
    let settled = 0
    let stillPending = 0
    let failures = 0

    while (checkedIds.length < limit) {
      const batch = await this.invoices.listPendingMayarForReconciliation(
        Math.min(20, limit - checkedIds.length),
        checkedIds
      )
      if (!batch.length) break

      for (const invoice of batch) {
        checkedIds.push(invoice.id)
        try {
          const reconciled = await this.reconcileInvoice(invoice, {
            verifiedPayload: { source: 'scheduled_reconciliation' },
          })
          if (reconciled.status === 'paid') settled += 1
          else stillPending += 1
        } catch (error) {
          failures += 1
          logger.error(
            {
              event: 'payment.reconciliation.invoice_failed',
              gateway: 'mayar',
              invoiceId: invoice.id,
              errorName: error instanceof Error ? error.name : 'UnknownError',
            },
            'Mayar invoice reconciliation failed'
          )
        } finally {
          await this.invoices.markMayarReconciliationChecked(invoice.id).catch((error: unknown) => {
            logger.error(
              {
                event: 'payment.reconciliation.checkpoint_failed',
                gateway: 'mayar',
                invoiceId: invoice.id,
                errorName: error instanceof Error ? error.name : 'UnknownError',
              },
              'Could not persist Mayar reconciliation checkpoint'
            )
          })
        }
      }
    }

    const limitReached =
      checkedIds.length >= limit &&
      (await this.invoices.hasPendingMayarForReconciliation(checkedIds))
    const result = {
      gateway: 'mayar',
      checked: checkedIds.length,
      settled,
      stillPending,
      failures,
      batchLimit: limit,
      limitReached,
    }
    await auditService.recordCritical({
      action: 'payment.reconciliation.run',
      entityType: 'payment_gateway',
      entityId: 'mayar',
      metadata: result,
    })
    if (failures > 0) {
      logger.error(
        { event: 'payment.reconciliation.partial_failure', ...result },
        'Mayar reconciliation finished with errors'
      )
    } else {
      logger.info(
        { event: 'payment.reconciliation.completed', ...result },
        'Mayar reconciliation completed'
      )
    }
    return result
  }

  private async verifyRemoteInvoice(invoice: PaymentInvoice) {
    if (!this.apiKey) {
      return env.get('NODE_ENV') !== 'production' && invoice.gatewayInvoiceId?.startsWith('mock_')
        ? { status: 'paid', id: invoice.gatewayInvoiceId }
        : false
    }
    if (!invoice.gatewayInvoiceId) return false
    const response = await fetchMayar(
      `${this.baseUrl}/invoice/${encodeURIComponent(invoice.gatewayInvoiceId)}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/json' },
      },
      15_000
    )
    const json = (await response.json()) as { data?: Record<string, any> }
    const data = json.data
    if (!response.ok || !data) return false
    const amount = Number(data.amount ?? data.total ?? data.grossAmount)
    const providerStatuses = [data.transactionStatus, data.status]
      .map((value) => String(value || '').toLowerCase())
      .filter(Boolean)
    const isPaid = providerStatuses.some((status) =>
      ['paid', 'success', 'completed', 'true'].includes(status)
    )
    return isPaid && Number.isFinite(amount) && amount === invoice.grossAmount ? data : false
  }

  async verifyPayment(invoice: PaymentInvoice): Promise<Record<string, unknown> | false> {
    return await this.verifyRemoteInvoice(invoice)
  }

  private getCreditsAmount(features: string[]) {
    // The package row is the source of truth for the amount. A checkout is
    // rejected when the active catalog does not declare an explicit integer
    // credit entitlement; never guess from a stale package name.
    const creditFeature = (features || []).find((feature) => /\b\d+\s*kredit\b/i.test(feature))
    const match = creditFeature?.match(/\b(\d+)\s*kredit\b/i)
    if (match) {
      const amount = Number.parseInt(match[1], 10)
      if (Number.isInteger(amount) && amount > 0) return amount
    }

    throw new Error('Paket tidak memiliki jumlah kredit yang valid.')
  }
}

const WEBHOOK_STATUSES = new Set([
  'paid',
  'success',
  'completed',
  'true',
  'created',
  'pending',
  'failed',
  'expired',
  'cancelled',
  'canceled',
  'refunded',
  'unpaid',
])
const PAYMENT_METHODS = new Set([
  'bank_transfer',
  'virtual_account',
  'va',
  'qris',
  'e_wallet',
  'ewallet',
  'credit_card',
  'debit_card',
  'retail_outlet',
  'cash',
])

function normalizeWebhookEvent(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return ''
  const normalized = value.trim().toLowerCase()
  return /^[a-z0-9_.-]{1,80}$/.test(normalized) ? normalized : 'other'
}

function normalizeWebhookStatus(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    return 'other'
  }
  const normalized = String(value).trim().toLowerCase()
  return WEBHOOK_STATUSES.has(normalized) ? normalized : 'other'
}

function normalizeWebhookReference(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const normalized = String(value).trim()
  return normalized ? normalized.slice(0, 200) : null
}

function normalizeWebhookPaymentMethod(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
  if (PAYMENT_METHODS.has(normalized)) return normalized
  if (normalized.startsWith('va_') || normalized.startsWith('virtual_account_')) {
    return 'virtual_account'
  }
  if (normalized.startsWith('bank_transfer_')) return 'bank_transfer'
  if (['gopay', 'ovo', 'dana', 'shopeepay', 'linkaja', 'spay'].includes(normalized)) {
    return 'e_wallet'
  }
  if (['visa', 'mastercard', 'jcb', 'amex'].includes(normalized)) return 'credit_card'
  if (['alfamart', 'indomaret'].includes(normalized)) return 'retail_outlet'
  return null
}

export const mayarService = new MayarService()
