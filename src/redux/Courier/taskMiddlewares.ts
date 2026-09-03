import { AppState } from 'react-native';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

import { LOGOUT_SUCCESS, addNotification } from '../App/actions';
import { LOAD_TASKS_SUCCESS } from './taskActions';
import { selectTasks } from './taskSelectors';
import { EVENT as EVENT_TASK_COLLECTION } from '../../domain/TaskCollection';
import { apiSlice } from '../api/slice';
import { CENTRIFUGO_MESSAGE } from '../middlewares/CentrifugoMiddleware';
import { RootState } from '../store';

export const ringOnTaskListUpdated = ({ getState, dispatch }) => {
  return next => action => {
    if (AppState.currentState !== 'active') {
      return next(action);
    }

    // Avoid ringing on first load
    if (
      action.type === LOAD_TASKS_SUCCESS ||
      apiSlice.endpoints.getMyTasks.matchFulfilled(action) ||
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
      // Compared through sets of ids: `_.differenceWith` runs its comparator
      // for every pair, so this was quadratic in the size of the task list,
      // twice, on every action that touched the tasks.
      const prevIds = new Set(prevTasks.map(task => task['@id']));
      const ids = new Set(tasks.map(task => task['@id']));

      const addedTasks = tasks.filter(task => !prevIds.has(task['@id']));
      const removedTasks = prevTasks.filter(task => !ids.has(task['@id']));

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

/**
 * Refetches the courier's task list when the server pushes an update to it.
 *
 * The pushed payload is always flat — it is built in a Doctrine flush hook,
 * with no request behind it, so there is no "?tours=1" for the server to
 * honour and it cannot carry tours. Rather than teach the reducer a second
 * payload shape, we let the push invalidate the cache and read the tours back
 * from the one endpoint that can express them.
 *
 * The reducer still applies the pushed tasks (see `processWsMsg`), so the list
 * is correct immediately and stays correct if this refetch never lands; the
 * refetch only reconciles the tour grouping.
 */
export const refetchMyTasksOnTaskListUpdated = ({
  getState,
  dispatch,
}: {
  getState: () => RootState;
  dispatch: Dispatch;
}) => {
  return (next: (action: AnyAction) => unknown) => (action: AnyAction) => {
    const result = next(action);

    if (action.type !== CENTRIFUGO_MESSAGE) {
      return result;
    }

    const { name, data } = action.payload ?? {};

    if (name !== 'task_list:updated' || !data?.task_list) {
      return result;
    }

    // Other couriers' task lists are pushed on the same channel for users who
    // are also dispatchers; they must not invalidate this courier's list.
    if (data.task_list.username !== getState().entities.tasks.username) {
      return result;
    }

    dispatch(apiSlice.util.invalidateTags(['MyTasks']));

    return result;
  };
};
