import env from '#start/env'
import AiSetting from '#models/ai_setting'
import { callCodex, generateCodexImage } from '#services/codex_service'
import { DateTime } from 'luxon'

/** Error yang aman ditampilkan langsung ke guru — bukan stack trace. */
export class AiServiceError extends Error {}

export interface CallAiJsonOptions {
  /** Nama combo 9router — fallback kalau resolved.model belum diset. */
  combo: string
  systemPrompt: string
  userPrompt: string
  timeoutMs?: number
  reasoningEffort?: 'none' | 'low' | 'medium' | 'high' | 'max' | 'xhigh'
}

export type AiGateway = 'command_code' | 'openrouter' | 'opencode_zen' | 'together'

interface ResolvedProvider {
  provider: '9router' | 'anthropic' | 'openai' | 'gemini'
  authMode: 'api_key' | 'oauth'
  apiKey: string | null
  baseUrl: string | null
  model: string | null
  oauthAccessToken: string | null
  oauthRefreshToken: string | null
  oauthExpiresAt: DateTime | null
  oauthProjectId: string | null
  gateway: AiGateway | null
  reasoningEffort: 'none' | 'low' | 'medium' | 'high' | 'max' | 'xhigh' | null
}

const GEMINI_IMAGE_MODEL = 'gemini-3.1-flash-image'
const MAX_INLINE_IMAGE_BYTES = 8 * 1024 * 1024
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg'])

const GATEWAY_DEFAULTS: Record<AiGateway, string> = {
  command_code: 'https://api.commandcode.ai/provider/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  opencode_zen: 'https://opencode.ai/zen/v1',
  together: 'https://api.together.xyz/v1',
}

/** Resolve the selected gateway's environment key, with legacy fallback. */
export function getAggregatorApiKey(gateway: AiGateway | null): string | undefined {
  if (gateway === 'command_code') {
    return env.get('COMMAND_CODE_API_KEY') || env.get('AGGREGATOR_API_KEY')
  }
  if (gateway === 'openrouter') {
    return env.get('OPENROUTER_API_KEY') || env.get('AGGREGATOR_API_KEY')
  }
  if (gateway === 'opencode_zen') {
    return env.get('OPENCODE_ZEN_API_KEY') || env.get('AGGREGATOR_API_KEY')
  }
  if (gateway === 'together') {
    return env.get('TOGETHER_API_KEY') || env.get('AGGREGATOR_API_KEY')
  }
  return env.get('AGGREGATOR_API_KEY')
}

async function resolveProvider(): Promise<ResolvedProvider> {
  const setting = await AiSetting.current()

  // ROUTER_API_KEY hanya dipakai 9router. Aggregator punya key sendiri.
  const envFallback = setting.gateway
    ? getAggregatorApiKey(setting.gateway)
    : setting.provider === '9router'
      ? env.get('ROUTER_API_KEY')
      : undefined

  return {
    provider: setting.provider,
    authMode: setting.authMode || 'api_key',
    apiKey: setting.apiKey || envFallback || null,
    baseUrl: setting.baseUrl || (setting.gateway ? GATEWAY_DEFAULTS[setting.gateway] : null),
    model: setting.model,
    oauthAccessToken: setting.oauthAccessToken || null,
    oauthRefreshToken: setting.oauthRefreshToken || null,
    oauthExpiresAt: setting.oauthExpiresAt || null,
    oauthProjectId: setting.oauthProjectId || null,
    gateway: setting.gateway || null,
    reasoningEffort: setting.reasoningEffort || null,
  }
}

export async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AiServiceError('AI tidak merespons dalam waktu wajar. Coba lagi.')
    }
    throw new AiServiceError('Gagal terhubung ke layanan AI. Coba lagi.')
  } finally {
    clearTimeout(timeout)
  }
}

function trimTrailingSlashes(url: string): string {
  let end = url.length
  while (end > 0 && url[end - 1] === '/') {
    end--
  }
  return url.slice(0, end)
}

