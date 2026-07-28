import type { HttpContext } from '@adonisjs/core/http'
import AiSetting from '#models/ai_setting'
import env from '#start/env'
import { updateAiSettingValidator, listModelsValidator, testConnectionValidator } from '#validators/ai_setting'
import { callAiJson, listModels, AiServiceError, test9routerConnection } from '#services/ai_service'

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
    let apiKey = data.apiKey
    if (!apiKey) {
      const setting = await AiSetting.current()
      apiKey = setting.apiKey ?? undefined
    }
    if (!apiKey) {
      return response.status(422).json({ message: 'API key belum diisi. Isi API key dulu.' })
    }

    try {
      const models = await listModels(data.provider, apiKey)
      return response.json({ models })
    } catch (error) {
      return response.status(422).json({
        message: error instanceof AiServiceError ? error.message : 'Gagal ambil daftar model',
      })
    }
  }

  async test({ request, response, session }: HttpContext) {
    try {
      const body = await request.validateUsing(testConnectionValidator)
      const setting = await AiSetting.current()

      const apiKey: string | null | undefined = body.apiKey || setting.apiKey || env.get('ROUTER_API_KEY')
      const model: string | undefined = body.model || setting.model || undefined

      if (setting.provider === '9router') {
        await this.test9router(model, apiKey)
        session.flash('success', `Koneksi ke 9router berhasil — model "${model}" merespon.`)
      } else {
        await callAiJson<{ ok: boolean }>({
          combo: model || 'gpt-4o-mini',
          systemPrompt: 'Balas HANYA JSON valid: {"ok": true}',
          userPrompt: 'Tes koneksi.',
        })
        session.flash('success', 'Koneksi ke layanan AI berhasil')
      }
    } catch (error) {
      session.flash('error', error instanceof AiServiceError ? error.message : 'Tes koneksi gagal')
    }
    return response.redirect().back()
  }

  private async test9router(model: string | null | undefined, apiKey: string | null | undefined) {
    if (!model) throw new AiServiceError('Pilih model/combo dulu sebelum tes koneksi.')
    await test9routerConnection(model, apiKey ?? null)
  }
}
