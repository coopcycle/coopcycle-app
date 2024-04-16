import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  AllergenList,
  RestrictedDietList,
  ZeroWasteBadge,
} from '../../../components/MenuBadges';
import { formatPrice } from '../../../utils/formatting';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: 8,
  },
});

export const ProductInfo = ({ product }) => {
  const hasBadges =
    !!product.suitableForDiet ||
    !!product.allergens ||
    !!product.reusablePackagingEnabled;

  return (
    <View style={styles.wrapper}>
      <Text>{product.name}</Text>
      <Text bold>{`${formatPrice(product.offers.price)}`}</Text>
      {product.description && product.description.length > 0 && (
        <Text>{product.description}</Text>
      )}
      {hasBadges && (
        <View>
          {product.suitableForDiet && (
            <RestrictedDietList items={product.suitableForDiet} />
          )}
          {product.allergens && <AllergenList items={product.allergens} />}
          {product.reusablePackagingEnabled && <ZeroWasteBadge />}
        </View>
      )}
    </View>
  );
};
