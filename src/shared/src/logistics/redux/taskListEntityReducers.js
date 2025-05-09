import { createTaskListSuccess } from './actions';
import { taskListAdapter } from './adapters';
import { replaceItemsWithItemIds } from './taskListUtils';

const initialState = taskListAdapter.getInitialState();

export default (state = initialState, action) => {
  if (createTaskListSuccess.match(action)) {
    return taskListAdapter.upsertOne(
      state,
      replaceItemsWithItemIds(action.payload),
    );
  }

  return state;
};
