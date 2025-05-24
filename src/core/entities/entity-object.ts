import type { CommonDTO } from './common-dto'
import ObjectUniqueId from './object-id'

type PropsWithCommonDTO<Props> = Props & CommonDTO

export abstract class EntityObject<Props> {
  private _id: ObjectUniqueId
  protected props: PropsWithCommonDTO<Props>

  get id() {
    return this._id
  }

  set id(id: ObjectUniqueId) {
    this._id = id
  }

  protected constructor(props: PropsWithCommonDTO<Props>, id?: ObjectUniqueId) {
    this._id = id ?? new ObjectUniqueId(id)
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
