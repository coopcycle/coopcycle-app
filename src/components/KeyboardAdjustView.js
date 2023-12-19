import React from 'react'
import { Platform, View } from 'react-native'
import KeyboardAdjustResizeViewIOS from './KeyboardAdjustResizeViewIOS'

export default function KeyboardAdjustView({ children, style, ...props }) {
  if (Platform.OS === 'android') {
    // on Android we rely on the platform to adjust the view
    // and put focused text input above the keyboard
    return (
      <View style={style} {...props}>
        {children}
      </View>
    )
  } else if (Platform.OS === 'ios') {
    // on iOS we need to adjust the view manually
    return (
      <KeyboardAdjustResizeViewIOS style={style} {...props}>
        {children}
      </KeyboardAdjustResizeViewIOS>
    )
  } else {
    return <View style={style}>{children}</View>
  }
}
