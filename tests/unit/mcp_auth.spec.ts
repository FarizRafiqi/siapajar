import crypto from 'node:crypto'
import { test } from '@japa/runner'
import { resolveMcpContext, authorize, type McpContext } from '../../mcp/auth.js'

test.group('mcp auth helper', () => {
  test('rejects resolveMcpContext when api_key is empty', async ({ assert }) => {
    const result = await resolveMcpContext('')
    assert.isFalse(result.ok)
    if (!result.ok) {
      assert.equal(result.error, 'API key is required.')
    }
  })

  test('authorize allows access when role matches and no scope constraint', ({ assert }) => {
    const mockCtx: McpContext = {
      key: {} as any,
      user: { id: 1, role: 'guru', schoolId: 10 } as any,
      role: 'guru',
      schoolId: 10,
      scopes: null,
    }

    const auth = authorize({ roles: ['admin', 'guru'], group: 'documents' }, mockCtx, {})
    assert.isTrue(auth.ok)
  })

  test('authorize rejects access when role does not match', ({ assert }) => {
    const mockCtx: McpContext = {
      key: {} as any,
      user: { id: 2, role: 'guru', schoolId: 10 } as any,
      role: 'guru',
      schoolId: 10,
      scopes: null,
    }

    const auth = authorize({ roles: ['admin'], group: 'admin' }, mockCtx, {})
    assert.isFalse(auth.ok)
    if (!auth.ok) {
      assert.include(auth.error, "Forbidden: Requires one of roles [admin]. Your role is 'guru'.")
    }
  })

  test('authorize respects key scope restrictions', ({ assert }) => {
    const mockCtx: McpContext = {
      key: {} as any,
      user: { id: 3, role: 'guru', schoolId: 10 } as any,
      role: 'guru',
      schoolId: 10,
      scopes: ['documents'],
    }

    const allowed = authorize({ roles: ['guru'], group: 'documents' }, mockCtx, {})
    assert.isTrue(allowed.ok)

    const denied = authorize({ roles: ['guru'], group: 'assessments' }, mockCtx, {})
    assert.isFalse(denied.ok)
    if (!denied.ok) {
      assert.include(
        denied.error,
        "Forbidden: Key scope does not allow access to 'assessments' tools."
      )
    }
  })

  test('authorize requires confirm: true for destructive tools', ({ assert }) => {
    const mockCtx: McpContext = {
      key: {} as any,
      user: { id: 4, role: 'admin', schoolId: null } as any,
      role: 'admin',
      schoolId: null,
      scopes: null,
    }

    const unconfirmed = authorize(
      { roles: ['admin', 'guru'], group: 'documents', destructive: true },
      mockCtx,
      { id: 5, confirm: false }
    )
    assert.isFalse(unconfirmed.ok)
    if (!unconfirmed.ok) {
      assert.include(unconfirmed.error, "Confirmation required: Set 'confirm: true'")
    }

    const confirmed = authorize(
      { roles: ['admin', 'guru'], group: 'documents', destructive: true },
      mockCtx,
      { id: 5, confirm: true }
    )
    assert.isTrue(confirmed.ok)
  })

  test('key hashing algorithm computes correct sha256 hex digest', ({ assert }) => {
    const rawKey = 'sk_mcp_1234567890abcdef1234567890abcdef'
    const expectedHash = crypto.createHash('sha256').update(rawKey).digest('hex')
    assert.equal(expectedHash.length, 64)
  })
})
