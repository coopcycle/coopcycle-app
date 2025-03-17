import { useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  loadTaskListsSuccess,
  loadUnassignedTasksSuccess,
  loadUsersSuccess,
} from "../../redux/Dispatch/actions";
import { useGetCourierUsersQuery } from '../../redux/api/slice';
import {
  useGetTaskListsV2Query,
  useGetUnassignedTasksQuery,
} from "../../redux/api/slice";


export function useLoadUnassignedTasksInfo(date) {

  const dispatch = useDispatch();

  const {
    data: unassignedTasks,
    isError: isErrorUnassignedTasks,
    isLoading: isLoadingUnassignedTasks,
    refetch: refetchUnassignedTasks,
  } = useGetUnassignedTasksQuery(date);

  const {
    data: taskLists,
    isError: isErrorTaskLists,
    isLoading: isLoadingTaskLists,
    refetch: refetchTaskLists,
  } = useGetTaskListsV2Query(date);

  const {
    data: courierUsers,
    isError: isErrorCourierUsers,
    isLoading: isLoadingCourierUsers,
  } = useGetCourierUsersQuery();

  useEffect(() => {
    if (unassignedTasks) {
      dispatch(loadUnassignedTasksSuccess(unassignedTasks))
    }
  }, [dispatch, unassignedTasks]);

  useEffect(() => {
    if (taskLists) {
      dispatch(loadTaskListsSuccess(taskLists))
    }
  }, [dispatch, taskLists]);

  useEffect(() => {
    if (courierUsers) {
      dispatch(loadUsersSuccess(courierUsers))
    }
  }, [courierUsers, dispatch]);

  return {
    isError: isErrorTaskLists || isErrorUnassignedTasks || isErrorCourierUsers,
    isFetching: isLoadingTaskLists || isLoadingUnassignedTasks || isLoadingCourierUsers,
    refetch: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
    },
  };
}
