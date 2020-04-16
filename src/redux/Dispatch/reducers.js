import _ from 'lodash'
import moment from 'moment'

import {
  DISPATCH_INITIALIZE,
  LOAD_UNASSIGNED_TASKS_REQUEST,
  LOAD_UNASSIGNED_TASKS_SUCCESS,
  LOAD_UNASSIGNED_TASKS_FAILURE,
  LOAD_USERS_REQUEST,
  LOAD_USERS_SUCCESS,
  LOAD_USERS_FAILURE,
  LOAD_TASK_LISTS_REQUEST,
  LOAD_TASK_LISTS_SUCCESS,
  LOAD_TASK_LISTS_FAILURE,
  CREATE_TASK_LIST_REQUEST,
  CREATE_TASK_LIST_SUCCESS,
  CREATE_TASK_LIST_FAILURE,
  CHANGE_DATE,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  ASSIGN_TASK_REQUEST,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_FAILURE,
  UNASSIGN_TASK_REQUEST,
  UNASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_FAILURE,
  LOAD_TASK_SUCCESS,
  DISPATCH_LOAD_TASKS_SUCCESS,
  DISPATCH_LOAD_TASKS_FAILURE,
} from './actions'

import {
  MESSAGE,
} from '../middlewares/WebSocketMiddleware/actions'

import {
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
} from '../Courier/taskActions'

import { createTaskList } from './utils'

const initialState = {
  isFetching: false,
  unassignedTasks: [],
  users: [],
  allTasks: [],
  taskLists: [],
  date: moment(),
  initialized: false,
}

const isSameDate = (task, date) => moment(task.doneBefore).isSame(date, 'day')

const addItem = (state, payload) => {
  return _.uniqBy(state.concat([ payload ]), '@id');
}

const replaceItem = (state, payload) => {

  const index = _.findIndex(state, item => item['@id'] === payload['@id'])

  if (index !== -1) {
    const newState = state.slice(0)
    newState.splice(index, 1, Object.assign({}, payload))

    return newState
  }

  return state
}

const addOrReplaceItem = (state, payload) => {

  const newState = replaceItem(state, payload)

  if (newState === state) {

    return addItem(state, payload)
  }

  return newState
}

const removeItem = (state, payload) => {
  return _.filter(state, item => item['@id'] !== payload['@id'])
}

const replaceTaskLists = (taskLists, task) => {

  const taskList = _.find(taskLists, o => task.assignedTo === o.username)
  if (!taskList) {
    const newTaskLists = taskLists.slice(0)
    newTaskLists.push(createTaskList(task.assignedTo, [ task ]))

    return newTaskLists
  }

  return _.map(taskLists, taskList => {
    if (task.isAssigned && task.assignedTo === taskList.username) {

      return {
        ...taskList,
        items: addOrReplaceItem(taskList.items, task),
      }
    }

    return taskList
  })
}

const addOrReplaceTaskLists = (taskLists, task) => {

  const taskList = _.find(taskLists, o => task.assignedTo === o.username)
  if (!taskList) {
    const newTaskLists = taskLists.slice(0)
    newTaskLists.push(createTaskList(task.assignedTo, [ task ]))

    return newTaskLists
  }

  return _.map(taskLists, taskList => {
    if (task.isAssigned && task.assignedTo === taskList.username) {

      return {
        ...taskList,
        items: addOrReplaceItem(taskList.items, task),
      }
    }

    return taskList
  })
}

const removeFromTaskLists = (taskLists, task) => {

  const taskList = _.find(taskLists, (item) => {
    const taskIndex = _.findIndex(item.items, t => t['@id'] === task['@id'])
    if (taskIndex !== -1) {

      return item
    }
  })

  if (taskList) {

    const newTaskLists = taskLists.slice(0)
    const index = _.findIndex(newTaskLists, item => item === taskList)

    newTaskLists.splice(index, 1, {
      ...taskList,
      items: _.filter(taskList.items, t => t['@id'] !== task['@id']),
    })

    return newTaskLists
  }

  return taskLists
}

