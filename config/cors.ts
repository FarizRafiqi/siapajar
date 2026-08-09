import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  /**
   * Enable or disable CORS handling globally.
   */
  enabled: true,

  /**
   * In development, allow every origin to simplify local front/backend setup.
   * In production, keep an explicit allowlist (empty by default, so no
   * cross-origin browser access is allowed until configured).
   */
  origin: app.inDev ? true : [],

  /**
   * HTTP methods accepted for cross-origin requests.
   */
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  /**
   * Headers allowed in requests.
   */
  headers: ['Content-Type', 'Authorization', 'MCP-Version', 'Last-Event-ID', 'X-MCP-Session-Id'],

  /**
   * Response headers exposed to the browser.
   */
  exposeHeaders: ['MCP-Version', 'X-MCP-Session-Id'],

  /**
   * Allow cookies/authorization headers on cross-origin requests.
   */
  credentials: true,

  /**
   * Cache CORS preflight response for N seconds.
   */
  maxAge: 90,
})

export default corsConfig
