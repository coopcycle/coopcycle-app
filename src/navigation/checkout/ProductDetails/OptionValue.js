import { Badge, Icon, Text, View, useColorModeValue } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { formatPrice } from '../../../utils/formatting';
import {
  getPriceForOptionValue,
  isAdditionalOption,
} from '../../../utils/product';

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
}) => (
  <View style={styles.item}>
    <TouchableOpacity
      style={{
        width: '66.6666%',
        justifyContent: 'space-between',
        padding: 15,
      }}
      onPress={onPress}>
      <Text>{name}</Text>
      {price > 0 ? <Text note>{`${formatPrice(price)}`}</Text> : null}
    </TouchableOpacity>
    <View style={{ width: '33.3333%' }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={onPressDecrement}>
          <Icon as={FontAwesome} name="minus-circle" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={onPressIncrement}>
          <Icon as={FontAwesome} name="plus-circle" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Badge info style={{ alignSelf: 'center' }}>
            <Text>{quantity}</Text>
          </Badge>
        </View>
      </View>
    </View>
  </View>
);

const SimpleOption = ({
  name,
  price,
  onPress,
  selected,
  index,
  sectionIndex,
}) => {
  const backgroundColor = useColorModeValue('white', '#1a1a1a');
  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor }]}
      onPress={onPress}
      testID={`productOptions:${sectionIndex}:${index}`}>
      {
        <View style={styles.radioButtonWrapper}>
          <View
            style={[
              styles.radioButton,
              { backgroundColor: selected ? 'black' : 'transparent' },
            ]}
          />
        </View>
      }
      <Text style={styles.itemText}>{name}</Text>
      {price > 0 ? <Text note>+ {`${formatPrice(price)}`}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
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
    borderColor: 'black',
    padding: 3,
  },
  radioButton: {
    height: '100%',
    borderRadius: 12,
  },
});
