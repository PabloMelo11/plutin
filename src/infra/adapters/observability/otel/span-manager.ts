import { Span, trace } from '@opentelemetry/api'
import type { baseEnvSchema } from 'infra/env'
import type { z } from 'zod'

export interface ISpanManager {
  getActiveSpan(): Span | NullSpan
}

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

class SpanManager implements ISpanManager {
  constructor(private readonly env: z.infer<typeof baseEnvSchema>) {}

  getActiveSpan(): Span | NullSpan {
    if (!this.env.OTEL_ENABLE) {
      return new NullSpan()
    }

    const span = trace.getActiveSpan()
    return span || new NullSpan()
  }
}

export { NullSpan, SpanManager }
