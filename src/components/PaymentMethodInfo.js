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

export const loadIconKey = (paymentMethod) => {
  const icons = {
    CARD: 'credit-card',
    CASH_ON_DELIVERY: 'dollar-bill',
  };
  return icons[paymentMethod]
}

export const loadDescriptionTranslationKey = (paymentMethod) => {
  const description = {
    CARD: 'card',
    CASH_ON_DELIVERY: 'cash_on_delivery',
  }
  return `PAYMENT_METHOD.${description[paymentMethod]}`
}

export const PaymentMethodInfo = ({ fullDetail, paymentMethod }) => {
  const { t } = useTranslation()

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
