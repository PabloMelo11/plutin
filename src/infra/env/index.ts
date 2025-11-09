import { z } from 'zod'

import 'dotenv/config'

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']).default('production'),
  ENVIRONMENT: z
    .enum(['test', 'development', 'staging', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  SHOULD_NOTIFY_ERROR: z.coerce.boolean().default(true),
  SENTRY_DSN: z.string().optional(),
  DISCORD_WEBHOOK_URL: z.string().optional(),
  LOG_LEVEL: z
    .enum(['info', 'error', 'debug', 'fatal', 'warn'])
    .default('info'),
  OTEL_ENABLE: z.coerce.boolean().default(false),
  OTEL_SERVICE_NAME: z.string().optional(),
  OTEL_SERVICE_VERSION: z.string().optional(),
  OTEL_OTLP_TRACES_EXPORTER_URL: z.string().url().optional(),
  OTEL_OTLP_LOGS_EXPORTER_URL: z.string().url().optional(),
  OTEL_OTLP_METRICS_EXPORTER_URL: z.string().url().optional(),
})
