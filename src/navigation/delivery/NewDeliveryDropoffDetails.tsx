import { Formik } from 'formik';
import moment from 'moment';
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
  selectTimeSlotChoices,
  selectTimeSlots,
} from '../../redux/Delivery/selectors';
import {
  useBackgroundContainerColor,
  usePrimaryColor,
} from '../../styles/theme';
import Range from '../checkout/ProductDetails/Range';
import FormInput from './components/FormInput';
import TimeSlotSelector from './components/TimeSlotSelector';
import ModalFormWrapper from './ModalFormWrapper';
import { DateTimePicker } from './components/DateTimePicker';
import { useDeliveryTimeSlot } from './hooks/useDeliveryTimeSlot';
import { useTimeSlotChoice } from './hooks/useTimeSlotChoice';
import { useDeliveryDataLoader } from './hooks/useDeliveryDataLoader';
import { usePackagesCount } from './hooks/usePackagesCount';
import {
  getInitialValues,
  handleChangeWeight,
  validateDeliveryForm,
} from './utils.tsx';

function NewDeliveryDropoffDetails({ navigation, route }) {
  const backgroundColor = useBackgroundContainerColor();
  const primaryColor = usePrimaryColor();
  const { t } = useTranslation();

  const packages = useSelector(selectPackages);
  const store = useSelector(selectStore);
  const timeSlotChoices = useSelector(selectTimeSlotChoices);
  const timeSlots = useSelector(selectTimeSlots);
  const hasTimeSlot = useSelector(selectHasTimeSlot);

  const { selectedTimeSlot, updateSelectedTimeSlot } = useDeliveryTimeSlot(
    store,
    timeSlots,
  );
  const { selectedChoice, setSelectedChoice } =
    useTimeSlotChoice(timeSlotChoices);
  useDeliveryDataLoader(store);
  const { packagesCount, incrementQuantity, decrementQuantity } =
    usePackagesCount(packages);

  function submit(values) {
    const delivery = {
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
        ...(selectedChoice
          ? {
              timeSlotUrl: selectedTimeSlot,
              timeSlot: selectedChoice,
            }
          : { before: values.before }),
      },
    };
    navigation.navigate('NewDeliveryPrice', { delivery });
  }

  function validate(values) {
    return validateDeliveryForm(
      values,
      hasTimeSlot,
      selectedChoice,
      packagesCount,
      store,
      t,
    );
  }

  const dropoff = route.params?.dropoff;
  let initialValues = getInitialValues(dropoff, hasTimeSlot);

  if (hasTimeSlot) {
    initialValues = {
      ...initialValues,
      timeSlotUrl: null,
      timeSlot: null,
    };
  } else {
    initialValues = {
      ...initialValues,
      before: moment().add(1, 'hours').add(30, 'minutes').format(),
    };
  }

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
          {(hasTimeSlot && selectedChoice) ? (
            <TimeSlotSelector
              selectValue={selectedChoice}
              setSelectValue={setSelectedChoice}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              setSelectedTimeSlot={updateSelectedTimeSlot}
              timeSlots={timeSlots}
              choices={timeSlotChoices}
              selectedTimeSlot={selectedTimeSlot}
            />
          ) : (
            <DateTimePicker
              initialValues={initialValues}
              values={values}
              errors={errors}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
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
