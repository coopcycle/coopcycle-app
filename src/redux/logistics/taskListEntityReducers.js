import { actionMatchCreator } from '../util';
import {
  DEP_ASSIGN_TASK_SUCCESS,
  DEP_LOAD_TASK_LISTS_SUCCESS,
  DEP_UNASSIGN_TASK_SUCCESS,
  UPDATE_TASK_LIST_SUCCESS,
  changeDate,
  createTaskSuccess,
} from '../Dispatch/actions';
import {
  taskListAdapter,
  taskListEntityUtils,
  taskListUtils,
} from '../../coopcycle-frontend-js/logistics/redux';

const initialState = taskListAdapter.getInitialState();
const selectors = taskListAdapter.getSelectors(state => state);

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [
    changeDate,
  ])) {
    return initialState;
  }

  if (actionMatchCreator(action, [
    createTaskSuccess,
  ])) {
    let task = action.payload;

    if (task.isAssigned) {
      let newItems = taskListEntityUtils.addAssignedTask(
        selectors.selectEntities(state),
        task,
      );
      return taskListAdapter.upsertMany(state, newItems);
    } else {
      return state;
    }
  }

  switch (action.type) {
    case DEP_LOAD_TASK_LISTS_SUCCESS: {
      let entities = action.payload.map(taskList =>
        taskListUtils.replaceTasksWithIds(taskList),
      );
      return taskListAdapter.setAll(state, entities);
    }

    case UPDATE_TASK_LIST_SUCCESS: {
      return taskListAdapter.upsertOne(state, action.payload);
    }

    case DEP_ASSIGN_TASK_SUCCESS: {
      let newItems = taskListEntityUtils.addAssignedTask(
        selectors.selectEntities(state),
        action.payload,
      );
      return taskListAdapter.upsertMany(state, newItems);
    }

    case DEP_UNASSIGN_TASK_SUCCESS: {
      let newItems = taskListEntityUtils.removeUnassignedTask(
        selectors.selectEntities(state),
        action.payload,
      );
      return taskListAdapter.upsertMany(state, newItems);
    }

    default:
      return state;
  }
};