async function call9router(
  resolved: ResolvedProvider,
  options: CallAiJsonOptions
): Promise<string> {
  let baseUrl =
    resolved.baseUrl || env.get('ROUTER_API_URL') || 'http://localhost:20128/v1/chat/completions'
  // 9Router exposes OpenAI-compatible endpoint at /v1/chat/completions.
  // Ensure the URL always points to that path regardless of user input.
  if (!baseUrl.endsWith('/chat/completions')) {
    baseUrl = `${trimTrailingSlashes(baseUrl)}/chat/completions`
  }

  const response = await fetchWithTimeout(
    baseUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(resolved.apiKey ? { Authorization: `Bearer ${resolved.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: resolved.model || options.combo,
        messages: [
          { role: 'system', content: options.systemPrompt },
          { role: 'user', content: options.userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    },
    options.timeoutMs ?? 45_000
  )

  if (!response.ok) {
    throw new AiServiceError(
      `Layanan AI (9router) membalas error (status ${response.status}). Coba lagi.`
    )
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  const text = payload?.choices?.[0]?.message?.content
  if (!text) throw new AiServiceError('Layanan AI tidak mengembalikan konten. Coba lagi.')
  return text
}

function completionUrl(baseUrl: string) {
  const normalized = trimTrailingSlashes(baseUrl)
  return normalized.endsWith('/chat/completions') ? normalized : `${normalized}/chat/completions`
}

function modelListUrl(baseUrl: string) {
  const normalized = trimTrailingSlashes(baseUrl).replace(/\/chat\/completions$/i, '')
  return normalized.endsWith('/models') ? normalized : `${normalized}/models`
}

function aggregatorLabel(gateway: AiGateway | null) {
  if (gateway === 'command_code') return 'Command Code'
  if (gateway === 'openrouter') return 'OpenRouter'
  if (gateway === 'opencode_zen') return 'OpenCode Zen'
  if (gateway === 'together') return 'Together AI'
  return 'Aggregator AI'
}

async function callAggregator(
  resolved: ResolvedProvider,
  options: CallAiJsonOptions
): Promise<string> {
  if (!resolved.gateway) throw new AiServiceError('Aggregator AI belum dipilih.')
  if (!resolved.apiKey) {
    throw new AiServiceError(`API key ${aggregatorLabel(resolved.gateway)} belum diisi.`)
  }
  if (!resolved.model) {
    throw new AiServiceError(
      `Pilih model ${aggregatorLabel(resolved.gateway)} terlebih dahulu di Konfigurasi AI.`
    )
  }
  const model = resolved.model
  const reasoningEffort = options.reasoningEffort || resolved.reasoningEffort || 'medium'
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt },
    ],
    response_format: { type: 'json_object' },
  }
  if (
    /^(gpt-5|deepseek-v4|o1|o3|o4)/i.test(model) &&
    reasoningEffort &&
    reasoningEffort !== 'none'
  ) {
    body.reasoning_effort = reasoningEffort
  }
  if (/^(gpt-5|o1|o3|o4)/i.test(model)) body.max_completion_tokens = 4000
  else body.max_tokens = 4000

  const response = await fetchWithTimeout(
    completionUrl(resolved.baseUrl || GATEWAY_DEFAULTS[resolved.gateway]),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resolved.apiKey}`,
      },
      body: JSON.stringify(body),
    },
    options.timeoutMs ?? 90_000
  )
  if (!response.ok) {
    const responseText = await response.text().catch(() => '')
    const detail = responseText.slice(0, 200)
    throw new AiServiceError(
      `${aggregatorLabel(resolved.gateway)} membalas error (status ${response.status}). ${detail || 'Coba lagi.'}`
    )
  }
  const payload = (await response.json()) as {
    choices?: { message?: { content?: string | Array<{ text?: string }> } }[]
  }
  const content = payload.choices?.[0]?.message?.content
  const text = Array.isArray(content) ? content.map((part) => part.text || '').join('') : content
  if (!text)
    throw new AiServiceError(`${aggregatorLabel(resolved.gateway)} tidak mengembalikan konten.`)
  return text
}

