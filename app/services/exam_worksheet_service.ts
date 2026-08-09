import type Exam from '#models/exam'
import type User from '#models/user'

/**
 * Single printable worksheet contract. Preview and PDF both consume this
 * document so their layout cannot drift between two rendering engines.
 */
export const EXAM_WORKSHEET_PAGE = {
  widthInches: 8.51,
  heightInches: 14.34,
  paddingMm: 10,
} as const

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function text(value: unknown, fallback = ''): string {
  const result = typeof value === 'string' ? value.trim() : ''
  return result || fallback
}

function imageSource(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  const source = value.trim()
  if (source.startsWith('data:image/')) return source
  if (source.startsWith('/')) return source
  return null
}

function imageMarkup(
  value: unknown,
  alt: string,
  className = 'question-image',
  missingMessage = 'Gambar belum tersedia'
): string {
  const source = imageSource(value)
  if (!source) {
    return `<div class="asset-placeholder" role="img" aria-label="${escapeHtml(missingMessage)}"><span>${escapeHtml(missingMessage)}</span></div>`
  }
  return `<img class="${className}" src="${escapeHtml(source)}" alt="${escapeHtml(alt)}" />`
}

function questionAssetMessage(question: Record<string, any>) {
  if (question.assetStatus === 'quota_unavailable') {
    return 'Ilustrasi tidak dibuat karena kuota generate gambar habis.'
  }
  if (question.assetStatus === 'failed') {
    return 'Ilustrasi belum tersedia. Generate ulang setelah konfigurasi AI diperbaiki.'
  }
  return 'Gambar belum tersedia'
}

function itemLabel(item: unknown): string {
  if (typeof item === 'string') return item
  if (!item || typeof item !== 'object') return ''
  const record = item as Record<string, unknown>
  return text(record.label) || text(record.text)
}

function itemImage(item: unknown): unknown {
  if (!item || typeof item !== 'object') return null
  const record = item as Record<string, unknown>
  return record.imageUrl || record.image
}

function renderMatchingItem(item: unknown, missingMessage: string, forceImage = false): string {
  const label = itemLabel(item)
  const image = itemImage(item)
  const hasImageRequest = Boolean(
    item && typeof item === 'object' && (item as Record<string, unknown>).imagePrompt
  )
  const expectedImage = image || hasImageRequest || forceImage
  return `<div class="matching-item">${expectedImage ? imageMarkup(image, label || 'Gambar', 'option-image', missingMessage) : `<span>${escapeHtml(label)}</span>`}</div>`
}

function renderOptions(question: Record<string, any>): string {
  const options = Array.isArray(question.options) ? question.options : []
  return `<div class="options">${options
    .map((option: unknown, index: number) => {
      const label =
        typeof option === 'object' && option
          ? text((option as Record<string, unknown>).label, String.fromCharCode(97 + index))
          : String.fromCharCode(97 + index)
      const value = typeof option === 'string' ? option : itemLabel(option)
      const image = itemImage(option)
      const hasImageRequest = Boolean(
        option && typeof option === 'object' && (option as Record<string, unknown>).imagePrompt
      )
      return `<div class="option"><strong>${escapeHtml(label.toLowerCase())}.</strong>${image || hasImageRequest ? imageMarkup(image, value, 'option-image', questionAssetMessage(question)) : ''}<span>${escapeHtml(value)}</span></div>`
    })
    .join('')}</div>`
}

function renderMatching(question: Record<string, any>): string {
  const left = Array.isArray(question.leftItems) ? question.leftItems : []
  const right = Array.isArray(question.rightItems) ? question.rightItems : []
  const rows = Math.max(left.length, right.length, 3)
  const missingMessage = questionAssetMessage(question)
  const forceImage = Boolean(text(question.imagePrompt))
  return `<div class="matching-grid">${Array.from({ length: rows }, (_, index) => `<div class="matching-row"><div>${left[index] ? renderMatchingItem(left[index], missingMessage, forceImage) : ''}</div><span class="connection-dot" aria-hidden="true"></span><div></div><span class="connection-dot" aria-hidden="true"></span><div>${right[index] ? renderMatchingItem(right[index], missingMessage, forceImage) : ''}</div></div>`).join('')}</div>`
}

