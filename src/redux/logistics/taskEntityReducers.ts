import { actionMatchCreator } from '../util';
import { changeDate, loadTasksSuccess } from '../Dispatch/actions';
import { LOGOUT_SUCCESS } from '../App/actions';
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
  getProcessedTasks,
  getTaskWithColor,
} from '../../shared/src/logistics/redux/taskUtils';

const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  if (changeDate.match(action) || action.type === LOGOUT_SUCCESS) {
    return initialState;
  }

  if (actionMatchCreator(action, [loadTasksSuccess])) {
    const tasks = getProcessedTasks(action.payload);
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
      const tasks = getProcessedTasks(action.payload);
      return taskAdapter.upsertMany(state, tasks);
    }
  }

  return state;
};
