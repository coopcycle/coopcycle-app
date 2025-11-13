import { createUpdatedTaskBody } from '../../delivery/utils';
import parsePhoneNumberFromString from 'libphonenumber-js';
import _ from 'lodash';
import { Task } from '@/src/types/task';

export const handleFormSubmit = (
  values,
  report,
  address,
  selectedTimeSlot,
  selectedChoice,
  packagesCount,
  onSubmit?: (data) => void,
  selectedSupplements?: []
) => {
  // console.log('Creating delivery object with:', {
  //   values,
  //   address,
  //   selectedTimeSlot,
  //   selectedChoice,
  //   packagesCount,
  //   selectedSupplements
  // });

  let body;
  try {
    body = createUpdatedTaskBody(
      values,
      packagesCount,
      selectedTimeSlot,
      selectedChoice,      
      selectedSupplements,
    );
  } catch (error) {
    console.error('Error creating payload object:', error);
    body = {};
  }
  
  const payload = buildReportIncidentPayload(reportBody, body);

  onSubmit?.(payload);
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
  };
};

export const buildReportIncidentPayload = (report, updatedTask) => {
  return {
    description: report.description,
    failureReasonCode: report.failureReasonCode,
    task: report.taskID,
    // metadata: [
    //   {
    //     suggestion: {
    //       // tasks: [{
    //       //   id: updatedTask.id,
    //       //   // ...updatedTaskToSend
    //       // }]
    //     }
    //   }
    // ]
  };
};

// BUILD DATA STRUCTURE ACCORDING TO API EXPECTATIONS
export const buildUpdatedTaskFields = (field, value): Partial<Task> => {
  console.log('buildUpdatedTaskFields called with:', { field, value });
  switch (field) {
    case 'address':
      return { address: value.streetAddress };
    case 'packagesCount':
      return { packages: value };
    case 'weight':
      return { weight: value };
      case 'telephone':
      return { telephone: value };
    case 'selectedTimeSlot':
      return { timeSlot: value };
    case 'selectedChoice':
      return { choice: value };
    case 'selectedSupplements':
      return { supplements: value };
    // case 'values':
    //   return value as Partial<Task>;
    default:
      return {};
  }
};