import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Check, X, ExternalLink, ShieldCheck, Clock, Zap, Ticket } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'

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

const FALLBACK_TIERS: TopupTier[] = [
  {
    id: 'paket_pemula',
    name: 'Paket Pemula',
    credits: 15,
    price: 20000,
    priceFormatted: 'Rp 20rb',
    pricePerCredit: 'Rp 1.333/kredit',
    approxDocs: '≈ 8-10 Modul Ajar',
    description: 'Cocok untuk coba-coba atau kebutuhan mendesak beberapa dokumen',
  },
  {
    id: 'paket_sahabat_guru',
    name: 'Paket Sahabat Guru',
    credits: 45,
    price: 45000,
    priceFormatted: 'Rp 45rb',
    pricePerCredit: 'Rp 1.000/kredit',
    approxDocs: '≈ 25-30 Modul Ajar',
    badge: 'Terlaris',
    description: 'Paling favorit untuk persiapan administrasi 1 semester',
  },
  {
    id: 'paket_guru_teladan',
    name: 'Paket Guru Teladan',
    credits: 100,
    price: 85000,
    priceFormatted: 'Rp 85rb',
    pricePerCredit: 'Rp 850/kredit',
    approxDocs: '≈ 60-70 Modul Ajar',
    description: 'Paket super hemat 100 kredit untuk guru produktif',
  },
  {
    id: 'paket_sekolah',
    name: 'Paket Sekolah',
    credits: 350,
    price: 249000,
    priceFormatted: 'Rp 249rb',
    pricePerCredit: 'Rp 711/kredit',
    approxDocs: '≈ 200+ Modul Ajar',
    badge: 'Paling Hemat',
    description: 'Multi-guru & akreditasi lengkap untuk 1 institusi',
  },
]

const TOOL_COSTS = [
  {
    name: 'Modul Ajar',
    cost: '2 kredit',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
  },
  {
    name: 'Bank Soal · LKPD',
    cost: '1,5 kredit',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200',
  },
  {
    name: 'Prota · Promes · Rubrik',
    cost: '1 kredit',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
  },
  {
    name: 'Komentar Rapor',
    cost: '0,5 kredit',
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
  const [selectedTierId, setSelectedTierId] = useState<string | number>('paket_sahabat_guru')
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [showPromoInput, setShowPromoInput] = useState(false)

  // Fetch live packages from Database
  useEffect(() => {
    let isMounted = true
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data: any[]) => {
        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          const parsedTiers: TopupTier[] = data.map((pkg) => {
            const creditFallbackMap: Record<string, number> = {
              paket_pemula: 15,
              guru_aktif: 15,
              topup_pemula: 15,
              paket_sahabat_guru: 45,
              guru_pro: 45,
              topup_sahabat: 45,
              paket_guru_teladan: 100,
              topup_teladan: 100,
              paket_sekolah: 350,
              sekolah: 350,
            }
            const cf = (pkg.features || []).find((f: string) => f.toLowerCase().includes('kredit'))
            let credits: number
            if (cf) {
              const match = cf.match(/^(\d+)/) ?? cf.match(/\d+/)
              credits = match
                ? Number.parseInt(match[1] ?? match[0], 10)
                : (creditFallbackMap[pkg.name] ?? 45)
            } else {
              credits = creditFallbackMap[pkg.name] ?? 45
            }

            const perCredit = Math.round(pkg.priceMonthly / credits)
            const approxDocs = `≈ ${Math.round(credits / 1.5)} Modul Ajar`

            let badge: string | undefined
            if (pkg.isHighlighted) badge = 'Terlaris'
            else if (credits >= 100) badge = 'Paling Hemat'

            return {
              id: pkg.id,
              name: pkg.displayName || pkg.name,
              credits,
              price: pkg.priceMonthly,
              priceFormatted: `Rp ${(pkg.priceMonthly / 1000).toLocaleString('id-ID')}rb`,
              pricePerCredit: `Rp ${perCredit.toLocaleString('id-ID')}/kredit`,
              approxDocs,
              badge,
              description: pkg.description || 'Paket administrasi guru',
            }
          })
          setTiers(parsedTiers)
          const pop = parsedTiers.find((t) => t.badge === 'Terlaris') || parsedTiers[0]
          setSelectedTierId(pop.id)
        }
      })
      .catch(() => {
        // fallback to FALLBACK_TIERS
      })
    return () => {
      isMounted = false
    }
  }, [])

  if (!isOpen) return null

  const availableTiers = tiers.length > 0 ? tiers : FALLBACK_TIERS
  const selectedTier = availableTiers.find((t) => t.id === selectedTierId) || availableTiers[0]

  const handleCheckout = async () => {
    setIsProcessing(true)
    const toastId = toast.loading('Menyiapkan pembayaran Mayar.id...')

    try {
      const response = await fetch('/api/topup/mayar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          packageName: selectedTier.id,
          packageId: selectedTier.id,
          promoCode: promoCode.trim() || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal membuat tagihan pembayaran')
      }

      toast.success('Membuka halaman pembayaran Mayar.id...', { id: toastId })
      onClose()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem pembayaran', { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Masukkan kode promo terlebih dahulu')
      return
    }
    toast.info(`Kode promo "${promoCode.toUpperCase()}" akan diverifikasi saat pembayaran.`)
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
          <div className="bg-[#047857] dark:bg-[#064e3b] p-4 sm:p-5 text-white flex items-center justify-between border-b-2 border-black shrink-0">
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
            <div className="space-y-3">
              {availableTiers.map((tier) => {
                const isSelected = selectedTierId === tier.id
                return (
                  <div key={tier.id} className="relative">
                    {/* Floating Badge */}
                    {tier.badge && (
                      <div className="absolute -top-2.5 left-4 z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-neutral-950 border border-black font-black text-[10px] shadow-[1px_1px_0px_#000000]">
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
                      {/* Left: Radio + Name & Description */}
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Radio Checkbox */}
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
                            <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                              {tier.credits} kredit
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium truncate mt-0.5">
                            {tier.description}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-bold mt-0.5">
                            {tier.approxDocs}
                          </p>
                        </div>
                      </div>

                      {/* Right: Price */}
                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-neutral-900 dark:text-white">
                          {tier.priceFormatted}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium">
                          {tier.pricePerCredit}
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Promo Code Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300/60 dark:border-emerald-800">
              {!showPromoInput ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-neutral-900 dark:text-white">
                        Punya kode promo?
                      </p>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate">
                        Masukkan kodenya untuk dapat kredit bonus
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border-2 border-black text-xs font-black text-neutral-900 dark:text-white hover:bg-neutral-50 shadow-[1px_1px_0px_#000000] shrink-0"
                  >
                    Gunakan
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode promo..."
                    className="flex-1 min-w-0 px-3 py-1.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shrink-0"
                  >
                    Terapkan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPromoInput(false)
                      setPromoCode('')
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="p-4 sm:p-5 border-t-2 border-black bg-neutral-50 dark:bg-neutral-950 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-neutral-700 dark:text-neutral-300">
                {selectedTier.name} · {selectedTier.credits} kredit
              </span>
              <span className="text-base sm:text-lg font-black text-neutral-950 dark:text-white">
                Rp {selectedTier.price.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              type="button"
              disabled={isProcessing}
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
