import { Center } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { loadPaymentMethods } from '../../redux/Checkout/actions';
import {
  selectCart,
  selectPaymentGateway,
} from '../../redux/Checkout/selectors';
import CashComp from './components/CashOnDelivery';
import CreditCardComp from './components/CreditCard';
import PaymentMethodPicker from './components/PaymentMethodPicker';
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView';

class CreditCard extends Component {
  componentDidMount() {
    this.props.loadPaymentMethods();
  }

  _onPaymentMethodSelected(type) {
    const routesByCardGateway = {
      stripe: 'CheckoutPaymentMethodCard',
      // https://github.com/coopcycle/coopcycle-app/issues/1697
      // 'mercadopago': 'CheckoutMercadopago',
    };
    const routesByMethod = {
      cash_on_delivery: 'CheckoutPaymentMethodCashOnDelivery',
      card: routesByCardGateway[this.props.paymentGateway],
    };
    this.props.navigation.navigate(routesByMethod[type]);
  }

  render() {
    const { cart, errors, paymentMethods, paymentGateway } = this.props;

    if (!cart || paymentMethods.length === 0) {
      return <View />;
    }

    if (paymentMethods.length === 1 && paymentMethods[0].type === 'card') {
      if (paymentGateway === 'mercadopago') {
        this.props.navigation.navigate('CheckoutMercadopago');
        return null;
      }

      return (
        <HeaderHeightAwareKeyboardAvoidingView>
          <CreditCardComp cart={cart} errors={errors} />
        </HeaderHeightAwareKeyboardAvoidingView>
      );
    }

    if (
      paymentMethods.length === 1 &&
      paymentMethods[0].type === 'cash_on_delivery'
    ) {
      return <CashComp />;
    }

    return (
      <Center flex={1}>
        <PaymentMethodPicker
          methods={paymentMethods}
          onSelect={this._onPaymentMethodSelected.bind(this)}
        />
      </Center>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const cart = selectCart(state)?.cart;
  return {
    cart,
    errors: state.checkout.errors,
    paymentMethods: state.checkout.paymentMethods,
    paymentGateway: selectPaymentGateway(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPaymentMethods: () => dispatch(loadPaymentMethods()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard);
