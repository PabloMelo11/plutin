import type { z } from 'zod'

import type { baseEnvSchema } from '../../env'

import { DiscordNotifier } from './discord'
import { NotificationErrorInMemory } from './in-memory'
import { SentryNotifier } from './sentry'

type OptionsNotifications = 'console' | 'discord' | 'sentry'
type EnvironmentEnum = z.infer<typeof baseEnvSchema>['ENVIRONMENT']

type Props = {
  test?: OptionsNotifications
  development?: OptionsNotifications
  staging?: OptionsNotifications
  production?: OptionsNotifications
}

export class NotificationFactory {
  static define(env: EnvironmentEnum, definitions?: Props): any {
    const defaultDefinition = {
      test: this.defineProvider(definitions?.test ?? 'console'),
      development: this.defineProvider(definitions?.development ?? 'console'),
      staging: this.defineProvider(definitions?.staging ?? 'discord'),
      production: this.defineProvider(definitions?.production ?? 'sentry'),
    }

    return defaultDefinition[env]
  }

  private static defineProvider(provider: OptionsNotifications) {
    switch (provider) {
      case 'console':
        return NotificationErrorInMemory
      case 'discord':
        return DiscordNotifier
      case 'sentry':
        return SentryNotifier
      default:
        return NotificationErrorInMemory
    }
  }
}
