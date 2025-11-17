import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import IconText from '../../../components/IconText';
import TaskTagsList from '../../../components/TaskTagsList';
import { Tasks } from '../../../types/tasks';
import { formatPrice } from '../../../utils/formatting';
import { getOrderTimeFrame } from '../../task/components/utils';
import {
  commentsInOrder,
  formatDistance,
  formatDuration,
  getOrderTitle,
  getUniqueTagsFromTasks,
  orderInfoInMetadata,
  packagesInOrderSummary,
  getOrderStatus,
  getStatusBackgroundColor
} from './../utils';

const OrderDetail = ({ tasks }: { tasks: Tasks }) => {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return null;
  }

  const orderTitle = getOrderTitle(tasks);
  const packagesInOrder = packagesInOrderSummary(tasks);
  const orderTimeframe = getOrderTimeFrame(tasks);
  const orderPaymentMethod = orderInfoInMetadata(tasks, 'payment_method');
  const orderDistance = formatDistance(orderInfoInMetadata(tasks, 'order_distance'));
  const orderDuration = formatDuration(orderInfoInMetadata(tasks, 'order_duration'));
  const orderTags = getUniqueTagsFromTasks(tasks);
  const orderValue = orderInfoInMetadata(tasks, 'order_total');
  const comments = commentsInOrder(tasks);
  const status = getOrderStatus(tasks);
  const statusBgColor = getStatusBackgroundColor(status);

  return (
    <Box style={styles.container}>
      <View style={styles.titleRow}>
        <Text size="xl" style={styles.title}>
          {orderTitle}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      {orderTags.length > 0 && (
        <>
          <Divider />
          <TaskTagsList taskTags={orderTags} />
        </>
      )}
      <Divider />
      <IconText
        label={t('ORDER_SCHEDULE')}
        text={orderTimeframe}
        iconName="clock"
      />
      {!!orderValue && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_PRICE')}
            text={
              orderPaymentMethod
                ? `${formatPrice(orderValue)} ${orderPaymentMethod}`
                : formatPrice(orderValue)
            }
            iconName="money-check-alt"
          />
        </>
      )}

      {!!orderDistance && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_DISTANCE')}
            text={`${orderDistance} ${orderDuration ? ` - ${orderDuration} (${t('ESTIMATED_DURATION')})` : ''}`}
            iconName="route"
          />
        </>
      )}
      {packagesInOrder.totalQuantity > 0 && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_PACKAGES')}
            text={`${t('TOTAL_AMOUNT')}: ${packagesInOrder.totalQuantity}\n${packagesInOrder.text}`}
            iconName="boxes"
          />
        </>
      )}
      {comments.length > 0 && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_COMMENTS')}
            text={comments.join('\n\n')}
            iconName="comments"
          />
        </>
      )}
    </Box>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 24,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    textTransform: 'uppercase',
    maxWidth: '75%',
  },

  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },

  statusText: {
    color: 'black',
    fontSize: 11,
    fontWeight: '600',
  },
});
