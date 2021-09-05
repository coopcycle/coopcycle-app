import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Center, Icon } from 'native-base'
import { useTranslation } from 'react-i18next'
import Foundation from 'react-native-vector-icons/Foundation'

import FooterButton from './FooterButton'

const styles = StyleSheet.create({
  alert: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 10,
  },
  icon: {
    fontSize: 36,
    textAlign: 'center',
  },
})

const CashOnDelivery = ({ onSubmit }) => {

  const { t } = useTranslation()

  return (
    <Center flex={ 1 }>
      <View style={ styles.alert }>
        <Icon as={ Foundation } name="dollar-bill" style={ styles.icon } />
        <Text>{ t('CASH_ON_DELIVERY_DISCLAIMER') }</Text>
      </View>
      <FooterButton
        text={ t('SUBMIT') }
        onPress={ onSubmit } />
    </Center>
  )
}

export default CashOnDelivery
