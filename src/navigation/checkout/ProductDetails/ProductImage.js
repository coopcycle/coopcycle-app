import { Image, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  imageWrapper: {
    height: 150,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    height: '100%',
  },
});

export const ProductImage = ({ product }) => {
  const findImageByRatio = ratio =>
    product.images.find(image => image.ratio === ratio);

  const productImage = findImageByRatio('16:9') || product.images[0];

  const aspectRatio = productImage?.ratio
    ? productImage.ratio.replace(':', '/')
    : null;

  return productImage ? (
    <View style={styles.imageWrapper}>
      <Image
        style={[styles.image, aspectRatio && { aspectRatio }]}
        resizeMode="cover"
        source={{ uri: productImage.url }}
        alt="Product image"
      />
    </View>
  ) : null;
};
