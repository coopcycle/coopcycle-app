import moment from 'moment';
import { Store, Uri } from '@/src/redux/api/types';
import { EditTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { FormikErrors } from 'formik';

export type NewDeliveryDropoffAddressFormValues = {
  address: string;
  contactName: string;
  businessName: string;
  telephone: string;
  description: string;
};

export type BaseTimeSlotFields = {
  timeSlotUrl: Uri;
  timeSlot: string;
  after?: never;
  before?: never;
};

export type BaseDateTimeFields = {
  after?: string;
  before: string;
  timeSlotUrl?: never;
  timeSlot?: never;
};

export type BaseWeightFields = {
  weight: number;
};

export type PackageWithQuantity = {
  type: string;
  quantity: number;
};

export type BasePackagesFields = {
  packages: PackageWithQuantity[];
};

export type NewDeliveryDropoffFormValues = NewDeliveryDropoffAddressFormValues &
  (BaseTimeSlotFields | BaseDateTimeFields) &
  Partial<BasePackagesFields> &
  BaseWeightFields & {
    comments: string;
  };

export function handleChangeWeight(value: string, setFieldValue, setFieldTouched) {
  let newValue = value.replace(',', '.').replace(/[^0-9.]/g, '');

  const firstDecimalIndex = newValue.indexOf('.');
  if (firstDecimalIndex === 0) {
    newValue = `0${newValue}`;
  } else if (firstDecimalIndex !== -1) {
    newValue =
      newValue.substring(0, firstDecimalIndex + 1) +
      newValue.substring(firstDecimalIndex + 1).replace(/\./g, '');
  }

  if (newValue.includes('.')) {
    const decimalIndex = newValue.indexOf('.');
    newValue =
      newValue.substring(0, decimalIndex + 1) +
      newValue.substring(decimalIndex + 1, decimalIndex + 4);
  }

  setFieldValue('weight', newValue);
  setFieldTouched('weight');
}

export function createUpdatedTaskBody(
  values,
  packagesCount,
  selectedTimeSlot,
  selectedChoice,
  supplements,
) {
  return {
    address: values.address,
    telephone: values.telephone,
    contactName: values.contactName,
    name: values.businessName.trim() || null,
    description: values.description.trim() || null,
    comments: values.comments,
    weight: values.weight * 1000,
    supplements: supplements || [],
    packages: packagesCount.filter(item => item.quantity > 0),
    ...(selectedChoice
      ? {
          timeSlotUrl: selectedTimeSlot,
          timeSlot: selectedChoice,
        }
      : { before: values.before }),
    }
  };

export function validateDeliveryForm(
  values: NewDeliveryDropoffFormValues | EditTaskFormValues,
  hasTimeSlot: boolean,
  store: Store,
  t: (key: string) => string
) {
  const errors = {} as FormikErrors<NewDeliveryDropoffFormValues | EditTaskFormValues>;

  if (hasTimeSlot && !values.timeSlot) {
    errors.timeSlot = t('STORE_NEW_DELIVERY_ERROR.EMPTY_TIME_SLOT');
  }

  if (!values.weight && store.weightRequired) {
    errors.weight = t('STORE_NEW_DELIVERY_ERROR.EMPTY_WEIGHT');
  }

  if (!values.packages?.some(item => item.quantity) && store.packagesRequired) {
    errors.packages = t('STORE_NEW_DELIVERY_ERROR.EMPTY_PACKAGES');
  }

  return errors;
}

export function getInitialValues(dropoff: NewDeliveryDropoffAddressFormValues, store: Store) : NewDeliveryDropoffFormValues {
  let initialValues = {
    address: dropoff.address,
    description: dropoff.description || '',
    contactName: dropoff.contactName || '',
    businessName: dropoff.businessName || '',
    telephone: dropoff.telephone || '',
    weight: undefined,
    comments: dropoff.comments || '',
  };

  let timeSlot = store.timeSlot;

  if (timeSlot) {
    timeSlot = timeSlot.trim();
  }

  if (!timeSlot && store.timeSlots.length > 0) {
    timeSlot = store.timeSlots[0];
  }

  if (timeSlot) {
    return {
      ...initialValues,
      timeSlotUrl: timeSlot,
      timeSlot: undefined,
    };
  } else {
    return {
      ...initialValues,
      before: moment().add(1, 'hours').add(30, 'minutes').format(),
    };
  }
}
