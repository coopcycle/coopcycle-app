import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task } from '@/src/types/task';
import { selectAddresses, selectAssertDeliveryError } from '@/src/redux/Delivery/selectors';
import { useFormUtils } from '@/src/navigation/task/hooks/useFormUtils';
import { useValidation } from '@/src/navigation/task/hooks/useValidation';
import { useSupplements } from './useSupplements';
import { useReportFormContext } from '../contexts/ReportFormContext';
import { usePackages } from './usePackages';
import { getAutocompleteProps, getInitialFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import {
  useGetStoreQuery,
} from '@/src/redux/api/slice';

export const useEditTaskForm = (task: Task) => {
  const { formState, updateFormField } = useReportFormContext();

  const [validAddress, setValidAddress] = useState(!!formState.address);
  const [address, setAddress] = useState(formState.address);
  const [selectedSupplements, setSelectedSupplements] = useState(formState.selectedSupplements);

  const { data: store } = useGetStoreQuery(task?.metadata?.store, {
    skip: !task?.metadata?.store,
  });

  const { storePackages, packagesWithQuantity } = usePackages(task, store);
  const { supplements: availableSupplements } = useSupplements(store);
  const addresses = useSelector(selectAddresses);
  const deliveryError = useSelector(selectAssertDeliveryError);
  const { t, country, setAddressData, handleChangeTelephone } = useFormUtils(store);

  useEffect(() => {
    if (address !== formState.address) {
      updateFormField('address', address);
    }
  }, [address, formState, updateFormField]);

  useEffect(() => {
    if (JSON.stringify(selectedSupplements) !== JSON.stringify(formState.selectedSupplements)) {
      updateFormField('selectedSupplements', selectedSupplements);
    }
  }, [selectedSupplements, formState, updateFormField]);

  // Handlers

  const handleSelectAddress = useCallback((addr, setFieldValue) => {
    if (addr['@id']) {
      setAddressData(addr, setFieldValue);
    } else {
      setAddress(addr);
    }
    setValidAddress(!!addr.streetAddress);
  }, [setAddressData]);

  const createHandleChange = useCallback((formikHandleChange, fieldName) => {
    return value => {
      formikHandleChange(fieldName)(value);
      updateFormField(fieldName, value);
    };
  }, [updateFormField]);

  const validate = useValidation(validAddress, store, country);

  const autocompleteProps = useMemo(() =>
    getAutocompleteProps(deliveryError),
    [deliveryError]
  );

  const initialValues = useMemo(() =>
    getInitialFormValues(task),
    [task]
  );

  return {
    validAddress,
    address,
    storePackages,
    packagesWithQuantity,

    selectedSupplements,
    setValidAddress,
    setAddress,

    setSelectedSupplements,

    store,
    availableSupplements,
    addresses,
    deliveryError,
    t,
    country,

    handleSelectAddress,
    createHandleChange,
    handleChangeTelephone,
    setAddressData,

    validate,
    autocompleteProps,
    initialValues
  };
};
