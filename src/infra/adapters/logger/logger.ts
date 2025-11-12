export interface ILogger {
  info(data: any): void
  error(data: any): void
  debug(data: any): void
  fatal(data: any): void
  warn(data: any): void
}
