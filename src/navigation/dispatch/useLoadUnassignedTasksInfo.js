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
  useGetToursQuery
} from "../../redux/api/slice";
import { loadTours } from "../../shared/logistics/redux";


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

  useEffect(() => {
    if (tours) {
      dispatch(loadTours(tours));
    }
  })

  return {
    isError: isErrorTaskLists || isErrorUnassignedTasks || isErrorCourierUsers || isErrorTours,
    isFetching: isLoadingTaskLists || isLoadingUnassignedTasks || isLoadingCourierUsers || isLoadingTours,
    refetch: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
    },
  };
}
