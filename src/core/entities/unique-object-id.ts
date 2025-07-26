import { ObjectId } from 'bson'

export class UniqueObjectId {
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

  public equals(id: UniqueObjectId) {
    return id.toValue() === this.toValue()
  }
}
