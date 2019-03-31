import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import {
  Container, Content, Footer, FooterTab,
  Button, Icon, List, ListItem, Text
} from 'native-base';
import Stripe from 'tipsi-stripe'
import { LiteCreditCardInput } from 'react-native-credit-card-input'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import { checkout } from '../../redux/Checkout/actions'
import Settings from '../../Settings'
import { formatPrice } from '../../Cart'

class CreditCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      form: {}
    };
  }

  componentDidMount() {
    Stripe.setOptions({
      publishableKey: Settings.get('stripe_publishable_key'),
    });
  }

  _onClick() {
    if (this.state.valid) {

      const { number, expiry, cvc } = this.state.form.values
      const [ expMonth, expYear ] = expiry.split('/')

      const params = {
        number,
        expMonth: parseInt(expMonth, 10),
        expYear: parseInt(expYear, 10),
        cvc
      }

      Stripe.createTokenWithCard(params)
        .then(token => this.props.checkout(token))
        .catch(err => console.log(err));
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
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Content contentContainerStyle={ styles.content }>
          <View style={{ alignSelf: 'stretch' }}>
            <Text style={{ textAlign: 'center', marginBottom: 10 }}>
              { this.props.t('ENTER_PAY_DETAILS') }
            </Text>
            <View style={ styles.creditCardInputContainer }>
              <LiteCreditCardInput onChange={ this._onChange.bind(this) } />
            </View>
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={ this._onClick.bind(this) }>
              <Text style={{ color: '#ffffff' }}>
                { this.props.t('PAY_AMOUNT', { amount: formatPrice(cart.total) }) + '€' }
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  creditCardInputContainer: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    checkout: token => dispatch(checkout(token)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(CreditCard))
