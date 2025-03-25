import {
  taskListAdapter,
  taskListEntityUtils,
  taskListUtils,
} from '../../coopcycle-frontend-js/logistics/redux';
import {
  ASSIGN_TASK_SUCCESS,
  CREATE_TASK_SUCCESS,
  LOAD_TASK_LISTS_SUCCESS,
  UNASSIGN_TASK_SUCCESS,
} from '../Dispatch/actions';
import { CENTRIFUGO_MESSAGE } from '../middlewares/CentrifugoMiddleware';

const initialState = taskListAdapter.getInitialState();
const selectors = taskListAdapter.getSelectors(state => state);

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TASK_LISTS_SUCCESS: {
      let entities = action.payload.map(taskList =>
        taskListUtils.replaceTasksWithIds(taskList),
      );
      return taskListAdapter.upsertMany(state, entities);
    }

    case CREATE_TASK_SUCCESS: {
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

    case ASSIGN_TASK_SUCCESS: {
      let newItems = taskListEntityUtils.addAssignedTask(
        selectors.selectEntities(state),
        action.payload,
      );
      return taskListAdapter.upsertMany(state, newItems);
    }

    case UNASSIGN_TASK_SUCCESS: {
      let newItems = taskListEntityUtils.removeUnassignedTask(
        selectors.selectEntities(state),
        action.payload,
      );
      return taskListAdapter.upsertMany(state, newItems);
    }

    case CENTRIFUGO_MESSAGE:
      return processWebsocketMessage(state, action);

    default:
      return state;
  }
};

const processWebsocketMessage = (state, action) => {
  if (action.payload.name && action.payload.data) {
    const { name, data } = action.payload;

    switch (name) {
      case 'v2:task_list:updated':{
        const { task_list } = data;
        return taskListAdapter.upsertOne(state, task_list);
      }

      default:
        return {
          ...state,
        };
    }
  }

  return state;
};
