import {
  useGetTaskListsV2Query,
  useGetUnassignedTasksQuery,
} from "../redux/api/slice";


export function useLoadAllTasks(date) {
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

  return {
    isError: isErrorTaskLists || isErrorUnassignedTasks,
    isLoading: isLoadingTaskLists || isLoadingUnassignedTasks,
    refresh: () => {
      refetchUnassignedTasks();
      refetchTaskLists();
    },
    unassignedTasks,
    taskLists,
  };
}
