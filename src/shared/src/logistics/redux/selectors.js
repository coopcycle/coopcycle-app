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

export const selectTaskLists = createSelector(
  taskListSelectors.selectAll,
  tourSelectors.selectEntities,
  (taskLists, toursById) =>
    taskLists.map(taskList => {
      let newTaskList = { ...taskList };

      const orderedItems = taskList.itemIds.flatMap(itemId => {
          const maybeTour = toursById[itemId];

          if (maybeTour) {
            return maybeTour.items;
          }

          if (itemId.includes('/api/tasks/')){
            return [itemId];
          }

          return [];
      });
      newTaskList.tasksIds = _.uniq(orderedItems);

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
