import React from 'react';

import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import IconText from '../../../components/IconText';
import TaskTagsList from '../../../components/TaskTagsList';
import { useBlackAndWhiteTextColor } from '../../../styles/gluestack-theme';
import { Tasks } from '../../../types/tasks';
import { formatPrice } from '../../../utils/formatting';
import { getOrderTimeFrame } from '../../task/components/utils';
import {
  commentsInOrder,
  getOrderTitle,
  getUniqueTagsFromTasks,
  orderInfoInMetadata,
  packagesInOrderSummery,
} from './../utils';

const OrderDetail = ({ tasks }: { tasks: Tasks }) => {
  const { t } = useTranslation();
  const orderTitle = getOrderTitle(tasks);
  const packagesInOrder = packagesInOrderSummery(tasks);
  const orderTimeframe = getOrderTimeFrame(tasks);
  const orderPaymentMethod = orderInfoInMetadata(tasks, 'payment_method');
  const orderDistance = orderInfoInMetadata(tasks, 'order_distance');
  const orderTags = getUniqueTagsFromTasks(tasks);
  const orderValue = orderInfoInMetadata(tasks, 'order_total');
  const comments = commentsInOrder(tasks);
  const titleColor = useBlackAndWhiteTextColor();

  return (
    <Box style={{ gap: 12, padding: 24 }}>
      <Text
        size="xl"
        style={{
          textTransform: 'uppercase',
          color: titleColor,
        }}>
        {orderTitle}
      </Text>
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
            text={`${orderDistance}`}
            iconName="route"
          />
        </>
      )}
      {!!packagesInOrder.totalQuantity && (
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
