import { CREATE_TASK_LIST_SUCCESS } from './actions';
import { taskAdapter } from './adapters';

const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  switch (action.type) {
    // TODO: review this case. I guess it should be deleted
    // case CREATE_TASK_LIST_SUCCESS:
    //   return taskAdapter.upsertMany(state, action.payload.items);
  }

  return state;
};
