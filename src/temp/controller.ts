import { z } from 'zod'

import { Inject } from '../core/decorators/dependency-container'
import { Controller } from '../core/decorators/controller-http-decorator'
import BaseController, { type Response } from '../core/http/controller'
import { zodValidator } from '../infra/adapters/validators/zod'

export const tempSchema = z.object({
  params: z.object({
    roleId: z.string().uuid(),
  }),
  headers: z.object({
    tenantId: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1),
    age: z.number().min(1),
    skills: z.array(z.object({
      name: z.string().min(1),
      level: z.enum(['beginner', 'intermediate', 'advanced']),
    })),
  }),
  query: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
  }),
});

@Controller({
  method: 'get',
  path: '/temp',
  middlewares: [zodValidator(tempSchema)],
})
export class TempController extends BaseController {
  constructor(
    @Inject('CreateTempUseCase') private createTempUseCase: any
  ) {
    super()
  }

  async handle(request: any): Promise<Response> {
    const response = await this.createTempUseCase.execute(request)

    return this.success(response)
  }
}
