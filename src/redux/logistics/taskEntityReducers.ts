import { actionMatchCreator } from '../util';
import { changeDate, loadTasksSuccess } from '../Dispatch/actions';
import { SET_USER } from '../App/actions';
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
import {
  getTaskWithColor,
  getTasksWithColor,
} from '../../shared/src/logistics/redux/taskUtils';

const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  if (changeDate.match(action) || action.type === SET_USER) {
    return initialState;
  }

  if (actionMatchCreator(action, [loadTasksSuccess])) {
    const tasks = getTasksWithColor(action.payload);
    return taskAdapter.setAll(state, tasks);
  }

  if (
    actionMatchCreator(action, [
      assignTaskSuccess,
      cancelTaskSuccess,
      createTaskSuccess,
      markTaskDoneSuccess,
      markTaskFailedSuccess,
      startTaskSuccess,
      unassignTaskSuccess,
      updateTaskSuccess,
    ])
  ) {
    const task = getTaskWithColor(
      action.payload,
      Object.values(state.entities),
    );
    return taskAdapter.upsertOne(state, task);
  }

  if (
    actionMatchCreator(action, [
      assignTasksSuccess,
      assignTasksWithUiUpdateSuccess,
      unassignTasksWithUiUpdateSuccess,
    ])
  ) {
    if (action.payload) {
      const tasks = getTasksWithColor(action.payload);
      return taskAdapter.upsertMany(state, tasks);
    }
  }

  return state;
};
