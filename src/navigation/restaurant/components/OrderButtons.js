import React, { Component } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import { Icon, Text, Button } from 'native-base'
import { phonecall } from 'react-native-communications'

const phoneNumberUtil = PhoneNumberUtil.getInstance()

const Comp = ({ order, isPrinterConnected, onPrinterClick, printOrder }) => {

  const { t } = useTranslation()

  let phoneNumber
  let isPhoneValid = false

  try {
    phoneNumber = phoneNumberUtil.parse(order.customer.telephone)
    isPhoneValid = true
  } catch (e) {}

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
      <View style={{ width: '50%', paddingRight: 5 }}>
        { isPrinterConnected && (
        <Button small iconRight onPress={ printOrder }>
          <Text>{ t('RESTAURANT_ORDER_PRINT') }</Text>
          <Icon type="FontAwesome" name="print" />
        </Button>
        )}
        { !isPrinterConnected && (
        <Button small light iconRight onPress={ onPrinterClick }>
          <Text>{ t('RESTAURANT_ORDER_PRINT') }</Text>
          <Icon type="FontAwesome" name="print" />
        </Button>
        )}
      </View>
      <View style={{ width: '50%', paddingLeft: 5 }}>
        { isPhoneValid && (
        <Button small iconLeft success
          onPress={ () => phonecall(order.customer.telephone, true) }>
          <Icon name="call" />
          <Text>{ phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL) }</Text>
        </Button>
        )}
      </View>
    </View>
  )
}

export default Comp
