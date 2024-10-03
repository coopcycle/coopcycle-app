import { Formik } from 'formik';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import { Box, Button, HStack, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import {
  InteractionManager,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { connect, useDispatch } from 'react-redux';

import {
  createDelivery,
  loadPackages,
  loadTimeSlot,
  loadTimeSlotChoices,
  loadTimeSlots,
} from '../../redux/Store/actions';
import { selectStore, selectTimeSlots } from '../../redux/Store/selectors';
import {
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
} from '../../styles/theme';
import Range from '../checkout/ProductDetails/Range';
import ModalFormWrapper from './ModalFormWrapper';
import FormInput from './components/FormInput';
import TimeSlotSelector from './components/TimeSlotSelector';

function NewDelivery(props) {
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const backgroundColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();
  const [selectedChoice, setSelectedChoice] = React.useState(null);
  const [packagesCount, setPackagesCount] = useState([]);
  const dispatch = useDispatch();

  const {
    t,
    store,
    timeSlots,
    navigation,
    hasTimeSlot,
    route,
    country,
    choices,
    packages,
  } = props;

  useEffect(() => {
    if (selectedTimeSlot) return;
    if (store.timeSlot && store.timeSlot.trim() !== '') {
      setSelectedTimeSlot(store.timeSlot);
    } else if (timeSlots.length > 0) {
      setSelectedTimeSlot(timeSlots[0]['@id']);
    }
  }, [store.timeSlot, timeSlots, selectedTimeSlot]);

  useEffect(() => {
    if (!selectedTimeSlot || !timeSlots.length) return;
    dispatch(
      loadTimeSlotChoices(timeSlots.find(ts => ts['@id'] === selectedTimeSlot)),
    );
  }, [selectedTimeSlot, timeSlots, dispatch]);

  useEffect(() => {
    if (choices.length) setSelectedChoice(choices[0].value);
  }, [choices]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(loadTimeSlots(store));
      dispatch(loadTimeSlot(store));
      dispatch(loadPackages(store));
    });
    // This will add a "OK" button above keyboard, to dismiss keyboard
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableAutoToolbar(true);
    }

    return () => {
      if (Platform.OS === 'ios') {
        KeyboardManager.setEnable(false);
        KeyboardManager.setEnableAutoToolbar(false);
      }
    };
  }, [store, dispatch]);

  useEffect(() => {
    if (!packages) return;
    setPackagesCount(
      packages.map(item => {
        return {
          type: item.name,
          quantity: 0,
        };
      }),
    );
  }, [packages]);

  function incrementQuantity(packageType, setFieldTouched) {
    setFieldTouched('packages');
    setPackagesCount(prev => {
      return prev.map(item => {
        if (item.type === packageType) {
          item.quantity += 1;
        }
        return item;
      });
    });
  }

  function decrementQuantity(packageType, setFieldTouched) {
    setFieldTouched('packages');
    setPackagesCount(prev => {
      return prev.map(item => {
        if (item.type === packageType) {
          item.quantity -= 1;
        }
        return item;
      });
    });
  }

  function updateSelectedTimeSlot(timeSlot) {
    setSelectedTimeSlot(timeSlot['@id']);
  }

  function showDateTimePicker() {
    setIsDateTimePickerVisible(true);
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  function submit(values) {
    const delivery = {
      store: store['@id'],
      dropoff: {
        address: {
          ...values.address,
          telephone: values.telephone,
          contactName: values.contactName,
          name: values.businessName.trim() || null,
        },
        comments: values.comments,
        weight: values.weight * 1000,
        packages: packagesCount.filter(item => item.quantity > 0),
        ...(selectedChoice
          ? { timeSlot: selectedChoice }
          : { before: values.before }),
      },
    };

    dispatch(createDelivery(delivery, () => navigation.navigate('StoreHome')));
  }

  function validate(values) {
    let errors = {};

    if (hasTimeSlot && !selectedChoice) {
      errors.timeSlot = t('STORE_NEW_DELIVERY_ERROR.EMPTY_TIME_SLOT');
    }

    if (!values.weight && store.weightRequired) {
      errors.weight = t('STORE_NEW_DELIVERY_ERROR.EMPTY_WEIGHT');
    }

    if (!packagesCount.some(item => item.quantity) && store.packagesRequired) {
      errors.packages = t('STORE_NEW_DELIVERY_ERROR.EMPTY_PACKAGES');
    }
    return errors;
  }

  function renderDateTimePicker(
    initialValues,
    values,
    errors,
    setFieldValue,
    setFieldTouched,
  ) {
    return (
      <Box py="4">
        <HStack justifyContent="space-between">
          <VStack>
            <Text style={styles.label}>
              {t('STORE_NEW_DELIVERY_DROPOFF_BEFORE')}
            </Text>
            <Text>{moment(values.before).format('LLL')}</Text>
          </VStack>
          <Button onPress={showDateTimePicker}>{t('EDIT')}</Button>
        </HStack>
        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          mode="datetime"
          onConfirm={value => {
            setFieldValue('before', moment(value).format());
            setFieldTouched('before');
            hideDateTimePicker();
          }}
          onCancel={hideDateTimePicker}
          minimumDate={moment(initialValues.before).toDate()}
        />
      </Box>
    );
  }

  function handleChangeWeight(value, setFieldValue, setFieldTouched) {
    value = value.replace(',', '.').replace(/[^0-9.]/g, '');

    const firstDecimalIndex = value.indexOf('.');
    if (firstDecimalIndex === 0) {
      value = '0' + value;
    } else if (firstDecimalIndex !== -1) {
      value =
        value.substring(0, firstDecimalIndex + 1) +
        value.substring(firstDecimalIndex + 1).replace(/\./g, '');
    }

    if (value.includes('.')) {
      const decimalIndex = value.indexOf('.');
      value =
        value.substring(0, decimalIndex + 1) +
        value.substring(decimalIndex + 1, decimalIndex + 4);
    }

    setFieldValue('weight', value);
    setFieldTouched('weight');
  }

  const delivery = route.params?.delivery;

  let telephone = '';
  if (delivery.telephone) {
    const phoneNumber = parsePhoneNumberFromString(delivery.telephone, country);
    if (phoneNumber && phoneNumber.isValid()) {
      telephone = phoneNumber.formatNational();
    }
  }

  let initialValues = {
    address: delivery.address,
    comments: delivery.comments || '',
    contactName: delivery.contactName || '',
    businessName: delivery.businessName || '',
    weight: null,
    telephone,
  };

  if (hasTimeSlot) {
    initialValues = {
      ...initialValues,
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
        <ModalFormWrapper handleSubmit={handleSubmit} t={t} isSubmit>
          {hasTimeSlot ? (
            <TimeSlotSelector
              selectValue={selectedChoice}
              setSelectValue={setSelectedChoice}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              updateSelectedTimeSlot={updateSelectedTimeSlot}
              timeSlots={timeSlots}
              choices={choices}
              selectedTimeSlot={selectedTimeSlot}
            />
          ) : (
            renderDateTimePicker(
              initialValues,
              values,
              errors,
              setFieldValue,
              setFieldTouched,
            )
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
              <Text note style={styles.errorText}>
                {errors.weight}
              </Text>
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
              {packages && packages.length ? (
                packagesCount.map((item, index) => {
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
                      key={index}>
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
        </ModalFormWrapper>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
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

function mapStateToProps(state) {
  const timeSlotChoices = [];
  const timeSlots = selectTimeSlots(state);
  const choices = state.store.choices;
  const hasTimeSlot = timeSlots.length > 0;
  const packages = state.store.packages;

  return {
    country: state.app.settings.country.toUpperCase(),
    store: selectStore(state),
    timeSlotChoices,
    hasTimeSlot,
    timeSlots,
    choices,
    packages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // createDelivery: (delivery, onSuccess) =>
    //   dispatch(createDelivery(delivery, onSuccess)),
    // loadTimeSlot: store => dispatch(loadTimeSlot(store)),
    // loadTimeSlots: store => dispatch(loadTimeSlots(store)),
    // loadTimeSlotChoices: timeSlot => dispatch(loadTimeSlotChoices(timeSlot)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(NewDelivery));
