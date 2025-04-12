import BaseController from '../http/controller'
import type { MethodType } from '../http/http'

type Props = {
  method: MethodType,
  path: string
}

export function Controller({ method, path }: Props): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof BaseController)) {
      throw new Error(
        `The class ${target.name} should extends abstract class BaseController`
      )
    }

    Reflect.defineMetadata('route', { method, path }, target)
  }
}
