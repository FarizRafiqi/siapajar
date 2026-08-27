import { Head } from '@inertiajs/react'
import { useState } from 'react'
import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  ExternalLink,
  RotateCw,
  Coins,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

interface TopupTier {
  id: string
  name: string
  credits: number
  price: number
  priceFormatted: string
  costPerDoc: string
  discountBadge?: string
  isPopular?: boolean
  description: string
  features: string[]
}

interface InvoiceItem {
  id: number
  invoiceNo: string
  packageName: string
  creditsAmount: number
  grossAmount: number
  status: 'pending' | 'paid' | 'expired' | 'failed'
  mayarPaymentUrl?: string
  paidAt?: string
  createdAt: string
}

interface TransactionItem {
  id: number
  amount: number
  balanceAfter: number
  type: 'signup_bonus' | 'topup' | 'usage' | 'refund'
  description: string
  createdAt: string
}

interface BillingIndexProps {
  creditsBalance: number
  invoices: InvoiceItem[]
  transactions: TransactionItem[]
}

const TOPUP_TIERS: TopupTier[] = [
  {
    id: 'topup_pemula',
    name: 'Paket Pemula',
    credits: 15,
    price: 15000,
    priceFormatted: 'Rp15.000',
    costPerDoc: 'Rp1.000 / dokumen',
    description: 'Cocok untuk coba-coba atau kebutuhan mendesak beberapa dokumen.',
    features: [
      '15 Kredit SiapAjar',
      'Kredit tidak pernah hangus',
      'Akses Semua Generator AI Express',
      'Download Word (.docx) & PDF',
      'Format Standar Kemendikbudristek',
    ],
  },
  {
    id: 'topup_sahabat',
    name: 'Paket Sahabat Guru',
    credits: 45,
    price: 35000,
    priceFormatted: 'Rp35.000',
    costPerDoc: 'Rp777 / dokumen',
    discountBadge: 'Hemat 22%',
    isPopular: true,
    description: 'Pilihan paling favorit untuk persiapan administrasi 1 semester penuh.',
    features: [
      '45 Kredit SiapAjar',
      'Hemat 22% dibanding paket reguler',
      'Kredit tidak pernah hangus',
      'Akses Modul Ajar, RPPM, LKPD, & Bank Soal',
      'Export Lengkap Word (.docx) & PDF',
      'Format Supervisi Kepala Sekolah',
    ],
  },
  {
    id: 'topup_teladan',
    name: 'Paket Guru Teladan',
    credits: 100,
    price: 65000,
    priceFormatted: 'Rp65.000',
    costPerDoc: 'Rp650 / dokumen',
    discountBadge: 'Hemat 35%',
    description: 'Paket super hemat untuk guru aktif yang menyusun bank soal dan modul rutin.',
    features: [
      '100 Kredit SiapAjar',
      'Hemat 35% (Harga termurah per dokumen)',
      'Kredit tidak pernah hangus',
      'Prioritas Jalur Cepat AI Generator',
      'Download Word (.docx) & PDF tanpa batas',
      'Akses Template Rapor & Katrol Nilai',
    ],
  },
  {
    id: 'sekolah',
    name: 'Paket Sekolah / Komunitas',
    credits: 500,
    price: 250000,
    priceFormatted: 'Rp250.000',
    costPerDoc: 'Rp500 / dokumen',
    discountBadge: 'Hemat 50%',
    description: 'Kuota besar untuk 1 sekolah, KKG, atau gugus PAUD/SD.',
    features: [
      '500 Kredit SiapAjar',
      'Bisa dipakai bersama rekan guru',
      'Kredit tidak pernah hangus',
      'Dashboard & Supervisi Kepala Sekolah',
      'Layanan Bantuan Khusus WhatsApp',
    ],
  },
]

