import ApplicationError from '../core/errors/application-error'
import { Inject } from '../core/decorators/dependency-container'
import type ITempRepository from './repository'
import ConflictError from '../core/errors/conflict-error'

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

export default class TempUseCase {
  constructor(
    @Inject('TempRepository') private tempRepository: ITempRepository
  ) {}

  async execute(data: Input): Promise<Output> {
    console.log(data)
    await this.tempRepository.get()
    throw new ConflictError({ id: '1' })
  }
}
