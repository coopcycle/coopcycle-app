import { FlatList, RefreshControl } from 'react-native';
import { Icon, ArrowRightIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';

import ItemSeparator from '../../../components/ItemSeparator';

export default function StoreListSelect({
  stores,
  onSelectStore,
  isRefreshing,
  onRefreshStores,
}) {

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onSelectStore(item)}
        testID={`dispatch:storeList:${index}`}>
        <HStack className="items-center justify-between p-4">
          <Text>{item.name}</Text>
          <Icon as={ArrowRightIcon} />
        </HStack>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={stores}
      keyExtractor={(item, index) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefreshStores} />
      }
    />
  );
}
