import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import { Center } from 'native-base';

import CreditCardComp from './components/CreditCard'
import CashComp from './components/CashOnDelivery'
import PaymentMethodPicker from './components/PaymentMethodPicker'
import { checkout, checkoutWithCash, loadPaymentMethods } from '../../redux/Checkout/actions'

class CreditCard extends Component {

  _onSubmitCard(values) {

    const { cardholderName } = values

    this.props.checkout(cardholderName)
  }

  _onSubmitCash() {
    this.props.checkoutWithCash()
  }

  componentDidMount() {
    this.props.loadPaymentMethods()
  }

  _onPaymentMethodSelected(type) {
    const routesByCardGateway = {
      'stripe': 'CheckoutPaymentMethodCard',
      'mercadopago': 'CheckoutMercadopago',
    };
    const routesByMethod = {
      'cash_on_delivery': 'CheckoutPaymentMethodCashOnDelivery',
      'card': routesByCardGateway[this.props.paymentGateway],
    };
    this.props.navigation.navigate(routesByMethod[type]);
  }

  render() {

    const { cart, errors, paymentMethods, paymentGateway } = this.props

    if (!cart || paymentMethods.length === 0) {

      return (
        <View />
      )
    }

    if (paymentMethods.length === 1 && paymentMethods[0].type === 'card') {
      if (paymentGateway === 'mercadopago') {
        this.props.navigation.navigate('CheckoutMercadopago');
        return null;
      }

      return (
        <CreditCardComp cart={ cart } errors={ errors }
          onSubmit={ this._onSubmitCard.bind(this) } />
      )
    }

    if (paymentMethods.length === 1 && paymentMethods[0].type === 'cash_on_delivery') {
      return (
        <CashComp
          onSubmit={ this._onSubmitCash.bind(this) } />
      )
    }

    return (
      <Center flex={ 1 }>
        <PaymentMethodPicker
          methods={ paymentMethods }
          onSelect={ this._onPaymentMethodSelected.bind(this) } />
      </Center>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const restaurantID = state.checkout.restaurant;
  const cart = state.checkout.carts[restaurantID].cart || ownProps.route.params?.cart || state.checkout.cart
  return {
    cart,
    errors: state.checkout.errors,
    paymentMethods: state.checkout.paymentMethods,
    paymentGateway: state.app.settings.payment_gateway,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    checkout: (cardholderName) => dispatch(checkout(cardholderName)),
    loadPaymentMethods: () => dispatch(loadPaymentMethods()),
    checkoutWithCash: () => dispatch(checkoutWithCash()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard)
