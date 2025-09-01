import { Formik } from 'formik';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import _ from 'lodash';
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import validate from 'validate.js';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import { selectIsAuthenticated, selectUser } from '../../redux/App/selectors';
import {
  assignCustomer,
  checkTimeRange,
  checkout,
  showValidationErrors,
  updateCart,
  validateOrder,
} from '../../redux/Checkout/actions';
import {
  selectCart,
  selectCartFulfillmentMethod,
  selectIsValid,
} from '../../redux/Checkout/selectors';
import { isFree } from '../../utils/order';
import FooterButton from './components/FooterButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import TimeRangeChangedModal from './components/TimeRangeChangedModal';

const hasErrors = (errors, touched, field) => {
  return errors[field] && touched[field];
};

class MoreInfos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  _handleChangeTelephone(value, setFieldValue, setFieldTouched) {
    setFieldValue('telephone', new AsYouType(this.props.country).input(value));
    setFieldTouched('telephone');
  }

  async _submit(values) {
    this.setState({ isLoading: true });

    const telephone = parsePhoneNumberFromString(
      values.telephone,
      this.props.country,
    ).format('E.164');

    if (this._userIsGuest()) {
      try {
        await this.props.assignCustomer({ email: values.email, telephone });
      } catch (e) {
        console.error(e);
        this.setState({ isLoading: false });
        //todo; display error
        return;
      }
    }

    let payload = {
      notes: values.notes,
    };

    if (Object.prototype.hasOwnProperty.call(values, 'address')) {
      payload = {
        ...payload,
        shippingAddress: { ...values.address, telephone },
      };
    } else {
      payload = {
        ...payload,
        telephone,
      };
    }
    const { data: cart, error: updateCartFailed } =
      await this.props.updateCart(payload);
    if (updateCartFailed) {
      console.log('MoreInfos; updateCartFailed', updateCartFailed);
      this.setState({ isLoading: false });
      //todo; display error
      return;
    }

    const { error: timeRangeCheckFailed } = await this.props.checkTimeRange(
      cart.restaurant,
      this.props.lastShownTimeRange,
    );

    if (timeRangeCheckFailed) {
      this.setState({ isLoading: false });
      // checkTimeRange will trigger a TimeRangeChangedModal
      return;
    }

    const { error: validationFailed } = await this.props.validateOrder(cart);
    if (validationFailed) {
      this.setState({ isLoading: false });
      this.props.showValidationErrors();
      return;
    }

    this.setState({ isLoading: false });

    if (isFree(cart)) {
      this.props.checkout();
    } else {
      this.props.navigation.navigate('CheckoutPayment');
    }
  }

  _validate(values) {
    let errors = {};

    if (_.isEmpty(values.telephone)) {
      errors.telephone = this.props.t(
        'STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER',
      );
    } else {
      const phoneNumber = parsePhoneNumberFromString(
        _.trim(values.telephone),
        this.props.country,
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.telephone = this.props.t('INVALID_PHONE_NUMBER');
      }
    }

    if (!this.props.isAuthenticated && this._userIsGuest()) {
      if (validate.single(values.email, { presence: true, email: true })) {
        errors.email = this.props.t('INVALID_EMAIL');
      }
    }

    return errors;
  }

  _userIsGuest() {
    return this.props.user && this.props.user.isGuest();
  }

  componentDidMount() {
    if (!this._userIsGuest()) {
      InteractionManager.runAfterInteractions(() => {
        this.props.assignCustomer({});
      });
    }
  }

  render() {
    let initialValues = {
      telephone: this.props.telephone,
      notes: '',
      email: this.props.email,
    };

    if (this.props.fulfillmentMethod === 'delivery') {
      initialValues = {
        ...initialValues,
        address: {
          description: '',
        },
      };
    }

    return (
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
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
            <KeyboardAdjustView style={{ flex: 1 }}>
              <HStack className="p-4 justify-center bg-info-200">
                <Text>{this.props.t('CHECKOUT_MORE_INFOS_DISCLAIMER')}</Text>
              </HStack>

              <VStack className="p-2" style={{ flex: 1 }}>
                <ScrollView>
                  {!this.props.isAuthenticated && this._userIsGuest() && (
                    <FormControl className="mb-2" isInvalid={hasErrors(errors, touched, 'email')}>
                      <FormControlLabel>
                        <FormControlLabelText>Email</FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          testID="guestCheckoutEmail"
                          autoCorrect={false}
                          keyboardType="email-address"
                          returnKeyType="done"
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          autoCapitalize="none"
                        />
                      </Input>
                      {hasErrors(errors, touched, 'email') && (
                        <FormControlError>
                          <FormControlErrorText className="text-red-500">{errors.email}</FormControlErrorText>
                        </FormControlError>
                      )}
                      {!hasErrors(errors, touched, 'email') && (
                      <FormControlHelper>
                        <FormControlHelperText>
                          {this.props.t('GUEST_CHECKOUT_ORDER_EMAIL_HELP')}
                        </FormControlHelperText>
                      </FormControlHelper>
                      )}
                    </FormControl>
                  )}
                  <FormControl className="mb-2" isInvalid={hasErrors(errors, touched, 'telephone')}>
                    <FormControlLabel>
                      <FormControlLabelText>{this.props.t('STORE_NEW_DELIVERY_PHONE_NUMBER')}</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        testID="checkoutTelephone"
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
                        onBlur={handleBlur('telephone')}
                        value={values.telephone}
                      />
                    </Input>
                    {hasErrors(errors, touched, 'telephone') && (
                      <FormControlError>
                        <FormControlErrorText>{errors.telephone}</FormControlErrorText>
                      </FormControlError>
                    )}
                    {!hasErrors(errors, touched, 'telephone') && (
                      <FormControlHelper>
                        <FormControlHelperText>
                          {this.props.t('CHECKOUT_ORDER_PHONE_NUMBER_HELP')}
                        </FormControlHelperText>
                      </FormControlHelper>
                    )}
                  </FormControl>
                  {Object.prototype.hasOwnProperty.call(values, 'address') && (
                    <FormControl className="mb-2">
                      <FormControlLabel>
                        <FormControlLabelText>{this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION')}</FormControlLabelText>
                      </FormControlLabel>
                      <Textarea>
                        <TextareaInput
                          autoCorrect={false}
                          totalLines={3}
                          onChangeText={handleChange('address.description')}
                          onBlur={handleBlur('address.description')}
                        />
                      </Textarea>
                      <FormControlHelper>
                        <FormControlHelperText>
                          {this.props.t(
                            'CHECKOUT_ORDER_ADDRESS_DESCRIPTION_HELP',
                          )}
                        </FormControlHelperText>
                      </FormControlHelper>
                    </FormControl>
                  )}
                  <FormControl className="mb-2">
                    <FormControlLabel>
                      <FormControlLabelText>{this.props.t('CHECKOUT_ORDER_NOTES')}</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea>
                      <TextareaInput
                        autoCorrect={false}
                        totalLines={3}
                        onChangeText={handleChange('notes')}
                        onBlur={handleBlur('notes')}
                      />
                    </Textarea>
                    <FormControlHelper>
                      <FormControlHelperText>
                        {this.props.t('CHECKOUT_ORDER_NOTES_HELP')}
                      </FormControlHelperText>
                    </FormControlHelper>
                  </FormControl>
                </ScrollView>
              </VStack>
              <FooterButton
                style={{ flex: 1 }}
                testID="moreInfosSubmit"
                text={this.props.t('SUBMIT')}
                isLoading={this.state.isLoading}
                onPress={handleSubmit}
              />
            </KeyboardAdjustView>
          )}
        </Formik>
        <TimeRangeChangedModal />
      </SafeAreaView>
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
  errorText: {
    color: '#FF4136',
  },
});

function mapStateToProps(state, ownProps) {
  const fulfillmentMethod = selectCartFulfillmentMethod(state);
  const { cart, lastShownTimeRange } = selectCart(state);

  return {
    country: state.app.settings.country.toUpperCase(),
    cart,
    fulfillmentMethod,
    lastShownTimeRange,
    // FIXME
    // For click & collect, we need to retrieve the customer phone number
    // This needs a change server side
    telephone:
      fulfillmentMethod === 'delivery'
        ? cart?.shippingAddress?.telephone || ''
        : '',
    email: state.checkout.guest ? state.checkout.guest.email : '',
    user: selectUser(state),
    isAuthenticated: selectIsAuthenticated(state),
    isValid: selectIsValid(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateCart: cart => dispatch(updateCart(cart)),
    validateOrder: cart => dispatch(validateOrder(cart)),
    showValidationErrors: () => dispatch(showValidationErrors()),
    checkTimeRange: (restaurantNodeId, lastTimeRange) =>
      dispatch(checkTimeRange(restaurantNodeId, lastTimeRange)),
    checkout: () => dispatch(checkout()),
    assignCustomer: payload => dispatch(assignCustomer(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(MoreInfos));
