import _ from 'lodash';
import {Image, Text, View} from 'native-base';
import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {formatPrice} from '../utils/formatting';

const styles = StyleSheet.create({
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'left',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  menuItemContent: {
    flex: 2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    display: 'flex',
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 12,
    whiteSpace: 'wrap',
    lineHeight: 16,
  },
  menuItemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuItemImageWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
    height: 130,
    width: 130,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemImage: {
    // maxHeight: '100%',
    // maxWidth: '100%',
    width: '100%',
    height: '100%',
  },
});

const RestaurantMenuItem = ({item, onPress, isLoading}) => {
  const enabled = item.hasOwnProperty('enabled') ? item.enabled : true;

  const image1x1 =
    item.images &&
    Array.isArray(item.images) &&
    _.find(item.images, image => image.ratio === '1:1');

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={enabled ? () => onPress(item) : null}
      testID={`menuItem:${item.sectionIndex}:${item.index}`}>
      <View style={styles.menuItemImageWrapper}>
        {image1x1 && true && (
          <Image
            size="lg"
            resizeMode="cover"
            source={{uri: image1x1.url}}
            alt="Product"
            style={styles.menuItemImage}
          />
        )}
      </View>

      <View style={styles.menuItemContent}>
        <Text numberOfLines={1} style={styles.menuItemTitle}>
          {item.name}
        </Text>
        {item.description ? (
          <Text numberOfLines={3} style={styles.menuItemDescription}>
            {item.description}
          </Text>
        ) : null}
        <Text pr="2" fontSize="lg" style={styles.menuItemPrice}>{`${formatPrice(
          item.offers.price,
        )}`}</Text>
      </View>
      {isLoading && <ActivityIndicator color="#c7c7c7" size="small" />}
    </TouchableOpacity>
  );
};

export default RestaurantMenuItem;
