import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  BottomSheetPortal,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetContent,
  BottomSheetDragIndicator,
} from '@/components/ui/bottomsheet';
import FAIcon from './Icon';
import { getTimeFrame } from '../navigation/task/components/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { navigateToTask } from '../navigation/utils';

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 1,
    borderBottomColor: '#555555d1',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  colIcon: { flex: 0.05, alignItems: 'center', justifyContent: 'center' },
  colCode: { flex: 0.2, flexDirection: 'row', alignItems: 'center' },
  colTime: { flex: 0.4, alignItems: 'center', justifyContent: 'center' },
  colAssigned: {
    flex: 1,          // permite que el texto use el espacio disponible
    overflow: 'hidden', // asegura que se corte el texto
  },
  taskCourier: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,     // 🔑 evita que el texto empuje otros elementos
  },

  taskCode: { fontWeight: '900', marginLeft: 4, color: 'black' },
  taskTime: { color: '#555', textAlign: 'center', flexShrink: 0 }
});

const addressName = task => {
  const customerName = task.address.firstName
    ? [task.address.firstName, task.address.lastName].join(' ')
    : null;
  return task.address.name || customerName || task.address.streetAddress;
};

export default function TasksBottomSheetContent({ modalMarkers = [] }) {
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetRef = useRef(null);

  if (!modalMarkers || modalMarkers.length === 0) return null;

  const mainTask = modalMarkers[0];
  const address = mainTask.address?.streetAddress || '';

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
            {addressName(mainTask)} ({modalMarkers.length})
          </Text>
          <Text style={{ color: '#666', marginBottom: 10 }}>{address}</Text>

          <BottomSheetFlatList
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
                      #{item.short_id || item.id}
                    </Text>
                  </View>
                  <View style={styles.colTime}>
                    <Text style={styles.taskTime}>
                      {getTimeFrame(item) || 'No time'}
                    </Text>
                  </View>
                  <View style={styles.colAssigned}>
                    {item.assignedTo && (
                      <Text
                        style={styles.taskCourier}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        aasdasd
                      </Text>
                    )}
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
