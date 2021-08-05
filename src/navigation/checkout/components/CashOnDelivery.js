import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Content, Icon } from 'native-base'
import { useTranslation } from 'react-i18next'

import FooterButton from './FooterButton'

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    <View style={{ flex: 1 }}>
      <Content contentContainerStyle={ styles.content } padder>
        <View style={ styles.alert }>
          <Icon type="Foundation" name="dollar-bill" style={ styles.icon } />
          <Text>{ t('CASH_ON_DELIVERY_DISCLAIMER') }</Text>
        </View>
      </Content>
      <FooterButton
        text={ t('SUBMIT') }
        onPress={ onSubmit } />
    </View>
  )
}

export default CashOnDelivery
