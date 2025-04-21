import type { ContextError } from './controller'

export default interface IErrorNotifier {
  notify(error: Error, context: ContextError): Promise<void>
}
