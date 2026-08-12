import type { HttpContext } from '@adonisjs/core/http'
import { getStatus, pair, logout } from '#services/whatsapp_service'
import QRCode from 'qrcode'

export default class WhatsappController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const status = getStatus(user.id)
    return inertia.render('dashboard/whatsapp', {
      waStatus: status,
    })
  }

  async status({ auth, response }: HttpContext) {
    const user = auth.user!
    const statusInfo = getStatus(user.id)
    let qrDataUrl: string | undefined

    if (!statusInfo.paired) {
      const pairResult = await pair(user.id)
      if (pairResult.qr) {
        qrDataUrl = await QRCode.toDataURL(pairResult.qr)
      }
    }

    return response.json({
      paired: statusInfo.paired,
      phone: statusInfo.phone,
      qrDataUrl,
    })
  }

  async pair({ auth, response, session }: HttpContext) {
    const user = auth.user!
    const pairResult = await pair(user.id)
    if (pairResult.status === 'already-paired') {
      session.flash('success', 'WhatsApp sudah terhubung')
    } else {
      session.flash('success', 'Proses pairing WhatsApp dimulai. Pindai QR code.')
    }
    return response.redirect().back()
  }

  async logout({ auth, response, session }: HttpContext) {
    const user = auth.user!
    await logout(user.id)
    session.flash('success', 'WhatsApp berhasil dikeluarkan (logout)')
    return response.redirect().back()
  }
}
