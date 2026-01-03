import { logs, SeverityNumber } from '@opentelemetry/api-logs'
import type { baseEnvSchema } from 'infra/env'
import type { z } from 'zod'

import type { ILogger, LogParams } from './logger'
import { PinoLogger } from './pino-logger'

export class OtelLogger implements ILogger {
  private otelLogger: ReturnType<typeof logs.getLogger>
  private pinoLogger: PinoLogger

  constructor(private readonly env: z.infer<typeof baseEnvSchema>) {
    this.otelLogger = logs.getLogger(
      this.env.OTEL_SERVICE_NAME || 'plutin-boilerplate-common',
      this.env.OTEL_SERVICE_VERSION || '1.0.0'
    )
    this.pinoLogger = new PinoLogger(this.env)
  }

  private emitOtelLog(
    severityNumber: SeverityNumber,
    severityText: string,
    params: LogParams
  ) {
    const { msg, data, error } = params

    const attributes: Record<string, any> = {}

    if (data) {
      attributes['data'] = { ...data }
    }

    if (error) {
      attributes['error'] = {
        errorType: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        errorCode: (error as any).code,
      }
    }

    this.otelLogger.emit({
      severityNumber,
      severityText,
      body: msg,
      timestamp: new Date(),
      attributes,
    })
  }

  info(params: LogParams): void {
    this.pinoLogger.info(params)
    this.emitOtelLog(SeverityNumber.INFO, 'INFO', params)
  }

  error(params: LogParams): void {
    this.pinoLogger.error(params)
    this.emitOtelLog(SeverityNumber.ERROR, 'ERROR', params)
  }

  debug(params: LogParams): void {
    this.pinoLogger.debug(params)
    this.emitOtelLog(SeverityNumber.DEBUG, 'DEBUG', params)
  }

  fatal(params: LogParams): void {
    this.pinoLogger.fatal(params)
    this.emitOtelLog(SeverityNumber.FATAL, 'FATAL', params)
  }

  warn(params: LogParams): void {
    this.pinoLogger.warn(params)
    this.emitOtelLog(SeverityNumber.WARN, 'WARN', params)
  }
}
