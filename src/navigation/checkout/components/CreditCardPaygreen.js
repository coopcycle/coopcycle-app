import _ from 'lodash';
import { Button, Center, Checkbox, Input, Radio, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import WebView from 'react-native-webview';

import {
  loadPaymentDetails,
} from '../../../redux/Checkout/actions';
import { formatPrice } from '../../../utils/formatting';
import FooterButton from './FooterButton';

const CreditCardPaygreen = ({ baseURL, paymentDetails, loadPaymentDetails, cart, onSubmit }) => {

  const webViewRef = useRef(null)

  const [ paymentOrderID, setPaymentOrderId ] = useState(null)

  const { t } = useTranslation();

  useEffect(() => {
    loadPaymentDetails()
  }, []);

  console.log('paymentDetails', paymentDetails)

  if (!paymentDetails?.paygreenWebviewUrl) {
    return <Text>LOADING</Text>
  }

  return (
    <>
      <WebView ref={ webViewRef }
        cacheEnabled={ false }
        source={{ uri: `${paymentDetails.paygreenWebviewUrl}?t=${Date.now()}` }}
        onMessage={ ({ nativeEvent }) => {

          let content = null;
          if (nativeEvent?.data) {
            try {
              content = JSON.parse(nativeEvent?.data);
            } catch (e) {
              content = nativeEvent?.data;
            }
          }

          console.log('POST MESSAGE', content);

          if (content.type === 'SET_PAYMENT_ORDER_ID') {
            setPaymentOrderId(content.detail)
          }

          if (content.type === 'FULL_PAYMENT_DONE') {
            onSubmit({
              cardholderName: '',
              savedCardSelected: null,
              saveCard: false,
              paygreenPaymentOrderId: paymentOrderID
            })
          }

        }} />
      <FooterButton
        isDisabled={ false }
        testID="creditCardSubmit"
        text={t('PAY_AMOUNT', {
          amount: formatPrice(cart.total),
        })}
        onPress={ () => {
          webViewRef.current.postMessage(JSON.stringify({ type: 'SUBMIT' }))
        }}
      />
    </>
  )
}

function mapStateToProps(state) {

  return {
    baseURL: state.app.baseURL,
    paymentDetailsLoaded: state.checkout.paymentDetailsLoaded,
    paymentDetails: state.checkout.paymentDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPaymentDetails: () => dispatch(loadPaymentDetails()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreditCardPaygreen);
