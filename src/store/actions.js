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

function loadTasksFailure (tasks) {
  return { type: 'LOAD_TASKS_FAILURE', tasks }
}

function loadTasksRequest (client, selectedDate) {

  return function(dispatch) {
    dispatch(loadTasks(selectedDate))

    return client.get('/api/me/tasks/' + selectedDate.format('YYYY-MM-DD'))
      .then(res => dispatch(loadTasksSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadTasksFailure(e)))
  }
}

function markTaskFailedRequest (client, task, notes) {

  return function(dispatch) {
    dispatch(markTaskFailed(task))

    return client
      .put(task['@id'] + '/failed', { notes: notes })
      .then(task => {
        dispatch(markTaskFailedSuccess(task))
      })
  }
}

function markTaskDoneRequest (client, task, notes) {

  return function(dispatch) {
    dispatch(markTaskDone(task))

    return client
      .put(task['@id'] + '/done', { notes: notes })
      .then(task => {
        dispatch(markTaskDoneSuccess(task))
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