import { Inject } from '../core/decorators/dependency-container'
import { Http } from '../core/decorators/http-decorator'
import Controller, { type Response } from '../core/http/controller'

@Http('get', '/temp')
export class TempController extends Controller {
  constructor(
    @Inject('CreateTempUseCase')
    private createTempUseCase: any
  ) {
    super()
  }

  async handle(): Promise<Response> {
    const response = await this.createTempUseCase.execute()

    return this.success(response)
  }
}
