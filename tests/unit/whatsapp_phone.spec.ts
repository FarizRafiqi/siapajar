import { test } from '@japa/runner'
import { normalizeIndonesianPhone } from '#services/whatsapp_phone'

test.group('whatsapp phone normalization', () => {
  test('normalizes 08 prefix to 628', ({ assert }) => {
    assert.equal(normalizeIndonesianPhone('081234567890'), '6281234567890')
  })

  test('normalizes +62 prefix with spaces and hyphens', ({ assert }) => {
    assert.equal(normalizeIndonesianPhone('+62 812-3456-7890'), '6281234567890')
  })

  test('keeps 628 prefix untouched', ({ assert }) => {
    assert.equal(normalizeIndonesianPhone('6281234567890'), '6281234567890')
  })

  test('returns null for short digits', ({ assert }) => {
    assert.equal(normalizeIndonesianPhone('123'), null)
  })

  test('returns null for empty or null or undefined input', ({ assert }) => {
    assert.equal(normalizeIndonesianPhone(''), null)
    assert.equal(normalizeIndonesianPhone(null), null)
    assert.equal(normalizeIndonesianPhone(undefined), null)
  })
})
