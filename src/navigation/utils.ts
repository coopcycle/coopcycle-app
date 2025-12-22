import { ParamListBase, RouteProp } from '@react-navigation/core';
import { NavigationProp } from '@react-navigation/native';

let navigateAfter = null;

export const navigateToOrder = (navigation, orderNumber: string, isFromCourier = false, status = 'TODO', extraData = {}) => {
  const params = {
    orderNumber,
    isFromCourier,
    status,
    ...extraData
  };
  navigation.navigate('Order', { screen: 'Order', params });
};

export const navigateToTask = (navigation, route, task, tasks = []) => {
  if (route?.name !== 'TaskHome') {
    navigateAfter = route.name;
  }

  const params = {
    task,
    tasks,
    navigateAfter,
  };

  navigation.navigate('Task', {
    screen: 'TaskHome',
    params,
  });
};

export const navigateToCompleteTask = (
  navigation,
  route,
  task,
  tasks = [],
  success = true,
) => {
  const params = {
    task,
    tasks,
    navigateAfter: route?.name || null,
  };

  navigation.navigate('Task', {
    screen: 'TaskComplete',
    params: {
      screen: 'TaskCompleteHome',
      params: { ...params, success },
    },
  });
};

export const navigateBackToCompleteTask = (
  navigation: NavigationProp<ParamListBase>,
  route: RouteProp<ParamListBase>,
) => {
  const task = route.params?.task;
  const tasks = route.params?.tasks;
  const navigateAfter = route.params?.navigateAfter;
  const success = route.params?.success;

  navigation.popTo('TaskCompleteHome', { task, tasks, navigateAfter, success });
};
