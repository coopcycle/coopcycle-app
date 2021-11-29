import React from 'react'
import { View, useColorScheme } from 'react-native'

export default ({ children }) => {

  const colorScheme = useColorScheme()

  return (
    <View style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}>
      { children }
    </View>
  )
}
