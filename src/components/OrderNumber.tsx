import { Text } from '@/components/ui/text';
import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  orderNumber: {
    fontFamily: 'RobotoMono-Regular',
  },
});

export default ({ order, color }) => {
  const textStyle = [styles.orderNumber];
  if (color) {
    textStyle.push({ color });
  }

  return <Text style={textStyle}>{order.number}</Text>;
};
