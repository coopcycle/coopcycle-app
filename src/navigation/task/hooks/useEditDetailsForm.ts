import { useMemo } from 'react';
import { Task } from '@/src/types/task';
import { EditFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import {
  useGetStoreQuery,
  useGetTaskDeliveryFormDataQuery,
} from '@/src/redux/api/slice';

export const useEditDetailsForm = (task: Task) => {
  const {
    data: initialDeliveryFormData,
    isLoading: initialDeliveryFormDataIsLoading,
    isError: initialDeliveryFormDataIsError,
  } = useGetTaskDeliveryFormDataQuery(task.id, { skip: !task.id });

  const { data: store } = useGetStoreQuery(task?.metadata?.store, {
    skip: !task?.metadata?.store,
  });

  const initialValues = useMemo(() => {
    if (!initialDeliveryFormData) {
      return undefined;
    }

    const initialTaskData = initialDeliveryFormData.tasks?.find(
      t => t.id === task.id,
    );

    //FIXME: get more data from 'initialTaskData' instead of 'task' object
    // for example, weight and packages must be coming from 'initialTaskData' as in 'task' we can get a sum of all packages/weight belonging to other tasks

    return {
      // Task-level fields
      address: {
        streetAddress: task.address?.streetAddress || '',
        geo: task.address?.geo || null,
      },
      businessName: task.address?.name || '',
      contactName: task.address?.contactName || '',
      telephone: task.address?.telephone || '',
      description: task.address?.description || '',
      isValidAddress: true,
      //FIXME: pre-fill the time slot from the task (we don't store selected timeSlot on the task yet)
      // timeSlotUrl: task?.timeSlotUrl || undefined,
      timeSlotUrl: undefined,
      // timeSlot: task?.timeSlot || undefined,
      timeSlot: undefined,
      before: task.before || '',
      after: task.after || '',
      weight: initialTaskData?.weight
        ? `${initialTaskData.weight / 1000}`
        : '0',
      packages: undefined,
      // Order-level fields
      manualSupplements: initialDeliveryFormData.order?.manualSupplements ?? [],
    } as EditFormValues;
  }, [task, initialDeliveryFormData]);

  return {
    store,
    initialValues,
    initialValuesLoading: initialDeliveryFormDataIsLoading,
    initialValuesError: initialDeliveryFormDataIsError,
  };
};
