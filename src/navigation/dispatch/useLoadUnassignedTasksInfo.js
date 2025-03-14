import { useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  loadTaskListsSuccess,
  loadUnassignedTasksSuccess,
  loadUsersSuccess,
} from "../../redux/Dispatch/actions";
import { useGetCourierUsersQuery } from '../../redux/api/slice';
import {
  useGetTaskListsQuery,
  useGetUnassignedTasksQuery,
} from "../../redux/api/slice";


export function useLoadUnassignedTasksInfo(date) {

  const dispatch = useDispatch();

  const {
    data: unassignedTasks,
    isError: isErrorUnassignedTasks,
    isFetching: isFetchingUnassignedTasks,
    refetch: refetchUnassignedTasks,
  } = useGetUnassignedTasksQuery(date);

  const {
    data: taskLists,
    isError: isErrorTaskLists,
    isFetching: isFetchingTaskLists,
    refetch: refetchTaskLists,
  } = useGetTaskListsQuery(date);

  const {
    data: courierUsers,
    isError: isErrorCourierUsers,
    isFetching: isFetchingCourierUsers,
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
    isFetching: isFetchingTaskLists || isErrorUnassignedTasks || isFetchingCourierUsers,
    refetch: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
    },
  };
}