async function callOpenAi(resolved: ResolvedProvider, options: CallAiJsonOptions): Promise<string> {
  if (!resolved.apiKey)
    throw new AiServiceError('API key OpenAI belum diisi. Atur di halaman Konfigurasi AI.')

  const model = resolved.model || 'gpt-5.6-luna'
  const isReasoningModel = /^(o1|o3|o4|gpt-5)/i.test(model)
  const reasoningEffort = options.reasoningEffort || resolved.reasoningEffort

  const body: Record<string, any> = {
    model,
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt },
    ],
    response_format: { type: 'json_object' },
  }

  if (reasoningEffort && reasoningEffort !== 'none') {
    body.reasoning_effort = reasoningEffort
  }

  if (isReasoningModel) {
    body.max_completion_tokens = 4000
  } else {
    body.temperature = 0.3
    body.max_tokens = 2000
  }

  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resolved.apiKey}`,
      },
      body: JSON.stringify(body),
    },
    options.timeoutMs ?? (isReasoningModel ? 90_000 : 45_000)
  )

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    const detail = errorText.slice(0, 200)
    throw new AiServiceError(
      `Layanan AI (OpenAI) membalas error (status ${response.status}). ${detail || 'Coba lagi.'}`
    )
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  const text = payload?.choices?.[0]?.message?.content
  if (!text) throw new AiServiceError('Layanan AI tidak mengembalikan konten. Coba lagi.')
  return text
}

async function callGemini(resolved: ResolvedProvider, options: CallAiJsonOptions): Promise<string> {
  let accessToken: string | null = null
  if (resolved.authMode === 'oauth') {
    accessToken = await refreshGeminiAccessToken(resolved)
    if (!resolved.oauthProjectId) {
      throw new AiServiceError('Google Cloud Project ID Gemini belum diisi.')
    }
  } else if (!resolved.apiKey) {
    throw new AiServiceError('API key Gemini belum diisi. Atur di halaman Konfigurasi AI.')
  }
  if (!resolved.model) throw new AiServiceError('Model Gemini belum dipilih.')

  const baseUrl = resolved.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'
  const url = accessToken
    ? `${baseUrl}/models/${resolved.model}:generateContent`
    : `${baseUrl}/models/${resolved.model}:generateContent?key=${resolved.apiKey}`

  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              'Authorization': `Bearer ${accessToken}`,
              'x-goog-user-project': resolved.oauthProjectId!,
            }
          : {}),
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${options.systemPrompt}\n\n${options.userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      }),
    },
    options.timeoutMs ?? 45_000
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new AiServiceError(
      `Layanan AI (Gemini) membalas error (status ${response.status}). ${body ? body.slice(0, 200) : 'Coba lagi.'}`
    )
  }

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new AiServiceError('Layanan AI tidak mengembalikan konten. Coba lagi.')
  return text
}

/**
 * Generate a question illustration with the configured Gemini credentials.
 *
 * Gemini image responses contain inlineData, so the returned data URL is
 * self-contained and remains usable when the question is rendered/exported.
 * This deliberately does not expose credentials or persist provider response
 * metadata in the question payload.
 */
export async function generateGeminiImage(prompt: string): Promise<string | null> {
  const normalizedPrompt = prompt.trim()
  if (!normalizedPrompt) return null

  const resolved = await resolveProvider()
  if (resolved.provider !== 'gemini') return null

  let accessToken: string | null = null
  if (resolved.authMode === 'oauth') {
    accessToken = await refreshGeminiAccessToken(resolved)
    if (!resolved.oauthProjectId) {
      throw new AiServiceError('Google Cloud Project ID Gemini belum diisi.')
    }
  } else if (!resolved.apiKey) {
    throw new AiServiceError('API key Gemini belum diisi. Atur di halaman Konfigurasi AI.')
  }

  const baseUrl = resolved.baseUrl || 'https://generativelanguage.googleapis.com/v1'
  const url = `${trimTrailingSlashes(baseUrl)}/models/${GEMINI_IMAGE_MODEL}:generateContent`
  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              'Authorization': `Bearer ${accessToken}`,
              'x-goog-user-project': resolved.oauthProjectId!,
            }
          : { 'x-goog-api-key': resolved.apiKey! }),
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: normalizedPrompt }] }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: { aspectRatio: '4:3', imageSize: '1K' },
        },
      }),
    },
    90_000
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new AiServiceError(
      `Gemini gagal membuat ilustrasi (status ${response.status}). ${body ? body.slice(0, 200) : 'Coba lagi.'}`
    )
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> }
    }>
  }
  const imagePart = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts || [])
    .find((part) => part.inlineData?.data && part.inlineData.mimeType)?.inlineData

  if (
    !imagePart?.data ||
    !imagePart.mimeType ||
    !ALLOWED_IMAGE_MIME_TYPES.has(imagePart.mimeType)
  ) {
    throw new AiServiceError('Gemini tidak mengembalikan format gambar yang didukung.')
  }

  const imageBytes = Buffer.from(imagePart.data, 'base64')
  if (!imageBytes.length || imageBytes.length > MAX_INLINE_IMAGE_BYTES) {
    throw new AiServiceError('Ukuran ilustrasi dari Gemini tidak aman untuk disimpan.')
  }

  return `data:${imagePart.mimeType};base64,${imageBytes.toString('base64')}`
}

async function generateOpenAiImage(prompt: string): Promise<string> {
  const resolved = await resolveProvider()
  if (resolved.authMode === 'oauth') {
    return generateCodexImage(prompt, resolved.model)
  }
  if (!resolved.apiKey) {
    throw new AiServiceError('API key OpenAI belum diisi untuk membuat gambar.')
  }

  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/images/generations',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resolved.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt,
        size: '1024x1024',
        quality: 'medium',
      }),
    },
    120_000
  )
  if (!response.ok) {
    throw new AiServiceError(
      `OpenAI gagal membuat ilustrasi (status ${response.status}). Coba lagi.`
    )
  }
  const payload = (await response.json()) as { data?: Array<{ b64_json?: string }> }
  const encoded = payload.data?.[0]?.b64_json
  if (!encoded) throw new AiServiceError('OpenAI tidak mengembalikan asset gambar.')
  const imageBytes = Buffer.from(encoded, 'base64')
  if (!imageBytes.length || imageBytes.length > MAX_INLINE_IMAGE_BYTES) {
    throw new AiServiceError('Ukuran ilustrasi dari OpenAI tidak aman untuk disimpan.')
  }
  return `data:image/png;base64,${encoded}`
}

export async function generateConfiguredImage(prompt: string): Promise<string> {
  const resolved = await resolveProvider()
  if (resolved.gateway) {
    throw new AiServiceError(
      `${aggregatorLabel(resolved.gateway)} dipakai untuk SVG/teks. Pilih OpenAI atau Gemini langsung untuk gambar raster.`
    )
  }
  if (resolved.provider === 'gemini') {
    const image = await generateGeminiImage(prompt)
    if (image) return image
  }
  if (resolved.provider === 'openai') return generateOpenAiImage(prompt)
  throw new AiServiceError('Provider AI aktif belum mendukung pembuatan gambar.')
}

export async function generateConfiguredSvg(
  prompt: string
): Promise<{ svg: string; viewBox?: string }> {
  const result = await callAiJson<{ svg?: string; viewBox?: string }>({
    combo: 'svg-illustration',
    systemPrompt: [
      'Kamu generator SVG untuk lembar kerja PAUD/RA/TK.',
      'Balas hanya JSON valid dengan bentuk {"svg":"...","viewBox":"0 0 512 512"}.',
      'SVG wajib outline hitam, background transparan/putih, tanpa teks, tanpa watermark.',
      'Gunakan hanya svg,g,path,circle,ellipse,line,polyline,polygon,rect.',
      'Jangan gunakan script, style, foreignObject, image, href, URL eksternal, atau event handler.',
      'Gambar harus sederhana, jelas, dan cocok untuk anak usia 4-6 tahun.',
    ].join(' '),
    userPrompt: prompt,
    reasoningEffort: 'max',
    timeoutMs: 90_000,
  })
  if (!result.svg || typeof result.svg !== 'string') {
    throw new AiServiceError('Model SVG tidak mengembalikan markup SVG.')
  }
  return { svg: result.svg, viewBox: result.viewBox }
}

async function refreshGeminiAccessToken(resolved: ResolvedProvider): Promise<string> {
  if (
    resolved.oauthAccessToken &&
    resolved.oauthExpiresAt &&
    resolved.oauthExpiresAt > DateTime.now().plus({ seconds: 60 })
  ) {
    return resolved.oauthAccessToken
  }
  if (!resolved.oauthRefreshToken) {
    throw new AiServiceError('Akun Google Gemini belum terhubung. Hubungkan OAuth terlebih dahulu.')
  }
  const clientId = env.get('GOOGLE_CLIENT_ID')
  const clientSecret = env.get('GOOGLE_CLIENT_SECRET')
  if (!clientId || !clientSecret) {
    throw new AiServiceError('GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET belum dikonfigurasi.')
  }
  const response = await fetchWithTimeout(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: resolved.oauthRefreshToken,
        grant_type: 'refresh_token',
      }),
    },
    15_000
  )
  if (!response.ok)
    throw new AiServiceError('Token OAuth Gemini kedaluwarsa. Hubungkan ulang akun Google.')
  const payload = (await response.json()) as { access_token?: string; expires_in?: number }
  if (!payload.access_token)
    throw new AiServiceError('Google tidak mengembalikan access token Gemini.')

  const setting = await AiSetting.current()
  setting.oauthAccessToken = payload.access_token
  setting.oauthExpiresAt = DateTime.now().plus({ seconds: payload.expires_in || 3600 })
  await setting.save()
  return payload.access_token
}

export async function listGeminiModelsForOAuth(): Promise<string[]> {
  const resolved = await resolveProvider()
  if (resolved.provider !== 'gemini' || resolved.authMode !== 'oauth') {
    throw new AiServiceError('Mode OAuth Gemini belum dipilih.')
  }
  const accessToken = await refreshGeminiAccessToken(resolved)
  if (!resolved.oauthProjectId) {
    throw new AiServiceError('Google Cloud Project ID Gemini belum diisi.')
  }

  const baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
  const response = await fetchWithTimeout(
    `${baseUrl}/models?pageSize=1000`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-goog-user-project': resolved.oauthProjectId,
      },
    },
    15_000
  )
  if (!response.ok) {
    throw new AiServiceError(`Gagal ambil daftar model Gemini OAuth (status ${response.status}).`)
  }
  const payload = (await response.json()) as {
    models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>
  }
  return (payload.models || [])
    .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
    .map((model) => (model.name || '').replace(/^models\//, ''))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
}

async function callAnthropic(
  resolved: ResolvedProvider,
  options: CallAiJsonOptions
): Promise<string> {
  if (!resolved.apiKey)
    throw new AiServiceError('API key Anthropic belum diisi. Atur di halaman Konfigurasi AI.')

  const response = await fetchWithTimeout(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': resolved.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: resolved.model || 'claude-sonnet-5',
        max_tokens: 2000,
        temperature: 0.3,
        system: `${options.systemPrompt}\n\nBalas hanya JSON, tanpa markdown code fence, tanpa teks lain.`,
        messages: [{ role: 'user', content: options.userPrompt }],
      }),
    },
    options.timeoutMs ?? 45_000
  )

  if (!response.ok) {
    throw new AiServiceError(
      `Layanan AI (Anthropic) membalas error (status ${response.status}). Coba lagi.`
    )
  }

  const payload = (await response.json()) as { content?: { type: string; text?: string }[] }
  const text = payload?.content?.find((block) => block.type === 'text')?.text
  if (!text) throw new AiServiceError('Layanan AI tidak mengembalikan konten. Coba lagi.')
  return text
}

/** Daftar model live dari provider — dipakai form Konfigurasi AI, bukan alur generate. */
export async function listModels(
  provider: '9router' | 'anthropic' | 'openai' | 'gemini' | 'aggregator',
  apiKey: string,
  options: { gateway?: AiGateway | null; baseUrl?: string | null } = {}
): Promise<string[]> {
  if (!apiKey) throw new AiServiceError('API key belum diisi.')

  if (provider === '9router') {
    const resolved = await resolveProvider()
    let baseUrl = resolved.baseUrl || env.get('ROUTER_API_URL') || 'http://localhost:20128/v1'
    baseUrl = `${trimTrailingSlashes(baseUrl)}/models`
    const response = await fetchWithTimeout(
      baseUrl,
      { method: 'GET', headers: { Authorization: `Bearer ${apiKey}` } },
      15_000
    )
    if (!response.ok) {
      throw new AiServiceError(
        `Gagal ambil daftar model 9Router (status ${response.status}). Cek API key.`
      )
    }
    const payload = (await response.json()) as { data?: { id: string }[] }
    return (payload.data ?? []).map((m) => m.id).sort((a, b) => a.localeCompare(b))
  }

  if (provider === 'aggregator') {
    const gateway = options.gateway
    if (!gateway) throw new AiServiceError('Pilih aggregator terlebih dahulu.')
    const response = await fetchWithTimeout(
      modelListUrl(options.baseUrl || GATEWAY_DEFAULTS[gateway]),
      { method: 'GET', headers: { Authorization: `Bearer ${apiKey}` } },
      15_000
    )
    if (!response.ok) {
      throw new AiServiceError(
        `Gagal ambil daftar model ${aggregatorLabel(gateway)} (status ${response.status}).`
      )
    }
    const payload = (await response.json()) as { data?: Array<{ id?: string }> }
    return (payload.data || [])
      .map((model) => model.id || '')
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
  }

  if (provider === 'gemini') {
    const resolved = await resolveProvider()
    const baseUrl = resolved.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'
    const response = await fetchWithTimeout(
      `${baseUrl}/models?key=${apiKey}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      15_000
    )
    if (!response.ok) {
      throw new AiServiceError(
        `Gagal ambil daftar model Gemini (status ${response.status}). Cek API key.`
      )
    }
    const payload = (await response.json()) as { models?: { name: string }[] }
    return (payload.models ?? [])
      .map((m) => m.name.replace(/^models\//, ''))
      .filter((id) => id.startsWith('gemini-'))
      .sort((a, b) => a.localeCompare(b))
  }

  if (provider === 'openai') {
    let apiModels: string[] = []
    try {
      const response = await fetchWithTimeout(
        'https://api.openai.com/v1/models',
        { method: 'GET', headers: { Authorization: `Bearer ${apiKey}` } },
        15_000
      )
      if (response.ok) {
        const payload = (await response.json()) as { data?: { id: string }[] }
        apiModels = (payload.data ?? [])
          .map((m) => m.id)
          .filter((id) => /^(gpt-|o1|o3|o4|chatgpt-)/.test(id))
      }
    } catch {
      // ignore
    }

    const presetModels = [
      'gpt-5.6-luna',
      'gpt-5.6-terra',
      'gpt-5.6-sol',
      'gpt-5.1-codex',
      'gpt-5',
      'o3-mini',
      'o4-mini',
      'o1',
      'gpt-4o',
      'gpt-4o-mini',
    ]

    const allModels = Array.from(new Set([...presetModels, ...apiModels]))
    return allModels.sort((a, b) => a.localeCompare(b))
  }

  const response = await fetchWithTimeout(
    'https://api.anthropic.com/v1/models',
    { method: 'GET', headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } },
    15_000
  )
  if (!response.ok) {
    throw new AiServiceError(
      `Gagal ambil daftar model Anthropic (status ${response.status}). Cek API key.`
    )
  }
  const payload = (await response.json()) as { data?: { id: string }[] }
  return (payload.data ?? []).map((m) => m.id).sort((a, b) => a.localeCompare(b))
}

