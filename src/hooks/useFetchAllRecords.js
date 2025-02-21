import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { fetchAllRecords } from "../redux/util";


export function useFetchAllRecords(url, itemsPerPage) {
  const httpClient = useSelector(state => state.app.httpClient);

  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetchAllRecords(httpClient, url, itemsPerPage)
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false));
  }, [httpClient, itemsPerPage, url]);

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
