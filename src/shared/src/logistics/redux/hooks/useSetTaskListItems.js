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
  getTaskListItemIds,
  getToursToUpdate,
  withAssignedLinkedTasks,
  withUnassignedLinkedTasks,
} from "../taskUtils";
import {
  selectAllTasks,
  selectAllTours,
  selectSelectedDate,
  selectTaskLists,
  selectToursTasksIndex,
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
  const allTours = useSelector(selectAllTours);
  const toursTasksIndex = useSelector(selectToursTasksIndex);
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
    () => isSuccessSetTaskListItems && isSuccessSetTourItems,
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
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const allItemsToAssign = [...userItemIds, task['@id']];

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Assign a task and its related tasks to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTaskWithRelatedTasks = (task, user) => {
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const linkedTasks = withUnassignedLinkedTasks(task, allTasks);
    const linkedTaskIds = linkedTasks.map(item => item['@id']);
    const allItemsToAssign = [...userItemIds, ...linkedTaskIds];

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Assign several tasks at once (and also their linked tasks)
   * @param {Array.Objects} tasks - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const bulkAssignTasksWithRelatedTasks = (tasks, user) => {
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const tasksWithLinkedTasks = _.uniqBy(
      _.flatMap(tasks.map(task => withUnassignedLinkedTasks(task, allTasks))),
      '@id',
    );
    const tasksWithLinkedTaskIds = tasksWithLinkedTasks.map(item => item['@id']);
    const allItemsToAssign = [...userItemIds, ...tasksWithLinkedTaskIds];

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Unassign a task and its related tasks to rider
   * @param {Task} task - Task to be unassigned
   */
  const unassignTaskWithRelatedTasks = (task) => {
    const user = { username: task.assignedTo };
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const taskToUnassign = withAssignedLinkedTasks(task, allTasks);
    const itemsToUnassignIds = taskToUnassign.map(t => t['@id']);
    const itemsToUnassignIdsSet = new Set(itemsToUnassignIds);
    const allItemIdsToAssign = userItemIds.filter(itemId => !itemsToUnassignIdsSet.has(itemId));

    return _updateUnassigningItems(allItemIdsToAssign, user, itemsToUnassignIds);
  }

  const _updateAssigningItems = (itemIds, user) => {
    const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

    return _updateAssignedItems(itemIds, user)
      .then((res) => _maybeRemoveTourTasks(itemIds, previousToursTasksIndex).then(_res => res))
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(itemIds, user));
  }

  const _updateUnassigningItems = (itemIds, user, removedItemIds) => {
    const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

    return _updateAssignedItems(itemIds, user)
      .then((res) => _maybeRemoveTourTasks(removedItemIds, previousToursTasksIndex).then(_res => res))
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(itemIds, user))
      .then(() => _updateRemovedTasks(removedItemIds));
  }

  const _updateAssignedItems = (itemIds, user) => {
    return setTaskListItems({
      items: itemIds,
      username: user.username,
      date: selectedDate
    });
  }

  function _maybeRemoveTourTasks(itemIds, previousToursIndexes) {
    const toursToUpdate = getToursToUpdate(itemIds, previousToursIndexes);

    return Promise.all(
      Object.entries(toursToUpdate).map(([tourUrl, tourTasks]) => setTourItems({ tourUrl, tourTasks }))
    ).then(() => {
      Object.entries(toursToUpdate).forEach(([tourId, tourTasks]) => {
        const tour = allTours.find(_tour => _tour['@id'] === tourId);
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

  const _updateTasks = (itemIds, user) => {
    const itemIdsSet = new Set(itemIds);
    const tasks = allTasks.filter(task => itemIdsSet.has(task['@id']));
    const newUserTasks = tasks.map(task => getAssignedTask(task, user.username));
    dispatch(assignTasksSuccess(newUserTasks));
  }

  const _updateRemovedTasks = (removedTasks) => {
    const itemIdsSet = new Set(removedTasks);
    const tasks = allTasks.filter(task => itemIdsSet.has(task['@id']));
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
