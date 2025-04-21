import { ApiErrorEnum, type ApiCommonError } from "./api-common-error"

export default class HttpClientError extends Error {
  props: ApiCommonError
  
  constructor(message?: string) {
    super(message)
    this.props = {
      code: 400,
      errorCode: ApiErrorEnum.HTTP_CLIENT,
      message: message || 'Request error',
      occurredAt: new Date()
    }
  }
}
