let navigateAfter = null

export const navigateToTask = (navigation, route, task, tasks = []) => {

  if (route.name !== 'TaskHome') {
    navigateAfter = route.name
  }

  const params = {
    task,
    tasks,
    navigateAfter,
  }

  navigation.navigate('Task', {
    screen: 'TaskHome',
    params,
  })
}

export const navigateToCompleteTask = (navigation, route, task, tasks = [], success = true) => {

  const params = {
    task,
    tasks,
    navigateAfter: route.name,
  }

  navigation.navigate('Task', {
    screen: 'TaskComplete',
    params: {
      screen: 'TaskCompleteHome',
      params: { ...params, success },
    },
  })
}
