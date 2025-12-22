import { ParamListBase, RouteProp } from '@react-navigation/core';
import { NavigationProp } from '@react-navigation/native';
import Task from '@/src/types/task';

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

export const navigateToTask = (navigation, route, task: Task, tasks = []) => {
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

export const navigateToReportTask = (
  navigation,
  route,
  task,
  tasks = [],
  success = false,
) => {
  const params = {
    task,
    tasks,
    navigateAfter: route.name,
  };

  navigation.navigate('Task', {
    screen: 'TaskComplete',
    params: {
      screen:'ReportIncidentHome',
      params: {...params, success}
    },
  });
};

export const navigateToProofOfDeliveryFromReportIncident = (
  navigation, route, task, tasks, success
) => {
  navigation.navigate('TaskCompleteProofOfDelivery', {
    task,
    tasks,
    navigateAfter: route.params?.navigateAfter,
    success,
  }, { merge: true})
};

export const navigateBackToCompleteTask = (
  navigation: NavigationProp<ParamListBase>,
  route: RouteProp<ParamListBase>,
) => {
  const task = route.params?.task;
  const tasks = route.params?.tasks;
  const navigateAfter = route.params?.navigateAfter;
  const success = route.params?.success;

  navigation.popTo(success ? 'TaskCompleteHome' : 'ReportIncidentHome', {
    task,
    tasks,
    navigateAfter,
    success,
  });
};
