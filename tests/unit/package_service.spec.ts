import { test } from '@japa/runner'
import { PackageService } from '#services/package_service'
import type { PackageRepository } from '#repositories/package_repository'

function fakeRepository(names: string[]) {
  return {
    listActive: async () => names.map((name) => ({ toJSON: () => ({ name }) })),
  } as unknown as PackageRepository
}

test.group('PackageService landing pricing', () => {
  test('hides the school package from landing pricing', async ({ assert }) => {
    const service = new PackageService(fakeRepository(['free', 'paket_pemula', 'sekolah']))

    const landing = await service.listForLandingPricing()

    assert.deepEqual(
      landing.map((pack) => pack.name),
      ['free', 'paket_pemula']
    )
  })

  test('keeps the school package in the public package list', async ({ assert }) => {
    const service = new PackageService(fakeRepository(['free', 'sekolah']))

    const all = await service.listActiveForPublic()

    assert.deepEqual(
      all.map((pack) => pack.name),
      ['free', 'sekolah']
    )
  })
})
