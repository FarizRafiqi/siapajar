import { defineConfig } from '@adonisjs/shield'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

const shieldConfig = defineConfig({
  /**
   * Configure CSP policies for your app. Refer documentation
   * to learn more.
   */
  csp: {
    /**
     * Enable the Content-Security-Policy header.
     */
    // Keep development/HMR permissive, but enforce a baseline policy in the
    // production server. The inline theme bootstrap and Tailwind runtime
    // styles are intentionally allowed; third-party origins are explicit.
    enabled: env.get('NODE_ENV') === 'production',

    /**
     * Per-resource CSP directives.
     */
    useDefaults: true,
    directives: {
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'frame-ancestors': ["'none'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        'https://challenges.cloudflare.com',
        'https://fpjscdn.net',
      ],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
      'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      'connect-src': ["'self'", 'https://challenges.cloudflare.com', 'https://fpjscdn.net'],
      'frame-src': ["'self'", 'https://challenges.cloudflare.com'],
      'worker-src': ["'self'", 'blob:'],
    },

    /**
     * Report violations without blocking resources.
     */
    reportOnly: false,
  },

  /**
   * Configure CSRF protection options. Refer documentation
   * to learn more.
   */
  csrf: {
    /**
     * Enable CSRF token verification for state-changing requests.
     */
    enabled: true,

    /**
     * Route patterns to exclude from CSRF checks.
     * Useful for external webhooks or API endpoints.
     */
    exceptRoutes: (ctx: HttpContext) => {
      const url = ctx.request.url()
      return url.startsWith('/api/webhooks/mayar/') || url === '/mcp' || url === '/.well-known/mcp'
    },

    /**
     * Expose an encrypted XSRF-TOKEN cookie for frontend HTTP clients.
     */
    enableXsrfCookie: true,

    /**
     * HTTP methods protected by CSRF validation.
     */
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  /**
   * Control how your website should be embedded inside
   * iframes.
   */
  xFrame: {
    /**
     * Enable the X-Frame-Options header.
     */
    enabled: true,

    /**
     * Block all framing attempts. Default value is DENY.
     */
    action: 'DENY',
  },

  /**
   * Force browser to always use HTTPS.
   */
  hsts: {
    /**
     * Enable the Strict-Transport-Security header.
     */
    enabled: true,

    /**
     * HSTS policy duration remembered by browsers.
     */
    maxAge: '180 days',
  },

  /**
   * Disable browsers from sniffing content types and rely only
   * on the response content-type header.
   */
  contentTypeSniffing: {
    /**
     * Enable X-Content-Type-Options: nosniff.
     */
    enabled: true,
  },
})

export default shieldConfig
