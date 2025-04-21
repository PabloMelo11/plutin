import type { ContextError } from './base-controller'

export default interface IErrorNotifier {
  notify(error: Error, context: ContextError): Promise<void>
}
