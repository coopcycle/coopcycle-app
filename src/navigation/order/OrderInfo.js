import { FlatList } from 'native-base';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import React, { useCallback, useMemo, useState } from 'react';

import { getAspectRatio } from '../task/components/mapUtils';
import { getTaskTitle } from '../../shared/src/utils';
import { navigateToTask } from '../utils';
import { selectTasksByOrder } from '../../redux/logistics/selectors';
import Details from '../task/components/Details';
import i18n from '../../i18n';
import TaskMiniMap from '../task/components/MiniMap';
import OrderDetails from './components/OrderDetails';

const OrderInfo = ({ route }) => {
  const navigation = useNavigation();
  const [mapDimensions, setMapDimensions] = useState({ height: 0, width: 0 });
  const aspectRatio = useMemo(
    () => getAspectRatio(mapDimensions),
    [mapDimensions],
  );
  const orderId = route.params.order;
  const tasks = useSelector(selectTasksByOrder(orderId));

  const handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ height, width });
  };

    const handleTaskTitleClick = useCallback(task => {
      navigateToTask(navigation, route, task, tasks)
    }, [navigation, route, tasks])

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
        <TaskMiniMap tasks={tasks} aspectRatio={aspectRatio} />
      </View>
      <FlatList
        style={{height: '55%'}}
        data={tasks}
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
            <OrderDetails tasks={tasks} />
          </View>
        }
      />
    </View>
  );
};

export default OrderInfo;
