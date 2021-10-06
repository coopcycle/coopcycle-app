import React from 'react'
import { withTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'
import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px'
import { mercadopagoCheckout } from '../../redux/Checkout/actions'

function Mercadopago({ cart, checkout, country, httpClient, restaurant }) {

  React.useEffect(() => {
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

    cart && Promise.all([fetchPreferenceId(), fetchMercadopagoAccount()])
    .then(([preferenceId, { public_key: publicKey }]) => {
      checkout({
        payment: createPayment({ preferenceId, publicKey }),
        preferenceId,
      })
    })
  }, [cart, checkout, country, restaurant, httpClient])

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Image source={require('../../../assets/images/powered_by_mercadopago.png')} />
    </View>
  )
}

function mapStateToProps(state) {
  const {
    checkout: { cart, restaurant },
    app: {
      httpClient,
      settings: {
        country,
      },
    },
  } = state

  return { cart, country, httpClient, restaurant }
}

function mapDispatchToProps(dispatch) {
  return {
    checkout: ({payment, preferenceId}) => dispatch(mercadopagoCheckout({payment, preferenceId})),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Mercadopago))
