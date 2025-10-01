import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  banner: {
    aspectRatio: '16/9',
    width: '100%',
  },
});

export function RestaurantBanner({ src }) {
  return (
    <View>
      <Image style={styles.banner} resizeMode="cover" source={{ uri: src }} />
    </View>
  );
}
