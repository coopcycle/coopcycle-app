import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

/**
 *
 * @param children; one of the child should be a ScrollView
 * @param style
 */
export default function KeyboardAdjustView({ children, style, testID }) {
  const windowDimensions = useWindowDimensions();
  const [viewHeight, setViewHeight] = useState(0);

  const onLayout = event => {
    const currentFrame = event.nativeEvent.layout;
    if (!viewHeight) {
      setViewHeight(currentFrame.height);
    }
  };

  if (Platform.OS === 'android') {
    // AndroidManifest.xml updated to adjustResize to handle keyboard positioning
    // conflicts with KeyboardAvoidingView eliminated

    return (
      <View style={[style, { flex: 1 }]} onLayout={onLayout} testID={testID}>
        {children}
      </View>
    );
  } else if (Platform.OS === 'ios') {
    // on iOS we need to adjust the view and put the focused text input above the keyboard manually

    const topOffset = windowDimensions.height - viewHeight;

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
    const avoidOffset = -1 * windowDimensions.height;

    return (
      // extra View is a workaround for this issue: https://github.com/facebook/react-native/issues/35599
      <View style={style} onLayout={onLayout} testID={testID}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={topOffset}
          behavior={'height'}>
          <AvoidSoftInputView style={{ flex: 1 }} avoidOffset={avoidOffset}>
            {children}
          </AvoidSoftInputView>
        </KeyboardAvoidingView>
      </View>
    );
  } else {
    return (
      <View style={style} testID={testID}>
        {children}
      </View>
    );
  }
}
