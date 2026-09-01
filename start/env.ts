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

  // Rate Limiter
  LIMITER_STORE: Env.schema.enum.optional(['memory', 'redis', 'database'] as const),

  // Database (PostgreSQL)
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE: Env.schema.string(),

  // Redis
  REDIS_HOST: Env.schema.string(),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.secret.optional(),
  QUEUE_DRIVER: Env.schema.enum(['redis', 'sync'] as const),
  AI_QUEUE_MAX_CONCURRENCY: Env.schema.number.optional(),
  AI_QUEUE_MAX_ATTEMPTS: Env.schema.number.optional(),

  // AI Router (9router.com)
  ROUTER_API_KEY: Env.schema.string.optional(),
  ROUTER_API_URL: Env.schema.string.optional(),
  AGGREGATOR_API_KEY: Env.schema.string.optional(),
  COMMAND_CODE_API_KEY: Env.schema.string.optional(),
  OPENROUTER_API_KEY: Env.schema.string.optional(),
  OPENCODE_ZEN_API_KEY: Env.schema.string.optional(),
  TOGETHER_API_KEY: Env.schema.string.optional(),
  APP_URL: Env.schema.string.optional(),
  CODEX_CLI_PATH: Env.schema.string.optional(),
  PDF_BROWSER_EXECUTABLE_PATH: Env.schema.string.optional(),

  // Payment (Xendit & Mayar)
  XENDIT_KEY: Env.schema.string.optional(),
  MAYAR_API_KEY: Env.schema.string.optional(),
  MAYAR_WEBHOOK_TOKEN: Env.schema.string.optional(),
  MAYAR_BASE_URL: Env.schema.string.optional(),
  MAYAR_ENVIRONMENT: Env.schema.enum.optional(['sandbox', 'production'] as const),

  // Account verification and anti-abuse. Secret keys must never reach the browser.
  RESEND_API_KEY: Env.schema.secret.optional(),
  RESEND_FROM_EMAIL: Env.schema.string.optional(),
  TURNSTILE_SITE_KEY: Env.schema.string.optional(),
  TURNSTILE_SECRET_KEY: Env.schema.secret.optional(),
  FINGERPRINT_PUBLIC_API_KEY: Env.schema.string.optional(),
  FINGERPRINT_SERVER_API_KEY: Env.schema.secret.optional(),
  FINGERPRINT_REGION: Env.schema.enum.optional(['us', 'eu', 'ap'] as const),
  FRAUD_IDENTITY_HMAC_SECRET: Env.schema.secret.optional(),
  MAYAR_WEBHOOK_PATH_SECRET: Env.schema.secret.optional(),

  // WhatsApp
  WA_SESSION_DIR: Env.schema.string.optional(),

  // Storage
  STORAGE_PATH: Env.schema.string.optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: Env.schema.string.optional(),
  GOOGLE_CLIENT_SECRET: Env.schema.string.optional(),
  GOOGLE_CALLBACK_URL: Env.schema.string.optional(),
  GEMINI_OAUTH_CALLBACK_URL: Env.schema.string.optional(),
  GEMINI_OAUTH_PROJECT_ID: Env.schema.string.optional(),
})
