import { createAction } from 'redux-actions';

export const CREATE_TASK_LIST_REQUEST = 'CREATE_TASK_LIST_REQUEST';
export const CREATE_TASK_LIST_SUCCESS = 'CREATE_TASK_LIST_SUCCESS';
export const CREATE_TASK_LIST_FAILURE = 'CREATE_TASK_LIST_FAILURE';

export const LOAD_TOURS_SUCCESS = 'LOAD_TOURS_SUCCESS';
export const LOAD_TOURS_FAILURE = 'LOAD_TOURS_FAILURE';
// For future integration with web socket
export const DELETE_TOUR_SUCCESS = 'DELETE_TOUR_SUCCESS';
export const UPDATE_TOUR = 'UPDATE_TOUR';

export const createTaskListRequest = createAction(CREATE_TASK_LIST_REQUEST);
export const createTaskListSuccess = createAction(CREATE_TASK_LIST_SUCCESS);
export const createTaskListFailure = createAction(CREATE_TASK_LIST_FAILURE);

export const deleteTourSuccess = createAction(DELETE_TOUR_SUCCESS);
export const loadToursSuccess = createAction(LOAD_TOURS_SUCCESS);
export const loadToursFailure = createAction(LOAD_TOURS_FAILURE);
export const updateTour = createAction(UPDATE_TOUR);
