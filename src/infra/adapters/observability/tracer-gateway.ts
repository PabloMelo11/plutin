export interface ITracerGateway {
  addEvent(name: string, attributes?: Record<string, any>): void
  setAttribute(key: string, value: string | number | boolean): void
}
