import _ from 'lodash';
import { Task } from '@/src/types/task';

export const getAutocompleteProps = deliveryError => {
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

export const getInitialFormValues = (task?: Partial<Task>, store?) => {
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

const buildMetadataPayload = (task, id) => {
  const order = {
    order: {
      manualSupplements: task.selectedSupplements,
    },
  };

  const suggestion = {
    suggestion: {
      tasks: [
        {
          id: id,
          ...task,
        },
      ],
    },
  };

  const metadata = [
    task.selectedSupplements ? order : null,
    task ? suggestion : null,
  ].filter(item => item !== null);

  return metadata;
};

export const buildReportIncidentPayload = report => {
  const metadata = buildMetadataPayload(report.updatedTask, report.task.id);
  const payload = {
    description: report.notes,
    failureReasonCode: report.failureReasonCode,
    task: report.taskID,
  };

  if (metadata.length > 0) payload.metadata = metadata;
  return payload;
};

export const buildUpdatedTaskFields = (field, value): Partial<Task> => {
  switch (field) {
    case 'address':
      return { address: value.streetAddress };
    case 'packages':
      return { packages: value.map(p => {return {type: p['@type'], quantity: p.quantity}})}
    case 'weight':
      return { weight: Number(value) };
    case 'telephone':
      return { telephone: value };
    case 'selectedTimeSlot':
      return { timeSlotID: value };
    case 'selectedChoice':
      return { timeSlot: value };
      case 'contactName':
      return { contactName: value };
    case 'businessName':
      return { businessName: value };
      case 'description':
      return { description: value };
    default:
      return {};
  }
};

export const mapSupplements = supplements => {
  return supplements.map(supplement => {
    return {
      pricingRule: supplement?.originalRule?.['@id'] || '',
      quantity: supplement?.quantity,
    };
  });
};
