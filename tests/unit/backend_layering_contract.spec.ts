import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8')) as T
}

test.group('backend layering contract', () => {
  test('registers the repository import alias', async ({ assert }) => {
    const packageJson = await readJson<{
      imports?: Record<string, string>
    }>('../../package.json')

    assert.equal(packageJson.imports?.['#repositories/*'], './app/repositories/*.js')
  })

  test('documents controller, service, and repository boundaries', async ({ assert }) => {
    const agents = await readFile(new URL('../../AGENTS.md', import.meta.url), 'utf8')

    assert.include(agents, 'Backend Layering: Controller, Service, Repository')
    assert.include(agents, 'query sederhana')
    assert.include(agents, 'query kompleks')
    assert.include(agents, 'query builder')
  })
})
