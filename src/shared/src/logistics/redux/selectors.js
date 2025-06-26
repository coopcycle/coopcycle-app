import _ from 'lodash';
import { createSelector } from 'reselect';

import { mapToColor } from './taskUtils';
import { taskAdapter, taskListAdapter, tourAdapter } from './adapters';


// Selectors

const taskSelectors = taskAdapter.getSelectors(
  state => state.logistics.entities.tasks,
);
const taskListSelectors = taskListAdapter.getSelectors(
  state => state.logistics.entities.taskLists,
);
const tourSelectors = tourAdapter.getSelectors(
  state => state.logistics.entities.tours,
);

// Base selections

export const selectSelectedDate = state => state.logistics.date;

export const selectAllTasks = taskSelectors.selectAll;
export const selectTasksEntities = taskSelectors.selectEntities;

export const selectAllTours = tourSelectors.selectAll;


// Selections for Tasks

export const selectAssignedTasks = createSelector(
  selectAllTasks,
  allTasks => allTasks.filter(task => task.isAssigned)
);

export const selectUnassignedTasks = createSelector(
  selectAllTasks,
  allTasks => allTasks.filter(task => !task.isAssigned)
);

export const selectTasksWithColor = createSelector(
  selectAllTasks,
  allTasks => mapToColor(allTasks),
);

export const selectUnassignedTasksNotCancelled = createSelector(
  selectUnassignedTasks,
  tasks =>
    _.filter(_.uniqBy(tasks, '@id'), task => task.status !== 'CANCELLED'),
);


// Selections for TaskLists

// FIXME
// This is not optimized
// Each time any task is updated, the tasks lists are looped over
// Also, it generates copies all the time
// Replace this with a selectTaskListItemsByUsername selector, used by the <TaskList> component
// https://redux.js.org/tutorials/essentials/part-6-performance-normalization#memoizing-selector-functions
export const selectTaskLists = createSelector(
  taskListSelectors.selectAll,
  taskSelectors.selectEntities,
  tourSelectors.selectEntities,
  (taskLists, tasksById, toursById) =>
    taskLists.map(taskList => {
      let newTaskList = { ...taskList };

      const orderedItems = taskList.itemIds.flatMap(itemId => {
        const maybeTask = tasksById[itemId];

        if (maybeTask) {
          return [maybeTask];
        }

        const maybeTour = toursById[itemId];

        if (maybeTour) {
          return maybeTour.items.map(taskId => tasksById[taskId]);
        }

        return [];
      });

      const items = _.uniqBy(orderedItems, '@id');
      // newTaskList.items = items;
      newTaskList.tasksIds = items.map(item => item['@id']);

      return newTaskList;
    }),
);


// Selections for Tours

// Returns a tours/tasks index with the format:
// {
//   tours: {tourId1: [taskId1, taskId2, ..], tourId2: [taskId3, ..]},
//   tasks: {taskId1: tourId1, taskId2: tourId1, taskId3: tourId2, ..}
// }
export const selectToursTasksIndex = createSelector(
  tourSelectors.selectEntities,
  (tours) => {
    return Object.values(tours).reduce((acc, tour) => {
      const tourId = tour['@id'];
      acc.tours[tourId] = (tour.items || []).map(taskId => {
        acc.tasks[taskId] = tourId;
        return taskId;
      });
      return acc;
    }, { // Initial index values
      tours: {},
      tasks: {},
    });
  }
);

const selectTaskListByUsername = (state, props) =>
  taskListSelectors.selectById(state, props.username);

// https://github.com/reduxjs/reselect#connecting-a-selector-to-the-redux-store
// https://redux.js.org/recipes/computing-derived-data
export const makeSelectTaskListItemsByUsername = () => {
  return createSelector(
    taskSelectors.selectEntities, // FIXME This is recalculated all the time
    selectTaskListByUsername,
    (tasks, taskList) => {
      if (!taskList) {
        return [];
      }

      return taskList.itemIds
        .filter(id => Object.prototype.hasOwnProperty.call(tasks, id)) // a task with this id may be not loaded yet
        .map(id => tasks[id]);
    },
  );
};
