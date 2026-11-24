import { HttpClient } from '../../API';
import { HydraCollection } from './types';
import {
  BaseQueryFn,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query';

/**
 * similar function exists in the web codebase
 */
export async function fetchAllRecordsUsingFetchWithBQ<T>(
  fetchWithBQ: (arg: Parameters<BaseQueryFn>[0]) => ReturnType<BaseQueryFn>,
  url: string,
  itemsPerPage: number,
  otherParams: Record<string, string> | null = null,
): Promise<
  QueryReturnValue<T[], FetchBaseQueryError, FetchBaseQueryMeta | undefined>
> {
  const fetch = async (
    page: number,
  ): Promise<
    QueryReturnValue<
      HydraCollection<T>,
      FetchBaseQueryError,
      FetchBaseQueryMeta | undefined
    >
  > => {
    const params = new URLSearchParams({
      pagination: 'true',
      page: page.toString(),
      itemsPerPage: itemsPerPage.toString(),
      ...otherParams,
    });

    try {
      const result = await fetchWithBQ(`${url}?${params.toString()}`);
      if (result.error) {
        // @ts-expect-error: TS2322: Type {} is not assignable to type FetchBaseQueryError | undefined
        return { error: result.error };
      }

      // @ts-expect-error: TS2322: Type unknown is not assignable to type HydraCollection<T> | undefined
      return { data: result.data };
    } catch (err) {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          data: err,
          error: 'fetch failed',
        },
      };
    }
  };

  const firstPageResult = await fetch(1);
  if (firstPageResult.error) {
    return { error: firstPageResult.error };
  }

  const firstPageData = firstPageResult.data;
  if (
    !firstPageData ||
    !firstPageData['hydra:totalItems'] ||
    firstPageData['hydra:totalItems'] <= firstPageData['hydra:member'].length
  ) {
    // Total items were already returned in the 1st request!
    return {
      data: firstPageData?.['hydra:member'] || [],
    };
  }

  // OK more pages are needed to be fetched to get all items..!
  const totalItems = firstPageData['hydra:totalItems'];
  const maxPage =
    Math.trunc(totalItems / itemsPerPage) +
    (totalItems % itemsPerPage === 0 ? 0 : 1);

  return Promise.all(
    [...Array(maxPage + 1).keys()].slice(2).map(page => fetch(page)),
  )
    .then(results => {
      // Check if any page has an error
      const errorResult = results.find(result => result.error);
      if (errorResult && errorResult.error) {
        return { error: errorResult.error };
      }

      // Combine all data from successful results
      const combinedData = results.reduce(
        (acc, result) => acc.concat(result.data?.['hydra:member'] || []),
        firstPageData['hydra:member'],
      );

      return { data: combinedData };
    })
    .catch((error: unknown) => {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          data: error,
          error: 'promise.all failed',
        },
      };
    });
}

/**
 * The same walk as above, for the screens still on the legacy http client.
 *
 * `GET /api/restaurants` paginates since it gained its filters, so taking
 * `hydra:member` out of the first response would silently drop every record
 * past the first page.
 */
export async function fetchAllRecordsUsingHttpClient<T>(
  httpClient: HttpClient,
  url: string,
  itemsPerPage: number,
  otherParams: Record<string, string> = {},
): Promise<T[]> {
  const fetchPage = (page: number): Promise<HydraCollection<T>> => {
    const params = new URLSearchParams({
      ...otherParams,
      pagination: 'true',
      page: page.toString(),
      itemsPerPage: itemsPerPage.toString(),
    });

    return httpClient.get(`${url}?${params.toString()}`, { anonymous: true });
  };

  const first = await fetchPage(1);
  const records = first['hydra:member'] ?? [];
  const totalItems = first['hydra:totalItems'] ?? records.length;

  if (records.length >= totalItems) {
    return records;
  }

  const pages = Math.ceil(totalItems / itemsPerPage);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => fetchPage(index + 2)),
  );

  return rest.reduce(
    (acc: T[], page) => acc.concat(page['hydra:member'] ?? []),
    records,
  );
}
