import { useDispatch } from "react-redux";
import {
  useGetTaskListsQuery,
  useGetUnassignedTasksQuery,
} from "../../redux/api/slice";
import { loadTaskListsSuccess, loadUsersSuccess } from "../../redux/Dispatch/actions";
import { useGetCourierUsersQuery } from '../../redux/api/slice';
import { useEffect } from "react";


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
  } = useGetTaskListsQuery(date);

  const {
    data: courierUsers,
    isError: isErrorCourierUsers,
    isLoading: isLoadingCourierUsers,
  } = useGetCourierUsersQuery();

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
    isLoading: isLoadingTaskLists || isLoadingUnassignedTasks || isLoadingCourierUsers,
    refresh: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
    },
    unassignedTasks,
  };
}
