import {
  changeDate,
  loadTaskListsSuccess,
  updateTaskListsSuccess,
} from '../Dispatch/actions';
import {
  taskListAdapter,
  taskListUtils,
} from '../../coopcycle-frontend-js/logistics/redux';
import { SET_USER } from '../App/actions';


const initialState = taskListAdapter.getInitialState();

export default (state = initialState, action) => {
  if (changeDate.match(action) || action.type === SET_USER) {
    return initialState;
  }

  if (loadTaskListsSuccess.match(action)) {
    const entities = action.payload.map(taskList =>
      taskListUtils.replaceItemsWithItemIds(taskList),
    );
    return taskListAdapter.setAll(state, entities);
  }

  if (updateTaskListsSuccess.match(action)) {
    const taskList = taskListUtils.replaceItemsWithItemIds(action.payload);
    return taskListAdapter.upsertOne(state, taskList);
  }

  return state;
};
