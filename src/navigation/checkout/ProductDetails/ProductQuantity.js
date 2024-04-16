import { Text, View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Range from './Range';

const styles = StyleSheet.create({
  quantityWrapper: {
    flexDirection: 'row',
    gap: 16,
  },
});

export const ProductQuantity = ({ quantity, setQuantity }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.quantityWrapper}>
      <Text>{t('CHECKOUT_UNITS')}</Text>
      <Range
        minimum={1}
        onPressDecrement={() => setQuantity(quantity - 1)}
        quantity={quantity}
        onPressIncrement={() => setQuantity(quantity + 1)}
      />
    </View>
  );
};
