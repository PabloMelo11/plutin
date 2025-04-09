import 'reflect-metadata'

type Token = string

export class DependencyContainer {
  static registry = new Map<Token, { myClass: any; singleton: boolean }>()
  static singletons = new Map<Token, any>()

  static register<T>(
    token: Token,
    myClass: new (...args: any[]) => T,
    options: { singleton: boolean }
  ) {
    this.registry.set(token, { myClass, singleton: options.singleton })
  }

  static resolve<T>(target: new (...args: any[]) => T): T {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || []
    const injectMetadata: Record<number, Token> =
      Reflect.getOwnMetadata('inject:params', target) || {}

    const params = paramTypes.map((_: any, index: number) => {
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

  private static resolveToken(token: Token): any {
    const registration = this.registry.get(token)
    if (!registration) throw new Error(`Token "${token}" not registered`)

    if (registration.singleton) {
      if (!this.singletons.has(token)) {
        const instance = this.resolve(registration.myClass)
        this.singletons.set(token, instance)
      }
      return this.singletons.get(token)
    }

    return this.resolve(registration.myClass)
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
