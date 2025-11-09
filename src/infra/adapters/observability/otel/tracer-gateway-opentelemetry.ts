import opentelemetry from '@opentelemetry/api'

import type { ITracerGateway } from '../tracer-gateway'

export class TracerGatewayOpentelemetry implements ITracerGateway {
  addEvent(name: string, attributes?: Record<string, any>): void {
    if (!process.env.OTEL_ENABLE) {
      return
    }

    const span = opentelemetry.trace.getActiveSpan()

    if (span && attributes) {
      span.addEvent(name, attributes)
    } else if (span) {
      span.addEvent(name)
    }
  }

  setAttribute(key: string, value: string | number | boolean): void {
    if (!process.env.OTEL_ENABLE) {
      return
    }

    const span = opentelemetry.trace.getActiveSpan()

    if (span) {
      span.setAttribute(key, value)
    }
  }
}
