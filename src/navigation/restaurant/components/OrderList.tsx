import React from 'react';
import { SectionList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectAcceptedOrders,
  selectAutoAcceptOrdersEnabled,
  selectCancelledOrders,
  selectFulfilledOrders,
  selectHasReadyState,
  selectHasStartedState,
  selectNewOrders,
  selectPickedOrders,
  selectReadyOrders,
  selectStartedOrders,
} from '../../../redux/Restaurant/selectors';
import OrderListItem from './OrderListItem';
import OrderListSectionHeader from './OrderListSectionHeader';

export default function OrderList({ onItemClick }) {
  const autoAcceptOrdersEnabled = useSelector(selectAutoAcceptOrdersEnabled);
  const hasStartedState = useSelector(selectHasStartedState);
  const hasReadyState = useSelector(selectHasReadyState);

  const newOrders = useSelector(selectNewOrders);
  const acceptedOrders = useSelector(selectAcceptedOrders);
  const startedOrders = useSelector(selectStartedOrders);
  const readyOrders = useSelector(selectReadyOrders);
  const pickedOrders = useSelector(selectPickedOrders);
  const cancelledOrders = useSelector(selectCancelledOrders);
  const fulfilledOrders = useSelector(selectFulfilledOrders);

  const { t } = useTranslation();

  const sections = [
    ...(autoAcceptOrdersEnabled
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
    ...(hasStartedState
      ? [
          {
            title: t('RESTAURANT_ORDER_LIST_STARTED_ORDERS', {
              count: startedOrders.length,
            }),
            data: startedOrders,
          },
        ]
      : []),
    ...(hasReadyState
      ? [
          {
            title: t('RESTAURANT_ORDER_LIST_READY_ORDERS', {
              count: readyOrders.length,
            }),
            data: readyOrders,
          },
        ]
      : []),
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
      keyExtractor={item => item['@id']}
      sections={sections}
      renderSectionHeader={({ section: { title } }) => (
        <OrderListSectionHeader title={title} />
      )}
      renderItem={({ item }) => (
        <OrderListItem order={item} onItemClick={onItemClick} />
      )}
      renderSectionFooter={() => <View style={{ height: 20 }} />}
    />
  );
}
