import 'reflect-metadata'

type Class<T = any> = new (...args: any[]) => T

type Registration =
  | { type: 'class'; myClass: Class; singleton: boolean }
  | { type: 'value'; value: any }

export class DependencyContainer {
  static registry = new Map<string, Registration>()
  static singletons = new Map<string, any>()

  static register<T>(
    token: string,
    myClass: Class<T>,
    options: { singleton: boolean }
  ) {
    this.registry.set(token, {
      type: 'class',
      myClass,
      singleton: options.singleton,
    })
  }

  static registerValue<T>(token: string, value: T) {
    this.registry.set(token, { type: 'value', value })
  }

  static resolve<T>(target: Class<T>): T {
    const injectMetadata: Record<number, string> =
      Reflect.getOwnMetadata('inject:params', target) || {}

    const paramCount = Object.keys(injectMetadata).length

    const params = Array.from({ length: paramCount }, (_, index) => {
      const token = injectMetadata[index]
      if (!token) {
        throw new Error(
          `Missing @Inject token for parameter index ${index} in ${target.name}`
        )
      }
      return this.resolveToken(token)
    })

    return new target(...params)
  }

  static resolveToken(token: string): any {
    const registration = this.registry.get(token)

    if (!registration) {
      throw new Error(
        `"${token}" not registered. Please register it in the container.`
      )
    }

    if (registration.type === 'value') {
      return registration.value
    }

    const { myClass, singleton } = registration

    if (singleton) {
      if (!this.singletons.has(token)) {
        const instance = this.resolve(myClass)
        this.singletons.set(token, instance)
      }
      return this.singletons.get(token)
    }

    return this.resolve(myClass)
  }
}

export function Inject(token: string): ParameterDecorator {
  return (
    target: object,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number
  ): void => {
    const constructor =
      typeof target === 'function' ? target : target.constructor

    const existingInjectedParams: Record<number, string> =
      Reflect.getOwnMetadata('inject:params', constructor) || {}

    existingInjectedParams[parameterIndex] = token

    Reflect.defineMetadata('inject:params', existingInjectedParams, constructor)
  }
}
