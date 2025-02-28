import { useEffect, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";
import { tasksSort } from "../shared/src/logistics/redux/taskUtils";


export function useFetchAllUnassignedTasks(date, options = null) {
  const dateFormat = 'YYYY-MM-DD';

  const [unassignedTasks, setUnassignedTasks] = useState(null);

  const {
      data,
      error,
      isLoading,
      refetch: refreshUnassignedTasks
  } = useFetchAllRecords('/api/tasks', 100, {
    ...options,
    params: {
      date: date.format(dateFormat),
      assigned: 'no',
    },
  });

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
