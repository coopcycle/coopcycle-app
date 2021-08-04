import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'

import CreditCardComp from './components/CreditCard'
import { checkout } from '../../redux/Checkout/actions'

class CreditCard extends Component {

  _onSubmit(values) {

    const { number, expiry, cvc, cardholderName } = values
    const [ expMonth, expYear ] = expiry.split('/')

    this.props.checkout(number, expMonth, expYear, cvc, cardholderName)
  }

  render() {

    const { cart, errors } = this.props

    if (!cart) {

      return (
        <View />
      )
    }

    return (
      <CreditCardComp cart={ cart } errors={ errors }
        onSubmit={ this._onSubmit.bind(this) } />
    )
  }
}

function mapStateToProps(state) {
  return {
    cart: state.checkout.cart,
    errors: state.checkout.errors,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    checkout: (number, expMonth, expYear, cvc) => dispatch(checkout(number, expMonth, expYear, cvc)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(CreditCard)
