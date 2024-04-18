import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  AllergenBadge,
  DietBadge,
  ZeroWasteBadge,
} from '../../../components/RestaurantProductBadge';
import { formatPrice } from '../../../utils/formatting';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: 8,
  },
  badgesListWrapper: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  badgesWrapper: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
});

export const ProductInfo = ({ product }) => {
  const hasBadges =
    !!product.suitableForDiet ||
    !!product.allergens ||
    !!product.reusablePackagingEnabled;

  const allergens = product.allergens
    ? product.allergens.map(element =>
        element.replace('http://schema.org/', ''),
      )
    : [];
  const diets = product.suitableForDiet
    ? product.suitableForDiet.map(element =>
        element.replace('http://schema.org/', ''),
      )
    : [];

  return (
    <View style={styles.wrapper}>
      <Text>{product.name}</Text>
      <Text bold>{`${formatPrice(product.offers.price)}`}</Text>
      {product.description && product.description.length > 0 && (
        <Text>{product.description}</Text>
      )}
      {hasBadges && (
        <View style={styles.badgesListWrapper}>
          <View style={styles.badgesWrapper}>
            {diets.map((item, i) => (
              <DietBadge key={i} name={item} />
            ))}
          </View>
          {/* {product.suitableForDiet && (
            <RestrictedDietList items={product.suitableForDiet} />
          )} */}
          <View style={styles.badgesWrapper}>
            {allergens.map((item, i) => (
              <AllergenBadge key={i} name={item} />
            ))}
          </View>
          {/* {product.allergens && <AllergenList items={product.allergens} />} */}
          <View style={styles.badgesWrapper}>
            {product.reusablePackagingEnabled ? <ZeroWasteBadge /> : null}
          </View>
          {/* {product.reusablePackagingEnabled && <ZeroWasteBadge />} */}
        </View>
      )}
    </View>
  );
};
