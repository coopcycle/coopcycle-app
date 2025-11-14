import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Task } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { FormControl } from '@/components/ui/form-control';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import { SubmitButton } from './components/SubmitButton';
import { SupplementSelector as EditSupplements } from './components/EditSupplements';
import { useSelector } from 'react-redux';
import {
  selectAddresses,
  selectAssertDeliveryError,
  selectPackages as selectReduxPackages,
  selectTimeSlotChoices,
} from '@/src/redux/Delivery/selectors';
import TimeSlotSelector from '../delivery/components/TimeSlotSelector';
import { Formik } from 'formik';
import FormInput from '../delivery/components/FormInput';
import { DateTimePicker } from '../delivery/components/DateTimePicker';

import { useFormUtils } from '@/src/navigation/task/hooks/useFormUtils';
import { useValidation } from '@/src/navigation/task/hooks/useValidation';

import { AddressSection } from './components/AddressSection';
import { PackageItem } from './components/PackageItem';
import { FormField } from './components/FormField';
import {
  getAutocompleteProps,
  getInitialFormValues,
} from '@/src/navigation/task/utils/taskFormHelpers';
import { Text } from '@/components/ui/text';
import { useStore } from '@/src/navigation/task/hooks/useStore';
import { useSupplements } from './hooks/useSupplements';
import { ClientSearchSection } from './components/ClientSearchSection';
import { useReportFormContext } from './contexts/ReportFormContext';
import { useHandleSubmit } from './hooks/useSubmitHandler';
import { useTimeSlot, useTimeSlotChoices } from './hooks/useTimeslots';

interface TaskFormProps {
  task?: Partial<Task>;
  isLoading?: boolean;
}

