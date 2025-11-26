import React from 'react';
import { connect } from 'react-redux';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

import { useRef, useState, useEffect } from "react";
import { Button, View } from "react-native";
import WebView from "react-native-webview";

import {
  loadPaymentDetails,
  checkout,
} from '../../../../redux/Checkout/actions';
import {
  selectCart,
} from '../../../../redux/Checkout/selectors';
import { formatPrice } from '../../../../utils/formatting';

import FooterButton from '../FooterButton';

const PGJS_URL = __DEV__ ? "https://sb-pgjs.paygreen.fr/latest" : "https://pgjs.paygreen.fr/latest";

const HTML = `
<!DOCTYPE html>
<html>
  <head>
    <title>CoopCycle - Pay with PayGreen</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!--Paygreen Payement Integration-->
    <script
      defer
      type="text/javascript"
      src="${PGJS_URL}/paygreen.min.js"
    ></script>
    <link
      href="${PGJS_URL}/paygreen.min.css"
      type="text/css"
      rel="stylesheet"
    />
  </head>
  <body>
    <!--Paygreen-->
    <div id="paygreen-container"></div>
    <!--Paygreen-->
    <div id="paygreen-methods-container"></div>
    <div style="padding: 20px;">
      <!--Paygreen-->
      <div style="margin-bottom: 20px;">
        <div id="paygreen-pan-frame"></div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="margin-right: 5px">
          <div id="paygreen-exp-frame"></div>
        </div>
        <div id="paygreen-cvv-frame"></div>
      </div>
      <!--Paygreen-->
      <!--
      <div id="paygreen-reuse-checkbox-container"></div>
      -->
    </div>
  </body>
</html>
`;

// We added the new event ON_OPEN_POPUP to handle the request of opening a popup
const javascriptToInject = `
window.paygreenjs.attachEventListener(
  window.paygreenjs.Events.ERROR,
  (event) => {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: "ERROR", detail: event.detail}))
  }
);

window.paygreenjs.attachEventListener(
  window.paygreenjs.Events.FULL_PAYMENT_DONE,
  (event) => {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: "FULL_PAYMENT_DONE", detail: event.detail}))
  }
);

window.paygreenjs.init({
  publicKey: '%publicKey%',
  paymentOrderID: '%paymentOrderID%',
  objectSecret: '%objectSecret%',
  mode: 'payment',
  paymentMethod: 'bank_card',
  displayAuthentication: 'inline'
});
`;

const PGWebview = ({ ref, publicKey, loadPaymentDetails, paymentDetails, checkout }) => {

  const [paymentOrderID, setPaymentOrderID] = useState(null);
  const [objectSecret, setObjectSecret] = useState(null);

  const [authUrl, setAuthUrl] = useState(null);

  useEffect(() => loadPaymentDetails(), [loadPaymentDetails]);

  if ((!paymentOrderID && !objectSecret) && paymentDetails?.payments?.length === 1) {
    setPaymentOrderID(paymentDetails.payments[0].paygreenPaymentOrderId);
    setObjectSecret(paymentDetails.payments[0].paygreenObjectSecret);
  }

  if (paymentOrderID && objectSecret) {

    const handleWebViewMessage = ({ nativeEvent }) => {

      let content = null;
      if (nativeEvent?.data) {
        try {
          content = JSON.parse(nativeEvent?.data);
        } catch (e) {
          content = nativeEvent?.data;
        }

        if (content?.type) {
          switch (content.type) {
            case 'FULL_PAYMENT_DONE':
              checkout(paymentOrderID);
              break;
          }
        }
      }
    };

    const injectedJavaScript = javascriptToInject
      .replace('%publicKey%', publicKey)
      .replace('%paymentOrderID%', paymentOrderID)
      .replace('%objectSecret%', objectSecret)

    return (
      <WebView
        source={{
          html: HTML,
          baseUrl: "http://localhost",
        }}
        ref={ref}
        onMessage={handleWebViewMessage}
        injectedJavaScript={injectedJavaScript}
        javaScriptCanOpenWindowsAutomatically={true}
        onError={(err) => {
          console.log(err);
        }}
      />
    );

  }

  return null
};

const Paygreen = ({
  cart,
  paygreenPublicKey,
  loadPaymentDetails,
  paymentDetails,
  checkout,
}) => {

  const { t } = useTranslation()
  const webViewRef = useRef();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-between'
    }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: '33.3333%',
          }}>
          <Text className="text-center mb-3">{ t('ENTER_PAY_DETAILS') }</Text>
          <PGWebview
            ref={ webViewRef }
            publicKey={ paygreenPublicKey }
            loadPaymentDetails={ loadPaymentDetails }
            paymentDetails={ paymentDetails }
            checkout={ checkout }
          />
        </View>
      </View>
      <FooterButton
        isLoading={false}
        testID="creditCardSubmit"
        text={ t('PAY_AMOUNT', { amount: formatPrice(cart.total) }) }
        onPress={ () => {
          webViewRef.current.injectJavaScript(`
            window.paygreenjs.submitPayment();
          `);
        }}
      />
    </View>
  )
}

function mapStateToProps(state) {

  const { cart } = selectCart(state);

  return {
    cart,
    paygreenPublicKey: state.app.settings.paygreen_public_key,
    paymentDetails: state.checkout.paymentDetails,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPaymentDetails: () => dispatch(loadPaymentDetails()),
    checkout: (paymentOrderID) => dispatch(checkout('', null, false, paymentOrderID)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Paygreen);
