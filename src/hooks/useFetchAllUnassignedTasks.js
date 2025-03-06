import { useEffect, useMemo, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";
import { tasksSort } from "../shared/src/logistics/redux/taskUtils";


export function useFetchAllUnassignedTasks(date, options = {}) {
  const [unassignedTasks, setUnassignedTasks] = useState(null);

  const stableOptions = useMemo(() => JSON.stringify(options), [options])

  const _options = useMemo(() => {
    console.log("AAAAAAAAAA useFetchAllUnassignedTasks useMemo: stableOptions ", stableOptions);
    return {
      ...JSON.parse(stableOptions),
      enabled: options.enabled && !!date,
      params: {
        date,
        assigned: "no"
      }
    }
  }, [date, stableOptions])

  const {
      data,
      error,
      isLoading,
      refetch: refreshUnassignedTasks
  //} = {data: [], error: null, isLoading: false, refetch: () => {console.log("AAAAAAAAAA useFetchAllUnassignedTasks refetch")}};
  } = useFetchAllRecords('/api/tasks', 100, _options);

  useEffect(() => {
    console.log("AAAAAAAAAA useFetchAllUnassignedTasks useEffect setUnassignedTasks: ", JSON.stringify(data));
    console.log("AAAAAAAAAA useFetchAllUnassignedTasks error: ", error);
    if(data) {
      setUnassignedTasks(data.sort(tasksSort))
    }
  }, [data, error]);

  return {
    unassignedTasks,
    error,
    isLoading,
    refreshUnassignedTasks
  }
}