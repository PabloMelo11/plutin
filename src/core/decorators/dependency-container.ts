import 'reflect-metadata'

type Class<T = any> = new (...args: any[]) => T

type Registration =
  | { type: 'class'; myClass: Class; singleton: boolean }
  | { type: 'instance'; instance: any; singleton: boolean }
  | { type: 'value'; value: any }

export class DependencyContainer {
  static registry = new Map<string, Registration>()
  static singletons = new Map<string, any>()

  private static isClass<T>(value: Class<T> | T): value is Class<T> {
    return (
      typeof value === 'function' &&
      value.prototype !== undefined &&
      value.prototype.constructor === value
    )
  }

  /**
   * Registra uma classe ou instância no container
   * @param token - Identificador único do registro
   * @param classOrInstance - Classe (será instanciada) ou instância já criada
   * @param options - Opções de registro
   * @note Para instâncias: sempre retorna a mesma referência, mas apenas armazena
   * no cache de singletons se `singleton: true` (para consistência)
   */
  static register<T>(
    token: string,
    classOrInstance: Class<T> | T,
    options: { singleton: boolean } = { singleton: true }
  ) {
    if (this.isClass(classOrInstance)) {
      this.registry.set(token, {
        type: 'class',
        myClass: classOrInstance,
        singleton: options.singleton,
      })
    } else {
      this.registry.set(token, {
        type: 'instance',
        instance: classOrInstance,
        singleton: options.singleton,
      })
      if (options.singleton) {
        this.singletons.set(token, classOrInstance)
      }
    }
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

    if (registration.type === 'instance') {
      // Para instâncias, sempre retorna a mesma referência
      // Se for singleton, busca do cache; caso contrário, retorna diretamente
      if (registration.singleton) {
        return this.singletons.get(token)
      }
      return registration.instance
    }

    // registration.type === 'class'
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
