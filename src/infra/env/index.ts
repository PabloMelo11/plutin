import { z } from 'zod'

import 'dotenv/config'

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']).default('production'),
  ENVIRONMENT: z
    .enum(['test', 'development', 'staging', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  DISCORD_WEBHOOK_URL: z.string().optional(),
  OTEL_ENABLE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  OTEL_SERVICE_NAME: z.string().optional(),
  OTEL_SERVICE_VERSION: z.string().optional(),
})
