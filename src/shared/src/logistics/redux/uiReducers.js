import _ from 'lodash';

import { actionMatchCreator } from '../../../../redux/util';
import {
  createTaskListFailure,
  createTaskListRequest,
  createTaskListSuccess,
  disableCentrifugoUpdateForTasksIds,
  disableCentrifugoUpdateForUsers,
  restoreCentrifugoUpdate,
} from './actions';

const initialState = {
  taskListsLoading: false,
  disabledCentrifugoUpdatesForTasksIds: [],
  disabledCentrifugoUpdatesForUsers: [],
};

export default (state = initialState, action) => {
  if (createTaskListRequest.match(action)) {
    return {
      ...state,
      taskListsLoading: true,
    };
  }

  if (
    actionMatchCreator(action, [createTaskListSuccess, createTaskListFailure])
  ) {
    return {
      ...state,
      taskListsLoading: false,
    };
  }

  if (actionMatchCreator(action, [disableCentrifugoUpdateForTasksIds])) {
    const disabledCentrifugoUpdatesForTasksIds = _.uniq([
      ...action.payload,
      ...state.disabledCentrifugoUpdatesForTasksIds,
    ]);

    return {
      ...state,
      disabledCentrifugoUpdatesForTasksIds,
    };
  }

  if (actionMatchCreator(action, [disableCentrifugoUpdateForUsers])) {
    const disabledCentrifugoUpdatesForUsers = _.uniq([
      action.payload,
      ...state.disabledCentrifugoUpdatesForUsers,
    ]);

    return {
      ...state,
      disabledCentrifugoUpdatesForUsers,
    };
  }

  if (actionMatchCreator(action, [restoreCentrifugoUpdate])) {
    return {
      ...state,
      disabledCentrifugoUpdatesForTasksIds:
        initialState.disabledCentrifugoUpdatesForTasksIds,
      disabledCentrifugoUpdatesForUsers:
        initialState.disabledCentrifugoUpdatesForUsers,
    };
  }

  return state;
};
