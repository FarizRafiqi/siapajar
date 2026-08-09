import type { ExamHeader } from '~/pages/dashboard/exams/question-types'

interface KopHeaderProps {
  readonly header: ExamHeader
  readonly user?: {
    readonly schoolName?: string | null
    readonly kopSurat?: {
      readonly logoUrl?: string
      readonly institutionName?: string
      readonly institutionSubName?: string
      readonly addressLine1?: string
      readonly addressLine2?: string
      readonly phone?: string
    }
  }
}

export function KopHeader({ header, user }: KopHeaderProps) {
  const kop = user?.kopSurat || {}
  const logoUrl = header.logoUrl || kop.logoUrl
  const institutionName =
    header.institutionName || kop.institutionName || user?.schoolName || 'NAMA SEKOLAH / TK'
  const institutionSubName = header.institutionSubName || kop.institutionSubName || ''
  const addressLine1 =
    header.addressLine1 || header.institutionAddress || kop.addressLine1 || 'Jl. Pendidikan No. 123'
  const addressLine2 = header.addressLine2 || kop.addressLine2 || ''
  const phone = header.phone || kop.phone || 'Telp. (021) 1234567'

  return (
    <div className="kop-header mb-6 w-full font-serif text-neutral-900 dark:text-white print:mb-4 print:text-black">
      {/* Top Kop Surat Grid */}
      <div className="flex items-center justify-between gap-4 border-b-4 border-double border-neutral-900 dark:border-white pb-3 print:border-black">
        <div className="flex shrink-0 items-center justify-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-20 w-20 object-contain" />
          ) : (
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded border border-dashed border-neutral-400 bg-neutral-50 p-2 text-center text-[10px] font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 print:border-black print:bg-transparent print:text-black">
              <span className="text-xs">LOGO</span>
              <span>SEKOLAH</span>
            </div>
          )}
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold uppercase tracking-wide leading-tight sm:text-xl">
            {institutionName}
          </h1>
          {institutionSubName && (
            <h2 className="text-base font-bold uppercase tracking-wide leading-tight sm:text-lg">
              “{institutionSubName}”
            </h2>
          )}
          <p className="mt-1 text-xs sm:text-sm">{addressLine1}</p>
          {addressLine2 && <p className="text-xs sm:text-sm">{addressLine2}</p>}
          {phone && <p className="text-xs sm:text-sm">{phone}</p>}
        </div>
      </div>

      {/* Identity Metadata & Nilai/Paraf Table */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 text-xs font-medium sm:text-sm">
        {/* Left Side Metadata */}
        <div className="space-y-1.5 min-w-[240px]">
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-bold">Nama</span>
            <span>: ............................................</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-bold">Kelas</span>
            <span>: {header.groupName || 'B2'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-bold">Hari/Tanggal</span>
            <span>: ............................................</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-bold">Bidang Studi</span>
            <span>: {header.subject || 'Bahasa'}</span>
          </div>
        </div>

        {/* Right Side Nilai & Paraf Table Box */}
        <div className="shrink-0">
          <table className="w-64 border-collapse border border-neutral-900 dark:border-white text-center text-xs print:border-black">
            <thead>
              <tr className="border-b border-neutral-900 dark:border-white print:border-black">
                <th
                  rowSpan={2}
                  className="w-20 border-r border-neutral-900 p-1 align-middle font-bold print:border-black dark:border-white"
                >
                  Nilai
                </th>
                <th colSpan={2} className="p-1 font-bold">
                  Paraf
                </th>
              </tr>
              <tr className="border-b border-neutral-900 text-[11px] print:border-black dark:border-white">
                <th className="w-22 border-r border-neutral-900 p-1 font-semibold print:border-black dark:border-white">
                  Guru
                </th>
                <th className="w-22 p-1 font-semibold">Orang Tua</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-12">
                <td className="border-r border-neutral-900 dark:border-white print:border-black" />
                <td className="border-r border-neutral-900 dark:border-white print:border-black" />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
