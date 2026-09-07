import { Head, router } from '@inertiajs/react'
import { useCallback, useState } from 'react'
import { Gift, ShieldCheck } from 'lucide-react'
import { BenefitSecurityCheck } from '~/components/auth/benefit-security-check'

type Props = { turnstileSiteKey: string | null; fingerprintPublicApiKey: string | null }

export default function ClaimFreeBenefit({ turnstileSiteKey, fingerprintPublicApiKey }: Props) {
  const [security, setSecurity] = useState({ turnstileToken: '', fingerprintRequestId: '' })
  const [processing, setProcessing] = useState(false)
  const onReady = useCallback((value: typeof security) => setSecurity(value), [])
  const submit = () => {
    setProcessing(true)
    router.post('/claim-free-benefit', security, { onFinish: () => setProcessing(false) })
  }
  const ready =
    Boolean(security.turnstileToken) &&
    (!fingerprintPublicApiKey || Boolean(security.fingerprintRequestId))
  return (
    <>
      <Head title="Aktifkan Benefit Gratis — SiapAjar" />
      <main className="flex min-h-screen items-center justify-center bg-[#fbfbee] p-4">
        <section className="w-full max-w-lg rounded-3xl border-2 border-black bg-white p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex items-center gap-3">
            <Gift className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="text-2xl font-bold text-neutral-950">Aktifkan benefit gratis</h1>
              <p className="text-sm text-neutral-800">Satu benefit gratis untuk satu guru.</p>
            </div>
          </div>
          <div className="my-6">
            <BenefitSecurityCheck
              turnstileSiteKey={turnstileSiteKey}
              fingerprintPublicApiKey={fingerprintPublicApiKey}
              onReady={onReady}
            />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!ready || processing}
            className="btn-kawaii-primary flex w-full items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            {processing ? 'Mengaktifkan...' : 'Aktifkan 10 Kredit Gratis'}
          </button>
        </section>
      </main>
    </>
  )
}
