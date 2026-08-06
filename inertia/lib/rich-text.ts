export function sanitizeRichText(value: string): string {
  return value
    .replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
}

export function packageFeaturesToHtml(features: string[]): string {
  if (features.length === 1 && /<\/?[a-z][^>]*>/i.test(features[0])) return features[0]
  return `<ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>`
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] ?? character
  )
}
