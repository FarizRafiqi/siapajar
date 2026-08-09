import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
  /**
   * Default logger name used by ctx.logger and app logger calls.
   */
  default: 'app',

  loggers: {
    app: {
      /**
       * Toggle this logger on/off.
       */
      enabled: true,

      /**
       * Logger name shown in log records.
       */
      name: env.get('APP_NAME'),

      /**
       * Minimum level to output (trace, debug, info, warn, error, fatal).
       */
      level: env.get('LOG_LEVEL'),

      /**
       * Configure where logs are written.
       * Pretty logs in development, stdout in production.
       */
      transport: {
        targets: targets()
          .pushIf(!app.inProduction && env.get('MCP_SERVER') !== 'true', targets.pretty())
          .pushIf(
            app.inProduction || env.get('MCP_SERVER') === 'true',
            // MCP speaks JSON-RPC over stdout, so logs must never go there.
            // Destination 2 = stderr keeps the stdio channel clean.
            targets.file({ destination: env.get('MCP_SERVER') === 'true' ? 2 : 1 })
          )
          .toArray(),
      },
    },
  },
})

export default loggerConfig

/**
 * Inferring types for the list of loggers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
