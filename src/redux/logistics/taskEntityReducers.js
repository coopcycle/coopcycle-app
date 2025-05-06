import { actionMatchCreator } from '../util';
import {
  assignTaskSuccess,
  assignTasksSuccess,
  cancelTaskSuccess,
  changeDate,
  createTaskSuccess,
  loadTasksSuccess,
  unassignTaskSuccess,
  unassignTasksSuccess,
  updateTaskSuccess,
} from '../Dispatch/actions';
import {
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
  START_TASK_SUCCESS,
} from '../Courier';
import {
  SET_USER,
} from '../App/actions';
import {
  taskAdapter,
} from '../../coopcycle-frontend-js/logistics/redux';


const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  if (changeDate.match(action) || action.type === SET_USER) {
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
    updateTaskSuccess,
  ])) {
    return taskAdapter.upsertOne(state, action.payload);
  }

  if (actionMatchCreator(action, [
    assignTasksSuccess,
    unassignTasksSuccess,
  ])) {
    if (action.payload) {
      return taskAdapter.upsertMany(state, action.payload);
    }
  }

  switch (action.type) {
    case START_TASK_SUCCESS:
    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return taskAdapter.upsertOne(state, action.payload);

    default:
      return state;
  }
};
