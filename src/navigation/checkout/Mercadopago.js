import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'
import { View } from 'react-native';
import { connect } from 'react-redux'
import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px'
import { mercadopagoCheckout as checkout } from '../../redux/Checkout/actions'

function Mercadopago(props) {

  const {
    access_token,
    cart,
    checkout,
    country,
    currency_code: currencyId,
    publicKey,
  } = props

  React.useEffect(() => {
    async function fetchPreferenceId(payer, items) {
      const response = await fetch(
        `https://api.mercadopago.com/checkout/preferences?access_token=${access_token}`,
        {
          method: 'POST',
          body: JSON.stringify({
            items,
            payer
          }),
        }
      );
      const preference = await response.json();
      return preference.id;
    }

    async function getPreferenceId(cart)  {
      const payer = {
        email: 'payer@email.com',
        identification: {
          number: '34367898',
          type: 'DNI'
        },
        name: 'APRO'
      }

      const items = cart.items.map(item => ({
        title: item.name,
        description: item.name,
        quantity: item.quantity,
        currency_id: currencyId,
        unit_price: parseFloat(item.unitPrice / Math.pow(10, 2)),
      }))

      return await fetchPreferenceId(payer, items)
    }

    async function createPayment(cart, { publicKey }) {
      const preferenceId = await getPreferenceId(cart)

      const payment = await MercadoPagoCheckout.createPayment({
        publicKey,
        preferenceId,
        language: 'es'
      });
      return payment
    }

    checkout(createPayment(cart, { publicKey }))
  }, [access_token, cart, checkout, country, currencyId, publicKey])

  return (
    <View />
  )
}

function mapStateToProps(state) {
  const {
    checkout: { cart },
    app: {
      settings: {
        mercadopago_publishable_key: publicKey,
        mercadopago_access_token: access_token,
        currency_code,
        country,
      }
    }
  } = state

  return {
    access_token,
    cart,
    country,
    currency_code,
    publicKey,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    checkout: payment => dispatch(checkout(payment)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Mercadopago))
