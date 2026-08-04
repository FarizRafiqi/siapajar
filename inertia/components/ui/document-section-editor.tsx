import RichTextEditor from '~/components/ui/rich-text-editor'

export function sectionToHtml(value: string | string[] | undefined) {
  if (typeof value === 'string') return value
  return (value ?? []).map((item) => `<p>${item.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>`).join('') || '<p></p>'
}

export function DocumentSectionEditor({ value, onChange, placeholder }: Readonly<{ value: string | string[] | undefined; onChange: (value: string) => void; placeholder: string }>) {
  return <RichTextEditor value={sectionToHtml(value)} onChange={onChange} placeholder={placeholder} minHeight="10rem" />
}

export function DocumentSectionValue({ value }: Readonly<{ value: string | string[] | undefined }>) {
  if (typeof value === 'string') return <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }} />
  return <ul className="space-y-2">{(value ?? []).length === 0 ? <li className="text-neutral-500 dark:text-neutral-400">Belum ada konten</li> : (value ?? []).map((item, i) => <li key={`${i}-${item.slice(0, 12)}`} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300"><span className="mt-1 text-emerald-500">•</span>{item}</li>)}</ul>
}

function sanitizeRichText(value: string) {
  return value.replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '').replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '').replace(/href\s*=\s*(['"])\s*javascript:[^'\"]*\1/gi, 'href="#"')
}
