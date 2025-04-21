import { ApiErrorEnum, type ApiCommonError } from "./api-common-error";

type ConflictProps = { id: string; [key: string]: unknown }

export default class ConflictError<T extends ConflictProps> extends Error {
  props: ApiCommonError
  conflictProps: T | T[]
  
  constructor(conflictProps: T | T[]) {
    super('Resource already exists.')
    this.conflictProps = conflictProps,
    this.props = {
      code: 409,
      errorCode: ApiErrorEnum.APPLICATION,
      message: this.message,
      occurredAt: new Date(),
    }
  }
}
