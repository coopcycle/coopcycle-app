import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Task } from '@/src/types/task';
import { selectAssertDeliveryError } from '@/src/redux/Delivery/selectors';
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

  const deliveryError = useSelector(selectAssertDeliveryError);

  // Handlers

  //TODO: fix validAddress
  const validate = useValidation(undefined, store);
  // const validate = useValidation(validAddress, store);

  const initialValues = useMemo(() => {
    if (!initialDeliveryFormData) {
      return undefined;
    }

    return getInitialFormValues(task, initialDeliveryFormData);
  }, [task, initialDeliveryFormData]);

  return {
    store,
    deliveryError,

    validate,
    initialValues
  };
};
