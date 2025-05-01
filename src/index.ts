// core decorators
export * from './core/decorators/controller-http-decorator'
export * from './core/decorators/dependency-container'

// core entities
export * from './core/entities/aggregate-root'
export * from './core/entities/common-dto'
export * from './core/entities/domain-event'
export * from './core/entities/entity'
export * from './core/entities/optional'
export * from './core/entities/replace'
export * from './core/entities/unique-entity-id'
export * from './core/entities/value-object'
export * from './core/entities/watched-list'

// core errors
export * from './core/errors/application-error'
export * from './core/errors/conflict-error'
export * from './core/errors/domain-error'
export * from './core/errors/http-client-error'
export * from './core/errors/infra-error'

// core http
export * from './core/http/base-controller'
export * from './core/http/dto-response'
export * from './core/http/error-notifier'
export * from './core/http/get-take-and-skip'
export * from './core/http/health-connections'
export * from './core/http/pagination'
export * from './core/http/validator'

// infra adapters http
export * from './infra/adapters/http/express-adapter'
export * from './infra/adapters/http/fastify-adapter'

// infra adapters notifications
export * from './infra/adapters/notifications/discord'
export * from './infra/adapters/notifications/in-memory'
export * from './infra/adapters/notifications/notification-factory'
export * from './infra/adapters/notifications/sentry'

// infra adapters validations
export * from './infra/adapters/validators/zod/zod-validator'

// infra common env
export * from './infra/env'
