import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
})

export default ({ children, ...props }) => {

  return (
    <TouchableOpacity iconLeft full { ...props } style={ styles.container }>
      { children }
      <Icon as={ FontAwesome } name="plus" size="sm" />
    </TouchableOpacity>
  )
}


