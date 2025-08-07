import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './baseQuery';
import { sortByName, sortByString } from '../util';
import { fetchAllRecordsUsingFetchWithBQ } from './utils';

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // The "endpoints" represent operations and requests for this server
  // nodeId is passed in JSON-LD '@id' key, https://www.w3.org/TR/2014/REC-json-ld-20140116/#node-identifiers
  endpoints: builder => ({
    subscriptionGenerateOrders: builder.mutation({
      query: date => ({
        url: 'api/recurrence_rules/generate_orders',
        params: {
          date: date.format('YYYY-MM-DD'),
        },
        method: 'POST',
        body: {},
      }),
    }),
    getTasks: builder.query({
      async queryFn(date, _queryApi, _extraOptions, fetchWithBQ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/tasks',
          100,
          {
            date: date.format('YYYY-MM-DD'),
          },
        );
      },
    }),
    getTaskLists: builder.query({
      async queryFn(date, _queryApi, _extraOptions, fetchWithBQ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/task_lists',
          100,
          {
            date: date.format('YYYY-MM-DD'),
          },
        );
      },
    }),
    getTaskListsV2: builder.query({
      async queryFn(date, _queryApi, _extraOptions, fetchWithBQ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/task_lists/v2',
          100,
          {
            date: date.format('YYYY-MM-DD'),
          },
        );
      },
    }),
    setTaskListItems: builder.mutation({
      query: ({ items, username, date }) => {
        const mutation = {
          url: `/api/task_lists/set_items/${date.format(
            'YYYY-MM-DD',
          )}/${username}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify({ items }),
        };

        return mutation;
      },
    }),
    setTourItems: builder.mutation({
      query: ({ tourUrl, tourTasks }) => {
        const mutation = {
          url: tourUrl,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify({ tasks: tourTasks }),
        };

        return mutation;
      },
    }),
    getTours: builder.query({
      async queryFn(date, _queryApi, _extraOptions, fetchWithBQ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/tours',
          100,
          {
            date: date.format('YYYY-MM-DD'),
          },
        );
      },
    }),
    getCourierUsers: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          '/api/users',
          100,
          {
            'roles[]': 'ROLE_COURIER',
          },
        );

        if (result.error) {
          return result;
        }
        return { data: sortByString(result.data, 'username') };
      },
    }),
    getStores: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          '/api/stores',
          100,
        );

        if (result.error) {
          return result;
        }
        return { data: sortByName(result.data) };
      },
    }),
    getMyTasks: builder.query({
      query: date => `api/me/tasks/${date.format('YYYY-MM-DD')}`,
    }),
    getOrderTiming: builder.query({
      query: nodeId => `${nodeId}/timing`,
    }),
    getOrderValidate: builder.query({
      query: nodeId => `${nodeId}/validate`,
    }),
    updateOrder: builder.mutation({
      query: ({ nodeId, ...patch }) => ({
        url: nodeId,
        method: 'PUT',
        body: patch,
      }),
    }),
  }),
});

// Export the auto-generated hook for the query endpoints
export const {
  useGetCourierUsersQuery,
  useGetMyTasksQuery,
  useGetOrderTimingQuery,
  useGetStoresQuery,
  useGetTaskListsQuery,
  useGetTaskListsV2Query,
  useGetTasksQuery,
  useGetToursQuery,
  useSetTourItemsMutation,
  useSetTaskListItemsMutation,
  useSubscriptionGenerateOrdersMutation,
  useUpdateOrderMutation,
} = apiSlice;
