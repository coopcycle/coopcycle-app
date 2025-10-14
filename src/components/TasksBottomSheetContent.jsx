import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  BottomSheetPortal,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetFlatList,
  BottomSheetDragIndicator,
} from '@/components/ui/bottomsheet';
import FAIcon from './Icon';
import { getTimeFrame } from '../navigation/task/components/utils';
import { useNavigation } from '@react-navigation/native';
import TaskDetails from './Detail';
import { navigateToTask } from '../navigation/utils';
import { useRoute } from '@react-navigation/native';

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
  colAssigned: { flex: 0.35, alignItems: 'center', justifyContent: 'center' },
  taskCode: { fontWeight: '900', marginLeft: 4, color: 'black' },
  taskTime: { color: '#555', textAlign: 'center', flexShrink: 0 },
  taskCourier: { color: '#555', textAlign: 'center' },
});

const addressName = task => {
  const customerName = task.address.firstName
    ? [task.address.firstName, task.address.lastName].join(' ')
    : null;
  return task.address.name || customerName || task.address.streetAddress;
};

export default function TasksBottomSheetContent({ modalMarkers = [] }) {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedTask, setSelectedTask] = useState(null); // 👈 Nuevo estado

  console.log('task', selectedTask);
  if (!modalMarkers || modalMarkers.length === 0) return null;

  const mainTask = modalMarkers[0];
  const address = mainTask.address?.streetAddress || '';

  return (
    <>
      <BottomSheetPortal
        snapPoints={['35%', '50%']}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={BottomSheetDragIndicator}
        style={{ zIndex: 9999, elevation: 9999 }}>
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
                        <Text style={styles.taskCourier}>
                          {item.assignedTo}
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

      {/* 👇 Renderiza los detalles solo si hay una tarea seleccionada */}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onTaskTitleClick={task => navigateToTask(navigation, route, task)}
        />
      )}
    </>
  );
}
