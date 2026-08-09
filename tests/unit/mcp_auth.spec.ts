import { test } from '@japa/runner'
import { checkAuth } from '../../mcp/auth.js'

test.group('mcp auth helper', (group) => {
  let previousEnvKey: string | undefined

  group.setup(() => {
    previousEnvKey = process.env.SIAPAJAR_MCP_API_KEY
  })

  group.teardown(() => {
    if (previousEnvKey !== undefined) {
      process.env.SIAPAJAR_MCP_API_KEY = previousEnvKey
    } else {
      delete process.env.SIAPAJAR_MCP_API_KEY
    }
  })

  test('rejects tool call when SIAPAJAR_MCP_API_KEY environment variable is unset', ({
    assert,
  }) => {
    delete process.env.SIAPAJAR_MCP_API_KEY
    const result = checkAuth({ api_key: 'some-key' })
    assert.isFalse(result.ok)
    if (!result.ok) {
      assert.include(result.error, 'SIAPAJAR_MCP_API_KEY is not set')
    }
  })

  test('rejects tool call with invalid api_key', ({ assert }) => {
    process.env.SIAPAJAR_MCP_API_KEY = 'secret-key-123'
    const result = checkAuth({ api_key: 'wrong-key' })
    assert.isFalse(result.ok)
    if (!result.ok) {
      assert.equal(result.error, 'Invalid api_key.')
    }
  })

  test('accepts tool call with matching api_key', ({ assert }) => {
    process.env.SIAPAJAR_MCP_API_KEY = 'secret-key-123'
    const result = checkAuth({ api_key: 'secret-key-123' })
    assert.isTrue(result.ok)
  })
})
