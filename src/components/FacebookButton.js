import React from 'react'
import { Button, Icon } from 'native-base'
import { useTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default ({ onPress }) => {

  const { t } = useTranslation()

  return (
    <Button
      bgColor="#4267B2"
      startIcon={ <Icon as={ FontAwesome } name="facebook-official" size="sm" /> }
      size="sm"
      onPress={ onPress }>{ t('CONNECT_WITH_FACEBOOK') }</Button>
  )
}
