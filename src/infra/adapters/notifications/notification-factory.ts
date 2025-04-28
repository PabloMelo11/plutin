import type { z } from 'zod'

import type { baseEnvSchema } from '../../env'

import { DiscordNotifier } from './discord'
import { NotificationErrorInMemory } from './in-memory'
import { SentryNotifier } from './sentry'

type OptionsNotifications = 'console' | 'discord' | 'sentry'
type EnvironmentEnum = z.infer<typeof baseEnvSchema>['ENVIRONMENT']

type Props = {
  local?: OptionsNotifications
  test?: OptionsNotifications
  development?: OptionsNotifications
  staging?: OptionsNotifications
  production?: OptionsNotifications
}

export class NotificationFactory {
  static define(env: EnvironmentEnum, definitions?: Props): any {
    const defaultDefinition = {
      test: this.defineProvider(definitions?.local ?? 'console'),
      development: this.defineProvider(definitions?.local ?? 'console'),
      staging: this.defineProvider(definitions?.local ?? 'discord'),
      production: this.defineProvider(definitions?.local ?? 'sentry'),
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
