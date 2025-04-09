import reducer from '../uiReducers';

import {
  createTaskFailure,
  createTaskRequest,
  createTaskSuccess,
  loadTaskListsFailure,
  loadTaskListsRequest,
  loadTaskListsSuccess,
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
      ['loadTaskListsRequest', loadTaskListsRequest],
      ['createTaskRequest', createTaskRequest],
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
      ['loadUsersFailure', loadUsersFailure],
      ['loadTaskListsFailure', loadTaskListsFailure],
      ['createTaskFailure', createTaskFailure],
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
      ['loadUsersSuccess', loadUsersSuccess],
      ['loadTaskListsSuccess', loadTaskListsSuccess],
      ['createTaskSuccess', createTaskSuccess],
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