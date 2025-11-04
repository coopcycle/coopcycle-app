import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Task } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { FormControl } from '@/components/ui/form-control';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SubmitButton } from './components/SubmitButton';
import { EditSupplements } from './components/EditSupplements';
import { useSelector } from 'react-redux';
import {
  selectAddresses,
  selectAssertDeliveryError,
  selectHasTimeSlot,
  selectPackages,
  selectTimeSlotChoices,
  selectTimeSlots,
} from '@/src/redux/Delivery/selectors';
import ClientListInput from '../delivery/components/ClientListInput';
import TimeSlotSelector from '../delivery/components/TimeSlotSelector';
import { Formik } from 'formik';
import FormInput from '../delivery/components/FormInput';
import { DateTimePicker } from '../delivery/components/DateTimePicker';

// Hooks
import { useAddress } from '@/src/navigation/task/hooks/useAddress';
import { usePackages } from '@/src/navigation/task/hooks/usePackages';
import { useStore } from '@/src/navigation/task/hooks/useStore';
import { useFormUtils } from '@/src/navigation/task/hooks/useFormUtils';
import { useValidation } from '@/src/navigation/task/hooks/useValidation';

// Components
import { AddressSection } from './components/AddressSection';
import { PackageItem } from './components/PackageItem';
import { FormField } from './components/FormField';

// Utils
import { getAutocompleteProps, getInitialFormValues, handleFormSubmit } from '@/src/navigation/task/utils/taskFormHelpers';

import { Text } from '@/components/ui/text';

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  isLoading?: boolean;
}

export const EditTask: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  // State management
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  
  // Custom hooks
  const { validAddress, setValidAddress, address, setAddress } = useAddress(task);
  const { packagesCount, setPackagesCount } = usePackages(task);
  const store = useStore(task);
  
  // Redux selectors
  const addresses = useSelector(selectAddresses);
  const timeSlotChoices = useSelector(selectTimeSlotChoices);
  const timeSlots = useSelector(selectTimeSlots);
  const hasTimeSlot = useSelector(selectHasTimeSlot);
  const deliveryError = useSelector(selectAssertDeliveryError);
  const reduxPackages = useSelector(selectPackages);
  
  // Form utilities
  const { 
    t, 
    country, 
    setAddressData, 
    onSelectAddress, 
    handleChangeTelephone, 
    handleChangeWeight 
  } = useFormUtils(store);

  // Inicializar timeslot desde la task
  useEffect(() => {
    if (task?.timeSlot) {
      setSelectedTimeSlot(task.timeSlot);
    }
  }, [task?.timeSlot]);

  // Validation
  const validate = useValidation(
    validAddress,
    hasTimeSlot,
    selectedChoice,
    packagesCount,
    store,
    country
  );

  // Memoized values
  const autocompleteProps = useMemo(() => 
    getAutocompleteProps(deliveryError),
    [deliveryError]
  );

  const initialValues = useMemo(
    () => getInitialFormValues(task, hasTimeSlot),
    [task, hasTimeSlot]
  );

  // Package management
  const incrementQuantity = useCallback((type: string, setFieldTouched: any) => {
    setPackagesCount(prev =>
      prev.map(item =>
        item.type === type ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
    setFieldTouched('packages', true);
  }, [setPackagesCount]);

  const decrementQuantity = useCallback((type: string, setFieldTouched: any) => {
    setPackagesCount(prev =>
      prev.map(item =>
        item.type === type && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
    setFieldTouched('packages', true);
  }, [setPackagesCount]);

  // Form submission
  const handleSubmit = useCallback(
    (values: any) => {
      handleFormSubmit(
        values,
        address,
        store,
        packagesCount,
        selectedTimeSlot,
        selectedChoice,
        country,
        task, // Pasar toda la task para preservar datos
        onSubmit
      );
    },
    [address, store, packagesCount, selectedTimeSlot, selectedChoice, country, task, onSubmit],
  );

  // Package item renderer
  const renderPackageItem = useCallback(
    (item: any, setFieldTouched: any) => (
      <PackageItem
        item={item}
        onIncrement={() => incrementQuantity(item.type, setFieldTouched)}
        onDecrement={() => decrementQuantity(item.type, setFieldTouched)}
      />
    ),
    [incrementQuantity, decrementQuantity],
  );

  // Debug: mostrar datos cargados (puedes remover esto después)
  useEffect(() => {
    console.log('Task data loaded:', {
      task,
      address,
      packagesCount,
      store,
      initialValues
    });
  }, [task, address, packagesCount, store, initialValues]);

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
      }) => (
        <ScrollView style={styles.container}>
          <VStack space={4} style={styles.content}>
            <FormControl style={styles.formControl}>
              {/* Client Search */}
              <View style={[styles.formGroup, { zIndex: 2 }]}>
                <FormField
                  label={t('STORE_NEW_DELIVERY_SEARCH_CLIENT')}
                  optional
                  error={errors.searchClient}
                  touched={touched.searchClient}>
                  <View style={styles.autocompleteWrapper}>
                    <ClientListInput
                      onSelectAddress={a => {
                        setAddressData(a, setFieldValue);
                        setValidAddress(true);
                      }}
                      addresses={addresses}
                      placeholder={t('STORE_NEW_DELIVERY_ENTER_SEARCH_CLIENT')}
                      initialValue={task?.address ? {
                        contactName: task.address.contactName,
                        telephone: task.address.telephone,
                        name: task.address.name,
                        description: task.address.description,
                        streetAddress: task.address.streetAddress,
                        geo: task.address.geo,
                      } : null}
                    />
                  </View>
                </FormField>
              </View>

              {/* Address Section */}
              <AddressSection
                address={address}
                validAddress={validAddress}
                autocompleteProps={autocompleteProps}
                onSelectAddress={onSelectAddress}
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
                  onChangeText={handleChange('businessName')}
                  onBlur={handleBlur('businessName')}
                  value={values.businessName}
                  placeholder={t('STORE_NEW_DELIVERY_ENTER_BUSINESS_NAME')}
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
                  onChangeText={handleChange('contactName')}
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
                  onChangeText={value =>
                    handleChangeTelephone(value, setFieldValue, setFieldTouched)
                  }
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
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                  placeholder={t('STORE_NEW_DELIVERY_ENTER_ADDRESS_DESCRIPTION')}
                />
              </FormField>

              {/* Comments */}
              <FormField
                label={t('COMMENTS')}
                optional
                error={errors.comments}
                touched={touched.comments}>
                <FormInput
                  style={styles.textArea}
                  autoCorrect={false}
                  multiline={true}
                  onChangeText={handleChange('comments')}
                  onBlur={handleBlur('comments')}
                  value={values.comments}
                  placeholder={t('ENTER_COMMENTS')}
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
                  onChangeText={value =>
                    handleChangeWeight(value, setFieldValue, setFieldTouched)
                  }
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
              <EditSupplements task={task} />
            </FormControl>
          </VStack>

          <SubmitButton
            onPress={formikSubmit}
            task={task}
            tasks={[]}
            notes={[]}
            contactName={values.contactName}
            success={false}
            validateTaskAfterReport={false}
            failureReason={''}
            failureReasonMetadataToSend={[]}
          />
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#262627',
  },
  autocompleteWrapper: {
    height: 40,
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
});