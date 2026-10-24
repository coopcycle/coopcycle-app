import { Icon, SearchIcon } from '@/components/ui/icon';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Restaurant, RestaurantCard } from './RestaurantCard';
import { useVisibleItems, VisibleItemsProvider } from './VisibleItems';

type Props = {
  restaurants: Restaurant[];
  addressAsText?: string;
  isFetching?: boolean;
  onItemClick: (restaurant: Restaurant) => void;
  ListHeaderComponent?: React.ReactElement | null;
};

// The e2e suite picks shops out of the list by the arrondissement they are in.
const MATCHING_POSTCODES = /75010|75019|75020/;

function withTestIDs(restaurants: Restaurant[]) {
  let matchingCounter = 0;

  return restaurants.map((restaurant, index) => {
    const isMatching = MATCHING_POSTCODES.test(
      restaurant.address?.streetAddress ?? '',
    );

    return {
      ...restaurant,
      testID: isMatching
        ? `restaurantMatches:${matchingCounter++}`
        : `restaurants:${index}`,
    };
  });
}

const EmptyState = ({
  addressAsText,
  isFetching,
}: {
  addressAsText?: string;
  isFetching?: boolean;
}) => {
  const { t } = useTranslation();

  if (isFetching) {
    return null;
  }

  if (addressAsText) {
    return (
      <Center flex={1} className="justify-center items-center px-2">
        <Image
          style={{
            maxWidth: '40%',
            maxHeight: '30%',
            marginVertical: '5%',
            margin: 'auto',
          }}
          source={require('../assets/images/no_addresses.png')}
          resizeMode={'contain'}
        />
        <Text style={{ textAlign: 'center' }}>{t('NO_RESTAURANTS')}</Text>
      </Center>
    );
  }

  //FIXME: This code is maybe unreachable
  return (
    <Center
      flex={1}
      className="justify-center items-center"
      testID="checkoutSearchContent">
      <Icon as={SearchIcon} style={{ color: '#cccccc' }} />
      <Text>{t('ENTER_ADDRESS')}</Text>
    </Center>
  );
};

export default function RestaurantList({
  restaurants,
  addressAsText,
  isFetching,
  onItemClick,
  ListHeaderComponent,
}: Props) {
  // Cards fetch their own timing, so the list has to say which are on screen.
  const { seen, listProps } = useVisibleItems();

  const renderItem = useCallback(
    ({ item }: { item: Restaurant & { testID: string } }) => (
      <TouchableOpacity onPress={() => onItemClick(item)} testID={item.testID}>
        <RestaurantCard restaurant={item} />
      </TouchableOpacity>
    ),
    [onItemClick],
  );

  return (
    <VisibleItemsProvider seen={seen}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        testID="restaurantList"
        data={withTestIDs(restaurants)}
        keyExtractor={item => item['@id']}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <EmptyState addressAsText={addressAsText} isFetching={isFetching} />
        }
        {...listProps}
      />
    </VisibleItemsProvider>
  );
}
