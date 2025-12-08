import _ from 'lodash';
import { EditTaskPayload, Task } from '@/src/types/task';
import { FormStateToSend } from '@/src/navigation/task/contexts/ReportFormContext';
import { Uri } from '@/src/redux/api/types';

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


type BaseTimeSlotFields = {
  timeSlotUrl: Uri;
  timeSlot: string;
  after?: never;
  before?: never;
};

type BaseDateTimeFields = {
  after?: string;
  before: string;
  timeSlotUrl?: never;
  timeSlot?: never;
};

export type EditTaskFormValues = {
  address: string;
  contactName: string;
  businessName: string;
  telephone: string;
  description: string;
  } & (BaseTimeSlotFields | BaseDateTimeFields) & {
  weight: string;
  // packages: string; //TODO
}

export const getInitialFormValues = (task?: Partial<Task>) => {

  return {
    telephone: task?.address?.telephone || '',
    contactName: task?.address?.contactName || '',
    businessName: task?.address?.name || '',
    description: task?.address?.description || '',
    address: task?.address?.streetAddress || '',
    weight: task?.weight ? task.weight.toString() : '0',
    timeSlot: task?.timeSlot || null,
    timeSlotUrl: task?.timeSlotUrl || null,
    before: task?.before || '',
    after: task?.after || '',
    doorstep: task?.doorstep || false,
  } as EditTaskFormValues;
};

const buildMetadataPayload = (task: Partial<Task>, id: number, formValues?: EditTaskFormValues) => {
  const order = {
    order: {
      manualSupplements: task.selectedSupplements,
    },
  };

  //TODO: read all task-related fields from formValues/formik instead of task/ReportFormContext

  const taskPayload = {
    ...task
  } as EditTaskPayload;

  if (formValues?.timeSlotUrl) {
    taskPayload.timeSlotUrl = formValues.timeSlotUrl;
    taskPayload.timeSlot = formValues.timeSlot;
  } else if (formValues?.before) {
    taskPayload.before = formValues.before;
  }

  const suggestion = {
    suggestion: {
      tasks: [
        {
          id: id,
          ...taskPayload
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

export const buildReportIncidentPayload = (report: FormStateToSend, formValues?: EditTaskFormValues) => {

  const metadata = buildMetadataPayload(report.updatedTask, report.task.id, formValues);
  const payload = {
    description: report.notes,
    failureReasonCode: report.failureReason,
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
      return { packages: value}
    case 'weight':
      return { weight: Number(value) };
    case 'telephone':
      return { telephone: value };
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
