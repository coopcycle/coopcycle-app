import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './baseQuery';
import { sortByName, sortByString } from '../util';
import { fetchAllRecordsUsingFetchWithBQ } from './utils';
import { DateOnlyString } from '../../utils/date-types';
import { Task } from '../../types/task';
import {
  Address,
  FailureReason,
  HolidayRequest,
  HolidayRequestPayload,
  HydraCollection,
  PaymentMethodsOutput,
  PricingRuleSet,
  RestaurantTiming,
  PutDeliveryBody,
  Shift,
  ShiftActivity,
  Shop,
  ShopCuisine,
  ShopCuisinesResource,
  ShopFilter,
  ShopFiltersResource,
  Store,
  StorePackage,
  StoreTimeSlot,
  TimeSlot,
  TimeSlotChoices,
  Uri,
  Warehouse,
} from './types';

// How many shops one collection row holds. The rows are teasers, so this is
// about what a customer will swipe through, not about showing everything.
const SHOPS_PER_COLLECTION = 20;

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'MyTasks',
    'ShiftActivities',
    'MyShifts',
    'OpenShifts',
    'MyHolidayRequests',
  ],
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
    /**
     * @deprecated Replaces the whole list, so a task the payload leaves out is
     *   unassigned — and a client that has simply not heard of a task sends
     *   exactly what one deliberately removing it sends. Kept only for
     *   instances that predate the items endpoints below; see
     *   `supportsTaskListItemsApi`.
     *
     * @see https://github.com/coopcycle/coopcycle-web/issues/5372
     */
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
    /**
     * Open a courier's task list for a day, handing back the one that is
     * already there if it exists. Idempotent, so it is safe to call before an
     * assignment rather than tracking whether the list has been created.
     */
    createTaskList: builder.mutation({
      query: ({ courier, date }: { courier: Uri; date: DateOnlyString }) => ({
        url: '/api/task_lists',
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({ courier, date }),
      }),
    }),
    /**
     * Put tasks and tours on a list, naming them, and leave the rest alone.
     *
     * Items already held by another courier are moved, not duplicated.
     * `position` appends when absent, which is what the app wants: it has no
     * ordering UI, so it should never claim a place in the list.
     */
    addTaskListItems: builder.mutation({
      query: ({
        taskListUrl,
        items,
        position = null,
      }: {
        taskListUrl: Uri;
        items: string[];
        position?: number | null;
      }) => ({
        url: `${taskListUrl}/items`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({ items, position }),
      }),
    }),
    /**
     * Take named tasks and tours off a list, and unassign them.
     *
     * One request for the whole batch: removing an item renumbers the ones
     * that remain, so several concurrent single removals contend for the same
     * rows. Items that are not on the list are ignored.
     */
    removeTaskListItems: builder.mutation({
      query: ({
        taskListUrl,
        items,
      }: {
        taskListUrl: Uri;
        items: string[];
      }) => ({
        url: `${taskListUrl}/items/remove`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({ items }),
      }),
    }),
    /**
     * Reorder a task list, without changing which items are on it.
     *
     * The one whole-list write that survives the split, because ordering is
     * the one thing that genuinely has to be expressed as a whole. It is safe
     * because the API refuses any payload that would add or drop an item, and
     * because `If-Match` is mandatory here — a reorder built from a list that
     * has since changed is answered with 409 rather than applied.
     *
     * `items` is every item currently on the list, tasks and tours alike, in
     * the wanted order.
     *
     * @see https://github.com/coopcycle/coopcycle-web/issues/5372
     */
    setTaskListOrder: builder.mutation({
      query: ({
        taskListUrl,
        items,
        version,
      }: {
        taskListUrl: Uri;
        items: string[];
        version: number;
      }) => ({
        url: `${taskListUrl}/order`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
          'If-Match': `"${version}"`,
        },
        body: JSON.stringify({ items }),
      }),
    }),
    /**
     * A tour is replaced wholesale, so this drops every task it does not
     * mention — the same shape of write as `set_items`, against the other
     * collection. `version` is the tour's, as it was read; sending it as
     * `If-Match` has the API refuse a write built from a tour that has since
     * changed, instead of letting it quietly win.
     *
     * Optional, because instances that predate tour versioning serve no
     * version to send. There the write stays last-one-wins.
     *
     * @see https://github.com/coopcycle/coopcycle-web/issues/5372
     */
    setTourItems: builder.mutation({
      query: ({ tourUrl, tourTasks, version }) => {
        const mutation = {
          url: tourUrl,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/ld+json',
            ...(version === undefined || version === null
              ? {}
              : { 'If-Match': `"${version}"` }),
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
    getWarehouses: builder.query<Warehouse[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchAllRecordsUsingFetchWithBQ<Warehouse>(
          fetchWithBQ,
          '/api/warehouses',
          100,
        );

        if (result.error) {
          return result;
        }
        return { data: sortByName(result.data) };
      },
    }),
    // Relays the selected tasks through a warehouse: the backend resolves each
    // task to its (pickup, dropoff) pair and inserts two hub tasks per pair.
    // It answers with the original *and* the created tasks.
    relayTasksToWarehouse: builder.mutation<
      { tasks: Task[] },
      { warehouse: Uri; tasks: Uri[] }
    >({
      query: ({ warehouse, tasks }) => ({
        url: `${warehouse}/relay`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json',
        },
        body: JSON.stringify({ tasks }),
      }),
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
    getStorePaymentMethods: builder.query<PaymentMethodsOutput, Uri>({
      query: (uri: Uri) => `${uri}/payment_methods`,
    }),
    getPricingRuleSet: builder.query<PricingRuleSet, Uri>({
      query: (uri: string) => uri,
    }),
    // Which collections to show, and what to call them, is decided server
    // side: the same list drives the website's /shops page, so the two cannot
    // drift apart, and the labels come back already translated.
    getShopFilters: builder.query<ShopFilter[], void>({
      query: () => 'api/shop_filters',
      transformResponse: (response: ShopFiltersResource) =>
        response.filters ?? [],
    }),
    // The cuisines to offer above the shops list, with their icons, in the
    // order they should be shown. Same source as the website's /shops strip,
    // so the two cannot drift apart.
    getShopCuisines: builder.query<ShopCuisine[], void>({
      query: () => 'api/shop_cuisines',
      transformResponse: (response: ShopCuisinesResource) =>
        response.cuisines ?? [],
    }),
    // The shops behind one filter, regardless of the delivery address: the
    // collections are meant to give an overview of what is on offer, not of
    // what happens to deliver to the address the customer picked. Each shop's
    // timing is fetched separately, by the card that displays it.
    //
    // Only the first page: a collection is a horizontal teaser row, not a
    // browsable list, so there is nothing to scroll the rest into view with.
    getShopsByFilter: builder.query<Shop[], ShopFilter>({
      query: ({ filter, value }) => {
        const params = new URLSearchParams({
          pagination: 'true',
          page: '1',
          itemsPerPage: SHOPS_PER_COLLECTION.toString(),
          [filter]: value,
        });

        return `api/restaurants?${params.toString()}`;
      },
      transformResponse: (response: HydraCollection<Shop>) =>
        response['hydra:member'] ?? [],
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
      // `tours=1` asks the server to nest tours instead of flattening them into
      // bare tasks. Older instances simply ignore the parameter and answer with
      // the flat list, which `splitTaskListItems` handles as the no-tour case —
      // so this is safe to send unconditionally.
      query: (date: DateOnlyString) => `api/me/tasks/${date}?tours=1`,
      providesTags: ['MyTasks'],
    }),
    getTaskContext: builder.query({
      query: id => `api/tasks/${id}/context`,
    }),
    getTaskFailureReasons: builder.query<HydraCollection<FailureReason>, Uri>({
      query: (taskUri: Uri) => `${taskUri}/failure_reasons`,
    }),
    getTaskDeliveryFormData: builder.query<PutDeliveryBody, number>({
      query: id => `api/tasks/${id}/delivery_form_data`,
    }),
    getOrderTiming: builder.query({
      query: nodeId => `${nodeId}/timing`,
    }),
    // One shop's next slots. Cards ask for this as they scroll into view.
    getRestaurantTiming: builder.query<RestaurantTiming, Uri>({
      query: (nodeId: Uri) => `${nodeId}/timing`,
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
    getShiftActivities: builder.query<ShiftActivity[], void>({
      query: () => 'api/shift_activities',
      transformResponse: (response: HydraCollection<ShiftActivity>) =>
        response['hydra:member'],
      providesTags: ['ShiftActivities'],
    }),
    getMyShifts: builder.query<
      Shift[],
      { after: DateOnlyString; before: DateOnlyString }
    >({
      query: ({ after, before }) =>
        `api/me/shifts?date[after]=${after}&date[before]=${before}`,
      transformResponse: (response: HydraCollection<Shift>) =>
        response['hydra:member'],
      providesTags: ['MyShifts'],
    }),
    getOpenShifts: builder.query<
      Shift[],
      { after: DateOnlyString; before: DateOnlyString }
    >({
      query: ({ after, before }) =>
        `api/shifts/open?date[after]=${after}&date[before]=${before}`,
      transformResponse: (response: HydraCollection<Shift>) =>
        response['hydra:member'],
      providesTags: ['OpenShifts'],
    }),
    applyToShift: builder.mutation<Shift, Uri>({
      query: (shiftUri: Uri) => ({
        url: `${shiftUri}/apply`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json',
        },
        body: JSON.stringify({}),
      }),
      invalidatesTags: ['MyShifts', 'OpenShifts'],
    }),
    unapplyFromShift: builder.mutation<Shift, Uri>({
      query: (shiftUri: Uri) => ({
        url: `${shiftUri}/unapply`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json',
        },
        body: JSON.stringify({}),
      }),
      invalidatesTags: ['MyShifts', 'OpenShifts'],
    }),
    getMyHolidayRequests: builder.query<
      HolidayRequest[],
      { after: DateOnlyString; before: DateOnlyString } | void
    >({
      // The range is optional, and honoured only by instances that support it:
      // /api/me/holiday_requests has a custom provider, so an older backend
      // ignores these params and answers with the courier's whole history.
      // Consumers filter the result again client-side — see
      // `filterHolidayRequestsByWeek`.
      query: range =>
        range
          ? `api/me/holiday_requests?date[after]=${range.after}&date[before]=${range.before}`
          : 'api/me/holiday_requests',
      transformResponse: (response: HydraCollection<HolidayRequest>) =>
        response['hydra:member'],
      providesTags: ['MyHolidayRequests'],
    }),
    postHolidayRequest: builder.mutation<
      HolidayRequest,
      HolidayRequestPayload
    >({
      query: (payload: HolidayRequestPayload) => ({
        url: 'api/holiday_requests',
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json',
        },
        body: JSON.stringify(payload),
      }),
      invalidatesTags: ['MyHolidayRequests'],
    }),
    deleteHolidayRequest: builder.mutation<void, Uri>({
      query: (uri: Uri) => ({
        url: uri,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyHolidayRequests'],
    }),
  }),
});

