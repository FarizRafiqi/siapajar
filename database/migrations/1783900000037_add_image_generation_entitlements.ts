import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddImageGenerationEntitlements extends BaseSchema {
  async up() {
    // Entitlements are seeded in database/seeders/database_seeder.ts
  }

  async down() {
    // Entitlements are managed in database/seeders/database_seeder.ts
  }
}
