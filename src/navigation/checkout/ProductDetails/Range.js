import { Text, View, useColorModeValue } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    aspectRatio: 1,
    width: 24,
    borderRadius: 4,
    justifyContent: 'center',
  },
  rangeButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  quantity: {
    textAlign: 'center',
    fontSize: 12,
  },
  quantityWrapper: {
    justifyContent: 'center',
    fontSize: 12,
    aspectRatio: 1,
    width: 24,
  },
});

function Range({ onPressDecrement, quantity, onPressIncrement, minimum = 0 }) {
  const buttonBackgroundColor = useColorModeValue(
    'rgba(0, 0, 0, .1)',
    'rgba(255, 255,255, .1)',
  );
  return (
    <View style={styles.rangeButtonWrapper}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
        onPress={onPressDecrement}
        disabled={quantity <= minimum}>
        <Text style={quantity === 0 && { color: buttonBackgroundColor }}>
          -
        </Text>
      </TouchableOpacity>
      <View style={styles.quantityWrapper}>
        <Text style={styles.quantity}>{quantity}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
        onPress={onPressIncrement}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Range;
