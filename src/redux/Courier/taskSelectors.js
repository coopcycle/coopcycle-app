/*
 * Selectors
 *
 * Selectors help decouple the shape of the state from the component code itself.
 * Here we use `reselect`, which allows us to memoize computed property values,
 * benefitting performance.
 */
import { createSelector } from 'reselect';
import { isEqual, uniqWith } from 'lodash';
import moment from 'moment';

import { filterTasks } from '../logistics/utils';
import { taskUtils } from '../../coopcycle-frontend-js/logistics/redux';


/* Simple Selectors */
export const selectTaskSelectedDate = state => state.ui.tasks.selectedDate;
export const selectIsTasksLoading = state => state.entities.tasks.isFetching;
export const selectIsTasksLoadingFailure = state =>
  state.entities.tasks.loadTasksFetchError;
export const selectIsTaskCompleteFailure = state =>
  state.entities.tasks.completeTaskFetchError;
export const selectTaskFilters = state => state.ui.tasks.excludeFilters;
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

    return tasks[key] ? tasks[key].filter(t => t.status !== 'CANCELLED') : [];
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
)

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
