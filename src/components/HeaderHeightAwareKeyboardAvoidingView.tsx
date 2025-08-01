import React from 'react';
import {
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

const HeaderHeightAwareKeyboardAvoidingView = ({ children }) => {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + StatusBar.currentHeight}
      style={{ flex: 1 }}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default HeaderHeightAwareKeyboardAvoidingView;
