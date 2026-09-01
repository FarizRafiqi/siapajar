import type { HttpContext } from '@adonisjs/core/http'
import { mayarService } from '#services/mayar_service'
import env from '#start/env'

export default class MayarPaymentsController {
  /**
   * Memulai proses checkout top-up kredit menggunakan Mayar.id
   */
  async checkout({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Harap login terlebih dahulu' })
    }

    const { packageName, packageId, mobile } = request.only(['packageName', 'packageId', 'mobile'])
    const normalizedMobile = String(mobile || '').replace(/[^0-9+]/g, '')
    if (!/^\+?62\d{8,13}$/.test(normalizedMobile) && !/^0\d{8,13}$/.test(normalizedMobile)) {
      return response.unprocessableEntity({
        success: false,
        message: 'Masukkan nomor WhatsApp yang valid untuk pembayaran.',
      })
    }
    const redirectUrl = `${env.get('APP_URL', 'http://localhost:3333')}/my-package?status=success`

    try {
      const invoice = await mayarService.createCheckout(user, {
        packageName,
        packageId,
        redirectUrl,
        mobile: normalizedMobile,
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
  async webhook({ request, response, params }: HttpContext) {
    if (!mayarService.verifyWebhookPath(params.secret)) {
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
        message: 'Pembayaran belum dapat diproses.',
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

    const invoice = await mayarService.findInvoiceForUser(params.invoiceNo, user.id)
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
