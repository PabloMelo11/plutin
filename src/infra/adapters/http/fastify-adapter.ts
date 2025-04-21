import cors from '@fastify/cors'
import type IHttp from 'core/http/http'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import qs from 'qs'

import BaseController, { Request } from '../../../core/http/controller'
import { env } from '../../../infra/env'
import { ErrorResponseCode } from './response-error-code'
import { validateControllerMetadata } from './validate-controller-metadata'

export default class FastifyAdapter implements IHttp {
  readonly instance: FastifyInstance

  constructor(readonly envs: Record<string, unknown>) {
    this.instance = fastify({
      bodyLimit: 10 * 1024 * 1024,
      querystringParser: (str) => qs.parse(str),
    })

    this.instance.register(cors)
  }

  registerRoute(controllerClass: BaseController): void {
    const { metadata } = validateControllerMetadata(controllerClass)

    this.instance[metadata.method](
      metadata.path,
      async (request: FastifyRequest, reply: FastifyReply) => {
        const requestData = {
          body: request.body,
          params: request.params,
          headers: request.headers,
          query: request.query,
        } as Request

        try {
          const output = await controllerClass.execute(requestData)
          return reply.status(output.code || 200).send(
            output.data || {
              code: ErrorResponseCode.NO_CONTENT_BODY,
            }
          )
        } catch (err: any) {
          const error = await controllerClass.failure(err, {
            env: env.ENVIRONMENT,
            request: {
              body: requestData.body,
              headers: requestData.headers,
              params: request.params,
              query: requestData.query,
              url: metadata.path,
              method: metadata.method,
            },
          })
          return reply.status(error.code || 200).send(
            error.data || {
              code: ErrorResponseCode.NO_CONTENT_ERROR,
            }
          )
        }
      }
    )
  }

  async startServer(port: number): Promise<void> {
    await this.instance.listen({ port })

    if (this.envs.NODE_ENV !== 'test') {
      console.log(`🚀  Server is running on PORT ${port}`)
    }
  }

  async closeServer() {
    await this.instance.close()
  }
}
