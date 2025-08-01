import { createSlice } from '@reduxjs/toolkit';
import { taskExists } from '../../shared/src/logistics/redux/taskUtils';

const initialState = {
  orders: {},
  tasks: {},
};

const updateSelectedTasksSlice = createSlice({
  name: 'selectedTasks',
  initialState,
  reducers: {
    addOrder: (state, { payload: tasksByTaskList }) => {
      Object.entries(tasksByTaskList).forEach(([taskListId, tasks]) => {
        if (!state.orders[taskListId]) {
          state.orders[taskListId] = tasks;
        } else {
          const existingTasks = state.orders[taskListId];
          const newUniqueTasks = tasks.filter(
            t => !taskExists(existingTasks, t),
          );
          state.orders[taskListId] = [...existingTasks, ...newUniqueTasks];
        }
      });
    },
    addTask: (state, { payload: { task, taskListId } }) => {
      if (!state.tasks[taskListId]) {
        state.tasks[taskListId] = [];
      }

      if (!taskExists(state.tasks[taskListId], task)) {
        state.tasks[taskListId].push(task);
      }
    },
    removeOrder: (state, { payload: tasksByTaskList }) => {
      Object.entries(tasksByTaskList).forEach(([taskListId, tasks]) => {
        const list = state.orders[taskListId];
        if (!list) return;

        const taskIdsToRemove = tasks.map(t => t['@id']);
        state.orders[taskListId] = list.filter(
          t => !taskIdsToRemove.includes(t['@id']),
        );

        if (state.orders[taskListId].length === 0) {
          delete state.orders[taskListId];
        }
      });
    },

    removeTask: (state, { payload: tasksByTaskList }) => {
      Object.entries(tasksByTaskList).forEach(([taskListId, tasks]) => {
        const list = state.tasks[taskListId];
        if (!list) return;

        const taskIdsToRemove = tasks.map(t => t['@id']);
        state.tasks[taskListId] = list.filter(
          t => !taskIdsToRemove.includes(t['@id']),
        );

        if (state.tasks[taskListId].length === 0) {
          delete state.tasks[taskListId];
        }
      });
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

export const removeTasksAndOrders = tasksByTaskList => dispatch => {
  dispatch(removeOrder(tasksByTaskList));
  dispatch(removeTask(tasksByTaskList));
};

export default updateSelectedTasksSlice.reducer;
