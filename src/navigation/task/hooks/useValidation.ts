import { useCallback } from 'react';
import _ from 'lodash';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { EditTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { FormikErrors } from 'formik';
import { Store } from '@/src/redux/api/types';
import { useSelector } from 'react-redux';
import { selectCountry } from '@/src/redux/App/selectors';

export const useValidation = (
  store?: Store,
) => {
  const { t } = useTranslation();

  const country = useSelector(selectCountry);

  const validate = useCallback(
    (values: EditTaskFormValues) => {
      const errors = {} as FormikErrors<EditTaskFormValues>;

      // Address validation
      if (!values.isValidAddress) {
        errors.address = t('STORE_NEW_DELIVERY_ADDRESS_HELP');
      }

      // Phone validation
      if (_.isEmpty(values.telephone)) {
        errors.telephone = t('STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER');
      } else {
        const phoneNumber = parsePhoneNumberFromString(
          _.trim(values.telephone),
          country,
        );
        if (!phoneNumber || !phoneNumber.isValid()) {
          errors.telephone = t('INVALID_PHONE_NUMBER');
        }
      }

      return errors;
    },
    [country, t],
  );

  return validate;
};
