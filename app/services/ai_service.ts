import env from '#start/env'
import AiSetting from '#models/ai_setting'

/** Error yang aman ditampilkan langsung ke guru — bukan stack trace. */
export class AiServiceError extends Error {}

interface CallAiJsonOptions {
  /** Nama combo 9router (mis. "siapajar-docgen") — diabaikan untuk provider lain. */
  combo: string
  systemPrompt: string
  userPrompt: string
  timeoutMs?: number
}

interface ResolvedProvider {
  provider: '9router' | 'anthropic' | 'openai'
  apiKey: string | null
  baseUrl: string | null
  model: string | null
}

async function resolveProvider(): Promise<ResolvedProvider> {
  const setting = await AiSetting.current()

  // Fallback ke .env cuma valid buat 9router — kunci OpenAI/Anthropic
  // tidak boleh diam-diam dipakai lintas provider.
  const envFallback = setting.provider === '9router' ? env.get('ROUTER_API_KEY') : undefined

  return {
    provider: setting.provider,
    apiKey: setting.apiKey || envFallback || null,
    baseUrl: setting.baseUrl,
    model: setting.model,
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
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

async function call9router(resolved: ResolvedProvider, options: CallAiJsonOptions): Promise<string> {
  const baseUrl = resolved.baseUrl || env.get('ROUTER_API_URL') || 'http://localhost:20128/v1/chat/completions'

  const response = await fetchWithTimeout(
    baseUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(resolved.apiKey ? { Authorization: `Bearer ${resolved.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: options.combo,
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
    throw new AiServiceError(`Layanan AI (9router) membalas error (status ${response.status}). Coba lagi.`)
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  const text = payload?.choices?.[0]?.message?.content
  if (!text) throw new AiServiceError('Layanan AI tidak mengembalikan konten. Coba lagi.')
  return text
}

async function callOpenAi(resolved: ResolvedProvider, options: CallAiJsonOptions): Promise<string> {
  if (!resolved.apiKey) throw new AiServiceError('API key OpenAI belum diisi. Atur di halaman Konfigurasi AI.')

  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resolved.apiKey}`,
      },
      body: JSON.stringify({
        model: resolved.model || 'gpt-4o-mini',
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
    throw new AiServiceError(`Layanan AI (OpenAI) membalas error (status ${response.status}). Coba lagi.`)
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  const text = payload?.choices?.[0]?.message?.content
  if (!text) throw new AiServiceError('Layanan AI tidak mengembalikan konten. Coba lagi.')
  return text
}

async function callAnthropic(resolved: ResolvedProvider, options: CallAiJsonOptions): Promise<string> {
  if (!resolved.apiKey) throw new AiServiceError('API key Anthropic belum diisi. Atur di halaman Konfigurasi AI.')

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
    throw new AiServiceError(`Layanan AI (Anthropic) membalas error (status ${response.status}). Coba lagi.`)
  }

  const payload = (await response.json()) as { content?: { type: string; text?: string }[] }
  const text = payload?.content?.find((block) => block.type === 'text')?.text
  if (!text) throw new AiServiceError('Layanan AI tidak mengembalikan konten. Coba lagi.')
  return text
}

/** Daftar model live dari provider — dipakai form Konfigurasi AI, bukan alur generate. */
export async function listModels(provider: 'anthropic' | 'openai', apiKey: string): Promise<string[]> {
  if (!apiKey) throw new AiServiceError('API key belum diisi.')

  if (provider === 'openai') {
    const response = await fetchWithTimeout(
      'https://api.openai.com/v1/models',
      { method: 'GET', headers: { Authorization: `Bearer ${apiKey}` } },
      15_000
    )
    if (!response.ok) {
      throw new AiServiceError(`Gagal ambil daftar model OpenAI (status ${response.status}). Cek API key.`)
    }
    const payload = (await response.json()) as { data?: { id: string }[] }
    return (payload.data ?? [])
      .map((m) => m.id)
      .filter((id) => /^(gpt-|o1|o3|o4|chatgpt-)/.test(id))
      .sort((a, b) => a.localeCompare(b))
  }

  const response = await fetchWithTimeout(
    'https://api.anthropic.com/v1/models',
    { method: 'GET', headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } },
    15_000
  )
  if (!response.ok) {
    throw new AiServiceError(`Gagal ambil daftar model Anthropic (status ${response.status}). Cek API key.`)
  }
  const payload = (await response.json()) as { data?: { id: string }[] }
  return (payload.data ?? []).map((m) => m.id).sort((a, b) => a.localeCompare(b))
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
      text = await callOpenAi(resolved, options)
      break
    case 'anthropic':
      text = await callAnthropic(resolved, options)
      break
    default:
      text = await call9router(resolved, options)
  }

  try {
    return JSON.parse(stripJsonFence(text)) as T
  } catch {
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
