import { actionMatchCreator } from '../util';
import {
  UPDATE_TASK_SUCCESS,
  assignTaskSuccess,
  cancelTaskSuccess,
  changeDate,
  createTaskSuccess,
  loadTasksSuccess,
  unassignTaskSuccess,
} from '../Dispatch/actions';
import {
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
  START_TASK_SUCCESS,
} from '../Courier';
import {
  taskAdapter,
} from '../../coopcycle-frontend-js/logistics/redux';


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
    assignTaskSuccess,
    createTaskSuccess,
    cancelTaskSuccess,
    unassignTaskSuccess,
  ])) {
    return taskAdapter.upsertOne(state, action.payload);
  }

  switch (action.type) {
    case UPDATE_TASK_SUCCESS:
    case START_TASK_SUCCESS:
    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return taskAdapter.upsertOne(state, action.payload);

    default:
      return state;
  }
};
