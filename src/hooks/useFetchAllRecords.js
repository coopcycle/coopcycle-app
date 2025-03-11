import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { fetchAllRecordsUsingHttpClient } from "../redux/util";


export function useFetchAllRecords(url, itemsPerPage, options = {}) {
  const httpClient = useSelector(state => state.app.httpClient);

  const [data, setData] = useState();
  const [error, setError] = useState();
  const [force, setForce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(() => {
    if(options.enabled || force) {
      setIsLoading(true);
      fetchAllRecordsUsingHttpClient(
        httpClient,
        url,
        itemsPerPage,
        options.params
      )
      .then(setData)
      .catch(setError)
      .finally(() => {
        setIsLoading(false);
        setForce(false);
      });
    }
  }, [force, httpClient, itemsPerPage, options, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: () => setForce(true),
  }
}
