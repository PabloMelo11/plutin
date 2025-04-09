import type Controller from 'core/http/controller'
import type { MethodType } from 'core/http/http'

export function validateControllerMetadata(
  controllerClass: new () => Controller
) {
  const controller = new controllerClass()

  const metadata = Reflect.getMetadata('route', controllerClass) as {
    method: MethodType
    url: string
  }

  if (!metadata) {
    throw new Error(`Controller ${controllerClass.name} not have metadata`)
  }

  return {
    controller,
    metadata,
  }
}
