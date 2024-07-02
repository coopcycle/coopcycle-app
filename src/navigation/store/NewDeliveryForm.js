import { Formik } from 'formik';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import moment from 'moment';
import { Box, Button, HStack, Input, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import {
  InteractionManager,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';

import {
  createDelivery,
  loadTimeSlot,
  loadTimeSlotChoices,
  loadTimeSlots,
} from '../../redux/Store/actions';
import { selectStore, selectTimeSlots } from '../../redux/Store/selectors';
import TimeSlotSelector from './components/TimeSlotSelector';
import {
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
} from '../../styles/theme';
import ModalFormWrapper from './ModalFormWrapper';

function NewDelivery(props) {
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const backgroundColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();
  const [selectValue, setSelectValue] = React.useState(null);

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
        ...values.delivery,
        address: {
          ...values.delivery.address,
          weight: values.delivery.address.weight * 1000,
        },
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

  const delivery = props.route.params?.delivery;

  let telephone = '';
  if (delivery?.address['@id'] && delivery.address.telephone) {
    const phoneNumber = parsePhoneNumberFromString(
      delivery.address.telephone,
      props.country,
    );
    if (phoneNumber && phoneNumber.isValid()) {
      telephone = phoneNumber.formatNational();
    }
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

    setFieldValue('delivery.address.weight', value);
    setFieldTouched('delivery.address.weight', true);
  }

  let initialValues = {
    delivery: {
      ...delivery,
      address: {
        ...delivery.address,
        description:
          (delivery.address['@id'] && delivery.address.description) || '',
        contactName:
          (delivery.address['@id'] && delivery.address.contactName) || '',
        telephone,
        weight: (delivery.address['@id'] && delivery.address.weight) || '',
      },
    },
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
        <ModalFormWrapper handleSubmit={handleSubmit} t={props.t}>
          <View style={[styles.formGroup]}>
            <Text style={styles.label}>
              {props.t('STORE_NEW_DELIVERY_ADDRESS')}
            </Text>
            <Input
              variant="filled"
              style={[styles.textInput, inputStyles]}
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
            <Input
              keyboardType="numeric"
              rightElement={<Text style={styles.weightUnit}>kg</Text>}
              style={[styles.textInput, inputStyles]}
              autoCorrect={false}
              returnKeyType="done"
              onChangeText={value =>
                handleChangeWeight(value, setFieldValue, setFieldTouched)
              }
              onBlur={handleBlur('delivery.address.weight')}
              value={values.delivery.address.weight}
            />
            {errors.address && touched.address && errors.address.weight && (
              <Text note style={styles.errorText}>
                {errors.address.weight}
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
    marginBottom: 5,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#E3E3E3',
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 40,
    backgroundColor: '#FAFAFA',
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
