import 'reflect-metadata'

import type Controller from '../../../core/http/controller'
import type { MethodType } from '../../../core/http/http'

export function validateControllerMetadata(controller: Controller) {
  const metadata = Reflect.getMetadata('route', controller.constructor) as {
    method: MethodType
    path: string
  }

  if (!metadata) {
    throw new Error(
      `Controller ${controller.constructor.name} not have metadata. Need to add decorator.`
    )
  }

  return {
    metadata,
  }
}
