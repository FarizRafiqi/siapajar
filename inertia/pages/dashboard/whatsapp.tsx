import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import { Head, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { MessageSquare, CheckCircle2, QrCode, LogOut, RefreshCw } from 'lucide-react'

interface WhatsappProps {
  waStatus: {
    paired: boolean
    phone?: string
  }
}

export default function WhatsappPage({ waStatus }: Readonly<WhatsappProps>) {
  const [paired, setPaired] = useState(waStatus.paired)
  const [phone, setPhone] = useState<string | undefined>(waStatus.phone)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    try {
      const res = await fetch('/whatsapp/status')
      if (res.ok) {
        const data = await res.json()
        setPaired(data.paired)
        setPhone(data.phone)
        if (data.qrDataUrl) {
          setQrCodeUrl(data.qrDataUrl)
        }
      }
    } catch {
      // silent fetch fail
    }
  }

  useEffect(() => {
    setPaired(waStatus.paired)
    setPhone(waStatus.phone)
  }, [waStatus])

  useEffect(() => {
    if (!paired) {
      checkStatus()
      const interval = setInterval(checkStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [paired])

  const handlePair = async () => {
    setLoading(true)
    router.post(
      '/whatsapp/pair',
      {},
      {
        onFinish: () => {
          setLoading(false)
          checkStatus()
        },
      }
    )
  }

  const handleLogout = () => {
    setLoading(true)
    router.post(
      '/whatsapp/logout',
      {},
      {
        onFinish: () => setLoading(false),
      }
    )
  }

  return (
    <DashboardWrapper
      title="WhatsApp Integration"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'WhatsApp' }]}
    >
      <Head title="WhatsApp — SiapAjar" />

      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Pengaturan WhatsApp
          </h2>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Hubungkan WhatsApp milik Anda untuk mengirimi rapor PDF secara langsung ke nomor orang
            tua/wali siswa.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-950">
              <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Status Koneksi
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {paired ? 'WhatsApp Anda sudah terhubung' : 'WhatsApp belum terhubung'}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-6 dark:border-neutral-800">
            {paired ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-sm">Terhubung dengan WhatsApp</p>
                    {phone && <p className="text-xs opacity-90">Nomor: +{phone}</p>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center sm:text-left">
                {qrCodeUrl ? (
                  <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
                    <QrCode className="h-6 w-6 text-emerald-600" />
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Pindai QR Code di bawah dengan WhatsApp di ponsel Anda:
                    </p>
                    <img
                      src={qrCodeUrl}
                      alt="WhatsApp QR Code"
                      className="h-56 w-56 rounded-lg border border-neutral-200 shadow-md dark:border-neutral-700"
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Buka WA &gt; Perangkat Tertaut (Linked Devices) &gt; Tautkan Perangkat (Link a
                      Device)
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Klik &quot;Mulai Pairing&quot; untuk menampilkan QR code WhatsApp.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handlePair}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Memproses...' : 'Mulai Pairing'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}
