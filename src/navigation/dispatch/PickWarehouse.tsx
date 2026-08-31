import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ArrowRightIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

import ItemSeparatorComponent from '../../components/ItemSeparator';
import { useGetWarehousesQuery } from '../../redux/api/slice';
import { Warehouse } from '../../redux/api/types';

type PickWarehouseProps = {
  // Optional so the component stays assignable to `ScreenComponentType`.
  route?: {
    params?: {
      onItemPress: (warehouse: Warehouse) => void;
    };
  };
};

export default function PickWarehouse({ route }: PickWarehouseProps) {
  const { t } = useTranslation();

  const { onItemPress } = route?.params ?? {};

  const { data: warehouses, isLoading } = useGetWarehousesQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!warehouses || warehouses.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>{t('DISPATCH_NO_WAREHOUSE')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.help}>{t('DISPATCH_SEND_TO_WAREHOUSE_HELP')}</Text>
      <FlatList
        data={warehouses}
        keyExtractor={(item: Warehouse) => item['@id']}
        renderItem={({ item }: { item: Warehouse }) => (
          <TouchableOpacity
            onPress={() => onItemPress?.(item)}
            testID={`sendToWarehouse:${item.id}`}
            style={styles.item}>
            <View style={styles.itemText}>
              <Text>{item.name}</Text>
              <Text style={styles.itemSubText}>
                {item.address?.streetAddress}
              </Text>
            </View>
            <Icon as={ArrowRightIcon} size="sm" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  help: {
    padding: 15,
    opacity: 0.7,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  itemText: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemSubText: {
    opacity: 0.7,
  },
});
