import { CREATE_TASK_LIST_SUCCESS } from './actions';
import { taskListAdapter } from './adapters';
import { replaceItemsWithItemIds } from './taskListUtils';

const initialState = taskListAdapter.getInitialState();

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TASK_LIST_SUCCESS:
      return taskListAdapter.upsertOne(
        state,
        replaceItemsWithItemIds(action.payload),
      );
  }

  return state;
};
