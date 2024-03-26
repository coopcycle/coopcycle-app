import _ from 'lodash';
import {Image} from 'native-base';
import React from 'react';

export const ProductImage = ({product}) => {
  const image16x9 =
    product.images &&
    Array.isArray(product.images) &&
    _.find(product.images, image => image.ratio === '16:9');

  const image =
    image16x9 ||
    (product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0 &&
      product.images[0]);

  return image ? (
    <Image
      size="md"
      style={{
        height: 150,
        width: 'auto',
        aspectRatio: image.ratio.split(':').join('/'),
      }}
      resizeMode="cover"
      source={{uri: image.url}}
      alt="Product"
    />
  ) : null;
};
