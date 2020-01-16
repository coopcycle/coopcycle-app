import moment from 'moment'
import {
  LOAD_TASKS_REQUEST, LOAD_TASKS_FAILURE, LOAD_TASKS_SUCCESS,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_FAILURE, MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_FAILURE, MARK_TASK_FAILED_SUCCESS,
  ADD_PICTURE, ADD_SIGNATURE,
  CLEAR_FILES, DELETE_SIGNATURE, DELETE_PICTURE,
} from './taskActions'
import {
  ASSIGN_TASK_SUCCESS,
  UNASSIGN_TASK_SUCCESS,
} from '../Dispatch/actions'
import {
  AUTHENTICATE,
} from '../App/actions'
import { MESSAGE } from '../middlewares/WebSocketMiddleware'
import _ from 'lodash'

/*
 * Intital state shape for the task entity reducer
 */
const tasksEntityInitialState = {
  loadTasksFetchError: false,          // Error object describing the error
  completeTaskFetchError: false,       // Error object describing the error
  isFetching: false,                   // Flag indicating active HTTP request
  isRefreshing: false,
  date: moment().format('YYYY-MM-DD'), // YYYY-MM-DD
  items: {                             // Array of tasks, indexed by date
    // 'YYYY-MM-DD': [
    //   {
    //     '@id': '',
    //     id: '',
    //     type: '',
    //     status: '',
    //     address: {
    //       name: '',
    //       streetAddress: '',
    //       doneAfter: '',
    //       doneBefore: '',
    //       geo: {
    //         latitude: 0,
    //         longitude: 0,
    //       }
    //     },
    //     comments: '',
    //     tags: [{ name, slug, ...}, ...]
    //   }
    // ]
  },
  username: null,
  pictures: [], // Array of base64 encoded pictures
  signatures: [], // Array of base64 encoded signatures
}

function replaceItem(state, payload) {

  const index = _.findIndex(state, item => item['@id'] === payload['@id'])

  if (index !== -1) {
    const newState = state.slice(0)
    newState.splice(index, 1, payload)

    return newState
  }

  return state
}

export const tasksEntityReducer = (state = tasksEntityInitialState, action = {}) => {
  switch (action.type) {
    case MARK_TASK_DONE_REQUEST:
    case MARK_TASK_FAILED_REQUEST:
      return {
        ...state,
        loadTasksFetchError: false,
        completeTaskFetchError: false,
        isFetching: true,
      }

    case LOAD_TASKS_REQUEST:
      return {
        ...state,
        loadTasksFetchError: false,
        completeTaskFetchError: false,
        date: moment(action.payload.date).format('YYYY-MM-DD'),
        isFetching: !action.payload.refresh,
        isRefreshing: action.payload.refresh,
      }

    case LOAD_TASKS_FAILURE:
      return {
        ...state,
        loadTasksFetchError: action.payload || action.error,
        isFetching: false,
        isRefreshing: false,
      }

    case MARK_TASK_DONE_FAILURE:
    case MARK_TASK_FAILED_FAILURE:
      return {
        ...state,
        completeTaskFetchError: action.payload || action.error,
        isFetching: false,
      }

    case LOAD_TASKS_SUCCESS:
      return {
        ...state,
        loadTasksFetchError: false,
        isFetching: false,
        isRefreshing: false,
        date: action.payload.date,
        items: {
          ...state.items,
          [ action.payload.date ]: action.payload.tasks,
        },
      }

    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: _.mapValues(state.items, tasks => replaceItem(tasks, action.payload)),
      }

    case ASSIGN_TASK_SUCCESS:
      if (action.payload.assignedTo === state.username) {

        return {
          ...state,
          items: _.mapValues(state.items, tasks => replaceItem(tasks, action.payload)),
        }
      }
      return state

    case UNASSIGN_TASK_SUCCESS:
      let task = _.find(state.items, item => item['@id'] === action.payload['@id'])
      if (task) {

        return {
          ...state,
          items: _.mapValues(state.items, tasks => _.pickBy(tasks, item => item['@id'] !== action.payload['@id'])),
        }
      }
      return state

    case MESSAGE:
      return processWsMsg(state, action.payload)

    case ADD_SIGNATURE:

      return {
        ...state,
        signatures: state.signatures.slice(0).concat([ action.payload.base64 ]),
      }

    case ADD_PICTURE:

      return {
        ...state,
        pictures: state.pictures.slice(0).concat([ action.payload.base64 ]),
      }

    case DELETE_SIGNATURE:
      const newSignatures = state.signatures.slice(0)
      newSignatures.splice(action.payload, 1);

      return {
        ...state,
        signatures: newSignatures,
      }

    case DELETE_PICTURE:
      const newPictures = state.pictures.slice(0)
      newPictures.splice(action.payload, 1);

      return {
        ...state,
        pictures: newPictures,
      }

    case CLEAR_FILES:

      return {
        ...state,
        signatures: [],
        pictures: [],
      }

    case AUTHENTICATE:

      return {
        ...state,
        username: action.payload,
      }
  }

  return state
}

const processWsMsg = (state, { type, ...data }) => {
  switch (type) {
    case 'tasks:changed':
      // order tasks by position
      let tasks = _.sortBy(data.tasks, (task) => task.position)

      return {
        ...state,
        items: {
          ...state.items,
          [ data.date ]: tasks,
        },
      }
  }

  return state
}
