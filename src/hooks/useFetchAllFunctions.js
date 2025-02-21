import { useCallback, useEffect } from "react";
import { useFetchAllRecords } from "./useFetchAllRecords";
import { sortByName } from "../redux/util";


export function useFetchAllStores(callback) {
  const {
      data: stores,
      error,
      isLoading,
      refetch: refreshStores
    } = useFetchAllRecords('/api/stores', 100);

  const cb = useCallback(async () => {
    callback(sortByName(stores));
  }, [callback, stores]);

  useEffect(() => {
    cb();
  }, [cb]);

  return {
    stores,
    error,
    isLoading,
    refreshStores
  }
}
