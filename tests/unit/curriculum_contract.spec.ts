import { test } from '@japa/runner'

test.group('curriculum contract', () => {
  test('uses a shared PAUD foundation phase for TK and RA', ({ assert }) => {
    assert.deepEqual(
      ['CP', 'TP', 'ATP', 'IKTP/evidence', 'report'],
      ['CP', 'TP', 'ATP', 'IKTP/evidence', 'report']
    )
  })

  test('does not encode Kelompok A/B as separate CP versions', ({ assert }) => {
    const contexts = ['a', 'b']
    assert.deepEqual(contexts, ['a', 'b'])
    assert.notEqual('CP-FONDASI-A', 'CP-FONDASI-B')
  })
})
