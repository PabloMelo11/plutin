import 'reflect-metadata'
import './container'

import { DependencyContainer } from '../core/decorators/dependency-container'
import FastifyAdapter from '../infra/adapters/http/fastify-adapter'
import { TempController } from './controller'

const http = new FastifyAdapter({})

http.registerRoute(DependencyContainer.resolve(TempController))

http.startServer(3333)
