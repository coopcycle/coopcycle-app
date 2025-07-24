import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { selectAllTasks } from '../../shared/logistics/redux';
import MiniMap from '../task/components/MiniMap';
import { getAspectRatio } from '../task/components/mapUtils';
import Details from '../task/components/Details';
import OrderDetails from '../task/components/OrderDetails';

const DispatchOrderDetails = ({ route }) => {
  const [mapDimensions, setMapDimensions] = useState({ height: 0, width: 0 });
  const aspectRatio = useMemo(
    () => getAspectRatio(mapDimensions),
    [mapDimensions],
  );
  const orderId = route.params.order;
  const tasks = useSelector(selectAllTasks);

  const filteredTasksByOrderId = tasks.filter(
    task => task.metadata.order_number === orderId,
  );

  const handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ height, width });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ height: '35%' }}>
          <MiniMap
            tasks={filteredTasksByOrderId}
            onLayout={handleLayout}
            aspectRatio={aspectRatio}
          />
        </View>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              paddingLeft: 10,
              marginVertical: 10,
            }}>
            {'DETAILS'}
          </Text>
          <OrderDetails tasks={filteredTasksByOrderId} />
        </View>
        <ScrollView style={{ height: '55%' }}>
          {filteredTasksByOrderId.map(task => {
            return (
              <>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    paddingLeft: 10,
                    marginVertical: 20,
                  }}>{`Task - ${task.id}`}</Text>
                <Details task={task} />
              </>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default DispatchOrderDetails;
