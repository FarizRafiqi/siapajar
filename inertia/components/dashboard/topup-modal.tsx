import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Check, X, ExternalLink, ShieldCheck, Clock, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'

function csrfHeaders() {
  const token = document.cookie
    .split('; ')
    .find((item) => item.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
  return token ? { 'X-XSRF-TOKEN': decodeURIComponent(token) } : {}
}

interface TopupTier {
  id: string | number
  name: string
  credits: number
  price: number
  priceFormatted: string
  pricePerCredit: string
  approxDocs: string
  badge?: string
  description: string
}

const TOOL_COSTS = [
  {
    name: 'Dokumen AI',
    cost: '1 kredit',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
  },
  {
    name: 'Bank Soal & LKPD',
    cost: '1 kredit',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200',
  },
  {
    name: 'Gambar & ilustrasi',
    cost: 'Kuota AI',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
  },
  {
    name: 'Export PDF/DOCX',
    cost: 'Kuota paket',
    bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200',
  },
]

interface TopupModalProps {
  isOpen: boolean
  onClose: () => void
  currentCredits?: number
}

export default function TopupModal({
  isOpen,
  onClose,
  currentCredits = 0,
}: Readonly<TopupModalProps>) {
  const [tiers, setTiers] = useState<TopupTier[]>([])
  const [selectedTierId, setSelectedTierId] = useState<string | number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mobile, setMobile] = useState('')
  const [isLoadingTiers, setIsLoadingTiers] = useState(true)
  const [tiersError, setTiersError] = useState('')

  // Fetch the live catalog. Pricing and credit amounts must never be guessed
  // on the client because a stale fallback can charge the wrong offer.
  useEffect(() => {
    let isMounted = true
    setIsLoadingTiers(true)
    setTiersError('')
    fetch('/api/packages')
      .then(async (res) => {
        if (!res.ok) throw new Error('Paket pembayaran belum dapat dimuat.')
        return (await res.json()) as unknown
      })
      .then((data) => {
        if (!isMounted) return
        const packages = Array.isArray(data) ? data : []
        const parsedTiers = packages.flatMap((pkg: any): TopupTier[] => {
          // The API catalog is the only source of truth. Packages without an
          // explicit integer credit feature (including the free package) are
          // not rendered as purchasable top-ups.
          const creditFeature = (Array.isArray(pkg.features) ? pkg.features : []).find(
            (feature: unknown) => typeof feature === 'string' && /\b\d+\s*kredit\b/i.test(feature)
          )
          const match =
            typeof creditFeature === 'string' ? creditFeature.match(/\b(\d+)\s*kredit\b/i) : null
          const credits = match ? Number.parseInt(match[1], 10) : 0
          const price = Number(pkg.priceMonthly)
          if (
            !pkg.id ||
            !Number.isInteger(credits) ||
            credits <= 0 ||
            !Number.isFinite(price) ||
            price <= 0
          ) {
            return []
          }

          const perCredit = Math.round(price / credits)
          const badge = pkg.isHighlighted ? 'Terlaris' : credits >= 100 ? 'Paling Hemat' : undefined
          return [
            {
              id: pkg.id,
              name: pkg.displayName || pkg.name,
              credits,
              price,
              priceFormatted: `Rp${price.toLocaleString('id-ID')}`,
              pricePerCredit: `Rp${perCredit.toLocaleString('id-ID')}/kredit`,
              approxDocs: `≈ ${credits} penggunaan dokumen`,
              badge,
              description: pkg.description || 'Paket kredit SiapAjar',
            },
          ]
        })
        setTiers(parsedTiers)
        setSelectedTierId(
          parsedTiers.find((tier) => tier.badge === 'Terlaris')?.id ?? parsedTiers[0]?.id ?? null
        )
        if (parsedTiers.length === 0) setTiersError('Belum ada paket kredit yang bisa dibeli.')
      })
      .catch((error: unknown) => {
        if (!isMounted) return
        setTiers([])
        setSelectedTierId(null)
        setTiersError(
          error instanceof Error ? error.message : 'Paket pembayaran belum dapat dimuat.'
        )
      })
      .finally(() => {
        if (isMounted) setIsLoadingTiers(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  if (!isOpen) return null

  const availableTiers = tiers
  const selectedTier = availableTiers.find((t) => t.id === selectedTierId) ?? null

  const handleCheckout = async () => {
    if (!selectedTier) {
      toast.error('Pilih paket kredit yang tersedia terlebih dahulu.')
      return
    }
    if (
      !/^\+?62\d{8,13}$/.test(mobile.replace(/[^0-9+]/g, '')) &&
      !/^0\d{8,13}$/.test(mobile.replace(/[^0-9+]/g, ''))
    ) {
      toast.error('Masukkan nomor WhatsApp yang valid untuk pembayaran.')
      return
    }
    setIsProcessing(true)
    const toastId = toast.loading('Menyiapkan pembayaran Mayar.id...')

    try {
      const response = await fetch('/api/topup/mayar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...csrfHeaders(),
        },
        body: JSON.stringify({
          packageName: selectedTier.id,
          packageId: selectedTier.id,
          mobile,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal membuat tagihan pembayaran')
      }

      toast.success('Membuka halaman pembayaran Mayar.id...', { id: toastId })
      onClose()
      if (data.paymentUrl) {
        window.location.assign(data.paymentUrl)
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem pembayaran', { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[490px] rounded-3xl border-2 border-black bg-white dark:bg-neutral-900 shadow-[8px_8px_0px_#000000] overflow-hidden z-10 text-neutral-900 dark:text-white flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[88vh]"
        >
          {/* Header */}
          <div className="bg-[#047857] dark:bg-[#064e3b] p-4 sm:p-5 text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-amber-300">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-none text-white">
                  Isi Kredit
                </h3>
                <p className="text-xs text-emerald-200/90 font-medium mt-1">
                  Saldo Anda sekarang{' '}
                  <strong className="text-amber-300 font-bold">{currentCredits} kredit</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 custom-scrollbar flex-1 min-h-0">
            {/* Tool Cost Pills (2x2 Grid for clean non-truncated text) */}
            <div className="grid grid-cols-2 gap-2">
              {TOOL_COSTS.map((tool) => (
                <div
                  key={tool.name}
                  className={cn('p-2.5 rounded-2xl border text-center', tool.bg)}
                >
                  <p className="text-[11px] font-bold truncate">{tool.name}</p>
                  <p className="text-xs font-black mt-0.5">{tool.cost}</p>
                </div>
              ))}
            </div>

            {/* Section Title */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Pilih paket
              </h4>
            </div>

            {/* Vertical Package Stack */}
            {isLoadingTiers ? (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 text-center">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Memuat paket kredit…
                </p>
              </div>
            ) : availableTiers.length > 0 ? (
              <div className="space-y-3">
                {availableTiers.map((tier) => {
                  const isSelected = selectedTierId === tier.id
                  return (
                    <div key={tier.id} className="relative">
                      {tier.badge && (
                        <div className="absolute -top-2.5 left-4 z-10">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-neutral-950 border border-black font-black text-[10px] shadow-[1px_1px_0px_#000000] whitespace-nowrap">
                            {tier.badge}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedTierId(tier.id)}
                        className={cn(
                          'w-full p-4 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-3',
                          isSelected
                            ? 'bg-[#d1fae5] dark:bg-emerald-950/70 border-2 border-black shadow-[3px_3px_0px_#000000]'
                            : 'bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-black/50'
                        )}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={cn(
                              'mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors',
                              isSelected
                                ? 'bg-emerald-700 text-white border-2 border-black'
                                : 'border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950'
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-black text-neutral-900 dark:text-white">
                                {tier.name}
                              </span>
                              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                                {tier.credits} kredit
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium truncate mt-0.5">
                              {tier.description}
                            </p>
                            <p className="text-[10px] text-neutral-700 dark:text-neutral-300 font-bold mt-0.5">
                              {tier.approxDocs}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-black text-neutral-900 dark:text-white">
                            {tier.priceFormatted}
                          </div>
                          <div className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium">
                            {tier.pricePerCredit}
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-5 text-center">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {tiersError || 'Paket kredit belum tersedia.'}
                </p>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  Coba lagi setelah katalog pembayaran diaktifkan.
                </p>
              </div>
            )}

            {/* Payment contact */}
            <div>
              <label
                htmlFor="topup-mobile"
                className="mb-1.5 block text-xs font-semibold text-neutral-900 dark:text-white"
              >
                Nomor WhatsApp untuk pembayaran
              </label>
              <input
                id="topup-mobile"
                type="tel"
                inputMode="tel"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                placeholder="contoh: 081234567890"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-emerald-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-neutral-700 dark:text-neutral-300">
                {selectedTier
                  ? `${selectedTier.name} · ${selectedTier.credits} kredit`
                  : 'Belum ada paket dipilih'}
              </span>
              <span className="text-base sm:text-lg font-black text-neutral-950 dark:text-white">
                {selectedTier ? `Rp${selectedTier.price.toLocaleString('id-ID')}` : '—'}
              </span>
            </div>

            <button
              type="button"
              disabled={isProcessing || isLoadingTiers || !selectedTier}
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-sm sm:text-base border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Bayar Sekarang</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pembayaran aman
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Kredit tidak hangus
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" /> Aktif seketika
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
