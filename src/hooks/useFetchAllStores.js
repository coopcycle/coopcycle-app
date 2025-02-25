import { useEffect, useState } from "react";

import { useFetchAllRecords } from "./useFetchAllRecords";
import { sortByName } from "../redux/util";


export function useFetchAllStores() {
  const [stores, setStores] = useState();

  const {
      data,
      error,
      isLoading,
      refetch: refreshStores
  } = useFetchAllRecords('/api/stores', 100);

  useEffect(() => {
    setStores(sortByName(data))
  }, [data]);

  return {
    stores,
    error,
    isLoading,
    refreshStores
  }
}
