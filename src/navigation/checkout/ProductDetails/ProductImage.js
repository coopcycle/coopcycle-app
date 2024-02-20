import _ from 'lodash';
import {Image} from 'native-base';
import React from 'react';

export const ProductImage = ({product}) => {
  const image16x9 =
    product.images &&
    Array.isArray(product.images) &&
    _.find(product.images, image => image.ratio === '16:9');

  return image16x9 ? (
    <Image
      size="md"
      style={{width: '100%'}}
      resizeMode="cover"
      source={{uri: image16x9.url}}
      alt="Product"
    />
  ) : null;
};
