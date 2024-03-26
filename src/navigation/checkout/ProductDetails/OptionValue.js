import { Text, View, useColorModeValue } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { formatPrice } from '../../../utils/formatting';
import {
  getPriceForOptionValue,
  isAdditionalOption,
} from '../../../utils/product';
import Range from './Range';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  itemText: {
    flex: 1,
  },
  radioButtonWrapper: {
    height: 16,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
  },
  radioButton: {
    height: '100%',
    borderRadius: 12,
  },
  price: {
    fontSize: 12,
  },
  rangeTextWrapper: {
    flex: 1,
  },
});

export const OptionValue = ({
  option,
  optionValue,
  index,
  contains,
  getQuantity,
  add,
  increment,
  decrement,
}) => {
  const selected = contains(optionValue);
  const quantity = getQuantity(optionValue);

  const price = getPriceForOptionValue(optionValue);

  if (isAdditionalOption(option)) {
    return (
      <RangeOption
        name={optionValue.name}
        price={price}
        onPress={() => add(optionValue)}
        onPressIncrement={() => increment(optionValue)}
        onPressDecrement={() => decrement(optionValue)}
        quantity={quantity}
      />
    );
  } else {
    return (
      <SimpleOption
        name={optionValue.name}
        price={price}
        index={index}
        sectionIndex={option.index}
        selected={selected}
        onPress={() => add(optionValue)}
      />
    );
  }
};

const RangeOption = ({
  name,
  price,
  onPress,
  onPressIncrement,
  onPressDecrement,
  quantity,
}) => {
  const backgroundColor = useColorModeValue('white', '#1a1a1a');

  const priceColor = useColorModeValue(
    'rgba(0, 0, 0, .6)',
    'rgba(255, 255,255, .6)',
  );
  return (
    <View style={[styles.item, { gap: 16, backgroundColor }]}>
      <Range
        onPress={onPress}
        onPressIncrement={onPressIncrement}
        onPressDecrement={onPressDecrement}
        quantity={quantity}
      />
      <TouchableOpacity style={styles.rangeTextWrapper} onPress={onPress}>
        <Text>{name}</Text>
        {price > 0 ? (
          <Text style={[styles.price, { color: priceColor }]} note>
            +{`${formatPrice(price)}`}
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const SimpleOption = ({
  name,
  price,
  onPress,
  selected,
  index,
  sectionIndex,
}) => {
  const backgroundColor = useColorModeValue('white', '#1a1a1a');
  const radioButtonColor = useColorModeValue('black', 'white');
  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor }]}
      onPress={onPress}
      testID={`productOptions:${sectionIndex}:${index}`}>
      {
        <View
          style={[
            styles.radioButtonWrapper,
            { borderColor: radioButtonColor },
          ]}>
          <View
            style={[
              styles.radioButton,
              { backgroundColor: selected ? radioButtonColor : 'transparent' },
            ]}
          />
        </View>
      }
      <Text style={styles.itemText}>{name}</Text>
      {price > 0 ? (
        <Text note style={styles.price}>
          + {`${formatPrice(price)}`}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};
