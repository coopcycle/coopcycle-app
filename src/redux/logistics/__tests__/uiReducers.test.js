import {
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
import {
  assignTasksFailure,
  assignTasksRequest,
  assignTasksWithUiUpdateSuccess,
  cancelTaskSuccess,
  createTaskFailure,
  createTaskRequest,
  createTaskSuccess,
  loadToursFailure,
  loadToursSuccess,
  unassignTasksWithUiUpdateSuccess,
} from '../../../shared/logistics/redux';
import reducer from '../uiReducers';


describe('uiReducers', () => {
  const initialState = {
    isAssigningTasks: false,
    isFetching: false,
    taskListsLoading: false,
  };

  describe('isFetching', () => {
    it.each([
      ['createTaskRequest', createTaskRequest],
      ['loadTaskListsRequest', loadTaskListsRequest],
      ['loadTasksRequest', loadTasksRequest],
      ['loadUsersRequest', loadUsersRequest],
    ])('should change isFetching to TRUE for load action %s', (actionName, actionCreator) => {
      const action = actionCreator();

      const newState = reducer(initialState, action);

      expect(newState.isFetching).toBeTruthy();
    })

    it.each([
      ['createTaskFailure', createTaskFailure],
      ['loadTaskListsFailure', loadTaskListsFailure],
      ['loadTasksFailure', loadTasksFailure],
      ['loadUsersFailure', loadUsersFailure],
      ['loadToursFailure', loadToursFailure],
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
      ['cancelTaskSuccess', cancelTaskSuccess],
      ['createTaskSuccess', createTaskSuccess],
      ['loadTaskListsSuccess', loadTaskListsSuccess],
      ['loadTasksSuccess', loadTasksSuccess],
      ['loadToursSuccess', loadToursSuccess],
      ['loadUsersSuccess', loadUsersSuccess],
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

  describe('isAssigningTasks', () => {
    it.each([
      ['assignTasksRequest', assignTasksRequest],
    ])('should change isAssigningTasks to TRUE for load action %s', (actionName, actionCreator) => {
      const action = actionCreator();

      const newState = reducer(initialState, action);

      expect(newState.isAssigningTasks).toBeTruthy();
    })

    it.each([
      ['assignTasksFailure', assignTasksFailure],
    ])('should change isAssigningTasks to FALSE for failure action %s', (actionName, actionCreator) => {
      const action = actionCreator();
      const state = {
        ...initialState,
        isAssigningTasks: true,
      }

      const newState = reducer(state, action);

      expect(newState.isAssigningTasks).toBeFalsy();
    })

    it.each([
      ['assignTasksWithUiUpdateSuccess', assignTasksWithUiUpdateSuccess],
      ['unassignTasksWithUiUpdateSuccess', unassignTasksWithUiUpdateSuccess],
    ])('should change isAssigningTasks to FALSE for success action %s', (actionName, actionCreator) => {
      const action = actionCreator();
      const state = {
        ...initialState,
        isAssigningTasks: true,
      }

      const newState = reducer(state, action);

      expect(newState.isAssigningTasks).toBeFalsy();
    })
  });
});