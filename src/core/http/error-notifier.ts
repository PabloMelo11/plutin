import type { ContextError } from './base-controller'

export interface IErrorNotifier {
  notify(error: Error, context: ContextError): Promise<void>
}
