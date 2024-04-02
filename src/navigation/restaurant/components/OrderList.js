import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import ItemSeparatorComponent from '../../../components/ItemSeparator';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectAcceptedOrders,
  selectCancelledOrders,
  selectFulfilledOrders,
  selectNewOrders,
  selectPickedOrders,
  selectReadyOrders,
  selectRestaurant,
  selectStartedOrders,
} from '../../../redux/Restaurant/selectors';
import OrderItem from './OrderItem';

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default function OrderList({ onItemClick }) {
  const restaurant = useSelector(selectRestaurant);

  const newOrders = useSelector(selectNewOrders);
  const acceptedOrders = useSelector(selectAcceptedOrders);
  const startedOrders = useSelector(selectStartedOrders);
  const readyOrders = useSelector(selectReadyOrders);
  const pickedOrders = useSelector(selectPickedOrders);
  const cancelledOrders = useSelector(selectCancelledOrders);
  const fulfilledOrders = useSelector(selectFulfilledOrders);

  const { t } = useTranslation();

  const sections = [
    ...(restaurant.autoAcceptOrdersEnabled
      ? []
      : [
          {
            title: t('RESTAURANT_ORDER_LIST_NEW_ORDERS', {
              count: newOrders.length,
            }),
            data: newOrders,
          },
        ]),
    {
      title: t('RESTAURANT_ORDER_LIST_ACCEPTED_ORDERS', {
        count: acceptedOrders.length,
      }),
      data: acceptedOrders,
    },
    {
      title: t('RESTAURANT_ORDER_LIST_STARTED_ORDERS', {
        count: startedOrders.length,
      }),
      data: startedOrders,
    },
    {
      title: t('RESTAURANT_ORDER_LIST_READY_ORDERS', {
        count: readyOrders.length,
      }),
      data: readyOrders,
    },
    {
      title: t('RESTAURANT_ORDER_LIST_PICKED_ORDERS', {
        count: pickedOrders.length,
      }),
      data: pickedOrders,
    },
    {
      title: t('RESTAURANT_ORDER_LIST_CANCELLED_ORDERS', {
        count: cancelledOrders.length,
      }),
      data: cancelledOrders,
    },
    {
      title: t('RESTAURANT_ORDER_LIST_FULFILLED_ORDERS', {
        count: fulfilledOrders.length,
      }),
      data: fulfilledOrders,
    },
  ];

  return (
    <SectionList
      keyExtractor={(item, index) => item['@id']}
      sections={sections}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <OrderItem order={item} onItemClick={onItemClick} />
      )}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
}
