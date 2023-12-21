import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native'
import { AvoidSoftInputView } from 'react-native-avoid-softinput'

/**
 *
 * @param children; one of the child should be a ScrollView
 * @param style
 */
export default function KeyboardAdjustView({
  children,
  style,
  androidBehavior = 'padding', // FIXME: try to avoid using this prop; see the comment below
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
    // on Android we rely on the OS to put focused text input above the keyboard

    const topOffset = windowDimensions.height - viewHeight // status bar (~24) + toolbar (~56)

    // extra View is a workaround for this issue: https://github.com/facebook/react-native/issues/35599
    return (
      <View style={style} onLayout={onLayout}>
        <KeyboardAvoidingView
          style={style}
          keyboardVerticalOffset={topOffset}
          behavior={androidBehavior}>
          {children}
        </KeyboardAvoidingView>
      </View>
    )

    // FIXME:
    //  we current have both android:windowSoftInputMode="adjustPan" and KeyboardAvoidingView,
    //  which are conflicting in some situations.
    //  I propose to switch to android:windowSoftInputMode="adjustResize"
    //  which is the default one for React Native,
    //  then we can fully rely on the OS to adjust the view and put the focused text input above the keyboard
    //  and then we can get rid of KeyboardAvoidingView on Android
    //  we will need to test all screens that have a text input
    //  and also apply this fix: https://github.com/react-navigation/react-navigation/issues/10715#issuecomment-1852564585

    // return (
    //   <View style={style} {...props}>
    //     {children}
    //   </View>
    // )
  } else if (Platform.OS === 'ios') {
    // on iOS we need to adjust the view and put the focused text input above the keyboard manually

    const topOffset = windowDimensions.height - viewHeight

    /**
     * FIXME: iosAvoidOffset is a workaround for some text input fields
     *  being pushed up too high on iOS by AvoidSoftInputView when the keyboard appears,
     *  making them invisible.
     *
     *  This is happening because AvoidSoftInputView is trying to apply an offset
     *  to compensate for the part of the ScrollView that is hidden by the keyboard.
     *  But in our case the View is resize, thus no part of it is hidden.
     *  It seems that AvoidSoftInputView is not taking this into account.
     *
     *  If iosAvoidOffset is larger than the offset calculated by AvoidSoftInputView,
     *  then no offset is applied (this is what we want here).
     */
    const avoidOffset = -1 * windowDimensions.height

    return (
      // extra View is a workaround for this issue: https://github.com/facebook/react-native/issues/35599
      <View style={style} onLayout={onLayout}>
        <KeyboardAvoidingView
          style={style}
          keyboardVerticalOffset={topOffset}
          behavior={'height'}>
          <AvoidSoftInputView style={style} avoidOffset={avoidOffset}>
            {children}
          </AvoidSoftInputView>
        </KeyboardAvoidingView>
      </View>
    )
  } else {
    return <View style={style}>{children}</View>
  }
}
