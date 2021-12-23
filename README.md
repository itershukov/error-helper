# error-helper

#### To start using:

```
yarn add @axmit/error-helper
```

```js
import { errorMapper } from '@axmit/error-helper';

axios.interceptors.response.use(
  response => response.data,
  error => errorMapper
);
```

##### If you want show popup

```js
import { errorMapper } from '@axmit/error-helper';
import { message } from 'antd';

...

axios.interceptors.response.use(
  response => response.data,
  error => errorMapper(error, { showError: message.error, defaultError: 'An error occurred, please try again later' })
);
```

##### Examples for different params

```js
axios.interceptors.response.use(
  response => response.data,
  error => {
    const popupConfig = { showError: message.error, defaultError: EBaseErrorMessage.Default };
    const codesConfig = {
      withValidations: [...defaultCodesWithValidations, EErrorStatus.RetryWith],
      withPopupMessage: [EErrorStatus.PayloadTooLarge]
    };

    return errorMapper(error, popupConfig, codesConfig, t);
  }
);
```

##### Examples with antd4 forms (where error has type IError)

```js
const LoginFormComponent: React.FC<AllProps> = props => {
    const { customerModel } = props;
    const { errors, params, data } = customerModel;
    const { fields } = useFormMapper(['name', 'email', 'password'], data, params, errors);
    ...

    return (
        <Form onFinish={login} fields={fields}>
```
