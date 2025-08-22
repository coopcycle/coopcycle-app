import _ from 'lodash';
import moment from 'moment';

import { actionMatchCreator } from '../util';
import {
  ADD_PICTURE,
  ADD_SIGNATURE,
  CLEAR_FILES,
  DELETE_PICTURE,
  DELETE_SIGNATURE,
  LOAD_TASKS_FAILURE,
  LOAD_TASKS_REQUEST,
  LOAD_TASKS_SUCCESS,
  MARK_TASKS_DONE_FAILURE,
  MARK_TASKS_DONE_REQUEST,
  MARK_TASKS_DONE_SUCCESS,
  REPORT_INCIDENT_FAILURE,
  REPORT_INCIDENT_REQUEST,
  REPORT_INCIDENT_SUCCESS,
} from './taskActions';
import { apiSlice } from '../api/slice';
import { CENTRIFUGO_MESSAGE } from '../middlewares/CentrifugoMiddleware';
import {
  DEP_ASSIGN_TASK_SUCCESS,
  DEP_BULK_ASSIGNMENT_TASKS_SUCCESS,
  DEP_UNASSIGN_TASK_SUCCESS,
  DEP_UPDATE_TASK_SUCCESS,
  markTaskDoneFailure,
  markTaskDoneRequest,
  markTaskDoneSuccess,
  markTaskFailedFailure,
  markTaskFailedRequest,
  markTaskFailedSuccess,
  startTaskFailure,
  startTaskRequest,
  startTaskSuccess,
} from '../../shared/logistics/redux';
import { filterHasIncidents } from '../logistics/filters';
import { LOGOUT_SUCCESS, SET_USER } from '../App/actions';
import {
  getProcessedOrders,
  getTaskWithColor,
} from '../../shared/src/logistics/redux/taskUtils';
import { DateOnlyString } from '../../utils/date-types';

/*
 * Intital state shape for the task entity reducer
 */
