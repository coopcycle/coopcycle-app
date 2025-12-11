import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task } from '@/src/types/task';
import {
  selectAddresses,
  selectAssertDeliveryError,
} from '@/src/redux/Delivery/selectors';
import { useFormUtils } from '@/src/navigation/task/hooks/useFormUtils';
import { useReportFormContext } from '../contexts/ReportFormContext';
import { getAutocompleteProps } from '@/src/navigation/task/utils/taskFormHelpers';
import { useGetStoreQuery } from '@/src/redux/api/slice';

export const useEditTaskFields = (task: Task) => {
  const { formState, updateFormField } = useReportFormContext();

  const [validAddress, setValidAddress] = useState(!!formState.address);
  const [address, setAddress] = useState(formState.address);

  const { data: store } = useGetStoreQuery(task?.metadata?.store, {
    skip: !task?.metadata?.store,
  });

  const addresses = useSelector(selectAddresses);
  const deliveryError = useSelector(selectAssertDeliveryError);
  const { country, setAddressData, handleChangeTelephone } =
    useFormUtils(store);

  useEffect(() => {
    if (address !== formState.address) {
      updateFormField('address', address);
    }
  }, [address, formState, updateFormField]);

  // Handlers

  const handleSelectAddress = useCallback(
    (addr, setFieldValue) => {
      if (addr['@id']) {
        setAddressData(addr, setFieldValue);
      } else {
        setAddress(addr);
      }
      setValidAddress(!!addr.streetAddress);
    },
    [setAddressData],
  );

  const createHandleChange = useCallback(
    (formikHandleChange, fieldName) => {
      return value => {
        formikHandleChange(fieldName)(value);
        updateFormField(fieldName, value);
      };
    },
    [updateFormField],
  );

  const autocompleteProps = useMemo(
    () => getAutocompleteProps(deliveryError),
    [deliveryError],
  );

  return {
    validAddress,
    address,

    setValidAddress,
    setAddress,

    store,
    addresses,
    deliveryError,
    country,

    handleSelectAddress,
    createHandleChange,
    handleChangeTelephone,
    setAddressData,

    autocompleteProps,

    updateFormField,
  };
};
