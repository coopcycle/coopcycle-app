import { useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";

import {
  loadTaskListsFailure,
  loadTaskListsRequest,
  loadTaskListsSuccess,
  loadUnassignedTasksFailure,
  loadUnassignedTasksRequest,
  loadUnassignedTasksSuccess,
} from "../redux/Dispatch/actions";
import { useFetchAllTaskLists } from "./useFetchAllTaskList";
import { useFetchAllUnassignedTasks } from "./useFetchAllUnassignedTasks";

export function useLoadAllTasks(date, options = {}) {
  const dispatch = useDispatch();

  // Convert date to a string to avoid infinite loop
  const memoizedDate = useMemo(() => date.format("YYYY-MM-DD"), [date]);

  const {
    unassignedTasks,
    error: errorUnassignedTasks,
    isLoading: isLoadingUnassignedTasks,
    refreshTasks,
  } = useFetchAllUnassignedTasks(memoizedDate, options);

  const {
    taskLists,
    error: errorTaskLists,
    isLoading: isLoadingTaskLists,
    refreshTaskLists,
  } = useFetchAllTaskLists(memoizedDate, options);

  useEffect(() => {
    console.log("AAAAAAAAAA useLoadAllTasks useEffect isLoadingUnassignedTasks: ", isLoadingUnassignedTasks);
    if (isLoadingUnassignedTasks) {
      dispatch(loadUnassignedTasksRequest());
    } else {
      dispatch(loadUnassignedTasksFailure());
    }
  }, [isLoadingUnassignedTasks, dispatch]);

  useEffect(() => {
    console.log("AAAAAAAAAA useLoadAllTasks useEffect isLoadingTaskLists: ", isLoadingTaskLists);
    if (isLoadingTaskLists) {
      dispatch(loadTaskListsRequest());
    } else {
      dispatch(loadTaskListsFailure());
    }
  }, [isLoadingTaskLists, dispatch]);

  useEffect(() => {
    console.log("AAAAAAAAAA useLoadAllTasks useEffect dispatchhhhhhhh: ", unassignedTasks, taskLists);
    if (unassignedTasks && taskLists) {
      dispatch(loadUnassignedTasksSuccess(unassignedTasks));
      dispatch(loadTaskListsSuccess(taskLists));
    }
  }, [dispatch, taskLists, unassignedTasks]);

  return {
    error: errorUnassignedTasks || errorTaskLists,
    isLoading: isLoadingUnassignedTasks || isLoadingTaskLists,
    refresh: () => {
      console.log("AAAAAAAAAA useLoadAllTasks refreshhhh");
      refreshTasks();
      refreshTaskLists();
    },
    refreshTasks,
    refreshTaskLists,
  };
}
