import _ from 'lodash';
import {
  EditTaskPayload,
  OrderPayload,
  PutDeliveryBody,
  Task,
} from '@/src/types/task';
import { FormStateToSend } from '@/src/navigation/task/contexts/ReportFormContext';
import { FormikTouched } from 'formik';
import {
  BaseDateTimeFields,
  BasePackagesFields,
  BaseTimeSlotFields,
  BaseWeightFields,
} from '@/src/navigation/delivery/utils';
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


export type EditTaskFormValues = {
  address: string;
  contactName: string;
  businessName: string;
  telephone: string;
  description: string;
} & (BaseTimeSlotFields | BaseDateTimeFields) &
  Partial<BaseWeightFields> &
  Partial<BasePackagesFields>;

export type ManualSupplementValues = {
  pricingRule: Uri;
  quantity: number;
};

type EditOrderFormValues = {
  manualSupplements: ManualSupplementValues[];
}

export type EditFormValues = EditTaskFormValues & EditOrderFormValues;

export const getInitialFormValues = (task: Task, initialDeliveryFormData: PutDeliveryBody) => {

  const initialTaskData = initialDeliveryFormData.tasks?.find(t => t.id === task.id);

  //FIXME: get more data from 'initialTaskData' instead of 'task' object
  // for example, weight and packages must be coming from 'initialTaskData' as in 'task' we can get a sum of all packages/weight belonging to other tasks

  return {
    // Task-level fields
    telephone: task.address?.telephone || '',
    contactName: task.address?.contactName || '',
    businessName: task.address?.name || '',
    description: task.address?.description || '',
    address: task.address?.streetAddress || '',
    //FIXME: pre-fill the time slot from the task (we don't store selected timeSlot on the task yet)
    // timeSlotUrl: task?.timeSlotUrl || undefined,
    timeSlotUrl: undefined,
    // timeSlot: task?.timeSlot || undefined,
    timeSlot: undefined,
    before: task.before || '',
    after: task.after || '',
    weight: initialTaskData?.weight ? `${initialTaskData.weight / 1000}` : '0',
    packages: undefined,
    // Order-level fields
    manualSupplements: initialDeliveryFormData.order?.manualSupplements ?? [],
  } as EditFormValues
};

const buildMetadataPayload = (task: Partial<Task>, id: number, formValues?: EditFormValues, formTouchedFields?: FormikTouched<EditFormValues>) => {
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

  if (formTouchedFields?.weight && formValues) {
    taskPayload.weight = formValues.weight ? Number(formValues.weight) * 1000 : undefined;
  }

  if (formTouchedFields?.packages && formValues) {
    taskPayload.packages = formValues.packages;
  }

  const orderPayload = {
  } as OrderPayload

  if (formTouchedFields?.manualSupplements && formValues) {
    orderPayload.manualSupplements = formValues.manualSupplements;
  }

  const suggestion = {
    suggestion: {
      tasks: [
        {
          id: id,
          ...taskPayload
        },
      ],
      order: orderPayload,
    },
  };

  const metadata = [
    suggestion,
  ];

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
