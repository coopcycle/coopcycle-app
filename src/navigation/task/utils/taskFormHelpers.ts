import { moment } from '@/src/shared';
import { createDeliveryObject, getInitialValues } from '../../delivery/utils';
import parsePhoneNumberFromString from 'libphonenumber-js';
import _ from 'lodash';
import { Task } from '@/src/types/task';

export const getInitialFormValues = (task: Partial<Task>, hasTimeSlot: boolean) => {
  return {
    telephone: task?.address?.telephone || '',
    contactName: task?.address?.contactName || '',
    businessName: task?.orgName || task?.address?.name || '',
    description: task?.address?.description || '',
    address: task?.address?.streetAddress || '',
    weight: task?.weight ? task.weight.toString() : '',
    comments: task?.comments || '',
    // Time slot related - usar los valores de la task
    timeSlot: task?.timeSlot || null,
    timeSlotUrl: task?.timeSlotUrl || null,
    before: task?.before || moment().add(1, 'hours').add(30, 'minutes').format(),
    after: task?.after || '',
    // Incluir otros campos que puedan ser relevantes
    doorstep: task?.doorstep || false,
    ...getInitialValues({}, hasTimeSlot),
  };
};

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
  const dropoff = {
    telephone: parsePhoneNumberFromString(values.telephone, country)?.format('E.164') || values.telephone,
    contactName: values.contactName,
    description: values.description,
    businessName: values.businessName,
    address,
  };

  const delivery = createDeliveryObject(
    values,
    store,
    { params: { dropoff } },
    packagesCount,
    selectedTimeSlot,
    selectedChoice,
  );

  // Preservar todos los campos importantes de la task original
  if (task?.['@id']) {
    delivery['@id'] = task['@id'];
  }
  if (task?.id) {
    delivery.id = task.id;
  }
  
  // Preservar campos de tiempo
  if (task?.after) {
    delivery.after = task.after;
  }
  if (task?.before) {
    delivery.before = task.before;
  }
  
  // Preservar estado y metadatos
  if (task?.status) {
    delivery.status = task.status;
  }
  if (task?.type) {
    delivery.type = task.type;
  }
  if (task?.metadata) {
    delivery.metadata = task.metadata;
  }
  
  // Preservar otros campos importantes
  if (task?.doorstep !== undefined) {
    delivery.doorstep = task.doorstep;
  }
  if (task?.ref) {
    delivery.ref = task.ref;
  }
  if (task?.tags) {
    delivery.tags = task.tags;
  }

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

// Helper para obtener el timeslot inicial desde la task
export const getInitialTimeSlot = (task?: Partial<Task>) => {
  if (task?.timeSlot) {
    return task.timeSlot;
  }
  return null;
};

// Helper para obtener la selección de paquetes inicial
export const getInitialPackageSelection = (task?: Partial<Task>) => {
  if (!task?.packages) return [];
  
  return task.packages.map(pkg => ({
    type: pkg.type,
    quantity: pkg.quantity,
    ...pkg
  }));
};