export default (state = initialState, action = {}) => {

  let unassignedTasks

  switch (action.type) {

    case DISPATCH_INITIALIZE:
      return {
        ...state,
        initialized: true,
      }

    case LOAD_UNASSIGNED_TASKS_REQUEST:
    case LOAD_USERS_REQUEST:
    case LOAD_TASK_LISTS_REQUEST:
    case CREATE_TASK_LIST_REQUEST:
    case CREATE_TASK_REQUEST:
    case ASSIGN_TASK_REQUEST:
    case UNASSIGN_TASK_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case LOAD_UNASSIGNED_TASKS_FAILURE:
    case LOAD_USERS_FAILURE:
    case LOAD_TASK_LISTS_FAILURE:
    case CREATE_TASK_LIST_FAILURE:
    case CREATE_TASK_FAILURE:
    case ASSIGN_TASK_FAILURE:
    case DISPATCH_LOAD_TASKS_FAILURE:
    case UNASSIGN_TASK_FAILURE:
      return {
        ...state,
        isFetching: false,
      }

    case DISPATCH_LOAD_TASKS_SUCCESS:

      unassignedTasks = _.filter(action.payload, task => !task.isAssigned)

      return {
        ...state,
        isFetching: false,
        allTasks: action.payload,
        unassignedTasks,
      }

    case LOAD_UNASSIGNED_TASKS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        unassignedTasks: action.payload,
      }

    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: action.payload,
      }

    case LOAD_TASK_LISTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        taskLists: action.payload,
      }

    case CREATE_TASK_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        taskLists: state.taskLists.concat(action.payload),
      }

    case CREATE_TASK_SUCCESS:

      if (isSameDate(action.payload, state.date)) {

        return {
          ...state,
          isFetching: false,
          unassignedTasks: addItem(state.unassignedTasks, action.payload),
        }
      }

      break

    case ASSIGN_TASK_SUCCESS:

      return {
        ...state,
        isFetching: false,
        unassignedTasks: removeItem(state.unassignedTasks, action.payload),
        taskLists: addOrReplaceTaskLists(state.taskLists, action.payload),
      }

    case UNASSIGN_TASK_SUCCESS:

      return {
        ...state,
        isFetching: false,
        unassignedTasks: addItem(state.unassignedTasks, action.payload),
        taskLists: removeFromTaskLists(state.taskLists, action.payload),
      }

    case LOAD_TASK_SUCCESS:

      return {
        ...state,
        isFetching: false,
        unassignedTasks: action.payload.isAssigned ?
          removeItem(state.unassignedTasks, action.payload) : addOrReplaceItem(state.unassignedTasks, action.payload),
        taskLists: action.payload.isAssigned ?
          replaceTaskLists(state.taskLists, action.payload) : removeFromTaskLists(state.taskLists, action.payload),
      }

    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:

      return {
        ...state,
        unassignedTasks: replaceItem(state.unassignedTasks, action.payload),
        taskLists: replaceTaskLists(state.taskLists, action.payload),
      }

    case CHANGE_DATE:

      return {
        ...state,
        date: action.payload,
      }

    case MESSAGE:

      if (action.payload.name && action.payload.data) {

        const { name, data } = action.payload

        switch (name) {
          case 'task:created':

            if (isSameDate(data.task, state.date) && !data.task.isAssigned) {

              return {
                ...state,
                unassignedTasks: addItem(state.unassignedTasks, data.task),
              }
            }

            break

          case 'task:unassigned':

            return {
              ...state,
              unassignedTasks: addItem(state.unassignedTasks, data.task),
              taskLists: removeFromTaskLists(state.taskLists, data.task),
            }

          case 'task:assigned':

            return {
              ...state,
              unassignedTasks: removeItem(state.unassignedTasks, data.task),
              taskLists: replaceTaskLists(state.taskLists, data.task),
            }

          case 'task:done':
          case 'task:failed':
          case 'task:cancelled':

            return {
              ...state,
              unassignedTasks: replaceItem(state.unassignedTasks, data.task),
              taskLists: replaceTaskLists(state.taskLists, data.task),
            }
        }
      }

      break
  }

  return state
}
