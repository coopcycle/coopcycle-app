import React, { useMemo } from 'react';
import { Task } from '@/src/types/task';
import { StyleSheet, View } from 'react-native';
import { useFormikContext } from 'formik';
import { Text } from '@/components/ui/text';
import { EditTimeRange } from '@/src/navigation/task/components/EditTimeRange';
import { useGetStoreTimeSlotsQuery } from '@/src/redux/api/slice';
import { PackagesInput } from '@/src/navigation/delivery/components/PackagesInput';
import { usePackages } from '@/src/navigation/task/hooks/usePackages';
import { WeightInput } from '@/src/navigation/delivery/components/WeightInput';
import { useTranslation } from 'react-i18next';
import { useEditTaskFields } from '@/src/navigation/task/hooks/useEditTaskFields';
import { ClientSearchSection } from '@/src/navigation/task/components/ClientSearchSection';
import { AddressSection } from '@/src/navigation/task/components/AddressSection';
import { FormField } from '@/src/navigation/task/components/FormField';
import FormInput from '@/src/navigation/delivery/components/FormInput';
import { EditTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';

interface TaskFormProps {
  task: Task;
}

export const EditTaskFields: React.FC<TaskFormProps> = ({ task }) => {
  const { t } = useTranslation();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
  } = useFormikContext<EditTaskFormValues>();

  const {
    store,
    validAddress,
    setValidAddress,
    address,
    setAddress,

    addresses,

    handleSelectAddress,
    createHandleChange,
    handleChangeTelephone,

    autocompleteProps,

    updateFormField,
  } = useEditTaskFields(task);

  const { data: timeSlots } = useGetStoreTimeSlotsQuery(store?.['@id'], {
    skip: !store?.['@id'],
  });

  const hasTimeSlot = useMemo(() => {
    return timeSlots && timeSlots.length > 0;
  }, [timeSlots]);

  const { storePackages, packagesWithQuantity, canEditPackages } = usePackages(
    task,
    store,
  );

  return (
    <>
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
            setFieldValue('contactName', selectedAddress.contactName);
          }
          if (selectedAddress.telephone) {
            setFieldValue('telephone', selectedAddress.telephone);
          }
          if (selectedAddress.name) {
            setFieldValue('businessName', selectedAddress.name);
          }
          if (selectedAddress.description) {
            setFieldValue('description', selectedAddress.description);
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
          onChangeText={createHandleChange(handleChange, 'businessName')}
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
          onChangeText={createHandleChange(handleChange, 'contactName')}
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
            handleChangeTelephone(value, setFieldValue, setFieldTouched);
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
          onChangeText={createHandleChange(handleChange, 'description')}
          onBlur={handleBlur('description')}
          value={values.description}
          placeholder={t('STORE_NEW_DELIVERY_ENTER_ADDRESS_DESCRIPTION')}
          testID="edit-task-address-description-input"
        />
      </FormField>
      {/* Packages and Timeslot Section */}
      <Text style={styles.sectionTitle}>
        {t('STORE_NEW_DELIVERY_PACKAGES_TITLE')}
      </Text>
      {/* Time range (after/before or timeslot) */}
      <View style={styles.timeSlot}>
        {timeSlots && hasTimeSlot ? (
          <EditTimeRange hasTimeSlot={hasTimeSlot} timeSlots={timeSlots} />
        ) : null}
      </View>
      {/* Weight */}
      <FormField
        label={t('STORE_NEW_DELIVERY_WEIGHT')}
        error={errors.weight}
        touched={touched.weight}>
        <WeightInput />
      </FormField>
      {/* Packages */}
      {storePackages && storePackages.length > 0 && packagesWithQuantity ? (
        <FormField
          label={t('STORE_NEW_DELIVERY_PACKAGES')}
          error={errors.packages}>
          <View style={styles.packagesContainer}>
            <PackagesInput
              packages={storePackages}
              initialPackagesCount={packagesWithQuantity}
              disabled={!canEditPackages}
            />
          </View>
        </FormField>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#262627',
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
