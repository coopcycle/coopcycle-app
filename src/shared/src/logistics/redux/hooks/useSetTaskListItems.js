import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from 'react';

import { assignTaskSuccess, unassignTaskSuccess, updateTaskListTasksFailure, updateTaskListTasksRequest, updateTaskListTasksSuccess, updateTaskListsSuccess, updateTourSuccess } from '../../../../../redux/Dispatch/actions';
import { getAssignedTask, getUserTasks, withAssignedLinkedTasks, withUnassignedLinkedTasks } from "../taskUtils";
import { selectAllTasks, selectSelectedDate, selectTaskLists, selectToursTasksIndex } from "../selectors";
import { useSetTaskListsItemsMutation, useSetTourItemsMutation } from "../../../../../redux/api/slice";


export default function useSetTaskListsItems(
  navigation,
) {
  const allTasks = useSelector(selectAllTasks);
  const allTaskLists = useSelector(selectTaskLists);
  const toursIndexes = useSelector(selectToursTasksIndex);
  const selectedDate = useSelector(selectSelectedDate);

  const dispatch = useDispatch();

  const [
    setTaskListsItems,
    {
      isError: isErrorSetTaskListItems,
      isLoading: isLoadingSetTaskListItems,
      isSuccess: isSuccessSetTaskListItems,
    }
  ] = useSetTaskListsItemsMutation();
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
      dispatch(updateTaskListTasksRequest());
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateTaskListTasksSuccess());
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (isError) {
      dispatch(updateTaskListTasksFailure());
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

    return _updateAssignedTasks(allTasksToAssign, user);
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

    return _updateAssignedTasks(allTasksToAssign, user);
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

    return _updateAssignedTasks(allTasksToAssign, user);
  }

  /**
   * Unassign a task and its related tasks to rider
   * @param {Task} task - Task to be unassigned
   * @param {User} user - User of the rider to which we assign
   */
  const unassignTaskWithRelatedTasks = (task, user) => {
    const userTasks = getUserTasks(user.username, allTaskLists);
    const linkedTasks = withAssignedLinkedTasks(task, allTasks);
    const tasksToUnassign = new Set(linkedTasks.map(t => t['@id']));
    const allTasksToAssign = userTasks.filter(userTask => !tasksToUnassign.has(userTask['@id']));

    return _updateAssignedTasks(allTasksToAssign, user).then(() => {
      const unassignedTasks = linkedTasks.map(_task => getAssignedTask(_task));
      unassignedTasks.forEach(unassignedTask => dispatch(unassignTaskSuccess(unassignedTask)));
    });
  }

  const _updateAssignedTasks = (tasks, user) => {
    const tasksIds = tasks.map(task => task['@id']);

    return setTaskListsItems({
        tasks: tasksIds,
        username: user.username,
        date: selectedDate
      })
      .then(res => _maybeRemoveTourTasks(tasksIds).then(_res => res))
      .then(({data: taskList}) => {
        dispatch(updateTaskListsSuccess(taskList));

        const newUserTasks = tasks.map(task => getAssignedTask(task, user.username));
        newUserTasks.forEach(task => dispatch(assignTaskSuccess(task)));
      });
  }

  function _maybeRemoveTourTasks(taskIdsToRemove) {
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
      Object.entries(toursToUpdate).map(([tourUrl, tourTasks]) => setTourItems({tourUrl, tourTasks}))
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
