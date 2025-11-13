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
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cancelTask } from '../../redux/Courier/taskActions';

const RootStack = createStackNavigator();

interface HeaderProps {
  route: {
    params?: RouteType['route']['params'];
  };
}

const Header: React.FC<HeaderProps> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const tasksEntities = useSelector(selectTasksEntities);
  const allTaskLists = useSelector(selectTaskLists);
  const { orderNumber, isFromCourier, status } = route.params || {};
  const isCancelDisabled = status === 'CANCELLED' || status === 'DONE' || status === 'FAILED';

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

const handleCancelPress = useCallback(() => {
  const entity = t('ORDER');
  const name = orderNumber;

  Alert.alert(
    t('CANCEL_TITLE', { entity }),
    t('CANCEL_MESSAGE_WITH_TASKS', { entity, name }),
    [
      { text: t('CANCEL'), style: 'cancel' },
      {
        text: t('PROCEED'),
        style: 'destructive',
        onPress: () => {
          try {
            for (const task of orderTasks) {
              dispatch(cancelTask(task, () => {}));
            }

            navigation.goBack();
          } catch (error) {
            console.error('Cancel order error:', error);
            Alert.alert(
              t('CANCEL_ERROR_TITLE'),
              t('CANCEL_ERROR_MESSAGE', { entity }),
            );
          }
        },
      },
    ],
  );
}, [t, orderNumber, orderTasks, dispatch, navigation]);

  return (
    <HeaderButtons>
    {!isFromCourier && (
      <HeaderButton
        onPress={!isCancelDisabled ? handleCancelPress : undefined}
        iconName="ban"
        disabled={isCancelDisabled}
      />
    )}
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
