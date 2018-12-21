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
  LOAD_TASK_REQUEST,
  LOAD_TASK_SUCCESS,
  LOAD_TASK_FAILURE,
  DISPATCH_LOAD_TASKS_SUCCESS,
  DISPATCH_LOAD_TASKS_FAILURE,
} from './actions'

import {
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
} from '../Courier/taskActions'

import _ from 'lodash'
import moment from 'moment'

const initialState = {
  isFetching: false,
  unassignedTasks: [],
  users: [],
  allTasks: [],
  taskLists: [],
  date: moment(),
  initialized: false,
}

const matchesDate = (task, date) => moment(task.doneBefore).isSame(date, 'day')

const replaceItem = (state, payload) => {

  const index = _.findIndex(state, item => item['@id'] === payload['@id'])

  if (-1 !== index) {
    const newState = state.slice(0)
    newState.splice(index, 1, Object.assign({}, payload))

    return newState
  }

  return state
}

const replaceTaskLists = (taskLists, task) => {

  return _.map(taskLists, (taskList) => {

    return {
      ...taskList,
      items: replaceItem(taskList.items, task)
    }
  })
}

export default (state = initialState, action = {}) => {

  let unassignedTasks
  let taskLists
  let index

  switch (action.type) {

    case DISPATCH_INITIALIZE:
      return {
        ...state,
        initialized: true
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
        isFetching: true
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
        isFetching: false
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
        unassignedTasks: action.payload
      }

    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: action.payload
      }

    case LOAD_TASK_LISTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        taskLists: action.payload
      }

    case CREATE_TASK_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        taskLists: state.taskLists.concat(action.payload)
      }

    case CREATE_TASK_SUCCESS:

      unassignedTasks = state.unassignedTasks.slice(0)

      if (!action.payload.isAssigned) {
        unassignedTasks.concat(action.payload)
      }

      return {
        ...state,
        isFetching: false,
        unassignedTasks,

      }

    case ASSIGN_TASK_SUCCESS:

      unassignedTasks = _.filter(state.unassignedTasks, t => t['@id'] !== action.payload['@id'])
      taskLists = state.taskLists.slice(0)

      index = _.findIndex(state.taskLists, taskList => taskList.username === action.payload.assignedTo)
      if (-1 !== index) {
        taskLists.splice(index, 1, {
          ...state.taskLists[index],
          items: state.taskLists[index].items.concat([ action.payload ])
        })
      }

      return {
        ...state,
        isFetching: false,
        unassignedTasks,
        taskLists,
      }

    case UNASSIGN_TASK_SUCCESS:

      unassignedTasks = state.unassignedTasks.slice(0)
      unassignedTasks.push(action.payload)

      taskLists = state.taskLists.slice(0)

      let taskList = _.find(taskLists, (taskList) => {
        const taskIndex = _.findIndex(taskList.items, t => t['@id'] === action.payload['@id'])
        if (-1 !== taskIndex) {

          return taskList
        }
      })

      if (taskList) {

        index = _.findIndex(taskLists, item => item === taskList)

        taskLists.splice(index, 1, {
          ...taskList,
          items: _.filter(taskList.items, t => t['@id'] !== action.payload['@id'])
        })
      }

      return {
        ...state,
        isFetching: false,
        unassignedTasks,
        taskLists,
      }

    case LOAD_TASK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        unassignedTasks: state.unassignedTasks.concat(action.payload)
      }

    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:

      return {
        ...state,
        unassignedTasks: replaceItem(state.unassignedTasks, action.payload),
        taskLists: replaceTaskLists(state.taskLists, action.payload)
      }

    case CHANGE_DATE:
      return {
        ...state,
        date: action.payload
      }

    default:
      return { ...state }
  }
}
