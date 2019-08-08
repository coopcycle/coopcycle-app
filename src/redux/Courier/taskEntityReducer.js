import moment from 'moment'
import {
  LOAD_TASKS_REQUEST, LOAD_TASKS_FAILURE, LOAD_TASKS_SUCCESS,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_FAILURE, MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_FAILURE, MARK_TASK_FAILED_SUCCESS,
  UPLOAD_FILE_REQUEST, UPLOAD_FILE_FAILURE, UPLOAD_FILE_SUCCESS,
  DONT_TRIGGER_TASKS_NOTIFICATION,
  ADD_PICTURE, ADD_SIGNATURE,
  CLEAR_FILES, DELETE_SIGNATURE, DELETE_PICTURE,
} from './taskActions'
import {
  ASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS
} from '../Dispatch/actions'
import { MESSAGE } from '../middlewares/WebSocketMiddleware'
import _ from 'lodash'

/*
 * Intital state shape for the task entity reducer
 */
const tasksEntityInitialState = {
  loadTasksFetchError: false,      // Error object describing the error
  completeTaskFetchError: false,   // Error object describing the error
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
    //   comments: '',
    //   tags: [{ name, slug, ...}, ...]
    // }
  },
  order: [/* 1, 2, 3, ... */],     // Array of task ids, indicating order for e.g. lists
  username: null,
  pictures: [], // Array of base64 encoded pictures
  signatures: [], // Array of base64 encoded signatures
}


export const tasksEntityReducer = (state = tasksEntityInitialState, action = {}) => {
  switch (action.type) {
    case LOAD_TASKS_REQUEST:
    case MARK_TASK_DONE_REQUEST:
    case MARK_TASK_FAILED_REQUEST:
    case UPLOAD_FILE_REQUEST:
      return {
        ...state,
        loadTasksFetchError: false,
        completeTaskFetchError: false,
        isFetching: true,
      }

    case LOAD_TASKS_FAILURE:
      return {
        ...state,
        loadTasksFetchError: action.payload || action.error,
        isFetching: false,
      }

    case MARK_TASK_DONE_FAILURE:
    case MARK_TASK_FAILED_FAILURE:
      return {
        ...state,
        completeTaskFetchError: action.payload || action.error,
        isFetching: false,
      }

    case UPLOAD_FILE_FAILURE:
      return {
        ...state,
        isFetching: false,
      }

    case LOAD_TASKS_SUCCESS:
      return {
        ...state,
        loadTasksFetchError: false,
        isFetching: false,
        lastUpdated: moment(),
        items: action.payload.reduce((acc, task) => {
          acc[task.id] = task
          return acc
        }, {}),
        order: action.payload.map((task) => task.id),
        username: _.reduce(action.payload, (acc, task) => task.assignedTo)
      }

    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: {
          ...state.items,
          [action.payload.id]: action.payload,
        },
      }

    case ASSIGN_TASK_SUCCESS:
      if (action.payload.assignedTo === state.username) {

        return {
          ...state,
          items: {
            ...state.items,
            [action.payload.id]: action.payload,
          },
          order: state.order.concat([ action.payload.id ])
        }
      }

    case UNASSIGN_TASK_SUCCESS:
      let task = _.find(state.items, item => item['@id'] === action.payload['@id'])
      if (task) {

        return {
          ...state,
          items: _.pickBy(state.items, item => item['@id'] !== action.payload['@id']),
          order: _.filter(state.order, item => item !== action.payload.id)
        }
      }

    case UPLOAD_FILE_SUCCESS:

      return {
        ...state,
        isFetching: false,
        items: {
          ...state.items,
          [action.payload.task.id]: action.payload.task,
        },
      }

    case MESSAGE:
      return processWsMsg(state, action.payload)

    case DONT_TRIGGER_TASKS_NOTIFICATION:
      return {
        ...state,
        triggerTasksNotification: false,
      }

    case ADD_SIGNATURE:

      return {
        ...state,
        signatures: state.signatures.slice(0).concat([ action.payload.base64 ])
      }

    case ADD_PICTURE:

      return {
        ...state,
        pictures: state.pictures.slice(0).concat([ action.payload.base64 ])
      }

    case DELETE_SIGNATURE:
      const newSignatures = state.signatures.slice(0)
      newSignatures.splice(action.payload, 1);

      return {
        ...state,
        signatures: newSignatures
      }

    case DELETE_PICTURE:
      const newPictures = state.pictures.slice(0)
      newPictures.splice(action.payload, 1);

      return {
        ...state,
        pictures: newPictures
      }

    case CLEAR_FILES:

      return {
        ...state,
        signatures: [],
        pictures: []
      }
    default:
      return { ...state }
  }
}


const processWsMsg = (state, { type, ...data }) => {
  switch (type) {
    case 'tasks:changed':
      // order tasks by position
      let tasks = _.sortBy(data.tasks, (task) => task.position)
      return {
        ...state,
        lastUpdated: moment(),
        triggerTasksNotification: true,
        items: tasks.reduce((acc, task) => {
          acc[task.id] = task
          return acc
        }, {}),
        order: tasks.map((task) => task.id),
      }

    default:
      return { ...state }
  }
}
