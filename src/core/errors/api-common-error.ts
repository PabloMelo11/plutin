export type PropertiesError = {
  value?: any;
  type: string;
  message: string;
  property: string | number | undefined;
  propertyType?: string;
  path?: string;
};

export type CommonError = {
  location: string;
  propertyErrors?: PropertiesError[];
};

export type ApiCommonError = {
  code: number;
  occurredAt: Date;
  message: string;
  errorCode: string;
  errors?: CommonError[];
};

export enum ApiErrorEnum {
  DOMAIN = 'ERR001',
  APPLICATION = 'ERR002',
  INFRA = 'ERR003',
  HTTP_CLIENT = 'ERR004',
  VALIDATOR = 'ERR005'
}
