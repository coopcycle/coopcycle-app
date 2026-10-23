import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Text } from '@/components/ui/text';
import {
  useGetHomepageBlocksQuery,
  useGetShopCollectionsQuery,
} from '../redux/api/slice';
import { selectRestaurants } from '../redux/Checkout/selectors';
import {
  CollectableRestaurant,
  resolveShopCollections,
  ShopCollection,
} from '../utils/homepage';
import { Restaurant, RestaurantCard } from './RestaurantCard';

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
    // Stretch every card to the height of the tallest one in the row, so a
    // two-line shop name does not make its neighbours look ragged.
    alignItems: 'stretch',
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    // Fill the stretched wrapper; the wrapper is what sets the card's width.
    flex: 1,
    // The next card's own left margin provides the gap.
    marginRight: 0,
  },
});

// What the homepage blocks are resolved against: a restaurant of the list,
// plus the facets the collections are matched on.
type CollectionRestaurant = Restaurant & CollectableRestaurant;

type RowProps = {
  collection: ShopCollection<CollectionRestaurant>;
  onItemClick: (restaurant: CollectionRestaurant) => void;
};

const ShopCollectionRow = ({ collection, onItemClick }: RowProps) => {
  const renderItem = useCallback(
    ({ item }: { item: CollectionRestaurant }) => (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => onItemClick(item)}>
        <RestaurantCard restaurant={item} style={styles.card} />
      </TouchableOpacity>
    ),
    [onItemClick],
  );

  return (
    <View style={styles.collection}>
      <Text style={styles.title}>{collection.title}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        data={collection.restaurants}
        keyExtractor={item => item['@id']}
        renderItem={renderItem}
        testID={`shopCollection:${collection.key}`}
      />
    </View>
  );
};

type Props = {
  onItemClick: (restaurant: CollectionRestaurant) => void;
};

/**
 * The collections of the custom homepage, as horizontally scrollable rows.
 *
 * Meant to be rendered as the header of the restaurant list: the blocks only
 * say *which* collections to show, so they are resolved against the
 * restaurants already in the store, which keeps them in sync with the address
 * the customer searched for. Renders nothing when the server has no custom
 * homepage, or when none of its collections could be resolved.
 */
export default function ShopCollections({ onItemClick }: Props) {
  const { t } = useTranslation();
  const restaurants: CollectionRestaurant[] = useSelector(selectRestaurants);

  // Both endpoints are public; a server without a custom homepage simply
  // answers with an empty collection.
  const { data: blocks } = useGetHomepageBlocksQuery();
  const { data: shopCollections } = useGetShopCollectionsQuery();

  const collections = useMemo(
    () => resolveShopCollections(blocks, restaurants, shopCollections, t),
    [blocks, restaurants, shopCollections, t],
  );

  if (collections.length === 0) {
    return null;
  }

  return (
    <View testID="shopCollections">
      {collections.map(collection => (
        <ShopCollectionRow
          key={collection.key}
          collection={collection}
          onItemClick={onItemClick}
        />
      ))}
      <Text style={styles.title}>{t('ALL_RESTAURANTS')}</Text>
    </View>
  );
}
