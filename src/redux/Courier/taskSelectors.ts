/*
 * Selectors
 *
 * Selectors help decouple the shape of the state from the component code itself.
 * Here we use `reselect`, which allows us to memoize computed property values,
 * benefitting performance.
 */
import { createSelector } from '@reduxjs/toolkit';
import { isEqual, uniqWith } from 'lodash';
import moment from 'moment';

import { filterTasks, indexTasksByOrder } from '../logistics/utils';
import { taskUtils } from '../../coopcycle-frontend-js/logistics/redux';
import { RootState } from '../store';
import { EMPTY_TOURS_INDEX } from '../../utils/tours';

// Shared empty result, so selectors returning "nothing" keep a stable
// reference and don't re-render their subscribers.
const EMPTY_TASKS = [];

/* Simple Selectors */
const _selectTaskSelectedDate = (state: RootState) =>
  state.ui.tasks.selectedDate;
export const selectTaskSelectedDate = createSelector(
  _selectTaskSelectedDate,
  date => moment(date),
);

export const selectIsTasksLoading = state => state.entities.tasks.isFetching;
export const selectIsTasksLoadingFailure = state =>
  state.entities.tasks.loadTasksFetchError;
export const selectIsTaskCompleteFailure = state =>
  state.entities.tasks.completeTaskFetchError;
export const selectTaskFilters = state => state.ui.tasks.excludeFilters;
export const selectIsHideUnassignedFromMap = state =>
  state.ui.tasks.isHideUnassignedFromMap;
export const selectIsPolylineOn = state => state.ui.tasks.isPolylineOn;
export const selectTasksChangedAlertSound = state =>
  state.ui.tasks.tasksChangedAlertSound;
export const selectKeepAwake = state => state.ui.tasks.keepAwake;
export const selectSignatureScreenFirst = state =>
  state.ui.tasks.signatureScreenFirst;
export const selectSignatures = state => state.entities.tasks.signatures;
export const selectPictures = state => state.entities.tasks.pictures;

/* Compound Selectors */

export const selectTasks = createSelector(
  state => state.entities.tasks.date,
  state => state.entities.tasks.items,
  (date, tasks) => {
    const key = moment(date).format('YYYY-MM-DD');
    return tasks[key] || [];
  },
);

/**
 * @param   {State}  state Redux state
 * @returns {Task[]}       List of tasks not excluded by filters
 */
export const selectFilteredTasks = createSelector(
  selectTaskFilters,
  selectTasks,
  (filters, tasks) => filterTasks(tasks, filters),
);

/**
 * The tours of the selected day. Empty against an instance that does not
 * support tours, which makes every task render as its own row.
 */
export const selectTours = createSelector(
  state => state.entities.tasks.date,
  state => state.entities.tasks.tours,
  (date, tours) => {
    const key = moment(date).format('YYYY-MM-DD');
    return tours?.[key] || EMPTY_TOURS_INDEX;
  },
);


export const selectFilteredTasksIndexedByOrder = createSelector(
  selectFilteredTasks,
  indexTasksByOrder,
);

/**
 * Returns a plain lookup, *not* a factory of memoized selectors: building a
 * `createSelector` on every render (this is called from the render body of
 * every task row) defeats its memoization and hands `useSelector` a freshly
 * filtered array each time, so every row re-filters the whole task list — and
 * re-renders — on every dispatched action. Reading from a memoized index keeps
 * the returned array reference stable between renders.
 */
export const selectFilteredTasksByOrder = orderNumber => state =>
  selectFilteredTasksIndexedByOrder(state).get(orderNumber) ?? EMPTY_TASKS;

export const selectAreCancelledTasksHidden = createSelector(
  selectTaskFilters,
  filters => filters.some(f => f.status === 'CANCELLED'),
);

/**
 * @param   {State}   state Redux state
 * @returns {Boolean}       Is the { status: 'done' } filter active?
 */
export const selectAreDoneTasksHidden = createSelector(
  selectTaskFilters,
  filters => filters.some(f => f.status === 'DONE'),
);

/**
 * @param   {State}   state Redux state
 * @returns {Boolean}       Is the { status: 'failed' } filter active?
 */
export const selectAreFailedTasksHidden = createSelector(
  selectTaskFilters,
  filters => filters.some(f => f.status === 'FAILED'),
);

export const selectAreIncidentsHidden = createSelector(
  selectTaskFilters,
  filters => filters.some(f => f.hasIncidents),
);

/**
 * @param   {State} state Redux state
 * @returns {Tag[]}       List of unique tag objects
 */
export const selectTags = createSelector(selectTasks, tasks =>
  uniqWith(
    tasks.reduce((acc, task) => acc.concat(task.tags || []), []),
    isEqual,
  ),
);

/**
 * @param   {State}    state Redux state
 * @returns {String[]}       List of unique tag names
 */
export const selectTagNames = createSelector(selectTags, tags =>
  tags.map(t => t.name),
);

/**
 * @param   {State}    state Redux state
 * @returns {Function}       Function taking a tag-name
 */
export const selectIsTagHidden = createSelector(
  selectTaskFilters,
  filters => tag => filters.some(f => f.tags === tag),
);

export const selectTasksWithColor = createSelector(selectTasks, tasks =>
  taskUtils.mapToColor(tasks),
);
