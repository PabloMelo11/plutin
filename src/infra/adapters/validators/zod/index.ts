import { ZodObject, ZodEffects, type ZodError } from 'zod';

import IValidationHTTP, { RequestHttp } from '../../../../core/http/validator';
import ZodMapError from './zod-map-error';
import ValidationError from 'core/errors/validation-error';

type SchemaDefinition = {
  headers: ZodObject<Record<string, any>>;
  params: ZodObject<Record<string, any>>;
  query: ZodObject<Record<string, any>>;
  body:
    | ZodObject<Record<string, any>>
    | ZodEffects<ZodObject<Record<string, any>>>;
};

type ZodSchemaObject = ZodObject<SchemaDefinition>;

export default class ZodValidator implements IValidationHTTP {
  constructor(private zodSchema: ZodSchemaObject) {}

  async validate<T>(requestHttp: RequestHttp): Promise<T> {
    const errors = [];

    const {
      data: headersData = {},
      error: headersErrors = {} as ZodError<{ errors: ZodError[] }>,
    } = requestHttp.headers
      ? await this.zodSchema.shape.headers.safeParseAsync(requestHttp.headers, {
          path: ['headers'],
        })
      : {};

    if (headersErrors?.errors) {
      errors.push(headersErrors?.errors);
    }

    const {
      data: paramsData = {},
      error: paramsErrors = {} as ZodError<{ errors: ZodError[] }>,
    } = requestHttp.params
      ? await this.zodSchema.shape.params.safeParseAsync(requestHttp.params, {
          path: ['params'],
        })
      : {};

    if (paramsErrors?.errors) {
      errors.push(paramsErrors?.errors);
    }

    const {
      data: queryData = {},
      error: queryErrors = {} as ZodError<{ errors: ZodError[] }>,
    } = requestHttp.query
      ? await this.zodSchema.shape.query.safeParseAsync(requestHttp.query, {
          path: ['query'],
        })
      : {};

    if (queryErrors?.errors) {
      errors.push(queryErrors?.errors);
    }

    const {
      data: bodyData = {},
      error: bodyErrors = {} as ZodError<{ errors: ZodError[] }>,
    } = requestHttp.body
      ? await this.zodSchema.shape.body.safeParseAsync(requestHttp.body, {
          path: ['body'],
        })
      : {};

    if (bodyErrors?.errors) {
      errors.push(bodyErrors?.errors);
    }

    if (errors.length) {
      throw new ValidationError(ZodMapError.mapErrors(errors));
    }

    return {
      body: bodyData,
      headers: headersData,
      params: paramsData,
      query: queryData,
    } as T;
  }
}
