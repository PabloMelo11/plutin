import BaseController from '../http/controller'
import type { MethodType } from '../http/http'

export function Controller(method: MethodType, url: string): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof BaseController)) {
      throw new Error(
        `The class ${target.name} should extends abstract class Controller`
      )
    }

    Reflect.defineMetadata('route', { method, url }, target)
  }
}
