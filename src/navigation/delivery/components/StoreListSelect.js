import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Icon, Text } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react'

import ItemSeparator from '../../../components/ItemSeparator';

export default function StoreListSelect({
  stores,
  onSelectStore,
  isRefreshing,
  onRefreshStores
}) {
  const styles = StyleSheet.create({
    item: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      paddingHorizontal: 15,
    },
    itemLabel: {
      flex: 1,
      paddingHorizontal: 10,
    },
  });


  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectStore(item)}
        style={styles.item}
        testID={`dispatch:storeList:${index}`}>
        <Text style={styles.itemLabel}>
          {item.name}
        </Text>
        <Icon as={FontAwesome} name="arrow-right" />
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={stores}
      keyExtractor={(item, index) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefreshStores}
        />}
    />
  )
}
