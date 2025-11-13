import { W3CTraceContextPropagator } from '@opentelemetry/core'
import { CompositePropagator } from '@opentelemetry/core'
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
    // Configuração do Resource com atributos semânticos
    const resource = new Resource({
      [SEMRESATTRS_SERVICE_NAME]: this.env.OTEL_SERVICE_NAME,
      [SEMRESATTRS_SERVICE_VERSION]: this.env.OTEL_SERVICE_VERSION || '1.0.0',
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]:
        this.env.ENVIRONMENT || 'development',
    })

    // Trace Exporter
    const traceExporter = new OTLPTraceExporter({
      url: this.env.OTEL_OTLP_TRACES_EXPORTER_URL,
      headers: {},
    })

    // Log Exporter
    const logExporter = new OTLPLogExporter({
      url: this.env.OTEL_OTLP_LOGS_EXPORTER_URL,
      headers: {},
    })

    // Metric Exporter
    const metricExporter = new OTLPMetricExporter({
      url: this.env.OTEL_OTLP_METRICS_EXPORTER_URL,
      headers: {},
    })

    this.sdk = new NodeSDK({
      resource,
      traceExporter,
      textMapPropagator: new CompositePropagator({
        propagators: [new W3CTraceContextPropagator()],
      }),
      spanProcessor: new BatchSpanProcessor(traceExporter, {
        maxQueueSize: 2048,
        maxExportBatchSize: 512,
        scheduledDelayMillis: 5000,
        exportTimeoutMillis: 30000,
      }),
      logRecordProcessor: new BatchLogRecordProcessor(logExporter, {
        maxQueueSize: 2048,
        maxExportBatchSize: 512,
        scheduledDelayMillis: 1000,
        exportTimeoutMillis: 30000,
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 30000,
        exportTimeoutMillis: 30000,
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
