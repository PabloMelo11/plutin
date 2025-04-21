export type RequestHttp = {
  body: Record<string, any>
  params: Record<string, any>
  headers: Record<string, any>
  query: Record<string, any>
}

export default interface IValidationHTTP {
  validate<T>(requestHttp: RequestHttp): Promise<T>
}
