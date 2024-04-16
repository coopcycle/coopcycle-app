import { View } from 'native-base';
import React from 'react';
import { useBackgroundColor } from '../styles/theme';

export default function RootView({ children }) {
  const backgroundColor = useBackgroundColor();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}>
      {children}
    </View>
  );
}
