import { createSelector } from "reselect";
import { selectAllTasks } from "../../shared/logistics/redux";

export const selectTasksByOrder = order => createSelector(
  selectAllTasks,
  allTasks => allTasks
    .filter(task => task.metadata.order_number === order)
    .sort((a,b) => a.metadata.delivery_position - b.metadata.delivery_position)
);