import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { Resource } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'

class OpenTelemetry {
  sdk: NodeSDK

  constructor(private readonly env: Record<string, any>) {
    this.sdk = new NodeSDK({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: this.env.OTEL_SERVICE_NAME,
        [SEMRESATTRS_SERVICE_VERSION]: this.env.OTEL_SERVICE_VERSION,
      }),
      traceExporter: new OTLPTraceExporter({
        url: this.env.OTEL_OTLP_TRACES_EXPORTER_URL,
      }),
      logRecordProcessor: new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: this.env.OTEL_OTLP_LOGS_EXPORTER_URL,
        }),
        {
          maxQueueSize: 100,
          maxExportBatchSize: 5,
          scheduledDelayMillis: 1000,
          exportTimeoutMillis: 30000,
        }
      ),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: this.env.OTEL_OTLP_METRICS_EXPORTER_URL,
        }),
      }),
    })
  }

  startSdk() {
    this.sdk.start()
  }
}

export { OpenTelemetry }
