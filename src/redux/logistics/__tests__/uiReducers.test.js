import reducer from '../uiReducers';

import {
  loadTasksFailure,
  loadTasksRequest,
  loadTasksSuccess,
  loadUsersFailure,
  loadUsersRequest,
  loadUsersSuccess,
} from "../../Dispatch/actions";


describe('uiReducers', () => {
  const initialState = {
    isBulkAssigning: false,
    isFetching: false,
    taskListsLoading: false,
  };

  describe('isFetching', () => {
    it.each([
      ['loadTasksRequest', loadTasksRequest],
      ['loadUsersRequest', loadUsersRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
    ])('should change isFetching to TRUE for load action %s', (actionName, actionCreator) => {
      const action = actionCreator();

      const newState = reducer(initialState, action);

      expect(newState.isFetching).toBeTruthy();
    })

    it.each([
      ['loadTasksFailure', loadTasksFailure],
      ['loadUsersSuccess', loadUsersSuccess],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
    ])('should change isFetching to FALSE for failure action %s', (actionName, actionCreator) => {
      const action = actionCreator();
      const state = {
        ...initialState,
        isFetching: true,
      }

      const newState = reducer(state, action);

      expect(newState.isFetching).toBeFalsy();
    })

    it.each([
      ['loadTasksSuccess', loadTasksSuccess],
      ['loadUsersFailure', loadUsersFailure],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
      // ['loadTasksRequest', loadTasksRequest],
    ])('should change isFetching to FALSE for success action %s', (actionName, actionCreator) => {
      const action = actionCreator();
      const state = {
        ...initialState,
        isFetching: true,
      }

      const newState = reducer(state, action);

      expect(newState.isFetching).toBeFalsy();
    })
  });
});