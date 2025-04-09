import 'reflect-metadata'

import Controller from 'core/http/controller'
import type { MethodType } from 'core/http/http'

export function ControllerHTTP(
  method: MethodType,
  path: string
): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof Controller)) {
      throw new Error(
        `The class ${target.name} should extends abstract class Controller`
      )
    }

    Reflect.defineMetadata('route', { method, path }, target)
  }
}
