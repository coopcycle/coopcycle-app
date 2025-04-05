import {
  ASSIGN_TASK_SUCCESS,
  CANCEL_TASK_SUCCESS,
  CHANGE_DATE,
  CREATE_TASK_SUCCESS,
  LOAD_TASKS_SUCCESS,
  LOAD_UNASSIGNED_TASKS_SUCCESS,
  UNASSIGN_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS,
} from '../Dispatch/actions';
import {
  MARK_TASK_DONE_SUCCESS,
  MARK_TASK_FAILED_SUCCESS,
  START_TASK_SUCCESS,
} from '../Courier';
import {
  taskAdapter,
} from '../../coopcycle-frontend-js/logistics/redux';


const initialState = taskAdapter.getInitialState();

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return initialState;

    case LOAD_TASKS_SUCCESS:
      return taskAdapter.upsertMany(state, action.payload);

    case LOAD_UNASSIGNED_TASKS_SUCCESS:
      return taskAdapter.setAll(state, action.payload);

    case UPDATE_TASK_SUCCESS:
    case CREATE_TASK_SUCCESS:
    case CANCEL_TASK_SUCCESS:
    case ASSIGN_TASK_SUCCESS:
    case UNASSIGN_TASK_SUCCESS:
    case START_TASK_SUCCESS:
    case MARK_TASK_DONE_SUCCESS:
    case MARK_TASK_FAILED_SUCCESS:
      return taskAdapter.upsertOne(state, action.payload);

    default:
      return state;
  }
};
