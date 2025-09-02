import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
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
import { Box } from '../../../components/ui/box';

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