// Export the auto-generated hook for the query endpoints
export const {
  useGetCourierUsersQuery,
  useGetMyTasksQuery,
  useGetTaskContextQuery,
  useGetTaskFailureReasonsQuery,
  useGetTaskDeliveryFormDataQuery,
  useGetOrderTimingQuery,
  useGetStoresQuery,
  useGetTimeSlotsQuery,
  useGetTimeSlotChoicesQuery,
  useGetStoreQuery,
  useGetStoreAddressesQuery,
  useGetStoreTimeSlotsQuery,
  useGetStorePackagesQuery,
  useGetStorePaymentMethodsQuery,
  useGetPricingRuleSetQuery,
  useGetTagsQuery,
  useGetWarehousesQuery,
  useRelayTasksToWarehouseMutation,
  useGetRestaurantsQuery,
  useGetRestaurantTimingQuery,
  useGetShopCuisinesQuery,
  useGetShopFiltersQuery,
  useGetShopsByFilterQuery,
  useGetTaskListsQuery,
  useGetTaskListsV2Query,
  useGetTasksQuery,
  useGetToursQuery,
  useSetTourItemsMutation,
  useSetTaskListItemsMutation,
  useCreateTaskListMutation,
  useAddTaskListItemsMutation,
  useRemoveTaskListItemsMutation,
  useSetTaskListOrderMutation,
  useSubscriptionGenerateOrdersMutation,
  useUpdateOrderMutation,
  usePostIncidentMutation,
  useRecurrenceRulesGenerateOrdersMutation,
  useGetShiftActivitiesQuery,
  useGetMyShiftsQuery,
  useGetOpenShiftsQuery,
  useApplyToShiftMutation,
  useUnapplyFromShiftMutation,
  useGetMyHolidayRequestsQuery,
  usePostHolidayRequestMutation,
  useDeleteHolidayRequestMutation,
} = apiSlice;

export const clearApiState = apiSlice.util.resetApiState;
