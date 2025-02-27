import { useEffect, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";
import { sortByName } from "../redux/util";


export function useFetchAllStores(options = null) {
  const [stores, setStores] = useState();

  const {
      data,
      error,
      isLoading,
      refetch: refreshStores
  } = useFetchAllRecords('/api/stores', 100, options);

  useEffect(() => {
    if(data) {
      setStores(sortByName(data))
    }
  }, [data]);

  return {
    stores,
    error,
    isLoading,
    refreshStores
  }
}
