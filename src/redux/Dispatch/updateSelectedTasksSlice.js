import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: {},
  tasks: {},
};
const updateSelectedTasksSlice = createSlice({
  name: 'selectedTasks',
  initialState,
  reducers: {
    // TODO on swipe, add linked tasks to selectedTask state
    // getTasksListsToEdit?

    // add remove
    addOrder: (state, { payload: { task, taskListId } }) => {
      // remove if it's in selectedTasks.tasks
      const selectedTasksForTaskList = state.tasks[taskListId];

      if (selectedTasksForTaskList) {
        state.tasks[taskListId] = selectedTasksForTaskList.filter(
          t => t.id !== task.id,
        );

        if (state.tasks[taskListId].length === 0) {
          delete state.tasks[taskListId];
        }
      }

      if (!state.orders[taskListId]) {
        state.orders[taskListId] = [];
      }
      state.orders[taskListId].push(task);
    },
    addTask: (state, { payload: { task, taskListId } }) => {
      // remove if it's in selectedTasks.orders
      const selectedTasksForTaskList = state.orders[taskListId];

      if (selectedTasksForTaskList) {
        state.orders[taskListId] = selectedTasksForTaskList.filter(
          t => t.id !== task.id,
        );

        if (state.orders[taskListId].length === 0) {
          delete state.orders[taskListId];
        }
      }
      if (!state.tasks[taskListId]) {
        state.tasks[taskListId] = [];
      }
      state.tasks[taskListId].push(task);
    },

    removeOrder: (state, { payload: { taskId, taskListId } }) => {
      const list = state.orders[taskListId];
      if (!list) return;

      state.orders[taskListId] = list.filter(t => t['@id'] !== taskId);
      if (state.orders[taskListId].length === 0) {
        delete state.orders[taskListId];
      }
    },

    removeTask: (state, { payload: { taskId, taskListId } }) => {
      const list = state.tasks[taskListId];
      if (!list) return;

      state.tasks[taskListId] = list.filter(t => t['@id'] !== taskId);
      if (state.tasks[taskListId].length === 0) {
        delete state.tasks[taskListId];
      }
    },

    clearSelectedTasks: selectedTasks => {
      selectedTasks.orders = {};
      selectedTasks.tasks = {};
    },
  },
});

export const {
  addOrder,
  addTask,
  removeOrder,
  removeTask,
  clearSelectedTasks,
} = updateSelectedTasksSlice.actions;
export default updateSelectedTasksSlice.reducer;
