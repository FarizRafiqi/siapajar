import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Sparkles, Zap, RefreshCw } from 'lucide-react'
import { cn } from '~/lib/utils'

function getXsrfToken() {
  const match = /XSRF-TOKEN=([^;]+)/.exec(document.cookie)
  return match ? decodeURIComponent(match[1]) : ''
}

type Provider = '9router' | 'anthropic' | 'openai' | 'gemini' | 'aggregator'
type AuthMode = 'api_key' | 'oauth'
type Gateway = 'command_code' | 'openrouter' | 'opencode_zen' | 'together'
type ReasoningEffort = 'none' | 'low' | 'medium' | 'high' | 'max' | 'xhigh'

interface Setting {
  provider: Provider
  authMode: AuthMode
  baseUrl: string | null
  model: string | null
  gateway: Gateway | null
  reasoningEffort: ReasoningEffort | null
  hasApiKey: boolean
  codexAccount: { email?: string | null; planType?: string | null } | null
  geminiOAuthConnected: boolean
  geminiOAuthEmail: string | null
}

interface AdminAiSettingsIndexProps {
  readonly setting: Setting
}

const PROVIDERS: {
  value: Provider
  label: string
  description: string
  modelPlaceholder: string
}[] = [
  {
    value: '9router',
    label: '9router',
    description: 'Router combo — pilih combo (flash/pro/max) dari daftar model.',
    modelPlaceholder: 'contoh: flash',
  },
  {
    value: 'anthropic',
    label: 'Anthropic (Claude)',
    description: 'Panggil API Anthropic langsung pakai API key sendiri.',
    modelPlaceholder: 'contoh: claude-sonnet-5',
  },
  {
    value: 'openai',
    label: 'OpenAI',
    description: 'API key OpenAI atau subscription ChatGPT melalui Codex CLI.',
    modelPlaceholder: 'contoh: gpt-5.6-luna',
  },
  {
    value: 'gemini',
    label: 'Gemini (Google)',
    description: 'API key Gemini atau Google OAuth langsung.',
    modelPlaceholder: 'contoh: gemini-2.0-flash',
  },
  {
    value: 'aggregator',
    label: 'Aggregator AI',
    description:
      'Pakai satu endpoint OpenAI-compatible untuk model Command Code, OpenRouter, OpenCode, atau Together.',
    modelPlaceholder: 'contoh: gpt-5.6-luna',
  },
]

function getAuthModeLabel(mode: string, provider: string): string {
  if (mode === 'api_key') return 'API Key'
  if (provider === 'openai') return 'OAuth via Codex CLI'
  return 'Google OAuth'
}

const GATEWAYS: { value: Gateway; label: string; description: string }[] = [
  {
    value: 'command_code',
    label: 'Command Code',
    description: 'Subscription aggregator dengan endpoint model OpenAI-compatible.',
  },
  {
    value: 'openrouter',
    label: 'OpenRouter',
    description: 'Pay-as-you-go dengan banyak provider dan model.',
  },
  {
    value: 'opencode_zen',
    label: 'OpenCode Zen',
    description: 'Gateway model OpenCode untuk development dan pengujian.',
  },
  {
    value: 'together',
    label: 'Together AI',
    description: 'Provider pay-as-you-go untuk model open dan multimodal.',
  },
]

