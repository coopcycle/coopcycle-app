import { combineReducers } from 'redux'
import moment from 'moment/min/moment-with-locales'

moment.locale('fr')

const tasks = (state = [], action) => {
  const newState = state.slice()
  let taskIndex

  switch(action.type) {
    case 'LOAD_TASKS_SUCCESS':
      return action.tasks
    case 'UNASSIGN_TASK':
      _.remove(newState, (task) => action.task['@id'] === task['@id'])
      return newState
    case 'ASSIGN_TASK':
      let position = action.task.position
      return Array.prototype.concat(newState.slice(0, position), [action.task], newState.slice(position + 1))
    case 'CHANGED_TASKS':
      return action.tasks
    case 'MARK_TASK_DONE_SUCCESS':
      taskIndex = _.findIndex(state, task => task['@id'] === action.task['@id'])
      newState[taskIndex] = action.task
      return newState
    case 'MARK_TASK_FAILED_SUCCESS':
      taskIndex = _.findIndex(state, task => task['@id'] === action.task['@id'])
      newState[taskIndex] = action.task
      return newState
  }

  return state
}

const selectedDate = (state = moment(), action) => {
  switch(action.type) {
    case 'LOAD_TASKS':
      return action.selectedDate
  }
  return state
}

const taskLoadingMessage = (state = null, action) => {
  switch(action.type) {
    case 'LOAD_TASKS':
      return 'Chargement...'
    case 'MARK_TASK_DONE':
      return 'Chargement...'
    case 'MARK_TASK_FAILED':
      return 'Chargement...'
  }
  return null
}

const tasksLoadingError = (state = false, action) => {
  switch (action.type) {
    case 'LOAD_TASKS_FAILURE':
      return true
  }
  return state
}

export default combineReducers({
  tasks,
  selectedDate,
  taskLoadingMessage,
  tasksLoadingError
})
