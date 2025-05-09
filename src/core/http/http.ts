import type { BaseController } from './base-controller'

export type MethodType = 'get' | 'post' | 'delete' | 'put' | 'patch'

export interface IHttp {
  registerRoute(controller: BaseController): void
  startServer(port: number): Promise<void>
  closeServer(): Promise<void>
}
