export default interface ITempRepository {
  get(): Promise<any>
}

export class TempRepository {
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
