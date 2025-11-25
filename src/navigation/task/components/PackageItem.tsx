import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Range from '../../checkout/ProductDetails/Range';
import Task from '@/src/types/task';

interface PackageItemProps {
  item;
  task: Task;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const PackageItem: React.FC<PackageItemProps> = React.memo(({
  item,
  task,
  onIncrement,
  onDecrement,
}) => {
  const isDisabled = item?.tasks?.includes(task['@id']);

  return (
    <View style={styles.packageItem} key={item.name}>
      <Range
        isDisabled={isDisabled}
        onPressIncrement={() => onIncrement()}
        onPressDecrement={() => onDecrement()}
        quantity={item.quantity}
        testID={`package-${item.id}`}
      />
      <TouchableOpacity
        style={styles.packageLabel} >
        <Text>{item.name}</Text>
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