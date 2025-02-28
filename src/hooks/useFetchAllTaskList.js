import { useEffect, useMemo, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";


export function useFetchAllTaskLists(date, options = {}) {
  const dateFormat = 'YYYY-MM-DD';

  const [taskLists, setTaskLists] = useState(null);

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
      refetch: refreshTaskLists
  } = {data: null, error: null, isLoading: false, refetch: () => {console.log("AAAAAAAAAA useFetchAllTaskLists")}};
  //} = useFetchAllRecords('/api/task_lists', 100, _options);

  useEffect(() => {
    console.log("AAAAAAAAAA setTaskLists");
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
