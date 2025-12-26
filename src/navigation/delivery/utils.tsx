import moment from 'moment';
import { Store, Uri } from '@/src/redux/api/types';
import { EditTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { FormikErrors } from 'formik';

export type PlaceFields = {
  geo: { latitude: number; longitude: number };
  streetAddress: string;
  postalCode?: string;
  addressLocality?: string;
  addressCountry?: string;
  addressRegion?: string;
};

export type BaseAddressFields = {
  address: PlaceFields;
  businessName: string;
  description: string;
  telephone: string;
  contactName: string;
  //FIXME: store in form's errors instead
  isValidAddress: boolean;
};

export type NewDeliveryPickupAddressFormValues = BaseAddressFields;

export type NewDeliveryDropoffAddressFormValues = BaseAddressFields;

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

export type BaseTimeRangeFields = BaseTimeSlotFields | BaseDateTimeFields;

export type BaseWeightFields = {
  weight: string;
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
  Partial<BaseWeightFields> &
  Partial<BasePackagesFields> & {
    comments: string;
  };

export function validateDeliveryForm(
  values: NewDeliveryDropoffFormValues | EditTaskFormValues,
  hasTimeSlot: boolean,
  store: Store,
  t: (key: string) => string,
) {
  const errors = {} as FormikErrors<
    NewDeliveryDropoffFormValues | EditTaskFormValues
  >;

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

export function getInitialValues(
  dropoff: NewDeliveryDropoffAddressFormValues,
  store: Store,
): NewDeliveryDropoffFormValues {
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