const tasksEntityInitialState = {
  loadTasksFetchError: false, // Error object describing the error
  completeTaskFetchError: false, // Error object describing the error
  isFetching: false, // Flag indicating active HTTP request
  date: moment().format('YYYY-MM-DD') as DateOnlyString, // YYYY-MM-DD
  updatedAt: moment().toISOString(),
  items: {
    // Array of tasks, indexed by date
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
};

function replaceItem(tasks, payload) {
  const index = _.findIndex(tasks, item => item['@id'] === payload['@id']);

  if (index !== -1) {
    const task = getTaskWithColor(payload, tasks);
    const newState = tasks.slice(0);
    newState.splice(index, 1, task);

    return newState;
  }

  return tasks;
}

function updateItem(prevItems, id, payload) {
  const index = prevItems.findIndex(item => item['@id'] === id);

  if (index !== -1) {
    return prevItems.map((item, i) =>
      i === index ? { ...item, ...payload } : item,
    );
  }

  return prevItems;
}

function replaceItems(prevItems, items) {
  return prevItems.map(prevItem => {
    const toReplace = items.find(i => i['@id'] === prevItem['@id']);
    if (toReplace) {
      return getTaskWithColor(toReplace, prevItems);
    }
    return prevItem;
  });
}

export const tasksEntityReducer = (
  state = tasksEntityInitialState,
  action = {},
) => {
  if (
    actionMatchCreator(action, [
      startTaskRequest,
      markTaskDoneRequest,
      markTaskFailedRequest,
    ])
  ) {
    return {
      ...state,
      loadTasksFetchError: false,
      completeTaskFetchError: false,
      isFetching: true,
    };
  }

  if (
    actionMatchCreator(action, [
      startTaskSuccess,
      markTaskDoneSuccess,
      markTaskFailedSuccess,
    ])
  ) {
    return {
      ...state,
      isFetching: false,
      items: _.mapValues(state.items, tasks =>
        replaceItem(tasks, action.payload),
      ),
    };
  }

  if (
    actionMatchCreator(action, [
      startTaskFailure,
      markTaskDoneFailure,
      markTaskFailedFailure,
    ])
  ) {
    return {
      ...state,
      completeTaskFetchError: action.payload || action.error,
      isFetching: false,
    };
  }

  switch (action.type) {
    case MARK_TASKS_DONE_REQUEST:
    case REPORT_INCIDENT_REQUEST:
      return {
        ...state,
        loadTasksFetchError: false,
        completeTaskFetchError: false,
        isFetching: true,
      };

    case MARK_TASKS_DONE_FAILURE:
    case REPORT_INCIDENT_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case REPORT_INCIDENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: _.mapValues(state.items, tasks =>
          updateItem(tasks, action.payload.task, filterHasIncidents),
        ),
      };

    case DEP_UPDATE_TASK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: _.mapValues(state.items, tasks =>
          replaceItem(tasks, action.payload),
        ),
      };

    case MARK_TASKS_DONE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: _.mapValues(state.items, tasks =>
          replaceItems(tasks, action.payload),
        ),
      };

    case DEP_ASSIGN_TASK_SUCCESS:
      if (action.payload.assignedTo === state.username) {
        return {
          ...state,
          items: _.mapValues(state.items, tasks =>
            replaceItem(tasks, action.payload),
          ),
        };
      }
      return state;

    case DEP_BULK_ASSIGNMENT_TASKS_SUCCESS:
      if (action.payload[0].assignedTo === state.username) {
        return {
          ...state,
          items: _.mapValues(state.items, tasks =>
            replaceItems(tasks, action.payload),
          ),
        };
      }
      return state;

    case DEP_UNASSIGN_TASK_SUCCESS:
      const task = _.find(
        state.items,
        item => item['@id'] === action.payload['@id'],
      );
      if (task) {
        return {
          ...state,
          items: _.mapValues(state.items, tasks =>
            _.pickBy(tasks, item => item['@id'] !== action.payload['@id']),
          ),
        };
      }
      return state;

    case CENTRIFUGO_MESSAGE:
      return processWsMsg(state, action);

    case ADD_SIGNATURE:
      return {
        ...state,
        signatures: state.signatures.slice(0).concat([action.payload.base64]),
      };

    case ADD_PICTURE:
      return {
        ...state,
        pictures: state.pictures.slice(0).concat([action.payload.base64]),
      };

    case DELETE_SIGNATURE:
      const newSignatures = state.signatures.slice(0);
      newSignatures.splice(action.payload, 1);

      return {
        ...state,
        signatures: newSignatures,
      };

    case DELETE_PICTURE:
      const newPictures = state.pictures.slice(0);
      newPictures.splice(action.payload, 1);

      return {
        ...state,
        pictures: newPictures,
      };

    case CLEAR_FILES:
      return {
        ...state,
        signatures: [],
        pictures: [],
      };

    case SET_USER:
      return {
        ...state,
        username: action.payload ? action.payload.username : null,
      };

    // The "items" key is persisted by redux-persists,
    // When the user logs out, we reset it
    // This is useful when multiple messengers use the same device
    case LOGOUT_SUCCESS:
      return {
        ...state,
        items: {},
      };
  }

  switch (true) {
    //using axios; FIXME: migrate to rtk query
    case action.type === LOAD_TASKS_REQUEST: {
      return {
        ...state,
        loadTasksFetchError: false,
        completeTaskFetchError: false,
        // This is the date that is selected in the UI
        date: action.payload.date
          ? moment(action.payload.date).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        isFetching: true,
      };
    }
    //using rtk query
    case apiSlice.endpoints.getMyTasks.matchPending(action):
      return {
        ...state,
        loadTasksFetchError: false,
        completeTaskFetchError: false,
        // This is the date that is selected in the UI
        date: action.meta.arg.originalArgs,
        // isFetching: true,  # don't set isFetching flag to prevent global loading spinner for rtk query requests
      };

    //using axios; FIXME: migrate to rtk query
    case action.type === LOAD_TASKS_SUCCESS: {
      return {
        ...state,
        loadTasksFetchError: false,
        isFetching: false,
        updatedAt: action.payload.updatedAt,
        items: {
          ...state.items,
          [action.payload.date]: getProcessedOrders(action.payload.items),
        },
      };
    }
    //using rtk query
    case apiSlice.endpoints.getMyTasks.matchFulfilled(action):
      return {
        ...state,
        loadTasksFetchError: false,
        isFetching: false,
        updatedAt: action.payload.updatedAt,
        items: {
          ...state.items,
          [action.payload.date]: getProcessedOrders(action.payload.items),
        },
      };

    //using axios; FIXME: migrate to rtk query
    case action.type === LOAD_TASKS_FAILURE: {
      return {
        ...state,
        loadTasksFetchError: action.payload || action.error,
        isFetching: false,
      };
    }
    //using rtk query
    case apiSlice.endpoints.getMyTasks.matchRejected(action):
      return {
        ...state,
        loadTasksFetchError: action.payload || action.error,
        isFetching: false,
      };
  }

  return state;
};

const processWsMsg = (state, action) => {
  if (action.payload.name && action.payload.data) {
    const { name, data } = action.payload;

    switch (name) {
      // TODO: update to v2
      case 'task_list:updated':
        const taskList = data.task_list;

        if (taskList.username !== state.username) {
          break;
        }

        return {
          ...state,
          items: {
            ...state.items,
            [taskList.date]: getProcessedOrders(taskList.items),
          },
        };
    }
  }

  return state;
};
