import type { HttpContext } from '@adonisjs/core/http'
import { mayarService } from '#services/mayar_service'
import PaymentInvoice from '#models/payment_invoice'
import Package from '#models/package'

export default class MayarPaymentsController {
  /**
   * Memulai proses checkout top-up kredit menggunakan Mayar.id
   */
  async checkout({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Harap login terlebih dahulu' })
    }

    const { packageName, packageId } = request.only(['packageName', 'packageId'])

    // Query paket langsung dari database
    let pkg: Package | null = null
    if (packageId && !Number.isNaN(Number(packageId))) {
      pkg = await Package.find(Number(packageId))
    }

    if (!pkg && (packageName || packageId)) {
      const identifier = String(packageName || packageId).trim()
      pkg = await Package.query()
        .where('name', identifier)
        .orWhere('name', identifier.toLowerCase().replace(/\s+/g, '_'))
        .first()
    }

    // Default fallback ke paket aktif & ter-highlight bila tidak ditentukan
    if (!pkg) {
      pkg =
        (await Package.query().where('is_active', true).where('is_highlighted', true).first()) ||
        (await Package.query().where('is_active', true).first())
    }

    if (!pkg) {
      return response.badRequest({
        success: false,
        message: 'Paket langganan atau top-up tidak ditemukan di database.',
      })
    }

    // Tentukan jumlah kredit dari features atau nama paket
    let creditsAmount = 35
    if (pkg.name === 'guru_aktif' || pkg.name === 'topup_pemula') creditsAmount = 15
    else if (pkg.name === 'guru_pro' || pkg.name === 'topup_sahabat') creditsAmount = 35
    else if (pkg.name === 'paket_sekolah' || pkg.name === 'sekolah') creditsAmount = 120
    else {
      const creditFeature = (pkg.features || []).find((f: string) => /kredit/i.test(f))
      if (creditFeature) {
        const match = creditFeature.match(/(\d+)\s*kredit/i)
        if (match) creditsAmount = Number.parseInt(match[1], 10)
      }
    }

    const redirectUrl = `${request.header('origin') || 'http://localhost:3333'}/billing?status=success`

    try {
      const invoice = await mayarService.createInvoice({
        userId: user.id,
        userName: user.fullName || user.email.split('@')[0],
        userEmail: user.email,
        packageName: pkg.displayName || pkg.name,
        creditsAmount: creditsAmount,
        grossAmount: pkg.priceMonthly,
        redirectUrl,
      })

      return response.ok({
        success: true,
        invoiceNo: invoice.invoiceNo,
        paymentUrl: invoice.paymentUrl,
        creditsAmount: invoice.creditsAmount,
        grossAmount: invoice.grossAmount,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: error.message || 'Gagal membuat transaksi pembayaran',
      })
    }
  }

  /**
   * Webhook handler untuk notifikasi pembayaran dari Mayar
   */
  async webhook({ request, response }: HttpContext) {
    const tokenHeader = (request.header('x-mayar-token') ||
      request.header('x-mayar-signature') ||
      request.header('authorization')?.replace('Bearer ', '')) as string | undefined

    if (!mayarService.verifyWebhook(tokenHeader)) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    const payload = request.body()
    try {
      const invoice = await mayarService.handleWebhookPaid(payload)
      if (!invoice) {
        return response.ok({ status: 'ignored', message: 'Invoice not found or irrelevant event' })
      }

      return response.ok({
        status: 'success',
        message: 'Payment processed and credits added',
        invoiceNo: invoice.invoiceNo,
      })
    } catch (error: any) {
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * Cek status invoice pembayaran
   */
  async checkStatus({ params, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Harap login' })
    }

    const invoice = await PaymentInvoice.query()
      .where('invoiceNo', params.invoiceNo)
      .where('userId', user.id)
      .first()

    if (!invoice) {
      return response.notFound({ message: 'Tagihan tidak ditemukan' })
    }

    return response.ok({
      invoiceNo: invoice.invoiceNo,
      status: invoice.status,
      creditsAmount: invoice.creditsAmount,
      grossAmount: invoice.grossAmount,
      paidAt: invoice.paidAt,
    })
  }
}
