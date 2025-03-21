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
  const [isFirstLoad, setIsFirstLoad] = useState(true)

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
    if (unassignedTasks && taskLists && courierUsers) {
      dispatch(loadUnassignedTasksSuccess(unassignedTasks))
      dispatch(loadTaskListsSuccess(taskLists))
      dispatch(loadUsersSuccess(courierUsers))
    }
  }, [dispatch, unassignedTasks, taskLists, courierUsers]);

  return {
    isError: isErrorTaskLists || isErrorUnassignedTasks || isErrorCourierUsers,
    isFetching: isLoadingTaskLists || isLoadingUnassignedTasks || isLoadingCourierUsers,
    refetch: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
    },
    isFirstLoad,
    setIsFirstLoad,
  };
}
