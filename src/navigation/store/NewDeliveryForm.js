import { Formik } from 'formik';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import moment from 'moment';
import { Box, Button, HStack, Input, Text, VStack } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ModalSelector from 'react-native-modal-selector';
import { connect } from 'react-redux';

import { createDelivery, loadTimeSlot } from '../../redux/Store/actions';
import { selectStore, selectTimeSlot } from '../../redux/Store/selectors';
import { getChoicesWithDates } from '../../utils/time-slots';

class NewDelivery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDateTimePickerVisible: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadTimeSlot(this.props.store);
    });
    // This will add a "OK" button above keyboard, to dismiss keyboard
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableAutoToolbar(true);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(false);
      KeyboardManager.setEnableAutoToolbar(false);
    }
  }

  _showDateTimePicker() {
    this.setState({ isDateTimePickerVisible: true });
  }

  _hideDateTimePicker() {
    this.setState({ isDateTimePickerVisible: false });
  }

  _handleChangeTelephone(value, setFieldValue, setFieldTouched) {
    setFieldValue(
      'address.telephone',
      new AsYouType(this.props.country).input(value),
    );
    setFieldTouched('address.telephone');
  }

  _submit(values) {
    const delivery = {
      store: this.props.store['@id'],
      dropoff: {
        ...values,
        address: {
          ...values.address,
          telephone: parsePhoneNumberFromString(
            values.address.telephone,
            this.props.country,
          ).format('E.164'),
        },
      },
    };

    this.props.createDelivery(delivery, () =>
      this.props.navigation.navigate('StoreHome'),
    );
  }

  _validate(values) {
    let errors = {};

    if (this.props.hasTimeSlot && _.isEmpty(values.timeSlot)) {
      errors = {
        ...errors,
        timeSlot: this.props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_TIME_SLOT'),
      };
    }

    if (_.isEmpty(values.address.telephone)) {
      errors.address = {
        ...errors.address,
        telephone: this.props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER'),
      };
    } else {
      const phoneNumber = parsePhoneNumberFromString(
        _.trim(values.address.telephone),
        this.props.country,
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.address = {
          ...errors.address,
          telephone: this.props.t('INVALID_PHONE_NUMBER'),
        };
      }
    }

    if (_.isEmpty(values.address.contactName)) {
      errors.address = {
        ...errors.address,
        contactName: this.props.t(
          'STORE_NEW_DELIVERY_ERROR.EMPTY_CONTACT_NAME',
        ),
      };
    }

    return errors;
  }

  renderTimeSlotSelector(errors, touched, setFieldValue, setFieldTouched) {
    return (
      <View style={[styles.formGroup]}>
        <Text style={styles.label}>
          {this.props.t('STORE_NEW_DELIVERY_TIME_SLOT')}
        </Text>
        <ModalSelector
          data={this.props.timeSlotChoices}
          cancelText={this.props.t('CANCEL')}
          initValue={this.props.t('STORE_NEW_DELIVERY_SELECT_TIME_SLOT')}
          accessible={true}
          // Bug on Android
          // The component thinks it's a long press while it's a short press
          enableLongPress={Platform.OS === 'android'}
          onChange={value => {
            setFieldValue('timeSlot', value.key);
            setFieldTouched('timeSlot');
          }}
        />
        {errors.timeSlot && touched.timeSlot && (
          <Text note style={styles.errorText}>
            {errors.timeSlot}
          </Text>
        )}
      </View>
    );
  }

  renderDateTimePicker(
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
              {this.props.t('STORE_NEW_DELIVERY_DROPOFF_BEFORE')}
            </Text>
            <Text>{moment(values.before).format('LLL')}</Text>
          </VStack>
          <Button onPress={this._showDateTimePicker.bind(this)}>
            {this.props.t('EDIT')}
          </Button>
        </HStack>
        <DateTimePickerModal
          isVisible={this.state.isDateTimePickerVisible}
          mode="datetime"
          onConfirm={value => {
            setFieldValue('before', moment(value).format());
            setFieldTouched('before');
            this._hideDateTimePicker();
          }}
          onCancel={this._hideDateTimePicker.bind(this)}
          minimumDate={moment(initialValues.before).toDate()}
        />
      </Box>
    );
  }

  render() {
    const address = this.props.route.params?.address;

    let telephone = '';
    if (address['@id'] && address.telephone) {
      const phoneNumber = parsePhoneNumberFromString(
        address.telephone,
        this.props.country,
      );
      if (phoneNumber && phoneNumber.isValid()) {
        telephone = phoneNumber.formatNational();
      }
    }

    let initialValues = {
      address: {
        ...address,
        description: (address['@id'] && address.description) || '',
        contactName: (address['@id'] && address.contactName) || '',
        telephone,
      },
    };

    if (this.props.hasTimeSlot) {
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
        validate={this._validate.bind(this)}
        onSubmit={this._submit.bind(this)}
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
          <VStack flex={1} justifyContent="space-between">
            <Box p="3">
              <View style={[styles.formGroup]}>
                <Text style={styles.label}>
                  {this.props.t('STORE_NEW_DELIVERY_ADDRESS')}
                </Text>
                <Input
                  variant="filled"
                  style={[styles.textInput]}
                  value={address.streetAddress}
                  isReadOnly={true}
                />
              </View>
              <View style={[styles.formGroup]}>
                <Text style={styles.label}>
                  {this.props.t('STORE_NEW_DELIVERY_PHONE_NUMBER')}
                </Text>
                <Input
                  style={[styles.textInput]}
                  autoCorrect={false}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onChangeText={value =>
                    this._handleChangeTelephone(
                      value,
                      setFieldValue,
                      setFieldTouched,
                    )
                  }
                  onBlur={handleBlur('address.telephone')}
                  value={values.address.telephone}
                />
                {errors.address &&
                  touched.address &&
                  errors.address.telephone &&
                  touched.address.telephone && (
                    <Text note style={styles.errorText}>
                      {errors.address.telephone}
                    </Text>
                  )}
              </View>
              <View style={[styles.formGroup]}>
                <Text style={styles.label}>
                  {this.props.t('STORE_NEW_DELIVERY_CONTACT_NAME')}
                </Text>
                <Input
                  style={[styles.textInput]}
                  autoCorrect={false}
                  returnKeyType="done"
                  onChangeText={handleChange('address.contactName')}
                  onBlur={handleBlur('address.contactName')}
                  value={values.address.contactName}
                />
                {errors.address &&
                  touched.address &&
                  errors.address.contactName &&
                  touched.address.contactName && (
                    <Text note style={styles.errorText}>
                      {errors.address.contactName}
                    </Text>
                  )}
              </View>
              <View style={[styles.formGroup]}>
                <Text style={styles.label}>
                  {this.props.t('STORE_NEW_DELIVERY_COMMENTS')}
                </Text>
                <Input
                  style={[styles.textInput, styles.textarea]}
                  autoCorrect={false}
                  multiline={true}
                  onChangeText={handleChange('address.description')}
                  onBlur={handleBlur('address.description')}
                  value={values.address.description}
                />
              </View>
              {this.props.hasTimeSlot &&
                this.renderTimeSlotSelector(
                  errors,
                  touched,
                  setFieldValue,
                  setFieldTouched,
                )}
              {!this.props.hasTimeSlot &&
                this.renderDateTimePicker(
                  initialValues,
                  values,
                  errors,
                  setFieldValue,
                  setFieldTouched,
                )}
            </Box>
            <Box p="3">
              <Button onPress={handleSubmit}>{this.props.t('SUBMIT')}</Button>
            </Box>
          </VStack>
        )}
      </Formik>
    );
  }
}

const styles = StyleSheet.create({
  message: {
    alignItems: 'center',
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#b9b9b9',
    borderRadius: 1,
    borderWidth: 1,
    minHeight: 40,
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
  const timeSlot = selectTimeSlot(state);
  const hasTimeSlot =
    timeSlot &&
    (timeSlot.choices.length > 0 ||
      timeSlot.openingHoursSpecification.length > 0);
  const timeSlotChoices = hasTimeSlot ? getChoicesWithDates(timeSlot) : [];

  return {
    country: state.app.settings.country.toUpperCase(),
    store: selectStore(state),
    timeSlotChoices,
    hasTimeSlot: hasTimeSlot && timeSlotChoices.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDelivery: (delivery, onSuccess) =>
      dispatch(createDelivery(delivery, onSuccess)),
    loadTimeSlot: store => dispatch(loadTimeSlot(store)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(NewDelivery));
