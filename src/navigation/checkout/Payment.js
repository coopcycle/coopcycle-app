import React, { Component } from 'react';
import { Center } from 'native-base';
import { Linking, View } from 'react-native';
import { connect } from 'react-redux';

import {
  loadPaymentMethods,
  setPaymentMethod
} from '../../redux/Checkout/actions';
import {
  selectCart,
  selectPaymentGateway,
} from '../../redux/Checkout/selectors';

import CashComp from './components/CashOnDelivery';
import CreditCardComp from './components/CreditCard';
import PaymentMethodPicker from './components/PaymentMethodPicker';
import HeaderHeightAwareKeyboardAvoidingView from '../../components/HeaderHeightAwareKeyboardAvoidingView';
import { SafeAreaView } from 'react-native-safe-area-context';

class CreditCard extends Component {
  componentDidMount() {
    this.props.loadPaymentMethods();
  }

  _onPaymentMethodSelected(type) {

    const routesByCardGateway = {
      stripe: 'CheckoutPaymentMethodCard',
      paygreen: 'CheckoutPaymentMethodCard',
      // https://github.com/coopcycle/coopcycle-app/issues/1697
      // 'mercadopago': 'CheckoutMercadopago',
    };

    const cardRoute = Object.prototype.hasOwnProperty.call(routesByCardGateway, this.props.paymentGateway) ?
      routesByCardGateway[this.props.paymentGateway] : 'CheckoutPaymentMethodCard';

    const routesByMethod = {
      cash_on_delivery: 'CheckoutPaymentMethodCashOnDelivery',
      card: cardRoute,
      edenred: 'CheckoutPaymentMethodEdenred',
      'edenred+card': 'CheckoutPaymentMethodEdenred',
    };

    this.props.setPaymentMethod(type, (result) => {
      if (result.redirectUrl) {
        Linking.openURL(result.redirectUrl);
      } else {
        this.props.navigation.navigate(routesByMethod[type]);
      }
    })
  }

  render() {
    const { cart, paymentMethods, paymentGateway } = this.props;

    if (!cart || paymentMethods.length === 0) {
      return <View />;
    }

    if (paymentMethods.length === 1 && paymentMethods[0].type === 'card') {
      if (paymentGateway === 'mercadopago') {
        this.props.navigation.navigate('CheckoutMercadopago');
        return null;
      }

      return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <HeaderHeightAwareKeyboardAvoidingView>
            <CreditCardComp cart={cart} />
          </HeaderHeightAwareKeyboardAvoidingView>
        </SafeAreaView>
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
    paymentMethods: state.checkout.paymentMethods,
    paymentGateway: selectPaymentGateway(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPaymentMethods: () => dispatch(loadPaymentMethods()),
    setPaymentMethod: (paymentMethod, cb) => dispatch(setPaymentMethod(paymentMethod, cb)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard);
