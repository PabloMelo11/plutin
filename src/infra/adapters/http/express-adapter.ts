import cors from 'cors'
import express, { Express, Request, Response } from 'express'

import type BaseController from '../../../core/http/controller'
import type IHttp from '../../../core/http/http'
import { ErrorResponseCode } from './response-error-code'
import { validateControllerMetadata } from './validate-controller-metadata'

export default class ExpressAdapter implements IHttp {
  readonly instance: Express
  private server: any

  constructor(readonly envs: Record<string, unknown>) {
    this.instance = express()
    this.instance.use(cors())
    this.instance.use(express.json({ limit: '10mb' }))
    this.instance.use(express.urlencoded({ limit: '10mb', extended: false }))
    this.instance.disable('x-powered-by')
  }

  registerRoute(controllerClass: BaseController): void {
    const { metadata } = validateControllerMetadata(controllerClass)

    this.instance[metadata.method](
      metadata.path,
      async (request: Request, response: Response) => {
        try {
          const requestData = {
            body: request.body,
            params: request.params,
            headers: request.headers,
            query: request.query,
          }
          const output = await controllerClass.handle(requestData)
          response
            .status(output.code || 204)
            .json(output.data || { code: ErrorResponseCode.NO_CONTENT_BODY })
        } catch (err: any) {
          const error = controllerClass.failure(err)
          response.status(error.code).json(
            error.data || {
              error: ErrorResponseCode.NO_CONTENT_ERROR,
            }
          )
        }
      }
    )
  }

  async startServer(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.instance.listen(port, () => {
        console.log(`🚀 Server is running on PORT ${port}`)
        resolve()
      })
    })
  }

  async closeServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err: any) => {
          if (err) return reject(err)
          resolve()
        })
      } else {
        resolve()
      }
    })
  }
}
