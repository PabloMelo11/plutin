import { UniqueEntityId } from '../core/entities/unique-entity-id'

export abstract class CacheClient {
  abstract start(): Promise<void>
  abstract close(): Promise<void>
  abstract get(keyCache: string): Promise<any>
  abstract set(keyCache: string, data: any, expiration?: number): Promise<void>

  abstract del(keyCache: string): Promise<void>
  abstract delBatch(keyCache: string[]): Promise<void>

  abstract getKeys(pattern?: string): Promise<string[] | null>

  abstract flush(): Promise<void>

  public async isRunning() {
    const key = new UniqueEntityId().toValue()

    await this.set(key, JSON.stringify({ ping: true }), 60)

    const cachedData = await this.get(key)

    return cachedData?.ping || false
  }
}
