import {
  bulkAssignmentTasksSuccess,
  changeDate,
  createTaskSuccess,
  loadTaskListsSuccess,
  unassignTaskSuccess,
  updateTaskListsSuccess,
} from '../Dispatch/actions';
import {
  taskListAdapter,
  taskListEntityUtils,
  taskListUtils,
} from '../../coopcycle-frontend-js/logistics/redux';
import { SET_USER } from '../App/actions';

const initialState = taskListAdapter.getInitialState();
const selectors = taskListAdapter.getSelectors(state => state);

export default (state = initialState, action) => {
  if (changeDate.match(action) || action.type === SET_USER) {
    return initialState;
  }

  if (loadTaskListsSuccess.match(action)) {
    let entities = action.payload.map(taskList =>
      taskListUtils.replaceItemsWithItemIds(taskList),
    );
    return taskListAdapter.setAll(state, entities);
  }

  if (updateTaskListsSuccess.match(action)) {
    const taskList = taskListUtils.replaceItemsWithItemIds(action.payload);
    return taskListAdapter.upsertOne(state, taskList);
  }

  if (createTaskSuccess.match(action)) {
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

  if (bulkAssignmentTasksSuccess.match(action)) {
    const taskList = taskListEntityUtils.addAssignedTasks(
      selectors.selectEntities(state),
      action.payload,
    )
    return taskListAdapter.upsertOne(state, taskList);
  }

  if (unassignTaskSuccess.match(action)) {
    let newItems = taskListEntityUtils.removeUnassignedTask(
      selectors.selectEntities(state),
      action.payload,
    );
    return taskListAdapter.upsertMany(state, newItems);
  }


  return state;
};
