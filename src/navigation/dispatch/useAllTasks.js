import { useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import {
  loadTaskListsFailure,
  loadTaskListsSuccess,
  loadUnassignedTasksFailure,
  loadUnassignedTasksSuccess,
  loadUsersFailure,
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

  const isError = useMemo(() => {
    return isErrorTaskLists || isErrorUnassignedTasks || isErrorCourierUsers;
  }, [isErrorTaskLists, isErrorUnassignedTasks, isErrorCourierUsers]);

  const isLoading = useMemo(() => {
    return isLoadingTaskLists || isLoadingUnassignedTasks || isLoadingCourierUsers;
  }, [isLoadingTaskLists, isLoadingUnassignedTasks, isLoadingCourierUsers]);

  const isFetching = useMemo(() => {
    return isFetchingUnassignedTasks || isFetchingTaskLists || isFetchingCourierUsers;
  }, [isFetchingUnassignedTasks, isFetchingTaskLists, isFetchingCourierUsers]);

  useEffect(() => {
    if (!isFetching && !isError && unassignedTasks && taskLists && courierUsers) {
      dispatch(loadUnassignedTasksSuccess(unassignedTasks));
      dispatch(loadTaskListsSuccess(taskLists));
      dispatch(loadUsersSuccess(courierUsers));
    }
  }, [dispatch, unassignedTasks, taskLists, courierUsers, isFetching, isError]);

  useEffect(() => {
    if(isError) {
      dispatch(loadUnassignedTasksFailure());
      dispatch(loadTaskListsFailure());
      dispatch(loadUsersFailure());
    }
  }, [dispatch, isError]);

  return {
    isError,
    isLoading,
    isFetching,
    refetch: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
      // Add refetchCourierUsers when needed..!
    }
  };
}
