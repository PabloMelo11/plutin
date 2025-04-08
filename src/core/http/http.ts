export type MethodType = 'get' | 'post' | 'delete' | 'put' | 'patch'

export default interface IHttp {
  on(method: MethodType, url: string, callback: any): void
  listen(port: number): Promise<void>
  close(): Promise<void>
}
