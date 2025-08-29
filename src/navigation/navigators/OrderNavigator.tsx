import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { useStackNavigatorScreenOptions } from '../styles';
import OrderTitle from '../../components/OrderTitle';
import screens from '..';
import { Icon } from '../../components/gluestack';
import useSetTaskListItems from '../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import {
  selectTaskLists,
  selectTasksEntities,
} from '../../shared/logistics/redux';
import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';
import { buildSelectedTasks } from '../../shared/src/logistics/redux/taskListUtils';
import { selectTasksByOrder as selectTasksByOrderLogistics } from '../../redux/logistics/selectors';
import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '../../redux/Courier/taskSelectors';

const RootStack = createStackNavigator();

interface HeaderProps {
  route: {
    params?: {
      orderId?: string | number;
      isFromCourier?: boolean;
    };
  };
}

const Header: React.FC<HeaderProps> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tasksEntities = useSelector(selectTasksEntities);
  const allTaskLists = useSelector(selectTaskLists);

  const { orderId, isFromCourier } = route.params || {};

  const selectSelector = isFromCourier
    ? selectTasksByOrderCourier
    : selectTasksByOrderLogistics;
  const orderTasks = useSelector(selectSelector(orderId));

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
    <TouchableOpacity
      onPress={handleBulkEditPress}
      style={{
        marginRight: 16,
        padding: 8,
      }}>
      <Icon name="user-circle" useFontAwesome={true} size={26} />
    </TouchableOpacity>
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
          title: <OrderTitle order={route.params?.orderId} />,
          headerShown: true,
          headerRight: () => <Header route={route} />,
        })}
      />
    </RootStack.Navigator>
  );
};
