import opentelemetry from '@opentelemetry/api'
import { Logger, logs, SeverityNumber } from '@opentelemetry/api-logs'
import { FastifyReply, FastifyRequest } from 'fastify'
import winston from 'winston'

import type { ILogger } from './logger'

class WinstonOtelFastify implements ILogger {
  logger: Logger
  consoleLogger: winston.Logger
  level: 'info' | 'error' | 'debug' | 'fatal' | 'warn' = 'info'

  constructor() {
    if (process.env.OTEL_ENABLE) {
      this.logger = logs.getLogger(
        process.env.OTEL_SERVICE_NAME!,
        process.env.OTEL_SERVICE_VERSION
      )

      this.level = process.env.LOG_LEVEL as any

      const transports =
        process.env.NODE_ENV === 'test'
          ? [new winston.transports.Console({ silent: true })]
          : [new winston.transports.Console()]

      this.consoleLogger = winston.createLogger({
        level: this.level,
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          winston.format((info) => {
            if (process.env.NODE_ENV !== 'test') {
              const span = opentelemetry.trace.getActiveSpan()

              if (span) {
                info.spanId = span.spanContext().spanId
                info.traceId = span.spanContext().traceId
              }
            }

            return info
          })(),
          winston.format.json()
        ),
        transports,
      })
    } else {
      this.consoleLogger = winston.createLogger({
        level: this.level,
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          winston.format.json()
        ),
      })
    }
  }

  private bodyIsFastifyRequest(
    body: string | FastifyRequest | FastifyReply
  ): body is FastifyRequest {
    return (body as FastifyRequest).method !== undefined
  }

  private bodyIsFastifyReply(
    body: string | FastifyRequest | FastifyReply
  ): body is FastifyReply {
    return (body as FastifyReply).statusCode !== undefined
  }

  private buildMessage(
    body: string | { req?: FastifyRequest; res?: FastifyReply }
  ) {
    if (
      typeof body === 'object' &&
      body.req &&
      this.bodyIsFastifyRequest(body.req)
    ) {
      return `${body.req.method} ${body.req.url}`
    } else if (
      typeof body === 'object' &&
      body.res &&
      this.bodyIsFastifyReply(body.res)
    ) {
      return `${body.res.request.method} ${body.res.request.url} ${body.res.statusCode} - ${body.res.elapsedTime} ms`
    } else if (typeof body === 'string') {
      return body
    } else {
      return ''
    }
  }

  private logMessage(
    body: string | { req?: FastifyRequest; res?: FastifyReply },
    severityNumber: SeverityNumber,
    severityText: string
  ) {
    const message = this.buildMessage(body)

    this.consoleLogger[severityText.toLowerCase() as keyof Logger](message)

    if (process.env.NODE_ENV !== 'test') {
      this.logger.emit({
        body: message,
        severityNumber,
        severityText,
      })
    }
  }

  info(body: string | { req?: FastifyRequest; res?: FastifyReply }) {
    this.logMessage(body, SeverityNumber.INFO, 'INFO')
  }

  error(body: string | { req?: FastifyRequest; res?: FastifyReply }) {
    this.logMessage(body, SeverityNumber.ERROR, 'ERROR')
  }

  debug(body: string | { req?: FastifyRequest; res?: FastifyReply }) {
    this.logMessage(body, SeverityNumber.DEBUG, 'DEBUG')
  }

  fatal(body: string | { req?: FastifyRequest; res?: FastifyReply }) {
    this.logMessage(body, SeverityNumber.FATAL, 'FATAL')
  }

  warn(body: string | { req?: FastifyRequest; res?: FastifyReply }) {
    this.logMessage(body, SeverityNumber.WARN, 'WARN')
  }

  trace(message: string) {
    if (process.env.NODE_ENV !== 'test') {
      this.logger.emit({
        body: message,
        severityNumber: SeverityNumber.TRACE,
        severityText: 'TRACE',
      })
    }
  }

  child(): WinstonOtelFastify {
    return new WinstonOtelFastify()
  }
}

export { WinstonOtelFastify }
