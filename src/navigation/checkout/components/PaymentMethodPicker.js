import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Icon, Text, useColorMode } from 'native-base'
import Foundation from 'react-native-vector-icons/Foundation'

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 5,
  },
})

const icons = {
  card: 'credit-card',
  cash_on_delivery: 'dollar-bill',
}

const PaymentMethodPicker = ({ methods, onSelect }) => {

  const { t } = useTranslation()
  const { colorMode } = useColorMode()

  return (
    <View>
      <Text style={ styles.heading }>{ t('SELECT_PAYMENT_METHOD') }</Text>
      <View>
        { methods.map(method => (
          <TouchableOpacity key={ method.type }
            style={ [styles.button, { backgroundColor: colorMode === 'dark' ? '#3f3f3f' : '#f7f7f7' }] }
            onPress={ () => onSelect(method.type) }>
            <Icon as={Foundation} name={ icons[method.type] } style={ styles.buttonIcon } />
            <Text>{ t(`PAYMENT_METHOD.${method.type}`) }</Text>
          </TouchableOpacity>
        )) }
      </View>
    </View>
  )
}

export default PaymentMethodPicker
