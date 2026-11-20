import React, { useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import {
  useGetShopFiltersQuery,
  useGetShopsByFilterQuery,
} from '../redux/api/slice';
import { ShopFilter } from '../redux/api/types';
import { Restaurant, RestaurantCard } from './RestaurantCard';
import { useVisibleItems, VisibleItemsProvider } from './VisibleItems';

// Leave a bit of the next card visible, so the row reads as scrollable.
const CARD_WIDTH = Math.min(Dimensions.get('window').width * 0.8, 320);

const styles = StyleSheet.create({
  collection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    paddingRight: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    // The next card's own left margin provides the gap.
    marginRight: 0,
  },
});

type RowProps = {
  filter: ShopFilter;
  onItemClick: (restaurant: Restaurant) => void;
};

/**
 * One filter, rendered as a horizontally scrollable row of shops.
 *
 * The shops are asked for per row rather than filtered out of one big list:
 * which shops a filter covers is the server's to decide — "new" depends on a
 * per-instance number of days, and the collections are curated in the admin —
 * and the facets the app receives are translated for display, so matching on
 * them client side would only ever work in the instance's own language.
 */
const ShopCollectionRow = ({ filter, onItemClick }: RowProps) => {
  // Cards fetch their own timing, so the row has to say which are on screen.
  const { seen, listProps } = useVisibleItems();

  const { data: shops } = useGetShopsByFilterQuery(filter);

  const renderItem = useCallback(
    ({ item }: { item: Restaurant }) => (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => onItemClick(item)}>
        <RestaurantCard restaurant={item} style={styles.card} />
      </TouchableOpacity>
    ),
    [onItemClick],
  );

  // A filter the server offers may still have nothing behind it right now, and
  // an empty row would read as a broken one.
  if (!shops || shops.length === 0) {
    return null;
  }

  return (
    <View style={styles.collection}>
      <Text style={styles.title}>{filter.label}</Text>
      <VisibleItemsProvider seen={seen}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          data={shops as unknown as Restaurant[]}
          keyExtractor={item => item['@id']}
          renderItem={renderItem}
          testID={`shopCollection:${filter.id}`}
          {...listProps}
        />
      </VisibleItemsProvider>
    </View>
  );
};

type Props = {
  onItemClick: (restaurant: Restaurant) => void;
};

/**
 * The shop collections of the home screen, as horizontally scrollable rows.
 *
 * Both which collections to show and what to call them come from
 * `GET /api/shop_filters`: the same list drives the website's /shops page, so
 * the app and the website cannot drift apart, and an instance that customized
 * its homepage gets its own collections, in its own order. Renders nothing
 * when the server offers no filters.
 */
export default function ShopCollections({ onItemClick }: Props) {
  const { data: filters } = useGetShopFiltersQuery();

  if (!filters || filters.length === 0) {
    return null;
  }

  // A list rather than a plain View: the rows off the bottom of the screen
  // then stay unmounted, and ask the server for nothing until scrolled to.
  return (
    <FlatList
      testID="shopCollections"
      data={filters}
      keyExtractor={filter => filter.id}
      renderItem={({ item }) => (
        <ShopCollectionRow filter={item} onItemClick={onItemClick} />
      )}
    />
  );
}
