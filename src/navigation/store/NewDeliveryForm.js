import { Formik } from 'formik';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import moment from 'moment';
import { Box, Button, HStack, Input, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
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
          telephone: parsePhoneNumberFromString(
            values.delivery.address.telephone,
            props.country,
          ).format('E.164'),
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

    if (props.hasTimeSlot && _.isEmpty(values.timeSlot)) {
      errors = {
        ...errors,
        timeSlot: props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_TIME_SLOT'),
      };
    }

    if (_.isEmpty(values.delivery.address.telephone)) {
      errors.delivery = {
        ...errors.delivery,
        address: {
          ...errors.delivery?.address,
          telephone: props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER'),
        },
      };
    } else {
      const phoneNumber = parsePhoneNumberFromString(
        _.trim(values.delivery.address.telephone),
        props.country,
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.delivery = {
          ...errors.delivery,
          address: {
            ...errors.delivery?.address,
            telephone: props.t('INVALID_PHONE_NUMBER'),
          },
        };
      }
    }

    if (_.isEmpty(values.delivery.address.contactName)) {
      errors.delivery = {
        ...errors.delivery,
        address: {
          ...errors.delivery?.address,
          contactName: props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME'),
        },
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
        <VStack
          flex={1}
          justifyContent="space-between"
          style={{ backgroundColor }}>
          <Box p="3">
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

            <View style={[styles.formGroup]}>
              <Text style={styles.label}>
                {props.t('STORE_NEW_DELIVERY_COMMENTS')}
              </Text>
              <Input
                style={[styles.textInput, styles.textarea, inputStyles]}
                autoCorrect={false}
                multiline={true}
                onChangeText={handleChange('delivery.address.description')}
                onBlur={handleBlur('delivery.address.description')}
                value={values.delivery.address.description}
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
          </Box>
          <Box p="3">
            <Button onPress={handleSubmit}>{props.t('SUBMIT')}</Button>
          </Box>
        </VStack>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  message: {
    alignItems: 'center',
    padding: 20,
  },
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
  textarea: {
    minHeight: 25 * 3,
  },
  errorText: {
    paddingVertical: 5,
    color: '#FF4136',
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