const FALLBACK_MODELS: Record<string, string[]> = {
  '9router': ['flash', 'pro', 'max'],
  'anthropic': ['claude-sonnet-5', 'claude-opus-5'],
  'openai': [
    'gpt-5.6-luna',
    'gpt-5.6-terra',
    'gpt-5.6-sol',
    'gpt-5.5',
    'gpt-5.4',
    'gpt-5.4-mini',
    'gpt-5.1-codex',
    'gpt-5',
    'o3-mini',
    'o4-mini',
    'o1',
    'gpt-4o',
    'gpt-4o-mini',
  ],
  'gemini': ['gemini-3.5-flash', 'gemini-3.1-flash-image'],
  'command_code': [
    'gpt-5.6-luna',
    'gpt-5.6-terra',
    'gpt-5.6-sol',
    'gemini-3.5-flash',
    'deepseek-v4-flash',
    'qwen3.7-plus',
  ],
  'openrouter': [
    'openai/gpt-5.6-luna',
    'openai/gpt-5.6-terra',
    'openai/gpt-5.6-sol',
    'google/gemini-3.5-flash',
    'deepseek/deepseek-v4-flash',
    'qwen/qwen3.7-plus',
  ],
  'opencode_zen': [
    'gpt-5.6-luna',
    'gpt-5.6-terra',
    'gpt-5.6-sol',
    'deepseek-v4-flash',
    'qwen3.7-plus',
  ],
  'together': ['Qwen/Qwen3.7-Plus', 'deepseek-ai/DeepSeek-V4-Flash'],
}

function fallbackModels(provider: Provider, gateway: Gateway) {
  return FALLBACK_MODELS[provider === 'aggregator' ? gateway : provider] || []
}

