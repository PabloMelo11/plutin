import { z } from 'zod'

import { Request } from '../../../../core/http/controller'
import ZodValidator from './index'

export type ZodSchema = z.ZodObject<{
  headers: z.ZodObject<Record<string, any>>
  params: z.ZodObject<Record<string, any>>
  query: z.ZodObject<Record<string, any>>
  body:
    | z.ZodObject<Record<string, any>>
    | z.ZodEffects<z.ZodObject<Record<string, any>>>
}>

export type MiddlewareFunction = (request: Request) => Promise<Request>

export function zodValidator(schema: ZodSchema): MiddlewareFunction {
  return async (request: Request): Promise<Request> => {
    const validator = new ZodValidator(schema)
    const validatedRequest = await validator.validate<Request>(request)
    return validatedRequest
  }
}
