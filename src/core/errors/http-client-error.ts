type HTTPOutput = {
  code?: number
  headers?: Record<string, string>
  body?: any
}

export default class HttpError extends Error {
  code: number
  response: HTTPOutput

  constructor(response: HTTPOutput) {
    super(response?.body?.message || 'Request error')
    this.code = response?.code || 400
    this.response = response
  }
}
