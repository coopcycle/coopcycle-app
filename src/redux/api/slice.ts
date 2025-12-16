import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './baseQuery';
import { sortByName, sortByString } from '../util';
import { fetchAllRecordsUsingFetchWithBQ } from './utils';
import { DateOnlyString } from '../../utils/date-types';
import {
  Address,
  PricingRuleSet,
  PutDeliveryBody,
  Store,
  StorePackage,
  StoreTimeSlot,
  TimeSlot,
  TimeSlotChoices,
  Uri,
} from './types';

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // The "endpoints" represent operations and requests for this server
  // nodeId is passed in JSON-LD '@id' key, https://www.w3.org/TR/2014/REC-json-ld-20140116/#node-identifiers
  endpoints: builder => ({
    subscriptionGenerateOrders: builder.mutation({
      query: (date: DateOnlyString) => ({
        url: 'api/recurrence_rules/generate_orders',
        params: {
          date: date,
        },
        method: 'POST',
        body: {},
      }),
    }),
    getTasks: builder.query({
      async queryFn(
        date: DateOnlyString,
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/tasks',
          100,
          {
            date: date,
          },
        );
      },
    }),
    getTaskLists: builder.query({
      async queryFn(
        date: DateOnlyString,
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/task_lists',
          100,
          {
            date: date,
          },
        );
      },
    }),
    getTaskListsV2: builder.query({
      async queryFn(
        date: DateOnlyString,
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/task_lists/v2',
          100,
          {
            date: date,
          },
        );
      },
    }),
    setTaskListItems: builder.mutation({
      query: ({
        items,
        username,
        date,
      }: {
        items: string[];
        username: string;
        date: DateOnlyString;
      }) => {
        const mutation = {
          url: `/api/task_lists/set_items/${date}/${username}`,
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
      async queryFn(
        date: DateOnlyString,
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        return await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          'api/tours',
          100,
          {
            date: date,
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
    getStores: builder.query<Store[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ<Store>(
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
    getTimeSlots: builder.query<TimeSlot[], void>({
      queryFn: async (args, queryApi, extraOptions, baseQuery) => {
        return await fetchAllRecordsUsingFetchWithBQ(
          baseQuery,
          'api/time_slots',
          100,
        );
      },
    }),
    getTimeSlotChoices: builder.query<TimeSlotChoices, string>({
      query: (uri: string) => `${uri}/choices`,
    }),
    getStore: builder.query<Store, Uri>({
      query: (uri: Uri) => uri,
    }),
    getStoreAddresses: builder.query<Address[], string>({
      queryFn: async (args, queryApi, extraOptions, baseQuery) => {
        return await fetchAllRecordsUsingFetchWithBQ<Address>(
          baseQuery,
          `${args}/addresses`,
          100,
        );
      },
    }),
    getStoreTimeSlots: builder.query<StoreTimeSlot[], string>({
      queryFn: async (args, queryApi, extraOptions, baseQuery) => {
        return await fetchAllRecordsUsingFetchWithBQ<StoreTimeSlot>(
          baseQuery,
          `${args}/time_slots`,
          100,
        );
      },
    }),
    getStorePackages: builder.query<StorePackage[], string>({
      queryFn: async (args, queryApi, extraOptions, baseQuery) => {
        return await fetchAllRecordsUsingFetchWithBQ<StorePackage>(
          baseQuery,
          `${args}/packages`,
          100,
        );
      },
    }),
    getPricingRuleSet: builder.query<PricingRuleSet, Uri>({
      query: (uri: string) => uri,
    }),
    getRestaurants: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          '/api/restaurants',
          100,
        );

        if (result.error) {
          return result;
        }
        return { data: sortByName(result.data) };
      },
    }),
    getTags: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ(
          fetchWithBQ,
          '/api/tags',
          100,
        );
        if (result.error) {
          return result;
        }
        return { data: sortByName(result.data) };
      },
    }),
    getMyTasks: builder.query({
      query: (date: DateOnlyString) => `api/me/tasks/${date}`,
    }),
    getTaskContext: builder.query({
      query: id => `api/tasks/${id}/context`,
    }),
    getTaskDeliveryFormData: builder.query<PutDeliveryBody, number>({
      query: id => `api/tasks/${id}/delivery_form_data`,
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
    postIncident: builder.mutation({
      query: ({ payload }) => {
        return {
          url: `/api/incidents`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/ld+json',
            Accept: 'application/ld+json',
          },
          body: JSON.stringify(payload),
        };
      },
    }),
    recurrenceRulesGenerateOrders: builder.mutation({
      query: (date: DateOnlyString) => ({
        url: 'api/recurrence_rules/generate_orders',
        params: {
          date,
        },
      }),
    }),
  }),
});

// Export the auto-generated hook for the query endpoints
export const {
  useGetCourierUsersQuery,
  useGetMyTasksQuery,
  useGetTaskContextQuery,
  useGetTaskDeliveryFormDataQuery,
  useGetOrderTimingQuery,
  useGetStoresQuery,
  useGetTimeSlotsQuery,
  useGetTimeSlotChoicesQuery,
  useGetStoreQuery,
  useGetStoreAddressesQuery,
  useGetStoreTimeSlotsQuery,
  useGetStorePackagesQuery,
  useGetPricingRuleSetQuery,
  useGetTagsQuery,
  useGetRestaurantsQuery,
  useGetTaskListsQuery,
  useGetTaskListsV2Query,
  useGetTasksQuery,
  useGetToursQuery,
  useSetTourItemsMutation,
  useSetTaskListItemsMutation,
  useSubscriptionGenerateOrdersMutation,
  useUpdateOrderMutation,
  usePostIncidentMutation,
  useRecurrenceRulesGenerateOrdersMutation,
} = apiSlice;

export const clearApiState = apiSlice.util.resetApiState;
