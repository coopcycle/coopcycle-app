import React from 'react';
import { withTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { phonecall } from 'react-native-communications';
import Foundation from 'react-native-vector-icons/Foundation';

import ItemSeparator from '../../../components/ItemSeparator';
import {
  isDisplayPaymentMethodInList,
  loadDescriptionTranslationKey,
  loadIconKey,
} from '../../../components/PaymentMethodInfo';
import { formatPrice } from '../../../utils/formatting';
import { getOrderTimeFrame } from './utils';
import Detail from './Detail';

const OrderDetails = ({ tasks, t }) => {
  const task = tasks[0];
  const timeframe = getOrderTimeFrame(tasks);

  const items = [
    {
      iconName: 'time',
      text: timeframe,
    },
  ];

  // Displays Recipient data (name, phone and any other useful data).
  if (tasks.length === 1 && isDropoff(task.type)) {
    if (task.address.telephone) {
      items.push({
        iconName: 'call',
        text: task.address.telephone,
        onPress: () => phonecall(task.address.telephone, true),
      });
    }

    if (task.address.description) {
      items.push({
        iconName: 'information-circle',
        text: task.address.description,
      });
    }
  }

  if (
    task.metadata &&
    task.metadata.payment_method &&
    isDisplayPaymentMethodInList(task.metadata.payment_method)
  ) {
    items.push({
      iconName: loadIconKey(task.metadata.payment_method),
      iconType: Foundation,
      text:
        t(loadDescriptionTranslationKey(task.metadata.payment_method)) +
        (task.metadata.order_total
          ? `: ${formatPrice(task.metadata.order_total)}`
          : ''),
    });
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => item.iconName}
      renderItem={({ item }) => <Detail item={item} />}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

const isDropoff = task => {
  return task.type === 'DROPOFF';
};

export default withTranslation()(OrderDetails);
