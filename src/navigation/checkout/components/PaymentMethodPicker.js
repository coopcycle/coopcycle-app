import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Icon, Text } from 'native-base'
import Foundation from 'react-native-vector-icons/Foundation'

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
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

  return (
    <View>
      <Text style={ styles.heading }>{ t('SELECT_PAYMENT_METHOD') }</Text>
      <View>
        { methods.map(method => (
          <TouchableOpacity key={ method.type }
            style={ styles.button }
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
