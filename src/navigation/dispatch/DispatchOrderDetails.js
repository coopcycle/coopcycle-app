import React, { useCallback, useMemo, useState } from 'react';
import { FlatList } from 'native-base';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import i18n from '../../i18n';
import { selectAllTasks } from '../../shared/logistics/redux';
import MiniMap from '../task/components/MiniMap';
import { getAspectRatio } from '../task/components/mapUtils';
import Details from '../task/components/Details';
import OrderDetails from '../task/components/OrderDetails';
import { getTaskTitle } from '../../shared/src/utils';
import { navigateToTask } from '../utils';

const DispatchOrderDetails = ({ route }) => {
  const navigation = useNavigation();
  const [mapDimensions, setMapDimensions] = useState({ height: 0, width: 0 });
  const aspectRatio = useMemo(
    () => getAspectRatio(mapDimensions),
    [mapDimensions],
  );
  const tasks = useSelector(selectAllTasks);

  const orderId = route.params.order;

  const filteredTasksByOrderId = tasks.filter(
    task => task.metadata.order_number === orderId,
  );

  const handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ height, width });
  };

    const handleTaskTitleClick = useCallback(task => {
      navigateToTask(navigation, route, task, filteredTasksByOrderId)
    }, [navigation, route, filteredTasksByOrderId])

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity>
        <Text
          onPress={() => {handleTaskTitleClick(item)}}
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            paddingLeft: 10,
            marginVertical: 20,
          }}>
          {getTaskTitle(item)}
        </Text>
      </TouchableOpacity>
      <Details task={item} />
    </View>
  );

  return (
    <View>
      <View style={{ height: '35%' }} onLayout={handleLayout}>
        <MiniMap tasks={filteredTasksByOrderId} aspectRatio={aspectRatio} />
      </View>
      <FlatList
        style={{height: '55%'}}
        data={filteredTasksByOrderId}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListHeaderComponent={
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                paddingLeft: 10,
                marginVertical: 10,
              }}>
              {i18n.t('DETAILS')}
            </Text>
            <OrderDetails tasks={filteredTasksByOrderId} />
          </View>
        }
      />
    </View>
  );
};

export default DispatchOrderDetails;
