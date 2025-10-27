let navigateAfter = null;

export const navigateToOrder = (navigation, orderNumber: string, isFromCourier = false, extraData = {}) => {
  const params = {
    orderNumber,
    isFromCourier,
    ...extraData
  };
  navigation.navigate('Order', { screen: 'Order', params });
};

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

  navigation.navigate('ReportIncident', {
    screen: 'TaskComplete',
    params: { 
      screen:'ReportIncidentHome',
      params: {...params, success} 
    },
  });
};

export const navigateToProofOfDeliveryFromReportIncident = (
  navigation, route, task, tasks
) => {
  const params = {
    task, tasks, navigateAfter: route.name
  }
  navigation.navigate('TaskComplete', {
      screen: 'TaskCompleteProofOfDelivery',
      params: {...params}
    });
};