export default function AdminAiSettingsIndex({ setting }: AdminAiSettingsIndexProps) {
  const { data, setData, put, processing, errors } = useForm({
    provider: setting.provider,
    authMode: setting.authMode,
    apiKey: '',
    baseUrl: setting.baseUrl || '',
    model: setting.model || '',
    gateway: setting.gateway || 'command_code',
    reasoningEffort: setting.reasoningEffort || 'medium',
  })

  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [modelsError, setModelsError] = useState('')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    put('/admin/ai-settings')
  }

  const handleTest = () => {
    // Kirim model + apiKey yg ada di form (walau belum disimpan) ke backend
    const payload: Record<string, string> = {}
    if (data.model) payload.model = data.model
    if (data.apiKey) payload.apiKey = data.apiKey
    router.post('/admin/ai-settings/test', payload)
  }

  const handleLoadModels = async () => {
    // Kalau apiKey form kosong tapi sudah ada key tersimpan di server, backend pakai yg di DB
    if (!(data.provider === 'openai' || data.provider === 'gemini') || data.authMode !== 'oauth') {
      if (!data.apiKey && !setting.hasApiKey) {
        setModelsError('Isi API key dulu sebelum muat daftar model.')
        return
      }
    }

    setLoadingModels(true)
    setModelsError('')
    try {
      const res = await fetch('/admin/ai-settings/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getXsrfToken(),
        },
        body: JSON.stringify({
          provider: data.provider,
          authMode: data.authMode,
          apiKey: data.apiKey,
          gateway: data.gateway,
          baseUrl: data.baseUrl,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        const suggestions = fallbackModels(data.provider, data.gateway)
        setModels(suggestions)
        if (suggestions.length && !data.model) setData('model', suggestions[0])
        setModelsError(
          `${json.message || 'Gagal muat daftar model.'} Menampilkan rekomendasi model; pastikan ID ini tersedia di gateway Anda.`
        )
        return
      }
      setModels(json.models || [])
      if (json.models?.length && !json.models.includes(data.model)) {
        setData('model', json.models[0])
      }
    } catch {
      const suggestions = fallbackModels(data.provider, data.gateway)
      setModels(suggestions)
      if (suggestions.length && !data.model) setData('model', suggestions[0])
      setModelsError(
        'Gagal terhubung ke server. Menampilkan rekomendasi model; pastikan ID ini tersedia di gateway Anda.'
      )
    } finally {
      setLoadingModels(false)
    }
  }

  return (
    <DashboardWrapper
      title="Konfigurasi AI"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Konfigurasi AI' }]}
    >
      <Head title="Konfigurasi AI" />

      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Konfigurasi AI</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Pilih penyedia AI untuk generate Modul Ajar, RPPM/RPPH, Soal, Protah, dan Promes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Penyedia AI
            </h3>
            <div className="space-y-3">
              {PROVIDERS.map((p) => (
                <label
                  key={p.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                    data.provider === p.value
                      ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/10'
                      : 'border-neutral-200 dark:border-neutral-700'
                  )}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={p.value}
                    checked={data.provider === p.value}
                    onChange={() => setData('provider', p.value)}
                    aria-label={p.label}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{p.label}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {p.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.provider && <p className="mt-2 text-sm text-red-500">{errors.provider}</p>}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">Kredensial</h3>
            {(data.provider === 'openai' || data.provider === 'gemini') && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                <p className="mb-2 font-medium">
                  Metode autentikasi {data.provider === 'openai' ? 'OpenAI' : 'Gemini'}
                </p>
                <div className="flex gap-4">
                  {(['api_key', 'oauth'] as AuthMode[]).map((mode) => (
                    <label key={mode} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="authMode"
                        value={mode}
                        checked={data.authMode === mode}
                        onChange={() => setData('authMode', mode)}
                      />
                      {getAuthModeLabel(mode, data.provider)}
                    </label>
                  ))}
                </div>
                {data.authMode === 'oauth' && data.provider === 'openai' && (
                  <div className="mt-3 rounded-md border border-blue-300/70 p-3 dark:border-blue-800">
                    <p>
                      Hubungkan subscription ChatGPT melalui Codex CLI resmi. SiapAjar tidak
                      menyimpan token ChatGPT; token dikelola oleh Codex CLI.
                    </p>
                    {setting.codexAccount && (
                      <p className="mt-2 font-medium">
                        Terhubung sebagai {setting.codexAccount.email || 'akun ChatGPT'}
                        {setting.codexAccount.planType ? ` (${setting.codexAccount.planType})` : ''}
                        .
                      </p>
                    )}
                    <a
                      href="/admin/ai-settings/oauth/openai/start"
                      className="mt-3 inline-flex rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Hubungkan ChatGPT via Codex OAuth
                    </a>
                    <p className="mt-2 text-xs opacity-80">
                      Setelah terhubung, isi model Codex (contoh: <code>gpt-5.1-codex</code>) lalu
                      simpan.
                    </p>
                  </div>
                )}
                {data.authMode === 'oauth' && data.provider === 'gemini' && (
                  <div className="mt-3 rounded-md border border-blue-300/70 p-3 dark:border-blue-800">
                    <p>
                      Hubungkan akun Google langsung ke Gemini API. Token OAuth disimpan terenkripsi
                      dan tidak diteruskan melalui 9router.
                    </p>
                    {setting.geminiOAuthConnected && (
                      <p className="mt-2 font-medium">
                        Terhubung sebagai {setting.geminiOAuthEmail || 'akun Google'}.
                      </p>
                    )}
                    <a
                      href="/admin/ai-settings/oauth/gemini/start"
                      className="mt-3 inline-flex rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Hubungkan Google OAuth
                    </a>
                    <p className="mt-2 text-xs opacity-80">
                      Membutuhkan Google Cloud Project ID di <code>GEMINI_OAUTH_PROJECT_ID</code>.
                    </p>
                  </div>
                )}
              </div>
            )}
            {data.provider === '9router' && (
              <div className="mb-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                Konfigurasi koneksi dan akun OAuth 9router dilakukan dari dashboard 9router.
              </div>
            )}
            {data.provider === 'aggregator' && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                Aggregator hanya memakai API key gateway. OAuth ChatGPT/Gemini tetap dikonfigurasi
                pada kartu OpenAI atau Gemini langsung, bukan melalui aggregator.
              </div>
            )}
            <div className="space-y-4">
              {!(
                data.authMode === 'oauth' &&
                (data.provider === 'openai' || data.provider === 'gemini')
              ) && (
                <div>
                  <label
                    htmlFor="apiKey"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    API Key{' '}
                    {setting.hasApiKey && (
                      <span className="text-neutral-400">(sudah tersimpan — isi untuk ganti)</span>
                    )}
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={data.apiKey}
                    onChange={(e) => setData('apiKey', e.target.value)}
                    placeholder={setting.hasApiKey ? '••••••••••••••••' : 'Masukkan API key'}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  />
                  {errors.apiKey && <p className="mt-1 text-sm text-red-500">{errors.apiKey}</p>}
                </div>
              )}

              {data.provider === 'aggregator' && (
                <div>
                  <label
                    htmlFor="gateway"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Gateway aggregator
                  </label>
                  <select
                    id="gateway"
                    value={data.gateway}
                    onChange={(e) => setData('gateway', e.target.value as Gateway)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  >
                    {GATEWAYS.map((gateway) => (
                      <option key={gateway.value} value={gateway.value}>
                        {gateway.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {GATEWAYS.find((gateway) => gateway.value === data.gateway)?.description}
                  </p>
                </div>
              )}

              {(data.provider === '9router' || data.provider === 'aggregator') && (
                <div>
                  <label
                    htmlFor="baseUrl"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Base URL (opsional — kosongkan untuk memakai endpoint default)
                  </label>
                  <input
                    id="baseUrl"
                    type="text"
                    value={data.baseUrl}
                    onChange={(e) => setData('baseUrl', e.target.value)}
                    placeholder={
                      data.provider === 'aggregator'
                        ? 'https://api.commandcode.ai/provider/v1'
                        : 'http://localhost:20128/v1/chat/completions'
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  />
                  {errors.baseUrl && <p className="mt-1 text-sm text-red-500">{errors.baseUrl}</p>}
                </div>
              )}

              {(data.provider === 'openai' || data.provider === 'aggregator') && (
                <div>
                  <label
                    htmlFor="reasoningEffort"
                    className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Mode Berpikir / Tingkat Penalaran (Reasoning Effort)
                  </label>
                  <select
                    id="reasoningEffort"
                    value={data.reasoningEffort || 'medium'}
                    onChange={(e) => setData('reasoningEffort', e.target.value as ReasoningEffort)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="none">None — Nonaktif / tanpa reasoning tambahan</option>
                    <option value="low">Low (Rendah) — Lebih cepat & hemat token</option>
                    <option value="medium">Medium (Sedang) — Seimbang & standar rekomendasi</option>
                    <option value="high">
                      High (Tinggi) — Penalaran mendalam untuk konteks kompleks
                    </option>
                    <option value="xhigh">
                      Extra High (Sangat Tinggi) — Penalaran mendalam Codex
                    </option>
                    <option value="max">
                      Max (Maksimal) — Tingkat penalaran maksimal (OpenAI docs)
                    </option>
                  </select>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Mengontrol kedalaman proses penalaran internal (thinking / reasoning effort)
                    untuk model GPT-5.6 series (Luna, Terra, Sol) dan model o1/o3/o4.
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="model"
                  className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Model
                </label>
                <div className="flex gap-2">
                  {models.length > 0 ? (
                    <select
                      id="model"
                      value={data.model}
                      onChange={(e) => setData('model', e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    >
                      {models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="model"
                      type="text"
                      value={data.model}
                      onChange={(e) => setData('model', e.target.value)}
                      placeholder={
                        PROVIDERS.find((p) => p.value === data.provider)?.modelPlaceholder
                      }
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleLoadModels}
                    disabled={loadingModels}
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <RefreshCw className={cn('h-4 w-4', loadingModels && 'animate-spin')} />
                    {loadingModels ? 'Memuat...' : 'Muat Daftar Model'}
                  </button>
                </div>
                {modelsError && <p className="mt-1 text-sm text-red-500">{modelsError}</p>}
                {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleTest}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Zap className="h-4 w-4" />
              Tes Koneksi
            </button>
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
            </button>
          </div>
        </form>
      </div>
    </DashboardWrapper>
  )
}
