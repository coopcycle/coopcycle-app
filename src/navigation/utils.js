let navigateAfter = null;

export const navigateToOrder = (navigation, orderId, isFromCourier) => {
  const params = {
    orderId,
    isFromCourier
  }
  navigation.navigate('Order', { screen:'OrderInfo', params })
}

export const navigateToTask = (navigation, route, task, tasks = []) => {
  if (route !== null && route.name !== 'TaskHome') {
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
    navigateAfter: route.name,
  };

  navigation.navigate('Task', {
    screen: 'TaskComplete',
    params: {
      screen: 'TaskCompleteHome',
      params: { ...params, success },
    },
  });
};
