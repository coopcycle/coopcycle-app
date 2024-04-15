import React from 'react';
import { View } from 'native-base';
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
