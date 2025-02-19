import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { fetchAllRecords } from "../redux/util";


export function useFetchAllRecords(url, itemsPerPage) {
  const httpClient = useSelector(state => state.app.httpClient);

  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const fetchData = async () => {
      fetchAllRecords(httpClient, url, itemsPerPage)
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false));
    }

    setIsLoading(true);
    fetchData();
  }, [httpClient, itemsPerPage, url])

  return {
    data,
    error,
    isLoading,
  }
}
