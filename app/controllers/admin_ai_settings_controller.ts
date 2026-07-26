import type { HttpContext } from '@adonisjs/core/http'
import AiSetting from '#models/ai_setting'
import { updateAiSettingValidator, listModelsValidator } from '#validators/ai_setting'
import { callAiJson, listModels, AiServiceError } from '#services/ai_service'

export default class AdminAiSettingsController {
  async index({ inertia }: HttpContext) {
    const setting = await AiSetting.current()

    return inertia.render('dashboard/admin/ai-settings/index', {
      setting: {
        provider: setting.provider,
        baseUrl: setting.baseUrl,
        model: setting.model,
        hasApiKey: !!setting.apiKey,
      },
    })
  }

  async update({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(updateAiSettingValidator)
    const setting = await AiSetting.current()

    setting.provider = data.provider
    setting.baseUrl = data.baseUrl ?? null
    setting.model = data.model ?? null
    if (data.apiKey) {
      setting.apiKey = data.apiKey
    }
    await setting.save()

    session.flash('success', 'Konfigurasi AI berhasil disimpan')
    return response.redirect().back()
  }

  async models({ request, response }: HttpContext) {
    const data = await request.validateUsing(listModelsValidator)

    try {
      const models = await listModels(data.provider, data.apiKey)
      return response.json({ models })
    } catch (error) {
      return response.status(422).json({
        message: error instanceof AiServiceError ? error.message : 'Gagal ambil daftar model',
      })
    }
  }

  async test({ response, session }: HttpContext) {
    try {
      await callAiJson<{ ok: boolean }>({
        combo: 'siapajar-docgen',
        systemPrompt: 'Balas HANYA JSON valid: {"ok": true}',
        userPrompt: 'Tes koneksi.',
      })
      session.flash('success', 'Koneksi ke layanan AI berhasil')
    } catch (error) {
      session.flash('error', error instanceof AiServiceError ? error.message : 'Tes koneksi gagal')
    }
    return response.redirect().back()
  }
}
