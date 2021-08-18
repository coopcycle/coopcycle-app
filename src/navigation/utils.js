let navigateAfter = null

export const navigateToTask = (navigation, task, tasks = []) => {

  if (navigation.state.routeName !== 'TaskHome') {
    navigateAfter = navigation.state.routeName
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

export const navigateToCompleteTask = (navigation, task, tasks = [], success = true) => {

  const params = {
    task,
    navigateAfter: navigation.state.routeName,
  }

  navigation.navigate('Task', {
    screen: 'TaskComplete',
    params: { ...params, success }
  })
}
