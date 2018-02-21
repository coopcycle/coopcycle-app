function loadTasks (selectedDate) {
  return { type: 'LOAD_TASKS', selectedDate }
}

function assignTask (task) {
  return { type: 'ASSIGN_TASK', task }
}

function unassignTask (task) {
  return { type: 'UNASSIGN_TASK', task }
}

function changedTasks (tasks) {
  return { type: 'CHANGED_TASKS', tasks}
}

function markTaskDone (task) {
  return { type: 'MARK_TASK_DONE', task }
}

function markTaskFailed (task) {
  return { type: 'MARK_TASK_FAILED', task }
}

function markTaskDoneSuccess (task) {
  return { type: 'MARK_TASK_DONE_SUCCESS', task }
}

function markTaskFailedSuccess (task) {
  return { type: 'MARK_TASK_FAILED_SUCCESS', task }
}

function loadTasksSuccess (tasks) {
  return { type: 'LOAD_TASKS_SUCCESS', tasks }
}

function loadTasksRequest (client, selectedDate) {

  return function(dispatch) {
    dispatch(loadTasks(selectedDate))

    return client.get('/api/me/tasks/' + selectedDate.format('YYYY-MM-DD')).then((rep) => {
      dispatch(loadTasksSuccess(rep['hydra:member']))
    })
  }
}

function markTaskFailedRequest (client, task) {

  return function(dispatch) {
    dispatch(markTaskFailed(task))

    return client
      .put(task['@id'] + '/failed', { reason: notes })
      .then(task => {
        markTaskFailedSuccess(task)
        // this.props.navigation.goBack()
      })
  }
}

function markTaskDoneRequest (client, task) {

  return function(dispatch) {
    dispatch(markTaskDone(task))

    return client
      .put(task['@id'] + '/done', {})
      .then(task => {
        markTaskDoneSuccess(task)
        // this.props.navigation.goBack()
      })
  }
}


export {
  loadTasksRequest,
  assignTask,
  unassignTask,
  markTaskFailedRequest,
  markTaskDoneRequest,
  changedTasks
}