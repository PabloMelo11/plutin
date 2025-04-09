type Constructor<T = any> = new (...args: any[]) => T

type DependencyOptions = {
  singleton?: boolean
}

type Registration<T = any> =
  | {
      type: 'class'
      useClass: Constructor<T>
      singleton: boolean
    }
  | {
      type: 'instance'
      value: T
    }

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const injectMetadata = new Map<Function, Map<string, string>>()

export class DependencyContainer {
  private static registry = new Map<string, Registration>()
  private static singletons = new Map<string, any>()

  public static register<T>(
    token: string,
    useClass: Constructor<T>,
    options: DependencyOptions = {}
  ) {
    this.registry.set(token, {
      type: 'class',
      useClass,
      singleton: options.singleton ?? false,
    })
  }

  public static registerInstance<T>(token: string, instance: T) {
    this.registry.set(token, {
      type: 'instance',
      value: instance,
    })
  }

  public static replace<T>(
    token: string,
    replacement: Constructor<T> | T,
    options: DependencyOptions = {}
  ) {
    if (typeof replacement === 'function') {
      this.register(token, replacement as Constructor<T>, options)
    } else {
      this.registerInstance(token, replacement)
    }
  }

  public static resolve<T>(token: string): T {
    const registration = this.registry.get(token)
    if (!registration) throw new Error(`Dependency not found: ${token}`)

    if (registration.type === 'instance') return registration.value

    if (registration.singleton && this.singletons.has(token)) {
      return this.singletons.get(token)
    }

    const instance = new registration.useClass()

    const targetInjects = injectMetadata.get(registration.useClass)
    if (targetInjects) {
      for (const [propertyKey, injectToken] of targetInjects.entries()) {
        const dep = this.resolve(injectToken)
        ;(instance as any)[propertyKey] = dep
      }
    }

    if (registration.singleton) {
      this.singletons.set(token, instance)
    }

    return instance
  }

  static registerInjection(target: any, propertyKey: string, token: string) {
    const ctor = target.constructor
    if (!injectMetadata.has(ctor)) {
      injectMetadata.set(ctor, new Map())
    }
    injectMetadata.get(ctor)!.set(propertyKey, token)
  }
}
