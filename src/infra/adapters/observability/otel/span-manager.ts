import { Span, trace } from '@opentelemetry/api'

class NullSpan {
  setAttributes(): void {
    return
  }

  setAttribute(): void {
    return
  }

  setStatus(): void {
    return
  }

  recordException(): void {
    return
  }
}

class SpanManager {
  static getActiveSpan(): Span | NullSpan {
    if (process.env.OTEL_ENABLE === 'false' || !process.env.OTEL_ENABLE) {
      return new NullSpan()
    }

    const span = trace.getActiveSpan()
    return span || new NullSpan()
  }
}

export { NullSpan, SpanManager }
