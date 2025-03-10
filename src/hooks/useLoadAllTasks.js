import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  loadTaskListsFailure,
  loadTaskListsRequest,
  loadTaskListsSuccess
} from "../redux/Dispatch/actions";
import { useFetchAllTaskLists } from "./useFetchAllTaskList";


export function useLoadAllTasks(date, options = {}) {
  const dispatch = useDispatch();

  const {
    taskLists,
    error: errorTaskLists,
    isLoading: isLoadingTaskLists,
    refreshTaskLists,
  } = useFetchAllTaskLists(date, options);


  useEffect(() => {
    console.log("AAAAAAAAAA useLoadAllTasks useEffect isLoadingTaskLists: ", isLoadingTaskLists);
    if (isLoadingTaskLists) {
      dispatch(loadTaskListsRequest());
    } else {
      dispatch(loadTaskListsFailure());
    }
  }, [isLoadingTaskLists, dispatch]);

  useEffect(() => {
    console.log("AAAAAAAAAA useLoadAllTasks useEffect dispatchhhhhhhh: ", taskLists);
    if (taskLists) {
      dispatch(loadTaskListsSuccess(taskLists));
    }
  }, [dispatch, taskLists]);

  return {
    error: errorTaskLists,
    isLoading: isLoadingTaskLists,
    refresh: () => {
      console.log("AAAAAAAAAA useLoadAllTasks refreshhhh");
      refreshTaskLists();
    },
    refreshTaskLists,
  };
}
