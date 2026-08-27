import * as React from 'react'
import { Head } from '@inertiajs/react'
import { Printer, ArrowLeft, FileText } from 'lucide-react'

interface Indicator {
  id: number
  description: string
  evidenceType: string
  achievementCriteria: string
}

interface Objective {
  id: number
  cpId: number
  code: string
  title: string
  groupContext: 'a' | 'b' | null
  indicators: Indicator[]
}

interface CurriculumCp {
  id: number
  element: string
  code: string
  title: string
  description: string
  learningObjectives: Objective[]
}

interface SequenceItem {
  id: number
  order: number
  code: string
  title: string
  unitTopic?: string
  period?: string
  learningObjectiveId: number
}

interface Sequence {
  id: number
  title: string
  items: SequenceItem[]
}

interface Profile {
  institutionName: string
  educationLevel: string
  institutionType: string
  jenjangFase?: string
  curriculumVersion: string
  teacherName: string
  teacherNip: string
  principalName: string
  principalNip: string
}

interface Props {
  cps: CurriculumCp[]
  sequences: Sequence[]
  profile: Profile
}

function stripHtml(str: string): string {
  if (!str) return ''
  return str
    .split('<')
    .map((part) => part.substring(part.indexOf('>') + 1))
    .join('')
}

export default function CurriculumPrintView({ cps, sequences, profile }: Props) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const primarySequence = sequences[0] || null

  // Kelompokkan item ATP berdasarkan unitTopic jika ada
  const groupedSequenceItems: { unitTopic: string; items: SequenceItem[] }[] = []
  if (primarySequence && Array.isArray(primarySequence.items)) {
    const sortedItems = [...primarySequence.items].sort((a, b) => a.order - b.order)
    for (const item of sortedItems) {
      const topic = item.unitTopic || 'Alur Pembelajaran'
      const existing = groupedSequenceItems.find((g) => g.unitTopic === topic)
      if (existing) {
        existing.items.push(item)
      } else {
        groupedSequenceItems.push({ unitTopic: topic, items: [item] })
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // Pisahkan masing-masing elemen per halaman
  const cpElemen1 = cps[0] || null
  const cpElemen2 = cps[1] || null
  const cpElemen3 = cps[2] || null

  const renderElemenTable = (cp: CurriculumCp | null, elemenNum: number) => {
    if (!cp) return null
    const objectives = (Array.isArray(cp.learningObjectives) ? cp.learningObjectives : []).slice(
      0,
      4
    )

    return (
      <div className="elemen-container mb-2">
        {/* Elemen Header Bar */}
        <div className="bg-emerald-800 px-2 py-0.5 text-white border border-black print:bg-emerald-800">
          <span className="text-[8.5px] font-bold uppercase tracking-wide">
            ELEMEN {elemenNum}: {cp.element || '-'}
          </span>
        </div>

        {/* Deskripsi CP */}
        <div className="border-x border-b border-black bg-neutral-50/50 p-1.5 text-[7.5px] leading-tight print:bg-white">
          <div className="font-bold text-neutral-900">Capaian Pembelajaran (CP):</div>
          <p className="mt-0.5 text-justify text-neutral-800">{stripHtml(cp.description)}</p>
        </div>

        {/* Tabel Matriks Elemen Ini */}
        <div className="mt-1 border border-black">
          <table className="matrix-table w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="bg-emerald-800 text-white print:bg-emerald-800">
                <th
                  rowSpan={2}
                  className="w-[12%] border border-black p-1 text-center text-[7.5px] font-bold text-white align-middle"
                >
                  Elemen
                </th>
                <th
                  rowSpan={2}
                  className="w-[16%] border border-black p-1 text-center text-[7.5px] font-bold text-white align-middle"
                >
                  Sub-Elemen CP
                </th>
                {objectives.map((_, i) => (
                  <th
                    key={i}
                    className="w-[18%] border border-black p-1 text-center text-[7.5px] font-bold text-white"
                  >
                    TP {i + 1}
                  </th>
                ))}
                {Array.from({ length: 4 - objectives.length }).map((_, i) => (
                  <th
                    key={`pad-${i}`}
                    className="w-[18%] border border-black p-1 text-center text-[7.5px] font-bold text-white"
                  >
                    -
                  </th>
                ))}
              </tr>
              <tr className="bg-neutral-100 print:bg-neutral-100">
                <th
                  colSpan={4}
                  className="border border-black p-0.5 text-center text-[7px] font-bold text-neutral-900"
                >
                  Usia 4 – 6 Tahun (Kelompok A & B)
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="align-top">
                <td
                  rowSpan={3}
                  className="border border-black bg-emerald-50/20 p-1 text-[7px] font-bold text-emerald-950 align-top print:bg-transparent"
                >
                  {cp.element || '-'}
                </td>
                <td
                  rowSpan={3}
                  className="border border-black p-1 text-[7px] font-bold text-neutral-900 align-top"
                >
                  {cp.title || cp.element || '-'}
                </td>
                {objectives.map((obj, i) => (
                  <td
                    key={i}
                    className="border border-black p-1 text-[7px] leading-tight text-neutral-900"
                  >
                    {stripHtml(obj.title)}
                  </td>
                ))}
                {Array.from({ length: 4 - objectives.length }).map((_, i) => (
                  <td
                    key={`pad-tp-${i}`}
                    className="border border-black p-1 text-center text-neutral-400 text-[7px]"
                  >
                    -
                  </td>
                ))}
              </tr>

              <tr className="bg-neutral-200 print:bg-neutral-200">
                <td
                  colSpan={4}
                  className="border border-black py-0.5 px-1 text-center text-[7px] font-bold tracking-wider text-neutral-900"
                >
                  INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN (IKTP) & BUKTI ASESMEN
                </td>
              </tr>

              <tr className="align-top">
                {objectives.map((obj, i) => {
                  const indicators = Array.isArray(obj.indicators) ? obj.indicators : []
                  return (
                    <td
                      key={i}
                      className="border border-black p-1 text-[6.5px] leading-tight text-neutral-900 align-top"
                    >
                      {indicators.length > 0 ? (
                        <div className="space-y-0.5">
                          {indicators.map((ind, idx) => (
                            <div key={ind.id || idx}>
                              <span className="font-bold text-black">{idx + 1}.</span>{' '}
                              {ind.description}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-neutral-400">-</span>
                      )}
                    </td>
                  )
                })}
                {Array.from({ length: 4 - objectives.length }).map((_, i) => (
                  <td
                    key={`pad-iktp-col-${i}`}
                    className="border border-black p-1 text-center text-neutral-300 text-[6.5px]"
                  >
                    -
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-300/80 text-neutral-900 py-4 print:bg-white print:py-0">
      <Head title="Cetak Matriks CP, TP & ATP - SiapAjar" />

      <style>{`
        @page {
          size: A4 landscape;
          margin: 6mm 8mm;
        }
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm 8mm;
          }
          :root, html, body {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            color-scheme: light !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 7.5px !important;
          }
          .no-print {
            display: none !important;
          }
          .page-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
            min-height: auto !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
          .metadata-box {
            border: 1px solid #059669 !important;
            background-color: #ecfdf5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .metadata-table, .metadata-table tr, .metadata-table td {
            border: none !important;
            background: transparent !important;
          }
          .matrix-table {
            width: 100% !important;
            border-collapse: collapse !important;
            border-spacing: 0 !important;
            border: 1px solid #000000 !important;
          }
          .matrix-table th, .matrix-table td {
            border: 1px solid #000000 !important;
          }
          thead {
            display: table-header-group;
          }
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Floating Action Bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-6 py-2.5 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Kurikulum</span>
          </button>

          <span className="hidden text-xs font-medium text-neutral-600 sm:inline">
            Pratinjau Halaman Cetak (A4 Landscape) &bull; <strong>4 Halaman</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/curriculum/export"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-100"
          >
            <FileText className="h-4 w-4 text-emerald-600" />
            <span>Unduh Word (.docx)</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-1.5 text-sm font-bold text-white shadow-md hover:bg-emerald-800 active:scale-[0.98]"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Spacing untuk fixed navbar di layar */}
      <div className="no-print h-12" />

      {/* ========================================================================= */}
      {/* LEMBAR 1: HALAMAN 1 (Kop, Metadata & Elemen 1: Nilai Agama & Budi Pekerti) */}
      {/* ========================================================================= */}
      <div className="page-sheet mx-auto mb-6 w-[297mm] border border-neutral-300 bg-white p-[6mm] shadow-xl print:mb-0 print:w-full print:border-none print:p-0 print:shadow-none">
        {/* Header Kop Dokumen */}
        <div className="mb-1.5 text-center break-inside-avoid">
          <h1 className="text-xs font-bold uppercase tracking-wide text-neutral-900 print:text-black">
            {profile.institutionName}
          </h1>
          <h2 className="text-[9.5px] font-bold tracking-wider text-emerald-800 print:text-emerald-900">
            DOKUMEN CAPAIAN, TUJUAN & ALUR PEMBELAJARAN (CP, TP & ATP)
          </h2>
        </div>

        {/* Kotak Metadata Satuan Pendidikan */}
        <div className="metadata-box mb-2 border border-emerald-500 bg-emerald-50/60 px-3 py-1 break-inside-avoid">
          <table className="metadata-table w-full border-none border-collapse text-[8.5px]">
            <tbody>
              <tr>
                <td className="w-28 py-0.5 font-bold text-emerald-900 whitespace-nowrap">
                  Satuan Pendidikan
                </td>
                <td className="w-3 py-0.5 font-bold text-neutral-900">:</td>
                <td className="py-0.5 font-medium text-neutral-900 pr-4">
                  {profile.institutionName}
                </td>
                <td className="w-28 py-0.5 font-bold text-emerald-900 whitespace-nowrap">
                  Tanggal Cetak
                </td>
                <td className="w-3 py-0.5 font-bold text-neutral-900">:</td>
                <td className="py-0.5 font-medium text-neutral-900">{currentDate}</td>
              </tr>
              <tr>
                <td className="w-28 py-0.5 font-bold text-emerald-900 whitespace-nowrap">
                  Jenjang / Fase
                </td>
                <td className="w-3 py-0.5 font-bold text-neutral-900">:</td>
                <td className="py-0.5 font-medium text-neutral-900 pr-4">
                  {profile.jenjangFase ||
                    `${profile.institutionType === 'ra' ? 'RA' : profile.educationLevel || 'TK'} / Fase Fondasi`}
                </td>
                <td className="w-28 py-0.5 font-bold text-emerald-900 whitespace-nowrap">
                  Versi Kurikulum
                </td>
                <td className="w-3 py-0.5 font-bold text-neutral-900">:</td>
                <td className="py-0.5 font-medium text-neutral-900">{profile.curriculumVersion}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BAGIAN I: MATRIKS CAPAIAN PEMBELAJARAN (CP), TP & IKTP */}
        <div>
          <h3 className="mb-1 text-[9.5px] font-bold uppercase tracking-wider text-emerald-800 print:text-emerald-900 break-inside-avoid">
            I. MATRIKS CAPAIAN PEMBELAJARAN (CP), TP & IKTP -{' '}
            {profile.institutionType === 'ra' ? 'RA' : profile.educationLevel || 'TK'} FASE FONDASI
          </h3>

          {renderElemenTable(cpElemen1, 1)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEMBAR 2: HALAMAN 2 (Elemen 2: Jati Diri)                                  */}
      {/* ========================================================================= */}
      {cpElemen2 && (
        <div className="page-sheet page-break mx-auto mb-6 w-[297mm] border border-neutral-300 bg-white p-[6mm] shadow-xl print:mb-0 print:w-full print:border-none print:p-0 print:shadow-none">
          <h3 className="mb-1 text-[9.5px] font-bold uppercase tracking-wider text-emerald-800 print:text-emerald-900 break-inside-avoid">
            I. MATRIKS CAPAIAN PEMBELAJARAN (CP), TP & IKTP (Lanjutan)
          </h3>
          {renderElemenTable(cpElemen2, 2)}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEMBAR 3: HALAMAN 3 (Elemen 3: Dasar Literasi & STEAM)                    */}
      {/* ========================================================================= */}
      {cpElemen3 && (
        <div className="page-sheet page-break mx-auto mb-6 w-[297mm] border border-neutral-300 bg-white p-[6mm] shadow-xl print:mb-0 print:w-full print:border-none print:p-0 print:shadow-none">
          <h3 className="mb-1 text-[9.5px] font-bold uppercase tracking-wider text-emerald-800 print:text-emerald-900 break-inside-avoid">
            I. MATRIKS CAPAIAN PEMBELAJARAN (CP), TP & IKTP (Lanjutan)
          </h3>
          {renderElemenTable(cpElemen3, 3)}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEMBAR 4: HALAMAN 4 (Bagian II: Matriks ATP & Kolom Pengesahan / TTD)      */}
      {/* ========================================================================= */}
      {primarySequence && (
        <div className="page-sheet page-break mx-auto mb-6 w-[297mm] border border-neutral-300 bg-white p-[6mm] shadow-xl print:mb-0 print:w-full print:border-none print:p-0 print:shadow-none">
          <h3 className="mb-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-800 print:text-emerald-900">
            II. MATRIKS ALUR TUJUAN PEMBELAJARAN (ATP) TERSIMPAN
          </h3>
          <p className="mb-1 text-[8.5px] font-semibold text-neutral-600">
            {primarySequence.title} ({primarySequence.items ? primarySequence.items.length : 0}{' '}
            Langkah Pembelajaran)
          </p>

          <div className="border border-black">
            <table className="matrix-table w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="bg-emerald-800 text-white print:bg-emerald-800">
                  <th className="w-[8%] border border-black p-1 text-center font-bold text-white text-[8px]">
                    Urutan
                  </th>
                  <th className="w-[15%] border border-black p-1 text-center font-bold text-white text-[8px]">
                    Kode TP
                  </th>
                  <th className="w-[52%] border border-black p-1 text-left font-bold text-white text-[8px]">
                    Tujuan Pembelajaran (TP)
                  </th>
                  <th className="w-[25%] border border-black p-1 text-left font-bold text-white text-[8px]">
                    Topik / Alokasi Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedSequenceItems.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    <tr className="bg-emerald-100/80 font-bold text-emerald-950 print:bg-emerald-50">
                      <td
                        colSpan={4}
                        className="border border-black px-1.5 py-0.5 text-[8px] font-bold text-emerald-950"
                      >
                        {group.unitTopic}
                      </td>
                    </tr>

                    {group.items.map((item) => (
                      <tr key={item.order} className="hover:bg-neutral-50">
                        <td className="border border-black p-1 text-center font-semibold text-neutral-800 text-[7.5px]">
                          {item.order}
                        </td>
                        <td className="border border-black p-1 text-center font-mono text-[7.5px] font-bold text-emerald-900">
                          {item.code || `TP-${item.learningObjectiveId}`}
                        </td>
                        <td className="border border-black p-1 leading-tight text-neutral-900 text-[7.5px]">
                          {stripHtml(item.title)}
                        </td>
                        <td className="border border-black p-1 font-bold text-emerald-900 text-[7.5px]">
                          {item.period || '-'}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kolom Tanda Tangan / Pengesahan */}
          <div className="mt-4 break-inside-avoid text-[8.5px]">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="font-bold text-neutral-900">Mengetahui,</p>
                <p className="text-neutral-800">Kepala Sekolah</p>
                <div className="h-12" />
                <p className="font-bold text-neutral-900">
                  {profile.principalName ? `( ${profile.principalName} )` : '\u00A0'}
                </p>
                <p className="text-neutral-700 text-[8px]">
                  NIP. {profile.principalNip || '........................................'}
                </p>
              </div>

              <div>
                <p className="text-neutral-800">.................., {currentDate}</p>
                <p className="text-neutral-800">Penyusun / Guru Kelas</p>
                <div className="h-12" />
                <p className="font-bold text-neutral-900">
                  ( {profile.teacherName || 'Guru Pengampu'} )
                </p>
                <p className="text-neutral-700 text-[8px]">
                  NIP. {profile.teacherNip || '........................................'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
