import Queue from './queue'

/**
 * @property connect Method that will connect in queue.
 * @property disconnect Method that will disconnect in queue.
 * @property createConsumers Method to create consumers automatically.
 */
export default interface IQueueConnection extends Queue {
  connect(props: unknown): Promise<any>
  disconnect(): Promise<void>
  createConsumers?<T>(queueName: string, configs: T | any): Promise<void>
}
