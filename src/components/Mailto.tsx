import React from 'react';
import { Linking, Platform, TouchableOpacity } from 'react-native';
import { openComposer } from 'react-native-email-link';

function openEmail(email) {
  if (Platform.OS === 'ios') {
    openComposer({
      to: email,
    });
  } else {
    Linking.openURL(`mailto:${email}`);
  }
}

export default ({ children, email, ...props }) => {
  return (
    <TouchableOpacity onPress={() => openEmail(email)} {...props}>
      {children}
    </TouchableOpacity>
  );
};
