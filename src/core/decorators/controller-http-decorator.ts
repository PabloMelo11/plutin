import { MiddlewareFunction } from '../../infra/adapters/validators/zod/zod-validator'
import BaseController from '../http/base-controller'
import type { MethodType } from '../http/http'

type Props = {
  method: MethodType
  path: string
  middlewares?: MiddlewareFunction[]
}

export function Controller({
  method,
  path,
  middlewares = [],
}: Props): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof BaseController)) {
      throw new Error(
        `The class ${target.name} should extends abstract class BaseController`
      )
    }

    Reflect.defineMetadata(
      'route',
      { method, path: `/api/${path}`, middlewares },
      target
    )
  }
}
