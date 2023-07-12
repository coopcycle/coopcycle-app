import React from 'react'
import { Box, Text, Button, HStack, Pressable, Icon } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTranslation } from 'react-i18next'

function Loopeat({ requiredAmount, creditsCountCents, returnsTotalAmount }) {

  const navigation = useNavigation()
  const { t } = useTranslation()

  const missingAmount = requiredAmount - (creditsCountCents + returnsTotalAmount)

  if (missingAmount > 0) {

    return (
      <HStack p="3" justifyContent="space-between" alignItems="center">
        <Icon as={ FontAwesome } name="exclamation-triangle" size="sm" />
        <Text>{ t('CHECKOUT_LOOPEAT_INSUFFICIENT_WALLET_AMOUNT') }</Text>
        <Button size="sm" onPress={ () => navigation.navigate('CheckoutLoopeat') }>
          { t('CHECKOUT_LOOPEAT_MANAGE') }
        </Button>
      </HStack>
    )
  }

  return (
    <HStack p="3" justifyContent="space-between" alignItems="center">
      <Icon as={ FontAwesome } name="check-circle" size="sm" />
      <Text>{ t('CHECKOUT_LOOPEAT_OPTION_ENABLED') }</Text>
      <Button size="sm" onPress={ () => navigation.navigate('CheckoutLoopeat') }>
        { t('CHECKOUT_LOOPEAT_MANAGE') }
      </Button>
    </HStack>
  )
}

export default Loopeat
