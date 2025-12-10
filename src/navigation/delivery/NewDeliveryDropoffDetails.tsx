import { Formik } from 'formik';
import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { IconPackage } from '@tabler/icons-react-native';
import {
  selectHasTimeSlot,
  selectStore,
  selectTimeSlots,
} from '../../redux/Delivery/selectors';
import {
  useBackgroundContainerColor,
  usePrimaryColor,
} from '../../styles/theme';
import FormInput from './components/FormInput';
import TimeSlotPicker from './components/TimeSlotPicker';
import ModalFormWrapper from './ModalFormWrapper';
import { DateTimePicker } from './components/DateTimePicker';
import { useDeliveryDataLoader } from './hooks/useDeliveryDataLoader';
import {
  NewDeliveryDropoffAddressFormValues,
  NewDeliveryDropoffFormValues,
  getInitialValues,
  validateDeliveryForm,
} from './utils.tsx';
import { Uri } from '@/src/redux/api/types';
import {
  CreatePickupOrDropoffTaskPayload,
} from '@/src/types/task';
import { useGetStorePackagesQuery } from '@/src/redux/api/slice';
import { PackagesInput } from '@/src/navigation/delivery/components/PackagesInput';
import { WeightInput } from '@/src/navigation/delivery/components/WeightInput';

type PostDeliveryBody = {
  store: Uri,
  pickup: CreatePickupOrDropoffTaskPayload;
  dropoff: CreatePickupOrDropoffTaskPayload;
}

function NewDeliveryDropoffDetails({ navigation, route }) {
  const backgroundColor = useBackgroundContainerColor();
  const primaryColor = usePrimaryColor();
  const { t } = useTranslation();

  const store = useSelector(selectStore);
  const timeSlots = useSelector(selectTimeSlots);
  const hasTimeSlot = useSelector(selectHasTimeSlot);

  useDeliveryDataLoader(store);

  const { data: packages } = useGetStorePackagesQuery(store['@id'], {
    skip: !store['@id']
  });

  function submit(values: NewDeliveryDropoffFormValues) {
    const delivery: PostDeliveryBody = {
      store: store['@id'],
      pickup: route.params?.pickup || undefined,
      dropoff: {
        address: {
          ...values.address,
          telephone: values.telephone,
          contactName: values.contactName,
          name: values.businessName.trim() || null,
          description: values.description.trim() || null,
        },
        comments: values.comments,
        weight: values.weight ? Number(values.weight) * 1000 : undefined,
        packages: values.packages?.filter(item => item.quantity > 0),
        ...(hasTimeSlot
          ? {
              timeSlotUrl: values.timeSlotUrl,
              timeSlot: values.timeSlot,
            }
          : { before: values.before }),
      },
    };
    navigation.navigate('NewDeliveryPrice', { delivery });
  }

  function validate(values: NewDeliveryDropoffFormValues) {
    return validateDeliveryForm(
      values,
      hasTimeSlot,
      store,
      t,
    );
  }

  const dropoff = route.params?.dropoff as NewDeliveryDropoffAddressFormValues;
  const initialValues = getInitialValues(dropoff, store);

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={submit}
      validateOnBlur={false}
      validateOnChange={false}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <ModalFormWrapper handleSubmit={handleSubmit} t={t}>
          <View style={[styles.formGroup, { zIndex: 2 }]}>
            <View style={[styles.header, styles.label]}>
              <IconPackage
                size={24}
                stroke={primaryColor}
                color={backgroundColor}
              />
              <Text>{t('STORE_NEW_DELIVERY_PACKAGES_TITLE')}</Text>
            </View>
            <Text style={styles.optional}>
              {t('STORE_NEW_DELIVERY_PACKAGES_DESCRIPTION')}
            </Text>
          </View>
          {(hasTimeSlot) ? (
            <TimeSlotPicker
              timeSlots={timeSlots}
            />
          ) : (
            <DateTimePicker/>
          )}

          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_WEIGHT')}{' '}
              {!store.weightRequired ? (
                <Text style={styles.optional}>({t('OPTIONAL')})</Text>
              ) : null}
            </Text>
            <WeightInput />
          </View>

          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_PACKAGES')}{' '}
              {!store.packagesRequired ? (
                <Text style={styles.optional}>({t('OPTIONAL')})</Text>
              ) : null}
            </Text>
            <PackagesInput packages={packages} />
          </View>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_COMMENTS')}{' '}
              <Text style={styles.optional}>({t('OPTIONAL')})</Text>
            </Text>
            <FormInput
              style={{
                height: 80,
              }}
              autoCorrect={false}
              multiline={true}
              onChangeText={handleChange('comments')}
              onBlur={handleBlur('comments')}
              placeholder={t('STORE_NEW_DELIVERY_ENTER_COMMENTS')}
            />
          </View>
        </ModalFormWrapper>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 10,
  },
  errorText: {
    paddingVertical: 5,
    color: '#FF4136',
  },
  optional: {
    fontWeight: '400',
    opacity: 0.7,
    fontSize: 12,
  },
});

export default NewDeliveryDropoffDetails;
