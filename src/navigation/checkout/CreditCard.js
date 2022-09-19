import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import { Center } from 'native-base';

import CreditCardComp from './components/CreditCard'
import CashComp from './components/CashOnDelivery'
import PaymentMethodPicker from './components/PaymentMethodPicker'
import { checkout, checkoutWithCash, loadPaymentMethods } from '../../redux/Checkout/actions'
import { selectCart, selectRestaurant } from '../../redux/Checkout/selectors';
import TimingModal from './components/TimingModal';

class CreditCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    }
    console.log(props)
  }
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

  _renderPaymentForm() {

    const { cart, errors, paymentMethods, paymentGateway } = this.props
    const { disabled } = this.state

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
        <CreditCardComp disabled={disabled} cart={ cart } errors={ errors }
          onSubmit={ this._onSubmitCard.bind(this) } />
      )
    }

    if (paymentMethods.length === 1 && paymentMethods[0].type === 'cash_on_delivery') {
      return (
        <CashComp
          disabled={disabled}
          onSubmit={ this._onSubmitCash.bind(this) } />
      )
    }

    return (
      <Center flex={ 1 }>
        <PaymentMethodPicker
          disabled={disabled}
          methods={ paymentMethods }
          onSelect={ this._onPaymentMethodSelected.bind(this) } />
      </Center>
    )
  }

  render() {
    return <>
      {this._renderPaymentForm()}
      <TimingModal
        restaurant={this.props.restaurant}
        onOpen={() => this.setState({ disabled:false })}
        onClose={() => this.setState({ disabled:true })}
      />
    </>
  }
}

function mapStateToProps(state, ownProps) {
  const cart = selectCart(state)?.cart
  const restaurant = selectRestaurant(state)
  return {
    cart,
    restaurant,
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
