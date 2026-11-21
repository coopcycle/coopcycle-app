import _ from 'lodash';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatPrice } from '../utils/formatting';
import { DietBadge, MoreBadge, ZeroWasteBadge } from './RestaurantProductBadge';

// The image column is the same width on every card. It used to be a share of
// the row, which made a card with many badges — and so a tall row — hold a
// wider image than its neighbours.
const IMAGE_WIDTH = 120;

// How many diet badges a card shows before counting the rest. Enough to say
// what the product is without the row growing taller than its image; the
// product screen lists them all.
const MAX_BADGES = 5;

const styles = StyleSheet.create({
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    flex: 1,
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
    alignItems: 'flex-start',
  },
  priceWrapper: {
    flex: 0,
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 0,
    marginLeft: 'auto',
  },
  imageWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: IMAGE_WIDTH,
    // The row is as tall as its text, which can be taller than the image is
    // wide. The image fills the column and is cropped to it rather than
    // keeping a square and spilling over the text, which is what a fixed
    // aspect ratio did here.
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    // Also what tells StyleSheet this one is an image style rather than a
    // view's: width and height alone fit either.
    resizeMode: 'cover',
  },
});

const RestaurantMenuItem = ({ testID, item, onPress, isLoading }) => {
  const enabled = item.hasOwnProperty('enabled') ? item.enabled : true;

  const diets = item.suitableForDiet
    ? item.suitableForDiet.map(element =>
        element.replace('http://schema.org/', ''),
      )
    : [];

  const shownDiets = diets.slice(0, MAX_BADGES);
  const hiddenDiets = diets.length - shownDiets.length;

  const image1x1 =
    item.images &&
    Array.isArray(item.images) &&
    _.find(item.images, image => image.ratio === '1:1');

  return (
    <Pressable
      className="bg-background-50"
      style={[
        styles.menuItem,
        item.enabled ? null : styles.disabled,
      ]}
      onPress={enabled ? () => onPress(item) : null}
      testID={testID}>
      <View style={image1x1 ? styles.imageWrapper : { width: 0 }}>
        {image1x1 && (
          <Image
            source={{ uri: image1x1.url }}
            alt="Product"
            style={styles.image}
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
          {shownDiets.length > 0 ? (
            <View style={styles.badges} testID="menuItemBadges">
              {shownDiets.map((badge, i) => (
                <DietBadge key={i} name={badge} />
              ))}
              {hiddenDiets > 0 ? <MoreBadge count={hiddenDiets} /> : null}
            </View>
          ) : null}

          <View style={styles.priceWrapper}>
            {item.reusablePackagingEnabled ? (
              <>
                <ZeroWasteBadge />
              </>
            ) : null}
            {/* `pr` and `fontSize` used to be here, left over from NativeBase:
                gluestack's Text takes neither, so they never did anything. */}
            <Text style={styles.price}>{`${formatPrice(
              item.offers.price,
            )}`}</Text>
          </View>
        </View>
      </View>
      {isLoading && <ActivityIndicator color="#c7c7c7" size="small" />}
    </Pressable>
  );
};

export default RestaurantMenuItem;
