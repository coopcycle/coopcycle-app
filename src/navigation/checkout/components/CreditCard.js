import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Keyboard,
  Platform,
  useColorScheme,
} from 'react-native';
import { connect } from 'react-redux'
import { Center, Text, Input } from 'native-base';
import _ from 'lodash'
import { withTranslation } from 'react-i18next'
import { Formik } from 'formik'
import { CardField, StripeProvider } from '@stripe/stripe-react-native'

import { formatPrice } from '../../../utils/formatting'
import FooterButton from './FooterButton'
import { loadPaymentDetails } from '../../../redux/Checkout/actions'

const ColorSchemeAwareCardField = (props) => {

  const colorScheme = useColorScheme()

  return (
    <CardField
      postalCodeEnabled={ false }
      cardStyle={{
        // borderWidth?: number;
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        // borderColor?: string;
        // cornerRadius?: number;
        textColor: colorScheme === 'dark' ? 'white' : 'black',
        // fontSize?: number;
        // placeholderColor?: string;
        // cursorColor?: string;
        // textErrorColor?: string;
      }}
      style={{
        width: '100%',
        height: 50,
      }}
      { ...props } />
  )
}

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

    this.props.loadPaymentDetails()
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

    const { cart, paymentDetailsLoaded } = this.props

    if (!cart || !paymentDetailsLoaded) {

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

    let stripeProviderProps = {
      publishableKey: this.props.stripePublishableKey,
    }

    if (!_.isEmpty(this.props.paymentDetails.stripeAccount)) {
      stripeProviderProps = {
        ...stripeProviderProps,
        stripeAccountId: this.props.paymentDetails.stripeAccount,
      }
    }

    return (
      <StripeProvider { ...stripeProviderProps }>
      <Formik
        initialValues={ initialValues }
        validate={ this._validate.bind(this) }
        onSubmit={ this.props.onSubmit }
        validateOnBlur={ false }
        validateOnChange={ false }>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
        <Animated.View style={{ flex: 1, paddingBottom: this.keyboardHeight }}>
          <Center flex={ 1 }>
            <Text style={ styles.creditCardLabel }>
              { this.props.t('ENTER_PAY_DETAILS') }
            </Text>
            <View style={ styles.creditCardInputContainer }>
              <View style={ [ styles.formInputContainer, { paddingHorizontal: 20, marginBottom: 15 } ] }>
                <Input
                  testID="cardholderName"
                  autoCorrect={ false }
                  autoCapitalize="none"
                  style={{ height: 40 }}
                  placeholder={ this.props.t('CARDHOLDER_NAME') }
                  onChangeText={ handleChange('cardholderName') }
                  onBlur={ handleBlur('cardholderName') } />
              </View>
              <View style={[ styles.formInputContainer, { paddingHorizontal: 20, marginBottom: 15 } ] } testID="creditCardWrapper">
                <ColorSchemeAwareCardField
                  onCardChange={ (cardDetails) => {
                    this.setState({
                      valid: cardDetails.complete,
                    })
                  }}
                />
              </View>
            </View>
            { this.props.errors.length > 0 && (
            <View style={ styles.errorsContainer }>
              { this.props.errors.map((error, key) => (
              <Text key={ key } style={ styles.errorText }>{ error }</Text>
              )) }
            </View>
            ) }
          </Center>
          <FooterButton
            testID="creditCardSubmit"
            text={ this.props.t('PAY_AMOUNT', { amount: formatPrice(cart.total) }) }
            onPress={ _.debounce(handleSubmit, 1000, { leading: true, trailing: false }) } />
        </Animated.View>
        )}
      </Formik>
      </StripeProvider>
    )
  }
}

const styles = StyleSheet.create({
  creditCardLabel: {
    textAlign: 'center',
    marginBottom: 10,
  },
  creditCardInputContainer: {
    alignSelf: 'stretch',
  },
  formInputContainer: {
    paddingVertical: 10,
  },
  errorsContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  errorText: {
    textAlign: 'center',
    color: '#ed2f2f',
  },
})

function mapStateToProps(state) {

  return {
    stripePublishableKey: state.app.settings.stripe_publishable_key,
    paymentDetails: state.checkout.paymentDetails,
    paymentDetailsLoaded: state.checkout.paymentDetailsLoaded,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadPaymentDetails: () => dispatch(loadPaymentDetails()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CreditCard))
