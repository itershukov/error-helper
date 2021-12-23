export enum EErrorStatus {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  Validation = 422,
  FailedDependency = 424,
  TooManyRequests = 429,
  RetryWith = 449,
  InternalServerError = 500
}

export const defaultCodesWithValidations: number[] | EErrorStatus[] = [EErrorStatus.Validation];
export const defaultCodesWithPopupMessage: number[] | EErrorStatus[] = [
  EErrorStatus.BadRequest,
  EErrorStatus.Forbidden,
  EErrorStatus.Conflict,
  EErrorStatus.PayloadTooLarge,
  EErrorStatus.FailedDependency,
  EErrorStatus.TooManyRequests,
  EErrorStatus.RetryWith,
  EErrorStatus.InternalServerError
];
export const DEFAULT_VALIDATION_FIELD = '_base';

export interface IError {
  status: number;
  data: IErrorData;
  validation?: IValidationModel;
  validationCommon?: string;
}

interface IErrorData {
  message: string;
  statusCode: number;
  code: string;
  error?: string;
  errors?: {
    [key: string]: IValidationError[];
  };
}

interface IValidationError {
  message: string;
  code: string;
  params?: {
    [key: string]: any;
  };
}

export interface IPopupConfig {
  showError: Function;
  defaultError: string;
}

export interface ICodesConfig {
  withValidations?: number[] | EErrorStatus[];
  withPopupMessage?: number[] | EErrorStatus[];
}

interface IValidationModel {
  [fieldName: string]: string[];
}
