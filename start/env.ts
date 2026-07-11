/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Database (PostgreSQL)
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE: Env.schema.string(),

  // Redis
  REDIS_HOST: Env.schema.string(),
  REDIS_PORT: Env.schema.number(),

  // AI Router (9router.com)
  ROUTER_API_KEY: Env.schema.string.optional(),
  ROUTER_API_URL: Env.schema.string.optional(),

  // Payment (Xendit)
  XENDIT_KEY: Env.schema.string.optional(),

  // WhatsApp
  WA_SESSION_DIR: Env.schema.string.optional(),

  // Storage
  STORAGE_PATH: Env.schema.string.optional(),
})
