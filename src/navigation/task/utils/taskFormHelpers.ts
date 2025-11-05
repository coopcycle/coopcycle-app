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

  if (task?.['@id']) {
    delivery['@id'] = task['@id'];
  }
  if (task?.id) {
    delivery.id = task.id;
  }
  
  if (task?.after) {
    delivery.after = task.after;
  }
  if (task?.before) {
    delivery.before = task.before;
  }
  
  if (task?.status) {
    delivery.status = task.status;
  }
  if (task?.type) {
    delivery.type = task.type;
  }
  if (task?.metadata) {
    delivery.metadata = { ...task.metadata };
  }
  
  if (task?.doorstep !== undefined) {
    delivery.doorstep = task.doorstep;
  }
  if (task?.ref) {
    delivery.ref = task.ref;
  }
  if (task?.tags) {
    delivery.tags = [...task.tags];
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