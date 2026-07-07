import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import { useStackNavigatorScreenOptions } from '../styles';
import { usePrimaryContentColor } from '@/src/styles/theme';
import screens from '..';
import { TaskActionsMenu } from '../dispatch/TaskActionsMenu';
import { clearSelectedTasks } from '@/src/redux/Dispatch/updateSelectedTasksSlice';
import { buildSelectedTasks } from '@/src/shared/src/logistics/redux/taskListUtils';
import { selectTaskLists, selectTasksEntities } from '@/src/shared/logistics/redux';
import { selectTasksByOrder as selectTasksByOrderLogistics } from '@/src/redux/logistics/selectors';
import { selectFilteredTasksByOrder as selectTasksByOrderCourier } from '@/src/redux/Courier/taskSelectors';
import useSetTaskListItems from '@/src/shared/src/logistics/redux/hooks/useSetTaskListItems';
import { getOrderTitle } from '@/src/components/OrderTitle';

const RootStack = createStackNavigator();

const OrderMenuHeader = ({ orderNumber, isFromCourier, status }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const allTaskLists = useSelector(selectTaskLists);
  const tasksEntities = useSelector(selectTasksEntities);
  const selectSelector = isFromCourier
    ? selectTasksByOrderCourier
    : selectTasksByOrderLogistics;
  const orderTasks = useSelector(selectSelector(orderNumber));

  const { bulkEditTasks } = useSetTaskListItems({
    allTaskLists,
    tasksEntities,
  });

  const handleAssignPress = useCallback(() => {
    const selectedTasks = buildSelectedTasks(orderTasks, [], allTaskLists);
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => {
        navigation.navigate('DispatchAllTasks');
        bulkEditTasks(selectedTasks, user).then(() =>
          dispatch(clearSelectedTasks()),
        );
      },
      showUnassignButton: true,
      onUnassignButtonPress: () => {
        navigation.navigate('DispatchAllTasks');
        bulkEditTasks(selectedTasks).then(() => dispatch(clearSelectedTasks()));
      },
    });
  }, [orderTasks, allTaskLists, bulkEditTasks, navigation, dispatch]);

  // Do not display the menu if the status is one of these
  if (status === 'CANCELLED' || status === 'DONE' || status === 'FAILED') {
    return null;
  }

  return (
    <TaskActionsMenu
      navigation={navigation}
      tasks={orderTasks}
      showCounter={false}
      enabledActions={{
        start: true,
        complete: true,
        assign: !isFromCourier,
        cancel: !isFromCourier,
        reportIncident: true,
      }}
      onAssign={handleAssignPress}
      cancelContext="order"
      entityName={orderNumber}
    />
  );
};

function CloseButton() {
  const navigation = useNavigation();
  const iconColor = usePrimaryContentColor();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
      <X color={iconColor} size={22} />
    </TouchableOpacity>
  );
}

export default function OrderNavigator() {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="Order"
        component={screens.Order}
        options={({ route }) => {
          const { orderNumber, isFromCourier, status } = route.params ?? {};

          return {
            title: getOrderTitle(orderNumber),
            headerShown: true,
            headerLeft: () => <CloseButton />,
            headerRight: () => (
              <OrderMenuHeader
                orderNumber={orderNumber}
                isFromCourier={isFromCourier}
                status={status}
              />
            ),
          };
        }}
      />
    </RootStack.Navigator>
  );
};
