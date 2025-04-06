type ConflictProps = { id: string; [key: string]: unknown }

export default class ConflictError<T extends ConflictProps> extends Error {
  code: number
  props: T | T[]

  constructor(props: T | T[]) {
    super('Resource already exists.')
    this.code = 409
    this.props = props
  }
}
