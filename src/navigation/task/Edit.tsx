import React, { useCallback } from 'react';
import { Task } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { FormControl } from '@/components/ui/form-control';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SubmitButton } from './components/SubmitButton';
import { SupplementSelector as EditSupplements } from './components/EditSupplements';
import { Formik } from 'formik';
import FormInput from '../delivery/components/FormInput';
import { AddressSection } from './components/AddressSection';
import { PackageItem } from './components/PackageItem';
import { FormField } from './components/FormField';
import { Text } from '@/components/ui/text';
import { ClientSearchSection } from './components/ClientSearchSection';
import { useReportFormContext } from './contexts/ReportFormContext';
import { useEditTaskForm } from './hooks/useEditTaskForm';
import { EditTimeRange } from '@/src/navigation/task/components/EditTimeRange';

interface TaskFormProps {
  task?: Partial<Task>;
  currentTab: string;
}

export const EditTask: React.FC<TaskFormProps> = ({ task, currentTab }) => {
    const {
    validAddress,
    setValidAddress,
    address,
    packages,
    setAddress,
    setSelectedSupplements,

    timeSlots,
    hasTimeSlot,
    availableSupplements,
    addresses,
    t,

    handleIncrement,
    handleDecrement,
    handleSelectAddress,
    createHandleChange,
    handleChangeTelephone,

    validate,
    autocompleteProps,
    initialValues
  } = useEditTaskForm(task);

  const { updateFormField } = useReportFormContext();

  const renderPackageItem = useCallback(
    (item, index, setFieldTouched) => (
      <PackageItem
        task={task}
        key={`${item.name}-${index}`}
        item={item}
        onIncrement={() => handleIncrement(item.name)}
        onDecrement={() => handleDecrement(item.name)}
      />
    ),
    [task, handleIncrement, handleDecrement],
  );

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={()=>{}}
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
              testID="scrollView:edit"
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
                      testID="edit-task-business-name-input"
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
                      testID="task_dropoff_contact_name"
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
                      testID="task_dropoff_phone"
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
                      testID="edit-task-address-description-input"
                    />
                  </FormField>
                  {/* Packages and Timeslot Section */}
                  <Text style={styles.sectionTitle}>
                    {t('STORE_NEW_DELIVERY_PACKAGES_TITLE')}
                  </Text>
                  {/* Time range (after/before or timeslot) */}
                  <View style={styles.timeSlot}>
                    <EditTimeRange
                      hasTimeSlot={hasTimeSlot}
                      timeSlots={timeSlots}
                    />
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
                      testID={'task-weight-input'}
                    />
                  </FormField>
                  {/* Packages */}
                  {packages.length > 0 && (
                    <FormField
                      label={t('STORE_NEW_DELIVERY_PACKAGES')}
                      error={errors.packages}>
                      <View style={styles.packagesContainer}>
                        {packages &&
                          packages.map(item =>
                            renderPackageItem(item, setFieldTouched),
                          )}
                      </View>
                    </FormField>
                  )}
                  {/* Supplements */}
                  {availableSupplements && availableSupplements.length > 0 && (
                    <>
                      <Text style={styles.sectionTitle}>
                        {t('SUPPLEMENTS')}
                      </Text>
                      <EditSupplements
                        availableSupplements={availableSupplements}
                        onSupplementsChange={updatedSupplements => {
                          setSelectedSupplements(updatedSupplements);
                        }}
                      />
                    </>
                  )}
                  <View style={{ marginBottom: 44, marginHorizontal: -12 }}>
                    <SubmitButton
                      task={task}
                      tasks={[]}
                      notes={''}
                      contactName={values.contactName}
                      success={false}
                      currentTab={currentTab}
                      formValues={values}
                      formTouchedFields={touched}
                      onPress={formikSubmit}
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