/**
 * Test koneksi ke 9Router dengan kirim chat ke model tertentu.
 * Dipanggil dari controller — tidak perlu import fetchWithTimeout terpisah.
 */
export async function test9routerConnection(
  model: string,
  apiKey: string | null | undefined
): Promise<void> {
  const resolved = await resolveProvider()
  let baseUrl = resolved.baseUrl || env.get('ROUTER_API_URL') || 'http://localhost:20128/v1'
  if (!baseUrl.endsWith('/chat/completions')) {
    baseUrl = `${trimTrailingSlashes(baseUrl)}/chat/completions`
  }

  const res = await fetchWithTimeout(
    baseUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Balas HANYA dengan kata "ok"' }],
        temperature: 0.3,
        max_tokens: 50,
      }),
    },
    30_000
  )

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '')
    throw new AiServiceError(
      `9router (${model}) membalas error (status ${res.status}). ${bodyText ? bodyText.slice(0, 300) : 'Cek apakah combo sudah benar dan 9router aktif.'}`
    )
  }

  const rawBody = await res.text()

  // Handle SSE format (9Router kadang balas data:{...} walau stream=false)
  let rawJson = rawBody.trim()
  if (rawJson.startsWith('data: ')) {
    rawJson = rawJson.slice(6).trim()
  }
  // Skip trailing [DONE] marker
  if (rawJson === '[DONE]') {
    throw new AiServiceError(
      `9router (${model}) balas SSE [DONE] tanpa data. Coba combo/model lain.`
    )
  }

  try {
    JSON.parse(rawJson)
  } catch {
    throw new AiServiceError(`9router (${model}) balas bukan JSON: ${rawBody.slice(0, 300)}`)
  }

  // Test koneksi: sufficient bahwa 9Router merespon (HTTP 200)
  // Content tdk wajib — some models return empty delta with finish_reason
}

