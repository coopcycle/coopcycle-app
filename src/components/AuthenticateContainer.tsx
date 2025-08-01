import { ScrollView } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

/**
 * A hackish usage of a ScrollView to automatically hide the keyboard
 * when the user taps outside of the input field.
 * https://stackoverflow.com/questions/41426862/blur-textinput-when-tapped-outside-of-it/41429871#comment83416458_41429871
 * Could be generalised later on and used on other screens too.
 */
export default ({ children }) => {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}
      contentContainerStyle={styles.contentContainer}>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
