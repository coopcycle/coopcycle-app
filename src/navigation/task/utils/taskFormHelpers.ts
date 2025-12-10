import _ from 'lodash';
import { EditTaskPayload, Task } from '@/src/types/task';
import { FormStateToSend } from '@/src/navigation/task/contexts/ReportFormContext';
import { FormikTouched } from 'formik';
import {
  BaseDateTimeFields, BasePackagesFields,
  BaseTimeSlotFields,
} from '@/src/navigation/delivery/utils';

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


export type EditTaskFormValues = {
  address: string;
  contactName: string;
  businessName: string;
  telephone: string;
  description: string;
} & (BaseTimeSlotFields | BaseDateTimeFields) &
  Partial<BasePackagesFields> & {
    weight: string;
  };

export const getInitialFormValues = (task?: Partial<Task>) => {

  return {
    telephone: task?.address?.telephone || '',
    contactName: task?.address?.contactName || '',
    businessName: task?.address?.name || '',
    description: task?.address?.description || '',
    address: task?.address?.streetAddress || '',
    weight: task?.weight ? task.weight.toString() : '0',
    //FIXME: pre-fill the time slot from the task (we don't store selected timeSlot on the task yet)
    // timeSlotUrl: task?.timeSlotUrl || undefined,
    timeSlotUrl: undefined,
    // timeSlot: task?.timeSlot || undefined,
    timeSlot: undefined,
    before: task?.before || '',
    after: task?.after || '',
    doorstep: task?.doorstep || false,
  } as EditTaskFormValues;
};

const buildMetadataPayload = (task: Partial<Task>, id: number, formValues?: EditTaskFormValues, formTouchedFields?: FormikTouched<EditTaskFormValues>) => {
  const order = {
    order: {
      manualSupplements: task.selectedSupplements,
    },
  };

  //TODO: read all task-related fields from formValues/formik instead of task/ReportFormContext

  const taskPayload = {
    ...task
  } as EditTaskPayload;

  if (formTouchedFields?.timeSlotUrl && formValues) {
    taskPayload.timeSlotUrl = formValues.timeSlotUrl;
    taskPayload.timeSlot = formValues.timeSlot;
  }
  if (formTouchedFields?.after && formValues) {
    taskPayload.after = formValues.after;
  }
  if (formTouchedFields?.before && formValues) {
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

export const buildReportIncidentPayload = (report: FormStateToSend, formValues?: EditTaskFormValues, formTouchedFields?: FormikTouched<EditTaskFormValues>) => {

  const metadata = buildMetadataPayload(report.updatedTask, report.task.id, formValues, formTouchedFields);
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
