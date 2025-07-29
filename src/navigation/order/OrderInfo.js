import { FlatList } from 'native-base';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import React, { useCallback, useMemo, useState } from 'react';

import { getAspectRatio } from '../task/components/mapUtils';
import { navigateToTask } from '../utils';
import { selectTasksByOrder as selectTasksByOrderLogistics } from '../../redux/logistics/selectors';
import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '../../redux/Courier/taskSelectors';

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
  const {orderId, isFromCourier } = route.params;
  const selectSelector = isFromCourier ? selectTasksByOrderCourier : selectTasksByOrderLogistics;
  const tasks = useSelector(selectSelector(orderId));

  const handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ height, width });
  };

    const handleTaskTitleClick = useCallback(task => {
      navigateToTask(navigation, route, task, tasks)
    }, [navigation, route, tasks])

  return (
    <View>
      <View style={{ height: '35%' }} onLayout={handleLayout}>
        <TaskMiniMap tasks={tasks} aspectRatio={aspectRatio} />
      </View>
      <FlatList
        style={{height: '65%'}}
        data={tasks}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <Details task={item} onTaskTitleClick={handleTaskTitleClick} />}
        ListHeaderComponent={
          <View key={'order-header'}>
            <Text
              key={'order-title-header-details'}
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                paddingLeft: 20,
                marginVertical: 10,
              }}>
              {i18n.t('DETAILS')}
            </Text>
            <OrderDetails key={'order-details-header'} tasks={tasks} />
          </View>
        }
      />
    </View>
  );
};

export default OrderInfo;
