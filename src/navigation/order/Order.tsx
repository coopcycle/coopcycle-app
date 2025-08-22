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

const OrderHeader = () => {
  return (
    <Box sx={{ gap: 12, padding: 24 }}>
      <Text size="2xl" bold>
        Comercio - Luana Cuello
      </Text>
      <Divider />
      {/* order info esta hecho */}
      <IconText text="19:00 - 20:00" iconName="clock" />
      <Divider />
      {/* order total - hacer un find, la primera que la tenga agarrarlo - payment_method */}
      <IconText
        text="€ 18,15 -  € 15,00 (Sin IVA) - efectivo"
        iconName="money"
      />
      <Divider />
      {/* el recorrido total no lo tenemos - taskmetada order_distance si existe */}
      {/* paquetes de los pickup */}
      <IconText
        text="2.89km  - 2x1 GRANDE (Caja grande EUROBOX)"
        iconName="box"
      />
      <Divider />
      <IconText
        text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
        iconName="comments"
      />
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
          /* task={tasks[0]} */
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
        ListHeaderComponent={<OrderHeader />}
      />
    </View>
  );
};

export default Order;
