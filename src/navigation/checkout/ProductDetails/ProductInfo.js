import {Box, Heading, Text} from 'native-base';
import React from 'react';
import {
  AllergenList,
  RestrictedDietList,
  ZeroWasteBadge,
} from '../../../components/MenuBadges';
import {formatPrice} from '../../../utils/formatting';

export const ProductInfo = ({product}) => {
  const hasBadges =
    !!product.suitableForDiet ||
    !!product.allergens ||
    !!product.reusablePackagingEnabled;

  return (
    <Box p="3" style={{backgroundColor: 'white'}}>
      <Heading size="lg">{product.name}</Heading>
      {product.description && product.description.length > 0 && (
        <Text mt="2">{product.description}</Text>
      )}
      {hasBadges && (
        <Box mt="2">
          {product.suitableForDiet && (
            <RestrictedDietList items={product.suitableForDiet} />
          )}
          {product.allergens && <AllergenList items={product.allergens} />}
          {product.reusablePackagingEnabled && <ZeroWasteBadge />}
        </Box>
      )}
      <Text mt="2" bold fontSize="xl">{`${formatPrice(
        product.offers.price,
      )}`}</Text>
    </Box>
  );
};
