import type { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import AiSetting from '#models/ai_setting'
import {
  updateAiSettingValidator,
  listModelsValidator,
  testConnectionValidator,
} from '#validators/ai_setting'
import {
  callAiJson,
  listGeminiModelsForOAuth,
  listModels,
  AiServiceError,
  test9routerConnection,
} from '#services/ai_service'
import env from '#start/env'
import { getCodexAccount, listCodexModels, startCodexChatGptLogin } from '#services/codex_service'

export default class AdminAiSettingsController {
  async index({ inertia }: HttpContext) {
    const setting = await AiSetting.current()
    let codexAccount = null
    if (setting.provider === 'openai' && setting.authMode === 'oauth') {
      codexAccount = await getCodexAccount().catch(() => null)
    }

    return inertia.render('dashboard/admin/ai-settings/index', {
      setting: {
        provider: setting.provider,
        authMode: setting.authMode || 'api_key',
        baseUrl: setting.baseUrl,
        model: setting.model,
        hasApiKey: !!setting.apiKey,
        codexAccount,
        geminiOAuthConnected: setting.provider === 'gemini' && setting.authMode === 'oauth' && !!setting.oauthRefreshToken,
        geminiOAuthEmail: setting.oauthEmail,
      },
    })
  }

  async update({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(updateAiSettingValidator)
    const setting = await AiSetting.current()

    setting.provider = data.provider
    setting.authMode = data.authMode ?? 'api_key'
    if (!['openai', 'gemini'].includes(setting.provider)) {
      setting.authMode = 'api_key'
    }
    setting.baseUrl = data.provider === '9router' ? data.baseUrl ?? null : null
    setting.model = data.model ?? null
    if (data.apiKey) {
      setting.apiKey = data.apiKey
    }
    await setting.save()

    session.flash('success', 'Konfigurasi AI berhasil disimpan')
    return response.redirect().back()
  }

  async oauthStart({ response, session }: HttpContext) {
    try {
      const setting = await AiSetting.current()
      setting.provider = 'openai'
      setting.authMode = 'oauth'
      await setting.save()
      return response.redirect(await startCodexChatGptLogin())
    } catch (error) {
      session.flash(
        'error',
        error instanceof Error
          ? error.message
          : 'Codex CLI tidak dapat memulai login ChatGPT. Pastikan Codex sudah terpasang.'
      )
      return response.redirect().toRoute('admin.ai-settings.index')
    }
  }

  async geminiOauthStart({ response, session }: HttpContext) {
    const clientId = env.get('GOOGLE_CLIENT_ID')
    const projectId = env.get('GEMINI_OAUTH_PROJECT_ID')
    if (!clientId || !env.get('GOOGLE_CLIENT_SECRET') || !projectId) {
      session.flash(
        'error',
        'Isi GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, dan GEMINI_OAUTH_PROJECT_ID terlebih dahulu.'
      )
      return response.redirect().toRoute('admin.ai-settings.index')
    }

    const state = randomBytes(24).toString('hex')
    const redirectUri = this.geminiOauthRedirectUri()
    session.put('ai_gemini_oauth_flow', { state, redirectUri })
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state,
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/generative-language.retriever',
      ].join(' '),
    })
    return response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
  }

  async geminiOauthCallback({ request, response, session }: HttpContext) {
    const flow = session.get('ai_gemini_oauth_flow') as
      | { state: string; redirectUri: string }
      | undefined
    const error = request.input('error')
    if (error) {
      session.forget('ai_gemini_oauth_flow')
      session.flash('error', 'OAuth Gemini dibatalkan.')
      return response.redirect().toRoute('admin.ai-settings.index')
    }

    const code = request.input('code')
    if (!flow || !code || request.input('state') !== flow.state) {
      session.forget('ai_gemini_oauth_flow')
      session.flash('error', 'Sesi OAuth Gemini tidak valid atau sudah kedaluwarsa.')
      return response.redirect().toRoute('admin.ai-settings.index')
    }

    try {
      const clientId = env.get('GOOGLE_CLIENT_ID')
      const clientSecret = env.get('GOOGLE_CLIENT_SECRET')
      const result = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId || '',
          client_secret: clientSecret || '',
          redirect_uri: flow.redirectUri,
          grant_type: 'authorization_code',
        }),
      })
      const payload = (await result.json()) as {
        access_token?: string
        refresh_token?: string
        expires_in?: number
      }
      if (!result.ok || !payload.access_token || !payload.refresh_token) {
        throw new AiServiceError('Google tidak mengembalikan token OAuth Gemini yang lengkap.')
      }

      const setting = await AiSetting.current()
      setting.provider = 'gemini'
      setting.authMode = 'oauth'
      setting.oauthAccessToken = payload.access_token
      setting.oauthRefreshToken = payload.refresh_token
      setting.oauthExpiresAt = DateTime.now().plus({ seconds: payload.expires_in || 3600 })
      setting.oauthProjectId = env.get('GEMINI_OAUTH_PROJECT_ID') || null
      await setting.save()
      session.flash('success', 'Akun Google berhasil terhubung ke Gemini OAuth.')
    } catch (error) {
      session.flash('error', error instanceof AiServiceError ? error.message : 'Gagal menyelesaikan OAuth Gemini.')
    } finally {
      session.forget('ai_gemini_oauth_flow')
    }
    return response.redirect().toRoute('admin.ai-settings.index')
  }

  async models({ request, response }: HttpContext) {
    const data = await request.validateUsing(listModelsValidator)
    let apiKey = data.apiKey
    if (data.provider === 'openai' && data.authMode === 'oauth') {
      try {
        return response.json({ models: await listCodexModels() })
      } catch (error) {
        return response.status(422).json({
          message: error instanceof Error ? error.message : 'Gagal ambil daftar model Codex.',
        })
      }
    }
    if (data.provider === 'gemini' && data.authMode === 'oauth') {
      try {
        return response.json({ models: await listGeminiModelsForOAuth() })
      } catch (error) {
        return response.status(422).json({
          message: error instanceof Error ? error.message : 'Gagal ambil daftar model Gemini.',
        })
      }
    }
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

      const apiKey: string | null | undefined =
        body.apiKey || setting.apiKey || env.get('ROUTER_API_KEY')
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

  private geminiOauthRedirectUri() {
    const appUrl = env.get('GEMINI_OAUTH_CALLBACK_URL') || env.get('APP_URL') || `http://${env.get('HOST')}:${env.get('PORT')}`
    return appUrl.endsWith('/callback') ? appUrl : `${appUrl.replace(/\/$/, '')}/admin/ai-settings/oauth/gemini/callback`
  }
}
