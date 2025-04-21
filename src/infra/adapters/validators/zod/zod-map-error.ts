import type { ZodIssue } from 'zod'

import type {
  CommonError,
  PropertiesError,
} from '../../../../core/errors/api-common-error'

type ZodError = ZodIssue & {
  expected: string
  received: string
}

type ZodInvalidUnion = ZodError & {
  code: 'invalid_union'
}

export default class ZodMapError {
  private static mapCommon(error: ZodError): PropertiesError {
    return {
      type: error.code,
      path: error.path.join('.'),
      property: error.path.pop(),
      propertyType: error.expected,
      receivedValue: error.received,
      message: error.message,
    }
  }

  private static mapInvalidUnion(error: ZodInvalidUnion): PropertiesError[] {
    const [errors] = error.unionErrors
      .flat()
      .map((err) => err.issues.map((item: any) => this.mapCommon(item)))

    return errors
  }

  private static mapInvalidType(error: ZodError): PropertiesError[] {
    return [this.mapCommon(error)]
  }

  private static mapErrorsFactory(error: ZodError): PropertiesError[] {
    if (error.code === 'invalid_union') {
      return this.mapInvalidUnion(error)
    }

    return this.mapInvalidType(error)
  }

  static mapErrors(errors: ZodIssue[][]) {
    const standardizedErrors = new Map<string | number, CommonError>()

    errors.flat().forEach((error) => {
      const keyError = standardizedErrors.get(error.path[0])

      if (keyError) {
        if (!keyError.propertyErrors) {
          keyError.propertyErrors = []
        }

        keyError.propertyErrors.push(
          ...this.mapErrorsFactory(error as ZodError)
        )

        return
      }

      standardizedErrors.set(error.path[0], {
        location: error.path[0],
        propertyErrors: Array.from([
          ...this.mapErrorsFactory(error as ZodError),
        ]),
      } as CommonError)
    })

    return Array.from(standardizedErrors, ([, arr]) => ({
      ...arr,
    })).flat()
  }
}
