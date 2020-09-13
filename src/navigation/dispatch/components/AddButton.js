import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Icon, Button } from 'native-base'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
})

export default ({ children, ...props }) => {

  return (
    <TouchableOpacity iconLeft full { ...props } style={ styles.container }>
      { children }
      <Icon type="FontAwesome" name="plus" style={{ fontSize: 24 }} />
    </TouchableOpacity>
  )
}


