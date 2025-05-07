import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from 'react';

import {
  assignTasksFailure,
  assignTasksRequest,
  assignTasksSuccess,
  unassignTasksSuccess,
  updateTaskListsSuccess,
  updateTourSuccess,
} from '../../../../../redux/Dispatch/actions';
import {
  getAssignedTask,
  getTaskListItemsIds,
  withAssignedLinkedTasks,
  withUnassignedLinkedTasks,
} from "../taskUtils";
import {
  selectAllTasks,
  selectSelectedDate,
  selectTaskLists, selectToursTasksIndex
} from "../selectors";
import {
  useSetTaskListItemsMutation,
  useSetTourItemsMutation,
} from "../../../../../redux/api/slice";


export default function useSetTaskListItems(
  navigation,
) {
  const allTasks = useSelector(selectAllTasks);
  const allTaskLists = useSelector(selectTaskLists);
  const toursIndexes = useSelector(selectToursTasksIndex);
  const selectedDate = useSelector(selectSelectedDate);

  const dispatch = useDispatch();

  const [
    setTaskListItems,
    {
      isError: isErrorSetTaskListItems,
      isLoading: isLoadingSetTaskListItems,
      isSuccess: isSuccessSetTaskListItems,
    }
  ] = useSetTaskListItemsMutation();
  const [
    setTourItems,
    {
      isError: isErrorSetTourItems,
      isLoading: isLoadingSetTourItems,
      isSuccess: isSuccessSetTourItems,
    }
  ] = useSetTourItemsMutation();

  const isLoading = useMemo(
    () => isLoadingSetTaskListItems || isLoadingSetTourItems,
    [isLoadingSetTaskListItems, isLoadingSetTourItems]
  );

  const isSuccess = useMemo(
    () => isSuccessSetTaskListItems || isSuccessSetTourItems,
    [isSuccessSetTaskListItems, isSuccessSetTourItems]
  );

  const isError = useMemo(
    () => isErrorSetTaskListItems || isErrorSetTourItems,
    [isErrorSetTaskListItems, isErrorSetTourItems]
  );

  useEffect(() => {
    if (isLoading) {
      dispatch(assignTasksRequest());
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(assignTasksSuccess());
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (isError) {
      dispatch(assignTasksFailure());
    }
  }, [dispatch, isError]);

  /**
   * Assign just one task to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTask = (task, user) => {
    const userItemsIds = getTaskListItemsIds(user.username, allTaskLists);
    const allItemsToAssign = [...userItemsIds, task['@id']];

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Assign a task and its related tasks to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTaskWithRelatedTasks = (task, user) => {
    const userItemsIds = getTaskListItemsIds(user.username, allTaskLists);
    const linkedTasks = withUnassignedLinkedTasks(task, allTasks);
    const linkedTasksIds = linkedTasks.map(item => item['@id']);
    const allItemsToAssign = [...userItemsIds, ...linkedTasksIds];

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Assign several tasks at once (and also the linked tasks)
   * @param {Array.Objects} tasks - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const bulkAssignTasksWithRelatedTasks = (tasks, user) => {
    const userItemsIds = getTaskListItemsIds(user.username, allTaskLists);
    const tasksWithLinkedTasks = _.uniqBy(
      _.flatMap(tasks.map(task => withUnassignedLinkedTasks(task, allTasks))),
      '@id',
    );
    const tasksWithLinkedTasksIds = tasksWithLinkedTasks.map(item => item['@id']);
    const allItemsToAssign = [...userItemsIds, ...tasksWithLinkedTasksIds];

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Unassign a task and its related tasks to rider
   * @param {Task} task - Task to be unassigned
   */
  const unassignTaskWithRelatedTasks = (task) => {
    const user = { username: task.assignedTo };
    const userItemsIds = getTaskListItemsIds(user.username, allTaskLists);
    const taskToUnassign = withAssignedLinkedTasks(task, allTasks);
    const itemsIdsToUnassign = taskToUnassign.map(t => t['@id']);
    const itemsIdsToUnassignSet = new Set(itemsIdsToUnassign);
    const allItemsIdsToAssign = userItemsIds.filter(itemId => !itemsIdsToUnassignSet.has(itemId));

    return _updateUnassigningTasks(allItemsIdsToAssign, user, itemsIdsToUnassign);
  }

  const _updateAssigningItems = (itemsIds, user) => {
    return _updateAssignedTasks(itemsIds, user)
      .then((previousToursIndexes) => _maybeRemoveTourTasks(itemsIds, previousToursIndexes))
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(itemsIds, user));
  }

  const _updateUnassigningTasks = (itemsIds, user, removedItemsIds) => {
    return _updateAssignedTasks(itemsIds, user)
      .then((previousToursIndexes) => _maybeRemoveTourTasks(removedItemsIds, previousToursIndexes))
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(itemsIds, user))
      .then(() => _updateRemovedTasks(removedItemsIds));
  }

  const _updateAssignedTasks = (itemsIds, user) => {
    const previousToursIndexes = _.cloneDeep(toursIndexes);

    return setTaskListItems({
      items: itemsIds,
      username: user.username,
      date: selectedDate
    })
    .then(() => previousToursIndexes);
  }

  function _maybeRemoveTourTasks(itemsIds, previousToursIndexes) {
    const toursToUpdate = itemsIds.reduce((acc, taskId) => {
      const tourId = previousToursIndexes.tasks[taskId];
      if (tourId) {
        // Initialize with all the indexed tour tasks if not already present
        // and remove the taskId from the tour tasks
        acc[tourId] = (acc[tourId] || previousToursIndexes.tours[tourId]).filter(tourTaskId => tourTaskId !== taskId);
      }
      return acc;
    }, {});

    return Promise.all(
      Object.entries(toursToUpdate).map(([tourUrl, tourTasks]) => setTourItems({ tourUrl, tourTasks }))
    ).then(() => {
      Object.entries(toursToUpdate).forEach(([tourId, tourTasks]) => {
        const tour = previousToursIndexes.tours[tourId];
        const updatedTour = {
          ...tour,
          items: tourTasks,
        }
        dispatch(updateTourSuccess(updatedTour));
      })
    });
  }

  const _updateTaskList = (taskList) => {
    dispatch(updateTaskListsSuccess(taskList));
  }

  const _updateTasks = (itemsIds, user) => {
    const itemsIdsSet = new Set(itemsIds);
    const tasks = allTasks.filter(task => itemsIdsSet.has(task['@id']));
    const newUserTasks = tasks.map(task => getAssignedTask(task, user.username));
    dispatch(assignTasksSuccess(newUserTasks));
  }

  const _updateRemovedTasks = (removedTasks) => {
    const itemsIdsSet = new Set(removedTasks);
    const tasks = allTasks.filter(task => itemsIdsSet.has(task['@id']));
    const unassignedTasks = tasks.map(task => getAssignedTask(task));
    dispatch(unassignTasksSuccess(unassignedTasks));
  }

  return {
    assignTask,
    assignTaskWithRelatedTasks,
    bulkAssignTasksWithRelatedTasks,
    isError,
    isLoading,
    isSuccess,
    unassignTaskWithRelatedTasks,
  };
}
