import { useEffect, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";


export function useFetchAllTasks(date, options = null) {
  const [tasks, setTasks] = useState();

  const {
      data,
      error,
      isLoading,
      refetch: refreshTasks
  } = useFetchAllRecords(`/api/tasks?date=${date.format('YYYY-MM-DD')}&assigned=no`, 100, options);

  useEffect(() => {
    if(data) {
      setTasks(data)
    }
  }, [data]);

  return {
    tasks,
    error,
    isLoading,
    refreshTasks
  }
}
