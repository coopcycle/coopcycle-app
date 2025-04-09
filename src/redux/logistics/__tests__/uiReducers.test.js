import reducer from '../uiReducers';

import {
  assignTaskFailure,
  assignTaskRequest,
  assignTaskSuccess,
  bulkAssignmentTasksFailure,
  bulkAssignmentTasksRequest,
  bulkAssignmentTasksSuccess,
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
      ['assignTaskRequest', assignTaskRequest],
      ['createTaskRequest', createTaskRequest],
      ['loadTaskListsRequest', loadTaskListsRequest],
      ['loadTasksRequest', loadTasksRequest],
      ['loadUsersRequest', loadUsersRequest],
      ['unassignTaskRequest', unassignTaskRequest],
      // ['loadTasksRequest', loadTasksRequest],
    ])('should change isFetching to TRUE for load action %s', (actionName, actionCreator) => {
      const action = actionCreator();

      const newState = reducer(initialState, action);

      expect(newState.isFetching).toBeTruthy();
    })

    it.each([
      ['assignTaskFailure', assignTaskFailure],
      ['createTaskFailure', createTaskFailure],
      ['loadTaskListsFailure', loadTaskListsFailure],
      ['loadTasksFailure', loadTasksFailure],
      ['loadUsersFailure', loadUsersFailure],
      ['unassignTaskFailure', unassignTaskFailure],
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
      ['assignTaskSuccess', assignTaskSuccess],
      ['cancelTaskSuccess', cancelTaskSuccess],
      ['createTaskSuccess', createTaskSuccess],
      ['loadTaskListsSuccess', loadTaskListsSuccess],
      ['loadTasksSuccess', loadTasksSuccess],
      ['loadUsersSuccess', loadUsersSuccess],
      ['unassignTaskSuccess', unassignTaskSuccess],
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

  describe('isBulkAssigning', () => {
    it.each([
      ['bulkAssignmentTasksRequest', bulkAssignmentTasksRequest],
    ])('should change isBulkAssigning to TRUE for load action %s', (actionName, actionCreator) => {
      const action = actionCreator();

      const newState = reducer(initialState, action);

      expect(newState.isBulkAssigning).toBeTruthy();
    })

    it.each([
      ['bulkAssignmentTasksFailure', bulkAssignmentTasksFailure],
    ])('should change isBulkAssigning to FALSE for failure action %s', (actionName, actionCreator) => {
      const action = actionCreator();
      const state = {
        ...initialState,
        isBulkAssigning: true,
      }

      const newState = reducer(state, action);

      expect(newState.isBulkAssigning).toBeFalsy();
    })

    it.each([
      ['bulkAssignmentTasksSuccess', bulkAssignmentTasksSuccess],
    ])('should change isBulkAssigning to FALSE for success action %s', (actionName, actionCreator) => {
      const action = actionCreator();
      const state = {
        ...initialState,
        isBulkAssigning: true,
      }

      const newState = reducer(state, action);

      expect(newState.isBulkAssigning).toBeFalsy();
    })
  });
});