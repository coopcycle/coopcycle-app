import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native'
import KeyboardAdjustResizeViewIOS from './KeyboardAdjustResizeViewIOS'

export default function KeyboardAdjustView({
  children,
  style,
  hint,
  ...props
}) {
  const [ viewHeight, setViewHeight ] = useState(0)

  const windowDimensions = useWindowDimensions()

  const onLayout = event => {
    const currentFrame = event.nativeEvent.layout
    if (!viewHeight) {
      setViewHeight(currentFrame.height)
    }
  }

  if (Platform.OS === 'android') {
    // on Android we rely on the OS to adjust the view
    // and put focused text input above the keyboard

    const topOffset = windowDimensions.height - viewHeight // status bar (~24) + toolbar (~56)

    // extra View is a workaround for this issue: https://github.com/facebook/react-native/issues/35599
    return (
      <View style={style} onLayout={onLayout}>
        <KeyboardAvoidingView
          style={style}
          keyboardVerticalOffset={topOffset}
          behavior={'padding'}>
          {children}
        </KeyboardAvoidingView>
      </View>
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

    /**
     * FIXME: iosAvoidOffset is a workaround for the first text input field
     *  being pushed up too high on iOS (by AvoidSoftInputView) when the keyboard appears, making it invisible.
     */
    let iosAvoidOffset = 0
    if (hint && hint.presentation === 'modal') {
      iosAvoidOffset = -1 * (windowDimensions.height - viewHeight)
    }

    return (
      <KeyboardAdjustResizeViewIOS
        style={style}
        onLayout={onLayout}
        iosAvoidOffset={iosAvoidOffset}
        {...props}>
        {children}
      </KeyboardAdjustResizeViewIOS>
    )
  } else {
    return <View style={style}>{children}</View>
  }
}
