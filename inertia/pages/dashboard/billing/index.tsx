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
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            {/* Background sparkle accents */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-12 top-6 text-white/10 pointer-events-none">
              <Sparkles className="w-32 h-32" />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-emerald-100">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Sistem Saldo Kredit SiapAjar
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Fleksibel, Hemat, & Tanpa Langganan Mengikat
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
                Beli kredit sesuai kebutuhan Anda. Kredit <strong>tidak pernah hangus</strong>{' '}
                sehingga Anda bebas menggunakannya kapan pun saat musim administrasi tiba.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 1 Dokumen = 1 Kredit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Tanpa Biaya Bulanan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Bayar Instan via QRIS &
                E-Wallet
              </span>
            </div>
          </div>

          {/* Saldo Aktif Card */}
          <div className="bg-white dark:bg-neutral-900 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Saldo Kredit Anda Saat Ini
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {creditsBalance}
                </span>
                <span className="text-lg font-bold text-neutral-700 dark:text-neutral-300">
                  Kredit
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" /> Masa Aktif
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  Selamanya (Aktif)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500" /> Estimasi
                </span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  ~{creditsBalance} Dokumen Lengkap
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Topup Tiers Section */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Pilihan Paket Top-Up Kredit
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
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
                    'bg-white dark:bg-neutral-900 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 border-2 relative',
                    isPopular
                      ? 'border-emerald-500 shadow-md ring-4 ring-emerald-500/10'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm'
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
                      Paling Populer
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-neutral-900 dark:text-white text-base">
                        {tier.name}
                      </h4>
                      {tier.discountBadge && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
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
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                        {tier.credits} Kredit ({tier.costPerDoc})
                      </p>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
                      {tier.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      disabled={loadingTier === tier.id}
                      onClick={() => handleCheckout(tier)}
                      className={cn(
                        'w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:translate-y-0.5 shadow-sm',
                        isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900'
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
          <div className="bg-neutral-100/70 dark:bg-neutral-900/70 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Pembayaran otomatis terverifikasi & instan via <strong>Mayar.id</strong> (QRIS,
                GoPay, OVO, ShopeePay, Virtual Account).
              </span>
            </div>
            <div className="flex items-center gap-3 font-semibold text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1">
                <QrCode className="w-4 h-4 text-emerald-600" /> QRIS All-Payment
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-blue-600" /> Virtual Account
              </span>
            </div>
          </div>
        </div>

        {/* Invoices & History Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Riwayat Tagihan & Top-Up
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Daftar transaksi dan penambahan kredit akun Anda
              </p>
            </div>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
              <Coins className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm">
                Belum ada riwayat tagihan
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Tagihan top-up yang Anda buat akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-500 uppercase">
                    <th className="pb-3">No. Invoice</th>
                    <th className="pb-3">Paket & Kredit</th>
                    <th className="pb-3">Nominal</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3.5 font-mono text-xs font-bold text-neutral-900 dark:text-white">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-3.5">
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {inv.packageName}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          +{inv.creditsAmount} Kredit
                        </p>
                      </td>
                      <td className="py-3.5 font-bold text-neutral-900 dark:text-white">
                        Rp{inv.grossAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-bold',
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
