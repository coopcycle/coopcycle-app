import { FlatList, StyleSheet } from 'react-native';
import { Icon, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ItemSeparator from '../../../components/ItemSeparator';

// TODO: rename this component
export default function StoreListInput({
  stores,
  onSelectStore,
}) {

  // TODO: remove this
  useEffect(() => {
    console.log(stores.map(s => s.name))
  }, [stores])

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
    storeList: {
      flex: 1,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1,
    },
  });


  const renderItem = (store) => {
    return (
      <TouchableOpacity
        onPress={onSelectStore}
        style={styles.item}
        testID={`dispatch:storeList:${store.id}`}>
        <Text style={styles.itemLabel}>
          {store.name}
        </Text>
        <Icon as={FontAwesome} name="arrow-right" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.storeList}>
        <FlatList
          data={stores}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => renderItem(item)}
          ItemSeparatorComponent={ItemSeparator}
        />
    </View>
  );
}
