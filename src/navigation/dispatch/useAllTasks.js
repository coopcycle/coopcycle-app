import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import {
  loadTaskListsSuccess,
  loadUnassignedTasksSuccess,
  loadUsersSuccess,
} from "../../redux/Dispatch/actions";
import {
  useGetCourierUsersQuery,
  useGetTaskListsQuery,
  useGetUnassignedTasksQuery,
} from "../../redux/api/slice";


export function useAllTasks(date) {

  const dispatch = useDispatch();

  const {
    data: unassignedTasks,
    isError: isErrorUnassignedTasks,
    isLoading: isLoadingUnassignedTasks,
    isFetching: isFetchingUnassignedTasks,
    refetch: refetchUnassignedTasks
  } = useGetUnassignedTasksQuery(date);

  const {
    data: taskLists,
    isError: isErrorTaskLists,
    isLoading: isLoadingTaskLists,
    isFetching: isFetchingTaskLists,
    refetch: refetchTaskLists
  } = useGetTaskListsQuery(date);

  const {
    data: courierUsers,
    isError: isErrorCourierUsers,
    isLoading: isLoadingCourierUsers,
    isFetching: isFetchingCourierUsers
  } = useGetCourierUsersQuery();

  useEffect(() => {
    if (unassignedTasks && taskLists && courierUsers) {
      dispatch(loadUnassignedTasksSuccess(unassignedTasks));
      dispatch(loadTaskListsSuccess(taskLists));
      dispatch(loadUsersSuccess(courierUsers));
    }
  }, [dispatch, unassignedTasks, taskLists, courierUsers]);

  return {
    isError: isErrorTaskLists || isErrorUnassignedTasks || isErrorCourierUsers,
    isLoading: isLoadingTaskLists || isLoadingUnassignedTasks || isLoadingCourierUsers,
    isFetching: isFetchingUnassignedTasks || isFetchingTaskLists || isFetchingCourierUsers,
    refetch: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
      // Add refetchCourierUsers when needed..!
    }
  };
}
