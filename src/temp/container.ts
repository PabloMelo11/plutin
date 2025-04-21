import NotificationErrorInMemory from '../infra/notifications/in-memory'
import DependencyContainer from '../core/decorators/dependency-container'
import TempRepository from './repository'
import TempUseCase from './use-case'
import { env } from '../infra/env'

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

DependencyContainer.register('IErrorNotifier', NotificationErrorInMemory, {
  singleton: true,
})