function stripJsonFence(text: string) {
  const trimmed = text.trim()
  if (!trimmed.startsWith('```')) return trimmed

  const firstNewline = trimmed.indexOf('\n')
  const closingFence = trimmed.lastIndexOf('```')
  if (firstNewline === -1 || closingFence <= firstNewline) return trimmed

  return trimmed.slice(firstNewline + 1, closingFence).trim()
}

async function requestOnce<T>(options: CallAiJsonOptions): Promise<T> {
  const resolved = await resolveProvider()

  let text: string
  switch (resolved.provider) {
    case 'openai':
      text =
        resolved.authMode === 'oauth'
          ? await callCodex(options.systemPrompt, options.userPrompt, resolved.model)
          : await callOpenAi(resolved, options)
      break
    case 'anthropic':
      text = await callAnthropic(resolved, options)
      break
    case 'gemini':
      text = await callGemini(resolved, options)
      break
    default:
      text = resolved.gateway
        ? await callAggregator(resolved, options)
        : await call9router(resolved, options)
  }

  const cleaned = stripJsonFence(text)
  try {
    return JSON.parse(cleaned) as T
  } catch {
    if (/\[TOON:[A-Z]+\]|ITEM::|KEJADIAN::|DESKRIPSI::|TAHAP1::/i.test(cleaned)) {
      return { toon: cleaned } as T
    }
    throw new SyntaxError('AI response bukan JSON valid')
  }
}

