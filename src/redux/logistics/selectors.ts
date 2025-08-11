import { createSelector } from '@reduxjs/toolkit';
import { selectAllTasks } from '../../shared/logistics/redux';

export const selectTasksByOrder = orderId =>
  createSelector(selectAllTasks, allTasks =>
    allTasks
      .filter(task => task.metadata.order_number === orderId)
      .sort(
        (a, b) => a.metadata.delivery_position - b.metadata.delivery_position,
      ),
  );
