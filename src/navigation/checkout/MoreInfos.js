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
import FooterButton from './components/FooterButton'

const hasPhoneNumberErrors = (errors, touched) => {
  return errors.address && touched.address && errors.address.telephone && touched.address.telephone
}

class MoreInfos extends Component {

  _handleChangeTelephone(value, setFieldValue, setFieldTouched) {
    setFieldValue('address.telephone', new AsYouType(this.props.country).input(value))
    setFieldTouched('address.telephone')
  }

  _submit(values) {

    const payload = {
      shippingAddress: {
        ...values.address,
        telephone: parsePhoneNumberFromString(values.address.telephone, this.props.country).format('E.164'),
      },
      notes: values.notes,
    }

    this.props.updateCart(payload, () => this.props.navigation.navigate('CheckoutCreditCard'))
  }

  _validate(values) {
    let errors = {}

    if (_.isEmpty(values.address.telephone)) {
      errors.address = {
        ...errors.address,
        telephone: this.props.t('STORE_NEW_DELIVERY_ERROR.EMPTY_PHONE_NUMBER'),
      }
    } else {
      const phoneNumber = parsePhoneNumberFromString(_.trim(values.address.telephone), this.props.country)
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.address = {
          ...errors.address,
          telephone: this.props.t('INVALID_PHONE_NUMBER'),
        }
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

    const initialValues = {
      address: {
        description: '',
        floor: '',
        telephone: this.props.cart.shippingAddress.telephone || '',
      },
      notes: '',
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
                  onBlur={ handleBlur('address.telephone') }
                  value={ values.address.telephone } />
                { hasPhoneNumberErrors(errors, touched) && (
                  <Text note style={ styles.errorText }>{ errors.address.telephone }</Text>
                ) }
                { !hasPhoneNumberErrors(errors, touched) && (
                  <Text note>{ this.props.t('CHECKOUT_ORDER_PHONE_NUMBER_HELP') }</Text>
                ) }
              </View>
              <View style={ [ styles.formGroup ] }>
                <Text style={ styles.label }>{ this.props.t('CHECKOUT_ORDER_ADDRESS_FLOOR') }</Text>
                <TextInput
                  style={ [ styles.textInput ] }
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={ handleChange('address.floor') }
                  onBlur={ handleBlur('address.floor') }
                  value={ values.address.floor } />
              </View>
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
  },
  textarea: {
    height: (25 * 3),
  },
  errorText: {
    color: '#FF4136',
  },
})

function mapStateToProps(state) {

  return {
    country: state.app.settings.country.toUpperCase(),
    cart: state.checkout.cart,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    updateCart: (cart, cb) => dispatch(updateCart(cart, cb)),
    assignCustomer: () => dispatch(assignCustomer()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MoreInfos))
