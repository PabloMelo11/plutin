import ApplicationError from '../core/errors/application-error'
import { Inject } from '../core/decorators/dependency-container'
import type ITempRepository from './repository'

export type Input = {
  name: string
  age: number
  skills: Array<{
    name: string
    level: 'beginner' | 'intermediate' | 'advanced'
  }>
}

export type Output = {
  id: string
  name: string
  age: number
  skills: Array<{
    name: string
    level: 'beginner' | 'intermediate' | 'advanced'
  }>
  createdAt: Date
}

export class TempUseCase {
  constructor(
    @Inject('TempRepository') private tempRepository: ITempRepository
  ) {}

  async execute(data: Input): Promise<Output> {
    console.log(data)
    const response = await this.tempRepository.get()
    throw new ApplicationError('My Error')
    return response
  }
}
