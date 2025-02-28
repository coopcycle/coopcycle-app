import { useEffect, useMemo, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";
import { tasksSort } from "../shared/src/logistics/redux/taskUtils";


export function useFetchAllUnassignedTasks(date, options = {}) {
  const dateFormat = 'YYYY-MM-DD';

  const [unassignedTasks, setUnassignedTasks] = useState(null);

  const _options = useMemo(() => {
    return {
      ...options,
      enabled: options.enabled && date,
      params: {
        date: date.format(dateFormat),
      }
    }
  }, [date, options])

  const {
      data,
      error,
      isLoading,
      refetch: refreshUnassignedTasks
  } = {data: null, error: null, isLoading: false, refetch: () => {console.log("AAAAAAAAAA useFetchAllUnassignedTasks")}};
  //} = useFetchAllRecords('/api/tasks', 100, _options);

  useEffect(() => {
    console.log("AAAAAAAAAA setUnassignedTasks");
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
