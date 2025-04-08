import type IDomainEvent from 'core/events/domain-event'

import Handler from './handler'

/**
 * @property consume Method that will consume queue.
 * @property publish Method that will publish message to queue.
 */
export default interface IQueue {
  consume(queueName: string, callback: Handler): Promise<void>
  publish(
    queueName: string,
    domainEvent: IDomainEvent,
    configs?: Record<string, any>
  ): Promise<void>
}
