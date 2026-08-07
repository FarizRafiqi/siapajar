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
}: KopSettingsModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Pengaturan Kop Surat & Identitas
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="kop-logo-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Logo Sekolah
            </label>
            <div className="mt-1 flex items-center gap-3">
              {formData.logoUrl && (
                <img src={formData.logoUrl} alt="Logo" className="h-12 w-12 object-contain rounded border" />
              )}
              <label htmlFor="kop-logo-input" className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <ImageIcon className="h-4 w-4" /> Pilih Logo
                <input id="kop-logo-input" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="kop-inst-name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Nama Lembaga / Sekolah
            </label>
            <input
              id="kop-inst-name"
              type="text"
              value={formData.institutionName}
              onChange={(e) => setFormData((prev) => ({ ...prev, institutionName: e.target.value }))}
              placeholder="Contoh: PLAY GROUP / RA / TK ATTAQWA 31"
              className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="kop-sub-name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Nama Sub / Yayasan / Quotes (“...”)
            </label>
            <input
              id="kop-sub-name"
              type="text"
              value={formData.institutionSubName}
              onChange={(e) => setFormData((prev) => ({ ...prev, institutionSubName: e.target.value }))}
              placeholder="Contoh: AZZUMAR"
              className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="kop-addr-1" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Alamat Baris 1
            </label>
            <input
              id="kop-addr-1"
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
              placeholder="Jl. Assalam III Kav. Lestari / Yamaha"
              className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="kop-addr-2" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Alamat Baris 2
            </label>
            <input
              id="kop-addr-2"
              type="text"
              value={formData.addressLine2}
              onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))}
              placeholder="Ujung Harapan, Bahagia, Babelan, Bekasi 17610"
              className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="kop-phone" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Nomor Telepon
            </label>
            <input
              id="kop-phone"
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Telp. (021) 98186203"
              className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label htmlFor="kop-group-name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Kelompok / Kelas
              </label>
              <input
                id="kop-group-name"
                type="text"
                value={formData.groupName}
                onChange={(e) => setFormData((prev) => ({ ...prev, groupName: e.target.value }))}
                placeholder="B2"
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="kop-subject" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Bidang Studi
              </label>
              <input
                id="kop-subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Bahasa / PAI / Sains"
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" /> Simpan Kop
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
