import Modal from 'react-native-modal';
import ModalContent from './ModalContent';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationHolder from '../NavigationHolder';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { loadTasks } from '../redux/Courier';

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    backgroundColor: '#39CCCC',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },
  item: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default function NotificationModal({ notifications, onDismiss }) {
  const isModalVisible = notifications.length > 0;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const _keyExtractor = (item, index) => {
    switch (item.event) {
      case 'order:created':
        return `order:created:${item.params.order.id}`;
      case 'tasks:changed':
        return `tasks:changed:${moment()}`;
    }
  };

  const _navigateToOrder = order => {
    onDismiss();

    NavigationHolder.dispatch(
      CommonActions.navigate({
        name: 'RestaurantNav',
        params: {
          screen: 'Main',
          params: {
            restaurant: order.restaurant,
            // We don't want to load orders again when navigating
            loadOrders: false,
            screen: 'RestaurantOrder',
            params: {
              order,
            },
          },
        },
      }),
    );
  };

  const _navigateToTasks = date => {
    onDismiss();

    NavigationHolder.dispatch(
      CommonActions.navigate({
        name: 'CourierNav',
        params: {
          screen: 'CourierHome',
          params: {
            screen: 'CourierTaskList',
          },
        },
      }),
    );

    dispatch(loadTasks(moment(date)));
  };

  const renderOrderCreated = order => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => _navigateToOrder(order)}>
        <Text>{t('NOTIFICATION_ORDER_CREATED_TITLE')}</Text>
        <Icon as={FontAwesome} name="chevron-right" />
      </TouchableOpacity>
    );
  };

  const renderTasksChanged = (date, added, removed) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => _navigateToTasks(date)}>
        <View>
          <Text style={{ fontSize: 14, fontWeight: '700' }}>
            {t('NOTIFICATION_TASKS_CHANGED_TITLE')}
          </Text>
          {added && Array.isArray(added) && added.length > 0 && (
            <Text style={{ fontSize: 14 }}>
              {t('NOTIFICATION_TASKS_ADDED', {
                count: added.length,
              })}
            </Text>
          )}
          {removed && Array.isArray(removed) && removed.length > 0 && (
            <Text style={{ fontSize: 14 }}>
              {t('NOTIFICATION_TASKS_REMOVED', {
                count: removed.length,
              })}
            </Text>
          )}
        </View>
        <Icon as={FontAwesome} name="chevron-right" />
      </TouchableOpacity>
    );
  };

  const renderItem = notification => {
    switch (notification.event) {
      case 'order:created':
        return renderOrderCreated(notification.params.order);
      case 'tasks:changed':
        return renderTasksChanged(
          notification.params.date,
          notification.params.added,
          notification.params.removed,
        );
    }
  };

  return (
    <Modal isVisible={isModalVisible}>
      <ModalContent>
        <View>
          <View style={styles.heading}>
            <Icon
              as={Ionicons}
              name="notifications"
              style={{ color: 'white', marginRight: 10 }}
            />
            <Text style={{ color: 'white' }}>{t('NEW_NOTIFICATION')}</Text>
          </View>
        </View>
        <FlatList
          data={notifications}
          keyExtractor={_keyExtractor}
          renderItem={({ item }) => renderItem(item)}
        />
        <TouchableOpacity style={styles.footer} onPress={() => onDismiss()}>
          <Text style={{ color: '#FF4136' }}>{t('CLOSE')}</Text>
        </TouchableOpacity>
      </ModalContent>
    </Modal>
  );
}
