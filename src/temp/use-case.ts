import { Inject } from '../core/decorators/dependency-container'
import type ITempRepository from './repository'

export class TempUseCase {
  constructor(
    @Inject('TempRepository') private tempRepository: ITempRepository
  ) {}

  async execute() {
    const data = await this.tempRepository.get()
    return data
  }
}
