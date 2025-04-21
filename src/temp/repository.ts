export default interface ITempRepository {
  get(): Promise<any>
}

export default class TempRepository {
  temp: any[] = [
    {
      name: 'Pablo',
      age: 25,
    },
  ]

  async get() {
    return this.temp
  }
}
