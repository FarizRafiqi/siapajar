import { useEffect, useRef, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string
      remove: (id: string) => void
    }
    FingerprintJS?: {
      load: (options: {
        apiKey: string
        region?: 'us' | 'eu' | 'ap'
      }) => Promise<{ get: () => Promise<{ requestId: string }> }>
    }
  }
}

type Props = {
  turnstileSiteKey: string | null
  fingerprintPublicApiKey: string | null
  onReady: (value: { turnstileToken: string; fingerprintRequestId: string }) => void
}

export function BenefitSecurityCheck({
  turnstileSiteKey,
  fingerprintPublicApiKey,
  onReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [fingerprintRequestId, setFingerprintRequestId] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!turnstileSiteKey) {
      setTurnstileToken('development-bypass')
      return
    }
    const render = () => {
      if (!containerRef.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(containerRef.current, {
        'sitekey': turnstileSiteKey,
        'callback': (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () =>
          setError('Verifikasi keamanan gagal dimuat. Silakan muat ulang halaman.'),
      })
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]')
    if (existing) {
      existing.addEventListener('load', render)
      render()
      return () => existing.removeEventListener('load', render)
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.turnstile = 'true'
    script.addEventListener('load', render)
    document.head.appendChild(script)
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [turnstileSiteKey])

  useEffect(() => {
    if (!fingerprintPublicApiKey) return
    const script = document.createElement('script')
    script.src = `https://fpjscdn.net/v3/${encodeURIComponent(fingerprintPublicApiKey)}/iife.min.js`
    script.async = true
    script.onload = async () => {
      try {
        const agent = await window.FingerprintJS?.load({ apiKey: fingerprintPublicApiKey })
        const result = await agent?.get()
        setFingerprintRequestId(result?.requestId || '')
      } catch {
        setError('Pemeriksaan perangkat tidak dapat dilakukan. Silakan coba lagi.')
      }
    }
    document.head.appendChild(script)
    return () => script.remove()
  }, [fingerprintPublicApiKey])

  useEffect(
    () => onReady({ turnstileToken, fingerprintRequestId }),
    [turnstileToken, fingerprintRequestId, onReady]
  )

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-neutral-800">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
        <p>
          Verifikasi ini menjaga benefit gratis tetap adil untuk setiap guru. Data identitas
          perangkat disimpan dalam bentuk hash.
        </p>
      </div>
      <div ref={containerRef} className="mt-3" />
      {error && <p className="mt-2 text-sm font-medium text-rose-700">{error}</p>}
    </div>
  )
}
