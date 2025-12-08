import { Formik } from 'formik';
import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { IconPackage } from '@tabler/icons-react-native';
import {
  selectHasTimeSlot,
  selectPackages,
  selectStore,
  selectTimeSlots,
} from '../../redux/Delivery/selectors';
import {
  useBackgroundContainerColor,
  usePrimaryColor,
} from '../../styles/theme';
import Range from '../checkout/ProductDetails/Range';
import FormInput from './components/FormInput';
import TimeSlotPicker from './components/TimeSlotPicker';
import ModalFormWrapper from './ModalFormWrapper';
import { DateTimePicker } from './components/DateTimePicker';
import { useDeliveryDataLoader } from './hooks/useDeliveryDataLoader';
import { usePackagesCount } from './hooks/usePackagesCount';
import {
  NewDeliveryDropoffAddressFormValues,
  NewDeliveryDropoffFormValues,
  getInitialValues,
  handleChangeWeight,
  validateDeliveryForm,
} from './utils.tsx';
import { Uri } from '@/src/redux/api/types';
import {
  CreatePickupOrDropoffTaskPayload,
} from '@/src/types/task';

type PostDeliveryBody = {
  store: Uri,
  pickup: CreatePickupOrDropoffTaskPayload;
  dropoff: CreatePickupOrDropoffTaskPayload;
}

function NewDeliveryDropoffDetails({ navigation, route }) {
  const backgroundColor = useBackgroundContainerColor();
  const primaryColor = usePrimaryColor();
  const { t } = useTranslation();

  const packages = useSelector(selectPackages);
  const store = useSelector(selectStore);
  const timeSlots = useSelector(selectTimeSlots);
  const hasTimeSlot = useSelector(selectHasTimeSlot);

  useDeliveryDataLoader(store);
  const { packagesCount, incrementQuantity, decrementQuantity } =
    usePackagesCount(packages);

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
        weight: values.weight * 1000,
        packages: packagesCount.filter(item => item.quantity > 0),
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
      packagesCount,
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
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
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
            {errors.weight && touched.weight && (
              <Text style={styles.errorText}>{errors.weight}</Text>
            )}
          </View>

          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_PACKAGES')}{' '}
              {!store.packagesRequired ? (
                <Text style={styles.optional}>({t('OPTIONAL')})</Text>
              ) : null}
            </Text>
            <View
              style={{
                gap: 16,
                marginTop: 4,
              }}>
              {packages?.length ? (
                packagesCount.map(item => {
                  return (
                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          gap: 16,
                          backgroundColor,
                        },
                      ]}
                      key={item.type}>
                      <Range
                        onPress={() => {}}
                        onPressIncrement={() =>
                          incrementQuantity(item.type, setFieldTouched)
                        }
                        onPressDecrement={() =>
                          decrementQuantity(item.type, setFieldTouched)
                        }
                        quantity={item.quantity}
                      />
                      <TouchableOpacity
                        style={{
                          flex: 1,
                        }}
                        onPress={() =>
                          incrementQuantity(item.type, setFieldTouched)
                        }>
                        <Text>{item.type}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <Text>{t('STORE_NEW_DELIVERY_NO_PACKAGES')}</Text>
              )}
            </View>
            {errors.packages && (
              <Text note style={styles.errorText}>
                {errors.packages}
              </Text>
            )}
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
  weightUnit: {
    paddingHorizontal: 10,
  },
  optional: {
    fontWeight: '400',
    opacity: 0.7,
    fontSize: 12,
  },
});

export default NewDeliveryDropoffDetails;