function renderTracing(question: Record<string, any>): string {
  const traceText = text(question.traceText) || text(question.answer) || text(question.question)
  const hasImageRequest = Boolean(text(question.imagePrompt))
  return `<div class="tracing-box">${question.imageUrl ? imageMarkup(question.imageUrl, 'Ilustrasi untuk ditebalkan', 'tracing-image') : hasImageRequest ? imageMarkup(null, 'Ilustrasi untuk ditebalkan', 'tracing-image', questionAssetMessage(question)) : `<span class="trace-text">${escapeHtml(traceText)}</span>`}</div>`
}

function renderColoring(question: Record<string, any>): string {
  return `<div class="coloring-box">${imageMarkup(question.imageUrl, 'Ilustrasi untuk diwarnai', 'coloring-image', questionAssetMessage(question))}</div>`
}

function renderQuestionBody(question: Record<string, any>): string {
  const type = text(question.type)
  if (
    type === 'multiple_choice' ||
    (Array.isArray(question.options) && question.options.length > 0)
  ) {
    return renderOptions(question)
  }
  if (type === 'matching' || text(question.visualType).toLowerCase().includes('hubung')) {
    return renderMatching(question)
  }
  if (type === 'tracing') return renderTracing(question)
  if (type === 'coloring') return renderColoring(question)
  if (type === 'fill_blank_image' || type === 'visual') {
    return `<div class="visual-answer">${imageMarkup(question.imageUrl, 'Gambar soal', 'question-image', questionAssetMessage(question))}<div class="answer-line"></div></div>`
  }
  if (type === 'count_and_circle') {
    const countItems = Array.isArray(question.countItems)
      ? question.countItems
      : [{ count: 4, options: [3, 4, 5] }]
    return `<div class="count-grid">${countItems
      .map(
        (item: Record<string, any>) =>
          `<div class="count-item"><div class="count-dots">${'● '.repeat(Math.max(1, Number(item.count) || 4))}</div><div class="count-options">${(Array.isArray(item.options) ? item.options : [3, 4, 5]).map((option: unknown) => `<span>${escapeHtml(option)}</span>`).join('')}</div></div>`
      )
      .join('')}</div>`
  }
  if (type === 'vertical_math') {
    const problems = Array.isArray(question.mathProblems) ? question.mathProblems : []
    return `<div class="math-grid">${problems.map((problem: Record<string, any>) => `<div class="math-problem"><span>${escapeHtml(problem.topNumber)}</span><span>${escapeHtml(problem.operator)} ${escapeHtml(problem.bottomNumber)}</span></div>`).join('')}</div>`
  }
  if (type === 'practical' || type === 'oral') {
    return `<div class="teacher-observation">${escapeHtml(text(question.instruction) || 'Catat respons dan perilaku anak selama kegiatan.')}</div><div class="essay-lines"><span></span><span></span></div>`
  }
  return `<div class="essay-lines"><span></span><span></span><span></span></div>`
}

function questionSectionLabel(question: Record<string, any>): string {
  const type = text(question.type)
  const labels: Record<string, string> = {
    multiple_choice: 'Pilihan Ganda',
    matching: 'Hubungkan Garis',
    coloring: 'Warnai Sesuai Petunjuk',
    tracing: 'Tebalkan',
    fill_blank_image: 'Tulis Nama Gambar',
    count_and_circle: 'Hitung dan Lingkari',
    vertical_math: 'Hitung Bersusun',
    practical: 'Praktik',
    oral: 'Kegiatan Lisan',
    essay: 'Uraian',
    visual: 'Aktivitas Visual',
  }
  return labels[type] || 'Aktivitas'
}

function renderQuestions(questions: Record<string, any>[]): string {
  let previousSection = ''
  return questions
    .map((question, index) => {
      const section = questionSectionLabel(question)
      const heading =
        section !== previousSection ? `<h2 class="section-title">${escapeHtml(section)}</h2>` : ''
      previousSection = section
      const instruction = text(question.instruction)
      const image =
        question.type !== 'coloring' &&
        question.type !== 'fill_blank_image' &&
        question.type !== 'visual'
          ? imageSource(question.imageUrl)
          : null
      return `${heading}<article class="question"><div class="question-heading"><span class="question-number">${index + 1}.</span><div><p class="question-text">${escapeHtml(text(question.question, 'Pertanyaan belum diisi.'))}</p>${instruction ? `<p class="instruction">${escapeHtml(instruction)}</p>` : ''}</div></div>${renderQuestionBody(question)}${image ? `<div class="question-image-wrap">${imageMarkup(image, 'Gambar soal')}</div>` : ''}</article>`
    })
    .join('')
}

