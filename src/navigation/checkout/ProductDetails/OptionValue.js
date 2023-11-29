import { Badge, Icon, Text, View } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { formatPrice } from '../../../utils/formatting'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import React from 'react'
import {
  getPriceForOptionValue,
  isAdditionalOption,
} from '../../../utils/product'

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
  const selected = contains(optionValue)
  const quantity = getQuantity(optionValue)

  const price = getPriceForOptionValue(optionValue)

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
    )
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
    )
  }
}

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
)

const SimpleOption = ({
  name,
  price,
  onPress,
  selected,
  index,
  sectionIndex,
}) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      testID={`productOptions:${sectionIndex}:${index}`}>
      <View
        style={{
          width: '66.6666%',
          justifyContent: 'space-between',
          padding: 15,
        }}>
        <Text>{name}</Text>
        {price > 0 ? <Text note>{`${formatPrice(price)}`}</Text> : null}
      </View>
      <View style={{ width: '33.3333%' }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 15,
          }}>
          {selected && <Icon as={FontAwesome} name="check-square" />}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
