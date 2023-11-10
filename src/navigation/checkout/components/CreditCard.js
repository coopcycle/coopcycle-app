import React, {Component} from 'react';
import {Animated, Keyboard, Platform, StyleSheet, useColorScheme, View,} from 'react-native';
import {connect} from 'react-redux'
import {Button, Center, Checkbox, Input, Radio, Text} from 'native-base';
import _ from 'lodash'
import {withTranslation} from 'react-i18next'
import {Formik} from 'formik'
import {CardField, StripeProvider} from '@stripe/stripe-react-native'

import {formatPrice} from '../../../utils/formatting'
import FooterButton from './FooterButton'
import {loadPaymentDetails, loadStripeSavedPaymentMethods} from '../../../redux/Checkout/actions'
import SavedCreditCard from './SavedCreditCard';

const ColorSchemeAwareCardField = (props) => {

  const colorScheme = useColorScheme()

  return (
    <CardField
      postalCodeEnabled={ false }
      cardStyle={{
        borderWidth: colorScheme === 'dark' ? 1 : 0,
        backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
        borderColor: colorScheme === 'dark' ? '#666666' : '#ffffff',
        borderRadius: 4,
        textColor: colorScheme === 'dark' ? '#ffffff' : '#333333',
        // fontSize?: number;
        placeholderColor: '#666666',
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
      addNewCard: false,
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

    if (!this.props.user.isGuest()) {
      this.props.loadStripeSavedPaymentMethods()
    }
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

    if (this.props.stripePaymentMethods.length && !values.savedCardSelected && !this.state.addNewCard) {
      errors.selectCard = this.props.t('SELECT_SAVED_CARD_ERROR')
    }

    if (this.state.addNewCard) {
      if (!this.state.valid) {
        errors.card = this.props.t('INVALID_CREDIT_CARD_ERROR')
      }

      if (_.isEmpty(values.cardholderName)) {
        errors.cardholderName = this.props.t('INVALID_CARD_HOLDER_NAME_ERROR')
      }
    }

    return errors
  }

  shouldRenderStripePaymentMethods() {
    const { stripePaymentMethodsLoaded, stripePaymentMethods, user } = this.props

    return !user.isGuest() && stripePaymentMethodsLoaded && stripePaymentMethods.length
  }

  render() {

    const { cart, paymentDetailsLoaded, disabled, stripePaymentMethodsLoaded, stripePaymentMethods, user } = this.props

    if (!cart || !paymentDetailsLoaded || (!user.isGuest() && !stripePaymentMethodsLoaded)) {

      return (
        <View />
      )
    }

    const initialValues = {
      cardholderName: '',
      number: '',
      expiry: '',
      cvc: '',
      savedCardSelected: null,
      saveCard: false,
    }

    // Make sure button can't be tapped twice
    // @see https://medium.com/@devmrin/debouncing-touch-events-in-react-native-prevent-navigating-twice-or-more-times-when-button-is-90687e4a8113
    // @see https://snack.expo.io/@patwoz/withpreventdoubleclick

    const stripeProviderProps = {
      publishableKey: this.props.stripePublishableKey,
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
          { (this.shouldRenderStripePaymentMethods() && !this.state.addNewCard) ?
              <Center flex={1} >
                <Text mb={2} bold>
                  { this.props.t('PAY_WITH_SAVED_CREDIT_CARD') }
                </Text>
                <Radio.Group name="savedCardSelected" accessibilityLabel="saved credit cards"
                  defaultValue={initialValues.savedCardSelected}
                  onChange={ handleChange('savedCardSelected') }>
                  {
                    stripePaymentMethods.map((card) => {
                      return (
                        <SavedCreditCard card={card} key={card.id} />
                      )
                    })
                  }
                </Radio.Group>
                <Button mt={4} onPress={ () => {
                  this.setState({ addNewCard: true }, () => {
                    setFieldValue('savedCardSelected', null)
                  })
                }}>
                  { this.props.t('ADD_NEW_CREDIT_CARD') }
                </Button>
                { errors.selectCard && (
                    <Text m={4} textAlign="center" color="#ed2f2f">{ errors.selectCard }</Text>
                ) }
              </Center>
              : null
          }
          {
            (this.state.addNewCard || !this.shouldRenderStripePaymentMethods()) ?
            <Center flex={ 1 } >
              <Text style={ styles.creditCardLabel }>
                { this.props.t('ENTER_PAY_DETAILS') }
              </Text>
              <View style={ styles.creditCardInputContainer }>
                <View style={ [ styles.formInputContainer, { paddingHorizontal: 20, marginBottom: 15 }] }>
                  <Input
                    testID="cardholderName"
                    autoCorrect={ false }
                    autoCapitalize="none"
                    style={{ height: 40 }}
                    placeholder={ this.props.t('CARDHOLDER_NAME') }
                    onChangeText={ handleChange('cardholderName') }
                    onBlur={ handleBlur('cardholderName') } />
                  { errors.cardholderName && (
                    <Text mt={2} color="#ed2f2f">{ errors.cardholderName }</Text>
                  ) }
                </View>
                <View style={[ styles.formInputContainer, { paddingHorizontal: 20, marginBottom: 15 }] } testID="creditCardWrapper">
                  <ColorSchemeAwareCardField
                    onCardChange={ (cardDetails) => {
                      this.setState({
                        valid: cardDetails.complete,
                      })
                    }}
                  />
                  { errors.card && (
                    <Text mt={2} color="#ed2f2f">{ errors.card }</Text>
                  ) }
                </View>
              </View>
              {
                !user.isGuest() ?
                <Checkbox name="saveCard" mb={4}
                  accessibilityLabel="save credit card"
                  defaultValue={ initialValues.saveCard }
                  onChange={ (checked) => setFieldValue('saveCard', checked) }>
                  { this.props.t('SAVE_CARD') }
                </Checkbox>
                : null
              }
              {
                this.shouldRenderStripePaymentMethods() ?
                <Button mt={2} onPress={ () => {
                    this.setState({ addNewCard: false })
                  }}>
                    { this.props.t('SELECT_SAVED_CARD') }
                </Button>
                : null
              }
              { this.props.errors.length > 0 && (
                <View style={ styles.errorsContainer }>
                  { this.props.errors.map((error, key) => (
                  <Text key={ key } style={ styles.errorText }>{ error }</Text>
                  )) }
                </View>
              ) }
            </Center>
            : null
          }
          <FooterButton
            idDisabled={disabled}
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
    paymentDetailsLoaded: state.checkout.paymentDetailsLoaded,
    stripePaymentMethods: state.checkout.stripePaymentMethods || [],
    stripePaymentMethodsLoaded: state.checkout.stripePaymentMethodsLoaded,
    user: state.app.user,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadPaymentDetails: () => dispatch(loadPaymentDetails()),
    loadStripeSavedPaymentMethods: () => dispatch(loadStripeSavedPaymentMethods()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CreditCard))
