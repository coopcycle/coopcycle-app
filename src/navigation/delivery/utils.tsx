import moment from 'moment';

export function handleChangeWeight(value, setFieldValue, setFieldTouched) {
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
  values,
  hasTimeSlot,
  selectedChoice,
  packagesCount,
  store,
  t,
) {
  const errors = {};

  if (hasTimeSlot && !selectedChoice) {
    errors.timeSlot = t('STORE_NEW_DELIVERY_ERROR.EMPTY_TIME_SLOT');
  }

  if (!values.weight && store.weightRequired) {
    errors.weight = t('STORE_NEW_DELIVERY_ERROR.EMPTY_WEIGHT');
  }

  if (!packagesCount.some(item => item.quantity) && store.packagesRequired) {
    errors.packages = t('STORE_NEW_DELIVERY_ERROR.EMPTY_PACKAGES');
  }

  return errors;
}

export function getInitialValues(dropoff, hasTimeSlot) {
  let initialValues = {
    address: dropoff.address,
    description: dropoff.description || '',
    contactName: dropoff.contactName || '',
    businessName: dropoff.businessName || '',
    telephone: dropoff.telephone || '',
    weight: null,
    comments: dropoff.comments || '',
  };

  if (hasTimeSlot) {
    initialValues = {
      ...initialValues,
      timeSlotUrl: null,
      timeSlot: null,
    };
  } else {
    initialValues = {
      ...initialValues,
      before: moment().add(1, 'hours').add(30, 'minutes').format(),
    };
  }

  return initialValues;
}