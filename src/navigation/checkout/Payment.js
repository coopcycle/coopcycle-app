import React, { useCallback, useEffect } from 'react';
import { Center } from 'native-base';
import { Linking, View } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import parseUrl from 'url-parse';

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

const routesByCardGateway = {
  stripe: 'CheckoutPaymentMethodCard',
  // https://github.com/coopcycle/coopcycle-app/issues/1697
  // 'mercadopago': 'CheckoutMercadopago',
};

const inAppBrowserOptions = {}

const CreditCard = ({ cart, paymentMethods, paymentGateway, loadPaymentMethods, setPaymentMethod }) => {

  const navigation = useNavigation();

  const onPaymentMethodSelected = useCallback((type) => {
    const cardRoute = Object.prototype.hasOwnProperty.call(routesByCardGateway, paymentGateway) ?
      routesByCardGateway[paymentGateway] : 'CheckoutPaymentMethodCard';

    const routesByMethod = {
      cash_on_delivery: 'CheckoutPaymentMethodCashOnDelivery',
      card: cardRoute,
      edenred: 'CheckoutPaymentMethodEdenred',
      'edenred+card': 'CheckoutPaymentMethodEdenred',
    };

    setPaymentMethod(type, async (result) => {
      if (result.redirectUrl) {
        try {
          if (await InAppBrowser.isAvailable()) {
            // https://github.com/proyecto26/react-native-inappbrowser/issues/131#issuecomment-663492025
            await InAppBrowser.closeAuth();
            InAppBrowser.openAuth(result.redirectUrl, 'coopcycle://', inAppBrowserOptions)
              .then((response) => {
                if (response.type === 'success' && response.url) {
                  const { hostname, pathname } = parseUrl(response.url, true);
                  if (hostname === 'paygreen' && (pathname === '/cancel' || pathname === '/return')) {
                    Linking.openURL(response.url)
                  }
                }
              });
          } else {
            Linking.openURL(result.redirectUrl);
          }
        } catch (e) {
          Linking.openURL(result.redirectUrl);
        }
      } else {
        navigation.navigate(routesByMethod[type]);
      }
    })
  }, []);

  useEffect(() => {
    loadPaymentMethods();
  }, [ loadPaymentMethods ])

  if (!cart || paymentMethods.length === 0) {
    return <View />;
  }

  if (paymentMethods.length === 1 && paymentMethods[0].type === 'card') {
    if (paymentGateway === 'mercadopago') {
      navigation.navigate('CheckoutMercadopago');
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
        onSelect={onPaymentMethodSelected}
      />
    </Center>
  );
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
