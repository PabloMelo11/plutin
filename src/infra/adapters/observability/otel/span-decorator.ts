import opentelemetry, { SpanStatusCode, Tracer } from '@opentelemetry/api'

import 'reflect-metadata'

export function Span(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (!process.env.OTEL_ENABLE) {
      return descriptor
    }

    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const tracer: Tracer = opentelemetry.trace.getTracer(
        process.env.OTEL_SERVICE_NAME!,
        process.env.OTEL_SERVICE_VERSION!
      )

      const className = target.constructor?.name || 'UnknownClass'
      const methodName = String(propertyKey)
      const spanName = `${className}.${methodName}`

      return tracer.startActiveSpan(spanName, async (span) => {
        try {
          const result = originalMethod.apply(this, args)

          if (result instanceof Promise) {
            try {
              const awaitedResult = await result
              span.addEvent(`Method ${methodName} executed successfully`)
              span.end()
              return awaitedResult
            } catch (error) {
              handleSpanError(span, error)
              throw error
            }
          } else {
            span.addEvent('Method executed successfully')
            span.end()
            return result
          }
        } catch (error) {
          handleSpanError(span, error)
          throw error
        }
      })
    }

    return descriptor
  }
}

function handleSpanError(span: any, error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error)

  if (error instanceof Error) {
    span.recordException(error)
  } else {
    span.recordException(new Error(String(error)))
  }

  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: errorMessage,
  })

  span.end()
}
