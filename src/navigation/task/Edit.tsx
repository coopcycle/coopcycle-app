import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Task } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { FormControl } from '@/components/ui/form-control';
import {
  Platform,
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
  selectHasTimeSlot,
  selectPackages as selectReduxPackages,
  selectTimeSlotChoices,
  selectTimeSlots,
} from '@/src/redux/Delivery/selectors';
import ClientListInput from '../delivery/components/ClientListInput';
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
  handleFormSubmit,
} from '@/src/navigation/task/utils/taskFormHelpers';
import { Text } from '@/components/ui/text';
import { useStore } from '@/src/navigation/task/hooks/useStore';
import { useSupplements } from './hooks/useSupplements';

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  isLoading?: boolean;
}

const getInitialFormValues = (
  task?: Partial<Task>,
  store?,
  hasTimeSlot?: boolean,
) => {
  const businessName =
    task?.orgName || store?.name || task?.address?.name || '';

  return {
    telephone: task?.address?.telephone || '',
    contactName: task?.address?.contactName || '',
    businessName: businessName,
    description: task?.address?.description || '',
    address: task?.address?.streetAddress || '',
    weight: task?.weight ? task.weight.toString() : '0',
    timeSlot: task?.timeSlot || null,
    timeSlotUrl: task?.timeSlotUrl || null,
    before: task?.before || '',
    after: task?.after || '',
    doorstep: task?.doorstep || false,
    storeName: businessName,
  };
};

export const EditTask: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    task?.timeSlot || '',
  );
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [validAddress, setValidAddress] = useState(
    !!task?.address?.streetAddress,
  );
  const [address, setAddress] = useState(task?.address || null);
  const [packagesCount, setPackagesCount] = useState<[]>([]);
  const [selectedSupplements, setSelectedSupplements] = useState([]);
  
  const store = useStore(task);
  const { supplements: availableSupplements } = useSupplements(store);

  const addresses = useSelector(selectAddresses);
  const timeSlotChoices = useSelector(selectTimeSlotChoices);
  const timeSlots = useSelector(selectTimeSlots);
  const hasTimeSlot = useSelector(selectHasTimeSlot);
  const deliveryError = useSelector(selectAssertDeliveryError);
  const reduxPackages = useSelector(selectReduxPackages);

  // const availableSupplements = [
  //   { id: '1', type: 'insurance', name: 'Seguro adicional', quantity: 0 },
  //   { id: '2', type: 'wrapping', name: 'Envoltura especial', quantity: 0 },
  //   { id: '3', type: 'priority', name: 'Entrega prioritaria', quantity: 0 },
  //   { id: '4', type: 'fragile', name: 'Manejo de frágil', quantity: 0 },
  // ];

  const {
    t,
    country,
    setAddressData,
    onSelectAddress,
    handleChangeTelephone,
    handleChangeWeight,
  } = useFormUtils(store);

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

  useEffect(() => {
    if (task?.timeSlot) {
      setSelectedTimeSlot(task.timeSlot);
    }
  }, [task?.timeSlot]);

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
    const values = getInitialFormValues(task, store, hasTimeSlot);
    return values;
  }, [task, store, hasTimeSlot]);

  // TODO: In future this might be uncommented to edit package quantities.
  // const incrementQuantity = useCallback(
  //   (type: string, setFieldTouched) => {
  //     setPackagesCount(prev => {
  //       const updated = prev.map(item =>
  //         item.type === type ? { ...item, quantity: item.quantity + 1 } : item,
  //       );
  //       return updated;
  //     });
  //     setFieldTouched('packages', true);
  //   },
  //   [],
  // );

  // const decrementQuantity = useCallback(
  //   (type: string, setFieldTouched) => {
  //     setPackagesCount(prev => {
  //       const updated = prev.map(item =>
  //         item.type === type && item.quantity > 0
  //           ? { ...item, quantity: item.quantity - 1 }
  //           : item,
  //       );
  //       return updated;
  //     });
  //     setFieldTouched('packages', true);
  //   },
  //   [],
  // );
  const triggerQuantity = useCallback(() => {
    return ToastAndroid.show(
      'To change this, go to report the corresponding dropoff',
      2500,
    );
  }, []);

  const handleSubmit = useCallback(
    values => {
      console.log('Submitting form with values:', values);
      console.log('Current address:', address);

      handleFormSubmit(
        values,
        address,
        store,
        packagesCount,
        selectedTimeSlot,
        selectedChoice,
        country,
        task,
        onSubmit,
      );
    },
    [
      address,
      store,
      packagesCount,
      selectedTimeSlot,
      selectedChoice,
      country,
      task,
      onSubmit,
    ],
  );

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
        console.log('Formik current values:', values);
        console.log('Formik errors:', errors);

        return (
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
                        onSelectAddress={selectedAddress => {
                          console.log(
                            'EditTask - Address selected from ClientList:',
                            selectedAddress,
                          );

                          if (selectedAddress.contactName) {
                            setFieldValue(
                              'contactName',
                              selectedAddress.contactName,
                            );
                          }
                          if (selectedAddress.telephone) {
                            setFieldValue(
                              'telephone',
                              selectedAddress.telephone,
                            );
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
                            setFieldValue(
                              'address',
                              selectedAddress.streetAddress,
                            );
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
                        addresses={addresses}
                        placeholder={t(
                          'STORE_NEW_DELIVERY_ENTER_SEARCH_CLIENT',
                        )}
                        initialValue={
                          task?.address
                            ? {
                                contactName: task.address.contactName,
                                telephone: task.address.telephone,
                                name: task.address.name,
                                description: task.address.description,
                                streetAddress: task.address.streetAddress,
                                geo: task.address.geo,
                              }
                            : null
                        }
                      />
                    </View>
                  </FormField>
                </View>

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
                    onChangeText={handleChange('businessName')}
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
                      handleChangeTelephone(
                        value,
                        setFieldValue,
                        setFieldTouched,
                      )
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
                <EditSupplements availableSupplements={availableSupplements}  onSupplementsChange={(updatedSupplements) => {
                  setSelectedSupplements(updatedSupplements);
                }}/>
              </FormControl>
            </VStack>

            <SubmitButton
              onPress={formikSubmit}
              task={task}
              tasks={[]}
              notes={""}
              contactName={values.contactName}
              success={false}
              validateTaskAfterReport={false}
              failureReason={''}
              failureReasonMetadataToSend={[]}
              formData={values}
              onSubmit={data => {
                handleSubmit(data);
              }}
            />
          </ScrollView>
        );
      }}
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
