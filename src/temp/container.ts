import DependencyContainer from '../core/decorators/dependency-container'
import { env } from '../infra/env'
import NotificationErrorInMemory from '../infra/notifications/in-memory'
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

DependencyContainer.register('IErrorNotifier', NotificationErrorInMemory, {
  singleton: true,
})
