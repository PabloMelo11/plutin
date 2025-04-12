
import ConflictError from '../errors/conflict-error'
import BaseController from './controller'

test('conflict error with one object', async () => {
  class ControllerError extends BaseController {
    async handle(): Promise<any> {
      try {
        throw new ConflictError({ id: 'ID' })
      } catch (err: any) {
        return this.failure(err)
      }
    }
  }

  const executeController = new ControllerError()

  const responseError = await executeController.handle()

  expect(responseError).toEqual(
    expect.objectContaining({
      code: 409,
      data: {
        code: 409,
        message: 'Entity already exists.',
        items: [
          {
            id: 'ID',
          },
        ],
      },
    })
  )
})

test('conflict error with array of objects', async () => {
  class ControllerError extends BaseController {
    async handle(): Promise<any> {
      try {
        throw new ConflictError([{ id: 'ID 1' }, { id: 'ID 2' }])
      } catch (err: any) {
        return this.failure(err)
      }
    }
  }

  const executeController = new ControllerError()

  const responseError = await executeController.handle()

  expect(responseError).toEqual(
    expect.objectContaining({
      code: 409,
      data: {
        code: 409,
        message: 'Entity already exists.',
        items: [
          {
            id: 'ID 1',
          },
          {
            id: 'ID 2',
          },
        ],
      },
    })
  )
})
