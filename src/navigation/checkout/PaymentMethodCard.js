import React, { Component } from 'react'
import { connect } from 'react-redux'

import { checkout } from '../../redux/Checkout/actions'
import CreditCard from './components/CreditCard'

class PaymentMethodCard extends Component {

  _onSubmit(values) {

    const { number, expiry, cvc, cardholderName } = values
    const [ expMonth, expYear ] = expiry.split('/')

    this.props.checkout(number, expMonth, expYear, cvc, cardholderName)
  }

  render() {

    const { cart, errors } = this.props

    return (
      <CreditCard cart={ cart } errors={ errors }
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
    checkout: (number, expMonth, expYear, cvc, cardholderName) => dispatch(checkout(number, expMonth, expYear, cvc, cardholderName)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodCard)
