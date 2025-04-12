import ApplicationError from '../../core/errors/application-error'
import ConflictError from '../../core/errors/conflict-error'
import DomainError from '../../core/errors/domain-error'
import InfraError from '../../core/errors/infra-error'
import ValidationError from '../../core/errors/validation-error'

export type AnyObject = Record<string, any>

export type Request = {
  body: AnyObject
  params: AnyObject
  headers: AnyObject
  query: AnyObject
}

export type Response = {
  code: number
  data: any
}

export default abstract class BaseController {
  abstract handle(request: Request): Promise<Response>

  protected success<T>(dto?: T): Response {
    return {
      code: 200,
      data: { data: dto },
    }
  }

  protected noContent(): Response {
    return {
      code: 204,
      data: undefined,
    }
  }

  protected created<T>(dto?: T): Response {
    return {
      code: 201,
      data: dto ? { data: dto } : undefined,
    }
  }

  protected paginated<T>(dto?: T): Response {
    return {
      code: 200,
      data: dto,
    }
  }

  public failure(error: Error): Response {
    if (error instanceof ConflictError) {
      return {
        code: error.code,
        data: {
          code: error.code,
          message: error.message,
          items: Array.isArray(error.props) ? error.props : [error.props],
        },
      }
    }

    if (
      error instanceof DomainError ||
      error instanceof ApplicationError ||
      error instanceof InfraError
    ) {
      return {
        code: error.code,
        data: { code: error.code, message: error.message },
      }
    }

    if (error instanceof ValidationError) {
      return {
        code: error.code,
        data: {
          code: error.code,
          message: error.message,
          errors: error.errors,
        },
      }
    }

    console.error(error)

    return {
      code: 500,
      data: {
        code: 500,
        message: 'Server failed. Contact the administrator!',
        reason: error,
      },
    }
  }
}
