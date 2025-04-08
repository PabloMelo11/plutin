export default class InfraError extends Error {
  code: number

  constructor(message: string, code = 400) {
    super(message)
    this.code = code
  }
}
