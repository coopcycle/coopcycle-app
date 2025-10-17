import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetFlatList,
  BottomSheetPortal,
} from '@/components/ui/bottomsheet';
import FAIcon from './Icon';
import { getName, getTimeFrame } from '../navigation/task/components/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { navigateToTask } from '../navigation/utils';
import { getOrderNumberWithPosition } from '../utils/tasks';

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 1,
    borderTopColor: '#555555d1',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  colIcon: { flex: 0.1, alignItems: 'center', justifyContent: 'center' },
  colCode: { flex: 0.2, flexDirection: 'row', alignItems: 'center' },
  colTime: { flex: 0.4, alignItems: 'center', justifyContent: 'center' },
  colAssigned: {
    flex: 0.3,          
    overflow: 'hidden', 
  },
  taskCourier: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,  
  },

  taskCode: { fontWeight: '900', marginLeft: 4, color: 'black' },
  taskTime: { color: '#555', textAlign: 'center', flexShrink: 0 }
});

const addressName = task => {
  return task.address.name || getName(task);
};

export default function TasksBottomSheetContent({ modalMarkers = [] }) {
  const navigation = useNavigation();
  const route = useRoute();

  if (!modalMarkers || modalMarkers.length === 0) return null;

  const mainTask = modalMarkers.find(addressName) || modalMarkers[0];
  const mainName = addressName(mainTask);
  const mainAddress = mainTask.address.streetAddress;

  return (
    <BottomSheetPortal
      snapPoints={['35%', '50%']}
      index={-1}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
      enablePanDownToClose
    >
      <BottomSheetContent>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>
            {mainName || mainAddress} ({modalMarkers.length})
          </Text>
          {mainName && mainAddress !== mainName ? (
            <Text style={{ color: '#666', marginBottom: 10 }}>{mainAddress}</Text>
          ) : null}

          <BottomSheetFlatList
            style={{ marginTop: 10 }}
            data={modalMarkers}
            keyExtractor={(item, i) => `${item.id}-${i}`}
            renderItem={({ item }) => {
              const iconName = item.type === 'PICKUP' ? 'cube' : 'arrow-down';
              const iconColor =
                item.type === 'PICKUP' ? '#E53935' : '#4CAF50';

              return (
                <Pressable
                  style={styles.taskRow}
                  onPress={() => navigateToTask(navigation, route, item)}>
                  <View style={styles.colIcon}>
                    <FAIcon name={iconName} size={15} color={iconColor} />
                  </View>
                  <View style={styles.colCode}>
                    <Text style={styles.taskCode}>
                      #{getOrderNumberWithPosition(item) || item.short_id || item.id}
                    </Text>
                  </View>
                  <View style={styles.colTime}>
                    <Text style={styles.taskTime}>
                      {getTimeFrame(item)}
                    </Text>
                  </View>
                  <View style={styles.colAssigned}>
                    <Text
                      style={styles.taskCourier}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                       {item.address.contactName}
                    </Text>
                  </View>

                </Pressable>
              );
            }}
          />
        </View>
      </BottomSheetContent>
    </BottomSheetPortal>
  );
}
