import _ from 'lodash';
import { Image, Text, View, useColorModeValue } from 'native-base';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { formatPrice } from '../utils/formatting';
import RestaurantProductBadge from './RestaurantProductBadge';

const styles = StyleSheet.create({
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'left',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemTitleDisabled: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
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
    marginTop: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  menuItemDetails: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  menuItemBadgesWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  menuItemBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flexShrink1: 1,
    flex: 1,
    overflow: 'hidden',
  },
  menuItemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 0,
    alignSelf: 'flex-end',
  },
  menuItemImageWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
    height: '100%',
    minHeight: 130,
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

const RestaurantMenuItem = ({ item, onPress, isLoading }) => {
  const enabled = item.hasOwnProperty('enabled') ? item.enabled : true;
  const backgroundColor = useColorModeValue('#fff', '#201E1E');

  const diets = item.suitableForDiet
    ? item.suitableForDiet.map(element =>
        element.replace('http://schema.org/', ''),
      )
    : [];

  const image1x1 =
    item.images &&
    Array.isArray(item.images) &&
    _.find(item.images, image => image.ratio === '1:1');

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        { backgroundColor },
        item.enabled ? null : styles.menuItemDisabled,
      ]}
      onPress={enabled ? () => onPress(item) : null}
      testID={`menuItem:${item.sectionIndex}:${item.index}`}>
      <View style={image1x1 ? styles.menuItemImageWrapper : { width: 0 }}>
        {image1x1 && (
          <Image
            size="lg"
            resizeMode="cover"
            source={{ uri: image1x1.url }}
            alt="Product"
            style={styles.menuItemImage}
          />
        )}
      </View>

      <View style={styles.menuItemContent}>
        <Text
          numberOfLines={1}
          style={[
            styles.menuItemTitle,
            item.enabled ? null : styles.menuItemTitleDisabled,
          ]}>
          {item.name}
        </Text>
        {item.description ? (
          <Text numberOfLines={3} style={styles.menuItemDescription}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.menuItemDetails}>
          {diets.length > 0 ? (
            <View style={styles.menuItemBadgesWrapper}>
              <View style={styles.menuItemBadges}>
                {diets.map((badge, i) => (
                  <RestaurantProductBadge type={badge} key={i} />
                ))}
              </View>
            </View>
          ) : null}
          <Text
            pr="2"
            fontSize="lg"
            style={styles.menuItemPrice}>{`${formatPrice(
            item.offers.price,
          )}`}</Text>
        </View>
      </View>
      {isLoading && <ActivityIndicator color="#c7c7c7" size="small" />}
    </TouchableOpacity>
  );
};

export default RestaurantMenuItem;
