import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSchema {
  async up() {
    const limits: Record<string, number | null> = { free: 3, basic: 15, pro: null, sekolah: null }
    const packages = await db.from('packages').select('id', 'name')
    for (const pkg of packages) {
      await db
        .table('package_entitlements')
        .insert({
          package_id: pkg.id,
          feature_key: 'ai_image_generation_monthly',
          limit_value: limits[pkg.name] ?? null,
          is_enabled: true,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .onConflict(['package_id', 'feature_key'])
        .ignore()
    }
  }

  async down() {
    await db
      .from('package_entitlements')
      .where('feature_key', 'ai_image_generation_monthly')
      .delete()
  }
}
