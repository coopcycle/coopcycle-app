import _ from 'lodash';
import { AppState } from 'react-native';

import { LOGOUT_SUCCESS, addNotification } from '../App/actions';
import { LOAD_TASKS_SUCCESS } from './taskActions';
import { selectTasks } from './taskSelectors';
import { EVENT as EVENT_TASK_COLLECTION } from '../../domain/TaskCollection';

export const ringOnTaskListUpdated = ({ getState, dispatch }) => {
  return next => action => {
    if (AppState.currentState !== 'active') {
      return next(action);
    }

    // Avoid ringing on first load
    if (
      action.type === LOAD_TASKS_SUCCESS ||
      action.type === 'persist/REHYDRATE'
    ) {
      return next(action);
    }

    // Avoid ringing when user disconnects
    if (action.type === LOGOUT_SUCCESS) {
      return next(action);
    }

    const prevState = getState();
    const result = next(action);
    const state = getState();

    const prevDate = prevState.entities.tasks.date;
    const date = state.entities.tasks.date;

    // The user is navigating to another date, do nothing
    if (date !== prevDate) {
      return result;
    }

    const prevTasks = selectTasks(prevState);
    const tasks = selectTasks(state);

    if (tasks !== prevTasks) {
      const addedTasks = _.differenceWith(
        tasks,
        prevTasks,
        (a, b) => a['@id'] === b['@id'],
      );

      const removedTasks = _.differenceWith(
        prevTasks,
        tasks,
        (a, b) => a['@id'] === b['@id'],
      );

      if (addedTasks.length > 0 || removedTasks.length > 0) {
        dispatch(
          addNotification(EVENT_TASK_COLLECTION.CHANGED, {
            date: date,
            added: addedTasks,
            removed: removedTasks,
          }),
        );
      }
    }

    return result;
  };
};
