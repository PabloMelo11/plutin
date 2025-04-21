import { ApiErrorEnum, type ApiCommonError } from "./api-common-error"

export default class ApplicationError extends Error {
  props: ApiCommonError
  
  constructor(message: string) {
    super(message)
    this.props = {
      code: 400,
      errorCode: ApiErrorEnum.APPLICATION,
      message,
      occurredAt: new Date()
    }
  }
}
