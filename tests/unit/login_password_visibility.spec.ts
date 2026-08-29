import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('login password visibility', () => {
  test('provides an accessible password visibility toggle', async ({ assert }) => {
    const source = await readProjectFile('inertia/pages/auth/login.tsx')

    assert.match(source, /useState/)
    assert.match(source, /Eye\s*,\s*EyeOff/)
    assert.match(source, /const \[showPassword, setShowPassword\] = useState\(false\)/)
    assert.include(source, "type={showPassword ? 'text' : 'password'}")
    assert.include(source, 'type="button"')
    assert.match(source, /aria-label=\{\s*showPassword\s*\? /)
  })
})
