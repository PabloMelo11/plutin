import { CommonDTO } from './common-dto'
import { Entity } from './entity'

export abstract class AggregateRoot<
  Props extends CommonDTO,
> extends Entity<Props> {}
