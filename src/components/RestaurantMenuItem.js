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
  disabled: {
    opacity: 0.5,
  },
  titleDisabled: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  content: {
    flex: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    display: 'flex',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  details: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flexShrink1: 1,
    flex: 1,
    overflow: 'hidden',
  },
  priceWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  price: {
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 0,
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  imageWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 4,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
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
        item.enabled ? null : styles.disabled,
      ]}
      onPress={enabled ? () => onPress(item) : null}
      testID={`menuItem:${item.sectionIndex}:${item.index}`}>
      <View style={image1x1 ? styles.imageWrapper : { width: 0 }}>
        {image1x1 && (
          <Image
            // size="lg"
            // resizeMode="cover"
            source={{ uri: image1x1.url }}
            alt="Product"
            style={[styles.image, { aspectRatio: 1 }]}
          />
        )}
      </View>

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[styles.title, item.enabled ? null : styles.titleDisabled]}>
          {item.name}
        </Text>
        {item.description ? (
          <Text numberOfLines={3} style={styles.description}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.details}>
          {diets.length > 1 ? (
            <View style={styles.badges}>
              {diets.map((badge, i) => {
                if (i !== diets.length - 1) {
                  return <RestaurantProductBadge type={badge} key={i} />;
                }
              })}
            </View>
          ) : null}

          <View style={styles.priceWrapper}>
            {diets.length > 1 ? (
              <>
                <RestaurantProductBadge type={diets[diets.length - 1]} />
              </>
            ) : null}
            <Text pr="2" fontSize="lg" style={styles.price}>{`${formatPrice(
              item.offers.price,
            )}`}</Text>
          </View>
        </View>
      </View>
      {isLoading && <ActivityIndicator color="#c7c7c7" size="small" />}
    </TouchableOpacity>
  );
};

export default RestaurantMenuItem;
