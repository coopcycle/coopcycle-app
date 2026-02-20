import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar, useKeyboardController } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// https://docs.expo.dev/guides/keyboard-handling/
// https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view
export default ({ children }) => {

  const { enabled, setEnabled } = useKeyboardController();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setEnabled(true);
  }, [setEnabled])

  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={ [ styles.contentContainer, { paddingBottom: insets.bottom } ]}>
        {children}
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
