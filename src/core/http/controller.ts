import 'reflect-metadata'

import ApplicationError from '../../core/errors/application-error'
import ConflictError from '../../core/errors/conflict-error'
import DomainError from '../../core/errors/domain-error'
import InfraError from '../../core/errors/infra-error'
import ValidationError from '../../core/errors/validation-error'
import { MiddlewareFunction } from '../../infra/adapters/validators/zod/zod-validator'
import DependencyContainer from '../../core/decorators/dependency-container'
import IErrorNotifier from './error-notifier'
import { env } from '../../infra/env'

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

export type ContextError = {
  env: string
  user?: {
    id?: string,
    name?: string,
    email?: string
  }
  request?: {
    method?: string
    requestId?: string
    url?: string
    headers?: any
    query?: any
    body?: any
    params?: any
  }
}

export default abstract class BaseController {
  protected readonly errorNotifier: IErrorNotifier;

  abstract handle<T>(request: T | Request): Promise<Response>

  constructor() {
    this.errorNotifier = DependencyContainer.resolveToken('IErrorNotifier');
  }

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

  public async failure(error: Error, context?: ContextError): Promise<Response> {
    if (error instanceof ConflictError) {
      return {
        code: error.props.code,
        data: {
          message: error.message,
          items: Array.isArray(error.conflictProps) ? error.conflictProps : [error.conflictProps],
        },
      }
    }

    if (
      error instanceof DomainError ||
      error instanceof ApplicationError ||
      error instanceof InfraError
    ) {
      return {
        code: error.props.code,
        data: {
          message: error.message,
          errorCode: error.props.errorCode,
          occurredAt: error.props.occurredAt
        },
      }
    }

    if (error instanceof ValidationError) {
      return {
        code: error.props.code,
        data: {
          message: error.props.message,
          errorCode: error.props.errorCode,
          occurredAt: error.props.occurredAt,
          errors: error.props.errors,
        },
      }
    }

    if (env.SHOULD_NOTIFY_ERROR) {
      await this.errorNotifier.notify(error, context);
    }

    return {
      code: 500,
      data: {
        code: 500,
        message: 'Server failed. Contact the administrator!',
      },
    }
  }

  public async execute(request: Request): Promise<Response> {
    try {
      const routeMetadata = Reflect.getMetadata('route', this.constructor);
      const middlewares: MiddlewareFunction[] = routeMetadata?.middlewares || [];
      
      let processedRequest = request;

      for (const middleware of middlewares) {
        processedRequest = await middleware(processedRequest);
      }
      
      return await this.handle(processedRequest);
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
