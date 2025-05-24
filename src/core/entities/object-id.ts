import { ObjectId } from 'bson'

export default class ObjectUniqueId {
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

  public equals(id: ObjectUniqueId) {
    return id.toValue() === this.toValue()
  }
}
