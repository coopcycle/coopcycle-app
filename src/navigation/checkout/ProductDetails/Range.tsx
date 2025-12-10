import { Text } from '@/components/ui/text';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useBackgroundHighlightColor } from '../../../styles/theme';

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

type Props = {
  quantity: number;
  onPressDecrement: () => void;
  onPressIncrement: () => void;
  minimum?: number;
  disabled?: boolean;
  testID?: string;
};

function Range({ onPressDecrement, quantity, onPressIncrement, minimum = 0, disabled = false, testID }: Props) {
  const buttonBackgroundColor = useBackgroundHighlightColor();

  return (
    <View style={styles.rangeButtonWrapper}>
      <TouchableOpacity
        testID={`range-decrement-button${testID ? '-' + testID : ''}`}
        style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
        disabled={disabled || quantity <= minimum}
        onPress={onPressDecrement}>
        <Text style={quantity === 0 && { color: buttonBackgroundColor }}>
          -
        </Text>
      </TouchableOpacity>
      <View style={styles.quantityWrapper}>
        <Text style={styles.quantity}>{quantity}</Text>
      </View>
      <TouchableOpacity
        testID="range-increment-button"
        style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
        disabled={disabled}
        onPress={onPressIncrement}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Range;
