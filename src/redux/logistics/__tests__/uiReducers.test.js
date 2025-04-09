import reducer from '../uiReducers';

import {
  assignTaskFailure,
  assignTaskRequest,
  assignTaskSuccess,
  cancelTaskSuccess,
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
  unassignTaskFailure,
  unassignTaskRequest,
  unassignTaskSuccess,
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
      ['assignTaskRequest', assignTaskRequest],
      ['unassignTaskRequest', unassignTaskRequest],
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
      ['assignTaskFailure', assignTaskFailure],
      ['unassignTaskSuccess', unassignTaskSuccess],
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
      ['cancelTaskSuccess', cancelTaskSuccess],
      ['assignTaskSuccess', assignTaskSuccess],
      ['unassignTaskFailure', unassignTaskFailure],
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