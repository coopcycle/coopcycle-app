import React, { Component } from 'react'
import {InteractionManager, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from 'react-native'
import { FormControl, Input, Text, TextArea, VStack } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import _ from 'lodash'
import {
  AsYouType,
  parsePhoneNumberFromString,
} from 'libphonenumber-js'

import { assignCustomer, checkout, updateCart } from '../../redux/Checkout/actions'
import { selectCart, selectCartFulfillmentMethod } from '../../redux/Checkout/selectors'
import FooterButton from './components/FooterButton'
import { isFree } from '../../utils/order'
import { selectIsAuthenticated } from '../../redux/App/selectors'
import validate from 'validate.js'

const hasErrors = (errors, touched, field) => {
  return errors[field] && touched[field]
}

class MoreInfos extends Component {

  _handleChangeTelephone(value, setFieldValue, setFieldTouched) {
    setFieldValue('telephone', new AsYouType(this.props.country).input(value))
    setFieldTouched('telephone')
  }

  _updateCart(payload) {
    this.props.updateCart(payload, (order) => {
      if (isFree(order)) {
        this.props.checkout()
      } else {
        this.props.navigation.navigate('CheckoutCreditCard')
      }
    })
  }

  _submit(values) {

    const telephone =
      parsePhoneNumberFromString(values.telephone, this.props.country).format('E.164')

    let payload = {
      notes: values.notes,
    }

    if (Object.prototype.hasOwnProperty.call(values, 'address')) {
      payload = {
        ...payload,
        shippingAddress: { ...values.address, telephone },
      }
    } else {
      payload = {
        ...payload,
        telephone,
      }
    }

    if (this.props.user.isGuest()) {
      return this.props.assignCustomer({ email: values.email, telephone })
        .then(() => {
          this._updateCart(payload)
        })
        .catch((err) => {
          console.error(err);
        })
    } else {
      this._updateCart(payload)
    }

  }

  _validate(values) {
    let errors = {}

    if (_.isEmpty(values.telephone)) {
      errors.telephone = this.props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER')
    } else {
      const phoneNumber = parsePhoneNumberFromString(_.trim(values.telephone), this.props.country)
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.telephone = this.props.t('INVALID_PHONE_NUMBER')
      }
    }

    if (!this.props.isAuthenticated && this.props.user.isGuest()) {
      if (validate.single(values.email, { presence: true, email: true })) {
        errors.email = this.props.t('INVALID_EMAIL')
      }
    }

    return errors
  }

  componentDidMount() {
    if (!this.props.user.isGuest()) {
      InteractionManager.runAfterInteractions(() => {
        this.props.assignCustomer({})
      })
    }
  }

  render() {

    let initialValues = {
      telephone: this.props.telephone,
      notes: '',
      email: this.props.email,
    }

    if (this.props.fulfillmentMethod === 'delivery') {
      initialValues = {
        ...initialValues,
        address: {
          description: '',
        },
      }
    }

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={40} enabled={true} behavior={Platform.OS === 'ios' ? 'position' : 'padding'}>
      <Formik
        initialValues={ initialValues }
        validate={ this._validate.bind(this) }
        onSubmit={ this._submit.bind(this) }
        validateOnBlur={ false }
        validateOnChange={ false }>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
          <VStack>
            <View style={{ backgroundColor: '#cce5ff', padding: 20 }}>
              <Text note style={{ textAlign: 'center', color: '#004085' }}>{ this.props.t('CHECKOUT_MORE_INFOS_DISCLAIMER') }</Text>
            </View>
            <VStack p="2" style={{ flexShrink: 1 }}>
              <ScrollView>
                {!this.props.isAuthenticated && this.props.user.isGuest() &&
                <FormControl mb="2">
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                      testID="guestCheckoutEmail"
                      autoCorrect={ false }
                      keyboardType="email-address"
                      returnKeyType="done"
                      onChangeText={ handleChange('email') }
                      onBlur={ handleBlur('email') }
                      value={ values.email }
                      autoCapitalize="none" />
                    { hasErrors(errors, touched, 'email') && (
                      <Text note style={ styles.errorText }>{ errors.email }</Text>
                    ) }
                    { !hasErrors(errors, touched, 'email') && (
                      <FormControl.HelperText>{ this.props.t('GUEST_CHECKOUT_ORDER_EMAIL_HELP') }</FormControl.HelperText>
                    ) }
                </FormControl>
                }
                <FormControl mb="2">
                  <FormControl.Label>{ this.props.t('STORE_NEW_DELIVERY_PHONE_NUMBER') }</FormControl.Label>
                  <Input
                    testID="checkoutTelephone"
                    autoCorrect={ false }
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    onChangeText={ value => this._handleChangeTelephone(value, setFieldValue, setFieldTouched) }
                    onBlur={ handleBlur('telephone') }
                    value={ values.telephone } />
                  { hasErrors(errors, touched, 'telephone') && (
                    <Text note style={ styles.errorText }>{ errors.telephone }</Text>
                  ) }
                  { !hasErrors(errors, touched, 'telephone') && (
                    <FormControl.HelperText>{ this.props.t('CHECKOUT_ORDER_PHONE_NUMBER_HELP') }</FormControl.HelperText>
                  ) }
                </FormControl>
                { Object.prototype.hasOwnProperty.call(values, 'address') && (
                <FormControl mb="2">
                  <FormControl.Label>{ this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION') }</FormControl.Label>
                  <TextArea
                    autoCorrect={ false }
                    totalLines={ 3 }
                    onChangeText={ handleChange('address.description') }
                    onBlur={ handleBlur('address.description') } />
                  <FormControl.HelperText>{ this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION_HELP') }</FormControl.HelperText>
                </FormControl>
                )}
                <FormControl mb="2">
                  <FormControl.Label>{ this.props.t('CHECKOUT_ORDER_NOTES') }</FormControl.Label>
                  <TextArea
                    autoCorrect={ false }
                    totalLines={ 3 }
                    onChangeText={ handleChange('notes') }
                    onBlur={ handleBlur('notes') } />
                  <FormControl.HelperText>{ this.props.t('CHECKOUT_ORDER_NOTES_HELP') }</FormControl.HelperText>
                </FormControl>
              </ScrollView>
            </VStack>
            <FooterButton
              style={{ flex: 1 }}
              testID="moreInfosSubmit"
              text={ this.props.t('SUBMIT') }
              onPress={ handleSubmit } />
          </VStack>
        )}
      </Formik>
      </KeyboardAvoidingView>
    )
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
})

function mapStateToProps(state, ownProps) {

  const fulfillmentMethod = selectCartFulfillmentMethod(state)
  const cart = selectCart(state)?.cart || ownProps.route.params?.cart

  return {
    country: state.app.settings.country.toUpperCase(),
    cart,
    fulfillmentMethod,
    // FIXME
    // For click & collect, we need to retrieve the customer phone number
    // This needs a change server side
    telephone: fulfillmentMethod === 'delivery' ? (state.checkout.cart?.shippingAddress?.telephone || '') : '',
    email: state.checkout.guest ? state.checkout.guest.email : '',
    user: state.app.user,
    isAuthenticated: selectIsAuthenticated(state),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    updateCart: (cart, cb) => dispatch(updateCart(cart, cb)),
    checkout: () => dispatch(checkout()),
    assignCustomer: (payload) => dispatch(assignCustomer(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MoreInfos))
