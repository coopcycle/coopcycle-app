import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { selectAllTasks } from '../../shared/logistics/redux';
import MiniMap from '../task/components/MiniMap';
import { getAspectRatio } from '../task/components/mapUtils';

const DispatchOrderDetails = ({ route }) => {
  const [mapDimensions, setMapDimensions] = useState({ height: 0, width: 0 });
  const aspectRatio = useMemo(() => getAspectRatio(mapDimensions), [mapDimensions]);
  const orderId = route.params.order;
  const tasks = useSelector(selectAllTasks);

  const filteredTasksByOrderId = tasks.filter(
    task => task.metadata.order_number === orderId,
  );

  const handleLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({height, width});
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{height:'35%'}}>
          <MiniMap tasks={filteredTasksByOrderId} onLayout={handleLayout} aspectRatio={aspectRatio} />
        </View>
        <ScrollView style={{height: '55%'}}>
          {filteredTasksByOrderId.map(task => {
            return (
              <>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    paddingLeft: 10
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

const Details = ({ task, level = 1 }) => {
  if (typeof task !== 'object' || task === null) {
    return null;
  }

  return (
    <View style={{ paddingLeft: level * 10 }}>
      {Object.entries(task).map(([key, value]) => (
        <View key={key} style={{ marginBottom: 4 }}>
          {typeof value === 'object' && value !== null ? (
            <>
              <Text style={{ fontWeight: 'bold' }}>{key}:</Text>
              <Details task={value} level={level + 1} />
            </>
          ) : (
            <Text>{`${key}: ${String(value)}`}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default DispatchOrderDetails;
