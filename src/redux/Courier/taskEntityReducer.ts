import _ from 'lodash';
import moment from 'moment';

import { actionMatchCreator } from '../util';
import {
  ADD_PICTURE,
  ADD_SIGNATURE,
  CHANGE_DATE,
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
  cancelTaskSuccess,
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
  addColorToTask,
  getProcessedTasks,
  getTaskWithColor,
  mapToColor,
} from '../../shared/src/logistics/redux/taskUtils';
import { DateOnlyString } from '../../utils/date-types';
import Task from '../../types/task';

// Tasks for one day, indexed by 'YYYY-MM-DD'.
type TaskItems = Record<string, Task[]>;
type TaskColors = Record<string, string>;

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

function replaceItems(prevItems: Task[], items: Task[]): Task[] {
  const replacements = new Map();
  for (const item of items) {
    replacements.set(item['@id'], item);
  }

  // `getTaskWithColor` rebuilds the colour map of the whole bucket for the one
  // task it is given, so calling it per replaced task made a bulk completion
  // cost O(replaced × bucket²). The colours only depend on `prevItems`, so
  // build the map once, and only when something is actually replaced.
  let taskColors: TaskColors | null = null;
  let hasReplaced = false;

  const nextItems = prevItems.map((prevItem: Task) => {
    const toReplace = replacements.get(prevItem['@id']);

    if (!toReplace) {
      return prevItem;
    }

    if (taskColors === null) {
      taskColors = mapToColor(prevItems);
    }

    hasReplaced = true;

    return addColorToTask(toReplace, taskColors);
  });

  // Keep the same array when this bucket holds none of the replaced tasks, so
  // the state (and everything memoized on it) stays untouched.
  return hasReplaced ? nextItems : prevItems;
}

/**
 * Applies `updateBucket` to every date bucket, preserving the identity of
 * `items` — and of each bucket — when nothing changed.
 *
 * `_.mapValues` always allocated a new object, so any task update marked the
 * whole persisted `items` tree dirty (redux-persist then re-serializes every
 * retained day) and invalidated every selector memoized on it, even when the
 * task belonged to a date that isn't loaded.
 */
function updateBuckets(
  items: TaskItems,
  updateBucket: (tasks: Task[]) => Task[],
): TaskItems {
  let hasChanged = false;
  const nextItems: TaskItems = {};

  for (const date of Object.keys(items)) {
    const bucket = items[date];
    const nextBucket = updateBucket(bucket);

    if (nextBucket !== bucket) {
      hasChanged = true;
    }

    nextItems[date] = nextBucket;
  }

  return hasChanged ? nextItems : items;
}

/**
 * Stores a freshly loaded day, keeping the previous array when the day came
 * back unchanged.
 *
 * Loading a list always produced brand new task objects, so an unremarkable
 * refetch — and there are several per completion — re-rendered every list and
 * made redux-persist re-serialize the retained days for nothing.
 */
function setBucket(
  items: TaskItems,
  date: string,
  nextTasks: Task[],
): TaskItems {
  const prevTasks = items[date];

  if (prevTasks && _.isEqual(prevTasks, nextTasks)) {
    return items;
  }

  return {
    ...items,
    [date]: nextTasks,
  };
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
      cancelTaskSuccess,
      markTaskDoneSuccess,
      markTaskFailedSuccess,
    ])
  ) {
    return {
      ...state,
      isFetching: false,
      items: updateBuckets(state.items, tasks =>
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
        items: updateBuckets(state.items, tasks =>
          updateItem(tasks, action.payload.task, filterHasIncidents),
        ),
      };

    case DEP_UPDATE_TASK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: updateBuckets(state.items, tasks =>
          replaceItem(tasks, action.payload),
        ),
      };

    case MARK_TASKS_DONE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: updateBuckets(state.items, tasks =>
          replaceItems(tasks, action.payload),
        ),
      };

    case DEP_ASSIGN_TASK_SUCCESS:
      if (action.payload.assignedTo === state.username) {
        return {
          ...state,
          items: updateBuckets(state.items, tasks =>
            replaceItem(tasks, action.payload),
          ),
        };
      }
      return state;

    case DEP_BULK_ASSIGNMENT_TASKS_SUCCESS:
      if (action.payload[0].assignedTo === state.username) {
        return {
          ...state,
          items: updateBuckets(state.items, tasks =>
            replaceItems(tasks, action.payload),
          ),
        };
      }
      return state;

    case DEP_UNASSIGN_TASK_SUCCESS:
      // FIXME This guard searches the *buckets* (arrays of tasks), not the
      // tasks themselves, so `item['@id']` is always undefined and the branch
      // below never runs. Left as-is: making it fire would start removing
      // tasks from the courier's list, which is a behaviour change to verify
      // separately.
      const task = _.find(
        state.items,
        item => item['@id'] === action.payload['@id'],
      );
      if (task) {
        return {
          ...state,
          items: updateBuckets(state.items, tasks => {
            // `_.pickBy` on an array returns an *object* keyed by index, which
            // would turn the bucket into something `selectTasks` can't filter.
            const nextTasks = tasks.filter(
              item => item['@id'] !== action.payload['@id'],
            );

            return nextTasks.length === tasks.length ? tasks : nextTasks;
          }),
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

    // Keep the date of the tasks we expose in sync with the date selected in
    // the UI, without waiting for a request: the RTK query serves a date it
    // already has in cache without dispatching anything, and `selectTasks`
    // reads the bucket named by this date.
    case CHANGE_DATE:
      return {
        ...state,
        date: moment(action.payload).format('YYYY-MM-DD') as DateOnlyString,
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
        items: setBucket(
          state.items,
          action.payload.date,
          getProcessedTasks(action.payload.items, true),
        ),
      };
    }
    //using rtk query
    case apiSlice.endpoints.getMyTasks.matchFulfilled(action):
      return {
        ...state,
        loadTasksFetchError: false,
        isFetching: false,
        updatedAt: action.payload.updatedAt,
        items: setBucket(
          state.items,
          action.payload.date,
          getProcessedTasks(action.payload.items, true),
        ),
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
          items: setBucket(
            state.items,
            taskList.date,
            getProcessedTasks(taskList.items, true),
          ),
        };
    }
  }

  return state;
};
