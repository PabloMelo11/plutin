import 'dotenv/config'

import { z } from 'zod'

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']).default('production'),
  ENVIRONMENT: z
    .enum(['test', 'development', 'staging', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  SHOULD_NOTIFY_ERROR: z.coerce.boolean().default(true),
  SENTRY_DSN: z.string().optional(),
  DISCORD_WEBHOOK_URL: z.string().optional(),
})