export default function BillingIndex({
  creditsBalance,
  invoices = [],
  transactions = [],
}: Readonly<BillingIndexProps>) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null)
  const [checkingInvoice, setCheckingInvoice] = useState<string | null>(null)

  const handleCheckout = async (tier: TopupTier) => {
    setLoadingTier(tier.id)
    try {
      const response = await fetch('/api/topup/mayar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          packageName: tier.id,
        }),
      })

      const data = await response.json()
      if (response.ok && data.paymentUrl) {
        toast.success(`Membuka halaman pembayaran ${tier.name}...`)
        window.location.assign(data.paymentUrl)
      } else {
        toast.error(data.message || 'Gagal membuat tagihan pembayaran')
      }
    } catch {
      toast.error('Terjadi kesalahan saat memproses checkout')
    } finally {
      setLoadingTier(null)
    }
  }

  const handleCheckStatus = async (invoiceNo: string) => {
    setCheckingInvoice(invoiceNo)
    try {
      const response = await fetch(`/api/topup/invoices/${invoiceNo}`)
      const data = await response.json()
      if (response.ok) {
        if (data.status === 'paid') {
          toast.success('Pembayaran terkonfirmasi! Kredit telah ditambahkan ke akun Anda.')
          setTimeout(() => window.location.reload(), 1000)
        } else {
          toast.info(`Status tagihan: ${data.status.toUpperCase()}`)
        }
      } else {
        toast.error(data.message || 'Gagal memeriksa status tagihan')
      }
    } catch {
      toast.error('Gagal terhubung ke server')
    } finally {
      setCheckingInvoice(null)
    }
  }

  return (
    <DashboardWrapper
      title="Beli Kredit & Paket"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Beli Kredit' }]}
    >
      <Head title="Beli Kredit & Paket SiapAjar" />

      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header & Balance Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white border-2 border-black shadow-[4px_4px_0px_#000000] relative overflow-hidden flex flex-col justify-between">
            {/* Background sparkle accents */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-12 top-6 text-white/10 pointer-events-none">
              <Sparkles className="w-32 h-32" />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-300 text-neutral-950 border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000000]">
                <Zap className="w-3.5 h-3.5 text-neutral-950" />
                Sistem Saldo Kredit SiapAjar
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
                Fleksibel, Hemat, & Tanpa Langganan Mengikat
              </h2>
              <p className="text-emerald-50 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
                Beli kredit sesuai kebutuhan Anda. Kredit <strong>tidak pernah hangus</strong>{' '}
                sehingga Anda bebas menggunakannya kapan pun saat musim administrasi tiba.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t-2 border-white/20 flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-100">
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-black/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 1 Dokumen = 1 Kredit
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-black/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Tanpa Biaya Bulanan
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-black/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Bayar Instan via QRIS &
                E-Wallet
              </span>
            </div>
          </div>

          {/* Saldo Aktif Card */}
          <div className="bg-white dark:bg-neutral-900 border-2 border-black rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[4px_4px_0px_#000000] relative">
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Saldo Kredit Anda Saat Ini
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {creditsBalance}
                </span>
                <span className="text-lg font-extrabold text-neutral-800 dark:text-neutral-200">
                  Kredit
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 pt-4 border-t-2 border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" /> Masa Aktif
                </span>
                <span className="font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300">
                  Selamanya (Aktif)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500" /> Estimasi
                </span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  ~{creditsBalance} Dokumen Lengkap
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Topup Tiers Section */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
              Pilihan Paket Top-Up Kredit
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              Pilih paket yang paling pas untuk Anda. Pembayaran aman & instan via QRIS, GoPay, OVO,
              ShopeePay, dan Transfer Bank melalui Mayar.id.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOPUP_TIERS.map((tier) => {
              const isPopular = tier.isPopular
              return (
                <div
                  key={tier.id}
                  className={cn(
                    'bg-white dark:bg-neutral-900 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 border-2 border-black relative',
                    isPopular
                      ? 'shadow-[6px_6px_0px_#000000] ring-2 ring-emerald-500/30'
                      : 'shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-1'
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-amber-300 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-full border-2 border-black shadow-[2px_2px_0px_#000000] whitespace-nowrap text-center flex items-center justify-center">
                      Paling Populer
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-neutral-900 dark:text-white text-base">
                        {tier.name}
                      </h4>
                      {tier.discountBadge && (
                        <span className="badge-kawaii-amber text-[10px] shrink-0 whitespace-nowrap text-center flex items-center justify-center">
                          {tier.discountBadge}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-neutral-900 dark:text-white">
                          {tier.priceFormatted}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {tier.credits} Kredit ({tier.costPerDoc})
                      </p>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                      {tier.description}
                    </p>

                    <div className="pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 space-y-2.5">
                      {tier.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t-2 border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      disabled={loadingTier === tier.id}
                      onClick={() => handleCheckout(tier)}
                      className={cn(
                        'w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border-2 border-black active:translate-x-[2px] active:translate-y-[2px]',
                        isPopular
                          ? 'bg-emerald-400 text-neutral-950 shadow-[3px_3px_0px_#000000] hover:bg-emerald-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-[3px_3px_0px_#000000] hover:bg-neutral-200'
                      )}
                    >
                      {loadingTier === tier.id ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          Beli Sekarang
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Payment Gateway Trust Badge */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border-2 border-black shadow-[3px_3px_0px_#000000] text-xs text-neutral-700 dark:text-neutral-300 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Pembayaran otomatis terverifikasi & instan via <strong>Mayar.id</strong> (QRIS,
                GoPay, OVO, ShopeePay, Virtual Account).
              </span>
            </div>
            <div className="flex items-center gap-3 font-bold text-neutral-900 dark:text-neutral-100">
              <span className="badge-kawaii-emerald text-[11px] flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" /> QRIS All-Payment
              </span>
              <span className="badge-kawaii-sky text-[11px] flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Virtual Account
              </span>
            </div>
          </div>
        </div>

        {/* Invoices & History Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-black p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                Riwayat Tagihan & Top-Up
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Daftar transaksi dan penambahan kredit akun Anda
              </p>
            </div>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl">
              <Coins className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="font-extrabold text-neutral-700 dark:text-neutral-300 text-sm">
                Belum ada riwayat tagihan
              </p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">
                Tagihan top-up yang Anda buat akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-neutral-200 dark:border-neutral-800 text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase">
                    <th className="pb-3">No. Invoice</th>
                    <th className="pb-3">Paket & Kredit</th>
                    <th className="pb-3">Nominal</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-100 dark:divide-neutral-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3.5 font-mono text-xs font-black text-neutral-900 dark:text-white">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-neutral-900 dark:text-neutral-100">
                          {inv.packageName}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
                          +{inv.creditsAmount} Kredit
                        </p>
                      </td>
                      <td className="py-3.5 font-black text-neutral-900 dark:text-white">
                        Rp{inv.grossAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-black border-2 border-black shadow-[1px_1px_0px_#000000]',
                            inv.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                              : inv.status === 'pending'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300'
                          )}
                        >
                          {inv.status === 'paid'
                            ? 'LUNAS'
                            : inv.status === 'pending'
                              ? 'MENUNGGU'
                              : 'KEDALUWARSA'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        {inv.status === 'pending' && inv.mayarPaymentUrl && (
                          <a
                            href={inv.mayarPaymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Bayar Sekarang <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {inv.status === 'pending' && (
                          <button
                            type="button"
                            disabled={checkingInvoice === inv.invoiceNo}
                            onClick={() => handleCheckStatus(inv.invoiceNo)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-all"
                          >
                            <RotateCw
                              className={cn(
                                'w-3 h-3',
                                checkingInvoice === inv.invoiceNo && 'animate-spin'
                              )}
                            />
                            Cek Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}
