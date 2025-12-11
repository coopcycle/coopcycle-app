import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Range from '@/src/navigation/checkout/ProductDetails/Range';
import { SupplementWithQuantity } from '@/src/navigation/task/hooks/useSupplements';
import { Uri } from '@/src/redux/api/types';

type Props = {
  item: SupplementWithQuantity;
  handleIncrement: (pricingRule: Uri) => void;
  handleDecrement: (pricingRule: Uri) => void;
  testID?: string;
};

export const ManualSupplement = ({
  item,
  handleIncrement,
  handleDecrement,
  testID,
}: Props) => {
  return (
    <View
      style={[styles.supplementItem]}
      key={item['@id']}
      testID={`${testID}-selected-item-${item.position}`}>
      <Range
        onPressIncrement={() => handleIncrement(item['@id'])}
        onPressDecrement={() => handleDecrement(item['@id'])}
        quantity={item.quantity}
        testID={`supplement-${item.position}`}
      />
      <TouchableOpacity
        style={styles.supplementLabel}
        onPress={() => handleIncrement(item['@id'])}
        testID={`${testID}-selected-item-${item.position}-label`}>
        <Text
          style={styles.supplementName}
          testID={`${testID}-selected-item-${item.position}-name`}>
          {item.name || 'Unknown'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  supplementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    backgroundColor: 'transparent',
  },
  supplementLabel: {
    flex: 1,
  },
  supplementName: {
    fontSize: 14,
    color: '#333',
  },
});
