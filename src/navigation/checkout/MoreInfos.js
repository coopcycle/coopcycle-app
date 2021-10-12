import React, { Component } from 'react'
import { View, StyleSheet, InteractionManager } from 'react-native'
import { Text, VStack, FormControl, Input, TextArea } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import _ from 'lodash'
import {
  parsePhoneNumberFromString,
  AsYouType,
} from 'libphonenumber-js'

import { assignCustomer, updateCart } from '../../redux/Checkout/actions'
import { selectCartFulfillmentMethod } from '../../redux/Checkout/selectors'
import FooterButton from './components/FooterButton'

const hasPhoneNumberErrors = (errors, touched) => {
  return errors.telephone && touched.telephone
}

class MoreInfos extends Component {

  _handleChangeTelephone(value, setFieldValue, setFieldTouched) {
    setFieldValue('telephone', new AsYouType(this.props.country).input(value))
    setFieldTouched('telephone')
  }

  _submit(values) {
    const { checkoutMethodScreen } = this.props

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

    this.props.updateCart(payload, () => this.props.navigation.navigate(checkoutMethodScreen))
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

    return errors
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.assignCustomer()
    })
  }

  render() {

    let initialValues = {
      telephone: this.props.telephone,
      notes: '',
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
            <VStack p="2">
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
                { hasPhoneNumberErrors(errors, touched) && (
                  <Text note style={ styles.errorText }>{ errors.telephone }</Text>
                ) }
                { !hasPhoneNumberErrors(errors, touched) && (
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
            </VStack>
            <FooterButton
              testID="moreInfosSubmit"
              text={ this.props.t('SUBMIT') }
              onPress={ handleSubmit } />
          </VStack>
        )}
      </Formik>
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

function mapStateToProps(state) {
  const { app: { settings: { payment_gateway } } } = state

  const checkoutMethodScreen = payment_gateway === 'mercadopago'
    ? 'CheckoutMercadopago'
    : 'CheckoutCreditCard'

  const fulfillmentMethod = selectCartFulfillmentMethod(state)

  return {
    country: state.app.settings.country.toUpperCase(),
    cart: state.checkout.cart,
    checkoutMethodScreen,
    fulfillmentMethod,
    // FIXME
    // For click & collect, we need to retrieve the customer phone number
    // This needs a change server side
    telephone: fulfillmentMethod === 'delivery' ? (state.checkout.cart.shippingAddress.telephone || '') : '',
  }
}

function mapDispatchToProps(dispatch) {

  return {
    updateCart: (cart, cb) => dispatch(updateCart(cart, cb)),
    assignCustomer: () => dispatch(assignCustomer()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MoreInfos))
