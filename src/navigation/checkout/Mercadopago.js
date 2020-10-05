import React from 'react';
import { withTranslation } from 'react-i18next'
import { Image, View } from 'react-native';
import { connect } from 'react-redux'
import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px'
import { mercadopagoCheckout as checkout } from '../../redux/Checkout/actions'

function Mercadopago(props) {
  const {
    cart,
    checkout,
    country,
    currency_code: currencyId,
    httpClient,
    publicKey,
  } = props

  React.useEffect(() => {
    async function fetchPreferenceId(httpClient, cart) {
      const { ['@id']: namespace } = cart
      const res = await httpClient.get(`${namespace}/mercadopago-preference`)
      console.log(JSON.stringify(res, undefined, 4))
      return res
    }

    async function createPayment(httpClient, cart, { publicKey }) {
      const preferenceId = await fetchPreferenceId(httpClient, cart)
      const payment = await MercadoPagoCheckout.createPayment({
        publicKey,
        preferenceId,
        language: 'es',
        advancedOptions: {
          amountRowEnabled: false,
          bankDealsEnabled: false,
        }
      });
      return payment
    }
    console.log('lifecycle...')
    cart && checkout(createPayment(httpClient, cart, { publicKey }))
  }, [cart, checkout, country, currencyId, publicKey])

  console.log('IMAGE', require('../../../assets/images/powered_by_mercadopago.png'))

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Image source={require('../../../assets/images/powered_by_mercadopago.png')} />
    </View>
  )
}

function mapStateToProps(state) {
  const {
    checkout: { cart },
    app: {
      httpClient,
      settings: {
        mercadopago_publishable_key: publicKey,
        currency_code,
        country,
      }
    }
  } = state

  return {
    cart,
    country,
    currency_code,
    httpClient,
    publicKey,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    checkout: payment => dispatch(checkout(payment)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Mercadopago))
