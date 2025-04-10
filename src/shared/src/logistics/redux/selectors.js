import _ from 'lodash';
import { createSelector } from 'reselect';
import { taskAdapter, taskListAdapter, tourAdapter } from './adapters';
import { mapToColor } from './taskUtils';

const taskSelectors = taskAdapter.getSelectors(
  state => state.logistics.entities.tasks,
);
const taskListSelectors = taskListAdapter.getSelectors(
  state => state.logistics.entities.taskLists,
);
const tourSelectors = tourAdapter.getSelectors(
  state => state.logistics.entities.tours,
);

export const selectSelectedDate = state => state.logistics.date;

export const selectAllTasks = taskSelectors.selectAll;

export const selectAssignedTasks = createSelector(
  selectAllTasks,
  allTasks => allTasks.filter(task => task.isAssigned)
);

export const selectUnassignedTasks = createSelector(
  selectAllTasks,
  allTasks => allTasks.filter(task => !task.isAssigned)
);

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
      delete newTaskList.itemIds;

      // const taskListTasks = taskList.itemIds
      //   .filter(itemId =>
      //     Object.prototype.hasOwnProperty.call(tasksById, itemId),
      //   ) // a task with this id may be not loaded yet
      //   .map(taskId => tasksById[taskId]);

      // const taskListTours = taskList.itemIds
      //   .filter(itemId =>
      //     Object.prototype.hasOwnProperty.call(toursById, itemId),
      //   ) // a tour with this id may be not loaded yet
      //   .map(itemId => toursById[itemId]);

      // const toursTasks = _.flatMap(
      //   taskListTours, tour => tour.items.map(item => tasksById[item])
      // );

      // newTaskList.items = [...taskListTasks, ...toursTasks];

      const orderedItems = taskList.itemIds.flatMap(itemId => {
        if (tasksById[itemId]){
          return [tasksById[itemId]];
        }else if (toursById[itemId]){
          const tour = toursById[itemId];
          return tour.task.map(taskId => tasksById[taskId]);
        } else {
          return [];
        }
      });

      newTaskList.items = orderedItems;
      return newTaskList;
    }),
);

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



export const selectTasksWithColor = createSelector(selectAllTasks, allTasks =>
  mapToColor(allTasks),
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
