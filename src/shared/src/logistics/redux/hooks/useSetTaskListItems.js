import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from 'react';

import {
  assignTasksFailure,
  assignTasksRequest,
  assignTasksSuccess,
} from '../../../../../redux/Dispatch/actions';
import {
  getAssignedTask,
  getUserTasks,
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
import {
  unassignTaskSuccess,
  updateTaskListsSuccess,
  updateTourSuccess,
} from '../actions';


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
    const userTasks = getUserTasks(user.username, allTaskLists);
    const allTasksToAssign = [...userTasks, task];

    return _updateAssigningTasks(allTasksToAssign, user);
  }

  /**
   * Assign a task and its related tasks to rider
   * @param {Task} task - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const assignTaskWithRelatedTasks = (task, user) => {
    const userTasks = getUserTasks(user.username, allTaskLists);
    const linkedTasks = withUnassignedLinkedTasks(task, allTasks);
    const allTasksToAssign = [...userTasks, ...linkedTasks];

    return _updateAssigningTasks(allTasksToAssign, user);
  }

  /**
   * Assign several tasks at once (and also the linked tasks)
   * @param {Array.Objects} tasks - Task to be assigned
   * @param {User} user - User of the rider to which we assign
   */
  const bulkAssignTasksWithRelatedTasks = (tasks, user) => {
    const userTasks = getUserTasks(user.username, allTaskLists);
    const tasksWithLinkedTasks = _.uniqBy(
      _.flatMap(tasks.map(task => withUnassignedLinkedTasks(task, allTasks))),
      '@id',
    );
    const allTasksToAssign = [...userTasks, ...tasksWithLinkedTasks];

    return _updateAssigningTasks(allTasksToAssign, user);
  }

  /**
   * Unassign a task and its related tasks to rider
   * @param {Task} task - Task to be unassigned
   */
  const unassignTaskWithRelatedTasks = (task) => {
    const user = { username: task.assignedTo };
    const userTasks = getUserTasks(user.username, allTaskLists);
    const linkedTasks = withAssignedLinkedTasks(task, allTasks);
    const tasksToUnassign = new Set(linkedTasks.map(t => t['@id']));
    const allTasksToAssign = userTasks.filter(userTask => !tasksToUnassign.has(userTask['@id']));

    return _updateUnassigningTasks(allTasksToAssign, user, linkedTasks);
  }

  const _updateAssigningTasks = (tasks, user) => {
    return _updateAssignedTasks(tasks, user)
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(tasks, user));
  }

  const _updateUnassigningTasks = (tasks, user, removedTasks) => {
    return _updateAssignedTasks(tasks, user)
      .then(res => _maybeRemoveTourTasks(tasks).then(_res => res))
      .then(({ data: taskList }) => _updateTaskList(taskList))
      .then(() => _updateTasks(tasks, user))
      .then(() => _updateRemovedTasks(removedTasks));
  }

  const _updateAssignedTasks = (tasks, user) => {
    const tasksIds = tasks.map(task => task['@id']);

    return setTaskListItems({
      tasks: tasksIds,
      username: user.username,
      date: selectedDate
    });
  }

  function _maybeRemoveTourTasks(tasks) {
    const taskIdsToRemove = tasks.map(task => task['@id']);

    const toursToUpdate = taskIdsToRemove.reduce((acc, taskId) => {
      const tourId = toursIndexes.tasks[taskId];
      if (tourId) {
        // Initialize with all the indexed tour tasks if not already present
        // and remove the taskId from the tour tasks
        acc[tourId] = (acc[tourId] || toursIndexes.tours[tourId]).filter(tourTaskId => tourTaskId !== taskId);
      }
      return acc;
    }
      , {});

    return Promise.all(
      Object.entries(toursToUpdate).map(([tourUrl, tourTasks]) => setTourItems({ tourUrl, tourTasks }))
    ).then(() => {
      Object.entries(toursToUpdate).forEach(([tourId, tourTasks]) => {
        const tour = toursIndexes.tours[tourId];
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

  const _updateTasks = (tasks, user) => {
    const newUserTasks = tasks.map(task => getAssignedTask(task, user.username));
    dispatch(assignTasksSuccess(newUserTasks));
  }

  const _updateRemovedTasks = (removedTasks) => {
    const unassignedTasks = removedTasks.map(task => getAssignedTask(task));
    dispatch(unassignTaskSuccess(unassignedTasks));
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
