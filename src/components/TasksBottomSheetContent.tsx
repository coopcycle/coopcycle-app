import React, { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetFlatList,
  BottomSheetPortal,
  BottomSheetContext,
} from '@/components/ui/bottomsheet';
import FAIcon from './Icon';
import { getName, getTimeFrame } from '../navigation/task/components/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { navigateToTask } from '../navigation/utils';
import { getOrderNumberWithPosition } from '../utils/tasks';
import { getOrderTitle } from '../navigation/order/utils';

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 1,
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
    flexShrink: 1,
  },
  taskCode: { fontWeight: '700', marginLeft: 4 },
  taskTime: { textAlign: 'center', flexShrink: 0 },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

const addressName = task => {
  return task.address.name || getName(task);
};

export default function TasksBottomSheetContent({ modalMarkers = [], onListedTaskPress }) {
  const navigation = useNavigation();
  const route = useRoute();

  const bsContext = useContext(BottomSheetContext);
  const colorScheme = useColorScheme();
  const isDarkMode = typeof bsContext?.isDarkMode === 'boolean' ? bsContext.isDarkMode : colorScheme === 'dark';

  const colors = {
    textPrimary: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BBBBBB' : '#666666',
    border: isDarkMode ? '#333333' : '#CCCCCC',
    iconPickup: '#E53935',
    iconDropoff: '#4CAF50',
  };

  if (!modalMarkers || modalMarkers.length === 0) return null;

  const mainTask = modalMarkers.find(addressName) || modalMarkers[0];
  const mainName = addressName(mainTask);
  const mainAddress = mainTask.address.streetAddress;
  const orderTitle = getOrderTitle([mainTask]);

  return (
    <BottomSheetPortal
      snapPoints={['35%', '50%']}
      index={-1}
      backdropComponent={BottomSheetBackdrop}
      handleComponent={BottomSheetDragIndicator}
      enablePanDownToClose
    >
      <BottomSheetContent style={{ backgroundColor: colors.background }}>
        <View style={styles.headerContainer}>
          {orderTitle &&
            orderTitle !== mainName &&
            orderTitle !== mainAddress && (
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 17,
                  color: colors.textPrimary
                }}
              >
                {orderTitle.toUpperCase()}
              </Text>
            )}
          <Text
            style={{
              fontWeight: '700',
              fontSize: 15,
              color: colors.textPrimary,
            }}
          >
            {mainName || mainAddress} ({modalMarkers.length})
          </Text>

          {mainName && mainAddress !== mainName ? (
            <Text
              style={{
                color: colors.textSecondary,
                marginBottom: 10,
              }}
            >
              {mainAddress}
            </Text>
          ) : null}

          <BottomSheetFlatList
            style={{ marginTop: 10 }}
            contentContainerStyle={{ backgroundColor: colors.background }}
            data={modalMarkers}
            keyExtractor={(item, i) => `${item.id}-${i}`}
            renderItem={({ item }) => {
              const iconName = item.type === 'PICKUP' ? 'cube' : 'arrow-down';
              const iconColor =
                item.type === 'PICKUP' ? colors.iconPickup : colors.iconDropoff;

              return (
                <Pressable
                  style={[styles.taskRow, { borderTopColor: colors.border, backgroundColor: colors.background }]}
                  onPress={() => onListedTaskPress(item)} // 
                >
                  <View style={styles.colIcon}>
                    <FAIcon name={iconName} size={15} color={iconColor} />
                  </View>

                  <View style={styles.colCode}>
                    <Text
                      style={[
                        styles.taskCode,
                        { color: colors.textPrimary },
                      ]}
                    >
                      #{getOrderNumberWithPosition(item) || item.short_id || item.id}
                    </Text>
                  </View>

                  <View style={styles.colTime}>
                    <Text
                      style={[
                        styles.taskTime,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {getTimeFrame(item)}
                    </Text>
                  </View>

                  <View style={styles.colAssigned}>
                    <Text
                      style={[
                        styles.taskCourier,
                        { color: colors.textPrimary },
                      ]}
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
