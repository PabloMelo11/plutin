import { CacheClient } from './client'

export type MethodOptions = {
  throwOnError?: boolean
}

export type CacheOptions = {
  throwOnError?: boolean
}

export abstract class Cache {
  protected abstract client: CacheClient

  protected DEFAULT_EXPIRATION_SECONDS = 360

  private options?: CacheOptions

  constructor(options?: CacheOptions) {
    if (options) this.setOptions(options)
  }

  private setOptions(options: CacheOptions) {
    this.options = {
      ...options,
      throwOnError:
        options.throwOnError === undefined ? true : options.throwOnError,
    }
  }

  public async start(options?: MethodOptions): Promise<void> {
    try {
      await this.client.start()
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return
    }

    console.log('💾 Cache Connected')
  }

  public async get(keyCache: string, options?: MethodOptions): Promise<any> {
    try {
      const dataFromCache = await this.client.get(keyCache)

      return dataFromCache ? dataFromCache : null
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return null
    }
  }

  public async set(
    keyCache: string,
    data: any,
    expiration = this.DEFAULT_EXPIRATION_SECONDS,
    options?: MethodOptions
  ): Promise<void> {
    try {
      return await this.client.set(keyCache, JSON.stringify(data), expiration)
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return
    }
  }

  public async del(keyCache: string, options?: MethodOptions): Promise<void> {
    try {
      return await this.client.del(keyCache)
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return
    }
  }

  public async getKeys(pattern?: string, options?: MethodOptions) {
    try {
      return await this.client.getKeys(pattern)
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return null
    }
  }

  public async delBatch(
    patterns: string[],
    options?: MethodOptions
  ): Promise<void> {
    try {
      return await this.client.delBatch(patterns)
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return
    }
  }

  public async flush() {
    return await this.client.flush()
  }

  public async isRunning(options?: MethodOptions) {
    try {
      return await this.client.isRunning()
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return false
    }
  }

  public async close(options?: MethodOptions): Promise<void> {
    console.log('💾 Cache closed')

    try {
      return await this.client.close()
    } catch (e) {
      if (options?.throwOnError || this.options?.throwOnError) {
        throw e
      }

      return
    }
  }
}
