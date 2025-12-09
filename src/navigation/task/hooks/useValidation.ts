import { useCallback } from 'react';
import _ from 'lodash';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {
  validateDeliveryForm,
} from '../../delivery/utils';
import i18n from '@/src/i18n';
import { EditTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { FormikErrors } from 'formik';
import { Store } from '@/src/redux/api/types';

export const useValidation = (
  validAddress: boolean,
  packagesCount: [],
  store: Store,
  country: string
) => {
  const { t } = i18n;

  const validate = useCallback(
    (values: EditTaskFormValues) => {
      const errors = {} as FormikErrors<EditTaskFormValues>;

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

      // Address validation
      if (!validAddress) {
        errors.address = t('STORE_NEW_DELIVERY_ADDRESS_HELP');
      }

      // Delivery validation
      const deliveryErrors = validateDeliveryForm(
        values,
        false,
        packagesCount,
        store,
        t,
      );

      return { ...errors, ...deliveryErrors };
    },
    [validAddress, packagesCount, store, country, t],
  );

  return validate;
};
