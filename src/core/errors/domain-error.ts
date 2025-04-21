import { type ApiCommonError, ApiErrorEnum } from './api-common-error'

export default class DomainError extends Error {
  props: ApiCommonError

  constructor(message: string) {
    super(message)
    this.props = {
      code: 400,
      errorCode: ApiErrorEnum.DOMAIN,
      message,
      occurredAt: new Date(),
    }
  }
}
