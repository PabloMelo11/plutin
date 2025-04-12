import { Inject } from '../core/decorators/dependency-container'
import { Controller } from '../core/decorators/controller-http-decorator'
import BaseController, { type Response } from '../core/http/controller'

@Controller({
  method: 'get',
  path: '/temp',
})
export class TempController extends BaseController {
  constructor(
    @Inject('CreateTempUseCase') private createTempUseCase: any
  ) {
    super()
  }

  async handle(): Promise<Response> {
    const response = await this.createTempUseCase.execute()

    return this.success(response)
  }
}
