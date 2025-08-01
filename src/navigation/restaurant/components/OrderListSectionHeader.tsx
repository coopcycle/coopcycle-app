import { Text } from 'native-base';
import { View } from 'react-native';
import React from 'react';
import { useBackgroundColor } from '../../../styles/theme';

export default function OrderListSectionHeader({ title }) {
  const backgroundColor = useBackgroundColor();

  return (
    <View
      style={{
        backgroundColor,
        paddingVertical: 12,
        paddingHorizontal: 24,
      }}>
      <Text style={{ fontWeight: 'bold' }}>{title}</Text>
    </View>
  );
}
