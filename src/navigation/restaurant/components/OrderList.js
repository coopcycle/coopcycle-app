import React from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HStack, Icon, Text } from 'native-base';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { formatPrice } from '../../../utils/formatting';
import OrderNumber from '../../../components/OrderNumber';
import ItemSeparatorComponent from '../../../components/ItemSeparator';
import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon';
import { PaymentMethodInfo } from '../../../components/PaymentMethodInfo';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectAcceptedOrders,
  selectCancelledOrders,
  selectFulfilledOrders,
  selectNewOrders,
  selectPickedOrders,
  selectReadyOrders,
  selectStartedOrders,
} from '../../../redux/Restaurant/selectors';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  number: {
    marginRight: 10,
  },
});

export default function OrderList({ onItemClick }) {
  const newOrders = useSelector(selectNewOrders);
  const acceptedOrders = useSelector(selectAcceptedOrders);
  const startedOrders = useSelector(selectStartedOrders);
  const readyOrders = useSelector(selectReadyOrders);
  const pickedOrders = useSelector(selectPickedOrders);
  const cancelledOrders = useSelector(selectCancelledOrders);
  const fulfilledOrders = useSelector(selectFulfilledOrders);

  const { t } = useTranslation();

  const sections = [
    {
      title: t('RESTAURANT_ORDER_LIST_NEW_ORDERS', {
        count: newOrders.length,
      }),
      data: newOrders,
    },
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

  const renderItem = order => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => onItemClick(order)}>
        <HStack alignItems="center">
          <View style={styles.number}>
            <OrderNumber order={order} />
          </View>
          <OrderFulfillmentMethodIcon order={order} small />
          <PaymentMethodInfo
            fullDetail={false}
            paymentMethod={order.paymentMethod}
          />
          {order.notes ? (
            <Icon as={FontAwesome} name="comments" size="xs" />
          ) : null}
        </HStack>
        <Text>{`${formatPrice(order.itemsTotal)}`}</Text>
        <Text>{moment.parseZone(order.pickupExpectedAt).format('LT')}</Text>
        <Icon as={Ionicons} style={{ color: '#ccc' }} name="arrow-forward" />
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      keyExtractor={(item, index) => item['@id']}
      sections={sections}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        </View>
      )}
      renderItem={({ item }) => renderItem(item)}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
}
