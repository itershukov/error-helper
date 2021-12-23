import {
  IError,
  defaultCodesWithValidations,
  defaultCodesWithPopupMessage,
  DEFAULT_VALIDATION_FIELD,
  ICodesConfig,
  IPopupConfig
} from './models';

type TErrorMapper = (
  error: any,
  popupConfig?: IPopupConfig,
  codesConfig?: ICodesConfig,
  translate?: Function
) => Promise<IError | null>;

export const errorMapper: TErrorMapper = async (
  error,
  popupConfig?: IPopupConfig,
  codesConfig?: ICodesConfig,
  translate?: Function
) => {
  if (!error) {
    return Promise.reject(error);
  }

  if (!error.response) {
    return error.code ? Promise.reject({ ...error, status: error.code }) : Promise.reject(error);
  }

  const { status, data } = error.response;
  const shortError = { status, data };

  return Promise.reject(mapErrors(shortError, popupConfig, codesConfig, translate));
};

const mapErrors = (error: IAxiosError, popupConfig?: IPopupConfig, codesConfig?: ICodesConfig, translate?: Function): IError => {
  const { data, status } = error;

  const withPopupMessage = codesConfig?.withPopupMessage || defaultCodesWithPopupMessage;
  const withValidations = codesConfig?.withValidations || defaultCodesWithValidations;
  debugger;
  if (withValidations.includes(status)) {
    return {
      status,
      data,
      validation: mapValidationData(data, translate),
      validationCommon: mapValidationCommon(data, translate)
    };
  }

  if (popupConfig && withPopupMessage.includes(status)) {
    showPopupError(
      {
        showError: popupConfig.showError,
        defaultError: data.message || data.error || popupConfig.defaultError
      },
      translate
    );
  }

  return error;
};

const mapValidationCommon = (data: IErrorData, translate?: Function): string | undefined => {
  const fieldsErrorsIsEmpty = data.errors && Object.keys(data.errors).length === 0;

  return !data.errors || fieldsErrorsIsEmpty ? translateErrors(data, translate) : undefined;
};

const mapValidationData = (data: IErrorData, translate?: Function): IValidationModel | undefined => {
  const fieldsErrorsIsEmpty = data.errors && Object.keys(data.errors).length === 0;

  if (!data.errors || fieldsErrorsIsEmpty) {
    return undefined;
  }

  const result: IValidationModel = {};

  for (const [key, value] of Object.entries(data.errors)) {
    const keyWithoutFirstDot: string = key.replace(/^\./, '');

    result[keyWithoutFirstDot] = value.map(item => translateErrors(item, translate));
  }

  if (Object.keys(result).length === 0) {
    return { [DEFAULT_VALIDATION_FIELD]: translateErrors(data, translate) };
  }

  return result;
};

const translateErrors = (data: { message: string; code: string; params?: object }, t?: Function) => {
  const { code, message, params } = data;

  return t ? t([code, message, params]) : message;
};

const showPopupError = (popupConfig: IPopupConfig, translate?: Function) => {
  const { showError, defaultError } = popupConfig;

  return translate ? showError(translate(defaultError)) : showError(defaultError);
};

interface IAxiosError {
  status: number;
  data: IErrorData;
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

interface IValidationModel {
  [fieldName: string]: string[];
}
