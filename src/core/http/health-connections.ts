export interface IHealthCheckDB {
  check(): Promise<boolean>
}
