import { actionMatchCreator } from '../../../../redux/util';
import {
  createTaskListFailure,
  createTaskListRequest,
  createTaskListSuccess,
} from './actions';

const initialState = {
  taskListsLoading: false,
};

export default (state = initialState, action) => {
  if (createTaskListRequest.match(action)) {
    return {
      ...state,
      taskListsLoading: true,
    };
  }

  if(actionMatchCreator(action, [
    createTaskListSuccess,
    createTaskListFailure,
  ])) {
    return {
      ...state,
      taskListsLoading: false,
    };
  }

  return state;
};
