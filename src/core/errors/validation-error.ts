type Errors = {
  property: string
  message: string
}

export default class ValidationError extends Error {
  code: number

  errors: Errors[]

  constructor(errors: Errors[]) {
    super('Validation Error')
    this.code = 400
    this.name = 'Validation Error'
    this.errors = errors
  }
}
