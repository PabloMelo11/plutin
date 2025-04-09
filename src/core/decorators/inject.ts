import { DependencyContainer } from './dependency-container'

export function Inject(token: string) {
  return function (target: any, propertyKey: string) {
    DependencyContainer.registerInjection(target, propertyKey, token)
  }
}
