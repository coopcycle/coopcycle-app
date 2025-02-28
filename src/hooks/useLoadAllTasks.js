import { useDispatch } from "react-redux";
import { useEffect } from "react";

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
  useEffect(() => {
    console.log("AAAAAAAAAA useLoadAllTasks", date, JSON.stringify(options));
  }, [date, options]);

  const {
    unassignedTasks,
    error: errorUnassignedTasks,
    isLoading:isLoadingUnassignedTasks,
    refreshTasks
  } = { unassignedTasks: null, error: null, isLoading: false, refreshTasks: () => {console.log("AAAAAAAAAA useLoadAllTasks useFetchAllUnassignedTasks");} };
  //} = useFetchAllUnassignedTasks(date, options);

  const {
    taskLists,
    error: errorTaskLists,
    isLoading: isLoadingTaskLists,
    refreshTaskLists
  } = { taskLists: null, error: null, isLoading: false, refreshTaskLists: () => {console.log("AAAAAAAAAA useLoadAllTasks useFetchAllTaskLists");} };
  //} = useFetchAllTaskLists(date, options);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // TODO: replace this calls to stop using "isFetching" state from uiReducers
  //   if (isLoadingUnassignedTasks) {
  //     loadUnassignedTasksRequest(isLoadingUnassignedTasks);
  //   } else {
  //     loadUnassignedTasksFailure(isLoadingUnassignedTasks);
  //   }
  // }, [isLoadingUnassignedTasks]);

  // useEffect(() => {
  //   // TODO: replace this calls to stop using "isFetching" state from uiReducers
  //   if (isLoadingTaskLists) {
  //     loadTaskListsRequest(isLoadingTaskLists);
  //   } else {
  //     loadTaskListsFailure(isLoadingTaskLists);
  //   }
  // }, [isLoadingTaskLists]);

  // useEffect(() => {
  //   if (unassignedTasks && taskLists) {
  //     dispatch(loadUnassignedTasksSuccess(unassignedTasks));
  //     dispatch(loadTaskListsSuccess(taskLists));
  //   }
  // }, [dispatch, taskLists, unassignedTasks]);

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
  }
}
