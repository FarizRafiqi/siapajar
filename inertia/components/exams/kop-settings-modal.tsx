import { useState } from 'react'
import { Building2, Image as ImageIcon, Save, X } from 'lucide-react'
import type { ExamHeader } from '~/pages/dashboard/exams/question-types'

interface KopSettingsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly header: ExamHeader
  readonly onSaveHeader: (newHeader: ExamHeader) => void
}

export function KopSettingsModal({
  isOpen,
  onClose,
  header,
  onSaveHeader,
}: Readonly<KopSettingsModalProps>) {
  const [formData, setFormData] = useState<ExamHeader>({ ...header })

  if (!isOpen) return null

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onSaveHeader(formData)
    onClose()
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, logoUrl: event.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Pengaturan Kop Surat & Identitas Naskah Soal
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="flex items-center gap-3">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Logo"
                  className="h-12 w-12 rounded-xl border border-neutral-200 object-contain p-1 bg-white dark:border-neutral-700"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white text-[10px] font-semibold text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                  No Logo
                </div>
              )}
              <div>
                <span className="block text-xs font-bold text-neutral-900 dark:text-white">
                  Logo Sekolah
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Format PNG/JPG transparan
                </span>
              </div>
            </div>
            <label
              htmlFor="kop-logo-input"
              className="h-10 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <ImageIcon className="h-4 w-4 text-emerald-600" /> Upload / Ganti Logo
              <input
                id="kop-logo-input"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="kop-inst-name"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Nama Lembaga / Sekolah
              </label>
              <input
                id="kop-inst-name"
                type="text"
                value={formData.institutionName || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, institutionName: e.target.value }))
                }
                placeholder="Contoh: PLAY GROUP / RA / TK ATTAQWA 31"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="kop-sub-name"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Nama Sub / Yayasan / Quotes (“...”)
              </label>
              <input
                id="kop-sub-name"
                type="text"
                value={formData.institutionSubName || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, institutionSubName: e.target.value }))
                }
                placeholder="Contoh: AZZUMAR"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="kop-phone"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Nomor Telepon / Kontak
              </label>
              <input
                id="kop-phone"
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Telp. (021) 98186203"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="kop-addr-1"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Alamat Baris 1
              </label>
              <input
                id="kop-addr-1"
                type="text"
                value={formData.addressLine1 || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
                placeholder="Jl. Assalam III Kav. Lestari / Yamaha"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="kop-addr-2"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Alamat Baris 2
              </label>
              <input
                id="kop-addr-2"
                type="text"
                value={formData.addressLine2 || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))}
                placeholder="Ujung Harapan, Bahagia, Babelan, Bekasi 17610"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="kop-group-name"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Kelompok / Kelas
              </label>
              <input
                id="kop-group-name"
                type="text"
                value={formData.groupName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, groupName: e.target.value }))}
                placeholder="B2 / Ibrahim"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="kop-subject"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Bidang Studi / Mata Pelajaran
              </label>
              <input
                id="kop-subject"
                type="text"
                value={formData.subject || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Kognitif"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="h-10 inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
            >
              <Save className="h-4 w-4" /> Simpan Kop & Metadata
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
