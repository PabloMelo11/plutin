type HealthCheckOutput = {
  dbIsOnline: boolean
}

export interface IHealthCheck {
  check(): Promise<HealthCheckOutput>
}

export default class Health implements IHealthCheck {
  constructor(private checkDB: ICheckDB) {}

  async check(): Promise<HealthCheckOutput> {
    const dbIsOnline = await this.checkDB.dbIsOnline()

    return { dbIsOnline }
  }
}

export interface ICheckDB {
  dbIsOnline(): Promise<boolean>
}
