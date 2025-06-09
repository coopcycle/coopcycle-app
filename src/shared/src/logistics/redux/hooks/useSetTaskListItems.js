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
} from '../actions';
import {
  getAssignedTask,
  getTaskListItemIds,
  getTaskListItems,
  getToursToUpdate,
  withAssignedLinkedTasks,
  withUnassignedLinkedTasks,
} from "../taskUtils";
import { getTasksListsToEdit } from '../taskListUtils';
import {
  selectAllTasks,
  selectAllTours,
  selectSelectedDate,
  selectTaskLists,
  selectToursTasksIndex,
} from "../selectors";
import { UNASSIGNED_TASKS_LIST_ID } from '../../../constants';
import {
  useSetTaskListItemsMutation,
  useSetTourItemsMutation,
} from "../../../../../redux/api/slice";


export default function useSetTaskListItems() {
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

  const assignTasks = (tasks, user) => {
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const itemsToAssignIds = tasks.map(task => task['@id']);
    const allItemsToAssign = _.uniq([...userItemIds, ...itemsToAssignIds]);

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Edit several tasks at once (and also their linked tasks)
   * @param {Array.Objects} tasks - Task to be un/assigned
   * @param {User} user - User of the rider to which we assign
   */
  const bulkEditTasks = async(selectedTasks, user) => {
    const taskListToEdit = getTasksListsToEdit(selectedTasks, allTasks, allTaskLists);
    const taskListToUnassign = {...taskListToEdit};

    if (user) { // Skip unassigning the user that is going to be assigned later
      const userTaskList = allTaskLists.find(taskList => taskList.username === user.username);
      if (userTaskList) {
        delete taskListToUnassign[userTaskList['@id']];
      }
    }
    delete taskListToUnassign[UNASSIGNED_TASKS_LIST_ID];

    const unassignResolve = await Promise.all(
      Object.values(taskListToUnassign).map(unassignTasks)
    );

    if(!user) { // We are just unassigning tasks
      return unassignResolve;
    }

    const tasksToAssign = _.flatten(Object.values(taskListToEdit));

    return assignTasks(tasksToAssign, user);
  };

  /**
   * Assign a task and its related tasks to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   * @param {Array.string} linkedTaskIds - (optional) Define which tasks to update
   */
  const assignTaskWithRelatedTasks = (task, user, linkedTaskIds) => {
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    let _linkedTaskIds = linkedTaskIds;

    if (!linkedTaskIds) {
      const linkedTasks = withUnassignedLinkedTasks(task, allTasks);
      _linkedTaskIds = linkedTasks.map(item => item['@id']);
    }

    const allItemsToAssign = [...userItemIds, ..._linkedTaskIds];

    return _updateAssigningItems(allItemsToAssign, user);
  }

  /**
   * Unassign just one task
   * @param {Task} task - Task to be unassigned
   */
  const unassignTask = (task) => {
    const user = { username: task.assignedTo };
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const itemsToUnassignIds = [task['@id']];
    const itemsToUnassignIdsSet = new Set(itemsToUnassignIds);
    const allItemIdsToAssign = userItemIds.filter(itemId => !itemsToUnassignIdsSet.has(itemId));

    return _updateUnassigningItems(allItemIdsToAssign, user, itemsToUnassignIds);
  }

  /**
   * Unassign tasks from a single/same courier
   * @param {Array} tasks - Tasks to be unassigned
   */
  const unassignTasks = (tasks) => {
    if (tasks.length === 0) {
      return Promise.resolve();
    }

    // DANGER: We are assuming that all tasks are assigned to the same user..!!!
    const user = { username: tasks[0].assignedTo };
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const itemsToUnassignIds = tasks.map(task => task['@id']);
    const itemsToUnassignIdsSet = new Set(itemsToUnassignIds);
    const allItemIdsToAssign = userItemIds.filter(itemId => !itemsToUnassignIdsSet.has(itemId));

    return _updateUnassigningItems(allItemIdsToAssign, user, itemsToUnassignIds);
  }

  /**
   * Unassign a task and its related tasks to rider
   * @param {Task} task - Task to be unassigned
   */
  const unassignTaskWithRelatedTasks = (task) => {
    const user = { username: task.assignedTo };
    const userItems = getTaskListItems(user.username, allTaskLists);
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const tasksToUnassign = withAssignedLinkedTasks(task, userItems); // Unassign just user's related tasks
    const itemsToUnassignIds = tasksToUnassign.map(t => t['@id']);
    const itemsToUnassignIdsSet = new Set(itemsToUnassignIds);
    const allItemIdsToAssign = userItemIds.filter(itemId => !itemsToUnassignIdsSet.has(itemId));

    return _updateUnassigningItems(allItemIdsToAssign, user, itemsToUnassignIds);
  }

  /**
   * Reassign just one task to rider (remove it from previous rider)
   * @param {Task} task - Task to be reassigned
   * @param {User} user - User of the rider to which we assign
   */
  const reassignTask = async (task, user) => {
    return unassignTask(task).then(() => assignTask(task, user));
  }

  /**
   * Reassign a task and its related tasks to rider(remove them from previous rider)
   * @param {Task} task - Task to be reassigned
   * @param {User} user - User of the rider to which we assign
   */
  const reassignTaskWithRelatedTasks = async (task, user) => {
    return unassignTaskWithRelatedTasks(task)
      .then((removedItemIds) => assignTaskWithRelatedTasks(task, user, removedItemIds));
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
      .then(() => _updateRemovedTasks(removedItemIds))
      .then(() => removedItemIds);
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
    const newUnassignedTasks = tasks.map(task => getAssignedTask(task));
    dispatch(unassignTasksSuccess(newUnassignedTasks));
  }

  return {
    assignTask,
    bulkEditTasks,
    assignTaskWithRelatedTasks,
    isError,
    isLoading,
    isSuccess,
    reassignTask,
    reassignTaskWithRelatedTasks,
    unassignTask,
    unassignTaskWithRelatedTasks,
  };
}
