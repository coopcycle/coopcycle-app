import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Range from '@/src/navigation/checkout/ProductDetails/Range';
import { SupplementWithQuantity } from '@/src/navigation/task/hooks/useSupplements';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';

type Props = {
  item: SupplementWithQuantity;
  handleIncrement: (supplement: SupplementWithQuantity) => void;
  handleDecrement: (supplement: SupplementWithQuantity) => void;
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
      {item.isRangeBased ? (
        <Range
          quantity={item.quantity}
          testID={`supplement-${item.position}`}
          onPressIncrement={() => handleIncrement(item)}
          onPressDecrement={() => handleDecrement(item)}
        />
      ) : (
        <Checkbox
          isChecked={item.quantity > 0}
          testID={`supplement-${item.position}`}
          onChange={value => {
            if (value) {
              handleIncrement(item);
            } else {
              handleDecrement(item);
            }
          }}>
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
        </Checkbox>
      )}
      <TouchableOpacity
        style={styles.supplementLabel}
        onPress={() => handleIncrement(item)}
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
