import type { CommonDTO } from '../core/entities/common-dto'
import { Entity } from '../core/entities/entity'
import { UniqueEntityId } from '../core/entities/unique-entity-id'
import type { Optional } from '../core/types/optional'

type Props = {
  id: UniqueEntityId
  name: string
} & CommonDTO

export class UserEntity extends Entity<Props> {
  static create(props: Optional<Props, 'id' | 'createdAt'>) {
    return new UserEntity({
      id: new UniqueEntityId(),
      name: props.name,
      createdAt: new Date(),
    })
  }

  static restore(props: Props) {
    return new UserEntity({
      id: props.id,
      name: props.name,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }
}
