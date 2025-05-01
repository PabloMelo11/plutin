import type { ContextError } from '../../../core/http/base-controller'
import type { IErrorNotifier } from '../../../core/http/error-notifier'
import { logger } from '../../logger'

export class NotificationErrorInMemory implements IErrorNotifier {
  public errors: any[] = []

  async notify(error: Error, context?: ContextError): Promise<void> {
    logger.error(error)

    this.errors.push({
      error: error.message,
      context,
    })
  }
}
