import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, Icon } from 'native-base'
import { withTranslation } from 'react-i18next'
import { useNavigation, useRoute } from '@react-navigation/native'
import _ from 'lodash'

import { navigateToTask } from '../../../navigation/utils'

const NavButton = ({ disabled, left, right, onPress, t, task }) => {

  const buttonStyle = [ styles.button ]
  if (right) {
    buttonStyle.push(styles.buttonRight)
  }

  let buttonProps = {}
  if (!disabled) {
    buttonProps = {
      ...buttonProps,
      onPress,
    }
  }

  const iconStyle = []
  if (disabled) {
    iconStyle.push(styles.iconDisabled)
  }

  return (
    <TouchableOpacity style={ buttonStyle } { ...buttonProps }>
      { (!disabled && task && right) && <Text style={{ marginRight: 10, fontSize: 14 }}>{ t('TASK_WITH_ID', { id: task.id }) }</Text> }
      <Icon type="FontAwesome" name={ right ? 'arrow-right' : 'arrow-left' } style={ iconStyle } />
      { (!disabled && task && left) && <Text style={{ marginLeft: 10, fontSize: 14 }}>{ t('TASK_WITH_ID', { id: task.id }) }</Text> }
    </TouchableOpacity>
  )
}

const NavButtonWithTrans = withTranslation()(NavButton)

const Nav = ({ task, tasks }) => {

  const navigation = useNavigation()
  const route = useRoute()

  if (tasks.length === 0) {

    return null
  }

  const index = _.findIndex(tasks, t => t['@id'] === task['@id'])
  const isFirst = index === 0
  const isLast = index === (tasks.length - 1)

  const prev = !isFirst ? tasks[ index - 1 ] : null
  const next = !isLast ? tasks[ index + 1 ] : null

  return (
    <View style={ styles.container }>
      <NavButtonWithTrans left disabled={ isFirst }
        task={ prev }
        onPress={ () => navigateToTask(navigation, route, prev, tasks) } />
      <NavButtonWithTrans right disabled={ isLast }
        task={ next }
        onPress={ () => navigateToTask(navigation, route, next, tasks) } />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '50%',
    padding: 15,
  },
  buttonRight: {
    justifyContent: 'flex-end',
  },
  iconDisabled: {
    color: '#cccccc',
  },
})

export default Nav
