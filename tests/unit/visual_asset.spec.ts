import { test } from '@japa/runner'
import {
  chooseVisualSource,
  promptHash,
  rasterizeSvgSync,
  sanitizeSvg,
} from '#services/visual_asset_service'

test.group('visual asset routing', () => {
  test('sanitizes outline SVG and applies the worksheet defaults', ({ assert }) => {
    const result = sanitizeSvg('<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>')

    assert.equal(result.viewBox, '0 0 24 24')
    assert.include(result.svg, 'stroke="#000000"')
    assert.include(result.svg, '<circle')
  })

  test('rejects SVG scripts, external resources, and text nodes', ({ assert }) => {
    assert.throws(() => sanitizeSvg('<svg><script>alert(1)</script></svg>'))
    assert.throws(() => sanitizeSvg('<svg><image href="https://example.com/a.png" /></svg>'))
    assert.throws(() => sanitizeSvg('<svg><text>Apel</text></svg>'))
  })

  test('routes simple outline prompts to SVG and complex artwork to raster', ({ assert }) => {
    assert.equal(
      chooseVisualSource({ userId: 1, prompt: 'gambar apel sederhana', purpose: 'exam' }),
      'svg'
    )
    assert.equal(
      chooseVisualSource({ userId: 1, prompt: 'pemandangan sawah berwarna', purpose: 'exam' }),
      'raster'
    )
    assert.equal(
      chooseVisualSource({
        userId: 1,
        prompt: 'gambar apel',
        preferredKind: 'raster',
        purpose: 'exam',
      }),
      'raster'
    )
  })

  test('creates a stable cache key and can rasterize SVG for DOCX', ({ assert }) => {
    assert.equal(promptHash('gambar apel'), promptHash('gambar apel'))
    assert.notEqual(promptHash('gambar apel'), promptHash('gambar bunga'))

    const png = rasterizeSvgSync(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>',
      64,
      64
    )
    assert.isAbove(png.length, 100)
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  })
})
