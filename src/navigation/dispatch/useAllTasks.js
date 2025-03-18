import { useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";

import {
  loadTaskListsSuccess,
  loadTasksSuccess,
  loadUsersSuccess,
} from "../../redux/Dispatch/actions";
import { useGetCourierUsersQuery } from '../../redux/api/slice';
import {
  useGetTaskListsV2Query,
  useGetTasksQuery,
  useGetToursQuery,
} from "../../redux/api/slice";
import { loadTours } from "../../shared/logistics/redux";


export function useAllTasks(date) {

  const dispatch = useDispatch();

  const {
    data: tasks,
    isError: isErrorTasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTasksQuery(date);

  const {
    data: taskLists,
    isError: isErrorTaskLists,
    isLoading: isLoadingTaskLists,
    refetch: refetchTaskLists,
  } = useGetTaskListsV2Query(date);

  const {
    data: tours,
    isError: isErrorTours,
    isLoading: isLoadingTours,
    refetch: refetchTours,
  } = useGetToursQuery(date);

  const {
    data: courierUsers,
    isError: isErrorCourierUsers,
    isLoading: isLoadingCourierUsers,
  } = useGetCourierUsersQuery();

  useEffect(() => {
    console.log("trying to update")
    if (tasks && taskLists && tours) {
      console.log("updating")
      dispatch(loadTaskListsSuccess(taskLists))
      dispatch(loadTours(tours));
      dispatch(loadTasksSuccess(tasks))
    }
  }, [dispatch, taskLists, tasks, tours]);

  useEffect(() => {
    if (courierUsers) {
      dispatch(loadUsersSuccess(courierUsers))
    }
  }, [courierUsers, dispatch]);

  const isError = useMemo(() => {
    return isErrorCourierUsers || isErrorTaskLists || isErrorTours || isErrorTasks;
  }, [isErrorCourierUsers, isErrorTaskLists, isErrorTours, isErrorTasks])

  const isFetching = useMemo(() => {
    return isLoadingCourierUsers || isLoadingTaskLists || isLoadingTours || isLoadingTasks;
  }, [isLoadingCourierUsers, isLoadingTaskLists, isLoadingTours, isLoadingTasks])

  return {
    isError,
    isFetching,
    refetch: () => {
      refetchTaskLists();
      refetchTours();
      refetchTasks();
    },
  };
}
