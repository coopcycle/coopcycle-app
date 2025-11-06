import { createDeliveryObject, getInitialValues } from '../../delivery/utils';
import parsePhoneNumberFromString from 'libphonenumber-js';
import _ from 'lodash';
import { Task } from '@/src/types/task';

export const handleFormSubmit = (
  values,
  address,
  store,
  packagesCount: [],
  selectedTimeSlot: string,
  selectedChoice,
  country: string,
  task?: Partial<Task>,
  onSubmit?: (data) => void
) => {
  console.log('Creating delivery object with:', {
    address, selectedTimeSlot, selectedChoice
  });

  const dropoff = {
    telephone: parsePhoneNumberFromString(values.telephone, country)?.format('E.164') || values.telephone,
    contactName: values.contactName,
    description: values.description,
    businessName: values.businessName,
    address: address.streetAddress,
  };

  let delivery;
  try {
    delivery = createDeliveryObject(
      values,
      store,
      { params: { dropoff } },
      packagesCount,
      selectedTimeSlot,
      selectedChoice,
    );
  } catch (error) {
    console.error('Error creating delivery object:', error);
    delivery = {};
  }
  
  // Asegurar que los paquetes se envíen correctamente
  delivery.packages = packagesCount.filter(pkg => pkg.quantity > 0);

  console.log('Final delivery object:', delivery);
  onSubmit?.(delivery);
};

export const getAutocompleteProps = (deliveryError) => {
  const baseProps = {
    inputContainerStyle: {
      flex: 1,
      borderWidth: 0,
    },
    textInputStyle: {
      padding: 10,
    },
  };

  return !_.isEmpty(deliveryError)
    ? {
        ...baseProps,
        inputContainerStyle: {
          ...baseProps.inputContainerStyle,
          borderColor: '#FF4136',
        },
      }
    : baseProps;
};

export const getInitialFormValues = (
  task?: Partial<Task>,
  store?,
) => {
  const businessName =
    task?.orgName || store?.name || task?.address?.name || '';

  return {
    telephone: task?.address?.telephone || '',
    contactName: task?.address?.contactName || '',
    businessName: businessName,
    description: task?.address?.description || '',
    address: task?.address?.streetAddress || '',
    weight: task?.weight ? task.weight.toString() : '0',
    timeSlot: task?.timeSlot || null,
    timeSlotUrl: task?.timeSlotUrl || null,
    before: task?.before || '',
    after: task?.after || '',
    doorstep: task?.doorstep || false,
    storeName: businessName,
  };
};