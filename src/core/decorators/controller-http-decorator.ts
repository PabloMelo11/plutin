import BaseController from '../http/controller'
import type { MethodType } from '../http/http'
import { MiddlewareFunction } from '../../infra/adapters/validators/zod/zod-validator'

type Props = {
  method: MethodType,
  path: string,
  middlewares?: MiddlewareFunction[]
}

export function Controller({ method, path, middlewares = [] }: Props): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof BaseController)) {
      throw new Error(
        `The class ${target.name} should extends abstract class BaseController`
      )
    }

    Reflect.defineMetadata('route', { method, path, middlewares }, target)
  }
}
