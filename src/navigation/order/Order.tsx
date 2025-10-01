import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
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
import { useGetTaskContextQuery } from '@/src/redux/api/slice';

const Order = ({ route }: { route: RouteType }) => {
  const [mapDimensions, setMapDimensions] = useState({ height: 0, width: 0 });
  const aspectRatio = useMemo(
    () => getAspectRatio(mapDimensions),
    [mapDimensions],
  );
  const { orderNumber, isFromCourier } = route.params;
  const selectSelector = isFromCourier
    ? selectTasksByOrderCourier
    : selectTasksByOrderLogistics;
  const orderTasks = useSelector(selectSelector(orderNumber));

  // Ugly workaround for colors for courier
  const tasks = useMemo(() => {
    if (isFromCourier) {
      const taskList = createCurrentTaskList(orderTasks);
      // Override color for courier
      return taskList.items.map(task => ({ ...task, color: blueColor }));
    }
    return orderTasks;
  }, [orderTasks, isFromCourier]);

  const firstTaskId = tasks.length ? tasks[0].id : null;
  const {data, isLoading, isFetching} = useGetTaskContextQuery(firstTaskId, {skip: !firstTaskId});

  const tasksWithContext = useMemo(() => {
    if(!data?.delivery) return tasks;

    const { distance, duration, polyline } = data.delivery;

    return tasks.map(task => ({
      ...task,
      metadata: {
        ...task.metadata,
        order_distance: distance,
        order_duration: duration,
        polyline
      }
    }))
  }, [tasks, data]);

  const handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ height, width });
  };

  if (isLoading || isFetching) {
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
          tasks={tasksWithContext}
          aspectRatio={aspectRatio}
          onLayout={handleLayout}
        />
      </View>
      <FlatList
        style={{ height: '65%' }}
        data={tasksWithContext}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Box style={{ paddingHorizontal: 12 }}>
            <OrderAccordeon task={item as Task} />
          </Box>
        )}
        ListHeaderComponent={<OrderDetail tasks={tasksWithContext} />}
      />
    </View>
  );
};

export default Order;
