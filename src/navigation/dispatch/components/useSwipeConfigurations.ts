import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTaskLists,
  selectTasksEntities,
} from '../../../shared/logistics/redux';
import { getLinkedTasks } from '../../../shared/src/logistics/redux/taskListUtils';
import { addOrder, addTask } from '../../../redux/Dispatch/updateSelectedTasksSlice';

export const useSwipeConfigurations = () => {
  const dispatch = useDispatch();
  const tasksEntities = useSelector(selectTasksEntities);
  const allTaskLists = useSelector(selectTaskLists);

  const handleOnSwipeToLeft = useCallback(
    taskListId => task => {
      const allTasks = Object.values(tasksEntities);
      const tasksByTaskList = getLinkedTasks(
        task,
        taskListId,
        allTasks,
        allTaskLists,
      );

      dispatch(addOrder(tasksByTaskList));
    },
    [allTaskLists, dispatch, tasksEntities],
  );

  const handleOnSwipeToRight = useCallback(
    taskListId => task => {
      dispatch(addTask({ task, taskListId }));
    },
    [dispatch],
  );
  return { handleOnSwipeToLeft, handleOnSwipeToRight };
};
