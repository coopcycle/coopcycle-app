import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Icon, Text } from 'native-base'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 15,
    fontSize: 38,
    color: '#ecedec',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
})

export default ({ onPress }) => {

  const { t } = useTranslation()

  return (
    <TouchableOpacity
      style={ styles.container }
      onPress={ onPress }>
      <Icon type="FontAwesome5" name="check-circle" solid style={ styles.icon } />
      <Text style={ styles.text }>{ t('NO_TASKS') }</Text>
      <Text note>{ t('TOUCH_TO_RELOAD') }</Text>
    </TouchableOpacity>
  )
}
