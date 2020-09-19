import React, { Component } from 'react'
import { View, StyleSheet, TextInput, InteractionManager } from 'react-native'
import { Container, Content, Text } from 'native-base'
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

    const telephone =
      parsePhoneNumberFromString(values.telephone, this.props.country).format('E.164')

    let payload = {
      notes: values.notes,
    }

    if (Object.prototype.hasOwnProperty.call(values, 'address')) {
      payload = {
        ...payload,
        shippingAddress: { ...values.address, telephone }
      }
    }

    // FIXME Store the phone number on server for click & collect

    this.props.updateCart(payload, () => this.props.navigation.navigate('CheckoutCreditCard'))
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
      notes: ''
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
          <Container>
            <View style={{ backgroundColor: '#cce5ff', padding: 20 }}>
              <Text note style={{ textAlign: 'center', color: '#004085' }}>{ this.props.t('CHECKOUT_MORE_INFOS_DISCLAIMER') }</Text>
            </View>
            <Content contentContainerStyle={ styles.content }>
              <View style={ [ styles.formGroup ] }>
                <Text style={ styles.label }>{ this.props.t('STORE_NEW_DELIVERY_PHONE_NUMBER') }</Text>
                <TextInput
                  testID="checkoutTelephone"
                  style={ [ styles.textInput ] }
                  autoCorrect={ false }
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onChangeText={ value => this._handleChangeTelephone(value, setFieldValue, setFieldTouched) }
                  onBlur={ handleBlur('telephone') }
                  value={ values.telephone }
                  placeholderTextColor="#d0d0d0" />
                { hasPhoneNumberErrors(errors, touched) && (
                  <Text note style={ styles.errorText }>{ errors.telephone }</Text>
                ) }
                { !hasPhoneNumberErrors(errors, touched) && (
                  <Text note>{ this.props.t('CHECKOUT_ORDER_PHONE_NUMBER_HELP') }</Text>
                ) }
              </View>
              { Object.prototype.hasOwnProperty.call(values, 'address') && (
              <View style={ [ styles.formGroup ] }>
                <Text style={ styles.label }>{ this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION') }</Text>
                <TextInput
                  style={ [ styles.textInput, styles.textarea ] }
                  autoCorrect={ false }
                  multiline={ true }
                  numberOfLines={ 3 }
                  onChangeText={ handleChange('address.description') }
                  onBlur={ handleBlur('address.description') } />
                <Text note>{ this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION_HELP') }</Text>
              </View>
              )}
              <View style={ [ styles.formGroup ] }>
                <Text style={ styles.label }>{ this.props.t('CHECKOUT_ORDER_NOTES') }</Text>
                <TextInput
                  style={ [ styles.textInput, styles.textarea ] }
                  autoCorrect={ false }
                  multiline={ true }
                  numberOfLines={ 3 }
                  onChangeText={ handleChange('notes') }
                  onBlur={ handleBlur('notes') } />
                <Text note>{ this.props.t('CHECKOUT_ORDER_NOTES_HELP') }</Text>
              </View>
            </Content>
            <FooterButton
              testID="moreInfosSubmit"
              text={ this.props.t('SUBMIT') }
              onPress={ handleSubmit } />
          </Container>
        )}
      </Formik>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  message: {
    alignItems: 'center',
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  formGroup: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#b9b9b9',
    borderRadius: 1,
    borderWidth: 1,
    height: 40,
    padding: 5,
    color: '#333'
  },
  textarea: {
    height: (25 * 3),
  },
  errorText: {
    color: '#FF4136',
  },
})

function mapStateToProps(state) {

  const fulfillmentMethod = selectCartFulfillmentMethod(state)

  return {
    country: state.app.settings.country.toUpperCase(),
    cart: state.checkout.cart,
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MoreInfos))
