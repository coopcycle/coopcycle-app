import React from 'react';

import { Box, Divider, Text } from '../../../components/gluestack';

import IconText from '../../../components/IconText';
import TaskTagsList from '../../../components/TaskTagsList';
import { Tasks } from '../../../types/tasks';
import { getOrderTimeFrame } from '../../task/components/utils';
import {
  commentsInOrder,
  getOrderTitle,
  getUniqueTagsFromTasks,
  orderInfoInMetadata,
  packagesInOrderSummery,
} from './../utils';

const OrderDetail = ({ tasks }: { tasks: Tasks }) => {
  const orderTitle = getOrderTitle(tasks);
  const packagesInOrder = packagesInOrderSummery(tasks);
  const orderTimeframe = getOrderTimeFrame(tasks);
  const orderPaymentMethod = orderInfoInMetadata(tasks, 'payment_method');
  const orderDistance = orderInfoInMetadata(tasks, 'order_distance');
  const orderTags = getUniqueTagsFromTasks(tasks);
  const orderValue = orderInfoInMetadata(tasks, 'order_total');
  const comments = commentsInOrder(tasks);

  return (
    <Box sx={{ gap: 12, padding: 24 }}>
      <Text size="2xl" bold>
        {orderTitle}
      </Text>
      {orderTags.length > 0 && (
        <>
          <Divider />
          <TaskTagsList taskTags={orderTags} />
        </>
      )}
      <Divider />
      <IconText text={orderTimeframe} iconName="clock" />
      <Divider />
      <IconText
        text={`$ ${orderValue}${orderPaymentMethod ? ` - ${orderPaymentMethod}` : ''}`}
        iconName="money-check-alt"
      />
      {orderDistance && (
        <>
          <Divider />
          <IconText text={`${orderDistance}`} iconName="route" />
        </>
      )}
      <Divider />
      <IconText
        text={`Total amout: ${packagesInOrder.totalQuantity}\n${packagesInOrder.text}`}
        iconName="boxes"
      />
      {comments.length > 0 && (
        <>
          <Divider />
          <IconText text={comments.join('\n')} iconName="comments" />
        </>
      )}
    </Box>
  );
};

export default OrderDetail;
