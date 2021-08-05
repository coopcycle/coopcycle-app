import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Content } from 'native-base'
import { useTranslation } from 'react-i18next'

import FooterButton from './FooterButton'

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const CashOnDelivery = ({ onSubmit }) => {

  const { t } = useTranslation()

  return (
    <View style={{ flex: 1 }}>
      <Content contentContainerStyle={ styles.content } padder>
        <Text>{ t('CASH_ON_DELIVERY_DISCLAIMER') }</Text>
      </Content>
      <FooterButton
        text={ t('SUBMIT') }
        onPress={ onSubmit } />
    </View>
  )
}

export default CashOnDelivery