/**
 * LLM kadang balas string tunggal alih-alih array, atau lupa satu key.
 * Paksa tiap key jadi string[] sebelum konten disimpan — tanpa ini,
 * shape salah lolos ke DB dan baru meledak pas guru buka mode edit.
 */
export function normalizeStringArraySections(
  raw: Record<string, unknown>,
  keys: string[]
): Record<string, string[]> {
  const normalized: Record<string, string[]> = {}
  for (const key of keys) {
    const value = raw?.[key]
    if (Array.isArray(value)) {
      normalized[key] = value.filter((item): item is string => typeof item === 'string')
    } else if (typeof value === 'string' && value.trim()) {
      normalized[key] = [value]
    } else {
      normalized[key] = []
    }
  }
  return normalized
}

/**
 * Panggil provider AI yang aktif (9router / OpenAI / Anthropic, diatur di
 * halaman admin Konfigurasi AI) dan parse hasilnya sebagai JSON. LLM kadang
 * balas prosa alih-alih JSON murni — kalau parse gagal, retry sekali.
 */
export async function callAiJson<T>(options: CallAiJsonOptions): Promise<T> {
  try {
    return await requestOnce<T>(options)
  } catch (error) {
    if (error instanceof SyntaxError) {
      try {
        return await requestOnce<T>(options)
      } catch {
        throw new AiServiceError('Gagal memproses hasil AI. Coba lagi.')
      }
    }
    throw error
  }
}
