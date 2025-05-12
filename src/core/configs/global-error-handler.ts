import { DependencyContainer } from '../../core/decorators/dependency-container'
import type { IErrorNotifier } from '../../core/http/error-notifier'

export class GlobalErrorHandler {
  protected readonly errorNotifier: IErrorNotifier

  constructor(readonly env: Record<string, any>) {
    this.errorNotifier = DependencyContainer.resolveToken('IErrorNotifier')
  }

  register() {
    process.on('uncaughtException', (err) => {
      this.errorNotifier.notify(err, { env: this.env.ENVIRONMENT })
      process.exit(1)
    })

    process.on('unhandledRejection', (reason) => {
      if (reason instanceof Error) {
        this.errorNotifier.notify(reason, { env: this.env.ENVIRONMENT })
      } else {
        this.errorNotifier.notify(new Error(String(reason)), {
          env: this.env.ENVIRONMENT,
        })
      }

      process.exit(1)
    })
  }
}
