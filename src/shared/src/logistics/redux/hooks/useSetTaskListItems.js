import { useSelector } from "react-redux";

import { useSetTaskListsItemsMutation, useSetTourItemsMutation } from "../../../../../redux/api/slice";
import { getUserTasks, withUnassignedLinkedTasks } from "../taskUtils";
import { selectAllTasks, selectSelectedDate, selectTaskLists, selectToursTasksIndex } from "../selectors";


export default function useSetTaskListsItems(
  navigation,
) {
  const allTasks = useSelector(selectAllTasks);
  const allTaskLists = useSelector(selectTaskLists);
  const toursIndexes = useSelector(selectToursTasksIndex);
  const selectedDate = useSelector(selectSelectedDate);

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


  // const _assignTask = (task, user) => {
  //   navigation.navigate('DispatchUnassignedTasks');
  //   const existingTaskIds = getTasksForUser(user.username, allTaskLists)
  //   const taskIdsToAssign = withUnassignedLinkedTasks(task, allTasks)
  //     .map(item => item['@id']);
  //   const allTaskIds = [...existingTaskIds, ...taskIdsToAssign];
  //   setTaskListsItems({
  //     tasks: allTaskIds,
  //     username: user.username,
  //     date: selectedDate
  //   })
  // }

  const assignTask = (task, user, callback = () => {}) => {
    const userTasks = getUserTasks(user.username, allTaskLists);
    const allTasksToAssign = [...userTasks, task];

    return updateAssignedTasks(allTasksToAssign, user, callback);
  }

  const assignTaskWithRelatedTasks = (task, user, callback = () => {}) => {
    const userTasks = getUserTasks(user.username, allTaskLists);
    const linkedTasks = withUnassignedLinkedTasks(task, allTasks);
    const allTasksToAssign = [...userTasks, ...linkedTasks];

    return updateAssignedTasks(allTasksToAssign, user, callback);
  }

  const unassignTask = (task, user, callback = () => {}) => {
    const userTasks = getUserTasks(user.username, allTaskLists);
    const allTasksToAssign = userTasks.filter(userTask => userTask['@id'] !== task['@id']);

    return updateAssignedTasks(allTasksToAssign, user, callback);
  }

  const updateAssignedTasks = (tasks, user, callback = () => {}) => {
    const tasksIds = tasks.map(item => item['@id']);

    return setTaskListsItems({
        tasks: tasksIds,
        username: user.username,
        date: selectedDate
      })
      .then(() => maybeRemoveTourTasks(tasksIds))
      .finally(() => callback());
  }

  function maybeRemoveTourTasks(taskIdsToRemove) {
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
    );
  }

  return {
    assignTask,
    assignTaskWithRelatedTasks,
    unassignTask,
  };
}
