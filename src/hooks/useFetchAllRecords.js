import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { fetchAllRecords } from "../redux/util";


export function useFetchAllRecords(url, itemsPerPage, options = null) {
  const httpClient = useSelector(state => state.app.httpClient);

  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(() => {
    if(options?.enabled) {
      setIsLoading(true);
      fetchAllRecords(httpClient, url, itemsPerPage)
          .then(setData)
          .catch(setError)
          .finally(() => setIsLoading(false));
    }
  }, [httpClient, itemsPerPage, options?.enabled, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData
  }
}
