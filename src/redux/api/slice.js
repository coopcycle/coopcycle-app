import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './baseQuery';
import { fetchAllRecordsUsingFetchWithBQ, sortByName, sortByString } from '../util';


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
    getUnassignedTasks: builder.query({
      async queryFn(date, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/tasks',
          100,
          {
            date: date.format('YYYY-MM-DD'),
            assigned: 'no'
          });

        return result ? { data: result } : { error: "result.error" };
      }
    }),
    getTaskLists: builder.query({
      async queryFn(date, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/task_lists',
          100,
          {
            date: date.format('YYYY-MM-DD'),
          });

        return result ? { data: result } : { error: "result.error" };
      },
    }),
    getCourierUsers: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          '/api/users',
          100,
          {
            'roles[]': 'ROLE_COURIER'
          }
        );

        if (!result) {
          return { error: "result.error" }
        }
        return { data:  sortByString(result, 'username') };
      },
    }),
    getStores: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          '/api/stores',
          100,
        );

        if(!result) {
          return { error: "result.error"}
        }

        return { data: sortByName(result)}
      }
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
  useGetTaskListsQuery,
  useGetUnassignedTasksQuery,
  useSubscriptionGenerateOrdersMutation,
  useUpdateOrderMutation,
  useGetStoresQuery
} = apiSlice;
