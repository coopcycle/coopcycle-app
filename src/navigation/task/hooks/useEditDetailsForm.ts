import { useMemo } from 'react';
import { Task } from '@/src/types/task';
import { useValidation } from '@/src/navigation/task/hooks/useValidation';
import { getInitialFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import {
  useGetStoreQuery,
  useGetTaskDeliveryFormDataQuery,
} from '@/src/redux/api/slice';

export const useEditDetailsForm = (task: Task) => {
  const { data: initialDeliveryFormData } = useGetTaskDeliveryFormDataQuery(task.id, {skip: !task.id});

  const { data: store } = useGetStoreQuery(task?.metadata?.store, {
    skip: !task?.metadata?.store,
  });

  // Handlers
  // don't validate address while reporting an incident, maybe we should
  const validAddress = true;
  const validate = useValidation(validAddress, store);

  const initialValues = useMemo(() => {
    if (!initialDeliveryFormData) {
      return undefined;
    }

    return getInitialFormValues(task, initialDeliveryFormData);
  }, [task, initialDeliveryFormData]);

  return {
    store,
    initialValues,
    validate,
  };
};
