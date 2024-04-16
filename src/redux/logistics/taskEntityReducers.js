import {
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
  START_TASK_SUCCESS,
} from '../Courier';
import {
  ASSIGN_TASK_SUCCESS,
  CANCEL_TASK_SUCCESS,
  CHANGE_DATE,
  CREATE_TASK_SUCCESS,
  LOAD_TASK_LISTS_SUCCESS,
  LOAD_UNASSIGNED_TASKS_SUCCESS,
  UNASSIGN_TASK_SUCCESS,
} from '../Dispatch/actions';

import {
  taskAdapter,
  taskListUtils,
} from '../../coopcycle-frontend-js/logistics/redux';

const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return initialState;
    case LOAD_UNASSIGNED_TASKS_SUCCESS: {
      return taskAdapter.upsertMany(state, action.payload);
    }
    case LOAD_TASK_LISTS_SUCCESS: {
      let assignedTasks = taskListUtils.assignedTasks(action.payload);
      return taskAdapter.upsertMany(state, assignedTasks);
    }
    case CREATE_TASK_SUCCESS:
    case CANCEL_TASK_SUCCESS:
    case ASSIGN_TASK_SUCCESS:
    case UNASSIGN_TASK_SUCCESS:
    case START_TASK_SUCCESS:
    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS: {
      let task = action.payload;
      return taskAdapter.upsertOne(state, task);
    }
    default:
      return state;
  }
};
