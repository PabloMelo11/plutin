import { CommonDTO } from './common-dto'
import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<Props extends CommonDTO> {
  private _id: UniqueEntityId
  protected props: Props

  get id() {
    return this._id
  }

  set id(id: UniqueEntityId) {
    this._id = id
  }

  get createdAt() {
    return this.props.createdAt
  }

  set createdAt(date: Date) {
    this.props.createdAt = date
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId(id)
    this.props = props
  }

  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
