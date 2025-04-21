import { ApiErrorEnum, type ApiCommonError } from "./api-common-error"

export default class InfraError extends Error {
  props: ApiCommonError
  
  constructor(message: string) {
    super(message)
    this.props = {
      code: 400,
      errorCode: ApiErrorEnum.INFRA,
      message,
      occurredAt: new Date()
    }
  }
}
