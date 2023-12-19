import React, { useState } from 'react'
import { LayoutAnimation, StyleSheet } from 'react-native'
import {
  AvoidSoftInputView,
  useSoftInputHeightChanged,
} from 'react-native-avoid-softinput'

// based on the KeyboardAvoidingView from react-native with behavior="height"

const duration = 250

export default function KeyboardAdjustResizeViewIOS({
  children,
  style,
  onLayout: onLayoutProp,
  ...props
}) {
  const [ frame, setFrame ] = useState(null)
  const [ initialFrameHeight, setInitialFrameHeight ] = useState(0)
  const [ keyboardHeight, setKeyboardHeight ] = useState(0)

  useSoftInputHeightChanged(({ softInputHeight }) => {
    setKeyboardHeight(softInputHeight)
    LayoutAnimation.configureNext({
      // We have to pass the duration equal to minimal accepted duration defined here: RCTLayoutAnimation.m
      duration: duration > 10 ? duration : 10,
      update: {
        duration: duration > 10 ? duration : 10,
        type: LayoutAnimation.Types.keyboard || 'keyboard',
      },
    })
  })

  const onLayout = event => {
    const currentFrame = event.nativeEvent.layout
    setFrame(currentFrame)
    if (!initialFrameHeight) {
      // save the initial frame height, before the keyboard is visible
      setInitialFrameHeight(currentFrame.height)
    }

    if (onLayoutProp) {
      onLayoutProp(event)
    }
  }

  let heightStyle
  if (frame != null && keyboardHeight > 0) {
    // Note that we only apply a height change when there is keyboard present,
    // i.e. keyboardHeight is greater than 0. If we remove that condition,
    // frame.height will never go back to its original value.
    // When height changes, we need to disable flex.
    heightStyle = {
      height: initialFrameHeight - keyboardHeight,
      flex: 0,
    }
  }

  const { iosAvoidOffset: avoidOffset, ...extraProps } = props

  return (
    <AvoidSoftInputView
      style={StyleSheet.compose(style, heightStyle)}
      onLayout={onLayout}
      avoidOffset={avoidOffset}
      {...extraProps}>
      {children}
    </AvoidSoftInputView>
  )
}
