import { DependencyContainer } from '../core/decorators/dependency-container'
import { TempRepository } from './repository'
import { TempUseCase } from './use-case'

DependencyContainer.register('TempRepository', TempRepository, {
  singleton: true,
})

DependencyContainer.register('CreateTempUseCase', TempUseCase, {
  singleton: true,
})