export function renderExamWorksheetHtml(exam: Exam, user: User): string {
  const header = exam.header || {}
  const kop = user.kopSurat || {}
  const institutionName =
    text(header.institutionName) ||
    text(kop.institutionName) ||
    text(user.schoolName, 'SEKOLAH / TK')
  const institutionSubName = text(header.institutionSubName) || text(kop.institutionSubName)
  const addressLine1 =
    text(header.addressLine1) ||
    text(header.institutionAddress) ||
    text(kop.addressLine1, 'Alamat sekolah')
  const addressLine2 = text(header.addressLine2) || text(kop.addressLine2)
  const phone = text(header.phone) || text(kop.phone)
  const logo = imageSource(header.logoUrl || kop.logoUrl)
  const questions = Array.isArray(exam.questions) ? exam.questions : []
  const title = text(exam.title, 'Naskah Soal')

  return `<!doctype html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escapeHtml(title)}</title><style>
    @page{size:${EXAM_WORKSHEET_PAGE.widthInches}in ${EXAM_WORKSHEET_PAGE.heightInches}in;margin:0}
    *{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#000;font-family:"Times New Roman",Times,serif}
    body{width:${EXAM_WORKSHEET_PAGE.widthInches}in;min-height:${EXAM_WORKSHEET_PAGE.heightInches}in}
    .sheet{width:100%;height:${EXAM_WORKSHEET_PAGE.heightInches}in;padding:${EXAM_WORKSHEET_PAGE.paddingMm}mm;overflow:hidden}
    .sheet-content{transform:scale(var(--worksheet-scale,1));transform-origin:top left;width:calc(100% / var(--worksheet-scale,1))}
    .kop{display:grid;grid-template-columns:16% 84%;align-items:center;border-bottom:3px double #000;padding-bottom:5mm}
    .logo{width:22mm;height:22mm;border:1px dashed #555;display:flex;align-items:center;justify-content:center;text-align:center;font-size:8pt;font-weight:bold;overflow:hidden}
    .logo img{width:100%;height:100%;object-fit:contain;border:0}
    .institution{text-align:center}.institution-name{font-size:14pt;font-weight:bold;text-transform:uppercase;margin:0 0 1mm}.institution-sub{font-size:12pt;font-weight:bold;text-transform:uppercase;margin:0 0 1mm}.institution-address,.institution-phone{font-size:9pt;margin:0}
    .meta-score{display:grid;grid-template-columns:58% 42%;gap:4mm;margin-top:4mm;align-items:start}.meta{font-size:9pt;line-height:1.55}.meta-row{display:grid;grid-template-columns:27mm 4mm 1fr}.meta-label{font-weight:bold}.score{border:1px solid #000;display:grid;grid-template-columns:35% 65%;font-size:8pt;text-align:center}.score .nilai{grid-row:span 2;display:flex;align-items:center;justify-content:center;border-right:1px solid #000;font-weight:bold}.score .paraf{grid-column:2;border-bottom:1px solid #000;padding:1mm;font-weight:bold}.score .sign{display:grid;grid-template-columns:1fr 1fr;min-height:12mm}.score .sign span{padding:1mm;border-right:1px solid #000}.score .sign span:last-child{border-right:0}
    .section-title{font-size:11pt;margin:4mm 0 2mm;font-weight:bold}.question{font-size:10pt;margin:0 0 3mm;break-inside:avoid}.question-heading{display:grid;grid-template-columns:7mm 1fr;gap:1mm}.question-number{font-weight:bold}.question-text{font-weight:bold;margin:0;line-height:1.25}.instruction{font-style:italic;font-size:9pt;margin:1mm 0 0}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin:1.5mm 0 0 8mm}.option{display:flex;align-items:center;gap:1mm;min-width:0}.option span{overflow-wrap:anywhere}.option-image{width:12mm;height:12mm;object-fit:contain}.matching-grid{margin:2mm 0 0 8mm}.matching-row{display:grid;grid-template-columns:32% 5% 26% 5% 32%;align-items:center;min-height:10mm}.matching-item{display:flex;align-items:center;gap:2mm;font-weight:bold}.matching-item img{width:10mm;height:10mm;object-fit:contain}.matching-row>div:first-child .matching-item{justify-content:flex-end;text-align:right}.connection-dot{width:3mm;height:3mm;border:1px solid #000;border-radius:50%;justify-self:center}.visual-answer{margin:2mm 0 0 8mm;text-align:center}.question-image,.coloring-image,.tracing-image{display:block;max-width:100%;max-height:38mm;width:auto;height:auto;object-fit:contain;margin:0 auto}.answer-line{border-bottom:1px dotted #000;width:65%;margin:3mm auto 0}.coloring-box{margin:2mm 0 0 8mm;border:1px solid #000;padding:2mm;text-align:center}.coloring-image{max-height:48mm;filter:grayscale(1)}.tracing-box{margin:2mm 0 0 8mm;border:1px dashed #555;padding:4mm;text-align:center}.tracing-image{max-height:52mm;filter:grayscale(1) contrast(1.4)}.trace-text{font-size:24pt;font-weight:bold;color:transparent;background:radial-gradient(circle,#444 1px,transparent 1.2px) 0 0/4px 4px;background-clip:text;-webkit-background-clip:text;-webkit-text-stroke:.25px #555;letter-spacing:2px}.essay-lines{margin:2mm 0 0 8mm;display:grid;gap:3mm}.essay-lines span{height:5mm;border-bottom:1px dotted #000}.math-grid{margin:2mm 0 0 8mm;display:flex;gap:10mm}.math-problem{display:grid;gap:1mm;text-align:right;border-bottom:1px solid #000;min-width:18mm;font-family:monospace}.count-grid{margin:2mm 0 0 8mm;display:grid;grid-template-columns:repeat(2,1fr);gap:4mm}.count-item{text-align:center}.count-dots{font-size:17pt;letter-spacing:1mm}.count-options{display:flex;justify-content:center;gap:5mm;font-weight:bold}.count-options span{border:1px solid #000;border-radius:50%;padding:1mm 3mm}.teacher-observation{margin:2mm 0 0 8mm;border:1px dashed #555;padding:3mm;font-size:9pt}.asset-placeholder{min-height:20mm;border:1px dashed #777;display:flex;align-items:center;justify-content:center;color:#555;font-size:8pt;margin:2mm auto;max-width:70mm;text-align:center;padding:2mm}.question-image-wrap{margin:2mm 0 0 8mm;text-align:center}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.sheet{height:${EXAM_WORKSHEET_PAGE.heightInches}in}}
  </style></head><body><main class="sheet"><div class="sheet-content"><header class="kop"><div class="logo">${logo ? `<img src="${escapeHtml(logo)}" alt="Logo sekolah"/>` : 'LOGO<br/>SEKOLAH'}</div><div class="institution"><p class="institution-name">${escapeHtml(institutionName)}</p>${institutionSubName ? `<p class="institution-sub">${escapeHtml(institutionSubName)}</p>` : ''}<p class="institution-address">${escapeHtml(addressLine1)}</p>${addressLine2 ? `<p class="institution-address">${escapeHtml(addressLine2)}</p>` : ''}${phone ? `<p class="institution-phone">${escapeHtml(phone)}</p>` : ''}</div></header><section class="meta-score"><div class="meta"><div class="meta-row"><span class="meta-label">Nama</span><span>:</span><span>........................................</span></div><div class="meta-row"><span class="meta-label">Kelas</span><span>:</span><span>${escapeHtml(text(header.groupName, 'B2'))}</span></div><div class="meta-row"><span class="meta-label">Hari/Tanggal</span><span>:</span><span>........................................</span></div><div class="meta-row"><span class="meta-label">Bidang Studi</span><span>:</span><span>${escapeHtml(text(header.subject, 'Bahasa'))}</span></div></div><div class="score"><div class="nilai">Nilai</div><div class="paraf">Paraf</div><div class="sign"><span>Guru</span><span>Orang Tua</span></div></div></section><section class="questions">${renderQuestions(questions)}</section></div></main><script>document.fonts.ready.then(function(){var s=document.querySelector('.sheet'),c=document.querySelector('.sheet-content');if(!s||!c)return;var available=s.clientHeight-2;var scale=1;for(var i=0;i<8;i++){c.style.setProperty('--worksheet-scale',String(scale));var ratio=available/c.scrollHeight;if(ratio>=.995)break;scale=Math.max(.35,scale*ratio);if(scale===.35)break;}s.style.setProperty('--worksheet-scale',String(scale));document.documentElement.dataset.worksheetReady='true';});</script></body></html>`
}
