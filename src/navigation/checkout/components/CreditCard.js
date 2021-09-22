import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native';
import { Content, Text } from 'native-base';
import _ from 'lodash'
import { LiteCreditCardInput } from 'react-native-credit-card-input'
import { withTranslation } from 'react-i18next'
import { Formik } from 'formik'

import { formatPrice } from '../../../utils/formatting'
import FooterButton from './FooterButton'

class CreditCard extends Component {

  constructor(props) {
    super(props)

    this.keyboardHeight = new Animated.Value(0)

    this.state = {
      valid: false,
      form: {},
    }
  }

  componentDidMount() {
    // https://reactnative.dev/docs/keyboard
    // keyboardWillShow as well as keyboardWillHide are generally not available on Android
    // since there is no native corresponding event.

    const showEventName = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow'
    const hideEventName = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide'

    this.keyboardWillShowSub = Keyboard.addListener(showEventName, this.keyboardWillShow.bind(this))
    this.keyboardWillHideSub = Keyboard.addListener(hideEventName, this.keyboardWillHide.bind(this))
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow(event) {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }),
    ]).start();
  }

  keyboardWillHide(event) {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
  }

  _onChange(form, setFieldValue, setFieldTouched) {

    _.each(form.values, (value, key) => {
      setFieldValue(key, value)
      setFieldTouched(key)
    })

    this.setState({
      valid: form.valid,
    })
  }

  _validate(values) {

    let errors = {}

    if (!this.state.valid) {
      errors.card = true
    }

    if (_.isEmpty(values.cardholderName)) {
      errors.cardholderName = true
    }

    return errors
  }

  render() {

    const { cart } = this.props

    if (!cart) {

      return (
        <View />
      )
    }

    const initialValues = {
      cardholderName: '',
      number: '',
      expiry: '',
      cvc: '',
    }

    // Make sure button can't be tapped twice
    // @see https://medium.com/@devmrin/debouncing-touch-events-in-react-native-prevent-navigating-twice-or-more-times-when-button-is-90687e4a8113
    // @see https://snack.expo.io/@patwoz/withpreventdoubleclick

    return (
      <Formik
        initialValues={ initialValues }
        validate={ this._validate.bind(this) }
        onSubmit={ this.props.onSubmit }
        validateOnBlur={ false }
        validateOnChange={ false }>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
        <Animated.View style={{ flex: 1, paddingBottom: this.keyboardHeight }}>
          <Content contentContainerStyle={ styles.content } enableAutomaticScroll={ false }>
            <Text style={ styles.creditCardLabel }>
              { this.props.t('ENTER_PAY_DETAILS') }
            </Text>
            <View style={ styles.creditCardInputContainer }>
              <View style={ [ styles.formInputContainer, { paddingHorizontal: 20, marginBottom: 15 } ] }>
                <TextInput
                  testID="cardholderName"
                  autoCorrect={ false }
                  autoCapitalize="none"
                  style={{ height: 40, color: '#333' }}
                  placeholder={ this.props.t('CARDHOLDER_NAME') }
                  onChangeText={ handleChange('cardholderName') }
                  onBlur={ handleBlur('cardholderName') } />
              </View>
              <View style={[ styles.formInputContainer, { paddingHorizontal: 10, marginBottom: 15 } ] } testID="creditCardWrapper">
                <LiteCreditCardInput
                  additionalInputsProps={{
                    number: {
                      testID: 'creditCardNumber',
                    },
                    expiry: {
                      testID: 'creditCardExpiry',
                    },
                    cvc: {
                      testID: 'creditCardCvc',
                    },
                  }}
                  onChange={ form => this._onChange(form, setFieldValue, setFieldTouched) } />
              </View>
            </View>
            { this.props.errors.length > 0 && (
            <View style={ styles.errorsContainer }>
              { this.props.errors.map((error, key) => (
              <Text key={ key } style={ styles.errorText }>{ error }</Text>
              )) }
            </View>
            ) }
          </Content>
          <FooterButton
            testID="creditCardSubmit"
            text={ this.props.t('PAY_AMOUNT', { amount: formatPrice(cart.total) }) }
            onPress={ _.debounce(handleSubmit, 1000, { leading: true, trailing: false }) } />
        </Animated.View>
        )}
      </Formik>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  creditCardLabel: {
    textAlign: 'center',
    marginBottom: 10,
  },
  creditCardInputContainer: {
    alignSelf: 'stretch',
  },
  formInputContainer: {
    paddingVertical: 10,
    backgroundColor: '#f7f7f7',
  },
  errorsContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  errorText: {
    textAlign: 'center',
    color: '#ed2f2f',
  },
  payButton: {
    color: '#ffffff',
    fontSize: 16,
  },
})

export default withTranslation()(CreditCard)
