import { Flex, Heading, Icon, Pressable, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const ProductQuantity = ({ quantity, setQuantity }) => {
  const { t } = useTranslation();

  return (
    <Flex
      flexDirection="row"
      px="3"
      py="1"
      align="center"
      justify="space-between">
      <Heading size="md">{t('CHECKOUT_UNITS')}</Heading>
      <Flex flexDirection="row" align="center">
        <Pressable
          disabled={quantity <= 1}
          p="2"
          onPress={() => {
            setQuantity(quantity - 1);
          }}>
          <Icon
            as={FontAwesome}
            style={{ opacity: quantity <= 1 ? 0.5 : 1 }}
            name="minus-circle"
            size="sm"
          />
        </Pressable>
        <Text mx="2" bold>
          {quantity}
        </Text>
        <Pressable
          p="2"
          onPress={() => {
            setQuantity(quantity + 1);
          }}>
          <Icon
            as={FontAwesome}
            style={{ opacity: 1 }}
            name="plus-circle"
            size="sm"
          />
        </Pressable>
      </Flex>
    </Flex>
  );
};
