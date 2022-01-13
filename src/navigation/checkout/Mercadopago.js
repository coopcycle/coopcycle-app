import React, { useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { Image, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px'
import { checkoutRequest, checkoutFailure, mercadopagoCheckout } from '../../redux/Checkout/actions'

function Mercadopago({ cart, initCheckout, failedCheckout, checkout, httpClient, restaurant, navigation }) {

  async function fetchPreferenceId() {
    const { ['@id']: namespace } = cart
    return await httpClient.get(`${namespace}/mercadopago-preference`)
  }

  async function fetchMercadopagoAccount() {
    return await httpClient.get(`/restaurant/${restaurant.id}/mercadopago-account`)
  }

  async function createPayment({ preferenceId, publicKey }) {
    return await MercadoPagoCheckout.createPayment({
      publicKey,
      preferenceId,
      language: 'es',
      advancedOptions: {
        amountRowEnabled: false,
        bankDealsEnabled: false,
      },
    })
  }

  const loadMercadopago = async () => {
    try {
      const preferenceId = await fetchPreferenceId();
      const { public_key: publicKey } = await fetchMercadopagoAccount();
      const payment = await createPayment({ preferenceId, publicKey });
      checkout(payment);
    } catch (err) {
      if (err.code && err.code === 'mp:payment_cancelled') {
        // if user navigates back from MP screens we receive an error with this code
        failedCheckout(err);
        navigation.goBack();
      } else {
        // MP handles all payments errors on its screens, this handling is just for issues such as crashes
        console.error(`[Error - Mercadopago] - ${err}`);
        failedCheckout(err);
      }
    }
  }

  useEffect(() => {
    initCheckout();
    loadMercadopago();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/powered_by_mercadopago.png')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  errorsContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  errorText: {
    textAlign: 'center',
    color: '#ed2f2f',
  },
})

function createHttpClient(state) {
  const { httpClient } = state.app
  if (httpClient.credentials.token && httpClient.credentials.refreshToken) {
    return httpClient
  }

  const { token } = state.checkout

  return httpClient.cloneWithToken(token)
}

function mapStateToProps(state) {
  return {
    cart: state.checkout.cart,
    restaurant: state.checkout.restaurant,
    token: state.checkout.token,
    httpClient: createHttpClient(state),
    user: state.app.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initCheckout: () => dispatch(checkoutRequest()),
    failedCheckout: (err) => dispatch(checkoutFailure(err)),
    checkout: (payment) => dispatch(mercadopagoCheckout(payment)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Mercadopago))
