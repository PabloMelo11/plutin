import * as Sentry from '@sentry/node'
import type { ContextError } from 'core/http/controller'

import { Inject } from '../../../core/decorators/dependency-container'
import IErrorNotifier from '../../../core/http/error-notifier'

type SentryOptions = {
  dsn: string
  environment: string
}

export class SentryNotifier implements IErrorNotifier {
  constructor(@Inject('SentryConfig') private readonly options: SentryOptions) {
    Sentry.init({
      dsn: this.options.dsn,
      environment: this.options.environment,
      attachStacktrace: true,
      tracesSampleRate: this.options.environment === 'production' ? 0.1 : 1.0,
      maxBreadcrumbs: 100,
      debug: this.options.environment !== 'production',
    })
  }

  async notify(error: Error, context: ContextError): Promise<void> {
    Sentry.withScope((scope) => {
      scope.setLevel('error')

      if (context?.env) scope.setTag('env', context.env)

      if (context?.user) {
        scope.setUser({
          id: context.user.id,
          username: context.user.name,
          email: context.user.email,
        })
      }

      if (context?.request) {
        const { body, query, params, headers, method, url, requestId } =
          context.request

        scope.setContext('http', {
          method,
          requestId,
          url,
          headers,
          query,
          body,
          params,
        })
      }

      Sentry.captureException(error)
    })
  }
}
