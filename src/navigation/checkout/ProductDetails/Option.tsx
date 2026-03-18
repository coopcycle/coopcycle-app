import { Text } from '@/components/ui/text';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  useSecondaryTextColor,
} from '../../../styles/theme';
import { formatPrice } from '../../../utils/formatting';
import {
  getPriceForOptionValue,
  isAdditionalOption,
} from '../../../utils/product';
import Range from './Range';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';

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

function optionValueLabel({ name }, price) {
  if (price === 0) {
    return name
  }

  return `${name} (+${formatPrice(price)})`
}

export const Option = ({
  option,
  index,
  getQuantity,
  add,
  increment,
  decrement,
  containsIds,
}) => {

  if (isAdditionalOption(option)) {

    return (
      <VStack space="md">
        {option.hasMenuItem.map((optionValue, valueIndex) => (
          <RangeOption
            key={`option-${index}-value-${valueIndex}`}
            name={optionValue.name}
            price={getPriceForOptionValue(optionValue)}
            onPress={() => add(optionValue)}
            onPressIncrement={() => increment(optionValue)}
            onPressDecrement={() => decrement(optionValue)}
            quantity={getQuantity(optionValue)}
          />
        ))}
      </VStack>
    );
  }

  return (
    <RadioGroup onChange={(optionValue) => add(optionValue)}>
      {option.hasMenuItem.map((optionValue, valueIndex) => {

        let isDisabled = false;
        if (Array.isArray(optionValue.dependsOn) && optionValue.dependsOn.length > 0) {
          isDisabled = !containsIds(optionValue.dependsOn)
        }

        return (
          <Radio key={`option-${index}-value-${valueIndex}`}
            value={optionValue} size="lg" isInvalid={false} isDisabled={isDisabled}
            testID={`productOptions:${index}:${valueIndex}`}>
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>{optionValueLabel(optionValue, getPriceForOptionValue(optionValue))}</RadioLabel>
          </Radio>
        )
      })}
    </RadioGroup>
  );

};

const RangeOption = ({
  name,
  price,
  onPress,
  onPressIncrement,
  onPressDecrement,
  quantity,
}) => {

  const priceColor = useSecondaryTextColor();

  return (
    <HStack className="items-center" space="md">
      <Range
        onPress={onPress}
        onPressIncrement={onPressIncrement}
        onPressDecrement={onPressDecrement}
        quantity={quantity}
      />
      <Pressable className="flex flex-row items-center gap-2" onPress={onPress}>
        <Text>{name}</Text>
        {price > 0 ? (
          <Text style={[styles.price, { color: priceColor }]}>
            +{`${formatPrice(price)}`}
          </Text>
        ) : null}
      </Pressable>
    </HStack>
  );
};
