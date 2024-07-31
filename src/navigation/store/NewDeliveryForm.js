import { Formik } from 'formik';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import { Box, Button, HStack, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';

import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  createDelivery,
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

const tempPackages = [
  'Lorem ipsum',
  'Dolor',
  'Sit amet',
  'Consectetur adipiscing',
];

function NewDelivery(props) {
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const backgroundColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();
  const [selectValue, setSelectValue] = React.useState(null);
  const [packages, setPackages] = useState([]);

  const inputStyles = {
    backgroundColor,
    borderColor: backgroundHighlightColor,
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      props.loadTimeSlot(props.store);
      props.loadTimeSlots(props.store);
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
  }, [props.loadTimeSlot, props.loadTimeSlots, props.store]);

  useEffect(() => {
    setPackages(
      tempPackages.map(item => {
        return {
          type: item,
          quantity: 0,
        };
      }),
    );
  }, [tempPackages]);

  useEffect(() => {
    if (props.timeSlots.length > 0) {
      setSelectedTimeSlot(props.timeSlots[0].name);
    }
  }, [props.timeSlots]);

  useEffect(() => {
    setSelectValue(null);
    if (selectedTimeSlot) {
      props.loadTimeSlotChoices(
        props.timeSlots.find(ts => ts.name === selectedTimeSlot),
      );
    }
  }, [selectedTimeSlot, props.loadTimeSlotChoices, props.timeSlots]);

  function incrementQuantity(packageType) {
    setPackages(prev => {
      return prev.map(item => {
        if (item.type === packageType) {
          item.quantity += 1;
        }
        return item;
      });
    });
  }

  function decrementQuantity(packageType) {
    setPackages(prev => {
      return prev.map(item => {
        if (item.type === packageType) {
          item.quantity -= 1;
        }
        return item;
      });
    });
  }

  function updateSelectedTimeSlot(timeSlot) {
    setSelectedTimeSlot(timeSlot.name);
  }

  function showDateTimePicker() {
    setIsDateTimePickerVisible(true);
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  function submit(values) {
    const delivery = {
      store: props.store['@id'],
      dropoff: {
        ...values,
        weight: values.weight * 1000,
        packages: packages.filter(item => item.quantity > 0),
      },
    };

    console.log(delivery);

    // props.createDelivery(delivery, () =>
    //   props.navigation.navigate('StoreHome'),
    // );
  }

  function validate(values) {
    let errors = {};

    if (props.hasTimeSlot && !selectValue) {
      errors = {
        ...errors,
        timeSlot: props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_TIME_SLOT'),
      };
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
              {props.t('STORE_NEW_DELIVERY_DROPOFF_BEFORE')}
            </Text>
            <Text>{moment(values.before).format('LLL')}</Text>
          </VStack>
          <Button onPress={showDateTimePicker}>{props.t('EDIT')}</Button>
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
    setFieldTouched('weight', true);
  }

  const delivery = props.route.params?.delivery;

  let telephone = '';
  if (delivery.telephone) {
    const phoneNumber = parsePhoneNumberFromString(
      delivery.telephone,
      props.country,
    );
    if (phoneNumber && phoneNumber.isValid()) {
      telephone = phoneNumber.formatNational();
    }
  }

  let initialValues = {
    address: delivery.address,
    description: delivery.description || '',
    contactName: delivery.contactName || '',
    businessName: delivery.businessName || '',
    weight: '',
    telephone,
  };

  if (props.hasTimeSlot) {
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
        <ModalFormWrapper handleSubmit={handleSubmit} t={props.t} isSubmit>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {props.t('STORE_NEW_DELIVERY_ADDRESS')}
            </Text>
            <FormInput
              variant="filled"
              value={delivery?.address.streetAddress}
              isReadOnly={true}
            />
          </View>

          {props.hasTimeSlot && (
            <TimeSlotSelector
              selectValue={selectValue}
              setSelectValue={setSelectValue}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              updateSelectedTimeSlot={updateSelectedTimeSlot}
              timeSlots={props.timeSlots}
              choices={props.choices}
              selectedTimeSlot={selectedTimeSlot}
            />
          )}
          {!props.hasTimeSlot &&
            renderDateTimePicker(
              initialValues,
              values,
              errors,
              setFieldValue,
              setFieldTouched,
            )}

          <View style={[styles.formGroup]}>
            <Text style={styles.label}>Custom Weight</Text>
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
            />
            {errors.address && touched.address && errors.address.weight && (
              <Text note style={styles.errorText}>
                {errors.address.weight}
              </Text>
            )}
          </View>

          <View style={[styles.formGroup]}>
            <Text style={styles.label}>Packages</Text>
            <View
              style={{
                gap: 16,
                marginTop: 4,
              }}>
              {packages.map((item, index) => {
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
                      onPressIncrement={() => incrementQuantity(item.type)}
                      onPressDecrement={() => decrementQuantity(item.type)}
                      quantity={item.quantity}
                    />
                    <TouchableOpacity
                      style={{
                        flex: 1,
                      }}
                      onPress={() => incrementQuantity(item.type)}>
                      <Text>{item.type}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
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
});

function mapStateToProps(state) {
  const timeSlotChoices = [];
  const timeSlots = selectTimeSlots(state);
  const choices = state.store.choices;
  const hasTimeSlot = timeSlots.length > 0;

  return {
    country: state.app.settings.country.toUpperCase(),
    store: selectStore(state),
    timeSlotChoices,
    hasTimeSlot,
    timeSlots,
    choices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDelivery: (delivery, onSuccess) =>
      dispatch(createDelivery(delivery, onSuccess)),
    loadTimeSlot: store => dispatch(loadTimeSlot(store)),
    loadTimeSlots: store => dispatch(loadTimeSlots(store)),
    loadTimeSlotChoices: timeSlot => dispatch(loadTimeSlotChoices(timeSlot)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(NewDelivery));
