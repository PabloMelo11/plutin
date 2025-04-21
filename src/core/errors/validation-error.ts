import { ApiErrorEnum, type ApiCommonError, type CommonError, type PropertiesError } from './api-common-error';

export default class ValidationError extends Error {
  props: ApiCommonError
  
  constructor(errors: CommonError[]) {
    super('Validation Error')
    this.props = {
      code: 400,
      errorCode: ApiErrorEnum.VALIDATOR,
      message: 'Validation Error',
      occurredAt: new Date(),
      errors
    }
  }
}
