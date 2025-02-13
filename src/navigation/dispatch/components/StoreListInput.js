import { Icon, Text } from 'native-base';
import { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ItemSeparator from '../../../components/ItemSeparator';
import KeyboardAdjustView from '../../../components/KeyboardAdjustView';

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
  });


  const renderItem = (store) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectStore(store)}
        style={styles.item}
        testID={`dispatch:storeList:${store.id}`}>
        <Text style={styles.itemLabel}>
          {store.name}
        </Text>
        <Icon as={FontAwesome} name="arrow-right" />
      </TouchableOpacity>
    );
  }
// TODO KeyboardAdjustView needs more testing on Android
  return <KeyboardAdjustView style={{ flex: 1 }} androidBehavior={''}>
            <FlatList
            data={stores}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => renderItem(item)}
            ItemSeparatorComponent={ItemSeparator}
          />
        </KeyboardAdjustView>
}
