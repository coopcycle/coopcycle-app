import { actionMatchCreator } from '../util';
import {
  changeDate,
  loadTasksSuccess,
} from '../Dispatch/actions';
import {
  SET_USER,
} from '../App/actions';
import {
  assignTaskSuccess,
  assignTasksSuccess,
  assignTasksWithUiUpdateSuccess,
  cancelTaskSuccess,
  createTaskSuccess,
  markTaskDoneSuccess,
  markTaskFailedSuccess,
  startTaskSuccess,
  taskAdapter,
  unassignTaskSuccess,
  unassignTasksWithUiUpdateSuccess,
  updateTaskSuccess,
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
    cancelTaskSuccess,
    createTaskSuccess,
    markTaskDoneSuccess,
    markTaskFailedSuccess,
    startTaskSuccess,
    unassignTaskSuccess,
    updateTaskSuccess,
  ])) {
    return taskAdapter.upsertOne(state, action.payload);
  }

  if (actionMatchCreator(action, [
    assignTasksSuccess,
    assignTasksWithUiUpdateSuccess,
    unassignTasksWithUiUpdateSuccess,
  ])) {
    if (action.payload) {
      return taskAdapter.upsertMany(state, action.payload);
    }
  }

  return state;
};
