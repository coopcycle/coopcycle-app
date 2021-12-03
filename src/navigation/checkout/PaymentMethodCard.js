import React, { Component } from 'react'
import { connect } from 'react-redux'

import { checkout } from '../../redux/Checkout/actions'
import CreditCard from './components/CreditCard'

class PaymentMethodCard extends Component {

  _onSubmit(values) {

    const { cardholderName } = values

    this.props.checkout(cardholderName)
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
    checkout: (cardholderName) => dispatch(checkout(cardholderName)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodCard)
