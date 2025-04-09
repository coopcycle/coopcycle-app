import {
  DEP_ASSIGN_TASK_SUCCESS,
  DEP_CANCEL_TASK_SUCCESS,
  DEP_UNASSIGN_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS,
  changeDate,
  createTaskSuccess,
  loadTasksSuccess,
} from '../Dispatch/actions';
import {
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
  START_TASK_SUCCESS,
} from '../Courier';
import {
  taskAdapter,
} from '../../coopcycle-frontend-js/logistics/redux';
import { actionMatchCreator } from '../util';


const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [
    changeDate,
  ])) {
    return initialState;
  }

  if (actionMatchCreator(action, [
    loadTasksSuccess,
  ])) {
    return taskAdapter.setAll(state, action.payload);
  }

  if (actionMatchCreator(action, [
    createTaskSuccess,
  ])) {
    return taskAdapter.upsertOne(state, action.payload);
  }

  switch (action.type) {
    case UPDATE_TASK_SUCCESS:
    case DEP_CANCEL_TASK_SUCCESS:
    case DEP_ASSIGN_TASK_SUCCESS:
    case DEP_UNASSIGN_TASK_SUCCESS:
    case START_TASK_SUCCESS:
    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return taskAdapter.upsertOne(state, action.payload);

    default:
      return state;
  }
};
