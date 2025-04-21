import DependencyContainer from '../core/decorators/dependency-container'
import NotificationErrorInMemory from '../infra/adapters/notifications/in-memory'
import { env } from '../infra/env'
import TempRepository from './repository'
import TempUseCase from './use-case'

DependencyContainer.register('TempRepository', TempRepository, {
  singleton: true,
})

DependencyContainer.register('CreateTempUseCase', TempUseCase, {
  singleton: true,
})

DependencyContainer.registerValue('SentryConfig', {
  dsn: env.SENTRY_DSN,
  environment: 'production',
})

DependencyContainer.registerValue('DiscordConfig', {
  dsn: env.DISCORD_WEBHOOK_URL,
  environment: 'production',
})

DependencyContainer.register('IErrorNotifier', NotificationErrorInMemory, {
  singleton: true,
})
