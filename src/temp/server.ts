import 'reflect-metadata'
import './container'

import DependencyContainer from '../core/decorators/dependency-container'
import FastifyAdapter from '../infra/adapters/http/fastify-adapter'
import { env } from '../infra/env'
import TempController from './controller'

const http = new FastifyAdapter({})

http.registerRoute(DependencyContainer.resolve(TempController))

http.startServer(env.PORT)
