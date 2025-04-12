import type BaseController from './controller'

export type MethodType = 'get' | 'post' | 'delete' | 'put' | 'patch'

export default interface IHttp {
  registerRoute(controller: BaseController): void
  startServer(port: number): Promise<void>
  closeServer(): Promise<void>
}
