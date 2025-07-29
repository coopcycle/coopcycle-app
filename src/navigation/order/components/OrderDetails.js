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
import { getOrderTimeFrame } from '../../task/components/utils';
import Detail from '../../../components/Detail';

const OrderDetails = ({ tasks, t }) => {
  const firstTask = tasks[0];
  const timeframe = getOrderTimeFrame(tasks);
  // TODO: Set items inside state, check task properties in useEffect hook.
  const items = [
    {
      id:'timeframe',
      iconName: 'time',
      text: timeframe,
    },
  ];

  if (isSingleTask(tasks) && isDropoff(firstTask)) {
    if (firstTask.address.telephone) {
      items.push({
        id:'telephone',
        iconName: 'call',
        text: firstTask.address.telephone,
        onPress: () => phonecall(firstTask.address.telephone, true),
      });
    }

    if (firstTask.address.description || firstTask.address.streetAddress) {
      items.push({
        id:'information-circle',
        iconName: 'information-circle',
        text: firstTask.address.description || firstTask.address.streetAddress,
      });
    }
  }

  if (
    firstTask.metadata &&
    firstTask.metadata.payment_method &&
    isDisplayPaymentMethodInList(firstTask.metadata.payment_method)
  ) {
    items.push({
      id:'payment-method',
      iconName: loadIconKey(firstTask.metadata.payment_method),
      iconType: Foundation,
      text:
        t(loadDescriptionTranslationKey(firstTask.metadata.payment_method)) +
        (firstTask.metadata.order_total
          ? `: ${formatPrice(firstTask.metadata.order_total)}`
          : ''),
    });
  }

  return (
    <FlatList
      data={items}
      keyExtractor={ (item) => `order-detail-${item.id}`}
      renderItem={({ item }) => <Detail item={item} />} 
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

const isPickup = task => {
  return task.type === 'PICKUP';
};

const isDropoff = task => {
  return task.type === 'DROPOFF';
};

const isSingleTask = tasks => {
  return tasks.length === 1
}

export default withTranslation()(OrderDetails);