export const EditTask: React.FC<TaskFormProps> = ({ task }) => {
  const { formState, updateFormField } = useReportFormContext();

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    formState.selectedTimeSlot,
  );
  const [selectedChoice, setSelectedChoice] = useState(
    formState.selectedChoice,
  );
  const [validAddress, setValidAddress] = useState(!!formState.address);
  const [address, setAddress] = useState(formState.address);
  const [packagesCount, setPackagesCount] = useState(formState.packagesCount);
  const [selectedSupplements, setSelectedSupplements] = useState(
    formState.selectedSupplements,
  );

  const store = useStore(task);
  // When Choice or TS is selected seems that choices reset to undefined
  const timeSlots = useTimeSlot(store);
  const hasTimeSlot = Array.isArray(timeSlots) && timeSlots.length > 0;
  const timeSlotChoices = useTimeSlotChoices(store);

  const { supplements: availableSupplements } = useSupplements(store);

  // Redux selectors
  const addresses = useSelector(selectAddresses);
  const deliveryError = useSelector(selectAssertDeliveryError);
  const reduxPackages = useSelector(selectReduxPackages);

  const { t, country, setAddressData, handleChangeTelephone } =
    useFormUtils(store);

  useEffect(() => {
    if (address !== formState.address) {
      updateFormField('address', address);
    }
  }, [address, formState, updateFormField]);

  useEffect(() => {
    if (
      JSON.stringify(packagesCount) !== JSON.stringify(formState.packagesCount)
    ) {
      updateFormField('packagesCount', packagesCount);
    }
  }, [packagesCount, formState, updateFormField]);

  useEffect(() => {
    if (selectedTimeSlot !== formState.selectedTimeSlot) {
      updateFormField('selectedTimeSlot', selectedTimeSlot);
    }
  }, [selectedTimeSlot, formState, updateFormField]);

  useEffect(() => {
    if (selectedChoice !== formState.selectedChoice) {
      updateFormField('selectedChoice', selectedChoice);
    }
  }, [selectedChoice, formState, updateFormField]);

  useEffect(() => {
    if (
      JSON.stringify(selectedSupplements) !==
      JSON.stringify(formState.selectedSupplements)
    ) {
      updateFormField('selectedSupplements', selectedSupplements);
    }
  }, [selectedSupplements, formState, updateFormField]);

  // Initialize packages from initial task.
  useEffect(() => {
    if (task?.packages && task.packages.length > 0) {
      const initialPackages = task.packages.map(pkg => ({
        type: pkg.type,
        quantity: pkg.quantity || 0,
        ...pkg,
      }));
      setPackagesCount(initialPackages);
    } else if (reduxPackages?.length) {
      const initialPackages = reduxPackages.map(pkg => ({
        type: pkg.name || pkg.type,
        quantity: 0,
      }));
      setPackagesCount(initialPackages);
    }
  }, [task?.packages, reduxPackages]);

  const handleTimeSlotChange = useCallback(
    (choice: string, timeSlot: string) => {
      setSelectedChoice(choice);
      setSelectedTimeSlot(timeSlot);
      updateFormField('selectedChoice', choice);
      updateFormField('selectedTimeSlot', timeSlot);
    },
    [updateFormField],
  );

  const validate = useValidation(
    validAddress,
    hasTimeSlot,
    selectedChoice,
    packagesCount,
    store,
    country,
  );

  const autocompleteProps = useMemo(
    () => getAutocompleteProps(deliveryError),
    [deliveryError],
  );

  const initialValues = useMemo(() => {
    return getInitialFormValues(task, store);
  }, [task, store]);

  const triggerQuantity = useCallback(() => {
    return ToastAndroid.show(
      'To change this, go to report the corresponding dropoff',
      2500,
    );
  }, []);

  const handleSubmit = useHandleSubmit(formState);

  const renderPackageItem = useCallback(
    (item, setFieldTouched) => (
      <PackageItem
        item={item}
        onIncrement={() => triggerQuantity()}
        onDecrement={() => triggerQuantity()}
      />
    ),
    [triggerQuantity],
  );

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

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
      validateOnBlur={true}
      validateOnChange={true}
      enableReinitialize>
      {({
        handleChange,
        handleBlur,
        handleSubmit: formikSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
      }) => {
        return (
          <SafeAreaView style={styles.wrapper}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={{ flexGrow: 1 }}>
              <VStack space={4} style={styles.content}>
                <FormControl style={styles.formControl}>
                  {/* Client Search */}
                  <ClientSearchSection
                    styles={styles}
                    t={t}
                    addresses={addresses}
                    task={task}
                    errors={errors}
                    touched={touched}
                    setAddress={setAddress}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    setValidAddress={setValidAddress}
                    onSelectAddress={selectedAddress => {
                      if (selectedAddress.contactName) {
                        setFieldValue(
                          'contactName',
                          selectedAddress.contactName,
                        );
                      }
                      if (selectedAddress.telephone) {
                        setFieldValue('telephone', selectedAddress.telephone);
                      }
                      if (selectedAddress.name) {
                        setFieldValue('businessName', selectedAddress.name);
                      }
                      if (selectedAddress.description) {
                        setFieldValue(
                          'description',
                          selectedAddress.description,
                        );
                      }
                      if (selectedAddress.streetAddress) {
                        setFieldValue('address', selectedAddress.streetAddress);
                      }

                      setAddress({
                        streetAddress: selectedAddress.streetAddress,
                        geo: selectedAddress.geo,
                        contactName: selectedAddress.contactName,
                        telephone: selectedAddress.telephone,
                        name: selectedAddress.name,
                        description: selectedAddress.description,
                      });

                      setFieldTouched('contactName', true);
                      setFieldTouched('telephone', true);
                      setFieldTouched('businessName', true);
                      setFieldTouched('description', true);

                      setValidAddress(true);
                    }}
                  />

                  {/* Address Section */}
                  <AddressSection
                    address={address}
                    validAddress={validAddress}
                    autocompleteProps={autocompleteProps}
                    onSelectAddress={handleSelectAddress}
                    task={task}
                    formProps={{
                      handleChange,
                      handleBlur,
                      errors,
                      touched,
                      setFieldValue,
                      setValidAddress,
                      setAddress,
                    }}
                  />

                  {/* Business Information */}
                  <FormField
                    label={t('STORE_NEW_DELIVERY_BUSINESS_NAME')}
                    optional
                    error={errors.businessName}
                    touched={touched.businessName}>
                    <FormInput
                      autoCorrect={false}
                      returnKeyType="done"
                      onChangeText={createHandleChange(
                        handleChange,
                        'businessName',
                      )}
                      onBlur={handleBlur('businessName')}
                      value={values.businessName}
                      placeholder={t('STORE_NEW_DELIVERY_ENTER_BUSINESS_NAME')}
                      editable={true}
                    />
                  </FormField>

                  {/* Contact Information */}
                  <FormField
                    label={t('STORE_NEW_DELIVERY_CONTACT_NAME')}
                    optional
                    error={errors.contactName}
                    touched={touched.contactName}>
                    <FormInput
                      autoCorrect={false}
                      returnKeyType="done"
                      onChangeText={createHandleChange(
                        handleChange,
                        'contactName',
                      )}
                      onBlur={handleBlur('contactName')}
                      value={values.contactName}
                      placeholder={t('STORE_NEW_DELIVERY_ENTER_CONTACT_NAME')}
                      testID="delivery__dropoff__contact_name"
                    />
                  </FormField>

                  {/* Telephone */}
                  <FormField
                    label={t('STORE_NEW_DELIVERY_PHONE_NUMBER')}
                    error={errors.telephone}
                    touched={touched.telephone}>
                    <FormInput
                      autoCorrect={false}
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      onChangeText={value => {
                        updateFormField('telephone', value);
                        handleChangeTelephone(
                          value,
                          setFieldValue,
                          setFieldTouched,
                        );
                      }}
                      onBlur={handleBlur('telephone')}
                      value={values.telephone}
                      placeholder={t('STORE_NEW_DELIVERY_ENTER_PHONE_NUMBER')}
                      testID="delivery__dropoff__phone"
                    />
                  </FormField>

                  {/* Address Description */}
                  <FormField
                    label={t('STORE_NEW_DELIVERY_ADDRESS_DESCRIPTION')}
                    optional
                    error={errors.description}
                    touched={touched.description}>
                    <FormInput
                      style={styles.textArea}
                      autoCorrect={false}
                      multiline={true}
                      onChangeText={createHandleChange(
                        handleChange,
                        'description',
                      )}
                      onBlur={handleBlur('description')}
                      value={values.description}
                      placeholder={t(
                        'STORE_NEW_DELIVERY_ENTER_ADDRESS_DESCRIPTION',
                      )}
                    />
                  </FormField>

                  {/* Packages and Timeslot Section */}
                  <Text style={styles.sectionTitle}>
                    {t('TIMESLOT_PACKAGE_FORM')}
                  </Text>

                  {/* Timeslot */}
                  <View style={styles.timeSlot}>
                    {hasTimeSlot ? (
                      <TimeSlotSelector
                        selectValue={selectedChoice}
                        setSelectValue={setSelectedChoice}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        updateSelectedTimeSlot={setSelectedTimeSlot}
                        timeSlots={timeSlots}
                        choices={timeSlotChoices}
                        selectedTimeSlot={selectedTimeSlot}
                        initialTimeSlot={task?.timeSlot}
                        onTimeSlotChange={handleTimeSlotChange}
                      />
                    ) : (
                      <DateTimePicker
                        initialValues={initialValues}
                        values={values}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        initialDate={task?.before}
                      />
                    )}
                  </View>

                  {/* Weight */}
                  <FormField
                    label={t('STORE_NEW_DELIVERY_WEIGHT')}
                    error={errors.weight}
                    touched={touched.weight}>
                    <FormInput
                      keyboardType="numeric"
                      rightElement={<Text style={styles.weightUnit}>kg</Text>}
                      autoCorrect={false}
                      returnKeyType="done"
                      onChangeText={value => {
                        const cleanedValue = value.replace(/[^0-9.]/g, '');
                        updateFormField('weight', cleanedValue);
                        setFieldValue('weight', cleanedValue);
                        setFieldTouched('weight', true);
                      }}
                      onBlur={handleBlur('weight')}
                      value={values.weight}
                      placeholder={t('STORE_NEW_DELIVERY_ENTER_WEIGHT')}
                    />
                  </FormField>

                  {/* Packages */}
                  <FormField
                    label={t('STORE_NEW_DELIVERY_PACKAGES')}
                    error={errors.packages}>
                    <View style={styles.packagesContainer}>
                      {packagesCount?.length ? (
                        packagesCount.map(item =>
                          renderPackageItem(item, setFieldTouched),
                        )
                      ) : (
                        <Text>{t('STORE_NEW_DELIVERY_NO_PACKAGES')}</Text>
                      )}
                    </View>
                  </FormField>

                  {/* Supplements */}
                  <Text style={styles.sectionTitle}>{t('SUPPLEMENTS')}</Text>
                  <EditSupplements
                    availableSupplements={availableSupplements}
                    onSupplementsChange={updatedSupplements => {
                      setSelectedSupplements(updatedSupplements);
                    }}
                  />
                  <View style={{ marginBottom: 44, marginHorizontal: -12 }}>
                    <SubmitButton
                      onPress={formikSubmit}
                      task={task}
                      tasks={[]}
                      notes={''}
                      contactName={values.contactName}
                      success={false}
                      formData={values}
                      onSubmit={data => {
                        handleSubmit(data);
                      }}
                    />
                  </View>
                </FormControl>
              </VStack>
            </ScrollView>
          </SafeAreaView>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  formControl: {
    width: '100%',
    paddingHorizontal: 8,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#262627',
  },
  autocompleteWrapper: {
    height: 24,
    ...Platform.select({
      android: {
        flex: 1,
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
      },
      ios: {
        top: 0,
        right: 0,
        left: 0,
        zIndex: 10,
        overflow: 'visible',
      },
    }),
  },
  formGroup: {
    marginBottom: 16,
  },
  weightUnit: {
    paddingHorizontal: 10,
  },
  timeSlot: {
    marginBottom: 16,
  },
  textArea: {
    height: 80,
  },
  packagesContainer: {
    gap: 16,
    marginTop: 4,
  },
  storeInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  storeInfoLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  storeInfoValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
});

export default EditTask;
