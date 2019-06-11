import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Container, Content, Footer, FooterTab,
  Button, Icon, List, ListItem, Text
} from 'native-base';
import { LiteCreditCardInput } from 'react-native-credit-card-input'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import { checkout } from '../../redux/Checkout/actions'
import { formatPrice } from '../../Cart'

class CreditCard extends Component {

  constructor(props) {
    super(props)

    this.keyboardHeight = new Animated.Value(0)

    this.state = {
      valid: false,
      form: {}
    }
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
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
      }),
    ]).start();
  }

  keyboardWillHide(event) {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
    ]).start();
  }

  _onClick() {
    if (this.state.valid) {

      const { number, expiry, cvc } = this.state.form.values
      const [ expMonth, expYear ] = expiry.split('/')

      this.props.checkout(number, expMonth, expYear, cvc)
    }
  }

  _onChange(form) {
    this.setState({
      form,
      valid: form.valid
    })
  }

  render() {

    const { cart } = this.props

    return (
      <Animated.View style={{ flex: 1, paddingBottom: this.keyboardHeight }}>
        <Content contentContainerStyle={ styles.content } enableAutomaticScroll={ false }>
          <Text style={ styles.creditCardLabel }>
            { this.props.t('ENTER_PAY_DETAILS') }
          </Text>
          <View style={ styles.creditCardInputContainer }>
            <LiteCreditCardInput onChange={ this._onChange.bind(this) } />
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={ this._onClick.bind(this) }>
              <Text style={ styles.payButton }>
                { this.props.t('PAY_AMOUNT', { amount: formatPrice(cart.total) }) + '€' }
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Animated.View>
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
    marginBottom: 10
  },
  creditCardInputContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#f7f7f7',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  payButton: {
    color: '#ffffff'
  }
})

function mapStateToProps(state) {
  return {
    cart: state.checkout.cart,
    address: state.checkout.address,
    date: state.checkout.date,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    clear: () => dispatch(clear()),
    checkout: (number, expMonth, expYear, cvc) => dispatch(checkout(number, expMonth, expYear, cvc)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(CreditCard))
