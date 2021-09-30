import React from 'react'
import { withTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'
import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px'
import { mercadopagoCheckout } from '../../redux/Checkout/actions'

function Mercadopago({ cart, checkout, country, httpClient, publicKey }) {

  React.useEffect(() => {
    async function fetchPreferenceId() {
      const { ['@id']: namespace } = cart
      return await httpClient.get(`${namespace}/mercadopago-preference`)
    }

    async function createPayment({ preferenceId }) {
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

    cart && fetchPreferenceId()
    .then(preferenceId => {
      checkout({
        payment: createPayment({ preferenceId }),
        preferenceId,
      })
    })
  }, [cart, checkout, country, publicKey, httpClient])

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
        country,
      },
    },
  } = state

  return { cart, country, httpClient, publicKey }
}

function mapDispatchToProps(dispatch) {
  return {
    checkout: ({payment, preferenceId}) => dispatch(mercadopagoCheckout({payment, preferenceId})),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Mercadopago))
