import { useEffect, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";


export function useFetchAllTaskLists(date, options = null) {
  const dateFormat = 'YYYY-MM-DD';

  const [taskLists, setTaskLists] = useState(null);

  const {
      data,
      error,
      isLoading,
      refetch: refreshTaskLists
  } = useFetchAllRecords(`/api/task_lists?date=${date.format(dateFormat)}`, 100, options);

  useEffect(() => {
    if(data) {
      setTaskLists(data);
    }
  }, [data]);

  return {
    taskLists,
    error,
    isLoading,
    refreshTaskLists
  }
}
