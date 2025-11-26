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
  // selectCheckoutError,
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
    <style>
    #paygreen-pan-frame {
      margin-bottom: 20px;
    }
    #payButton {
      width: 100%;
      margin-bottom: 20px;
    }
    </style>
  </head>
  <body>
    <!--Paygreen-->
    <div id="paygreen-container"></div>
    <!--Paygreen-->
    <div id="paygreen-methods-container"></div>
    <div style="padding: 20px;">
      <!--Paygreen-->
      <div id="paygreen-pan-frame"></div>
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

const handlePay = () => {
  window.paygreenjs.submitPayment();
};
`;

const PGWebview = ({ ref, publicKey, loadPaymentDetails, paymentDetails, checkout }) => {

  const [paymentOrderID, setPaymentOrderID] = useState(null);
  const [objectSecret, setObjectSecret] = useState(null);

  const [authUrl, setAuthUrl] = useState(null);
  // const mainWebViewRef = useRef();
  // const authWebviewRef = useRef();

  useEffect(() => loadPaymentDetails(), [loadPaymentDetails]);

  console.log('paymentDetails', paymentDetails)

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

        // TODO Test with 3D Secure

        if (content?.type) {
          switch (content.type) {
            case 'FULL_PAYMENT_DONE':
              console.log('paymentOrderID', paymentOrderID)
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
  // paymentDetailsLoaded,
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
            // paymentDetailsLoaded={ paymentDetailsLoaded }
            paymentDetails={ paymentDetails }
            checkout={ checkout }
          />
        </View>
      </View>
      <FooterButton
        isLoading={
          false // this.state.isLoading && this.props.errors.length === 0
        }
        testID="creditCardSubmit"
        text={ t('PAY_AMOUNT', { amount: formatPrice(cart.total) }) }
        onPress={ () => {
          webViewRef.current.injectJavaScript(`
            window.paygreenjs.submitPayment();
          `);
        }
          /*_.debounce(handleSubmit, 1000, {
          leading: true,
          trailing: false,
        })*/ }
      />
    </View>
  )
}

function mapStateToProps(state) {

  const { cart } = selectCart(state);

  return {
    cart,
    paygreenPublicKey: state.app.settings.paygreen_public_key,
    // paymentDetailsLoaded: state.checkout.paymentDetailsLoaded,
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
