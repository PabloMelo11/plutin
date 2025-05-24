import { ObjectId } from 'bson'

export class UniqueObjectUniqueId {
  private value: ObjectId

  constructor(value?: string) {
    this.value = new ObjectId(value)
  }

  toString() {
    return this.value.toString()
  }

  toValue() {
    return this.value.toString()
  }

  public equals(id: UniqueObjectUniqueId) {
    return id.toValue() === this.toValue()
  }
}
