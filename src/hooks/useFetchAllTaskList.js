import { useEffect, useMemo, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";


export function useFetchAllTaskLists(date, options = {}) {
  const [taskLists, setTaskLists] = useState(null);

  const stableOptions = useMemo(() => JSON.stringify(options), [options])

  const _options = useMemo(() => {
    console.log("AAAAAAAAAA useFetchAllTaskLists useMemo: ", stableOptions);
    return {
      ...JSON.parse(stableOptions),
      enabled: options.enabled && !!date,
      params: {
        date,
      }
    }
  }, [date, stableOptions])

  const {
      data,
      error,
      isLoading,
      refetch: refreshTaskLists
  //} = {data: [], error: null, isLoading: false, refetch: () => {console.log("AAAAAAAAAA useFetchAllTaskLists refetch")}};
  } = useFetchAllRecords('/api/task_lists', 100, _options);

  useEffect(() => {
    console.log("AAAAAAAAAA useFetchAllTaskLists useEffect setTaskLists: ", JSON.stringify(data));
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
