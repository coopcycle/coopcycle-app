import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Text } from '@/components/ui/text';
import { ShopCuisine } from '../redux/api/types';
import { Restaurant } from './RestaurantCard';

const ICON_SIZE = 36;

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  item: {
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    // Wide enough for two short words, so the icons keep an even rhythm
    // whatever the labels are; longer ones are cut rather than wrapped.
    width: 80,
  },
  icon: {
    height: ICON_SIZE,
    marginBottom: 4,
    width: ICON_SIZE,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});

/**
 * The cuisines worth offering for a given set of shops: those the server
 * lists *and* at least one of the shops serves.
 *
 * The shops on screen are the ones delivering to the customer's address,
 * which is a smaller set than the instance as a whole, so offering every
 * cuisine would mean offering ones that can only lead to an empty list.
 *
 * It also takes care of a server too old to send a shop's `cuisines`: nothing
 * intersects, so the strip is simply not shown.
 */
export function availableCuisines(
  cuisines: ShopCuisine[],
  restaurants: Restaurant[],
): ShopCuisine[] {
  const served = new Set(
    restaurants.flatMap(restaurant => restaurant.cuisines ?? []),
  );

  return cuisines.filter(cuisine => served.has(cuisine.value));
}

/**
 * The shops serving any of the selected cuisines, or all of them when none is
 * selected. Any rather than all, which is how the website reads a selection.
 */
export function filterByCuisine(
  restaurants: Restaurant[],
  selected: string[],
): Restaurant[] {
  if (selected.length === 0) {
    return restaurants;
  }

  return restaurants.filter(restaurant =>
    (restaurant.cuisines ?? []).some(cuisine => selected.includes(cuisine)),
  );
}

type Props = {
  cuisines: ShopCuisine[];
  selected: string[];
  onToggle: (value: string) => void;
};

/**
 * The strip of cuisine icons above the shops list, as on the website's /shops
 * page: tap one to narrow the list to it, tap it again to let it go.
 *
 * The filtering is done on the shops already loaded rather than by asking the
 * server for each selection: the list holds every shop that delivers to the
 * address, so the answer is already here, and working out which shops reach
 * an address costs the server a routing query per shop.
 */
export default function CuisineFilter({ cuisines, selected, onToggle }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: ShopCuisine }) => {
      const isSelected = selected.includes(item.value);

      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={item.label}
          className={isSelected ? 'bg-background-100' : undefined}
          onPress={() => onToggle(item.value)}
          style={styles.item}
          testID={`cuisineFilter:${item.value}`}>
          {/* A cuisine with no icon still takes the same room, so selecting
              one does not shift the rest of the strip. */}
          <View style={styles.icon}>
            {item.icon ? (
              <SvgXml
                xml={item.icon}
                width={ICON_SIZE}
                height={ICON_SIZE}
                // The markup comes from the server with fill="currentColor",
                // which only the monochrome icons rely on.
                color="#666"
              />
            ) : null}
          </View>
          <Text
            style={styles.label}
            numberOfLines={1}
            ellipsizeMode="tail"
            bold={isSelected}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [onToggle, selected],
  );

  if (cuisines.length === 0) {
    return null;
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      data={cuisines}
      keyExtractor={cuisine => cuisine.id}
      renderItem={renderItem}
      testID="cuisineFilter"
    />
  );
}
