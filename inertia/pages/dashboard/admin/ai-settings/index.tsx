import DashboardWrapper from "~/components/dashboard/dashboard-wrapper"
import { Head, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Sparkles, Zap, RefreshCw } from 'lucide-react'
import { cn } from '~/lib/utils'

function getXsrfToken() {
  const match = /XSRF-TOKEN=([^;]+)/.exec(document.cookie)
  return match ? decodeURIComponent(match[1]) : ''
}

type Provider = '9router' | 'anthropic' | 'openai' | 'gemini'

interface Setting {
  provider: Provider
  baseUrl: string | null
  model: string | null
  hasApiKey: boolean
}

interface AdminAiSettingsIndexProps {
  readonly setting: Setting
}

const PROVIDERS: { value: Provider; label: string; description: string; modelPlaceholder: string }[] = [
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
    description: 'Panggil API OpenAI langsung pakai API key sendiri.',
    modelPlaceholder: 'contoh: gpt-4o-mini',
  },
  {
    value: 'gemini',
    label: 'Gemini (Google)',
    description: 'Panggil API Gemini langsung pakai API key sendiri.',
    modelPlaceholder: 'contoh: gemini-2.0-flash',
  },
]

export default function AdminAiSettingsIndex({ setting }: AdminAiSettingsIndexProps) {
  const { data, setData, put, processing, errors } = useForm({
    provider: setting.provider,
    apiKey: '',
    baseUrl: setting.baseUrl || '',
    model: setting.model || '',
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
    if (!data.apiKey && !setting.hasApiKey) {
      setModelsError('Isi API key dulu sebelum muat daftar model.')
      return
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
        body: JSON.stringify({ provider: data.provider, apiKey: data.apiKey }),
      })
      const json = await res.json()
      if (!res.ok) {
        setModelsError(json.message || 'Gagal muat daftar model.')
        setModels([])
        return
      }
      setModels(json.models || [])
      if (json.models?.length && !json.models.includes(data.model)) {
        setData('model', json.models[0])
      }
    } catch {
      setModelsError('Gagal terhubung ke server.')
    } finally {
      setLoadingModels(false)
    }
  }

  return (
    <DashboardWrapper title="Konfigurasi AI" breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Konfigurasi AI' }]}>
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
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{p.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.provider && <p className="mt-2 text-sm text-red-500">{errors.provider}</p>}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">Kredensial</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  API Key {setting.hasApiKey && <span className="text-neutral-400">(sudah tersimpan — isi untuk ganti)</span>}
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

              {(data.provider === '9router' || data.provider === 'gemini') && (
                <div>
                  <label htmlFor="baseUrl" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Base URL (opsional — kosongkan untuk pakai default dari .env)
                  </label>
                  <input
                    id="baseUrl"
                    type="text"
                    value={data.baseUrl}
                    onChange={(e) => setData('baseUrl', e.target.value)}
                    placeholder="http://localhost:20128/v1/chat/completions"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  />
                  {errors.baseUrl && <p className="mt-1 text-sm text-red-500">{errors.baseUrl}</p>}
                </div>
              )}

              <div>
                  <label htmlFor="model" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
                        placeholder={PROVIDERS.find((p) => p.value === data.provider)?.modelPlaceholder}
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
