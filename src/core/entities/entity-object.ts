import type { CommonDTO } from './common-dto'
import { UniqueObjectUniqueId } from './unique-object-id'

type PropsWithCommonDTO<Props> = Props & CommonDTO

export abstract class EntityObject<Props> {
  private _id: UniqueObjectUniqueId
  protected props: PropsWithCommonDTO<Props>

  get id() {
    return this._id
  }

  set id(id: UniqueObjectUniqueId) {
    this._id = id
  }

  get createdAt() {
    return this.props.createdAt
  }

  set createdAt(date: Date) {
    this.props.createdAt = date
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  protected constructor(
    props: PropsWithCommonDTO<Props>,
    id?: UniqueObjectUniqueId
  ) {
    this._id = id ?? new UniqueObjectUniqueId(id)
    this.props = props
  }

  public equals(entity: EntityObject<Props>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
