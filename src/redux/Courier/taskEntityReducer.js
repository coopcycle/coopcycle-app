import moment from 'moment'
import {
  ADD_PICTURE, ADD_SIGNATURE, CLEAR_FILES,
  DELETE_PICTURE, DELETE_SIGNATURE, LOAD_TASKS_FAILURE,
  LOAD_TASKS_REQUEST, LOAD_TASKS_SUCCESS, MARK_TASKS_DONE_FAILURE,
  MARK_TASKS_DONE_REQUEST, MARK_TASKS_DONE_SUCCESS, MARK_TASK_DONE_FAILURE,
  MARK_TASK_DONE_REQUEST, MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_FAILURE, MARK_TASK_FAILED_REQUEST, MARK_TASK_FAILED_SUCCESS,
  START_TASK_FAILURE, START_TASK_REQUEST, START_TASK_SUCCESS,
} from './taskActions'
import {
  ASSIGN_TASK_SUCCESS,
  BULK_ASSIGNMENT_TASKS_SUCCESS,
  UNASSIGN_TASK_SUCCESS,
} from '../Dispatch/actions'
import {
  LOGOUT_SUCCESS,
  SET_USER,
} from '../App/actions'
import { CENTRIFUGO_MESSAGE } from '../middlewares/CentrifugoMiddleware'
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
  updatedAt: moment().toString(),
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

function replaceItems(prevItems, items) {
  return prevItems.map((prevItem) => {
    const toReplace = items.find( i => i['@id'] === prevItem['@id'])
    if (toReplace) {
      return toReplace
    }
    return prevItem
  })
}

export const tasksEntityReducer = (state = tasksEntityInitialState, action = {}) => {
  switch (action.type) {
    case START_TASK_REQUEST:
    case MARK_TASK_DONE_REQUEST:
    case MARK_TASK_FAILED_REQUEST:
    case MARK_TASKS_DONE_REQUEST:
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
        // This is the date that is selected in the UI
        date: action.payload.date ?
          action.payload.date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
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

    case START_TASK_FAILURE:
    case MARK_TASK_DONE_FAILURE:
    case MARK_TASK_FAILED_FAILURE:
      return {
        ...state,
        completeTaskFetchError: action.payload || action.error,
        isFetching: false,
      }

    case MARK_TASKS_DONE_FAILURE:
      return {
        ...state,
        isFetching: false,
      }

    case LOAD_TASKS_SUCCESS:
      return {
        ...state,
        loadTasksFetchError: false,
        isFetching: false,
        isRefreshing: false,
        updatedAt: action.payload.updatedAt.toString(),
        items: {
          ...state.items,
          [ action.payload.date ]: action.payload.items,
        },
      }

    case START_TASK_SUCCESS:
    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: _.mapValues(state.items, tasks => replaceItem(tasks, action.payload)),
      }

    case MARK_TASKS_DONE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: _.mapValues(state.items, tasks => replaceItems(tasks, action.payload)),
      }

    case ASSIGN_TASK_SUCCESS:
      if (action.payload.assignedTo === state.username) {

        return {
          ...state,
          items: _.mapValues(state.items, tasks => replaceItem(tasks, action.payload)),
        }
      }
      return state

    case BULK_ASSIGNMENT_TASKS_SUCCESS:
        if (action.payload[0].assignedTo === state.username) {

          return {
            ...state,
            items: _.mapValues(state.items, tasks => replaceItems(tasks, action.payload)),
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

    case CENTRIFUGO_MESSAGE:
      return processWsMsg(state, action)

    case ADD_SIGNATURE:

      return {
        ...state,
        signatures: state.signatures.slice(0).concat([action.payload.base64]),
      }

    case ADD_PICTURE:

      return {
        ...state,
        pictures: state.pictures.slice(0).concat([action.payload.base64]),
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

    case SET_USER:

      return {
        ...state,
        username: action.payload ? action.payload.username : null,
      }

    // The "items" key is persisted by redux-persists,
    // When the user logs out, we reset it
    // This is useful when multiple messengers use the same device
    case LOGOUT_SUCCESS:

      return {
        ...state,
        items: {},
      }
  }

  return state
}

const processWsMsg = (state, action) => {

  if (action.payload.name && action.payload.data) {

    const { name, data } = action.payload

    switch (name) {

      case 'task_list:updated':

        const taskList = data.task_list

        return {
          ...state,
          items: {
            ...state.items,
            [ taskList.date ]: taskList.items,
          },
        }
    }
  }

  return state
}
