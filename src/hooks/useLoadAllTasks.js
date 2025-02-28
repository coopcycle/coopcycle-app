import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { useFetchAllUnassignedTasks } from "./useFetchAllUnassignedTasks";
import { loadTaskListsSuccess, loadUnassignedTasksSuccess } from "../redux/Dispatch/actions";
import { useFetchAllTaskLists } from "./useFetchAllTaskList";


export function useLoadAllTasks(date) {
  const {
    unassignedTasks,
    error: errorUnassignedTasks,
    isLoading:isLoadingUnassignedTasks,
    refreshTasks
  } = useFetchAllUnassignedTasks(date, { enabled: true })

  const {
    taskLists,
    error: errorTaskLists,
    isLoading: isLoadingTaskLists,
    refreshTaskLists
  } = useFetchAllTaskLists(date, { enabled: true })

  const dispatch = useDispatch();

  useEffect(() => {
    if (unassignedTasks && taskLists) {
      dispatch(loadUnassignedTasksSuccess(unassignedTasks));
      dispatch(loadTaskListsSuccess(taskLists));
    }
  }, [dispatch, taskLists, unassignedTasks]);

  return {
    error: errorUnassignedTasks || errorTaskLists,
    isLoading: isLoadingUnassignedTasks || isLoadingTaskLists,
    refresh:  () => {
      refreshTasks();
      refreshTaskLists();
    },
  }
}