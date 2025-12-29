import type { ILogger } from 'infra/adapters/logger/logger'

import { DependencyContainer } from '../../core/decorators/dependency-container'

export class GlobalListener {
  protected readonly logger: ILogger

  constructor(private readonly callback: () => Promise<void>) {
    this.logger = DependencyContainer.resolveToken('Logger')
  }

  register() {
    process.on('uncaughtException', (err) => {
      this.logger.fatal({
        msg: 'Uncaught exception',
        data: {
          env: process.env.ENVIRONMENT,
        },
        error: new Error(err.message),
      })

      process.exit(1)
    })

    process.on('unhandledRejection', (reason) => {
      if (reason instanceof Error) {
        this.logger.fatal({
          msg: 'Unhandled rejection',
          data: {
            env: process.env.ENVIRONMENT,
          },
          error: reason,
        })
      } else {
        this.logger.fatal({
          msg: 'Unhandled rejection',
          data: {
            env: process.env.ENVIRONMENT,
          },
          error: new Error(String(reason)),
        })
      }

      process.exit(1)
    })

    process.on('SIGTERM', async () => {
      await this.callback()
      process.exit(0)
    })

    process.on('SIGINT', async () => {
      await this.callback()
      process.exit(0)
    })
  }
}
