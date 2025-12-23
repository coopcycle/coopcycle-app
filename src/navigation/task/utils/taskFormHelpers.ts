import { FormikTouched } from 'formik';
import { Task } from '@/src/types/task';
import { FormState } from '@/src/navigation/task/contexts/ReportFormContext';
import {
  BaseAddressFields,
  BaseDateTimeFields,
  BasePackagesFields,
  BaseTimeSlotFields,
  BaseWeightFields,
} from '@/src/navigation/delivery/utils';
import {
  EditTaskPayload,
  IncidentPayload,
  OrderPayload,
  SuggestionPayload,
  Uri,
} from '@/src/redux/api/types';

export type EditTaskFormValues = BaseAddressFields &
  (BaseTimeSlotFields | BaseDateTimeFields) &
  Partial<BaseWeightFields> &
  Partial<BasePackagesFields>;

export type ManualSupplementValues = {
  pricingRule: Uri;
  quantity: number;
};

type EditOrderFormValues = {
  manualSupplements: ManualSupplementValues[];
};

export type EditFormValues = EditTaskFormValues & EditOrderFormValues;

export type CompleteTaskFormValues = {
  notes?: string;
  contactName?: string;
};

export type ReportIncidentFormValues = EditFormValues & CompleteTaskFormValues & {
  failureReason: string;
  failureReasonMetadata: { [key: string]: unknown };
};

export const canEditTask = (task: Task) => {
  return Boolean(task.metadata?.order_number);
};

const buildMetadataPayload = (
  report: FormState,
  formValues?: EditFormValues,
  formTouchedFields?: FormikTouched<EditFormValues>,
) => {
  let suggestion: SuggestionPayload | undefined;

  if (canEditTask(report.task)) {
    const id = report.task.id;

    const taskPayload = {} as EditTaskPayload;

    if (
      (formTouchedFields?.address ||
        formTouchedFields?.businessName ||
        formTouchedFields?.contactName ||
        formTouchedFields?.telephone ||
        formTouchedFields?.description) &&
      formValues
    ) {
      taskPayload.address = {
        ...formValues.address,
        name: formValues.businessName,
        contactName: formValues.contactName,
        telephone: formValues.telephone,
        description: formValues.description,
      };
    }

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
      taskPayload.weight = formValues.weight
        ? Number(formValues.weight) * 1000
        : undefined;
    }

    if (formTouchedFields?.packages && formValues) {
      taskPayload.packages = formValues.packages;
    }

    const orderPayload = {} as OrderPayload;

    if (formTouchedFields?.manualSupplements && formValues) {
      orderPayload.manualSupplements = formValues.manualSupplements;
    }

    if (
      Object.keys(taskPayload).length > 0 ||
      Object.keys(orderPayload).length > 0
    ) {
      suggestion = {
        suggestion: {
          tasks: [
            {
              ...taskPayload,
              id: id,
            },
          ],
          order: orderPayload,
        },
      };
    }
  }

  const metadata = [];

  if (Object.keys(report.failureReasonMetadataToSend).length > 0) {
    for (const key in report.failureReasonMetadataToSend) {
      metadata.push({
        [key]: report.failureReasonMetadataToSend[key],
      });
    }
  }

  if (suggestion) {
    metadata.push(suggestion);
  }

  return metadata;
};

export const buildReportIncidentPayload = (
  report: FormState,
  formValues?: EditFormValues,
  formTouchedFields?: FormikTouched<EditFormValues>,
) => {
  const metadata = buildMetadataPayload(report, formValues, formTouchedFields);
  const payload: IncidentPayload = {
    description: report.notes,
    failureReasonCode: report.failureReason,
    task: report.taskID,
  };

  if (metadata.length > 0) payload.metadata = metadata;

  return payload;
};
