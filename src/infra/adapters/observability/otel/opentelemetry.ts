import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { Resource } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import {
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'

class OpenTelemetry {
  sdk: NodeSDK

  constructor(private readonly env: Record<string, any>) {
    const resource = new Resource({
      [SEMRESATTRS_SERVICE_NAME]: this.env.OTEL_SERVICE_NAME,
      [SEMRESATTRS_SERVICE_VERSION]: this.env.OTEL_SERVICE_VERSION || '1.0.0',
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]:
        this.env.ENVIRONMENT || 'production',
    })

    const traceExporter = new OTLPTraceExporter({
      url: this.env.OTEL_OTLP_TRACES_EXPORTER_URL,
      headers: {},
    })

    const logExporter = new OTLPLogExporter({
      url: this.env.OTEL_OTLP_LOGS_EXPORTER_URL,
      headers: {},
    })

    const metricExporter = new OTLPMetricExporter({
      url: this.env.OTEL_OTLP_METRICS_EXPORTER_URL,
      headers: {},
    })

    this.sdk = new NodeSDK({
      resource,
      traceExporter,
      spanProcessor: new BatchSpanProcessor(traceExporter),
      logRecordProcessor: new BatchLogRecordProcessor(logExporter),
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
      }),
    })
  }

  startSdk() {
    try {
      this.sdk.start()
      console.log('OpenTelemetry SDK started successfully')
    } catch (error) {
      console.error('Error starting OpenTelemetry SDK:', error)
      throw error
    }
  }

  async shutdown() {
    try {
      await this.sdk.shutdown()
      console.log('OpenTelemetry SDK shut down successfully')
    } catch (error) {
      console.error('Error shutting down OpenTelemetry SDK:', error)
      throw error
    }
  }
}

export { OpenTelemetry }
