import { FlatList } from 'native-base';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '../../redux/Courier/taskSelectors';
import { selectTasksByOrder as selectTasksByOrderLogistics } from '../../redux/logistics/selectors';
import { getAspectRatio } from '../task/components/mapUtils';

import { Box, Divider, Text } from '../../components/gluestack';

import IconText from '../../components/IconText';
import { createCurrentTaskList } from '../../shared/src/logistics/redux/taskListUtils';
import { blueColor } from '../../styles/common';
import Task from '../../types/task';
import TaskMiniMap from '../task/components/MiniMap';
import OrderAccordeon from './components/OrderAccordeon';
import { RouteType } from './types';
import {
  commentsInOrder,
  getOrderTitle,
  getUniqueTagsFromTasks,
  orderInfoInMetadata,
  packagesInOrderSummery,
} from './utils';
import { Tasks } from '../../types/tasks';
import { getOrderTimeFrame } from '../task/components/utils';
import TaskTagsList from '../../components/TaskTagsList';

const OrderHeader = ({ tasks }: { tasks: Tasks }) => {
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

const Order = ({ route }: { route: RouteType }) => {
  const [mapDimensions, setMapDimensions] = useState({ height: 0, width: 0 });
  const aspectRatio = useMemo(
    () => getAspectRatio(mapDimensions),
    [mapDimensions],
  );
  const { orderId, isFromCourier } = route.params;
  const selectSelector = isFromCourier
    ? selectTasksByOrderCourier
    : selectTasksByOrderLogistics;
  const orderTasks = useSelector(selectSelector(orderId));
  // Ugly workaround for colors for courier
  const tasks = useMemo(() => {
    if (isFromCourier) {
      const taskList = createCurrentTaskList(orderTasks);
      // Override color for courier
      return taskList.items.map(task => ({ ...task, color: blueColor }));
    }
    return orderTasks;
  }, [orderTasks, isFromCourier]);

  const handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ height, width });
  };

  return (
    <View>
      <View style={{ height: '35%' }} onLayout={handleLayout}>
        <TaskMiniMap
          tasks={tasks}
          aspectRatio={aspectRatio}
          onLayout={handleLayout}
        />
      </View>
      <FlatList
        style={{ height: '65%' }}
        data={tasks}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Box sx={{ paddingHorizontal: 12 }}>
            <OrderAccordeon task={item as Task} />
          </Box>
        )}
        ListHeaderComponent={<OrderHeader tasks={tasks} />}
      />
    </View>
  );
};

export default Order;
