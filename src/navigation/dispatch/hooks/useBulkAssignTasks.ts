import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { UNASSIGNED_TASKS_LIST_ID } from '../../../shared/src/constants';
import {
  selectTaskLists,
  selectTasksEntities,
} from '../../../shared/logistics/redux';
import { getTaskListByTask } from '../../../shared/src/logistics/redux/taskListUtils';
import useSetTaskListItems from '../../../shared/src/logistics/redux/hooks/useSetTaskListItems';
import { useTaskListsContext } from '../../courier/contexts/TaskListsContext';
import Task from '@/src/types/task';

/**
 * Assigns (or unassigns) a selection of tasks in one go, through the user
 * picker.
 *
 * Shared by the two places the dispatcher can act on a selection: the floating
 * button on the board, and the actions menu in the header — which is the only
 * way in when a single task is selected, as the button only shows from two.
 */
export const useBulkAssignTasks = () => {
  const navigation = useNavigation();
  const context = useTaskListsContext();
  const allTaskLists = useSelector(selectTaskLists);
  const tasksEntities = useSelector(selectTasksEntities);

  const { bulkEditTasks } = useSetTaskListItems({
    allTaskLists,
    tasksEntities,
  });

  return useCallback(
    (tasks: Task[]) => {
      const tasksByList: Record<string, Task[]> = {};
      for (const task of tasks) {
        const taskList = getTaskListByTask(task, allTaskLists);
        const key = taskList ? taskList['@id'] : UNASSIGNED_TASKS_LIST_ID;
        if (!tasksByList[key]) tasksByList[key] = [];
        tasksByList[key].push(task);
      }
      // Bucket the selection into the `orders` slot so linked tasks are
      // assigned/unassigned together — matching the left-swipe behavior
      // (getTasksListsToEdit only expands linked tasks for the `orders` bucket).
      const selectedTasks = { orders: tasksByList, tasks: {} };
      const showUnassignButton = Object.keys(tasksByList).some(
        id => id !== UNASSIGNED_TASKS_LIST_ID,
      );

      const apply = async user => {
        // Addressed through the stack screen holding the tabs, so this works
        // the same from the board itself and from the header, which sits a
        // navigator higher up.
        navigation.navigate('DispatchHome', { screen: 'DispatchAllTasks' });
        await bulkEditTasks(selectedTasks, user);
        context?.clearSelectedTasks();
      };

      navigation.navigate('DispatchPickUser', {
        onItemPress: user => apply(user),
        showUnassignButton,
        onUnassignButtonPress: () => apply(undefined),
      });
    },
    [allTaskLists, bulkEditTasks, context, navigation],
  );
};
