import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Range from '../../checkout/ProductDetails/Range';

interface PackageItemProps {
  item;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const PackageItem: React.FC<PackageItemProps> = React.memo(({
  item,
  onIncrement,
  onDecrement
}) => {
  return (
    <View style={styles.packageItem} key={item.type}>
      <Range
        onPress={() => {}}
        onPressIncrement={onIncrement}
        onPressDecrement={onDecrement}
        quantity={item.quantity}
      />
      <TouchableOpacity
        style={styles.packageLabel}
        onPress={onIncrement}>
        <Text>{item.type}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  packageLabel: {
    flex: 1,
  },
});