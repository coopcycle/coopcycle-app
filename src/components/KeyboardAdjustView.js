import React from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import KeyboardAdjustResizeViewIOS from './KeyboardAdjustResizeViewIOS'

export default function KeyboardAdjustView({ children, style, ...props }) {
  if (Platform.OS === 'android') {
    // on Android we rely on the OS to adjust the view
    // and put focused text input above the keyboard

    const topOffset = 80 // status bar (24) + toolbar (56)
    return (
      <KeyboardAvoidingView
        style={style}
        keyboardVerticalOffset={topOffset}
        behavior={'padding'}>
        {children}
      </KeyboardAvoidingView>
    )

    // FIXME:
    //  we current have both android:windowSoftInputMode="adjustPan" and KeyboardAvoidingView,
    //  which are conflicting in some situations.
    //  I propose to switch to android:windowSoftInputMode="adjustResize"
    //  which is the default one for React Native,
    //  then we can fully rely on the OS and get rid of KeyboardAvoidingView on Android
    //  we will need to test all screens that have a text input
    //  and also apply this fix: https://github.com/react-navigation/react-navigation/issues/10715#issuecomment-1852564585

    // return (
    //   <View style={style} {...props}>
    //     {children}
    //   </View>
    // )
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
