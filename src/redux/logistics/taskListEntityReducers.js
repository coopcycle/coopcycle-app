import {
  assignTaskSuccess,
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


const initialState = taskListAdapter.getInitialState();
const selectors = taskListAdapter.getSelectors(state => state);

export default (state = initialState, action) => {
  if (changeDate.match(action)) {
    return initialState;
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

  if (loadTaskListsSuccess.match(action)) {
    let entities = action.payload.map(taskList =>
      taskListUtils.replaceTasksWithIds(taskList),
    );
    return taskListAdapter.setAll(state, entities);
  }

  if (assignTaskSuccess.match(action)) {
    let newItems = taskListEntityUtils.addAssignedTask(
      selectors.selectEntities(state),
      action.payload,
    );
    return taskListAdapter.upsertMany(state, newItems);
  }

  if (unassignTaskSuccess.match(action)) {
    let newItems = taskListEntityUtils.removeUnassignedTask(
      selectors.selectEntities(state),
      action.payload,
    );
    return taskListAdapter.upsertMany(state, newItems);
  }

  if (updateTaskListsSuccess.match(action)) {
    return taskListAdapter.upsertOne(state, action.payload);
  }

  return state;
};
