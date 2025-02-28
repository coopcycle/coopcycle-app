import { useEffect, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";
import { tasksSort } from "../shared/src/logistics/redux/taskUtils";


export function useFetchAllUnassignedTasks(date, options = null) {
  const [unassignedTasks, setUnassignedTasks] = useState(null);

  const {
      data,
      error,
      isLoading,
      refetch: refreshUnassignedTasks
  } = useFetchAllRecords(`/api/tasks?date=${date.format('YYYY-MM-DD')}&assigned=no`, 100, options);

  useEffect(() => {
    if(data) {
      setUnassignedTasks(data.sort(tasksSort))
    }
  }, [data]);

  return {
    unassignedTasks,
    error,
    isLoading,
    refreshUnassignedTasks
  }
}
