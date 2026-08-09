import { test } from '@japa/runner'
import { authorize, type McpContext } from '../../mcp/auth.js'
import { checkResourceOwnership, checkAiRateLimit, resetAiRateLimits } from '../../mcp/scoping.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerAllTools } from '../../mcp/registry.js'

test.group('mcp rbac & scoping', (group) => {
  group.each.teardown(() => {
    resetAiRateLimits()
  })

  test('role deny blocks guru from admin tools', ({ assert }) => {
    const guruCtx: McpContext = {
      key: {} as any,
      user: { id: 10, role: 'guru' } as any,
      role: 'guru',
      schoolId: 1,
      scopes: null,
    }

    const listUsersAuth = authorize({ roles: ['admin'], group: 'admin' }, guruCtx, {})
    assert.isFalse(listUsersAuth.ok)
    if (!listUsersAuth.ok) {
      assert.include(listUsersAuth.error, 'Forbidden: Requires one of roles [admin]')
    }

    const seedCurriculumAuth = authorize({ roles: ['admin'], group: 'curriculum' }, guruCtx, {})
    assert.isFalse(seedCurriculumAuth.ok)
  })

  test('kepala sekolah blocked from delete tools by RBAC', ({ assert }) => {
    const ksCtx: McpContext = {
      key: {} as any,
      user: { id: 20, role: 'kepala_sekolah' } as any,
      role: 'kepala_sekolah',
      schoolId: 1,
      scopes: null,
    }

    const deleteClassAuth = authorize(
      { roles: ['admin', 'guru'], group: 'classes', destructive: true },
      ksCtx,
      { id: 1, confirm: true }
    )
    assert.isFalse(deleteClassAuth.ok)
    if (!deleteClassAuth.ok) {
      assert.include(deleteClassAuth.error, 'Forbidden: Requires one of roles [admin, guru]')
    }
  })

  test('ownership check enforces teacher resource boundary', ({ assert }) => {
    const guruCtx: McpContext = {
      key: {} as any,
      user: { id: 15, role: 'guru' } as any,
      role: 'guru',
      schoolId: 1,
      scopes: null,
    }

    const ownRecord = { userId: 15 }
    const otherRecord = { userId: 99 }

    assert.isTrue(checkResourceOwnership(ownRecord, guruCtx))
    assert.isFalse(checkResourceOwnership(otherRecord, guruCtx))

    const adminCtx: McpContext = {
      key: {} as any,
      user: { id: 1, role: 'admin' } as any,
      role: 'admin',
      schoolId: null,
      scopes: null,
    }
    assert.isTrue(checkResourceOwnership(otherRecord, adminCtx))
  })

  test('delete tool requires confirm: true parameter', ({ assert }) => {
    const adminCtx: McpContext = {
      key: {} as any,
      user: { id: 1, role: 'admin' } as any,
      role: 'admin',
      schoolId: null,
      scopes: null,
    }

    const noConfirm = authorize(
      { roles: ['admin', 'guru'], group: 'classes', destructive: true },
      adminCtx,
      { id: 5 }
    )
    assert.isFalse(noConfirm.ok)
    if (!noConfirm.ok) {
      assert.include(noConfirm.error, "Confirmation required: Set 'confirm: true'")
    }
  })

  test('academic year update requires confirm: true', ({ assert }) => {
    const adminCtx: McpContext = {
      key: {} as any,
      user: { id: 1, role: 'admin' } as any,
      role: 'admin',
      schoolId: null,
      scopes: null,
    }

    const noConfirm = authorize(
      { roles: ['admin'], group: 'academic_years', destructive: true },
      adminCtx,
      { id: 1, is_active: true }
    )
    assert.isFalse(noConfirm.ok)

    const confirmed = authorize(
      { roles: ['admin'], group: 'academic_years', destructive: true },
      adminCtx,
      { id: 1, is_active: true, confirm: true }
    )
    assert.isTrue(confirmed.ok)
  })

  test('ai rate limiter allows 10 calls per 10m then blocks 11th call', ({ assert }) => {
    const userId = 42

    for (let i = 0; i < 10; i++) {
      const res = checkAiRateLimit(userId)
      assert.isTrue(res.allowed)
    }

    const blocked = checkAiRateLimit(userId)
    assert.isFalse(blocked.allowed)
    if (!blocked.allowed) {
      assert.include(blocked.error!, 'Rate limit exceeded: Maximum 10 AI generation requests')
    }
  })

  test('verify duplicate tools are absent from tool registry', ({ assert }) => {
    const server = new McpServer({ name: 'test', version: '1.0.0' })
    registerAllTools(server)

    const registeredTools = (server as any)._registeredTools || (server as any)._tools || {}
    assert.isUndefined(registeredTools['siapajar_add_student_to_class'])
    assert.isUndefined(registeredTools['siapajar_remove_student_from_class'])
  })
})
