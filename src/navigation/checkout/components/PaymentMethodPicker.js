import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from 'native-base'

const styles = StyleSheet.create({
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#a94442',
    padding: 15,
    marginBottom: 10,
  },
})

const PaymentMethodPicker = ({ methods, onSelect }) => {

  const { t } = useTranslation()

  return (
    <View>
      <Text style={{ textAlign: 'center', marginBottom: 10 }}>{ t('SELECT_PAYMENT_METHOD') }</Text>
      <View>
        { methods.map(method => (
          <TouchableOpacity style={ styles.button }
            onPress={ () => onSelect(method.type) }>
            <Text>{ t(`PAYMENT_METHOD.${method.type}`) }</Text>
          </TouchableOpacity>
        )) }
      </View>
    </View>
  )
}

export default PaymentMethodPicker
