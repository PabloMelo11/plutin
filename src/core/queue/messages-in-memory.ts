import type IDomainEvent from 'core/events/domain-event'

/**
 * @property queueName Queue name or exchange case using rabbitMQ.
 * @property event Domain event.
 * @property configs Additional settings if required.
 */
export type MessagesInMemory = {
  queueName: string
  event: IDomainEvent
  configs?: Record<string, unknown>
}
