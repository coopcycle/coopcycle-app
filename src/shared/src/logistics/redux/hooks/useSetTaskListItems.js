import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from 'react';

import {
  assignTasksFailure,
  assignTasksRequest,
  assignTasksSuccess,
  assignTasksWithUiUpdateSuccess,
  unassignTasksWithUiUpdateSuccess,
  updateTaskListsSuccess,
  updateTourSuccess,
} from '../actions';
import {
  buildSelectedTasks,
  getTasksListsToEdit,
} from '../taskListUtils';
import {
  getAssignedTask,
  getTaskListItemIds,
  getToursToUpdate,
} from "../taskUtils";
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
    if (isError) {
      dispatch(assignTasksFailure());
    }
  }, [dispatch, isError]);

  /**
   * Unassign just one task
   * @param {Task} task - Task to be unassigned
   */
  const unassignTask = (task) => {
    const selectedTasks = buildSelectedTasks([], [task], allTaskLists);
    return bulkEditTasks(selectedTasks);
  }

  /**
   * Unassign a task and its related tasks to rider
   * @param {Task} task - Task to be unassigned
   */
  const unassignTaskWithRelatedTasks = (task) => {
    const selectedTasks = buildSelectedTasks([task], [], allTaskLists);
    return bulkEditTasks(selectedTasks);
  }

  /**
   * Assign just one task to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTask = (task, user) => {
    const selectedTasks = buildSelectedTasks([], [task], allTaskLists);
    return bulkEditTasks(selectedTasks, user);
  }

  /**
   * Assign a task and its related tasks to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTaskWithRelatedTasks = (task, user) => {
    const selectedTasks = buildSelectedTasks([task], [], allTaskLists);
    return bulkEditTasks(selectedTasks, user);
  }

  /**
   * Reassign just one task to rider (remove it from previous rider)
   * @param {Task} task - Task to be reassigned
   * @param {User} user - User of the rider to which we assign
   */
  const reassignTask = async (task, user) => {
    const selectedTasks = buildSelectedTasks([], [task], allTaskLists);
    return bulkEditTasks(selectedTasks, user);
  }

  /**
   * Reassign a task and its related tasks to rider(remove them from previous rider)
   * @param {Task} task - Task to be reassigned
   * @param {User} user - User of the rider to which we assign
   */
  const reassignTaskWithRelatedTasks = async (task, user) => {
    const selectedTasks = buildSelectedTasks([task], [], allTaskLists);
    return bulkEditTasks(selectedTasks, user);
  }

  /**
   * Edit several tasks at once (and also their linked tasks)
   * @param {Array.Objects} tasks - Task to be un/assigned
   * @param {User} user - User of the rider to which we assign
   */
  const bulkEditTasks = async(selectedTasks, user) => {
    const isJustUnassign = !user;
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
      Object.values(taskListToUnassign).map((tasks) => _unassignTasks(tasks, isJustUnassign))
    );

    if(isJustUnassign) { // We are just unassigning tasks
      return unassignResolve;
    }

    const tasksToAssign = _.flatten(Object.values(taskListToEdit));

    return _assignTasks(tasksToAssign, user);
  };

  /**
   * Unassign tasks from a single/same courier
   * @param {Array} tasks - Tasks to be unassigned
   */
  const _unassignTasks = (tasks, isJustUnassign) => {
    if (tasks.length === 0) {
      return Promise.resolve();
    }

    // DANGER: We are assuming that all tasks are assigned to the same user..!!!
    const user = { username: tasks[0].assignedTo };
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const itemsToUnassignIds = tasks.map(task => task['@id']);
    const itemsToUnassignIdsSet = new Set(itemsToUnassignIds);
    const allItemIdsToAssign = userItemIds.filter(itemId => !itemsToUnassignIdsSet.has(itemId));

    return _updateUnassigningItems(
      allItemIdsToAssign,
      user,
      itemsToUnassignIds,
      isJustUnassign,
    );
  }

  const _assignTasks = (tasks, user) => {
    const userItemIds = getTaskListItemIds(user.username, allTaskLists);
    const itemsToAssignIds = tasks.map(task => task['@id']);
    const allItemsToAssign = _.uniq([...userItemIds, ...itemsToAssignIds]);

    return _updateAssigningItems(allItemsToAssign, user);
  }

  const _updateUnassigningItems = (newItemIds, user, removedItemIds, isJustUnassign) => {
    const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

    return _updateAssignedItems(newItemIds, user)
      .then((res) => _maybeRemoveTourTasks(removedItemIds, previousToursTasksIndex).then(_res => res))
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(newItemIds, user, false))
      .then(() => isJustUnassign && _updateRemovedTasks(removedItemIds))
  }

  const _updateAssigningItems = (itemIds, user) => {
    const previousToursTasksIndex = _.cloneDeep(toursTasksIndex);

    return _updateAssignedItems(itemIds, user)
      .then((res) => _maybeRemoveTourTasks(itemIds, previousToursTasksIndex).then(_res => res))
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(itemIds, user, true));
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

  const _updateTasks = (itemIds, user, updateUi) => {
    const itemIdsSet = new Set(itemIds);
    const tasks = allTasks.filter(task => itemIdsSet.has(task['@id']));
    const newUserTasks = tasks.map(task => getAssignedTask(task, user.username));

    if (updateUi) {
      dispatch(assignTasksWithUiUpdateSuccess(newUserTasks));
    } else {
      dispatch(assignTasksSuccess(newUserTasks));
    }
  }

  const _updateRemovedTasks = (removedTasks) => {
    const itemIdsSet = new Set(removedTasks);
    const tasks = allTasks.filter(task => itemIdsSet.has(task['@id']));
    const newUnassignedTasks = tasks.map(task => getAssignedTask(task));
    dispatch(unassignTasksWithUiUpdateSuccess(newUnassignedTasks));
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
