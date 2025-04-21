import { Inject } from '../core/decorators/dependency-container'
import type ITempRepository from './repository'

export type Input = {
  name: string;
  age: number;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  }>;
}
  
export type Output = {
  id: string;
  name: string;
  age: number;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  }>;
  createdAt: Date;
};

export class TempUseCase {
  constructor(
    @Inject('TempRepository') private tempRepository: ITempRepository
  ) {}

  async execute(data: Input): Promise<Output> {
    const response = await this.tempRepository.get()
    return response
  }
}
