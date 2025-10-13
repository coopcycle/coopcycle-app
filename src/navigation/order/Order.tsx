import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, LayoutChangeEvent, View } from 'react-native';
import { useSelector } from 'react-redux';

import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '../../redux/Courier/taskSelectors';
import { selectTasksByOrder as selectTasksByOrderLogistics } from '../../redux/logistics/selectors';
import { getAspectRatio } from '../task/components/mapUtils';

import { createCurrentTaskList } from '../../shared/src/logistics/redux/taskListUtils';
import { blueColor } from '../../styles/common';
import Task from '../../types/task';
import TaskMiniMap from '../task/components/MiniMap';
import OrderAccordeon from './components/OrderAccordeon';
import OrderDetail from './components/OrderDetail';
import { RouteType } from './types';
import { Box } from '@/components/ui/box';
import { apiSlice, useGetTaskContextQuery } from '@/src/redux/api/slice';

const Order = ({ route }: RouteType) => {
  const [mapDimensions, setMapDimensions] = useState({ height: 0, width: 0 });
  const aspectRatio = useMemo(
    () => getAspectRatio(mapDimensions),
    [mapDimensions],
  );
  const { orderNumber, isFromCourier, orderDate, taskIds } = route.params;
  const selectSelector = isFromCourier
    ? selectTasksByOrderCourier
    : selectTasksByOrderLogistics;
  const orderTasksFromState = useSelector(selectSelector(orderNumber));
  const [trigger, { data, isLoading, isFetching }] = apiSlice.endpoints.getTasks.useLazyQuery();

  // Get missing tasks data when fetched if needed
  const orderTasks = useMemo(() => {
    if (!data?.length) return orderTasksFromState;

    return data.filter(task => taskIds?.includes(task.id));
  }, [orderTasksFromState, data, taskIds]);

  // Fetch missing tasks if needed
  useEffect(() => {
    if (orderTasks.length === 0 && orderDate && taskIds?.length && !isFetching) {
      console.log(`Fetching missing tasks data for '${orderDate}':`, taskIds);
      trigger(orderDate);
    }
  }, [orderTasks, orderDate, taskIds, isFetching, trigger]);

  const firstTaskId = orderTasks?.length ? orderTasks[0].id : null;
  const { data: taskCtxData, isLoading: taskCtxLoading, isFetching: taskCtxFetching } = useGetTaskContextQuery(firstTaskId, {skip: !firstTaskId});

  // Fetch context to get order distance/duration/polyline
  const tasksWithContext = useMemo(() => {
    if(!taskCtxData?.delivery) return orderTasks;

    const { distance, duration, polyline } = taskCtxData.delivery;

    return orderTasks.map(task => ({
      ...task,
      metadata: {
        ...task.metadata,
        order_distance: distance,
        order_duration: duration,
        polyline
      }
    }))
  }, [orderTasks, taskCtxData]);

  // Ugly workaround for colors for courier
  const tasks = useMemo(() => {
    if (isFromCourier) {
      const taskList = createCurrentTaskList(tasksWithContext);
      // Override color for courier
      return taskList.items.map(task => ({ ...task, color: blueColor }));
    }
    return tasksWithContext;
  }, [tasksWithContext, isFromCourier]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ height, width });
  };

  if (isLoading || taskCtxLoading || isFetching || taskCtxFetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

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
          <Box style={{ paddingHorizontal: 12 }}>
            <OrderAccordeon task={item as Task} />
          </Box>
        )}
        ListHeaderComponent={<OrderDetail tasks={tasks} />}
      />
    </View>
  );
};

export default Order;
