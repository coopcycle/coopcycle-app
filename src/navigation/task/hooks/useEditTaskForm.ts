import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task } from '@/src/types/task';
import { selectAddresses, selectAssertDeliveryError } from '@/src/redux/Delivery/selectors';
import { useFormUtils } from '@/src/navigation/task/hooks/useFormUtils';
import { useValidation } from '@/src/navigation/task/hooks/useValidation';
import { useStore } from '@/src/navigation/task/hooks/useStore';
import { useSupplements } from './useSupplements';
import { useReportFormContext } from '../contexts/ReportFormContext';
import { useTimeSlot } from './useTimeslots';
import { usePackages } from './usePackages';
import { getAutocompleteProps, getInitialFormValues } from '@/src/navigation/task/utils/taskFormHelpers';

export const useEditTaskForm = (task: Task) => {
  const { formState, updateFormField } = useReportFormContext();

  const [validAddress, setValidAddress] = useState(!!formState.address);
  const [address, setAddress] = useState(formState.address);
  const [packages, setPackages] = useState(formState.packages);
  const [selectedSupplements, setSelectedSupplements] = useState(formState.selectedSupplements);
  const [packagesChanged, setPackagesChanged] = useState(false);

  const store = useStore(task);
  const timeSlots = useTimeSlot(store);
  const hasTimeSlot = Array.isArray(timeSlots) && timeSlots.length > 0;
  const { storePackages } = usePackages(task, store);
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
    if (JSON.stringify(packages) !== JSON.stringify(formState.packages)) {
      updateFormField('packages', packages);
    }
  }, [packages, formState, updateFormField]);

  useEffect(() => {
    if (JSON.stringify(selectedSupplements) !== JSON.stringify(formState.selectedSupplements)) {
      updateFormField('selectedSupplements', selectedSupplements);
    }
  }, [selectedSupplements, formState, updateFormField]);

  useEffect(() => {
    if (storePackages && storePackages.length > 0 && !packagesChanged) {
      setPackages(storePackages);
    }
  }, [storePackages, packagesChanged]);

  // Handlers

  const handleIncrement = useCallback((packageName: string) => {
    const updatedPkg = packages.map(pkg =>
      pkg.name === packageName ? { ...pkg, quantity: pkg.quantity + 1 } : pkg,
    );
    setPackages(updatedPkg);
    setPackagesChanged(true);
    updateFormField('packages', updatedPkg);
  }, [packages, updateFormField]);

  const handleDecrement = useCallback((packageName: string) => {
    const updatedPkg = packages.map(pkg =>
      pkg.name === packageName ? { ...pkg, quantity: pkg.quantity - 1 } : pkg,
    );
    setPackages(updatedPkg);
    setPackagesChanged(true);
    updateFormField('packages', updatedPkg);
  }, [packages, updateFormField]);

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

  const validate = useValidation(validAddress, packages, store, country);

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
    packages,
    selectedSupplements,
    setValidAddress,
    setAddress,
    setPackages,
    packagesChanged,
    setSelectedSupplements,

    store,
    timeSlots,
    hasTimeSlot,
    availableSupplements,
    addresses,
    deliveryError,
    t,
    country,

    handleIncrement,
    handleDecrement,
    handleSelectAddress,
    createHandleChange,
    handleChangeTelephone,
    setAddressData,

    validate,
    autocompleteProps,
    initialValues
  };
};
