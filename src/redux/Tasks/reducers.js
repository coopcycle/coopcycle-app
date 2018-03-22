/*
 * Task related reducers
 */
import { omit } from 'lodash'
import moment from 'moment/min/moment-with-locales'
import {
  LOAD_TASKS_REQUEST, LOAD_TASKS_FAILURE, LOAD_TASKS_SUCCESS,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_FAILURE, MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_FAILURE, MARK_TASK_FAILED_SUCCESS,
  DONT_TRIGGER_TASKS_NOTIFICATION,
} from './actions'
import { MESSAGE } from '../middlewares/WebSocketMiddleware'
import { insertAt } from '../util'
import { localeDetector } from '../../i18n'


moment.locale(localeDetector())


/*
 * Intital state shape for the task entity reducer
 */
const tasksEntityInitialState = {
  fetchError: null,                // Error object describing the error
  isFetching: false,               // Flag indicating active HTTP request
  lastUpdated: moment(),           // Time at which tasks data was last updated
  triggerTasksNotification: false, // Flag indicating whether to trigger Toast alert
  items: {                         // Object of tasks, keyed by task id
    // 1: {                        // ...This is my best guess of what keys are in this object
    //   '@id': '',
    //   id: '',
    //   type: '',
    //   status: '',
    //   address: {
    //     name: '',
    //     streetAddress: '',
    //     doneAfter: '',
    //     doneBefore: '',
    //     geo: {
    //       latitude: 0,
    //       longitude: 0,
    //     }
    //   },
    //   comments: ''
    // }
  },
  order: [/* 1, 2, 3, ... */],     // Array of task ids, indicating order for e.g. lists
}


export const tasksEntityReducer = (state = tasksEntityInitialState, action) => {
  switch (action.type) {
    case LOAD_TASKS_REQUEST:
    case MARK_TASK_DONE_REQUEST:
    case MARK_TASK_FAILED_REQUEST:
      return {
        ...state,
        fetchError: false,
        isFetching: true,
      }

    case LOAD_TASKS_FAILURE:
    case MARK_TASK_DONE_FAILURE:
    case MARK_TASK_FAILED_FAILURE:
      return {
        ...state,
        fetchError: action.payload || action.error,
        isFetching: false,
      }

    case LOAD_TASKS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        lastUpdated: moment(),
        items: action.payload.reduce((acc, task) => {
          acc[task.id] = task
          return acc
        }, {}),
        order: action.payload.map((task) => task.id),
      }

    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return {
        ...state,
        lastUpdated: moment(),
        items: {
          ...state.items,
          [action.payload.id]: action.payload,
        },
      }

    case MESSAGE:
      return processWsMsg(state, action.payload)

    case DONT_TRIGGER_TASKS_NOTIFICATION:
      return {
        ...state,
        triggerTasksNotification: false,
      }

    default:
      return { ...state }
  }
}


const processWsMsg = (state, { type, ...data }) => {
  switch (type) {
    case 'tasks:changed':
      return {
        ...state,
        lastUpdated: moment(),
        triggerTasksNotification: true,
        items: data.tasks.reduce((acc, task) => {
          acc[task.id] = task
          return acc
        }, {}),
        order: data.tasks.map((task) => task.id),
      }

    case 'task:assign':
      return {
        ...state,
        lastUpdated: moment(),
        items: {
          ...state.items,
          [data.task.id]: data.task,
        },
        order: insertAt(data.task.id, data.task.position, state.order)
      }

    case 'task:unassign':
      return {
        ...state,
        lastUpdated: moment(),
        items: omit(state.items, [data.task['@id']]),
        order: state.order.filter(id => id != data.task['@id']),
      }

    default:
      return { ...state }
  }
}


/*
 * Intital state shape for the task UI reducer
 * Data related to the presentation of task-related components
 * but not directly related to the entity itself goes here
 */
const tasksUiInitialState = {
  selectedDate: moment()  // Date selected by the user
}


export const tasksUiReducer = (state = tasksUiInitialState, action) => {
  switch (action.type) {
    case LOAD_TASKS_REQUEST:
      return {
        ...state,
        selectedDate: action.payload || moment()
      }
    default:
      return { ...state }
  }
}
