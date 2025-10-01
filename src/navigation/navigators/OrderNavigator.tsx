import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { useStackNavigatorScreenOptions } from '../styles';
import OrderTitle from '../../components/OrderTitle';
import screens from '..';
import useSetTaskListItems from '../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import {
  selectTaskLists,
  selectTasksEntities,
} from '../../shared/logistics/redux';
import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';
import { buildSelectedTasks } from '../../shared/src/logistics/redux/taskListUtils';
import { selectTasksByOrder as selectTasksByOrderLogistics } from '../../redux/logistics/selectors';
import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '../../redux/Courier/taskSelectors';
import { HeaderButton, HeaderButtons } from '../../components/HeaderButton';
import { RouteType } from '../order/types';

const RootStack = createStackNavigator();

interface HeaderProps {
  route: {
    params?: RouteType['route']['params'];
  };
}

const Header: React.FC<HeaderProps> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tasksEntities = useSelector(selectTasksEntities);
  const allTaskLists = useSelector(selectTaskLists);

  const { orderNumber, isFromCourier } = route.params || {};

  const selectSelector = isFromCourier
    ? selectTasksByOrderCourier
    : selectTasksByOrderLogistics;
  const orderTasks = useSelector(selectSelector(orderNumber));

  const { bulkEditTasks } = useSetTaskListItems({
    allTaskLists,
    tasksEntities,
  });

  const onSelectNewAssignation = useCallback(
    (callback: () => void) => {
      navigation.navigate('DispatchAllTasks');
      callback();
    },
    [navigation],
  );

  const handleBulkEditPress = useCallback(() => {
    // Build selected tasks structure similar to GroupedTasks
    const selectedTasks = buildSelectedTasks(orderTasks, [], allTaskLists);

    navigation.navigate('DispatchPickUser', {
      onItemPress: user => {
        onSelectNewAssignation(async () => {
          await bulkEditTasks(selectedTasks, user);
          dispatch(clearSelectedTasks());
        });
      },
      showUnassignButton: true,
      onUnassignButtonPress: () => {
        onSelectNewAssignation(async () => {
          await bulkEditTasks(selectedTasks);
          dispatch(clearSelectedTasks());
        });
      },
    });
  }, [
    orderTasks,
    allTaskLists,
    navigation,
    bulkEditTasks,
    dispatch,
    onSelectNewAssignation,
  ]);

  return (
    <HeaderButtons>
      <HeaderButton onPress={handleBulkEditPress} iconName="person" />
    </HeaderButtons>
  );
};

export default () => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="Order"
        component={screens.Order}
        options={({ route, navigation }) => ({
          title: <OrderTitle order={route.params?.orderNumber} />,
          headerShown: true,
          headerRight: () => <Header route={route} />,
        })}
      />
    </RootStack.Navigator>
  );
};
