import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import {
  Container, Content, Footer,
  Left, Right, Body,
  Button, Icon, List, ListItem, Text, Radio
} from 'native-base';
import Stripe from 'tipsi-stripe'
import { LiteCreditCardInput } from 'react-native-credit-card-input'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { checkout } from '../redux/Checkout/actions'
import Settings from '../Settings'
import { formatPrice } from '../Cart'

class CreditCardPage extends Component {

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
    const { width } = Dimensions.get('window')
    const { cart } = this.props

    const btnProps = this.state.loading ? { disabled: true } : {}

    const cardStyle =  {
      width: (width - 40),
      color: '#449aeb',
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 5,
    }

    return (
      <Container>
        <Content padder contentContainerStyle={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
          <Text style={{ marginBottom: 10 }}>
            { this.props.t('ENTER_PAY_DETAILS') }
          </Text>
          <LiteCreditCardInput onChange={ this._onChange.bind(this) } />
        </Content>
        <Footer>
          <Right>
            <Button onPress={ this._onClick.bind(this) } { ...btnProps }>
              <Text>{ this.props.t('PAY_AMOUNT', { amount: formatPrice(cart.total) }) + '€' }</Text>
            </Button>
          </Right>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(CreditCardPage))
