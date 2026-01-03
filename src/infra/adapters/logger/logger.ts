import type { baseEnvSchema } from 'infra/env'
import type { z } from 'zod'

import { DiscordLogger } from './discord-logger'
import { OtelLogger } from './otel-logger'
import { PinoLogger } from './pino-logger'

export type LogParams = {
  msg: string
  data?: {
    correlationId?: string
    [key: string]: any
  }
  error?: Error
}

export interface ILogger {
  info(data: LogParams): void
  error(data: LogParams): void
  debug(data: LogParams): void
  fatal(data: LogParams): void
  warn(data: LogParams): void
}

type OptionsNotifications = 'console' | 'discord' | 'otel'

type Props = {
  development?: OptionsNotifications
  staging?: OptionsNotifications
  production?: OptionsNotifications
}

export class Logger {
  static define(env: z.infer<typeof baseEnvSchema>, definitions?: Props): any {
    const definition = {
      test: 'console',
      development: this.defineProvider(
        env,
        definitions?.development || 'console'
      ),
      staging: this.defineProvider(env, definitions?.staging || 'discord'),
      production: this.defineProvider(env, definitions?.production || 'otel'),
    }

    return definition[env.ENVIRONMENT]
  }

  private static defineProvider(
    env: z.infer<typeof baseEnvSchema>,
    provider: OptionsNotifications
  ) {
    switch (provider) {
      case 'console':
        return new PinoLogger(env)
      case 'discord':
        return new DiscordLogger(env)
      case 'otel':
        return env.OTEL_ENABLE === false
          ? new DiscordLogger(env)
          : new OtelLogger(env)
      default:
        return PinoLogger
    }
  }
}
