import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'native-base'
import Foundation from 'react-native-vector-icons/Foundation'
import { useTranslation } from 'react-i18next'
import material from '../../native-base-theme/variables/material'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: material.contentPadding,
    marginBottom: 10,
  },
});

const paymentMethods = {
  CARD: {
    icon: 'credit-card',
    description: 'card'
  },
  CASH_ON_DELIVERY: {
    icon: 'dollar-bill',
    description: 'cash_on_delivery'
  },
}

export const loadIconKey = (paymentMethod) => paymentMethods[paymentMethod]?.icon

export const loadDescriptionTranslationKey = (paymentMethod) => `PAYMENT_METHOD.${paymentMethods[paymentMethod]?.description}`

export const isKnownPaymentMethod = (paymentMethod) => Object.prototype.hasOwnProperty.call(paymentMethods, paymentMethod)

export const PaymentMethodInfo = ({ fullDetail, paymentMethod }) => {
  const { t } = useTranslation()

  if (!isKnownPaymentMethod(paymentMethod)) {
    return null
  }

  if (!fullDetail) {
    return <Icon as={Foundation} name={ loadIconKey(paymentMethod) } />
  }

  return (
    <View style={styles.container}>
      <Icon as={Foundation} name={ loadIconKey(paymentMethod) } />
      <Text>{t(loadDescriptionTranslationKey(paymentMethod))}</Text>
    </View>
  )
}
